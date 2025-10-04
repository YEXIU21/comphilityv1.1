@echo off
echo ========================================
echo Starting Comphility Backend Server
echo ========================================
echo.

cd backend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting backend server on http://localhost:3001
echo Press Ctrl+C to stop the server
echo.
node src/server.js
