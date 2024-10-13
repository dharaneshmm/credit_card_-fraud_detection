import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, Spinner, Table } from 'react-bootstrap'; // Import Table here
import '../Styles/prediction.css'; // Import your CSS file

const PredictionPage = () => {
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [fraudResults, setFraudResults] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'csv'].includes(fileExtension)) {
            setFileError('Invalid file format. Please upload an Excel or CSV file.');
            setFile(null);
            return;
        }

        setFileError('');
        setFile(uploadedFile);
    };

    const handleClear = () => {
        setFile(null);
        setFileError('');
        setFraudResults([]);
        setError('');
        setLoading(false);

        // Clear the file input field
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePredictFile = () => {
        if (!file) {
            setError('Please upload the dataset.');
            return;
        }

        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://localhost:8009/predict-file', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(response => {
            setFraudResults(response.data.predictions);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error during prediction:', error);
            setError('Error performing prediction with file. Please try again.');
            setLoading(false);
        });
    };

    return (
        <div className="prediction-container">
            <Container>
                <h1 className="text-center">Credit Card Fraud Detection</h1>

                <Row className="mb-4 justify-content-center">
                    <Col md={8}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label className="text-white"><strong>Upload Fraud Detection Dataset (Excel or CSV)</strong></Form.Label>
                            <Form.Control
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                className="file-upload-field"
                            />
                            {fileError && <Alert variant="danger" className="mt-2">{fileError}</Alert>}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Button to predict with the uploaded file */}
                <Row className="button-container mb-4 justify-content-center">
                    <Col md={8} className="text-center">
                        <Button
                            variant="primary"
                            onClick={handlePredictFile}
                            className="btn-primary"
                            disabled={!file || loading}
                        >
                            {loading ? 'Loading...' : 'Predict with Uploaded File'}
                        </Button>
                    </Col>
                </Row>

                {loading && <Spinner animation="border" className="d-block mx-auto" />}
                {error && <Alert variant="danger" className="mt-2 text-center">{error}</Alert>}

                {fraudResults.length > 0 && (
                    <Row className="mt-4 justify-content-center">
                        <Col md={6} className="text-center">
                            <div className="table-container">
                                <Table striped bordered hover size="sm" variant="dark" className="result-table">
                                    <thead>
                                        <tr>
                                            <th>Index</th>
                                            <th>Prediction</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fraudResults.map((result, index) => (
                                            <tr key={index}>
                                                <td>{index}</td>
                                                <td>{result}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                )}

                {fraudResults.length > 0 && (
                    <Row className="mt-3 justify-content-center">
                        <Col md={8} className="text-center">
                            <Button variant="primary" className="btn-clear" onClick={handleClear}>Clear</Button>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default PredictionPage;
