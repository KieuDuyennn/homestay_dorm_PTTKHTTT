import React from 'react';

export default function RoomCard({ room, isSelected, onToggle }) {
  const {
    image,
    badge,
    title,
    location,
    rating,
    peopleCount,
    price,
  } = room;

  return (
    <div
      className={`bg-white rounded-[16px] overflow-hidden flex flex-col shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-xl w-full h-full border-2 ${isSelected ? 'border-[#e60076] shadow-[0_0_0_4px_rgba(230,0,118,0.12)]' : 'border-transparent'}`}
    >
      {/* Image Section */}
      <div className="h-[224px] relative shrink-0 w-full bg-gray-200">
        <img
          src={image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {badge && (
          <div className="absolute left-[16px] top-[16px] bg-gradient-to-r from-[#e60076] to-[#ec003f] rounded-full px-3 py-1 shadow-md">
            <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-white whitespace-nowrap uppercase tracking-wide">
              {badge}
            </p>
          </div>
        )}
        {/* Checkmark khi đã chọn */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#e60076] flex items-center justify-center shadow-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 relative">
        {/* Top Info */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1 pr-2">
            <h3 className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[18px] leading-[28px] line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p className="font-['Inter',sans-serif] font-normal text-[#4a5565] text-[14px]">
                {location}
              </p>
            </div>
          </div>

          <div className="bg-[#fefce8] rounded-[10px] px-2 py-1 flex items-center gap-1 shrink-0 border border-yellow-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <p className="font-['Inter',sans-serif] font-semibold text-[#1e2939] text-[16px]">
              {rating}
            </p>
          </div>
        </div>

        {/* People/Bed Count */}
        <div className="flex items-center gap-1.5 mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p className="font-['Inter',sans-serif] font-normal text-[#4a5565] text-[14px]">
            {peopleCount}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            <p className="font-['Inter',sans-serif] font-bold text-[24px] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#e60076] to-[#ec003f]">
              {price}đ
            </p>
            <p className="font-['Inter',sans-serif] font-normal text-[#6a7282] text-[12px] mt-0.5">
              / tháng
            </p>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => onToggle && onToggle(room)}
            className={`rounded-[10px] shadow-sm transition-all active:scale-[0.98] px-4 py-2.5 max-w-[130px] text-[13px] font-['Inter',sans-serif] font-medium leading-snug text-center
              ${isSelected
                ? 'bg-[#fce7f3] text-[#e60076] border border-[#fccee8] hover:bg-[#fdd6ef]'
                : 'bg-gradient-to-r from-[#e60076] to-[#ec003f] text-white hover:opacity-90'
              }`}
          >
            {isSelected ? 'Đã thêm ✓' : 'Thêm vào danh sách'}
          </button>
        </div>
      </div>
    </div>
  );
}
