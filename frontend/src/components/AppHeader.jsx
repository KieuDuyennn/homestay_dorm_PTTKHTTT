import React from 'react';
import { useNavigate } from 'react-router-dom';

const AppHeader = ({ tenNguoiDung, vaiTro, tenManHinh, moTaManHinh, showBackBtn = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          {showBackBtn && (
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-slate-500"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}
          
          <div>
            <h1 className="text-xl font-bold text-navy">{tenManHinh}</h1>
            {moTaManHinh && (
              <p className="text-sm text-slate mt-0.5">{moTaManHinh}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-navy">{tenNguoiDung}</p>
            <p className="text-xs text-slate">{vaiTro}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
            {tenNguoiDung ? tenNguoiDung.charAt(0) : 'U'}
          </div>
          <button 
            onClick={handleLogout}
            className="ml-2 text-sm font-medium text-slate hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
            Đăng xuất
          </button>
        </div>

      </div>
    </header>
  );
};

export default AppHeader;
