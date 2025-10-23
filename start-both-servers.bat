@echo off
echo Starting CRM Application...
echo.

echo Starting Backend Server...
cd /d "D:\Desktop\projects\CRM_Working\backend"
start "Backend" cmd /c "npm run dev"

timeout /t 3

echo Starting Frontend Server...
cd /d "D:\Desktop\projects\CRM_Working\frontend"
start "Frontend" cmd /c "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause