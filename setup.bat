@echo off
echo ==========================================
echo MyPortfolio404 - Initialization Script
echo By: Amine Nouioui
echo ==========================================
echo Starting npm install for all projects...

echo.
echo Installing ShopFlow...
cd shopflow\backend && npm install && cd ..\frontend && npm install && cd ..\..

echo.
echo Installing ShiftPro...
cd shiftpro\backend && npm install && cd ..\frontend && npm install && cd ..\..

echo.
echo Installing LegalVault...
cd legalvault\backend && npm install && cd ..\frontend && npm install && cd ..\..

echo.
echo Installing TrackrBI...
cd trackrbi\backend && npm install && cd ..\frontend && npm install && cd ..\..

echo.
echo Installing MarketFlow...
cd marketflow\backend && npm install && cd ..\frontend && npm install && cd ..\..

echo.
echo Installing PropHunt...
cd prophunt\backend && npm install && cd ..\frontend && npm install && cd ..\..

echo ==========================================
echo All Dependencies Installed Successfully!
echo ==========================================
pause
