const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const Media = require('../models/Media');
const { requireAuth } = require('../middleware/auth');

// Configure multer for dorm media uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'dorms');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'dorm-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mov'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});

// Upload media files for a dorm
router.post('/dorm/:dormId', requireAuth, upload.array('media', 10), async (req, res) => {
  try {
    const dormId = parseInt(req.params.dormId);
    const files = req.files;
    
    if (isNaN(dormId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dorm ID'
      });
    }
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    const result = await Media.addDormMedia(dormId, files);
    
    res.json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      data: result
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.removeSync(file.path);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading files',
      error: error.message
    });
  }
});

// Get media for a specific dorm
router.get('/dorm/:dormId', async (req, res) => {
  try {
    const dormId = parseInt(req.params.dormId);
    
    if (isNaN(dormId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dorm ID'
      });
    }
    
    const result = await Media.getDormMedia(dormId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching media',
      error: error.message
    });
  }
});

// Serve media files
router.get('/file/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', 'dorms', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error serving file',
      error: error.message
    });
  }
});

// Delete media file from dorm
router.delete('/dorm/:dormId/:fileName', requireAuth, async (req, res) => {
  try {
    const dormId = parseInt(req.params.dormId);
    const fileName = req.params.fileName;
    
    if (isNaN(dormId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dorm ID'
      });
    }
    
    const result = await Media.deleteDormMedia(dormId, fileName);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting media',
      error: error.message
    });
  }
});

module.exports = router;