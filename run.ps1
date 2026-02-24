# PowerShell script for Windows
param(
    [switch]$SkipInstall = $false
)

# Colors for output
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"

Write-Host "=== To-Do Application Setup ===" -ForegroundColor $Yellow
Write-Host ""

# Check if Node.js is installed
$nodeCheck = node --version 2>$null
if (-not $nodeCheck) {
    Write-Host "Error: Node.js is not installed. Please install Node.js and try again." -ForegroundColor $Red
    exit 1
}

Write-Host "✓ Node.js found: $nodeCheck" -ForegroundColor $Green

if (-not $SkipInstall) {
    Write-Host ""
    Write-Host "Installing backend dependencies..." -ForegroundColor $Yellow
    Push-Location backend
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Backend installation failed. Exiting..." -ForegroundColor $Red
        exit 1
    }
    
    Write-Host "✓ Backend dependencies installed" -ForegroundColor $Green
    Pop-Location
    
    Write-Host ""
    Write-Host "Installing frontend dependencies..." -ForegroundColor $Yellow
    Push-Location frontend
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Frontend installation failed. Exiting..." -ForegroundColor $Red
        exit 1
    }
    
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor $Green
    Pop-Location
}

Write-Host ""
Write-Host "Running database migration..." -ForegroundColor $Yellow
Push-Location backend
npm run migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Database migration failed. Exiting..." -ForegroundColor $Red
    exit 1
}

Write-Host "✓ Database migration completed" -ForegroundColor $Green

Write-Host ""
Write-Host "Seeding database..." -ForegroundColor $Yellow
npm run seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "Database seeding failed. Exiting..." -ForegroundColor $Red
    exit 1
}

Write-Host "✓ Database seeding completed" -ForegroundColor $Green
Pop-Location

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor $Green
Write-Host ""
Write-Host "Starting applications..." -ForegroundColor $Yellow
Write-Host ""

Write-Host "Backend running at: http://localhost:5000" -ForegroundColor $Green
Write-Host "Frontend running at: http://localhost:5173" -ForegroundColor $Green
Write-Host "API Documentation: http://localhost:5000/api-docs" -ForegroundColor $Green
Write-Host ""

Write-Host "Demo Credentials:" -ForegroundColor $Yellow
Write-Host "  Email: demo@example.com" -ForegroundColor $Green
Write-Host "  Password: password123" -ForegroundColor $Green
Write-Host ""

Write-Host "Starting backend..." -ForegroundColor $Yellow
Push-Location backend
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"
Pop-Location

Write-Host "Starting frontend..." -ForegroundColor $Yellow
Push-Location frontend
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"
Pop-Location

Write-Host "✓ Backend and Frontend started successfully" -ForegroundColor $Green
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop services" -ForegroundColor $Yellow
