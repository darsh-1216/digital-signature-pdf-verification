const cryptoHelper = require('../utils/cryptoHelper');

exports.generateKeys = (req, res) => {
    try {
        const { publicKey, privateKey } = cryptoHelper.generateKeyPair();

        res.json({
            publicKey,
            privateKey
        });
    } catch (error) {
        console.error('Key generation error:', error);
        res.status(500).json({ error: 'Internal server error during key generation.' });
    }
};

exports.signPDF = (req, res) => {
    try {
        const pdfFile = req.files?.['pdf'] ? req.files['pdf'][0] : null;
        const privateKeyFile = req.files?.['privateKey'] ? req.files['privateKey'][0] : null;

        if (!pdfFile || !privateKeyFile) {
            return res.status(400).json({ error: 'PDF and private key are required.' });
        }

        const hashBuffer = cryptoHelper.generatePDFHash(pdfFile.buffer);
        // Private key must remain confidential.
        const privateKeyPem = privateKeyFile.buffer.toString('utf8');
        const signatureBase64 = cryptoHelper.signHash(hashBuffer, privateKeyPem);

        res.json({
            message: 'PDF signed successfully.',
            signature: signatureBase64,
            fileName: pdfFile.originalname
        });
    } catch (error) {
        console.error('Signing error:', error);
        res.status(500).json({ error: 'Internal server error during signing.' });
    }
};

exports.verifyPDF = (req, res) => {
    try {
        const pdfFile = req.files && req.files['pdf'] ? req.files['pdf'][0] : null;
        let signatureFile = req.files && req.files['signature'] ? req.files['signature'][0] : null;
        const publicKeyFile = req.files?.['publicKey'] ? req.files['publicKey'][0] : null;

        if (!pdfFile || !signatureFile || !publicKeyFile) {
            return res.status(400).json({ error: 'PDF, signature, and public key are required.' });
        }

        const hashBuffer = cryptoHelper.generatePDFHash(pdfFile.buffer);
        const signatureBase64 = signatureFile.buffer.toString('utf8');
        const publicKeyPem = publicKeyFile.buffer.toString('utf8');
        const isValid = cryptoHelper.verifySignature(hashBuffer, signatureBase64, publicKeyPem);

        res.json({
            valid: isValid,
            message: isValid ? 'Valid Signature' : 'File Tampered or Invalid Signature'
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Internal server error during verification.' });
    }
};
