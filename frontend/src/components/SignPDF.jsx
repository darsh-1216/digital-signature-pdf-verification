import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle, Download, AlertCircle, FileKey2 } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../api';

const SignPDF = () => {
    const [file, setFile] = useState(null);
    const [privateKeyFile, setPrivateKeyFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const privateKeyInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
            setError(null);
        }
    };

    const handleSign = async () => {
        if (!file || !privateKeyFile) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('privateKey', privateKeyFile);

        try {
            const response = await axios.post(apiUrl('/api/sign'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResult({
                message: response.data.message,
                signature: response.data.signature,
                fileName: response.data.fileName
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to sign the document.');
        } finally {
            setIsLoading(false);
        }
    };

    const downloadSignature = () => {
        if (!result) return;
        const blob = new Blob([result.signature], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.fileName}.sig`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <section className="tool-panel">
            <div className="section-header">
                <h2>Sign Document (Sender)</h2>
            </div>

            <div className="file-input-wrapper">
                <label className="file-input-label">Upload PDF</label>
                <div 
                    className="file-input-box" 
                    onClick={() => fileInputRef.current.click()}
                >
                    <input 
                        type="file" 
                        accept="application/pdf" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                    />
                    {file ? (
                        <div className="selected-file">
                            <FileText size={22} color="var(--primary)" />
                            <span>{file.name}</span>
                        </div>
                    ) : (
                        <div className="selected-file muted">
                            <UploadCloud size={22} />
                            <span>Select PDF file</span>
                        </div>
                    )}
                </div>

                <label className="file-input-label">Upload Private Key (.pem)</label>
                <div 
                    className="file-input-box" 
                    onClick={() => privateKeyInputRef.current.click()}
                >
                    <input 
                        type="file" 
                        accept=".pem" 
                        ref={privateKeyInputRef} 
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                setPrivateKeyFile(e.target.files[0]);
                                setResult(null);
                                setError(null);
                            }
                        }} 
                    />
                    {privateKeyFile ? (
                        <div className="selected-file">
                            <FileKey2 size={22} color="var(--primary)" />
                            <span>{privateKeyFile.name}</span>
                        </div>
                    ) : (
                        <div className="selected-file muted">
                            <UploadCloud size={22} />
                            <span>Select private key file</span>
                        </div>
                    )}
                </div>
            </div>

            <button 
                className="btn-primary" 
                disabled={!file || !privateKeyFile || isLoading}
                onClick={handleSign}
            >
                {isLoading ? (
                    <><Loader2 className="animate-spin" /> Processing...</>
                ) : (
                    'Generate Signature'
                )}
            </button>

            {error && (
                <div className="alert danger">
                    <AlertCircle />
                    {error}
                </div>
            )}

            {result && (
                <div className="result-card">
                    <div className="result-title">
                        <CheckCircle />
                        <strong>Signature generated</strong>
                    </div>
                    <div className="download-actions">
                        <button className="btn-secondary" onClick={downloadSignature}>
                            <Download size={18} /> Download Signature
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SignPDF;
