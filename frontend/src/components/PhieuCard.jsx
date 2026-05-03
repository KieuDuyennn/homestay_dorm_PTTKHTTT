import React from 'react';

const PhieuCard = ({ data, onClick }) => {
  const { maHoSo, khachHang, phong, ngayVaoO, trangThai } = data;

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Cần xác nhận':
        return 'bg-pink-50 text-primary border-pink-100';
      case 'Hoàn tất':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Hủy thuê':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-gray-50 text-slate border-gray-100';
    }
  };

  return (
    <div 
      onClick={() => onClick(maHoSo)}
      className="bg-white border border-gray-200 rounded-lg p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold text-navy group-hover:text-primary transition-colors">
            Mã hồ sơ: {maHoSo}
          </h3>
          <p className="text-xs text-slate mt-0.5">Ngày vào ở: {ngayVaoO}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyles(trangThai)}`}>
          {trangThai.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-slate flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy leading-none">{khachHang?.hoTen}</p>
            <p className="text-xs text-slate mt-1">{khachHang?.sdt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-slate flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-navy leading-none">Phòng {phong?.tenPhong}</p>
            <p className="text-xs text-slate mt-1">{phong?.loaiPhong} - {phong?.loaiHinhThue}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
        <span className="text-xs font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Xem chi tiết
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </span>
      </div>
    </div>
  );
};

export default PhieuCard;
