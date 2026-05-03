// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import MainLayout from './components/layout/MainLayout';
// import LoginPage from './pages/auth/LoginPage';
// import DanhSachThanhToanCocPage from './pages/deposit/DanhSachThanhToanCocPage';
// import ChiTietThanhToanCocPage from './pages/deposit/ChiTietThanhToanCocPage';
// import GhiNhanMinhChungPage from './pages/deposit/GhiNhanMinhChungPage';
// import PheDuyetGiaoDichPage from './pages/deposit/PheDuyetGiaoDichPage';

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<LoginPage />} />
//           <Route element={<MainLayout />}>
//             <Route path="/" element={<DanhSachThanhToanCocPage />} />
//             <Route path="/deposit" element={<DanhSachThanhToanCocPage />} />
//             <Route path="/deposit/:id" element={<ChiTietThanhToanCocPage />} />
//             <Route path="/deposit/:id/evidence" element={<GhiNhanMinhChungPage />} />
//             <Route path="/deposit/:id/approve" element={<PheDuyetGiaoDichPage />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;
import { useEffect, useState } from 'react'
import { supabase } from './services/api'

function App() {
  const [status, setStatus] = useState('Đang kiểm tra...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Thử lấy session - đây là cách nhanh nhất để check URL và Key
        const { error } = await supabase.auth.getSession()

        if (error) throw error

        setStatus('✅ Kết nối Supabase thành công!')
        console.log("Kết nối OK!")
      } catch (err) {
        setStatus('❌ Kết nối thất bại: ' + err.message)
        console.error(err)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>HomeStay Dorm - FE Test</h1>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{status}</p>
      <p>Mở <b>F12 / Console</b> để xem chi tiết nhé!</p>
    </div>
  )
}

export default App