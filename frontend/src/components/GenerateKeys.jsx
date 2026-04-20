import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Download, KeyRound, Loader2 } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../api';

const GenerateKeys = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [keys, setKeys] = useState(null);
    const [error, setError] = useState(null);

    const downloadFile = (content, fileName) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setKeys(null);

        try {
            const response = await axios.get(apiUrl('/api/keys'));
            setKeys({
                publicKey: response.data.publicKey,
                privateKey: response.data.privateKey
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate key pair.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="tool-panel">
            <div className="section-header">
                <h2>Generate Key Pair</h2>
            </div>

            <button
                className="btn-primary"
                disabled={isLoading}
                onClick={handleGenerate}
            >
                {isLoading ? (
                    <><Loader2 className="animate-spin" /> Processing...</>
                ) : (
                    <><KeyRound size={18} /> Generate Key Pair</>
                )}
            </button>

            {error && (
                <div className="alert danger">
                    <AlertCircle />
                    {error}
                </div>
            )}

            {keys && (
                <div className="result-card">
                    <div className="result-title">
                        <CheckCircle />
                        <strong>Keys generated</strong>
                    </div>
                    <div className="download-actions">
                        <button className="btn-secondary" onClick={() => downloadFile(keys.privateKey, 'private_key.pem')}>
                            <Download size={18} /> Download Private Key
                        </button>
                        <button className="btn-secondary" onClick={() => downloadFile(keys.publicKey, 'public_key.pem')}>
                            <Download size={18} /> Download Public Key
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default GenerateKeys;
