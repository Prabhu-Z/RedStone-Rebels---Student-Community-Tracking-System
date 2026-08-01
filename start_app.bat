@echo off
title Launching SCTS Platform
color 0A
echo ===============================================================
echo       SCTS - SMART CAMPUS EXTRACURRICULAR SYSTEM
echo                 Team RedStone Rebels
echo ===============================================================
echo.

REM 1. Check & Install Frontend Dependencies synchronously if Vite is not installed
IF NOT EXIST "%~dp0frontend\node_modules\vite" (
  echo [INFO] Installing frontend dependencies (Vite & React)... Please wait...
  cd /d "%~dp0frontend"
  call npm install
  cd /d "%~dp0"
  echo [INFO] Frontend dependencies installed successfully!
  echo.
)

echo [1/2] Starting Spring Boot Backend Engine (Port 8080)...
start "SCTS Backend Engine (Port 8080)" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

echo.
echo [2/2] Starting Vite Frontend UI Server (Port 5173)...
start "SCTS Frontend UI (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===============================================================
echo   SUCCESS! Backend and Frontend servers are launching.
echo   Opening web browser in 6 seconds...
echo   URL: http://localhost:5173
echo ===============================================================
timeout /t 6
start http://localhost:5173
