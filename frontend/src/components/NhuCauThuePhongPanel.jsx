import React from 'react';

export default function NhuCauThuePhongPanel({ formData, onChange, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
    
    // Auto update HinhThucThue based on SoNguoiMuonThue
    if (name === 'SoNguoiMuonThue') {
      const num = parseInt(value, 10);
      if (num === 1) {
        onChange('HinhThucThue', 'Cá nhân');
      } else if (num >= 2 && formData.HinhThucThue === 'Cá nhân') {
        onChange('HinhThucThue', '');
      }
    }
  };

  const soNguoi = parseInt(formData.SoNguoiMuonThue, 10);
  const isMotNguoi = soNguoi === 1;

  return (
    <div className="flex flex-col gap-6 w-full mt-6">
      <div className="border-[#fccee8] border-b-[1.739px] border-solid h-[41.563px] relative shrink-0 w-full">
        <p className="absolute font-['Inter',sans-serif] font-bold leading-[28px] left-0 text-[#1e2939] text-[18px] top-[0.48px] tracking-[-0.4395px] whitespace-nowrap">
          Nhu cầu thuê phòng
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-6 w-full">
        {/* Chọn chi nhánh */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            CHỌN CHI NHÁNH <span className="text-[#e60076]">*</span>
          </label>
          <select
            name="ChiNhanh"
            value={formData.ChiNhanh || ''}
            onChange={handleChange}
            className={`bg-[#fdf2f8] border ${errors?.ChiNhanh ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076] appearance-none`}
          >
            <option value="">Chọn chi nhánh</option>
            <option value="CN01">Bình Thạnh</option>
            <option value="CN02">Thủ Đức</option>
            <option value="CN03">Gò Vấp</option>
            <option value="CN04">Phú Nhuận</option>
          </select>
          {errors?.ChiNhanh && <span className="text-red-500 text-xs">{errors.ChiNhanh}</span>}
        </div>

        {/* Mức giá mong muốn */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            MỨC GIÁ MONG MUỐN <span className="text-[#e60076]">*</span>
          </label>
          <div className="flex items-center gap-3 w-full">
            <input
              type="number"
              name="MucGia"
              value={formData.MucGia || ''}
              onChange={handleChange}
              placeholder="Ví dụ: 5,000,000"
              className={`bg-[#fdf2f8] border ${errors?.MucGia ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid flex-1 h-[49.715px] px-4 py-3 rounded-[10px] font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076]`}
            />
            <span className="font-['Inter',sans-serif] font-medium text-[#4a5565] text-[16px]">
              VND
            </span>
          </div>
          {errors?.MucGia && <span className="text-red-500 text-xs">{errors.MucGia}</span>}
        </div>

        {/* Số người muốn thuê */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            SỐ NGƯỜI MUỐN THUÊ <span className="text-[#e60076]">*</span>
          </label>
          <input
            type="number"
            min="1"
            name="SoNguoiMuonThue"
            value={formData.SoNguoiMuonThue || ''}
            onChange={handleChange}
            placeholder="1"
            className={`bg-[#fdf2f8] border ${errors?.SoNguoiMuonThue ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 py-3 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076]`}
          />
          {errors?.SoNguoiMuonThue && <span className="text-red-500 text-xs">{errors.SoNguoiMuonThue}</span>}
        </div>

        {/* Hình thức thuê */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            HÌNH THỨC THUÊ <span className="text-[#e60076]">*</span>
          </label>
          <select
            name="HinhThucThue"
            value={formData.HinhThucThue || ''}
            onChange={handleChange}
            disabled={isMotNguoi}
            className={`bg-[#fdf2f8] border ${errors?.HinhThucThue ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076] appearance-none ${isMotNguoi ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {isMotNguoi ? (
              <option value="Cá nhân">Cá nhân</option>
            ) : (
              <>
                <option value="">Chọn hình thức</option>
                <option value="Ở ghép">Ở ghép</option>
                <option value="Thuê nguyên căn">Thuê nguyên căn</option>
              </>
            )}
          </select>
          {errors?.HinhThucThue && <span className="text-red-500 text-xs">{errors.HinhThucThue}</span>}
        </div>

        {/* Thời hạn thuê dự kiến */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            THỜI HẠN THUÊ DỰ KIẾN <span className="text-[#e60076]">*</span>
          </label>
          <select
            name="ThoiHanThue"
            value={formData.ThoiHanThue || ''}
            onChange={handleChange}
            className={`bg-[#fdf2f8] border ${errors?.ThoiHanThue ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076] appearance-none`}
          >
            <option value="">Chọn thời hạn</option>
            <option value="3">3 tháng</option>
            <option value="6">6 tháng</option>
            <option value="12">1 năm</option>
          </select>
          {errors?.ThoiHanThue && <span className="text-red-500 text-xs">{errors.ThoiHanThue}</span>}
        </div>

        {/* Ngày dự kiến dọn vào */}
        <div className="flex flex-col gap-2 w-full relative">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            NGÀY DỰ KIẾN DỌN VÀO
          </label>
          <input
            type="date"
            name="NgayDuKienDonVao"
            value={formData.NgayDuKienDonVao || ''}
            onChange={handleChange}
            className={`bg-[#fdf2f8] border ${errors?.NgayDuKienDonVao ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 py-3 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076]`}
          />
          <p className="absolute -bottom-5 font-['Inter',sans-serif] text-[#e60076] text-[12px]">
            *Ngày dự kiến đóng tiền cọc nhà
          </p>
          {errors?.NgayDuKienDonVao && <span className="text-red-500 text-xs absolute -bottom-9">{errors.NgayDuKienDonVao}</span>}
        </div>

      </div>
    </div>
  );
}
