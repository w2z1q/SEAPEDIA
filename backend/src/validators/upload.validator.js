const validateImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required' });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file format. Only JPG, JPEG, PNG, and WEBP are allowed',
    });
  }

  next();
};

module.exports = {
  validateImage,
};
