import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import '../Styles/analysis.css';

const CHUNK_SIZE = 1024 * 1024 * 2; // 2MB per chunk
const PREVIEW_ROW_LIMIT = 100;

const AnalysisPage = () => {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [fileError, setFileError] = useState('');
    const [algorithmUsed, setAlgorithmUsed] = useState('');
    const [accuracy, setAccuracy] = useState(0);
    const [fraudCount, setFraudCount] = useState(0);
    const [nonFraudCount, setNonFraudCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [chartUrl, setChartUrl] = useState('');
    const [analysisPerformed, setAnalysisPerformed] = useState(false);

    const [rowCount, setRowCount] = useState(0);
    const [columnCount, setColumnCount] = useState(0);
    const [hasNullValues, setHasNullValues] = useState(false);

    const fileInputRef = useRef(null); // Ref for the file input element

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'csv'].includes(fileExtension)) {
            setFileError('Invalid file format. Please upload an Excel or CSV file.');
            setFile(null);
            setPreviewData([]);
            return;
        }

        setFileError('');
        setFile(uploadedFile);
        processFileForPreview(uploadedFile, fileExtension);
    };

    const handleClear = () => {
        setFile(null);
        setPreviewData([]);
        setFileError('');
        setAlgorithmUsed('');
        setAccuracy(0);
        setFraudCount(0);
        setNonFraudCount(0);
        setTotalAmount(0);
        setError('');
        setLoading(false);
        setChartUrl('');
        setAnalysisPerformed(false);
        setRowCount(0);
        setColumnCount(0);
        setHasNullValues(false);

        // Clear the file input field
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const processFileForPreview = (file, fileExtension) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;
            let workbook;

            try {
                workbook = XLSX.read(data, { type: fileExtension === 'csv' ? 'binary' : 'array' });
            } catch (error) {
                console.error('Error reading file:', error);
                setFileError('Error reading the file. Please ensure it is a valid Excel or CSV file.');
                setPreviewData([]);
                return;
            }

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length === 0) {
                setFileError('The uploaded file is empty.');
                setPreviewData([]);
                return;
            }

            const limitedData = jsonData.slice(0, PREVIEW_ROW_LIMIT);

            setPreviewData(limitedData);
            setRowCount(jsonData.length - 1); // Set rowCount to the number of rows
            setColumnCount(jsonData[0].length); // Set columnCount to the number of columns

            const hasNull = jsonData.some(row => row.some(cell => cell === null || cell === ''));
            setHasNullValues(hasNull); // Set hasNullValues to indicate if there are any null values
        };

        if (fileExtension === 'csv') {
            reader.readAsBinaryString(file.slice(0, CHUNK_SIZE));
        } else {
            reader.readAsArrayBuffer(file.slice(0, CHUNK_SIZE));
        }
    };

    const handleAnalyze = () => {
        if (!file) {
            setError('Please upload a fraud detection dataset.');
            return;
        }

        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://localhost:8009/analyze-fraud', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            const { algorithm_used, accuracy, fraud_count, non_fraud_count, total_amount, chart_url } = response.data;

            setAlgorithmUsed(algorithm_used || 'Logistic Regression');
            setAccuracy(accuracy || 'N/A');
            setFraudCount(fraud_count || 0);
            setNonFraudCount(non_fraud_count || 0);
            setTotalAmount(total_amount || 0);
            setChartUrl(chart_url || '');
            setLoading(false);
            setAnalysisPerformed(true);
        })
        .catch(error => {
            console.error('Error during analysis:', error);
            setError('Error performing analysis. Please ensure the dataset is correctly formatted and try again.');
            setLoading(false);
        });
    };

    return (
        <div className="analysis-container">
            <h1 className="text-center mb-4">Credit Card Fraud Detection Analysis</h1>

            <div className="file-upload-section">
                <label htmlFor="fileUpload" className="text-white"><strong>Upload Fraud Detection Dataset (Excel or CSV)</strong></label>
                <input
                    id="fileUpload"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="upload-field"
                    ref={fileInputRef} // Attach the ref to the file input
                />
                {fileError && <Alert variant="danger" className="mt-2 text-white">{fileError}</Alert>}
            </div>

            {previewData.length > 0 && (
                <div className="data-preview-section">
                    <h4 className="text-white">Data Preview:</h4>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    {previewData[0].map((header, idx) => (
                                        <th key={idx}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.slice(1, PREVIEW_ROW_LIMIT).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                                {previewData.length > PREVIEW_ROW_LIMIT && (
                                    <tr>
                                        <td colSpan={previewData[0].length}>...and more rows</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                    <div className="text-white">
                        <p><strong>Row Count:</strong> {rowCount}</p>
                        <p><strong>Column Count:</strong> {columnCount}</p>
                        <p><strong>Contains Null Values:</strong> {hasNullValues ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            )}

            <div className="analysis-controls">
                <Button variant="primary" onClick={handleAnalyze} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Analyze'}
                </Button>
                {error && <Alert variant="danger" className="mt-2 text-white">{error}</Alert>}
                {analysisPerformed && (
                    <Button variant="secondary" onClick={handleClear} className="ms-2 btn-clear">
                        Clear
                    </Button>
                )}
            </div>

            {analysisPerformed && (
                <div className="analysis-results">
                    <h4 className="text-white">Analysis Results:</h4>
                    <div className="text-white">
                        <p><strong>Algorithm Used:</strong> {algorithmUsed}</p>
                        <p><strong>Accuracy:</strong> {accuracy}</p>
                        <p><strong>Fraud Count:</strong> {fraudCount}</p>
                        <p><strong>Non-Fraud Count:</strong> {nonFraudCount}</p>
                        <p><strong>Total Amount:</strong> {totalAmount}</p>
                    </div>
                    {chartUrl && (
                        <div className="chart-section">
                            <img src={chartUrl} alt="Analysis Chart" className="img-fluid" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnalysisPage;
