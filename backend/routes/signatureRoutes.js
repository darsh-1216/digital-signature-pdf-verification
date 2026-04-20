const express = require('express');
const multer = require('multer');
const signatureController = require('../controllers/signatureController');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/keys', signatureController.generateKeys);
router.post('/sign', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'privateKey', maxCount: 1 }]), signatureController.signPDF);
router.post('/verify', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'signature', maxCount: 1 }, { name: 'publicKey', maxCount: 1 }]), signatureController.verifyPDF);

module.exports = router;
