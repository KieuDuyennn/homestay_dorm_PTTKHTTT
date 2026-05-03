import api from './api';

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  const { token, user } = res.data;
  localStorage.setItem('token', token);
  return user;
}

export async function logout() {
  localStorage.removeItem('token');
}

export async function getCurrentUser() {
  const res = await api.get('/auth/me');
  return res.data;
}
