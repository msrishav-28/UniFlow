@echo off
REM UniFlow Setup Script for Windows
echo 🚀 Setting up UniFlow...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Please ensure your Firebase configuration is set up.
    echo    Copy .env.example to .env and fill in your Firebase credentials.
) else (
    echo ✅ .env file found
)

REM Build the project to check for any issues
echo 🔨 Building project to check for issues...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 🎉 Setup complete! You can now run:
    echo    npm run dev - to start development server
    echo    npm run build - to build for production
    echo    npm run preview - to preview production build
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Press any key to continue...
pause >nul
