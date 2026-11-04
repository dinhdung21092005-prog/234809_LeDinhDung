const express = require('express');
const router = express.Router();
const Device = require('../models/device.model');

// GET /api/devices (Lấy danh sách / Tìm kiếm)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { deviceId: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { deviceType: { $regex: search, $options: 'i' } },
          { room: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const devices = await Device.find(query).sort({ createdAt: -1 });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

// GET /api/devices/:id (Xem chi tiết)
router.get('/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

// POST /api/devices (Thêm mới)
router.post('/', async (req, res) => {
  try {
    const { deviceId, name, deviceType, room } = req.body;
    if (!deviceId || !name || !deviceType || !room) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }
    const existing = await Device.findOne({ deviceId });
    if (existing) {
      return res.status(400).json({ message: 'Mã thiết bị đã tồn tại!' });
    }
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (err) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: err.message });
  }
});

// PUT /api/devices/:id (Cập nhật)
router.put('/:id', async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDevice) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json(updatedDevice);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi cập nhật', error: err.message });
  }
});

// DELETE /api/devices/:id (Xóa)
router.delete('/:id', async (req, res) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(req.params.id);
    if (!deletedDevice) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json({ message: 'Xóa thiết bị thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

module.exports = router;