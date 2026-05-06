import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import ThongTinCaNhanPanel from '../components/ThongTinCaNhanPanel';
import NhuCauThuePhongPanel from '../components/NhuCauThuePhongPanel';
import { useNavigate } from 'react-router-dom';
import { phieuYeuCauService } from '../services/phieuYeuCauService';
import ModalLoi from '../components/ModalLoi';

export default function DangKyThuePhong() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    HoTen: '',
    SoDienThoai: '',
    CCCD: '',
    DiaChi: '',
    Email: '',
    GioiTinh: '',
    NgaySinh: '',
    ChiNhanh: '',
    MucGia: '',
    SoNguoiMuonThue: '',
    HinhThucThue: '',
    ThoiHanThue: '',
    NgayDuKienDonVao: '',
    LoaiPhong: '',
    YeuCauKhac: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalLoi, setModalLoi] = useState({ isOpen: false, message: '' });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // clear error for the field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.HoTen) newErrors.HoTen = 'Vui lòng nhập họ tên';
    if (!formData.SoDienThoai) newErrors.SoDienThoai = 'Vui lòng nhập số điện thoại';
    if (!formData.CCCD) newErrors.CCCD = 'Vui lòng nhập số CCCD';
    if (!formData.DiaChi) newErrors.DiaChi = 'Vui lòng nhập địa chỉ';
    if (!formData.GioiTinh) newErrors.GioiTinh = 'Vui lòng chọn giới tính';
    if (!formData.NgaySinh) newErrors.NgaySinh = 'Vui lòng chọn ngày sinh';
    if (!formData.ChiNhanh) newErrors.ChiNhanh = 'Vui lòng chọn chi nhánh';
    if (!formData.MucGia) newErrors.MucGia = 'Vui lòng nhập mức giá mong muốn';
    if (!formData.SoNguoiMuonThue) newErrors.SoNguoiMuonThue = 'Vui lòng nhập số người';
    if (!formData.HinhThucThue) newErrors.HinhThucThue = 'Vui lòng chọn hình thức thuê';
    if (!formData.ThoiHanThue) newErrors.ThoiHanThue = 'Vui lòng chọn thời hạn thuê';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setModalLoi({ isOpen: true, message: 'Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc trước khi lưu phiếu.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      // Lấy manv của nhân viên đang đăng nhập
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = { ...formData, MaNV: currentUser.manv || null };

      const res = await phieuYeuCauService.taoPhieuYeuCau(payload);
      if (res.success) {
        // Lưu maYC để trang đặt lịch dùng khi update thoigianhenxem
        sessionStorage.setItem('currentMaYC', res.data.MaYC);

        const params = new URLSearchParams({
          maYC: res.data.MaYC,
          hinhThucThue: formData.HinhThucThue || '',
          soNguoi: formData.SoNguoiMuonThue || '1',
          mucGia: formData.MucGia || '0',
          chiNhanh: formData.ChiNhanh || '',
          gioiTinh: formData.GioiTinh || '',
        });
        navigate(`/ket-qua-tim-kiem?${params.toString()}`);

      } else {
        setModalLoi({ isOpen: true, message: res.message || 'Hệ thống bị lỗi xin vui lòng thử lại hoặc liên hệ với hỗ trợ kỹ thuật của chúng tôi.' });
      }
    } catch (error) {
      console.error(error);
      setModalLoi({ isOpen: true, message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền hoặc thử lại sau.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white border-[#f3f4f6] border-[0.87px] border-solid flex flex-col items-start overflow-clip p-[0.87px] rounded-[16px] shadow-lg w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e60076] to-[#ec003f] w-full px-[32px] py-[24px]">
          <h2 className="font-['Inter',sans-serif] font-bold text-[30px] text-white tracking-[0.3955px]">
            Phiếu Đăng ký Thuê phòng
          </h2>
          <p className="font-['Inter',sans-serif] font-normal text-[16px] text-[#fce7f3] mt-2">
            Vui lòng điền đầy đủ thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất
          </p>
        </div>

        {/* Form Body */}
        <div className="w-full px-[32px] py-[32px] flex flex-col gap-8">
          <ThongTinCaNhanPanel formData={formData} onChange={handleChange} errors={errors} />
          
          <NhuCauThuePhongPanel formData={formData} onChange={handleChange} errors={errors} />

          {/* Tiêu chí khác */}
          <div className="flex flex-col gap-2 w-full mt-4">
            <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px] uppercase">
              TIÊU CHÍ KHÁC
            </label>
            <textarea
              name="YeuCauKhac"
              value={formData.YeuCauKhac || ''}
              onChange={(e) => handleChange('YeuCauKhac', e.target.value)}
              placeholder="Hãy cho chúng tôi biết thêm các yêu cầu đặc biệt hoặc tiêu chí bạn quan tâm..."
              className="bg-[#fdf2f8] border border-[#fccee8] border-[0.87px] border-solid rounded-[10px] w-full h-[120px] px-4 py-3 font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076] resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center justify-center w-full mt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#e60076] to-[#ec003f] rounded-[14px] px-10 py-4 shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <span className="font-['Inter',sans-serif] font-bold text-[16px] text-white">
                {isSubmitting ? 'Đang xử lý...' : 'Lưu phiếu và xem phòng'}
              </span>
            </button>
            <p className="font-['Inter',sans-serif] font-normal text-[#6a7282] text-[12px] mt-4">
              Bằng cách nhấn nút trên, bạn đồng ý với các điều khoản dịch vụ của DormSanctuary
            </p>
          </div>
        </div>
      </div>
      <ModalLoi 
        isOpen={modalLoi.isOpen} 
        message={modalLoi.message} 
        onClose={() => setModalLoi({ isOpen: false, message: '' })} 
      />
    </MainLayout>
  );
}
