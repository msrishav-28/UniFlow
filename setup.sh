#!/bin/bash

# UniFlow Setup Script
echo "🚀 Setting up UniFlow..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please ensure your Firebase configuration is set up."
    echo "   Copy .env.example to .env and fill in your Firebase credentials."
else
    echo "✅ .env file found"
fi

# Build the project to check for any issues
echo "🔨 Building project to check for issues..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🎉 Setup complete! You can now run:"
    echo "   npm run dev - to start development server"
    echo "   npm run build - to build for production"
    echo "   npm run preview - to preview production build"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
