import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { getReportDetails } from '../services/checkout.service';
import { useReactToPrint } from 'react-to-print';
import ModalThongBao from '../components/ModalThongBao';

const XemTruocIn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrintSuccess, setShowPrintSuccess] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    HienThi(id);
  }, [id]);

  const HienThi = async (maBB) => {
    try {
      setLoading(true);
      const data = await getReportDetails(maBB);
      setReport(data);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => setShowPrintSuccess(true),
    onPrintError: (error) => console.error('Print Error:', error),
    documentTitle: `BienBanTraPhong_${id}`,
  });

  const btnInBienBan_Click = () => {
    if (componentRef.current) {
      handlePrint();
    } else {
      alert('Đang chuẩn bị dữ liệu in, vui lòng thử lại sau giây lát.');
    }
  };

  const btnHuy_Click = () => {
    navigate('/danh-sach-hop-dong');
  };

  if (loading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-slate-100/80">
        <div className="flex-1 overflow-auto p-4 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            
            {/* Paper Container */}
            <div 
              ref={componentRef}
              className="bg-white shadow-2xl shadow-slate-300/50 p-12 md:p-16 min-h-[1123px] relative overflow-hidden text-slate-800"
              style={{ fontFamily: "'Times New Roman', serif" }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-12 relative">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-navy">Homestay Dorm System</h2>
                  <p className="text-xs italic text-slate-500">Dịch vụ quản lý nhà trọ & ký túc xá chuyên nghiệp</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mã biên bản</p>
                  <p className="text-lg font-black text-navy">{report?.mabienbantp}</p>
                </div>
              </div>

              <div className="text-center mb-16">
                <h1 className="text-3xl font-black uppercase tracking-widest text-navy mb-2">Biên bản trả phòng</h1>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                <p className="mt-4 text-sm text-slate-500 italic">Ngày lập: {new Date(report?.ngaylap).toLocaleDateString('vi-VN')}</p>
              </div>

              {/* Content Sections */}
              <div className="space-y-10">
                
                {/* 1. Parties */}
                <section>
                  <h3 className="text-sm font-bold uppercase border-b-2 border-slate-100 pb-2 mb-4 text-primary">I. Thông tin các bên</h3>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="font-bold">Nhân viên quản lý:</span>
                      <span>{report?.manv}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="font-bold">Khách hàng:</span>
                      <span>{report?.hop_dong?.khach_hang?.hoten}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="font-bold">Số CCCD:</span>
                      <span>{report?.hop_dong?.khach_hang?.socccd}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="font-bold">Hợp đồng số:</span>
                      <span>{report?.mahd}</span>
                    </div>
                  </div>
                </section>

                {/* 2. Room Info */}
                <section>
                  <h3 className="text-sm font-bold uppercase border-b-2 border-slate-100 pb-2 mb-4 text-primary">II. Thông tin phòng bàn giao</h3>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="font-bold">Phòng:</span>
                      <span>{report?.hop_dong?.hop_dong_giuong?.[0]?.giuong?.maphong}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="font-bold">Giường:</span>
                      <span>{report?.hop_dong?.hop_dong_giuong?.map(item => item.magiuong).join(', ')}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="font-bold">Loại hình:</span>
                      <span>{report?.hop_dong?.hop_dong_giuong?.[0]?.giuong?.phong?.loaihinh}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="font-bold">Ngày kết thúc:</span>
                      <span>{new Date(report?.hop_dong?.ngayketthuc || report?.ngaylap).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </section>

                {/* 3. Assets and Status */}
                <section>
                  <h3 className="text-sm font-bold uppercase border-b-2 border-slate-100 pb-2 mb-4 text-primary">III. Kết quả kiểm tra & Bàn giao</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-10 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="font-bold">Kết quả vệ sinh:</span>
                        <span className="text-emerald-600 font-bold">{report?.roomReport?.ketquavesinh || 'Tốt'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Trạng thái phòng:</span>
                        <span>{report?.roomReport?.trangthai || 'Bình thường'}</span>
                      </div>
                    </div>
                    
                    <p className="text-[12px] font-bold text-slate-400 uppercase mb-2">Chi tiết tài sản bàn giao:</p>
                    <table className="min-w-full border border-slate-200 text-xs text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 py-2 border">Vật dụng</th>
                          <th className="px-3 py-2 border text-center">SL</th>
                          <th className="px-3 py-2 border">Hiện trạng nhận</th>
                          <th className="px-3 py-2 border">Hiện trạng trả</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report?.handover?.chi_tiet_ban_giao?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 border">{item.tai_san_trang_thiet_bi?.tenvatdung}</td>
                            <td className="px-3 py-2 border text-center">{item.soluong}</td>
                            <td className="px-3 py-2 border">{item.hientrangnhan}</td>
                            <td className="px-3 py-2 border">{item.hientrangtra || 'Tốt'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* 4. Financial Obligations */}
                <section>
                  <h3 className="text-sm font-bold uppercase border-b-2 border-slate-100 pb-2 mb-4 text-primary">IV. Nghĩa vụ tài chính</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Số tiền hoàn cọc</p>
                        <p className="text-xl font-black text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(report?.reconciliation?.sotienhoancoc || 0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Trạng thái đối soát</p>
                        <p className="text-sm font-bold text-navy">{report?.reconciliation?.trangthai || 'Đã đối soát'}</p>
                      </div>
                    </div>

                    {report?.reconciliation?.khoan_khau_tru?.length > 0 && (
                      <div className="px-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Các khoản khấu trừ:</p>
                        <div className="space-y-1">
                          {report.reconciliation.khoan_khau_tru.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs py-1 border-b border-dashed border-slate-100">
                              <span>{item.tenkhoan}</span>
                              <span className="font-bold text-rose-500">-{new Intl.NumberFormat('vi-VN').format(item.sotien)}đ</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Footer / Signatures */}
                <div className="grid grid-cols-2 gap-20 pt-20">
                  <div className="text-center space-y-24">
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Đại diện ký túc xá</p>
                      <p className="text-sm italic text-slate-500">(Ký và ghi rõ họ tên)</p>
                    </div>
                    <div className="font-bold text-navy uppercase">{report?.manv}</div>
                  </div>
                  <div className="text-center space-y-24">
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Khách hàng</p>
                      <p className="text-sm italic text-slate-500">(Ký và ghi rõ họ tên)</p>
                    </div>
                    <div className="font-bold text-navy uppercase">{report?.hop_dong?.khach_hang?.hoten}</div>
                  </div>
                </div>

              </div>

              {/* Document Footer */}
              <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end pt-8 border-t border-slate-100 opacity-50">
                <p className="text-[10px] text-slate-400">Biên bản này được lập thành 02 bản có giá trị pháp lý như nhau.</p>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Page 1 of 1</div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200/60 flex justify-center gap-4 z-10">
          <button 
            onClick={btnHuy_Click}
            className="px-8 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            Đóng
          </button>
          <button 
            onClick={btnInBienBan_Click}
            className="px-10 py-3.5 rounded-2xl bg-primary shadow-lg shadow-primary/25 font-black text-white hover:bg-primary-dark transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            In biên bản
          </button>
        </div>

        {/* Success Modal */}
        <ModalThongBao 
          show={showPrintSuccess}
          type="success"
          title="In biên bản thành công"
          message="Biên bản đã được chuyển đến trình điều khiển in và hoàn tất."
          primaryAction={{
            label: "Xác nhận",
            onClick: () => navigate('/danh-sach-hop-dong')
          }}
        />
      </div>
    </MainLayout>
  );
};

export default XemTruocIn;
