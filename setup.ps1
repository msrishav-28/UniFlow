# UniFlow Setup Script for PowerShell
Write-Host "🚀 Setting up UniFlow..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Please ensure your Firebase configuration is set up." -ForegroundColor Yellow
    Write-Host "   Copy .env.example to .env and fill in your Firebase credentials." -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file found" -ForegroundColor Green
}

# Build the project to check for any issues
Write-Host "🔨 Building project to check for issues..." -ForegroundColor Blue
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "🎉 Setup complete! You can now run:" -ForegroundColor Green
    Write-Host "   npm run dev - to start development server" -ForegroundColor Cyan
    Write-Host "   npm run build - to build for production" -ForegroundColor Cyan
    Write-Host "   npm run preview - to preview production build" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Read-Host "Press Enter to continue"
