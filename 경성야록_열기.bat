@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 경성야록 - 이 창을 닫으면 사이트가 꺼집니다
set PY=python
where python >nul 2>nul || set PY=py
echo.
echo   경성야록을 여는 중입니다...
echo   이 검은 창은 켜 둔 채로 두세요. 다 보고 나서 닫으면 됩니다.
echo.
start "" /b cmd /c "timeout /t 2 >nul && start http://localhost:8765/"
%PY% -m http.server 8765
echo.
echo   서버를 켜지 못했습니다. 파이썬이 설치돼 있는지 확인해 주세요.
echo   이미 다른 창에서 켜져 있다면 브라우저에서 http://localhost:8765/ 로 들어가면 됩니다.
pause
