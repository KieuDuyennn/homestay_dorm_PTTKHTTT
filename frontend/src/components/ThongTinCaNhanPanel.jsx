import React from 'react';

export default function ThongTinCaNhanPanel({ formData, onChange, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-[#fccee8] border-b-[1.739px] border-solid h-[41.563px] relative shrink-0 w-full">
        <p className="absolute font-['Inter',sans-serif] font-bold leading-[28px] left-0 text-[#1e2939] text-[18px] top-[0.48px] tracking-[-0.4395px] whitespace-nowrap">
          Thông tin cá nhân
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 w-full">
        {/* Họ tên */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            HỌ TÊN <span className="text-[#e60076]">*</span>
          </label>
          <input
            type="text"
            name="HoTen"
            value={formData.HoTen || ''}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            className={`bg-[#fdf2f8] border ${errors?.HoTen ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 py-3 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076]`}
          />
          {errors?.HoTen && <span className="text-red-500 text-xs">{errors.HoTen}</span>}
        </div>

        {/* Số điện thoại */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            SỐ ĐIỆN THOẠI <span className="text-[#e60076]">*</span>
          </label>
          <input
            type="text"
            name="SoDienThoai"
            value={formData.SoDienThoai || ''}
            onChange={handleChange}
            placeholder="090 123 4567"
            className={`bg-[#fdf2f8] border ${errors?.SoDienThoai ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 py-3 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076]`}
          />
          {errors?.SoDienThoai && <span className="text-red-500 text-xs">{errors.SoDienThoai}</span>}
        </div>

        {/* CCCD */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            CCCD <span className="text-[#e60076]">*</span>
          </label>
          <input
            type="text"
            name="CCCD"
            value={formData.CCCD || ''}
            onChange={handleChange}
            placeholder="001234567890"
            className={`bg-[#fdf2f8] border ${errors?.CCCD ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 py-3 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076]`}
          />
          {errors?.CCCD && <span className="text-red-500 text-xs">{errors.CCCD}</span>}
        </div>

        {/* Địa chỉ */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            ĐỊA CHỈ <span className="text-[#e60076]">*</span>
          </label>
          <input
            type="text"
            name="DiaChi"
            value={formData.DiaChi || ''}
            onChange={handleChange}
            placeholder="123 Nguyễn Văn Linh, Quận 7"
            className={`bg-[#fdf2f8] border ${errors?.DiaChi ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 py-3 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076]`}
          />
          {errors?.DiaChi && <span className="text-red-500 text-xs">{errors.DiaChi}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            EMAIL
          </label>
          <input
            type="email"
            name="Email"
            value={formData.Email || ''}
            onChange={handleChange}
            placeholder="example@gmail.com"
            className={`bg-[#fdf2f8] border ${errors?.Email ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 py-3 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076]`}
          />
          {errors?.Email && <span className="text-red-500 text-xs">{errors.Email}</span>}
        </div>

        {/* Giới tính */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            GIỚI TÍNH <span className="text-[#e60076]">*</span>
          </label>
          <select
            name="GioiTinh"
            value={formData.GioiTinh || ''}
            onChange={handleChange}
            className={`bg-[#fdf2f8] border ${errors?.GioiTinh ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 py-3 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076] appearance-none cursor-pointer`}
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          {errors?.GioiTinh && <span className="text-red-500 text-xs">{errors.GioiTinh}</span>}
        </div>

        {/* Ngày sinh */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-['Inter',sans-serif] font-semibold text-[#364153] text-[14px]">
            NGÀY SINH <span className="text-[#e60076]">*</span>
          </label>
          <input
            type="date"
            name="NgaySinh"
            value={formData.NgaySinh || ''}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`bg-[#fdf2f8] border ${errors?.NgaySinh ? 'border-red-500' : 'border-[#fccee8]'} border-[0.87px] border-solid h-[49.715px] px-4 py-3 rounded-[10px] w-full font-['Inter',sans-serif] text-[#0a0a0a] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#e60076] cursor-pointer`}
          />
          {errors?.NgaySinh && <span className="text-red-500 text-xs">{errors.NgaySinh}</span>}
        </div>
      </div>
    </div>
  );
}
