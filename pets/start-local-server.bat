@echo off
echo ========================================
echo    GroomGo - Serveur Local
echo ========================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installé !
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si le dossier backend existe
if not exist "backend" (
    echo [ERREUR] Le dossier backend n'existe pas !
    pause
    exit /b 1
)

cd backend

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo Installation des dépendances...
    npm install
)

REM Démarrer le serveur
echo.
echo Démarrage du serveur backend sur http://localhost:3000
echo.
echo Pour arrêter le serveur, appuyez sur Ctrl+C
echo ========================================
echo.

npm start

pause
