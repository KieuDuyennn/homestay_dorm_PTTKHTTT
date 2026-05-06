const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const depositRoutes = require('./routes/deposit.routes');
const phieuYeuCauRoutes = require('./routes/phieuYeuCau.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/deposit', depositRoutes);
app.use('/api/phieu-yeu-cau', phieuYeuCauRoutes);

app.use(errorMiddleware);

module.exports = app;
