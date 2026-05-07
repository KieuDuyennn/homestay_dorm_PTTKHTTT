import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/format';

function ChiTietThanhToanCocPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api.get(`/deposit/${id}`).then((res) => setDetail(res.data)).catch(console.error);
  }, [id]);

  if (!detail) return <p>Đang tải...</p>;

  return (
    <div className="page chi-tiet-thanh-toan-coc">
      <h2>Chi Tiết Thanh Toán Cọc</h2>
      <p>Sinh viên: {detail.tenSinhVien}</p>
      <p>Số tiền: {formatCurrency(detail.soTien)}</p>
      <p>Trạng thái: {detail.trangThai}</p>
      <p>Ngày tạo: {formatDate(detail.ngayTao)}</p>
      <button onClick={() => navigate(`/thanh-toan/${id}/evidence`)}>Ghi nhận minh chứng</button>
      <button onClick={() => navigate(`/thanh-toan/${id}/approve`)}>Phê duyệt giao dịch</button>
    </div>
  );
}

export default ChiTietThanhToanCocPage;
