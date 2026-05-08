import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import SearchBar from '../components/SearchBar';
import { getContractsByStatus, searchContracts } from '../services/checkout.service';

const DanhSachHopDong = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine mode and status based on path
  const isInitialPaymentMode = location.pathname === '/thanh-toan-dau-ky';
  const initialStatus = isInitialPaymentMode ? 'Đã ký xác nhận' : 'Đã đối soát';
  
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    // Update status if path changes
    const newStatus = location.pathname === '/thanh-toan-dau-ky' ? 'Đã ký xác nhận' : 'Đã đối soát';
    setStatus(newStatus);
    HienThi(newStatus);
  }, [location.pathname]);

  const HienThi = async (currentStatus) => {
    try {
      setLoading(true);
      const data = await getContractsByStatus(currentStatus || status);
      HienThiDanhSachHD(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const HienThiDanhSachHD = (ds) => {
    setContracts(ds);
  };

  const txtTimKiem_Change = async (val) => {
    try {
      setLoading(true);
      setKeyword(val);
      const data = await searchContracts(val, status);
      HienThiDanhSachHD(data);
    } catch (error) {
      console.error('Error searching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const grdDanhSach_Click = (hd) => {
    if (hd.trangthai === 'Đã đối soát') {
      navigate(`/tao-bien-ban-tra-phong/${hd.mahd}`);
    } else if (hd.trangthai === 'Đã ký xác nhận') {
      navigate(`/lap-yeu-cau-thanh-toan/${hd.mahd}`);
    }
  };

  const pageTitle = isInitialPaymentMode ? 'Thanh toán đầu kỳ' : 'Danh sách trả phòng';
  const headerSubtitle = isInitialPaymentMode ? 'Hợp đồng chờ thanh toán kỳ đầu' : 'Hợp đồng chờ trả phòng';

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-slate-50/50">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">{headerSubtitle}</h2>
                  <p className="text-xs font-medium text-slate-500">Trạng thái: {status}</p>
                </div>
              </div>
              
              <div className="w-full md:w-96">
                <SearchBar 
                  placeholder="Tìm theo mã HD, tên khách hàng..." 
                  keyword={keyword}
                  onTextChanged={txtTimKiem_Change}
                  onClear={() => txtTimKiem_Change('')}
                />
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : contracts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contracts.map((hd) => (
                  <div 
                    key={hd.mahd}
                    onClick={() => grdDanhSach_Click(hd)}
                    className="group bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-primary/10" />
                    
                    <div className="relative">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {hd.mahd}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${hd.trangthai === 'Đã đối soát' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          {hd.trangthai}
                        </span>
                      </div>

                      <h3 className="font-bold text-navy group-hover:text-primary transition-colors mb-1">
                        {hd.khach_hang?.hoten}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium mb-4 flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {hd.khach_hang?.sdt}
                      </p>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400 uppercase tracking-tighter">Phòng / Giường</span>
                          <span className="text-navy">
                            {hd.hop_dong_giuong?.[0]?.giuong?.maphong} / {hd.hop_dong_giuong?.map(item => item.magiuong).join(', ')}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                          <span className="text-slate-400 uppercase tracking-tighter">Ngày ký</span>
                          <span className="text-navy">{new Date(hd.ngaybatdau).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="text-slate-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">Không tìm thấy hợp đồng</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Hiện tại không có hợp đồng nào ở trạng thái "{status}" hoặc khớp với từ khóa tìm kiếm của bạn.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DanhSachHopDong;
