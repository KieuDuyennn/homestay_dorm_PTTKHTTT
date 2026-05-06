import React from 'react';

export default function ModalLoi({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[448px] bg-white rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 mx-4">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e60076] to-[#ec003f] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="font-['Inter',sans-serif] font-bold text-[20px] text-white tracking-[-0.45px]">
              Lỗi hệ thống
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[26px] text-center text-[#364153]">
            {message || 'Hệ thống bị lỗi xin vui lòng thử lại hoặc liên hệ với hỗ trợ kỹ thuật của chúng tôi'}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#e60076] to-[#ec003f] hover:opacity-90 transition-opacity text-white font-['Inter',sans-serif] font-semibold text-[16px] py-3 rounded-[14px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
