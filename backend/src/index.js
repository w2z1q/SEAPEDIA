require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const authRoute = require('./routes/auth.route');
const storeRoute = require('./routes/store.route');
const productRoute = require('./routes/product.route');
const cartRoute = require('./routes/cart.route');
app.use('/auth', authRoute);
app.use('/store', storeRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);

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
