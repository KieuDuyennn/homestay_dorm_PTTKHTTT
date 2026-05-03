-- Migration 001: Create tables for HomeStay Dorm

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "fullName"    TEXT,
  role          TEXT NOT NULL DEFAULT 'student', -- 'student' | 'staff' | 'admin'
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deposit payment table (thanh_toan_coc)
CREATE TABLE IF NOT EXISTS thanh_toan_coc (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenSinhVien"  TEXT NOT NULL,
  "soTien"       NUMERIC(15, 2) NOT NULL,
  "trangThai"    TEXT NOT NULL DEFAULT 'cho_nop', -- 'cho_nop' | 'cho_duyet' | 'da_duyet' | 'tu_choi'
  "minhChung"    TEXT,                             -- URL or file path of evidence
  "approvedBy"   UUID REFERENCES users(id),
  "approvedAt"   TIMESTAMPTZ,
  "ngayTao"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
