# Components to Delete

This file lists components that are not being used in the application and can be safely deleted.

## Duplicate Components

- `src/components/products/filters/mobile-filters-optimized.tsx` - Duplicate of mobile-filters.tsx
- `src/components/ui/optimized-bottom-sheet.tsx` - Duplicate of bottom-sheet.tsx
- `src/components/ui/CategoryTabsSkeleton.tsx` - Duplicate of products/categories/CategoryTabsSkeleton.tsx
- `src/components/SkeletonProductCard.tsx` - Duplicate of products/ProductCardSkeleton.tsx
- `src/components/OnchainStoreModal.tsx` - Not used in current application flow
- `src/components/MockCheckoutButton.tsx` - Not used in current application flow
- `src/components/ProductModal.tsx` - Not used (replaced by ProductQuickView)

## Unused Navigation Components

- `src/components/layout/navigation/MobileBottomNav.tsx` - Empty file (0 bytes)
- `src/components/CategoryIcons.tsx` - Replaced by category-icons.tsx
- `src/components/CategoryIconsShowcase.tsx` - Not used in current application flow

## Debug/Test Components

- `src/components/test-rendering.tsx` - Test file
- `src/components/OnchainStoreItem.test.tsx` - Test file

## Deprecated Onchain Components

- `src/components/OnchainStoreItems.tsx` - Replaced by EnhancedMedusaProducts
- `src/components/OnchainStore.tsx` - Replaced by centralized services
- `src/components/OnchainStoreItem.tsx` - Replaced by UIProductCard
- `src/components/OnchainStoreSummary.tsx` - Not used in current application

## Duplicate Category Components

- `src/components/ui/CategoryIcon.tsx` - Redundant with category-icons components
- `src/components/ui/CategoryTabs.test.tsx` - Test file

## Script to Delete These Files

You can run the following PowerShell script to delete all these files at once:

```powershell
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

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Write-Host "Deleting $file"
        Remove-Item $file
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Cleanup complete!"
```

## Debug/Demo Pages to Consider Removing

Additionally, the following demo and debug pages could be removed if they're not needed for production:

- `src/app/debug/` - Debug pages
- `src/app/medusa-debug/` - Medusa debug pages
- `src/app/image-debug/` - Image debug pages
- `src/app/image-proxy-test/` - Image proxy test pages
- `src/app/image-test/` - Image test pages
- `src/app/demos/` - Demo pages

Note: These pages are not included in the deletion script to avoid breaking the application navigation. 