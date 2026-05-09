import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import ModalXacNhanChot from '../components/ModalXacNhanChot';
import axios from 'axios';

const ChiTietLichHen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chotItems, setChotItems] = useState({});  // Track cái nào được chốt: { "maphong|magiuong": true }
  const [isUpdating, setIsUpdating] = useState(false);
  const [chotModal, setChotModal] = useState({ open: false, item: null, itemKey: null });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/');
    } else {
      setUser(JSON.parse(savedUser));
      fetchChiTiet();
    }
  }, [id, navigate]);

  const fetchChiTiet = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/phieu-yeu-cau/chi-tiet/${id}`);
      if (response.data.success) {
        console.log('Chi tiết phiếu:', response.data.data);
        setData(response.data.data);

        const nextChotItems = {};
        const chiTietRows = response.data.data?.chi_tiet || [];
        chiTietRows.forEach(it => {
          if (it.trangthaichot === 'Chốt') {
            const roomKey = getRoomKey(it);
            if (roomKey) {
              nextChotItems[roomKey] = true;
            }
          }
        });
        setChotItems(nextChotItems);
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý click "Chốt" trên một phòng/giường
  const handleDaChon = (itemKey, item) => {
    console.log('[ChiTietLichHen] mở modal xác nhận chốt cho item:', itemKey);
    setChotModal({ open: true, item, itemKey });
  };

  // Xác nhận chốt phòng
  const confirmChot = async () => {
    const { item, itemKey } = chotModal;
    setIsUpdating(true);
    try {
      console.log('[ChiTietLichHen] bắt đầu chốt phòng:', itemKey);

      const allItems = data.chi_tiet || [];
      const isNguyenCanRoom = Boolean(item.isNguyenCanRoom);
      const selectedRoomKey = isNguyenCanRoom ? item.maphong : itemKey;
      const selectedItems = isNguyenCanRoom
        ? allItems.filter(it => (it.maphong || it.giuong?.phong?.maphong) === item.maphong)
        : [{ maphong: item.maphong, magiuong: item.magiuong }];

      // 1. Update trangthaichot = 'Chốt' cho item / toàn bộ giường của phòng nguyên căn
      for (const selectedItem of selectedItems) {
        await axios.patch(
          `http://localhost:3001/api/phieu-yeu-cau/update-trang-thai-chot`,
          {
            mayc: id,
            maphong: selectedItem.maphong,
            magiuong: selectedItem.magiuong,
            trangthaichot: 'Chốt'
          }
        );
      }

      // 2. Xóa các item không được chốt
      const itemsToDelete = allItems.filter(it => {
        if (isNguyenCanRoom) {
          const itemRoom = it.maphong || it.giuong?.phong?.maphong;
          return itemRoom !== item.maphong;
        }
        const itKey = getRoomKey(it);
        return itKey !== itemKey;
      });

      for (const deleteItem of itemsToDelete) {
        await axios.delete(
          `http://localhost:3001/api/phieu-yeu-cau/chi-tiet/${id}/${deleteItem.maphong}/${deleteItem.magiuong}`
        );
      }

      // 3. Update state UI - mark này là chốt
      setChotItems({ [selectedRoomKey]: true });

      // 4. Reload chi tiết
      await fetchChiTiet();
      console.log('[ChiTietLichHen] chốt phòng thành công!');
      setChotModal({ open: false, item: null, itemKey: null });
    } catch (error) {
      console.error('Lỗi khi chốt phòng:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUpdating(false);
    }
  };

  // Xử lý click "Hoàn thành tư vấn"
  const handleHoanThanhTuVan = async () => {
    setIsUpdating(true);
    try {
      const res = await axios.patch(
        `http://localhost:3001/api/phieu-yeu-cau/update-trang-thai`,
        {
          mayc: id,
          trangthai: 'Cần xác nhận'
        }
      );

      if (res.data.success) {
        alert('Cập nhật trạng thái phiếu thành "Cần xác nhận" thành công!');
        navigate('/lich-hen');
      } else {
        alert('Lỗi: ' + (res.data.message || 'Không rõ lý do'));
      }
    } catch (error) {
      console.error('Lỗi hoàn thành tư vấn:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDateString = (isoString) => {
    if (!isoString) return '--/--/---- --:--';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  };

  if (!user || loading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-full text-gray-500">Đang tải dữ liệu...</div>
    </MainLayout>
  );

  if (!data) return (
    <MainLayout>
      <div className="flex items-center justify-center h-full text-red-500 font-medium">Không tìm thấy thông tin lịch hẹn</div>
    </MainLayout>
  );

  const khachHang = data.khach_hang || {};
  const dsPhong = data.chi_tiet || [];

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isOgep = (loai) => {
    if (!loai) return false;
    return loai.toLowerCase().includes('ở ghép') || loai.toLowerCase().includes('oghep');
  };

  const isNguyenCan = (loai) => {
    if (!loai) return false;
    const value = loai.toLowerCase();
    return value.includes('nguyên') || value.includes('nguyen');
  };

  const getRoomKey = (item) => {
    const phong = item.giuong?.phong || {};
    const maphong = item.maphong || phong.maphong || '';
    const macn = item.macn || phong.macn || '';
    return `${maphong}|${macn}`;
  };

  const groupByRoom = (items) => {
    const map = {};
    items.forEach(it => {
      // Parse structure: chi_tiet có giuong.phong
      const phong = it.giuong?.phong || {};
      const maphong = it.maphong || phong.maphong;
      const macn = it.macn || phong.macn;
      const roomId = `${maphong}|${macn}`;
      if (!map[roomId]) {
        map[roomId] = { 
          phong: phong, 
          macn: macn, 
          maphong: maphong, 
          giuongs: [] 
        };
      }
      if (it.magiuong) map[roomId].giuongs.push(it.magiuong);
    });
    return Object.values(map);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full px-4 py-4">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/lich-hen')}
          className="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors mb-4 group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span className="text-[14px] font-medium">Quay lại</span>
        </button>

        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-[32px] font-extrabold text-navy leading-tight">Chi tiết hồ sơ khách hàng</h1>
          <p className="text-[14px] text-gray-400 mt-1">Mã lịch hẹn: <span className="font-bold text-navy">#{data.mayc}</span></p>
        </div>

        {/* Section 1: Thông tin khách hàng */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-md mb-4">
          <h2 className="text-[18px] font-bold text-navy mb-4">Thông tin khách hàng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="md:col-span-2 flex items-center gap-6 mb-2">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-lg">{getInitials(khachHang.hoten)}</div>
              <div>
                <div className="text-[13px] text-gray-400">Khách hàng</div>
                <div className="text-[18px] font-extrabold text-navy">{khachHang.hoten}</div>
                <div className="text-[13px] text-gray-400 mt-1">{khachHang.email || ''}</div>
              </div>
            </div>
            {/* Row 1 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span className="text-[13px] font-medium">Họ và Tên</span>
              </div>
              <p className="text-[16px] font-bold text-navy">{khachHang.hoten}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span className="text-[13px] font-medium">Số điện thoại</span>
              </div>
              <p className="text-[16px] font-bold text-navy">{khachHang.sdt}</p>
            </div>

            {/* Row 2 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-[13px] font-medium">Giới tính</span>
              </div>
              <p className="text-[14px] font-medium text-navy">{khachHang.gioitinh || 'Chưa cập nhật'}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <span className="text-[13px] font-medium">Quốc tịch</span>
              </div>
              <p className="text-[14px] font-medium text-navy">{khachHang.quoctich || 'Việt Nam'}</p>
            </div>

            {/* Row 3 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="7" y1="8" x2="7" y2="8"></line><line x1="7" y1="12" x2="7" y2="12"></line><line x1="7" y1="16" x2="7" y2="16"></line></svg>
                <span className="text-[13px] font-medium">Số CCCD/CMND</span>
              </div>
              <p className="text-[14px] font-medium text-navy">{khachHang.socccd}</p>
            </div>

            <div className="md:col-span-2 border-t border-gray-50 pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[12px] font-medium text-gray-400 block">Hình thức thuê</span>
                <p className="text-[14px] font-medium text-navy">{data.loaihinhthue || data.loaiphong}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span className="text-[12px] font-medium">Ngày dự kiến xem phòng</span>
                </div>
                <p className="text-[14px] font-medium text-navy">{formatDateString(data.thoigianhenxem).split(' - ')[1]}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[12px] font-medium text-gray-400 block">Thời hạn thuê</span>
                <p className="text-[14px] font-medium text-navy">{data.thoihanthue} tháng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Thông tin phòng tư vấn */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-md mb-4">
          <h2 className="text-[18px] font-bold text-navy mb-4">Thông tin phòng tư vấn</h2>

          <div className="space-y-3">
            {dsPhong.length === 0 ? (
              <div className="bg-pink-50/30 border border-dashed border-pink-100 rounded-2xl p-6 text-center">
                <p className="text-gray-400 text-[13px]">Chưa có phòng nào được chọn để tư vấn</p>
                <div className="mt-3">
                  <button onClick={() => navigate('/ket-qua-tim-kiem')} className="text-pink-600 font-semibold underline">Tìm phòng để thêm</button>
                </div>
              </div>
            ) : (
              (() => {
                const loai = data.loaihinhthue || data.loaiphong || '';
                if (isNguyenCan(loai)) {
                  const groups = groupByRoom(dsPhong);
                  return groups.map((g, idx) => {
                    const itemKey = g.roomId || `${g.maphong}|${g.giuongs[0] || 'null'}`;
                    const isCot = chotItems[itemKey];
                    return (
                      <div key={idx} className="relative bg-pink-50/30 border border-pink-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã chi nhánh</span>
                            <p className="text-[14px] font-bold text-navy">{g.macn || 'CN01'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã phòng</span>
                            <p className="text-[14px] font-bold text-navy">{g.maphong || 'N/A'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã giường (toàn bộ giường)</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {g.giuongs.length ? g.giuongs.map((mg, i) => (
                                  <span key={i} className="text-[13px] bg-white border px-3 py-1 rounded-md text-navy font-medium">{mg}</span>
                                )) : (<span className="text-[13px] text-gray-400">Chưa có giường cụ thể</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => handleDaChon(itemKey, { maphong: g.maphong, macn: g.macn, giuongs: g.giuongs, isNguyenCanRoom: true })}
                            disabled={isUpdating || isCot}
                            className={`inline-flex items-center gap-2 text-white text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
                              isCot
                                ? 'bg-green-600 cursor-not-allowed'
                                : 'bg-pink-600 hover:bg-pink-700 active:scale-95'
                            } disabled:opacity-60`}
                          >
                            {isCot ? '✓ Đã chốt' : 'Chốt'}
                          </button>
                        </div>
                      </div>
                    );
                  });
                }

                if (isOgep(loai)) {
                  const groups = groupByRoom(dsPhong);
                  return groups.map((g, idx) => {
                    const itemKey = g.roomId || `${g.maphong}|${g.giuongs[0] || 'null'}`;
                    const isCot = chotItems[itemKey];
                    return (
                      <div key={idx} className="relative bg-pink-50/30 border border-pink-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã chi nhánh</span>
                            <p className="text-[14px] font-bold text-navy">{g.macn || 'CN01'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã phòng</span>
                            <p className="text-[14px] font-bold text-navy">{g.maphong || 'N/A'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã giường (ở ghép)</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {g.giuongs.length ? g.giuongs.map((mg, i) => (
                                  <span key={i} className="text-[13px] bg-white border px-3 py-1 rounded-md text-navy font-medium">{mg}</span>
                                )) : (<span className="text-[13px] text-gray-400">Chưa có giường cụ thể</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => handleDaChon(itemKey, { maphong: g.maphong, magiuong: g.giuongs[0] })}
                            disabled={isUpdating || isCot}
                            className={`inline-flex items-center gap-2 text-white text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
                              isCot
                                ? 'bg-green-600 cursor-not-allowed'
                                : 'bg-pink-600 hover:bg-pink-700 active:scale-95'
                            } disabled:opacity-60`}
                          >
                            {isCot ? '✓ Đã chốt' : 'Chốt'}
                          </button>
                        </div>
                      </div>
                    );
                  });
                }

                // Nếu là thuê cá nhân: show mã phòng + mã chi nhánh + mã giường (mỗi item là một giường)
                const loaiLower = loai.toLowerCase();
                if (loaiLower.includes('cá nhân') || loaiLower.includes('ca nhan') || loaiLower.includes('thuê cá nhân') || loaiLower.includes('thue ca nhan')) {
                  return dsPhong.map((item, idx) => {
                    const phong = item.giuong?.phong || {};
                    const macn = item.macn || phong.macn;
                    const maphong = item.maphong || phong.maphong;
                    const loaihinh = phong.loaihinh;
                    const itemKey = `${maphong}|${item.magiuong}`;
                    const isCot = chotItems[itemKey];
                    return (
                      <div key={idx} className="relative bg-pink-50/30 border border-pink-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã chi nhánh</span>
                            <p className="text-[14px] font-bold text-navy">{macn || 'CN01'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã phòng</span>
                            <p className="text-[14px] font-bold text-navy">{maphong}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã giường</span>
                            <p className="text-[14px] font-bold text-navy">{item.magiuong || 'N/A'}</p>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:col-span-1">
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Đối tượng</span>
                              <p className="text-[14px] font-bold text-navy">{loaihinh || 'Cá nhân'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => handleDaChon(itemKey, { maphong, magiuong: item.magiuong })}
                            disabled={isUpdating || isCot}
                            className={`inline-flex items-center gap-2 text-white text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
                              isCot
                                ? 'bg-green-600 cursor-not-allowed'
                                : 'bg-pink-600 hover:bg-pink-700 active:scale-95'
                            } disabled:opacity-60`}
                          >
                            {isCot ? '✓ Đã chốt' : 'Chốt'}
                          </button>
                        </div>
                      </div>
                    );
                  });
                }

                // Mặc định: hiển thị từng mục (fallback)
                return dsPhong.map((item, idx) => {
                  const phong = item.giuong?.phong || {};
                  const macn = item.macn || phong.macn;
                  const maphong = item.maphong || phong.maphong;
                  const itemKey = `${maphong}|${item.magiuong}`;
                  const isCot = chotItems[itemKey];
                  return (
                    <div key={idx} className="relative bg-pink-50/30 border border-pink-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã chi nhánh</span>
                          <p className="text-[14px] font-bold text-navy">{macn || 'CN01'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã phòng</span>
                          <p className="text-[14px] font-bold text-navy">{maphong}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã giường</span>
                          <p className="text-[14px] font-bold text-navy">{item.magiuong || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => handleDaChon(itemKey, { maphong, magiuong: item.magiuong })}
                          disabled={isUpdating || isCot}
                          className={`inline-flex items-center gap-2 text-white text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
                            isCot
                              ? 'bg-green-600 cursor-not-allowed'
                              : 'bg-pink-600 hover:bg-pink-700 active:scale-95'
                          } disabled:opacity-60`}
                        >
                          {isCot ? '✓ Đã chốt' : 'Chốt'}
                        </button>
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </div>

        {/* Footer: Actions */}
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-[24px] p-8 border border-pink-100 flex flex-wrap gap-3 justify-start">
          <button
            onClick={handleHoanThanhTuVan}
            disabled={isUpdating || Object.keys(chotItems).length === 0}
            className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-8 py-4 rounded-xl text-[16px] font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isUpdating ? 'Đang xử lý...' : 'Hoàn thành tư vấn'}
          </button>
        </div>
      </div>

      {/* Modal Xác nhận chốt */}
      <ModalXacNhanChot
        open={chotModal.open}
        onConfirm={confirmChot}
        onCancel={() => setChotModal({ open: false, item: null, itemKey: null })}
        confirmLabel="Xác nhận"
        cancelLabel="Hủy"
      />
    </MainLayout>
  );
};

export default ChiTietLichHen;
