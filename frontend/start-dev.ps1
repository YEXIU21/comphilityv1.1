# COMPHILITY Frontend Development Startup Script
# This script sets up and starts the Vue.js development server

Write-Host "🚀 Starting COMPHILITY Frontend Development Server..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Install dependencies
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 The application will be available at:" -ForegroundColor Cyan
Write-Host "   http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Features included:" -ForegroundColor Cyan
Write-Host "   • Responsive e-commerce layout" -ForegroundColor White
Write-Host "   • Product browsing and filtering" -ForegroundColor White
Write-Host "   • Shopping cart and wishlist" -ForegroundColor White
Write-Host "   • User authentication modals" -ForegroundColor White
Write-Host "   • PC Builder tool" -ForegroundColor White
Write-Host "   • Modern Vue 3 + Vuex + Vue Router" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Press Ctrl+C to stop the development server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run serve
