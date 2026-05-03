const authDao = require('../dao/auth.dao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function login(email, password) {
  const user = await authDao.findByEmail(email);
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

async function getMe(userId) {
  return authDao.findById(userId);
}

module.exports = { login, getMe };
