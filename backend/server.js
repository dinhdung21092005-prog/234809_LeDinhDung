const express = require('express');
globalThis.crypto = require('crypto');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint GET /health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend đang hoạt động bình thường' });
});

// Route thiết bị
const deviceRoutes = require('./routes/device.routes');
app.use('/api/devices', deviceRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Kết nối MongoDB Atlas thành công');
    app.listen(PORT, () => console.log(`Server backend đang chạy tại cổng ${PORT}`));
  })
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));