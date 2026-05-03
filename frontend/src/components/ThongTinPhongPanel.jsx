import React from 'react';

const ThongTinPhongPanel = ({ data }) => {
  const { phong } = data;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
        <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <h2 className="font-bold text-navy">Thông tin phòng</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-sm font-medium text-slate">Tên phòng</span>
            <span className="text-sm font-bold text-navy">Phòng {phong?.tenPhong}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-sm font-medium text-slate">Loại phòng</span>
            <span className="text-sm font-bold text-navy">{phong?.loaiPhong}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-sm font-medium text-slate">Loại hình thuê</span>
            <span className="text-sm font-bold text-navy">{phong?.loaiHinhThue}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-sm font-medium text-slate">Giá thuê</span>
            <span className="text-sm font-bold text-primary">{phong?.giaThue?.toLocaleString()} VNĐ/tháng</span>
          </div>
        </div>

        {phong?.loaiPhong === "Ở ghép" && (
          <div className="mt-8">
            <label className="block text-xs font-bold text-slate uppercase tracking-wider mb-4">Trạng thái giường ({phong?.soGiuong} giường)</label>
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: phong.soGiuong }).map((_, i) => {
                const isOccupied = i < (phong.soGiuongDaThue || 0);
                return (
                  <div key={i} className={`
                    flex flex-col items-center gap-2 p-3 rounded-lg border w-24 transition-all
                    ${isOccupied 
                      ? 'bg-rose-50 border-rose-100 text-rose-600' 
                      : 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-100'
                    }
                  `}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                    <span className="text-[10px] font-bold uppercase">{isOccupied ? 'Đã thuê' : 'Trống'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongTinPhongPanel;
