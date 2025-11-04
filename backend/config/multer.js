const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Configure storage for different types of uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '';
    
    // Determine upload path based on route path
    if (req.route.path.includes('room') || req.originalUrl.includes('/api/media/room/')) {
      uploadPath = path.join(__dirname, '..', 'uploads', 'rooms');
    } else {
      uploadPath = path.join(__dirname, '..', 'uploads', 'temp');
    }
    
    // Ensure directory exists
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  }
});

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    // Images
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    // Videos
    'video/mp4': true,
    'video/avi': true,
    'video/mov': true,
    'video/wmv': true,
    'video/webm': true
  };
  
  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, AVI, MOV, WMV, WebM) are allowed.`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Maximum 10 files at once
  }
});

// Different upload configurations
const uploadConfigs = {
  // Single file upload
  single: (fieldName) => upload.single(fieldName),
  
  // Multiple files upload
  multiple: (fieldName, maxCount = 30) => upload.array(fieldName, maxCount),
  
  // Mixed fields upload
  fields: (fields) => upload.fields(fields)
};

module.exports = {
  upload,
  uploadConfigs,
  storage
};