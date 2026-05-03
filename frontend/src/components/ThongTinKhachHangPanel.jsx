import React, { useState } from 'react';

const ThongTinKhachHangPanel = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: data.khachHang?.hoTen || '',
    sdt: data.khachHang?.sdt || '',
    cccd: data.khachHang?.cccd || '',
    ngayVaoO: data.ngayVaoO || '',
    dsThànhViên: data.khachHang?.dsThànhViên || []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <h2 className="font-bold text-navy">Thông tin khách hàng</h2>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Chỉnh sửa
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate uppercase tracking-wider mb-1">Họ tên khách hàng</label>
            {isEditing ? (
              <input 
                name="hoTen" value={formData.hoTen} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            ) : (
              <p className="text-sm font-semibold text-navy">{formData.hoTen}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate uppercase tracking-wider mb-1">Số điện thoại</label>
            {isEditing ? (
              <input 
                name="sdt" value={formData.sdt} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            ) : (
              <p className="text-sm font-semibold text-navy">{formData.sdt}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate uppercase tracking-wider mb-1">Số CCCD</label>
            {isEditing ? (
              <input 
                name="cccd" value={formData.cccd} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            ) : (
              <p className="text-sm font-semibold text-navy">{formData.cccd}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate uppercase tracking-wider mb-1">Ngày vào ở</label>
            {isEditing ? (
              <input 
                type="date" name="ngayVaoO" value={formData.ngayVaoO} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            ) : (
              <p className="text-sm font-semibold text-navy">{formData.ngayVaoO}</p>
            )}
          </div>
        </div>

        {data.phong?.loaiHinhThue === "Đại diện nhóm" && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <label className="block text-xs font-bold text-slate uppercase tracking-wider mb-3">Danh sách thành viên ({formData.dsThànhViên.length})</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.dsThànhViên.map((tv, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate border border-gray-200">{idx + 1}</div>
                  <span className="text-sm font-medium text-navy">{tv}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isEditing && (
          <div className="mt-8 flex justify-end gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-bold text-slate hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm shadow-primary/20 transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongTinKhachHangPanel;
