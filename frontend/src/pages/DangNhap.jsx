import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const DangNhap = () => {
  const [maDangNhap, setMaDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/auth/login', { maDangNhap, matKhau });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Chuyển hướng theo loại nhân viên
      if (user.loainv === 'Kế toán') {
        navigate('/danh-sach-hop-dong-yctt');
      } else {
        navigate('/phieu-yeu-cau');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <svg className="text-primary" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-navy">Homestay Management</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate uppercase tracking-wider mb-2">Mã đăng nhập</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="tuan.lm"
                  value={maDangNhap}
                  onChange={(e) => setMaDangNhap(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate uppercase tracking-wider mb-2">Mật khẩu</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="••••••"
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Đăng nhập'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate font-medium uppercase tracking-widest">
            Hệ thống Quản lý Homestay v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default DangNhap;
