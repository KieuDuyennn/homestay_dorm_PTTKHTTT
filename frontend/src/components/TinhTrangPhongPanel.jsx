import React from 'react';

const TinhTrangPhongPanel = ({ trangThai, onTienHanh, onHuyThue }) => {
  const isAvailable = trangThai === "Trống";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <h3 className="font-bold text-navy text-lg">Tình trạng phòng hiện tại</h3>
            <p className={`text-sm font-bold ${isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isAvailable ? 'Phòng vẫn còn trống, có thể tiến hành thuê.' : 'Phòng hiện đã hết chỗ hoặc không khả dụng.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={onHuyThue}
            className="flex-1 md:flex-none px-6 py-2.5 border border-rose-200 text-rose-600 font-bold text-sm rounded-lg hover:bg-rose-50 transition-colors"
          >
            Hủy thuê
          </button>
          <button 
            onClick={onTienHanh}
            disabled={!isAvailable}
            className={`
              flex-1 md:flex-none px-8 py-2.5 font-bold text-sm rounded-lg transition-all shadow-lg
              ${isAvailable 
                ? 'bg-primary text-white shadow-primary/25 hover:bg-primary-dark active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }
            `}
          >
            Tiến hành xác nhận thuê
          </button>
        </div>
      </div>
    </div>
  );
};

export default TinhTrangPhongPanel;
