<#
Run both backend and frontend development servers on Windows (PowerShell).

Usage: From project root run:
  .\run_dev.ps1

This script opens a new PowerShell window for the backend (so you can see its logs)
and runs the frontend dev server in the current window.
#>
Param()

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

Write-Host "Starting backend in a new PowerShell window..."
$backendCommand = "cd `"$backend`"; if (Test-Path .\venv\Scripts\Activate.ps1) { . .\venv\Scripts\Activate.ps1 }; uvicorn main:app --reload --host 0.0.0.0 --port 8000"
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $backendCommand

Start-Sleep -Seconds 1

Write-Host "Starting frontend in current window..."
Set-Location $frontend

# Run frontend dev; user can cancel with Ctrl+C
npm run dev
