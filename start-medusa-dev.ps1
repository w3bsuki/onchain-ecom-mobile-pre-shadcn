# Start both the Next.js frontend and Medusa backend
# PowerShell script for Windows

Write-Host "🚀 Starting Medusa E-commerce Development Environment" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Check if medusa backend exists
if (Test-Path -Path "./backend/medusa") {
    Write-Host "🔍 Found Medusa backend" -ForegroundColor Green
} else {
    Write-Host "❌ Medusa backend not found in ./backend/medusa" -ForegroundColor Red
    Write-Host "Please make sure you've set up the Medusa backend following the instructions in MEDUSA_SETUP.md" -ForegroundColor Yellow
    exit 1
}

# Check if Terminal-Tabs module is installed
$hasTabsModule = Get-Module -ListAvailable -Name "Terminal-Tabs"
if ($null -eq $hasTabsModule) {
    Write-Host "📦 Installing Terminal-Tabs module for better tab support..." -ForegroundColor Yellow
    Install-Module -Name Terminal-Tabs -Scope CurrentUser -Force
}

# Use Terminal-Tabs if available, otherwise just start processes
if ($null -ne $hasTabsModule) {
    Write-Host "🚀 Starting Medusa backend and Next.js frontend in separate tabs..." -ForegroundColor Green
    
    # Start Medusa backend
    Open-TerminalTab -TabTitle "Medusa Backend" -Command "cd ./backend/medusa && npm run start"
    
    # Start Next.js frontend
    Open-TerminalTab -TabTitle "Next.js Frontend" -Command "npm run dev"
} else {
    Write-Host "🚀 Starting Medusa backend and Next.js frontend..." -ForegroundColor Green
      # Start backend in new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$((Get-Location).Path)\backend\medusa'; npm run start"
    
    # Start frontend
    npm run dev
}

Write-Host "✅ Development environment started!" -ForegroundColor Green
