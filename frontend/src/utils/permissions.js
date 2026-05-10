export const ROLES = {
  SALE: 'Sale',
  ACCOUNTANT: 'Kế toán',
  MANAGER: 'Quản lý',
  TECHNICIAN: 'Kỹ thuật',
};

export const ROLE_HOME_PATHS = {
  [ROLES.SALE]: '/dang-ky-thue-phong',
  [ROLES.ACCOUNTANT]: '/thanh-toan-dau-ky',
  [ROLES.MANAGER]: '/danh-sach-hop-dong',
  [ROLES.TECHNICIAN]: '/',
};

export const ROLE_LABELS = {
  [ROLES.SALE]: 'Nhân viên Sale',
  [ROLES.ACCOUNTANT]: 'Nhân viên kế toán',
  [ROLES.MANAGER]: 'Quản lý',
  [ROLES.TECHNICIAN]: 'Nhân viên kỹ thuật',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.SALE]: 'Quản lý hồ sơ khách thuê',
  [ROLES.ACCOUNTANT]: 'Quản lý thanh toán khách thuê',
  [ROLES.MANAGER]: 'Quản lý trả phòng',
  [ROLES.TECHNICIAN]: 'Quản lý bàn giao phòng',
};

export const MENU_ITEMS_BY_ROLE = {
  [ROLES.SALE]: [
    { id: 'dang-ky-thue-phong', label: 'Tiếp nhận phiếu yêu cầu', icon: '📝', path: '/dang-ky-thue-phong' },
    { id: 'lich-hen', label: 'Lịch hẹn', icon: '🗓️', path: '/lich-hen' },
    { id: 'phieu-yeu-cau', label: 'PYC Xem phòng', icon: '📋', path: '/phieu-yeu-cau' },
    { id: 'lich-tra-phong', label: 'Lịch trả phòng', icon: '📅', path: '/sale/contract-lookup', activePaths: ['/sale/contract-lookup', '/sale/return-schedule'] },
  ],
  [ROLES.ACCOUNTANT]: [
    { id: 'thanh-toan-dau-ky', label: 'Thanh toán đầu kỳ', icon: '💳', path: '/thanh-toan-dau-ky' },
  ],
  [ROLES.MANAGER]: [
    { id: 'tra-phong', label: 'Trả phòng', icon: '🚪', path: '/danh-sach-hop-dong' },
  ],
};

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}') || {};
  } catch {
    return {};
  }
}

export function normalizeRole(role) {
  const value = String(role || '').trim().toLowerCase();

  if (value === 'sale' || value.includes('nhân viên sale') || value.includes('nhan vien sale')) {
    return ROLES.SALE;
  }

  if (value.includes('kế toán') || value.includes('ke toan')) {
    return ROLES.ACCOUNTANT;
  }

  if (value.includes('quản lý') || value.includes('quan ly')) {
    return ROLES.MANAGER;
  }

  if (value.includes('kỹ thuật') || value.includes('ky thuat')) {
    return ROLES.TECHNICIAN;
  }

  return role || ROLES.SALE;
}

export function getUserRole(user) {
  return normalizeRole(user?.role || user?.loainv || user?.LoaiNV);
}

export function getHomePathForRole(role) {
  return ROLE_HOME_PATHS[normalizeRole(role)] || ROLE_HOME_PATHS[ROLES.SALE];
}

export function getMenuItemsForRole(role) {
  return MENU_ITEMS_BY_ROLE[normalizeRole(role)] || MENU_ITEMS_BY_ROLE[ROLES.SALE];
}
