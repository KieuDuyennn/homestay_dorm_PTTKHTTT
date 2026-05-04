import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { layDSHDChoYCTT, timKiemHD, taoYCTTKyDau } from '../services/lapYCTT.service';

const MH_DanhSachHopDongChoLapYCTT = () => {
  const [user, setUser] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [dsHopDong, setDsHopDong] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingHD, setCreatingHD] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/');
    } else {
      setUser(JSON.parse(savedUser));
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await layDSHDChoYCTT();
      setDsHopDong(data);
    } catch (err) {
      setError('Không thể tải danh sách hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setKeyword(value);
    try {
      setLoading(true);
      setError('');
      if (value.trim() === '') {
        const data = await layDSHDChoYCTT();
        setDsHopDong(data);
      } else {
        const data = await timKiemHD(value);
        setDsHopDong(data);
      }
    } catch (err) {
      setError('Không tìm thấy thông tin yêu cầu thanh toán hoặc hợp đồng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLapYCTT = async (maHD) => {
    try {
      setCreatingHD(maHD);
      const result = await taoYCTTKyDau(maHD);
      navigate(`/chi-tiet-yctt/${result.matt}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tạo yêu cầu thanh toán';
      setError(msg);
      setCreatingHD(null);
    }
  };

  if (!user) return null;

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-[32px] font-extrabold text-navy leading-tight">Danh sách hợp đồng chờ lập yêu cầu thanh toán</h1>
        <p className="text-[14px] text-gray-500 mt-2">
          Hiện có {dsHopDong.length} hợp đồng đã được duyệt và cần xử lý thanh toán.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng theo tên, SĐT hoặc mã cọc..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {/* Error banner */}
        {error && (
          <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Empty State */}
      {!loading && dsHopDong.length === 0 && (
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-16 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="text-primary" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h3 className="text-[20px] font-extrabold text-navy mb-2">Không tìm thấy kết quả</h3>
          <p className="text-[14px] text-gray-500 max-w-md mx-auto">
            Rất tiếc, chúng tôi không tìm thấy thông tin cho từ khóa này. Vui lòng thử tìm kiếm bằng Tên khách hàng, Số điện thoại hoặc Mã số khác.
          </p>
        </div>
      )}

      {/* Card List */}
      {!loading && dsHopDong.length > 0 && (
        <div className="space-y-4">
          {dsHopDong.map((hd) => (
            <div
              key={hd.mahd}
              className="bg-white rounded-2xl border border-gray-100 px-8 py-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-6 flex-1">
                {/* Mã HD */}
                <div className="min-w-[100px]">
                  <p className="text-[12px] text-gray-400 mb-1">MÃ</p>
                  <p className="text-[14px] font-bold text-primary">#{hd.mahd}</p>
                </div>

                {/* Tên KH */}
                <div className="flex items-center gap-3 min-w-[180px]">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-500">
                    {hd.khach_hang?.hoten?.split(' ').map(w => w[0]).slice(-2).join('') || '?'}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-navy">{hd.khach_hang?.hoten || '-'}</p>
                  </div>
                </div>

                {/* Loại thuê */}
                <div className="min-w-[100px]">
                  <span className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-3 py-1 rounded-full">
                    {hd.khach_hang?.loaikhachhang || '-'}
                  </span>
                </div>

                {/* Ngày ký */}
                <div className="min-w-[120px]">
                  <p className="text-[12px] text-gray-400 mb-1">NGÀY KÝ HỢP ĐỒNG</p>
                  <p className="text-[13px] font-medium text-navy">
                    {hd.ngaybatdau ? new Date(hd.ngaybatdau).toLocaleDateString('vi-VN') : '-'}
                  </p>
                </div>

                {/* Trạng thái */}
                <div>
                  <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
                    ĐÃ KÝ XÁC NHẬN
                  </span>
                </div>
              </div>

              {/* Nút hành động */}
              <button
                onClick={() => handleLapYCTT(hd.mahd)}
                disabled={creatingHD === hd.mahd}
                className="ml-4 bg-pink-50 text-primary text-[12px] font-bold px-5 py-3 rounded-xl border border-pink-200 hover:bg-primary hover:text-white transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {creatingHD === hd.mahd ? 'Đang tạo...' : 'LẬP YÊU CẦU THANH TOÁN'}
              </button>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default MH_DanhSachHopDongChoLapYCTT;
