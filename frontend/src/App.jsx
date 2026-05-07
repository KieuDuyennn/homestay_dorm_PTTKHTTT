import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DangNhap from './pages/DangNhap';
import DanhSachPYCXemPhong from './pages/DanhSachPYCXemPhong';
import ChiTietPYCXemPhong from './pages/ChiTietPYCXemPhong';
import GhiNhanXacNhanThue from './pages/GhiNhanXacNhanThue';
import DangKyThuePhong from './pages/DangKyThuePhong';
import KetQuaTimKiemPhong from './pages/KetQuaTimKiemPhong';
import DanhSachPhongChon from './pages/DanhSachPhongChon';
import DatLichHen from './pages/DatLichHen';
import DanhSachLichHen from './pages/DanhSachLichHen';
import ChiTietLichHen from './pages/ChiTietLichHen';
import DanhSachHopDong from './pages/DanhSachHopDong';
import TaoBienBanTraPhong from './pages/TaoBienBanTraPhong';
import LapYeuCauThanhToan from './pages/LapYeuCauThanhToan';
import XemTruocIn from './pages/XemTruocIn';
import DanhSachThanhToanCocPage from './pages/deposit/DanhSachThanhToanCocPage';
import ChiTietThanhToanCocPage from './pages/deposit/ChiTietThanhToanCocPage';
import GhiNhanMinhChungPage from './pages/deposit/GhiNhanMinhChungPage';
import PheDuyetGiaoDichPage from './pages/deposit/PheDuyetGiaoDichPage';
import MainLayout from './components/MainLayout';
import { getHomePathForRole, getStoredUser, getUserRole, ROLES } from './utils/permissions';

function ProtectedRoute({ allowedRoles, children }) {
  const user = getStoredUser();
  const role = getUserRole(user);

  if (!user || Object.keys(user).length === 0) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={getHomePathForRole(role)} replace />;
  }

  return children;
}

function DepositLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

const saleRoles = [ROLES.SALE];
const accountantRoles = [ROLES.ACCOUNTANT];
const managerRoles = [ROLES.MANAGER];

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DangNhap />} />

        <Route path="/dang-ky-thue-phong" element={<ProtectedRoute allowedRoles={saleRoles}><DangKyThuePhong /></ProtectedRoute>} />
        <Route path="/ket-qua-tim-kiem" element={<ProtectedRoute allowedRoles={saleRoles}><KetQuaTimKiemPhong /></ProtectedRoute>} />
        <Route path="/danh-sach-phong-chon" element={<ProtectedRoute allowedRoles={saleRoles}><DanhSachPhongChon /></ProtectedRoute>} />
        <Route path="/dat-lich-hen" element={<ProtectedRoute allowedRoles={saleRoles}><DatLichHen /></ProtectedRoute>} />
        <Route path="/lich-hen" element={<ProtectedRoute allowedRoles={saleRoles}><DanhSachLichHen /></ProtectedRoute>} />
        <Route path="/lich-hen/:id" element={<ProtectedRoute allowedRoles={saleRoles}><ChiTietLichHen /></ProtectedRoute>} />
        <Route path="/phieu-yeu-cau" element={<ProtectedRoute allowedRoles={saleRoles}><DanhSachPYCXemPhong /></ProtectedRoute>} />
        <Route path="/phieu-yeu-cau/:id" element={<ProtectedRoute allowedRoles={saleRoles}><ChiTietPYCXemPhong /></ProtectedRoute>} />
        <Route path="/ghi-nhan-xac-nhan-thue/:id" element={<ProtectedRoute allowedRoles={saleRoles}><GhiNhanXacNhanThue /></ProtectedRoute>} />

        <Route path="/thanh-toan" element={<ProtectedRoute allowedRoles={accountantRoles}><DepositLayout><DanhSachThanhToanCocPage /></DepositLayout></ProtectedRoute>} />
        <Route path="/thanh-toan/:id" element={<ProtectedRoute allowedRoles={accountantRoles}><DepositLayout><ChiTietThanhToanCocPage /></DepositLayout></ProtectedRoute>} />
        <Route path="/thanh-toan/:id/evidence" element={<ProtectedRoute allowedRoles={accountantRoles}><DepositLayout><GhiNhanMinhChungPage /></DepositLayout></ProtectedRoute>} />
        <Route path="/thanh-toan/:id/approve" element={<ProtectedRoute allowedRoles={accountantRoles}><DepositLayout><PheDuyetGiaoDichPage /></DepositLayout></ProtectedRoute>} />
        <Route path="/deposit" element={<ProtectedRoute allowedRoles={accountantRoles}><DepositLayout><DanhSachThanhToanCocPage /></DepositLayout></ProtectedRoute>} />
        <Route path="/deposit/:id" element={<ProtectedRoute allowedRoles={accountantRoles}><DepositLayout><ChiTietThanhToanCocPage /></DepositLayout></ProtectedRoute>} />
        <Route path="/deposit/:id/evidence" element={<ProtectedRoute allowedRoles={accountantRoles}><DepositLayout><GhiNhanMinhChungPage /></DepositLayout></ProtectedRoute>} />
        <Route path="/deposit/:id/approve" element={<ProtectedRoute allowedRoles={accountantRoles}><DepositLayout><PheDuyetGiaoDichPage /></DepositLayout></ProtectedRoute>} />
        <Route path="/thanh-toan-dau-ky" element={<ProtectedRoute allowedRoles={accountantRoles}><DanhSachHopDong /></ProtectedRoute>} />
        <Route path="/lap-yeu-cau-thanh-toan/:id" element={<ProtectedRoute allowedRoles={accountantRoles}><LapYeuCauThanhToan /></ProtectedRoute>} />

        <Route path="/danh-sach-hop-dong" element={<ProtectedRoute allowedRoles={managerRoles}><DanhSachHopDong /></ProtectedRoute>} />
        <Route path="/tao-bien-ban-tra-phong/:id" element={<ProtectedRoute allowedRoles={managerRoles}><TaoBienBanTraPhong /></ProtectedRoute>} />
        <Route path="/xem-truoc-in/:id" element={<ProtectedRoute allowedRoles={managerRoles}><XemTruocIn /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={getHomePathForRole(getUserRole(getStoredUser()))} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
