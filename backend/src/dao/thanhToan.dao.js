const supabase = require('../config/supabase');

async function findAll() {
  const { data, error } = await supabase
    .from('thanh_toan_coc')
    .select('*')
    .order('ngayTao', { ascending: false });
  if (error) throw error;
  return data;
}

async function findById(id) {
  const { data, error } = await supabase
    .from('thanh_toan_coc')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

async function updateMinhChung(id, minhChungData) {
  const { data, error } = await supabase
    .from('thanh_toan_coc')
    .update({ minhChung: minhChungData, trangThai: 'cho_duyet' })
    .eq('id', id)
    .eq('trangThai', 'cho_nop')
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function approve(id, approvedBy) {
  const { data, error } = await supabase
    .from('thanh_toan_coc')
    .update({ trangThai: 'da_duyet', approvedBy, approvedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

module.exports = { findAll, findById, updateMinhChung, approve };
