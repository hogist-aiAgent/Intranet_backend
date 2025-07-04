const multer = require('multer');
const express = require('express');
const { uploadPdf,uploadImage } = require('../controllers/uploadControllers'); 
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


router.post('/upload/pdf', upload.single('file'), uploadPdf);
router.post('/upload/image', upload.single('file'), uploadImage);

module.exports = router; 
