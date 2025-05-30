# PowerShell script to delete unused components
$filesToDelete = @(
    "src/components/products/filters/mobile-filters-optimized.tsx",
    "src/components/ui/optimized-bottom-sheet.tsx",
    "src/components/ui/CategoryTabsSkeleton.tsx",
    "src/components/SkeletonProductCard.tsx",
    "src/components/OnchainStoreModal.tsx",
    "src/components/MockCheckoutButton.tsx",
    "src/components/ProductModal.tsx",
    "src/components/layout/navigation/MobileBottomNav.tsx",
    "src/components/CategoryIcons.tsx",
    "src/components/CategoryIconsShowcase.tsx",
    "src/components/test-rendering.tsx",
    "src/components/OnchainStoreItem.test.tsx",
    "src/components/OnchainStoreItems.tsx",
    "src/components/OnchainStore.tsx",
    "src/components/OnchainStoreItem.tsx",
    "src/components/OnchainStoreSummary.tsx",
    "src/components/ui/CategoryIcon.tsx",
    "src/components/ui/CategoryTabs.test.tsx"
)

Write-Host "About to delete these files:"
foreach ($file in $filesToDelete) {
    Write-Host " - $file"
}

Write-Host "`nAre you sure you want to proceed? (y/n)" -ForegroundColor Yellow
$confirmation = Read-Host

if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
    foreach ($file in $filesToDelete) {
        if (Test-Path $file) {
            Write-Host "Deleting $file" -ForegroundColor Cyan
            Remove-Item $file
        } else {
            Write-Host "File not found: $file" -ForegroundColor Yellow
        }
    }
    Write-Host "`nCleanup complete!" -ForegroundColor Green
} else {
    Write-Host "`nOperation cancelled." -ForegroundColor Red
} 