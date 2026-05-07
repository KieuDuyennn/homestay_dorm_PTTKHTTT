import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getMenuItemsForRole,
  getStoredUser,
  getUserRole,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
} from '../utils/permissions';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getStoredUser();
  const role = getUserRole(currentUser);
  const displayName =
    currentUser.name ||
    currentUser.hoten ||
    currentUser.hoTen ||
    currentUser.username ||
    currentUser.madangnhap ||
    currentUser.maNV ||
    'Người dùng';
  const displayRole = ROLE_LABELS[role] || role;
  const displayDescription = ROLE_DESCRIPTIONS[role] || 'Quản lý hồ sơ khách thuê';
  const menuItems = getMenuItemsForRole(role);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <aside
      className="w-[240px] min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-30"
      style={{ background: 'linear-gradient(180deg, #F0F4FF 0%, #FDF2F8 100%)' }}
    >
      <div className="px-6 pt-8 pb-6">
        <h2 className="text-[18px] font-bold text-navy leading-tight">{displayRole}</h2>
        <p className="text-[13px] font-semibold text-primary mt-2">{displayName}</p>
        <p className="text-[12px] text-gray-400 mt-1">{displayDescription}</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const activePaths = item.activePaths || [item.path];
          const isActive = activePaths.some((path) =>
            location.pathname === path || location.pathname.startsWith(path + '/')
          );

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all text-left
                ${
                  isActive
                    ? 'bg-pink-50 text-primary border border-pink-200'
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                }`}
            >
              <span className="text-[16px]">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-navy text-[14px] font-medium transition-colors text-left"
        >
          <span className="text-[16px]">↪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
