const multer = require('multer');

// Configure multer with memory storage
const storage = multer.memoryStorage();

// Set file size limit to 5MB
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = {
  upload,
};
