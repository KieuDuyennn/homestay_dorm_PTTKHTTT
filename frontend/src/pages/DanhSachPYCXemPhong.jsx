import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import PhieuYeuCauXemPhong_BUS from '../data/mockPhieuYeuCau';

const DanhSachPYCXemPhong = () => {
  const [user, setUser] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [dsPhieu, setDsPhieu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/');
    } else {
      setUser(JSON.parse(savedUser));
      setDsPhieu(PhieuYeuCauXemPhong_BUS.layDanhSachPYC());
    }
  }, [navigate]);

  const filteredPhieu = dsPhieu.filter(p => {
    return p.maHoSo.toLowerCase().includes(keyword.toLowerCase()) || 
           p.khachHang.hoTen.toLowerCase().includes(keyword.toLowerCase()) ||
           p.khachHang.sdt.includes(keyword);
  });

  if (!user) return null;

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-[32px] font-extrabold text-navy leading-tight">Danh sách hồ sơ đăng ký</h1>
        <p className="text-[14px] text-gray-500 mt-2">Quản lý và tra cứu thông tin khách hàng đăng ký thuê phòng</p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* Card List */}
      <div className="space-y-4">
        {filteredPhieu.map((p) => (
          <div 
            key={p.maHoSo} 
            onClick={() => navigate(`/phieu-yeu-cau/${p.maHoSo}`)}
            className="bg-white rounded-2xl border border-gray-100 px-8 py-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-[16px] font-bold text-navy">{p.khachHang.hoTen}</h3>
                <span className="bg-pink-50 text-primary text-[11px] font-semibold px-3 py-1 rounded-full border border-pink-100">
                  {p.trangThai}
                </span>
              </div>
              <p className="text-[13px] text-gray-400 font-medium">SĐT: {p.khachHang.sdt}</p>
            </div>
            <svg className="text-gray-300" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default DanhSachPYCXemPhong;
