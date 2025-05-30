# PowerShell script to delete unused debug and demo pages
$directoriesToDelete = @(
    "src/app/debug",
    "src/app/medusa-debug",
    "src/app/image-debug",
    "src/app/image-proxy-test",
    "src/app/image-test",
    "src/app/demos",
    "src/app/icons-demo"
)

Write-Host "About to delete these directories:"
foreach ($dir in $directoriesToDelete) {
    Write-Host " - $dir"
}

Write-Host "`nWARNING: This will remove debug and demo pages from the application." -ForegroundColor Red
Write-Host "Are you sure you want to proceed? (y/n)" -ForegroundColor Yellow
$confirmation = Read-Host

if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
    foreach ($dir in $directoriesToDelete) {
        if (Test-Path $dir) {
            Write-Host "Deleting $dir" -ForegroundColor Cyan
            Remove-Item -Recurse -Force $dir
        } else {
            Write-Host "Directory not found: $dir" -ForegroundColor Yellow
        }
    }
    
    # Also remove debug links from the homepage
    $homepagePath = "src/app/page.tsx"
    if (Test-Path $homepagePath) {
        Write-Host "Removing debug links section from homepage" -ForegroundColor Cyan
        $content = Get-Content $homepagePath -Raw
        
        # Pattern to match the debug links section
        $pattern = '(?s)<div className="mb-10">\s*<h2 className="font-bold mb-6 text-3xl">Debug Links</h2>.*?</div>\s*</div>'
        
        # Replace the debug links section with nothing
        $newContent = $content -replace $pattern, '</div>'
        
        # Save the file
        Set-Content -Path $homepagePath -Value $newContent
    }
    
    Write-Host "`nCleanup complete!" -ForegroundColor Green
} else {
    Write-Host "`nOperation cancelled." -ForegroundColor Red
} 