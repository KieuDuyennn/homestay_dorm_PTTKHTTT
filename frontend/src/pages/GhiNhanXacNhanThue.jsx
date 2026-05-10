// =============================================================================
// PHẦN CỦA DUYÊN: GIAO DIỆN GHI NHẬN XÁC NHẬN THUÊ PHÒNG
// =============================================================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { phieuYeuCauService } from '../services/phieuYeuCauService';
import ModalThongBao from '../components/ModalThongBao';
import api from '../services/api';

const noiQuy = [
  'Liên hệ và gặp trực tiếp chủ trọ khi cần sửa chữa hoặc gặp vấn đề.',
  'Không nuôi chó, mèo, động vật cưng trong phòng trọ.',
  'Giữ gìn vệ sinh chung, dọn rác đúng nơi quy định.',
  'Không được tự ý nhận người vào ở khi chưa thông qua chủ trọ.',
  'Không gom phòng nhằm mục đích cho thuê lại trái phép.',
  'Thanh toán tiền thuê trọ đúng hạn, trước ngày 5 hàng tháng.',
  'Tuân thủ giờ giấc, không gây tiếng ồn sau 22:00.',
  'Trả phòng trước khi hết hợp đồng phải thông báo trước ít nhất 30 ngày.',
  'Trong trường hợp hỏa hoạn/ngập/thiên tai, liên hệ hotline số khẩn cấp đã dán.'
];

const GhiNhanXacNhanThue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [phieu, setPhieu] = useState(null);
  const [dongY, setDongY] = useState(false);
  const [modalState, setModalState] = useState({ show: false, type: 'success', title: '', message: '', isSuccess: false });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { navigate('/'); return; }
    setUser(JSON.parse(savedUser));
    
    fetchChiTiet();
  }, [id, navigate]);

  const fetchChiTiet = async () => {
    try {
      const res = await phieuYeuCauService.layChiTietNoiQuy(id);
      if (res.success) {
        setPhieu(res.data);
      } else {
        navigate('/phieu-yeu-cau');
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết:', error);
      navigate('/phieu-yeu-cau');
    }
  };

  const handleXacNhan = async () => {
    if (!dongY) return;
    try {
      const res = await phieuYeuCauService.xacNhanThue(id, { dongYNoiQuy: true });
      if (res.success) {
        setModalState({
          show: true,
          type: 'success',
          title: 'Thành công',
          message: res.data.message || 'Xác nhận thành công!',
          isSuccess: true
        });
      } else {
        setModalState({
          show: true,
          type: 'error',
          title: 'Lỗi xác nhận thuê',
          message: res.data.message || 'Lỗi xác nhận thuê',
          isSuccess: false
        });
      }
    } catch (error) {
      console.error('Lỗi xác nhận thuê:', error);
      setModalState({
        show: true,
        type: 'error',
        title: 'Lỗi hệ thống',
        message: error.response?.data?.message || 'Lỗi server khi xác nhận thuê',
        isSuccess: false
      });
    }
  };

  if (!user || !phieu) return null;

  const dsChot = phieu.dsGiuongDaChot || [];
  const dsMaGiuong = dsChot.map(g => g.maGiuong).join(', ') || '-';
  const giaThue = phieu.phong?.tienThueThang || 0;
  const soThangCoc = 2;
  const tongCoc = giaThue * soThangCoc;


  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate(`/phieu-yeu-cau/${phieu.maHoSo}`)} className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-navy transition-colors mb-4 font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Quay lại {phieu.maHoSo}
        </button>
        <h1 className="text-[28px] font-extrabold text-navy">Ghi nhận xác nhận thuê</h1>
        <p className="text-[13px] text-gray-400 mt-1">Xác nhận khách hàng đồng ý nội quy và chuyển hồ sơ sang trạng thái hoàn tất</p>
      </div>

      {/* === KHUNG CHUNG: Thông tin khách + Thông tin phòng + Nội quy === */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm space-y-0">

        {/* ─── Section 1: Thông tin khách hàng ─── */}
        <h2 className="text-[18px] font-bold text-navy mb-6">Thông tin khách hàng</h2>
        <div className="grid grid-cols-2 gap-y-5 gap-x-16">
          <div>
            <p className="text-[12px] text-gray-400 mb-1">Họ và tên</p>
            <p className="text-[15px] font-bold text-navy">{phieu.khachHang?.hoTen}</p>
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-1">Số điện thoại</p>
            <p className="text-[15px] font-bold text-navy">{phieu.khachHang?.sdt}</p>
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-1">Giới tính</p>
            <p className="text-[15px] font-bold text-navy">{phieu.khachHang?.gioiTinh}</p>
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-1">Quốc tịch</p>
            <p className="text-[15px] font-bold text-navy">{phieu.khachHang?.quocTich}</p>
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-1">Số CCCD/CMND</p>
            <p className="text-[15px] font-bold text-navy">{phieu.khachHang?.cccd}</p>
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-1">Số lượng dự kiến</p>
            <p className="text-[15px] font-bold text-navy">{phieu.khachHang?.soNguoiDuKien || 1} người</p>
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-1">Ngày vào ở dự kiến</p>
            <p className="text-[15px] font-bold text-navy">{phieu.ngayVaoO}</p>
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-1">Thời hạn thuê</p>
            <p className="text-[15px] font-bold text-navy">{phieu.thoiHanThue} tháng</p>
          </div>
        </div>

        {/* ─── Divider ─── */}
        <div className="border-t border-gray-100 my-8" />

        {/* ─── Section 2: Thông tin phòng ─── */}
        <h2 className="text-[18px] font-bold text-navy mb-6">Thông tin phòng</h2>
        <div className="space-y-3">
          {[
            ['Loại hình thuê:', phieu.loaiHinhThue],
            ['Mã chi nhánh:', phieu.phong?.maChiNhanh],
            ['Mã phòng:', phieu.phong?.maPhong, true],
            ['Mã giường:', dsMaGiuong],
          ].map(([label, value, isPink], idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <span className="text-[14px] text-gray-500 font-medium">{label}</span>
              <span className={`text-[14px] font-bold ${isPink ? 'text-primary' : 'text-navy'}`}>{value || '-'}</span>
            </div>
          ))}
        </div>

        {/* ─── Divider ─── */}
        <div className="border-t border-gray-100 my-8" />

        {/* ─── Section 3: Nội quy và điều kiện thuê ─── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <h2 className="text-[18px] font-bold text-navy">Nội quy và điều kiện thuê</h2>
        </div>
        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
          Tất cả các quy định trước khi khách thuê đồng ý thì nhân viên phải ký xác nhận được phép nhận cọc.
        </p>
        <div className="space-y-3">
          {noiQuy.map((item, idx) => (
            <div key={idx} className="flex gap-3 text-[13px] text-gray-600 leading-relaxed">
              <span className="text-gray-400 mt-0.5 flex-shrink-0">{idx + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      {/* === HẾT KHUNG CHUNG === */}

      {/* Xác nhận đồng ý */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
        <h3 className="text-[16px] font-bold text-navy mb-4">Khách hàng đồng ý nội quy và điều kiện thuê</h3>
        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
          Tôi xin nhận hồ sơ trên với tư cách khách hàng đang ở chung phương thức thuê đã đề ra trên nội dung thỏa thuận.
        </p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={dongY} 
            onChange={(e) => setDongY(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
          />
          <span className="text-[14px] text-navy font-medium">Tôi đồng ý với các điều khoản trên</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button 
          onClick={() => navigate(`/phieu-yeu-cau/${phieu.maHoSo}`)}
          className="flex-1 py-3.5 border border-gray-200 text-gray-600 text-[14px] font-bold rounded-xl hover:bg-gray-50 transition-colors bg-white"
        >
          Hủy
        </button>
        <button 
          onClick={handleXacNhan}
          disabled={!dongY}
          className={`flex-1 py-3.5 text-[14px] font-bold rounded-xl transition-all flex items-center justify-center gap-2
            ${dongY 
              ? 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-pink-200' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Chuyển hồ sơ xác nhận
        </button>
      </div>

      <ModalThongBao
        show={modalState.show}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        primaryAction={{
          label: modalState.isSuccess ? 'Về danh sách' : 'Đóng',
          onClick: () => {
            setModalState(prev => ({ ...prev, show: false }));
            if (modalState.isSuccess) {
              navigate('/phieu-yeu-cau');
            }
          }
        }}
      />
    </MainLayout>
  );
};

export default GhiNhanXacNhanThue;
