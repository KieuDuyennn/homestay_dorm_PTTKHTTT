-- Seed 001: Initial users for HomeStay Dorm
-- Default password for all seed users is: password123

INSERT INTO users (id, email, "passwordHash", "fullName", role)
VALUES
  (
    gen_random_uuid(),
    'admin@homestay.vn',
    '$2b$10$8fOgK9cOZuAJRq3cbuF/genuogt63gFjTOwPuhP/rzCvbghYWxcw6',
    'Quản trị viên',
    'admin'
  ),
  (
    gen_random_uuid(),
    'staff@homestay.vn',
    '$2b$10$8fOgK9cOZuAJRq3cbuF/genuogt63gFjTOwPuhP/rzCvbghYWxcw6',
    'Nhân viên quản lý',
    'staff'
  ),
  (
    gen_random_uuid(),
    'sinhvien@homestay.vn',
    '$2b$10$8fOgK9cOZuAJRq3cbuF/genuogt63gFjTOwPuhP/rzCvbghYWxcw6',
    'Nguyễn Văn A',
    'student'
  )
ON CONFLICT (email) DO NOTHING;
