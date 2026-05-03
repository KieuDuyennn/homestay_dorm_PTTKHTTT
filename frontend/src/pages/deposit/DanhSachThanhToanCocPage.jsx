import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PhieuCard from '../../components/common/PhieuCard';
import SearchBar from '../../components/common/SearchBar';
import { formatCurrency, formatDate } from '../../utils/format';

function DanhSachThanhToanCocPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/deposit').then((res) => setItems(res.data)).catch(console.error);
  }, []);

  const filtered = items.filter((item) =>
    item.tenSinhVien?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page danh-sach-thanh-toan-coc">
      <h2>Danh Sách Thanh Toán Cọc</h2>
      <SearchBar value={search} onChange={setSearch} placeholder="Tìm sinh viên..." />
      <div className="list">
        {filtered.map((item) => (
          <div key={item.id} onClick={() => navigate(`/deposit/${item.id}`)}>
            <PhieuCard
              title={item.tenSinhVien}
              amount={formatCurrency(item.soTien)}
              status={item.trangThai}
              date={formatDate(item.ngayTao)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DanhSachThanhToanCocPage;
