const supabase = require('../config/supabase');

async function them(tt) {
  const { data, error } = await supabase
    .from('thanh_toan')
    .insert([tt])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function sinhMaThanhToan() {
  // Fetch all existing IDs starting with 'TT' to find the true numeric maximum
  // (Ordering by string fails when IDs have different lengths like TT9 vs TT10)
  const { data, error } = await supabase
    .from('thanh_toan')
    .select('matt')
    .like('matt', 'TT%');

  if (error) throw error;

  if (!data || data.length === 0) return 'TT001';

  // Extract numbers and find max
  const nums = data
    .map(d => d.matt)
    .map(id => {
      // Handle both TT01 and TT001 formats
      const match = id.match(/^TT(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });

  const maxNum = Math.max(0, ...nums);
  const nextNumber = maxNum + 1;

  // Return in TT001 format
  return `TT${nextNumber.toString().padStart(3, '0')}`;
}

// async function layCocDaDoiSoat(maHD) {
//   const { data, error } = await supabase
//     .from('thanh_toan')
//     .select('sotien')
//     .eq('mahd', maHD)
//     .eq('loaitt', 'Tiền cọc')
//     .eq('trangthai', 'Đối soát thành công')
//     .single();

//   if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
//   return data ? data.sotien : 0;
// }

module.exports = {
  them,
  sinhMaThanhToan,
  //  layCocDaDoiSoat
};
