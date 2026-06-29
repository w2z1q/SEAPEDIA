const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // limit each IP to 100,000 requests per windowMs (dilonggarkan untuk kemudahan development & demo)
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // limit each IP to 100,000 login/register requests per windowMs (dilonggarkan untuk kemudahan development & demo)
  message: { success: false, message: 'Too many login attempts from this IP, please try again after 15 minutes' },
});

module.exports = { generalLimiter, authLimiter };
