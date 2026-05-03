const supabase = require('../config/supabase');

async function findByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) return null;
  return data;
}

async function findById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, fullName')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

module.exports = { findByEmail, findById };
