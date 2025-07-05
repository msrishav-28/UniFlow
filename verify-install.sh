#!/bin/bash

# Installation Verification Script
echo "🔍 Verifying College Event Social App installation..."

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check npm version
NPM_VERSION=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed. Run 'npm install'"
    exit 1
fi

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ Environment file exists"
    
    # Check if Firebase config is set
    if grep -q "your_api_key_here" .env; then
        echo "⚠️  Firebase configuration needs to be updated in .env"
    else
        echo "✅ Firebase configuration appears to be set"
    fi
else
    echo "⚠️  .env file not found. Copy .env.example to .env"
fi

# Check TypeScript compilation
echo "🔍 Checking TypeScript..."
npx tsc --noEmit --skipLibCheck
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript errors found"
fi

# Check build
echo "🔍 Testing production build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed"
fi

echo ""
echo "🎉 Installation verification complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update Firebase configuration in .env file"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:5173 in your browser"
