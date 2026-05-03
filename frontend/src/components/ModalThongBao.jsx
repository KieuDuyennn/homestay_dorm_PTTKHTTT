import React from 'react';

const ModalThongBao = ({ visible, tieuDe, noiDung, onXacNhan, onQuayLaiDanhSach }) => {
  if (!visible) return null;

  const isError = tieuDe.toLowerCase().includes('lỗi');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-8 animate-in zoom-in-95 duration-200">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isError ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
          {isError ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-navy mb-2">
          {tieuDe}
        </h3>
        
        <p className="text-sm text-slate mb-8 leading-relaxed">
          {noiDung}
        </p>
        
        <div className="flex flex-col gap-3">
          {onXacNhan && (
            <button
              onClick={onXacNhan}
              className="w-full py-3 px-4 bg-primary text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
            >
              Tiếp tục
            </button>
          )}
          {onQuayLaiDanhSach && (
            <button
              onClick={onQuayLaiDanhSach}
              className="w-full py-3 px-4 bg-white border border-gray-200 text-navy font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
            >
              Quay lại danh sách
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalThongBao;
