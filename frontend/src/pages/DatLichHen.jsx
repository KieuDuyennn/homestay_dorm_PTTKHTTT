import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

const MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
const DAYS_OF_WEEK = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// Các khung giờ và giờ bắt đầu tương ứng (UTC)
const TIME_SLOTS = [
  { label: '09:00 - 10:00', gioUTC: 2 },  // 09:00 ICT = 02:00 UTC
  { label: '10:00 - 11:00', gioUTC: 3 },
  { label: '11:00 - 12:00', gioUTC: 4 },
  { label: '14:00 - 15:00', gioUTC: 7 },
  { label: '15:00 - 16:00', gioUTC: 8 },
  { label: '16:00 - 17:00', gioUTC: 9 },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function formatNgay(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function DatLichHen() {
  const navigate = useNavigate();
  const selectedRooms = JSON.parse(sessionStorage.getItem('selectedRooms') || '[]');
  const editLichHenMode = sessionStorage.getItem('editLichHenMode') === 'true';

  // Lấy manv từ localStorage (user đang đăng nhập)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const manv = currentUser.manv || 'NV02'; // fallback cho demo

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Giờ đã bận (mảng số giờ UTC)
  const [gioBoi, setGioBoi] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Load giờ bận mỗi khi đổi ngày
  useEffect(() => {
    if (!selectedDay) return;

    const ngay = formatNgay(currentYear, currentMonth, selectedDay);
    setLoadingSlots(true);
    setSelectedSlot(''); // reset slot đã chọn khi đổi ngày

    fetch(`http://localhost:3001/api/phieu-yeu-cau/gio-ban?manv=${manv}&ngay=${ngay}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setGioBoi(json.data.map(d => d.gio));
        } else {
          setGioBoi([]);
        }
      })
      .catch(() => setGioBoi([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDay, currentMonth, currentYear, manv]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
  };

  const selectedDateLabel = selectedDay
    ? `${DAYS_OF_WEEK[new Date(currentYear, currentMonth, selectedDay).getDay()]}, ngày ${selectedDay}`
    : 'Chưa chọn ngày';

  const handleLuuLichHen = async () => {
    if (!selectedDay || !selectedSlot) {
      alert('Vui lòng chọn ngày và khung giờ!');
      return;
    }
    setIsSubmitting(true);

    try {
      let maYC = sessionStorage.getItem('currentMaYC');

      // Nếu chưa có maYC, phải tạo phiếu yêu cầu trước
      if (!maYC) {
        const formDataStr = sessionStorage.getItem('formDataYeuCau');
        if (!formDataStr) {
          alert('Dữ liệu form không tìm thấy. Vui lòng quay lại và điền lại thông tin.');
          setIsSubmitting(false);
          return;
        }
        
        const formData = JSON.parse(formDataStr);
        const chiTiet = selectedRooms.flatMap(r => {
          const dsMagiuong = Array.isArray(r.dsMagiuong) && r.dsMagiuong.length > 0
            ? r.dsMagiuong
            : (Array.isArray(r.dsGiuong) && r.dsGiuong.length > 0
              ? r.dsGiuong.map(g => g.magiuong).filter(Boolean)
              : [r.magiuong].filter(Boolean));

          return dsMagiuong.map(magiuong => ({
            maphong: r.maphong || null,
            macn: r.macn || null,
            magiuong,
          }));
        });

        console.log('=== Tạo phiếu từ DatLichHen ===');
        console.log('FormData:', formData);
        console.log('ChiTiet:', chiTiet);

        // Create phieu với formData + ChiTiet
        const payload = {
          ...formData,
          MaNV: currentUser.manv || null,
          ChiTiet: chiTiet,
        };

        const createRes = await fetch('http://localhost:3001/api/phieu-yeu-cau/dang-ky', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then(r => r.json());

        if (!createRes.success || !createRes.data?.MaYC) {
          alert('Lỗi tạo phiếu: ' + (createRes.message || 'Không rõ lý do'));
          setIsSubmitting(false);
          return;
        }

        maYC = createRes.data.MaYC;
        sessionStorage.setItem('currentMaYC', maYC);
        console.log('Phiếu tạo thành công! MaYC:', maYC);
      }

      // Cập nhật lịch hẹn với thời gian
      const gioMap = {
        '09:00 - 10:00': '02:00:00',
        '10:00 - 11:00': '03:00:00',
        '11:00 - 12:00': '04:00:00',
        '14:00 - 15:00': '07:00:00',
        '15:00 - 16:00': '08:00:00',
        '16:00 - 17:00': '09:00:00',
      };
      const ngayStr = formatNgay(currentYear, currentMonth, selectedDay);
      const gioStr = gioMap[selectedSlot] || '02:00:00';
      const thoigianhenxem = `${ngayStr}T${gioStr}`;

      await fetch('http://localhost:3001/api/phieu-yeu-cau/cap-nhat-lich-hen', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mayc: maYC, thoigianhenxem }),
      });

      sessionStorage.removeItem('selectedRooms');
      sessionStorage.removeItem('currentMaYC');
      sessionStorage.removeItem('formDataYeuCau');
      sessionStorage.removeItem('editLichHenMode');
      
      console.log('[DatLichHen] Lịch hẹn tạo/cập nhật thành công! Redirect tới Chi tiết:', maYC);
      navigate(`/lich-hen/${maYC}`);
    } catch (err) {
      console.error('Lỗi lưu lịch hẹn:', err);
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-[#f9fafb] min-h-screen px-8 pt-8 pb-16 max-w-2xl mx-auto w-full">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#4a5565] hover:text-[#e60076] transition-colors mb-4 font-['Inter',sans-serif] text-[15px]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Quay lại
        </button>

        <h1 className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[30px] mb-1">
          Đặt lịch hẹn xem phòng
        </h1>
        <p className="font-['Inter',sans-serif] text-[#6a7282] text-[15px] mb-2">
          Chọn thời gian phù hợp để tham quan những căn phòng bạn quan tâm.
        </p>
        {/* Badge nhân viên */}
        <div className="inline-flex items-center gap-2 bg-[#fce7f3] border border-[#fccee8] rounded-full px-3 py-1 mb-6">
          <div className="w-5 h-5 rounded-full bg-[#e60076] flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span className="font-['Inter',sans-serif] text-[#e60076] text-[13px] font-medium">
            {currentUser.name || manv} — {currentUser.role || 'Nhân viên'}
          </span>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[18px]">
              {MONTHS[currentMonth]} Năm {currentYear}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#fce7f3] flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#fce7f3] flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_OF_WEEK.map(d => (
              <div key={d} className="text-center font-['Inter',sans-serif] font-semibold text-[#9ca3af] text-[13px] py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const isSelected = day === selectedDay;
              const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              return (
                <button
                  key={day}
                  disabled={isPast}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    w-full aspect-square flex items-center justify-center rounded-full text-[15px] font-['Inter',sans-serif] font-medium transition-all
                    ${isSelected ? 'bg-gradient-to-br from-[#e60076] to-[#ec003f] text-white shadow-md' : ''}
                    ${!isSelected && !isPast ? 'hover:bg-[#fce7f3] text-[#1e2939] cursor-pointer' : ''}
                    ${isPast ? 'text-[#d1d5db] cursor-not-allowed' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#fce7f3] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e60076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <p className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[16px]">Chọn thời gian</p>
              <p className="font-['Inter',sans-serif] text-[#9ca3af] text-[13px]">{selectedDateLabel}</p>
            </div>
            {loadingSlots && (
              <svg className="animate-spin h-4 w-4 text-[#e60076] ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map(slot => {
              const isBusy = gioBoi.includes(slot.gioUTC);
              const isActive = slot.label === selectedSlot;
              return (
                <button
                  key={slot.label}
                  disabled={isBusy || loadingSlots || !selectedDay}
                  onClick={() => setSelectedSlot(slot.label)}
                  className={`
                    relative rounded-[10px] py-2.5 px-2 text-[14px] font-['Inter',sans-serif] font-medium text-center transition-all
                    ${isActive ? 'bg-gradient-to-r from-[#e60076] to-[#ec003f] text-white shadow-md' : ''}
                    ${!isActive && !isBusy && selectedDay ? 'bg-[#fdf2f8] text-[#1e2939] hover:border hover:border-[#e60076] border border-transparent' : ''}
                    ${isBusy ? 'bg-gray-100 text-[#9ca3af] cursor-not-allowed' : ''}
                    ${!selectedDay && !isBusy ? 'bg-gray-50 text-[#d1d5db] cursor-not-allowed' : ''}
                  `}
                >
                  {slot.label}
                  {isBusy && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gray-400 text-white text-[9px] font-bold px-1 rounded-full">Bận</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-[12px] font-['Inter',sans-serif] text-[#9ca3af]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#e60076] to-[#ec003f]"></div>
              <span>Đang chọn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
              <span>Đã bận</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#fdf2f8]"></div>
              <span>Có thể chọn</span>
            </div>
          </div>


        </div>

        {/* Phòng đã chọn */}
        {selectedRooms.length > 0 && (
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[16px] mb-4">
              Phòng đã chọn ({selectedRooms.length})
            </h3>
            <div className="flex flex-col gap-3">
              {selectedRooms.map((room) => (
                <div key={room.id} className="flex items-center gap-3">
                  <img src={room.image} alt={room.title} className="w-12 h-12 rounded-[8px] object-cover shrink-0" />
                  <div>
                    <p className="font-['Inter',sans-serif] font-semibold text-[#1e2939] text-[14px]">{room.title}</p>
                    <p className="font-['Inter',sans-serif] text-[#9ca3af] text-[12px]">{room.location}</p>
                  </div>
                </div>
              ))}
            </div>
            {selectedSlot && selectedDay && (
              <>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <span className="font-['Inter',sans-serif] text-[#6a7282] text-[14px]">Ngày hẹn</span>
                  <span className="font-['Inter',sans-serif] font-semibold text-[#1e2939] text-[14px]">
                    {String(selectedDay).padStart(2,'0')}/{String(currentMonth+1).padStart(2,'0')}/{currentYear}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-['Inter',sans-serif] text-[#6a7282] text-[14px]">Khung giờ</span>
                  <span className="font-['Inter',sans-serif] font-semibold text-[#1e2939] text-[14px]">{selectedSlot}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Hotline + CTA */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 text-center">
          <button
            onClick={handleLuuLichHen}
            disabled={isSubmitting || !selectedDay || !selectedSlot}
            className="w-full bg-gradient-to-r from-[#e60076] to-[#ec003f] text-white font-['Inter',sans-serif] font-bold text-[16px] py-4 rounded-[12px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Đang lưu...' : (editLichHenMode ? 'Lưu thay đổi' : 'Lưu lịch hẹn')}
          </button>
          <p className="font-['Inter',sans-serif] text-[#9ca3af] text-[12px] mt-3">
            Bằng cách nhấn nút trên, bạn xác nhận sẽ đến xem phòng theo lịch đã chọn.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
