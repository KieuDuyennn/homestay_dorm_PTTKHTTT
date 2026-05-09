import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import axios from 'axios';
import ModalXacNhanHuy from '../components/ModalXacNhanHuy';

const DanhSachLichHen = () => {
  const [user, setUser] = useState(null);
  const [dsLichHen, setDsLichHen] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' hoặc 'upcoming'
  const [processingMaYC, setProcessingMaYC] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, mayc: null });
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/');
    } else {
      setUser(JSON.parse(savedUser));
      fetchLichHen();
    }
  }, [navigate]);

  const fetchLichHen = async () => {
    try {
      // Chỉ lấy các phiếu có trạng thái 'Đang hẹn xem'
      console.log('[DanhSachLichHen] fetchLichHen -> gọi API danh-sach Đang hẹn xem');
      const response = await axios.get('http://localhost:3001/api/phieu-yeu-cau/danh-sach?trangthai=Đang hẹn xem');
      if (response.data.success) {
        console.log('[DanhSachLichHen] fetchLichHen -> số lịch nhận được:', response.data.data?.length || 0);
        setDsLichHen(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách lịch hẹn:', error);
    }
  };

  const handleThayDoi = (mayc) => {
    console.log('[DanhSachLichHen] click Thay đổi, mayc =', mayc);
    sessionStorage.setItem('currentMaYC', mayc);
    sessionStorage.setItem('editLichHenMode', 'true');
    navigate('/dat-lich-hen');
  };

  const handleHuyLich = (mayc) => {
    console.log('[DanhSachLichHen] mở modal Hủy lịch cho mayc =', mayc);
    setConfirmModal({ open: true, mayc });
  };

  const confirmHuyLich = async () => {
    const mayc = confirmModal.mayc;
    setProcessingMaYC(mayc);
    console.log('[DanhSachLichHen] bắt đầu gọi API Hủy lịch, mayc =', mayc);
    try {
      const res = await axios.delete(`http://localhost:3001/api/phieu-yeu-cau/huy-lich/${mayc}`);
      console.log('[DanhSachLichHen] response Hủy lịch:', res.data);

      if (res.data.success) {
        setDsLichHen(prev => prev.filter(item => item.mayc !== mayc));
        alert(`Đã hủy lịch ${mayc} thành công.`);
      } else {
        alert('Hủy lịch thất bại: ' + (res.data.message || 'Không rõ lý do'));
      }
    } catch (error) {
      console.error('[DanhSachLichHen] lỗi gọi API Hủy lịch:', error?.response?.data || error.message);
      alert('Lỗi hủy lịch: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingMaYC(null);
      setConfirmModal({ open: false, mayc: null });
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return { day: '--', month: '--', time: '--:--' };
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = `Tháng ${date.getMonth() + 1}`;
    
    // Convert to local time format HH:mm
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    return { day, month, time };
  };

  const filteredLichHen = dsLichHen.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') {
      if (!item.thoigianhenxem) return false;
      const hen = new Date(item.thoigianhenxem);
      return hen >= new Date();
    }
    return true;
  });

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full px-4 py-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold text-navy leading-tight mb-2">Lịch hẹn của tôi</h1>
          <p className="text-[14px] text-gray-500">Quản lý và theo dõi các cuộc hẹn xem phòng sanctuary của bạn.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all ${
              activeTab === 'all' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Tất cả lịch hẹn
          </button>
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all ${
              activeTab === 'upcoming' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Sắp tới
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredLichHen.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
              Không có lịch hẹn nào.
            </div>
          ) : (
            filteredLichHen.map((item) => {
              const { day, month, time } = formatDate(item.thoigianhenxem);
              
              // Xác định badge màu dựa trên thời gian
              let badgeText = "SẮP ĐẾN";
              let badgeColor = "bg-pink-50 text-primary border-pink-100";
              
              if (item.thoigianhenxem) {
                const henDate = new Date(item.thoigianhenxem);
                if (henDate < new Date()) {
                  badgeText = "ĐÃ XEM";
                  badgeColor = "bg-green-50 text-green-600 border-green-100";
                }
              }

              return (
                <div key={item.mayc} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
                  {/* Left: Date & Time */}
                  <div className="flex flex-col items-center shrink-0 w-[100px]">
                    <div className="bg-pink-50 rounded-xl p-3 text-center w-full mb-3">
                      <div className="text-[28px] font-bold text-primary leading-none mb-1">{day}</div>
                      <div className="text-[12px] font-medium text-primary/80">{month}</div>
                    </div>
                    <div className="font-bold text-[15px] text-navy">{time}</div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}>
                        {badgeText}
                      </span>
                      <h3 className="text-[20px] font-bold text-navy mt-1">{item.khach_hang?.hoten || 'Khách hàng mới'}</h3>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-500 text-[14px]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        {item.khach_hang?.sdt || 'Chưa cung cấp SĐT'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-[14px]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {item.loaihinhthue || item.loaiphong}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <button 
                        onClick={() => navigate(`/lich-hen/${item.mayc}`)}
                        className="px-5 py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-[14px] hover:bg-pink-50 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleThayDoi(item.mayc)}
                        disabled={processingMaYC === item.mayc}
                        className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-[14px] hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {processingMaYC === item.mayc ? 'Đang xử lý...' : 'Thay đổi'}
                      </button>
                      <button
                        onClick={() => handleHuyLich(item.mayc)}
                        disabled={processingMaYC === item.mayc}
                        className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-[14px] hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {processingMaYC === item.mayc ? 'Đang hủy...' : 'Hủy lịch'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <ModalXacNhanHuy
        open={confirmModal.open}
        title={'Bạn muốn hủy yêu cầu'}
        message={'Sau khi bạn hủy yêu cầu xem phòng thì yêu cầu này sẽ bị xóa khỏi hệ thống. Bạn có chắc chắn muốn hủy không?'}
        onConfirm={confirmHuyLich}
        onCancel={() => setConfirmModal({ open: false, mayc: null })}
        confirmLabel={'Xác nhận'}
        cancelLabel={'Đóng lại'}
      />
    </MainLayout>
  );
};

export default DanhSachLichHen;
