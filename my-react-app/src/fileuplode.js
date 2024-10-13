import React from 'react';
import axios from 'axios';

class FileUpload extends React.Component {
    handleFileUpload = async (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        const chunkSize = 1024 * 1024 * 2; // 2MB per chunk
        const totalChunks = Math.ceil(uploadedFile.size / chunkSize);

        const uploadChunk = async (chunk, start, end, index) => {
            const formData = new FormData();
            formData.append('file', chunk, `chunk-${index}`);
            formData.append('start', start);
            formData.append('end', end);

            await axios.post('http://localhost:8009/upload-chunk', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        };

        let start = 0;
        let end = chunkSize;
        for (let i = 0; i < totalChunks; i++) {
            const chunk = uploadedFile.slice(start, end);
            await uploadChunk(chunk, start, end, i);
            start = end;
            end = start + chunkSize;
        }

        // Notify server that all chunks have been uploaded
        await axios.post('http://localhost:8009/complete-upload');
    };

    render() {
        return (
            <input type="file" onChange={this.handleFileUpload} />
        );
    }
}

export default FileUpload;
