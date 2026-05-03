import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ModalThongBao from '../../components/common/ModalThongBao';

function GhiNhanMinhChungPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setModal({ isOpen: true, message: 'Vui lòng chọn file minh chứng trước khi gửi.' });
      return;
    }
    const formData = new FormData();
    formData.append('minhChung', file);
    try {
      await api.post(`/deposit/${id}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setModal({ isOpen: true, message: 'Ghi nhận minh chứng thành công!' });
    } catch {
      setModal({ isOpen: true, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
  };

  return (
    <div className="page ghi-nhan-minh-chung">
      <h2>Ghi Nhận Minh Chứng</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Gửi minh chứng</button>
      </form>
      <ModalThongBao
        isOpen={modal.isOpen}
        message={modal.message}
        onClose={() => { setModal({ isOpen: false, message: '' }); navigate(`/deposit/${id}`); }}
      />
    </div>
  );
}

export default GhiNhanMinhChungPage;
