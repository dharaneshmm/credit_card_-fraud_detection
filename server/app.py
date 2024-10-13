import logging
import matplotlib.pyplot as plt
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from io import BytesIO
import pandas as pd
from typing import List
import joblib
import base64
from sklearn.metrics import accuracy_score
from pydantic import BaseModel
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize scaler and load the pre-trained model
scaler = joblib.load('scaler.pkl')  # Load the pre-fitted scaler
model = joblib.load('model.pkl')  # Load the pre-trained model

# Serve the React build folder as static files
app.mount("/static", StaticFiles(directory="build/static"), name="static")


@app.get("/")
async def read_index():
    """ Serve the main index file for the React app. """
    return FileResponse("build/index.html")


@app.post('/upload-dataset')
async def upload_dataset(file: UploadFile = File(...)):
    """
    Endpoint to upload a dataset in CSV or Excel format.
    The dataset is temporarily stored in memory and previewed.
    """
    try:
        if file.content_type == 'text/csv':
            contents = await file.read()
            df = pd.read_csv(BytesIO(contents))
        elif file.content_type in ['application/vnd.ms-excel',
                                   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
            contents = await file.read()
            df = pd.read_excel(BytesIO(contents))
        else:
            return JSONResponse({"error": "Unsupported file format. Please upload a CSV or Excel file."},
                                status_code=400)

        # Save the dataframe in memory (can be moved to persistent storage if needed)
        df.to_csv('creditcard.csv', index=False)

        # Preview the first 5 rows of the dataset
        preview = df.head().to_dict(orient='records')

        return JSONResponse({"preview": preview})
    except Exception as e:
        logger.error(f"Error during file upload: {str(e)}")
        return JSONResponse({"error": f"An error occurred during file upload: {str(e)}"}, status_code=500)


class AnalysisResponse(BaseModel):
    algorithm_used: str
    accuracy: float
    fraud_count: int
    non_fraud_count: int
    total_amount: float
    chart_url: str


@app.post("/analyze-fraud", response_model=AnalysisResponse)
async def analyze_fraud(file: UploadFile = File(...)):
    try:
        # Read the uploaded file
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))

        # Data analysis
        fraud_count = df['Class'].sum()
        non_fraud_count = len(df) - fraud_count
        total_amount = df['Amount'].sum()  # Assuming 'Amount' column exists

        # Prepare data for modeling
        X = df.drop(columns=['Class'])
        y = df['Class']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Logistic Regression Model
        model = LogisticRegression()
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred) * 100

        # Generate bar chart
        fig, ax = plt.subplots()
        ax.bar(['Fraud', 'Non-Fraud'], [fraud_count, non_fraud_count], color=['red', 'blue'])
        ax.set_xlabel('Transaction Type')
        ax.set_ylabel('Count')
        ax.set_title('Fraud vs Non-Fraud Transactions')

        # Save plot to a bytes buffer
        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        chart_url = base64.b64encode(buf.read()).decode('utf-8')
        buf.close()

        return AnalysisResponse(
            algorithm_used='Logistic Regression',
            accuracy=accuracy,
            fraud_count=fraud_count,
            non_fraud_count=non_fraud_count,
            total_amount=total_amount,
            chart_url=f'data:image/png;base64,{chart_url}'
        )

    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        return JSONResponse(status_code=500, content={"message": f"An error occurred: {str(e)}"})


@app.post("/columns")
async def handle_columns(data: BaseModel):
    try:
        # Handle the columns data
        return {"message": "Columns received"}
    except Exception as e:
        logger.error(f"Error during columns handling: {str(e)}")
        return JSONResponse(status_code=500, content={"message": f"An error occurred: {str(e)}"})


@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    try:
        # Read the uploaded CSV or Excel file
        contents = await file.read()
        file_extension = file.filename.split('.')[-1].lower()

        if file_extension == 'csv':
            df = pd.read_csv(BytesIO(contents))
        elif file_extension in ['xlsx', 'xls']:
            df = pd.read_excel(BytesIO(contents))
        else:
            return JSONResponse(content={"error": "Unsupported file format."}, status_code=400)

        # Ensure the required columns are present
        required_columns = ['Time'] + [f'V{i}' for i in range(1, 29)] + ['Amount']
        if not set(required_columns).issubset(df.columns):
            return JSONResponse(content={"error": "CSV file is missing required columns."}, status_code=400)

        # Extract features and preprocess
        X = df[required_columns]
        X_scaled = scaler.transform(X)  # Scale features

        # Predict using the model
        predictions = model.predict(X_scaled)

        # Map predictions to fraud/not fraud (adjust this mapping as necessary)
        result = ["Fraud" if p == 1 else "Not Fraud" for p in predictions]

        return JSONResponse(content={"predictions": result})
    except Exception as e:
        logger.error(f"Error during prediction file processing: {str(e)}")
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/predict-inputs")
async def predict_inputs(request: Request):
    try:
        data = await request.form()
        time = float(data.get('time'))
        amount = float(data.get('amount'))
        v_values = [float(data.get(f'v{i}')) for i in range(1, 29)]

        # Collect all inputs into a DataFrame
        inputs = [[time] + v_values + [amount]]
        df = pd.DataFrame(inputs, columns=['time'] + [f'V{i}' for i in range(1, 29)] + ['amount'])
        X_scaled = scaler.transform(df)  # Scale features

        # Predict using the model
        prediction = model.predict(X_scaled)

        # Map prediction to fraud/not fraud (adjust this mapping as necessary)
        result = "Fraud" if prediction[0] == 1 else "Not Fraud"

        return JSONResponse(content={"predictions": [result]})
    except Exception as e:
        logger.error(f"Error during prediction input processing: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host='localhost', port=8009)
