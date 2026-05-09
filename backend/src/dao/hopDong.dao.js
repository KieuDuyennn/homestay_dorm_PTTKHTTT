const supabase = require('../config/supabase');

async function layDanhSachTheoTrangThai(tt) {
  const { data, error } = await supabase
    .from('hop_dong')
    .select(`
      mahd,
      trangthai,
      ngaybatdau,
      khach_hang (
        hoten,
        sdt
      ),
      hop_dong_giuong (
        magiuong,
        giuong (
          maphong,
          phong (
            loaihinh
          )
        )
      )
    `)
    .eq('trangthai', tt)
    .order('ngaybatdau', { ascending: false });

  if (error) throw error;
  return data;
}

async function timKiem(keyword, tt) {
  let matchedMaKHs = [];

  if (keyword) {
    // 1. Search for customers matching the keyword
    const { data: customers } = await supabase
      .from('khach_hang')
      .select('makh')
      .or(`hoten.ilike.%${keyword}%,sdt.ilike.%${keyword}%`);

    if (customers) {
      matchedMaKHs = customers.map(c => c.makh);
    }
  }

  // 2. Query contracts with matching MaHD or matching MaKH
  let query = supabase
    .from('hop_dong')
    .select(`
      mahd,
      trangthai,
      ngaybatdau,
      khach_hang (
        hoten,
        sdt
      ),
      hop_dong_giuong (
        magiuong,
        giuong (
          maphong
        ) 
      )
    `);
  
  if (tt) {
    query = query.eq('trangthai', tt);
  }

  if (keyword) {
    if (matchedMaKHs.length > 0) {
      query = query.or(`mahd.ilike.%${keyword}%,makh.in.(${matchedMaKHs.join(',')})`);
    } else {
      query = query.ilike('mahd', `%${keyword}%`);
    }
  }

  const { data, error } = await query.order('ngaybatdau', { ascending: false });

  if (error) throw error;
  return data;
}

async function docTheoMa(maHD) {
  const { data, error } = await supabase
    .from('hop_dong')
    .select(`
      *,
      khach_hang (*),
      hop_dong_giuong (
        magiuong,
        giuong (
          *,
          phong (*)
        )
      )
    `)
    .eq('mahd', maHD)
    .single();

  if (error) throw error;
  return data;
}

async function capNhatTrangThai(maHD, tt) {
  const { data, error } = await supabase
    .from('hop_dong')
    .update({ trangthai: tt })
    .eq('mahd', maHD)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  layDanhSachTheoTrangThai,
  timKiem,
  docTheoMa,
  capNhatTrangThai
};
