# Dormly

A dorm hub booking system with a Node.js backend API and PostgreSQL database.

## Prerequisites

### Option 1: Docker (Recommended)
- Docker Desktop
- Docker Compose

### Option 2: Manual Setup
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Project Structure

- **backend/** - Express.js REST API server
- **frontend/** - Simple API testing interface
- **database/** - SQL schema and dummy data

## Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Database Configuration

Create a `.env` file in the `backend/` directory with your database credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dormly
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3001
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your_secret_key
```

### 3. Initialize Database

Run the SQL files in the `database/` directory:

```bash
psql -U your_username -d dormly -f database/Dormly.sql
psql -U your_username -d dormly -f database/sprint_dummy_data.sql
```

## Running the Servers

### Option 1: Using Docker Compose (Recommended)

Run all services (database, backend, and frontend) with a single command:

```bash
docker-compose -f docker-compose.yml up
```

To rebuild containers after code changes:

```bash
docker-compose -f docker-compose.yml up --build
```

To run in detached mode (background):

```bash
docker-compose up -f docker-compose.yml -d
```

To stop all services:

```bash
docker-compose down
```

To stop and remove all containers, networks, and volumes:

```bash
docker-compose down -v
```

To view logs:

```bash
docker-compose logs           # All services
docker-compose logs backend   # Backend only
docker-compose logs frontend  # Frontend only
docker-compose logs -f        # Follow logs in real-time
```

To restart a specific service:

```bash
docker-compose restart backend
docker-compose restart frontend
```

**Ports:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

The database is automatically initialized with the schema and dummy data. No manual configuration needed.

### Option 2: Manual Setup

#### Backend API Server

The backend provides a REST API for managing dorms, rooms, bookings, and users.

```bash
cd backend
npm start          # Production mode
npm run dev        # Development mode with nodemon
npm run start:https # HTTPS mode
```

**Default Port:** 3001  
**Health Check:** http://localhost:3001/api/health

**Available Endpoints:**
- `/api/auth` - Authentication (login, register, logout)
- `/api/users` - User management
- `/api/dorms` - Dormitory information
- `/api/rooms` - Room listings and management
- `/api/bookings` - Booking operations
- `/api/media` - Media upload and retrieval
- `/api/search` - Search functionality

#### Frontend API Tester

A simple web interface for testing backend API endpoints.

```bash
cd frontend
npm start          # or npm run dev
```

**Default Port:** 3000  
**URL:** http://localhost:3000

## Development Workflow

### With Docker
1. Run `docker-compose up`
2. Access frontend at http://localhost:3000
3. Backend API available at http://localhost:3001

### Manual Setup
1. Start the backend server first (port 3001)
2. Start the frontend tester (port 3000)
3. Use the frontend interface to test API endpoints
4. Backend automatically allows CORS from frontend

## Notes

- The backend uses session-based authentication
- Uploaded media files are stored in `backend/uploads/`
- The frontend is a lightweight testing tool, not a production UI
