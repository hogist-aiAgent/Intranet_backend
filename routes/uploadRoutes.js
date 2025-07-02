const multer = require('multer');
const express = require('express');
const { uploadPdf } = require('../controllers/uploadControllers'); // CommonJS require
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed!'));
    }
  }
});


router.post('/upload', upload.single('file'), uploadPdf);

module.exports = router; 
