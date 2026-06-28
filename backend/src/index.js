require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const helmet = require('helmet');
const { generalLimiter } = require('./middlewares/rateLimit.middleware');
const sanitizeMiddleware = require('./middlewares/sanitize.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);
app.use(sanitizeMiddleware);

// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const authRoute = require('./routes/auth.route');
const storeRoute = require('./routes/store.route');
const productRoute = require('./routes/product.route');
const cartRoute = require('./routes/cart.route');
const orderRoute = require('./routes/order.route');
const walletRoute = require('./routes/wallet.route');
const reviewRoute = require('./routes/review.route');
const { voucherRouter, promoRouter } = require('./routes/discount.route');
const driverRoute = require('./routes/driver.route');
const adminRoute = require('./routes/admin.route');
app.use('/auth', authRoute);
app.use('/store', storeRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);
app.use('/wallet', walletRoute);
app.use('/reviews', reviewRoute);
app.use('/vouchers', voucherRouter);
app.use('/promos', promoRouter);
app.use('/driver', driverRoute);
app.use('/admin', adminRoute);

// Base Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'SEAPEDIA Backend Express Server is running smoothly',
    docs: `http://localhost:${PORT}/api-docs`
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger documentation is available at http://localhost:${PORT}/api-docs`);
});
