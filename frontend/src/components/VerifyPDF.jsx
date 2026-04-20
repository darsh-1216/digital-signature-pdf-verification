import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle, AlertOctagon, FileKey2 } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../api';

const VerifyPDF = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [sigFile, setSigFile] = useState(null);
    const [pubKeyFile, setPubKeyFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const pdfInputRef = useRef(null);
    const sigInputRef = useRef(null);
    const pubKeyInputRef = useRef(null);

    const handleVerify = async () => {
        if (!pdfFile || !sigFile || !pubKeyFile) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('signature', sigFile);
        formData.append('publicKey', pubKeyFile);

        try {
            const response = await axios.post(apiUrl('/api/verify'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResult({
                valid: response.data.valid,
                message: response.data.message
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to verify the document.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="tool-panel">
            <div className="section-header">
                <h2>Verify Document (Receiver)</h2>
            </div>

            <div className="file-input-wrapper">
                <label className="file-input-label">Upload PDF</label>
                <div 
                    className="file-input-box" 
                    onClick={() => pdfInputRef.current.click()}
                >
                    <input 
                        type="file" 
                        accept="application/pdf" 
                        ref={pdfInputRef} 
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                setPdfFile(e.target.files[0]);
                                setResult(null);
                            }
                        }} 
                    />
                    {pdfFile ? (
                        <div className="selected-file">
                            <FileText size={24} color="var(--primary)" />
                            <span>{pdfFile.name}</span>
                        </div>
                    ) : (
                        <div className="selected-file muted">
                            <UploadCloud size={24} />
                            <span>Select PDF file</span>
                        </div>
                    )}
                </div>

                <label className="file-input-label">Upload Signature (.sig)</label>
                <div 
                    className="file-input-box" 
                    onClick={() => sigInputRef.current.click()}
                >
                    <input 
                        type="file" 
                        accept=".sig" 
                        ref={sigInputRef} 
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                setSigFile(e.target.files[0]);
                                setResult(null);
                            }
                        }} 
                    />
                    {sigFile ? (
                        <div className="selected-file">
                            <FileKey2 size={24} color="var(--primary)" />
                            <span>{sigFile.name}</span>
                        </div>
                    ) : (
                        <div className="selected-file muted">
                            <UploadCloud size={24} />
                            <span>Select signature file</span>
                        </div>
                    )}
                </div>

                <label className="file-input-label">Upload Public Key (.pem)</label>
                <div 
                    className="file-input-box" 
                    onClick={() => pubKeyInputRef.current.click()}
                >
                    <input 
                        type="file" 
                        accept=".pem" 
                        ref={pubKeyInputRef} 
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                setPubKeyFile(e.target.files[0]);
                                setResult(null);
                            }
                        }} 
                    />
                    {pubKeyFile ? (
                        <div className="selected-file">
                            <FileKey2 size={24} color="var(--primary)" />
                            <span>{pubKeyFile.name}</span>
                        </div>
                    ) : (
                        <div className="selected-file muted">
                            <UploadCloud size={24} />
                            <span>Select public key file</span>
                        </div>
                    )}
                </div>
            </div>

            <button 
                className="btn-primary" 
                disabled={!pdfFile || !sigFile || !pubKeyFile || isLoading}
                onClick={handleVerify}
            >
                {isLoading ? (
                    <><Loader2 className="animate-spin" /> Verifying...</>
                ) : (
                    'Verify Signature'
                )}
            </button>

            {error && (
                <div className="alert danger">
                    <AlertOctagon />
                    {error}
                </div>
            )}

            {result && (
                <div className={`alert ${result.valid ? 'success' : 'danger'}`}>
                    {result.valid ? <CheckCircle /> : <AlertOctagon />}
                    <strong>{result.valid ? 'Valid Signature' : 'File Tampered or Invalid Signature'}</strong>
                </div>
            )}
        </section>
    );
};

export default VerifyPDF;
