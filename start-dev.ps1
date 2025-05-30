# Start-Dev.ps1 - Start both backend Medusa server and Next.js frontend
Write-Host "Starting Medusa backend and Next.js frontend..." -ForegroundColor Green

# Start Medusa backend server in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend\medusa'; npm run start"

# Wait for backend to initialize (adjust time as needed)
Write-Host "Waiting for Medusa backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start Next.js frontend in this window
Write-Host "Starting Next.js frontend..." -ForegroundColor Green
Set-Location $PSScriptRoot
npm run dev 