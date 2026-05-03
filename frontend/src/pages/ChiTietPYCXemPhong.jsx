import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import PhieuYeuCauXemPhong_BUS from '../data/mockPhieuYeuCau';

const ChiTietPYCXemPhong = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [phieu, setPhieu] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { navigate('/'); return; }
    setUser(JSON.parse(savedUser));
    const p = PhieuYeuCauXemPhong_BUS.layChiTietPYC(id);
    if (!p) { navigate('/phieu-yeu-cau'); return; }
    setPhieu(p);
    setFormData({
      hoTen: p.khachHang?.hoTen || '',
      sdt: p.khachHang?.sdt || '',
      gioiTinh: p.khachHang?.gioiTinh || '',
      cccd: p.khachHang?.cccd || '',
      quocTich: p.khachHang?.quocTich || '',
      soNguoiDuKien: p.khachHang?.soNguoiDuKien || '',
      ngayVaoO: p.ngayVaoO || '',
      thoiHanThue: p.thoiHanThue || '',
    });
  }, [id, navigate]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const updated = {
      ...phieu,
      khachHang: { ...phieu.khachHang, hoTen: formData.hoTen, sdt: formData.sdt, gioiTinh: formData.gioiTinh, cccd: formData.cccd, quocTich: formData.quocTich, soNguoiDuKien: formData.soNguoiDuKien },
      ngayVaoO: formData.ngayVaoO,
      thoiHanThue: formData.thoiHanThue,
    };
    PhieuYeuCauXemPhong_BUS.capNhatPYC(updated);
    setPhieu(updated);
    setIsEditing(false);
  };

  const handleXacNhanThue = () => {
    navigate(`/ghi-nhan-xac-nhan-thue/${phieu.maHoSo}`);
  };

  if (!user || !phieu) return null;

  const trangThaiPhong = phieu.phong?.trangThai === 'Còn trống';

  return (
    <MainLayout>
      {/* Back + Title */}
      <div className="mb-8">
        <button onClick={() => navigate('/phieu-yeu-cau')} className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-navy transition-colors mb-4 font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Quay lại danh sách
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold text-navy">Chi tiết hồ sơ khách hàng</h1>
            <p className="text-[13px] text-gray-400 mt-1">Mã hồ sơ: {phieu.maHoSo}</p>
          </div>
          <span className="bg-pink-50 text-primary text-[12px] font-semibold px-4 py-2 rounded-full border border-pink-200">
            {phieu.trangThai}
          </span>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[18px] font-bold text-navy">Thông tin khách hàng</h2>
          {!isEditing && phieu.trangThai === 'Cần xác nhận' && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 border border-primary text-primary text-[13px] font-bold rounded-xl hover:bg-pink-50 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Điều chỉnh thông tin
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5 font-medium">Họ và tên</label>
                <input name="hoTen" value={formData.hoTen} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"/>
              </div>
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5 font-medium">Số điện thoại</label>
                <input name="sdt" value={formData.sdt} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"/>
              </div>
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5 font-medium">Giới tính</label>
                <input name="gioiTinh" value={formData.gioiTinh} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"/>
              </div>
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5 font-medium">Quốc tịch</label>
                <input name="quocTich" value={formData.quocTich} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"/>
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-gray-500 mb-1.5 font-medium">Số CCCD/CMND</label>
              <input name="cccd" value={formData.cccd} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"/>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5 font-medium">Số lượng dự kiến</label>
                <input name="soNguoiDuKien" value={formData.soNguoiDuKien} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"/>
              </div>
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5 font-medium">Ngày vào ở dự kiến</label>
                <input name="ngayVaoO" type="date" value={formData.ngayVaoO} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"/>
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-gray-500 mb-1.5 font-medium">Thời hạn thuê</label>
              <input name="thoiHanThue" value={formData.thoiHanThue} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"/>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-[13px] font-bold rounded-xl hover:bg-gray-50 transition-colors">Hủy</button>
              <button onClick={handleSave} className="px-6 py-2.5 bg-primary text-white text-[13px] font-bold rounded-xl hover:bg-primary-dark transition-colors">Lưu thay đổi</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Họ tên */}
            <div>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Họ và tên
              </div>
              <p className="text-[15px] font-bold text-navy">{phieu.khachHang.hoTen}</p>
            </div>

            {/* SĐT */}
            <div>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Số điện thoại
              </div>
              <p className="text-[15px] font-bold text-navy">{phieu.khachHang.sdt}</p>
            </div>

            {/* Giới tính + Quốc tịch */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[12px] text-gray-400 mb-1">Giới tính</p>
                <p className="text-[15px] font-bold text-navy">{phieu.khachHang.gioiTinh}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  Quốc tịch
                </div>
                <p className="text-[15px] font-bold text-navy">{phieu.khachHang.quocTich}</p>
              </div>
            </div>

            {/* CCCD */}
            <div>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                Số CCCD/CMND
              </div>
              <p className="text-[15px] font-bold text-navy">{phieu.khachHang.cccd}</p>
            </div>

            {/* Số lượng dự kiến */}
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Số lượng dự kiến</p>
              <p className="text-[15px] font-bold text-navy">{phieu.khachHang.soNguoiDuKien || '-'} người</p>
            </div>

            {/* Ngày vào ở */}
            <div>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Ngày vào ở dự kiến
              </div>
              <p className="text-[15px] font-bold text-navy">{phieu.ngayVaoO}</p>
            </div>

            {/* Thời hạn thuê */}
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Thời hạn thuê</p>
              <p className="text-[15px] font-bold text-navy">{phieu.thoiHanThue} tháng</p>
            </div>
          </div>
        )}
      </div>

      {/* Thông tin phòng */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
        <h2 className="text-[18px] font-bold text-navy mb-8">Thông tin phòng</h2>
        <div className="space-y-4">
          {[
            ['Đối tượng thuê:', phieu.doiTuongThue],
            ['Loại hình thuê:', phieu.loaiHinhThue],
            ['Mã chi nhánh:', phieu.phong?.maChiNhanh],
            ['Mã phòng:', phieu.phong?.maPhong, true],
            ['Mã giường:', phieu.phong?.dsGiuong?.[0]?.maGiuong || '-'],
            ['Loại phòng:', phieu.phong?.loaiPhong],
          ].map(([label, value, isPink], idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <span className="text-[14px] text-gray-500 font-medium">{label}</span>
              <span className={`text-[14px] font-bold ${isPink ? 'text-primary' : 'text-navy'}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tình trạng phòng/giường */}
      {phieu.trangThai === 'Cần xác nhận' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-[18px] font-bold text-navy mb-6">Tình trạng phòng/giường</h2>
          
          <div className={`rounded-xl p-6 mb-6 ${trangThaiPhong ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            <div className="flex items-center gap-3 mb-2">
              {trangThaiPhong ? (
                <svg className="text-green-500" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              ) : (
                <svg className="text-red-500" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              )}
              <span className={`text-[16px] font-bold ${trangThaiPhong ? 'text-green-700' : 'text-red-700'}`}>
                {trangThaiPhong ? 'Phòng còn trống' : 'Phòng đã có người'}
              </span>
            </div>
            <p className={`text-[13px] ml-9 ${trangThaiPhong ? 'text-green-600' : 'text-red-600'}`}>
              {trangThaiPhong 
                ? `Phòng ${phieu.phong.maPhong} vẫn còn trống và đủ điều kiện nhận cọc.`
                : `Phòng ${phieu.phong.maPhong} hiện tại đã có người ở, không thể xác nhận thuê.`
              }
            </p>
          </div>

          {trangThaiPhong && (
            <button 
              onClick={handleXacNhanThue}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[14px] font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-md shadow-green-200"
            >
              Tiến hành xác nhận thuê
            </button>
          )}
        </div>
      )}

      {/* Lý do hủy */}
      {phieu.trangThai === 'Hủy thuê' && phieu.lyDoHuy && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-8 shadow-sm">
          <h2 className="text-[16px] font-bold text-red-700 mb-2">Lý do hủy thuê</h2>
          <p className="text-[14px] text-red-600 italic">"{phieu.lyDoHuy}"</p>
        </div>
      )}
    </MainLayout>
  );
};

export default ChiTietPYCXemPhong;
