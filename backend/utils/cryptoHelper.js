const crypto = require('crypto');

function generatePDFHash(fileBuffer) {
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest();
}

function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return { publicKey, privateKey };
}

function signHash(hashBuffer, privateKeyPem) {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(hashBuffer);
    sign.end();
    return sign.sign(privateKeyPem, 'base64');
}

function verifySignature(hashBuffer, signatureBase64, publicKeyPem) {
    try {
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(hashBuffer);
        verify.end();
        return verify.verify(publicKeyPem, signatureBase64.trim(), 'base64');
    } catch (err) {
        console.error('Verification error:', err);
        return false;
    }
}

module.exports = {
    generatePDFHash,
    generateKeyPair,
    signHash,
    verifySignature
};
