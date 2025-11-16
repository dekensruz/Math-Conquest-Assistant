@echo off
echo ========================================
echo   Math Assistant - Demarrage
echo ========================================
echo.

echo [1/2] Demarrage du backend...
start "Backend" cmd /k "cd backend && python main.py"

timeout /t 3 /nobreak >nul

echo [2/2] Demarrage du frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Les deux serveurs sont en cours de demarrage
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo ========================================
pause

