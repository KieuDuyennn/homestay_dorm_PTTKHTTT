import React, { useState } from 'react';

const ModalHuyThue = ({ visible, onXacNhan, onDong }) => {
  const [lyDo, setLyDo] = useState('');
  const [error, setError] = useState('');

  if (!visible) return null;

  const handleConfirm = () => {
    if (!lyDo.trim()) {
      setError('Vui lòng nhập lý do hủy thuê.');
      return;
    }
    onXacNhan(lyDo);
    setLyDo('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-navy text-center w-full ml-6">Xác nhận hủy thuê</h3>
          <button onClick={onDong} className="text-slate hover:text-navy transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          
          <p className="text-sm text-slate text-center mb-6 px-4">
            Bạn có chắc chắn muốn hủy phiếu yêu cầu này không? Hành động này không thể hoàn tác.
          </p>

          <label className="block text-xs font-bold text-slate uppercase mb-2">Lý do hủy <span className="text-rose-500">*</span></label>
          <textarea
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none ${error ? 'border-rose-500' : 'border-gray-200'}`}
            rows="3"
            placeholder="Nhập lý do chi tiết..."
            value={lyDo}
            onChange={(e) => { setLyDo(e.target.value); setError(''); }}
          ></textarea>
          {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
        </div>

        <div className="px-6 py-5 bg-gray-50 flex gap-3">
          <button
            onClick={onDong}
            className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-slate font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 bg-rose-600 text-white font-bold text-sm rounded-lg hover:bg-rose-700 shadow-md shadow-rose-200 transition-all active:scale-95"
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHuyThue;
