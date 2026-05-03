import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ModalThongBao from '../../components/common/ModalThongBao';
import { formatCurrency, formatDate } from '../../utils/format';

function PheDuyetGiaoDichPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: '' });

  useEffect(() => {
    api.get(`/deposit/${id}`).then((res) => setDetail(res.data)).catch(console.error);
  }, [id]);

  const handleApprove = async () => {
    try {
      await api.patch(`/deposit/${id}/approve`);
      setModal({ isOpen: true, message: 'Giao dịch đã được phê duyệt!' });
    } catch {
      setModal({ isOpen: true, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
  };

  if (!detail) return <p>Đang tải...</p>;

  return (
    <div className="page phe-duyet-giao-dich">
      <h2>Phê Duyệt Giao Dịch</h2>
      <p>Sinh viên: {detail.tenSinhVien}</p>
      <p>Số tiền: {formatCurrency(detail.soTien)}</p>
      <p>Ngày tạo: {formatDate(detail.ngayTao)}</p>
      <button onClick={handleApprove}>Phê duyệt</button>
      <ModalThongBao
        isOpen={modal.isOpen}
        message={modal.message}
        onClose={() => { setModal({ isOpen: false, message: '' }); navigate('/deposit'); }}
      />
    </div>
  );
}

export default PheDuyetGiaoDichPage;
