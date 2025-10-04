# How to Start the Application

## Prerequisites

Before starting, make sure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ MySQL server running
- ✅ MySQL credentials configured in `backend/.env`

## Step-by-Step Guide

### 1. Start MySQL Server

Make sure MySQL is running on your system:
- **Windows**: Check MySQL service in Services app
- **Mac/Linux**: `sudo service mysql start` or `brew services start mysql`

### 2. Start the Backend Server

Open a terminal/command prompt:

```bash
# Navigate to backend directory
cd "c:\Users\SEN Toji\Downloads\comphilityv1 oct 4\comphilityv1-master\backend"

# Install dependencies (first time only)
npm install

# Start the server
node src/server.js
```

**Expected Output:**
```
[DB] MySQL database initialized successfully
COMPHILITY API listening on http://localhost:3001
```

✅ **Backend is ready when you see this message!**

### 3. Start the Frontend Server

Open a **NEW** terminal/command prompt (keep backend running):

```bash
# Navigate to frontend directory
cd "c:\Users\SEN Toji\Downloads\comphilityv1 oct 4\comphilityv1-master\frontend"

# Install dependencies (first time only)
npm install

# Start the development server
npm run serve
```

**Expected Output:**
```
  App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.x.x:8080/
```

✅ **Frontend is ready when you see this message!**

### 4. Access the Application

Open your browser and go to:
```
http://localhost:8080
```

## Quick Start Commands

### Windows PowerShell

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\SEN Toji\Downloads\comphilityv1 oct 4\comphilityv1-master\backend"
node src/server.js
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\SEN Toji\Downloads\comphilityv1 oct 4\comphilityv1-master\frontend"
npm run serve
```

## Troubleshooting

### ❌ "Cannot connect to server" Error

**Problem:** Frontend shows "Cannot connect to server. Please ensure the backend is running on http://localhost:3001"

**Solution:**
1. Check if backend server is running (Terminal 1 should show "COMPHILITY API listening...")
2. If not running, start it: `node src/server.js`
3. Check if port 3001 is available: `netstat -ano | findstr :3001`
4. If port is in use, kill the process or change port in `backend/.env`

### ❌ "Server connection refused"

**Problem:** Backend server is not responding

**Solution:**
1. Stop the backend server (Ctrl+C)
2. Check MySQL is running
3. Verify `backend/.env` has correct MySQL credentials
4. Restart backend: `node src/server.js`

### ❌ MySQL Connection Error

**Problem:** Backend shows "[DB] MySQL Initialization error"

**Solution:**
1. Verify MySQL is running
2. Check credentials in `backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_DATABASE=comphility
   ```
3. Test MySQL connection: `mysql -u root -p`
4. Create database manually if needed: `CREATE DATABASE comphility;`

### ❌ Port Already in Use

**Problem:** "Port 3001 is already in use" or "Port 8080 is already in use"

**Solution:**

**For Backend (Port 3001):**
```powershell
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**For Frontend (Port 8080):**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <PID> /F
```

### ❌ "npm: command not found"

**Problem:** Node.js is not installed or not in PATH

**Solution:**
1. Download and install Node.js from https://nodejs.org/
2. Restart terminal/command prompt
3. Verify installation: `node --version` and `npm --version`

## Verify Everything is Working

### 1. Check Backend Health
Open browser and go to:
```
http://localhost:3001/api/health
```

**Expected Response:**
```json
{"status":"ok"}
```

### 2. Check Frontend
Open browser and go to:
```
http://localhost:8080
```

You should see the Comphility homepage.

### 3. Test Login
1. Click the user icon in the top right
2. Click "Login"
3. Try logging in

**If you see "Cannot connect to server":**
- Backend is not running → Go back to Step 2

**If login works:**
- ✅ Everything is set up correctly!

## Creating Test Users

### Create Admin User

```bash
cd backend
node create-admin.js
```

**Default Admin Credentials:**
- Email: `admin@comphility.com`
- Password: `admin123`

### Create Regular User

Use the signup form in the application:
1. Click user icon → Sign Up
2. Fill in the form
3. Submit

## Stopping the Servers

### Stop Backend
In the backend terminal, press: `Ctrl + C`

### Stop Frontend
In the frontend terminal, press: `Ctrl + C`

## Development Workflow

### Recommended Setup:
1. **Terminal 1:** Backend server (always running)
2. **Terminal 2:** Frontend server (always running)
3. **Browser:** http://localhost:8080 (auto-reloads on changes)
4. **Code Editor:** Make changes to files

### Hot Reload:
- Frontend changes auto-reload in browser
- Backend changes require restart (Ctrl+C, then `node src/server.js`)

## Common Development Tasks

### Reset Database
```bash
cd backend
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE comphility; CREATE DATABASE comphility;"
node src/server.js
```

### Clear Frontend Cache
```bash
cd frontend
rm -rf node_modules/.cache
npm run serve
```

### View Backend Logs
Backend logs appear in Terminal 1 where you started the server.

### View Frontend Logs
- Browser Console (F12)
- Terminal 2 shows build logs

## Quick Reference

| Component | URL | Port | Command |
|-----------|-----|------|---------|
| Backend API | http://localhost:3001 | 3001 | `node src/server.js` |
| Frontend | http://localhost:8080 | 8080 | `npm run serve` |
| MySQL | localhost | 3306 | System service |
| API Health | http://localhost:3001/api/health | - | - |

## Need Help?

1. Check console logs in both terminals
2. Check browser console (F12)
3. Verify all prerequisites are met
4. Try restarting both servers
5. Check the error messages - they now provide specific guidance
