import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import RoomCard from '../components/RoomCard';
import EmptyState from '../components/EmptyState';

export default function KetQuaTimKiemPhong() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Khôi phục selectedRooms từ sessionStorage khi mount
  const [selectedRooms, setSelectedRooms] = React.useState(() => {
    try { return JSON.parse(sessionStorage.getItem('selectedRooms') || '[]'); } catch { return []; }
  });

  // Hàm toggle chọn/bỏ phòng
  const handleToggleRoom = (room) => {
    setSelectedRooms(prev => {
      const exists = prev.find(r => r.id === room.id);
      const updated = exists ? prev.filter(r => r.id !== room.id) : [...prev, room];
      sessionStorage.setItem('selectedRooms', JSON.stringify(updated));
      return updated;
    });
  };

  // Label đơn vị sẽ được tính sau khi có loaiKetQua
  
  // Lấy thông tin nhu cầu thuê từ URL params
  const hinhThucThue = searchParams.get('hinhThucThue') || '';
  const soNguoi = searchParams.get('soNguoi') || '1';
  const mucGia = searchParams.get('mucGia') || '0';
  const chiNhanh = searchParams.get('chiNhanh') || '';
  const gioiTinh = searchParams.get('gioiTinh') || '';
  const maYC = searchParams.get('maYC') || '';

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [loaiKetQua, setLoaiKetQua] = useState('');

  // Label đơn vị: phòng hay giường
  const donViLabel = loaiKetQua === 'ca-nhan' ? 'giường' : 'phòng';

  // Ảnh phòng ngẫu nhiên từ Unsplash để làm phong phú UI
  const ROOM_IMAGES = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1e54117320?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
  ];

  // Transform dữ liệu từ API thành format của RoomCard
  // Mỗi item bao gồm: UI display fields + original data fields để lưu vào sessionStorage
  const transformData = (apiData, loai) => {
    if (loai === 'ca-nhan') {
      // apiData là mảng giường
      return apiData.map((g, i) => ({
        // UI display fields
        id: `${g.maphong}-${g.magiuong}`,
        badge: 'CÒN TRỐNG',
        title: `Giường ${g.magiuong} - Phòng ${g.maphong}`,
        location: g.phong?.chi_nhanh?.tencn || g.phong?.macn || '',
        rating: (4.3 + (i % 7) * 0.1).toFixed(1),
        peopleCount: `1 giường • ${g.phong?.gioitinh || 'Hỗn hợp'}`,
        price: (g.phong?.tienthuethang || 0).toLocaleString('vi-VN'),
        image: ROOM_IMAGES[i % ROOM_IMAGES.length],
        // Original data for ChiTiet storage
        maphong: g.maphong,
        macn: g.phong?.macn || '',
        magiuong: g.magiuong,
      }));
    }

    if (loai === 'nguyen-can') {
      // apiData là mảng phòng nguyên căn
      return apiData.map((p, i) => ({
        // UI display fields
        id: p.maphong,
        badge: 'CHO THUÊ NGUYÊN CĂN',
        title: `Phòng ${p.maphong}`,
        location: p.chi_nhanh?.tencn || p.macn || '',
        rating: (4.3 + (i % 7) * 0.1).toFixed(1),
        peopleCount: `${p.soluonggiuong || 1} giường • ${p.gioitinh || 'Hỗn hợp'}`,
        price: (p.tongTienThue || p.tienthuethang || 0).toLocaleString('vi-VN'),
        image: ROOM_IMAGES[i % ROOM_IMAGES.length],
        // Original data for ChiTiet storage
        maphong: p.maphong,
        macn: p.macn || '',
        // Nguyên căn: lưu toàn bộ giường của phòng để DatLichHen bung ra chi_tiet
        magiuong: null,
        dsGiuong: p.dsGiuong || [],
        dsMagiuong: p.dsMagiuong || (p.dsGiuong || []).map(g => g.magiuong).filter(Boolean),
      }));
    }

    if (loai === 'o-ghep') {
      // apiData là mảng tổ hợp giường trong phòng ở ghép
      return apiData.map((p, i) => {
        const dsGiuong = p.dsGiuong || [];
        const dsMagiuong = p.dsMagiuong || dsGiuong.map(g => g.magiuong).filter(Boolean);
        return {
          // UI display fields
          id: `${p.maphong}-${dsMagiuong.join('-')}`,
          badge: `CÒN TRỐNG ${dsMagiuong.length} CHỖ`,
          title: `Phòng ${p.maphong}`,
          location: p.chi_nhanh?.tencn || p.macn || '',
          rating: (4.3 + (i % 7) * 0.1).toFixed(1),
          peopleCount: `Giường: ${dsMagiuong.join(', ')}`,
          price: (p.tongTienThue || p.tienthuethang || 0).toLocaleString('vi-VN'),
          image: ROOM_IMAGES[i % ROOM_IMAGES.length],
          // Original data for ChiTiet storage
          maphong: p.maphong,
          macn: p.macn || '',
          magiuong: dsMagiuong[0] || null,
          dsMagiuong,
          dsGiuong,
        };
      });
    }

    return [];
  };

  useEffect(() => {
    if (!hinhThucThue) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const params = new URLSearchParams({ hinhThucThue, soNguoi, mucGia, chiNhanh, gioiTinh });

    fetch(`http://localhost:3001/api/phieu-yeu-cau/tim-kiem-phong?${params.toString()}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setLoaiKetQua(json.loai);
          setResults(transformData(json.data, json.loai));
        } else {
          setResults([]);
        }
      })
      .catch(err => {
        console.error('Lỗi tìm kiếm phòng:', err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [hinhThucThue, soNguoi, mucGia, chiNhanh, gioiTinh]);

  const getSubtitle = () => {
    if (loaiKetQua === 'nguyen-can') return `Thuê nguyên căn • ${chiNhanh || 'Tất cả chi nhánh'}`;
    if (loaiKetQua === 'ca-nhan') return `Cá nhân • ${chiNhanh || 'Tất cả chi nhánh'}`;
    if (loaiKetQua === 'o-ghep') return `Nhóm ${soNguoi} người • Ở ghép • ${chiNhanh || 'Tất cả chi nhánh'}`;
    return hinhThucThue || 'Kết quả';
  };

  return (
    <MainLayout>
      <div className="bg-[#f9fafb] flex flex-col items-start w-full min-h-[calc(100vh-60px)] pb-32">
        <div className="px-8 pt-8 w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[36px] tracking-[0.37px]">
              Kết quả Tìm kiếm
            </h1>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="font-['Inter',sans-serif] font-normal text-[#4a5565] text-[16px]">
                {getSubtitle()}
              </span>
            </div>
          </div>

          {/* Nội dung kết quả */}
          {loading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <svg className="animate-spin h-10 w-10 text-[#e60076]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : results.length > 0 ? (
            <>
              {/* Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {results.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={!!selectedRooms.find(r => r.id === room.id)}
                    onToggle={handleToggleRoom}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-3 mt-12 w-full">
                <button className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center opacity-50 cursor-not-allowed border border-gray-100 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-[10px] bg-gradient-to-r from-[#e60076] to-[#ec003f] flex items-center justify-center shadow-md">
                  <span className="font-['Inter',sans-serif] font-medium text-white text-[16px]">1</span>
                </button>
                <button className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
                  <span className="font-['Inter',sans-serif] font-medium text-[#4a5565] text-[16px]">2</span>
                </button>
                <span className="font-['Inter',sans-serif] font-normal text-[#6a7282] text-[16px] px-1">...</span>
                <button className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
                  <span className="font-['Inter',sans-serif] font-medium text-[#4a5565] text-[16px]">12</span>
                </button>
                <button className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <EmptyState onBack={() => navigate('/dang-ky-thue-phong')} />
          )}
        </div>
      </div>

      {/* Floating Action Bar — luôn hiển thị khi có kết quả */}
      {results.length > 0 && (
        <div className="fixed bottom-0 left-0 lg:left-[256px] right-0 bg-[#1e2939] shadow-[0px_-10px_30px_0px_rgba(0,0,0,0.15)] px-8 py-4 z-40 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Đếm số lượng */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              {selectedRooms.length > 0 ? (
                <span className="font-['Inter',sans-serif] font-medium text-white text-[16px]">
                  Đã chọn{' '}
                  <span className="bg-[#e60076] text-white font-bold px-2 py-0.5 rounded-full text-[14px] mx-1">
                    {selectedRooms.length}
                  </span>
                  {donViLabel}
                </span>
              ) : (
                <span className="font-['Inter',sans-serif] font-normal text-white/60 text-[15px]">
                  Chưa chọn {donViLabel} nào
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/danh-sach-phong-chon')}
                disabled={selectedRooms.length === 0}
                className="bg-[#364153] hover:bg-[#4a5565] disabled:opacity-40 transition-colors rounded-[10px] px-5 py-2.5"
              >
                <span className="font-['Inter',sans-serif] font-medium text-white text-[15px]">Xem danh sách</span>
              </button>
              <button
                onClick={() => navigate('/dat-lich-hen')}
                disabled={selectedRooms.length === 0}
                className="bg-gradient-to-r from-[#e60076] to-[#ec003f] hover:opacity-90 disabled:opacity-40 transition-opacity shadow-md rounded-[10px] px-5 py-2.5"
              >
                <span className="font-['Inter',sans-serif] font-medium text-white text-[15px]">Tiếp tục đặt lịch xem</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
