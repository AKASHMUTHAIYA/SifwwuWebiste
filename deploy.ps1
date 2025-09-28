# SIFWWU Site Deployment Script
Write-Host "🚀 Starting SIFWWU Site Deployment..." -ForegroundColor Green

# Check if vercel is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Clean any existing vercel config
if (Test-Path ".vercel") {
    Remove-Item .vercel -Recurse -Force
    Write-Host "🧹 Cleaned existing Vercel config" -ForegroundColor Yellow
}

Write-Host "🔗 Initializing Vercel project..." -ForegroundColor Blue
vercel login

Write-Host "📦 Starting deployment..." -ForegroundColor Blue
vercel --prod --yes

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up MongoDB Atlas database" -ForegroundColor White
Write-Host "2. Configure environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "3. Set up Cloudinary for image uploads" -ForegroundColor White