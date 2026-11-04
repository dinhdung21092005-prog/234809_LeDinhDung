import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/devices';

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    deviceType: 'Máy chiếu',
    room: 'P.301',
    brand: '',
    model: '',
    quantity: 1,
    status: 'Đang sử dụng',
    purchaseDate: '',
    description: ''
  });

  const [editingId, setEditingId] = useState(null);

  const fetchDevices = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword ? `${API_URL}?search=${encodeURIComponent(keyword)}` : API_URL;
      const res = await axios.get(url);
      setDevices(res.data);
    } catch (err) {
      setError('Không thể tải danh sách thiết bị!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDevices(searchTerm);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setMessage('Cập nhật thiết bị thành công!');
      } else {
        await axios.post(API_URL, formData);
        setMessage('Thêm thiết bị mới thành công!');
      }
      resetForm();
      fetchDevices();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu!');
    }
  };

  const handleEdit = (device) => {
    setEditingId(device._id);
    setFormData({
      deviceId: device.deviceId || '',
      name: device.name || '',
      deviceType: device.deviceType || 'Máy chiếu',
      room: device.room || '',
      brand: device.brand || '',
      model: device.model || '',
      quantity: device.quantity || 1,
      status: device.status || 'Đang sử dụng',
      purchaseDate: device.purchaseDate || '',
      description: device.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Xóa thiết bị thành công!');
      fetchDevices();
    } catch (err) {
      setError('Lỗi khi xóa thiết bị!');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      deviceId: '',
      name: '',
      deviceType: 'Máy chiếu',
      room: 'P.301',
      brand: '',
      model: '',
      quantity: 1,
      status: 'Đang sử dụng',
      purchaseDate: '',
      description: ''
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang sử dụng': return 'bg-success';
      case 'Hư hỏng': return 'bg-danger';
      case 'Đang sửa chữa': return 'bg-warning text-dark';
      case 'Ngừng sử dụng': return 'bg-secondary';
      default: return 'bg-info';
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary fw-bold">QUẢN LÝ THIẾT BỊ PHÒNG HỌC</h2>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Form tìm kiếm */}
      <form onSubmit={handleSearch} className="row g-2 mb-4">
        <div className="col-md-9">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo mã, tên, loại thiết bị hoặc phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary w-100">Tìm kiếm</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearchTerm(''); fetchDevices(''); }}>Tải lại</button>
        </div>
      </form>

      {/* Form nhập dữ liệu */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-dark text-white fw-bold">
          {editingId ? 'Cập nhật thông tin thiết bị' : 'Thêm thiết bị mới'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Mã thiết bị (*)</label>
              <input type="text" className="form-control" name="deviceId" value={formData.deviceId} onChange={handleChange} required disabled={!!editingId} />
            </div>
            <div className="col-md-5">
              <label className="form-label">Tên thiết bị (*)</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Loại thiết bị (*)</label>
              <input type="text" className="form-control" name="deviceType" value={formData.deviceType} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Phòng học (*)</label>
              <input type="text" className="form-control" name="room" value={formData.room} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Hãng sản xuất</label>
              <input type="text" className="form-control" name="brand" value={formData.brand} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Model</label>
              <input type="text" className="form-control" name="model" value={formData.model} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Số lượng</label>
              <input type="number" className="form-control" name="quantity" min="1" value={formData.quantity} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Tình trạng</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Hư hỏng">Hư hỏng</option>
                <option value="Đang sửa chữa">Đang sửa chữa</option>
                <option value="Ngừng sử dụng">Ngừng sử dụng</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Ngày mua</label>
              <input type="date" className="form-control" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Ghi chú</label>
              <input type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="col-12 text-end">
              {editingId && <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>Hủy bỏ</button>}
              <button type="submit" className="btn btn-success">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
            </div>
          </form>
        </div>
      </div>

      {/* Danh sách thiết bị */}
      {loading ? (
        <div className="text-center py-4">Đang tải dữ liệu...</div>
      ) : (
        <div className="table-responsive shadow-sm">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Mã TB</th>
                <th>Tên thiết bị</th>
                <th>Loại</th>
                <th>Phòng</th>
                <th>Số lượng</th>
                <th>Tình trạng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr><td colSpan="7" className="text-center">Chưa có thiết bị nào</td></tr>
              ) : (
                devices.map((device) => (
                  <tr key={device._id}>
                    <td><strong>{device.deviceId}</strong></td>
                    <td>{device.name}</td>
                    <td>{device.deviceType}</td>
                    <td>{device.room}</td>
                    <td>{device.quantity}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(device.status)}`}>{device.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-info me-1" onClick={() => setSelectedDevice(device)}>Chi tiết</button>
                      <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(device)}>Sửa</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(device._id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Xem chi tiết */}
      {selectedDevice && (
        <div className="modal show d-block tab-index='-1'" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết thiết bị: {selectedDevice.deviceId}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedDevice(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Tên thiết bị:</strong> {selectedDevice.name}</p>
                <p><strong>Loại thiết bị:</strong> {selectedDevice.deviceType}</p>
                <p><strong>Phòng học:</strong> {selectedDevice.room}</p>
                <p><strong>Hãng / Model:</strong> {selectedDevice.brand || 'N/A'} - {selectedDevice.model || 'N/A'}</p>
                <p><strong>Số lượng:</strong> {selectedDevice.quantity}</p>
                <p><strong>Tình trạng:</strong> {selectedDevice.status}</p>
                <p><strong>Ngày tiếp nhận:</strong> {selectedDevice.purchaseDate || 'Chưa cập nhật'}</p>
                <p><strong>Mô tả:</strong> {selectedDevice.description || 'Không có'}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedDevice(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;