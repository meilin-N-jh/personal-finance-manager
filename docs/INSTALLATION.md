# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (version 14 or higher)
2. **npm** (usually comes with Node.js)
3. **PostgreSQL** (version 12 or higher)
4. **Git**

## Database Setup

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib

   # macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql

   # Windows
   # Download and install from https://www.postgresql.org/download/windows/
   ```

2. **Create a database**:
   ```bash
   # Log into PostgreSQL
   sudo -u postgres psql

   # Create database and user
   CREATE DATABASE finance_manager;
   CREATE USER finance_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE finance_manager TO finance_user;
   \q
   ```

## Project Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd personal-finance-manager
   ```

2. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install

   # Install all project dependencies
   npm run install-all
   ```

3. **Configure environment variables**:

   **Backend Configuration** (`server/.env`):
   ```bash
   cp server/.env.example server/.env
   ```

   Edit `server/.env` with your database configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=finance_manager
   DB_USER=finance_user
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

   **Frontend Configuration** (optional `client/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

5. **Start the development servers**:
   ```bash
   # Start both backend and frontend servers
   npm run dev

   # Or start them separately:
   # Backend (port 3001)
   npm run server

   # Frontend (port 3000)
   npm run client
   ```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

## Default Features

The application starts with the following features:

1. **User Authentication**: Register and login functionality
2. **Dashboard**: Financial overview with placeholder charts
3. **Basic Navigation**: Sidebar with all main sections
4. **Responsive Design**: Works on desktop and mobile devices

## Development Notes

- The backend runs on port 3001
- The frontend runs on port 3000
- API requests are automatically proxied from frontend to backend
- Hot reloading is enabled for both frontend and backend

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure PostgreSQL is running
   - Verify database credentials in `.env` file
   - Check if database was created successfully

2. **Port Already in Use**:
   ```bash
   # Find and kill process using port 3001
   lsof -ti:3001 | xargs kill -9
   ```

3. **Migration Failures**:
   ```bash
   # Reset database (WARNING: This deletes all data)
   psql -U finance_user -d finance_manager -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
   npm run db:migrate
   ```

4. **Node Module Issues**:
   ```bash
   # Clear and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Getting Help

If you encounter issues:

1. Check the console output for specific error messages
2. Verify all prerequisites are properly installed
3. Ensure environment variables are correctly configured
4. Check that PostgreSQL service is running

## Production Deployment

For production deployment, you'll need to:

1. Set `NODE_ENV=production` in environment variables
2. Use a production-grade database
3. Set up proper SSL certificates
4. Configure proper CORS settings
5. Set up process management (PM2, etc.)
6. Configure reverse proxy (Nginx, etc.)