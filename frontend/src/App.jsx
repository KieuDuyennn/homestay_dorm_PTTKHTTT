import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DangNhap from './pages/DangNhap';
import DanhSachPYCXemPhong from './pages/DanhSachPYCXemPhong';
import ChiTietPYCXemPhong from './pages/ChiTietPYCXemPhong';
import GhiNhanXacNhanThue from './pages/GhiNhanXacNhanThue';
import DangKyThuePhong from './pages/DangKyThuePhong';
import KetQuaTimKiemPhong from './pages/KetQuaTimKiemPhong';
import DanhSachPhongChon from './pages/DanhSachPhongChon';
import DatLichHen from './pages/DatLichHen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DangNhap />} />
        <Route path="/dang-ky-thue-phong" element={<DangKyThuePhong />} />
        <Route path="/ket-qua-tim-kiem" element={<KetQuaTimKiemPhong />} />
        <Route path="/danh-sach-phong-chon" element={<DanhSachPhongChon />} />
        <Route path="/dat-lich-hen" element={<DatLichHen />} />
        <Route path="/phieu-yeu-cau" element={<DanhSachPYCXemPhong />} />
        <Route path="/phieu-yeu-cau/:id" element={<ChiTietPYCXemPhong />} />
        <Route path="/ghi-nhan-xac-nhan-thue/:id" element={<GhiNhanXacNhanThue />} />
      </Routes>
    </Router>
  );
}

export default App;