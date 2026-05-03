const thanhToanDao = require('../dao/thanhToan.dao');

async function getAll() {
  return thanhToanDao.findAll();
}

async function getById(id) {
  const item = await thanhToanDao.findById(id);
  if (!item) throw Object.assign(new Error('Not found'), { status: 404 });
  return item;
}

async function ghiNhanMinhChung(id, data) {
  return thanhToanDao.updateMinhChung(id, data);
}

async function pheDuyetGiaoDich(id, approvedBy) {
  return thanhToanDao.approve(id, approvedBy);
}

module.exports = { getAll, getById, ghiNhanMinhChung, pheDuyetGiaoDich };
