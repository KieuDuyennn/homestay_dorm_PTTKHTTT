import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DangNhap from './pages/DangNhap';
import DanhSachPYCXemPhong from './pages/DanhSachPYCXemPhong';
import ChiTietPYCXemPhong from './pages/ChiTietPYCXemPhong';
import GhiNhanXacNhanThue from './pages/GhiNhanXacNhanThue';
import MH_DanhSachHopDongChoLapYCTT from './pages/MH_DanhSachHopDongChoLapYCTT';
import MH_ChiTietYeuCauThanhToan from './pages/MH_ChiTietYeuCauThanhToan';
import MH_ThanhToanThanhCong_YCTT from './pages/MH_ThanhToanThanhCong_YCTT';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DangNhap />} />
        <Route path="/phieu-yeu-cau" element={<DanhSachPYCXemPhong />} />
        <Route path="/phieu-yeu-cau/:id" element={<ChiTietPYCXemPhong />} />
        <Route path="/ghi-nhan-xac-nhan-thue/:id" element={<GhiNhanXacNhanThue />} />
        <Route path="/danh-sach-hop-dong-yctt" element={<MH_DanhSachHopDongChoLapYCTT />} />
        <Route path="/chi-tiet-yctt/:maTT" element={<MH_ChiTietYeuCauThanhToan />} />
        <Route path="/thanh-toan-thanh-cong-yctt/:maTT" element={<MH_ThanhToanThanhCong_YCTT />} />
      </Routes>
    </Router>
  );
}

export default App;