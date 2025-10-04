@echo off
echo ========================================
echo Starting Comphility Frontend Server
echo ========================================
echo.

cd frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting frontend server on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
call npm run serve
