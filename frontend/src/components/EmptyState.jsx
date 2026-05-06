import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({ onBack }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] border border-gray-100 p-10 flex flex-col items-center justify-center min-h-[400px] w-full mt-6">
      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e60076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="9" y1="9" x2="13" y2="13"></line>
          <line x1="13" y1="9" x2="9" y2="13"></line>
        </svg>
      </div>
      
      <h2 className="font-['Inter',sans-serif] font-bold text-[#1e2939] text-[24px] mb-3 text-center max-w-lg">
        Rất tiếc, chúng tôi không tìm thấy phòng phù hợp với yêu cầu của bạn.
      </h2>
      
      <p className="font-['Inter',sans-serif] font-normal text-[#6a7282] text-[16px] text-center max-w-xl mb-8 leading-relaxed">
        Dường như bộ lọc hiện tại của bạn hơi hẹp. Hãy thử thay đổi ngân sách, khu vực hoặc các tiện ích đi kèm để chúng tôi có thể mang đến cho bạn nhiều lựa chọn hơn.
      </p>

      <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
        <div className="bg-rose-50/50 rounded-xl p-4 flex items-start gap-4 border border-rose-100/50">
          <div className="mt-1 shrink-0 text-[#e60076]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
          </div>
          <p className="font-['Inter',sans-serif] text-[#364153] text-[14px]">
            Nới lỏng khoảng giá hoặc diện tích mong muốn.
          </p>
        </div>

        <div className="bg-rose-50/50 rounded-xl p-4 flex items-start gap-4 border border-rose-100/50">
          <div className="mt-1 shrink-0 text-[#e60076]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <p className="font-['Inter',sans-serif] text-[#364153] text-[14px]">
            Mở rộng bán kính tìm kiếm sang các khu vực lân cận.
          </p>
        </div>
      </div>

      <button 
        onClick={() => {
          if (onBack) onBack();
          else navigate(-1);
        }}
        className="bg-gradient-to-r from-[#e60076] to-[#ec003f] text-white font-['Inter',sans-serif] font-semibold text-[16px] px-8 py-3.5 rounded-[12px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        Quay lại chỉnh sửa phiếu
      </button>
    </div>
  );
}
