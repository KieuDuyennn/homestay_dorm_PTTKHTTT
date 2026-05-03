# HomeStay Dorm – Dormitory Management System

A full-stack dormitory management system built with:

- **Frontend**: ReactJS + Vite
- **Backend**: NodeJS + ExpressJS
- **Database**: Supabase (PostgreSQL)

## Project Structure

```
homestay-dorm/
├── frontend/    # ReactJS + Vite client
├── backend/     # NodeJS + ExpressJS API server
└── database/    # SQL migrations & seeds
```

## Getting Started

### 1. Clone & install dependencies

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

### 3. Run the development servers

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

Frontend runs at **http://localhost:5173**  
Backend runs at **http://localhost:3001**
