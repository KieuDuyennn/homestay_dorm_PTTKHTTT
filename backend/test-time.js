require('dotenv').config();
const supabase = require('./src/config/supabase.js');

async function check() {
  const { data, error } = await supabase
    .from('phieu_yeu_cau_xem_phong')
    .select('mayc, thoigianhenxem, trangthai, manv')
    .limit(5)
    .order('thoigianhenxem', { ascending: false });
  console.log('Sample dates:', data);
}
check();
