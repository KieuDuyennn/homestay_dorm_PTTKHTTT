import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

export default function DanhSachPhongChon() {
  const navigate = useNavigate();

  // Lấy danh sách phòng đã chọn từ sessionStorage
  const selectedRooms = JSON.parse(sessionStorage.getItem('selectedRooms') || '[]');

  const handleRemove = (id) => {
    const updated = selectedRooms.filter(r => r.id !== id);
    sessionStorage.setItem('selectedRooms', JSON.stringify(updated));
    // Force re-render bằng cách reload
    window.location.reload();
  };

  const ROOM_IMAGES = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1e54117320?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=400&auto=format&fit=crop',
  ];

  return (
    <MainLayout>
      <div className="bg-[#f9fafb] min-h-screen px-8 pt-8 pb-16 max-w-4xl mx-auto w-full">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#4a5565] hover:text-[#e60076] transition-colors mb-6 font-['Inter',sans-serif] text-[15px]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Quay lại
        </button>

        <h1 className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[32px] mb-2">
          Danh sách phòng chọn
        </h1>
        <p className="font-['Inter',sans-serif] text-[#6a7282] text-[16px] mb-8">
          Bạn đã lưu lại {selectedRooms.length} phòng đáng phù hợp nhất
        </p>

        {/* List */}
        <div className="flex flex-col gap-4 mb-8">
          {selectedRooms.length === 0 ? (
            <div className="bg-white rounded-[16px] p-10 text-center border border-gray-100 shadow-sm">
              <p className="text-[#6a7282] font-['Inter',sans-serif] text-[16px]">
                Chưa có phòng nào được chọn. Hãy quay lại để thêm phòng vào danh sách.
              </p>
            </div>
          ) : (
            selectedRooms.map((room, i) => (
              <div
                key={room.id}
                className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden flex items-center gap-0 hover:shadow-md transition-shadow"
              >
                <img
                  src={room.image || ROOM_IMAGES[i % ROOM_IMAGES.length]}
                  alt={room.title}
                  className="w-[140px] h-[110px] object-cover shrink-0"
                />
                <div className="flex-1 px-5 py-4">
                  <h3 className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[18px]">
                    {room.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="font-['Inter',sans-serif] text-[#6a7282] text-[14px]">{room.location}</span>
                  </div>
                  <p className="font-['Inter',sans-serif] font-bold text-[22px] mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#e60076] to-[#ec003f]">
                    {room.price}đ<span className="font-normal text-[14px] text-[#6a7282] ml-1">/ THÁNG</span>
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(room.id)}
                  className="p-4 mr-2 text-[#9ca3af] hover:text-[#e60076] transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        {selectedRooms.length > 0 && (
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6">
            <p className="font-['Inter',sans-serif] text-[#6a7282] text-[14px] mb-1">Tổng số phòng đã chọn</p>
            <p className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[28px] mb-1">
              {selectedRooms.length} phòng
            </p>
            <p className="font-['Inter',sans-serif] text-[#9ca3af] text-[13px]">
              Bạn có thể đặt lịch xem nhiều phòng cùng một lúc
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
