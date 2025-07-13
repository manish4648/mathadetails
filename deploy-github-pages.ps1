# GitHub Pages Deployment Script for Angular SPA
Write-Host "Building Angular app for GitHub Pages..." -ForegroundColor Green

# Build the app with production configuration and correct base href
ng build --configuration production --base-href "/matha_details/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host "Files ready for GitHub Pages deployment in: dist/matha/browser/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To deploy:" -ForegroundColor Cyan
    Write-Host "1. Copy all files from 'dist/matha/browser/' to your gh-pages branch" -ForegroundColor White
    Write-Host "2. Make sure 404.html is in the root of gh-pages branch" -ForegroundColor White
    Write-Host "3. Push to GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "Your app will be available at: https://manish4648.github.io/matha_details/" -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
