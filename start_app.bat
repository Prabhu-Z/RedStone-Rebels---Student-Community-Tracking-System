@echo off
title Launching SCTS Platform
color 0A
echo ===============================================================
echo       SCTS - SMART CAMPUS EXTRACURRICULAR SYSTEM
echo                 Team RedStone Rebels
echo ===============================================================
echo.

echo [1/2] Launching Spring Boot Backend Engine (Port 8080)...
start "SCTS Backend Engine (Port 8080)" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"

echo.
echo [2/2] Launching Vite Frontend UI Server (Port 5173)...
start "SCTS Frontend UI (Port 5173)" cmd /k "cd /d "%~dp0frontend" && (if not exist "node_modules\vite\bin\vite.js" call npm.cmd install) && node node_modules/vite/bin/vite.js"

echo.
echo ===============================================================
echo   SUCCESS! Backend & Frontend servers are launching.
echo   Opening web browser: http://localhost:5173
echo ===============================================================
timeout /t 5
start http://localhost:5173
