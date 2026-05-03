import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import DanhSachThanhToanCocPage from './pages/deposit/DanhSachThanhToanCocPage';
import ChiTietThanhToanCocPage from './pages/deposit/ChiTietThanhToanCocPage';
import GhiNhanMinhChungPage from './pages/deposit/GhiNhanMinhChungPage';
import PheDuyetGiaoDichPage from './pages/deposit/PheDuyetGiaoDichPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<DanhSachThanhToanCocPage />} />
            <Route path="/deposit" element={<DanhSachThanhToanCocPage />} />
            <Route path="/deposit/:id" element={<ChiTietThanhToanCocPage />} />
            <Route path="/deposit/:id/evidence" element={<GhiNhanMinhChungPage />} />
            <Route path="/deposit/:id/approve" element={<PheDuyetGiaoDichPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
