@echo off
echo Deleting unused components...

if exist "src\components\products\filters\mobile-filters-optimized.tsx" del "src\components\products\filters\mobile-filters-optimized.tsx"
if exist "src\components\ui\optimized-bottom-sheet.tsx" del "src\components\ui\optimized-bottom-sheet.tsx"
if exist "src\components\ui\CategoryTabsSkeleton.tsx" del "src\components\ui\CategoryTabsSkeleton.tsx"
if exist "src\components\SkeletonProductCard.tsx" del "src\components\SkeletonProductCard.tsx"
if exist "src\components\OnchainStoreModal.tsx" del "src\components\OnchainStoreModal.tsx"
if exist "src\components\MockCheckoutButton.tsx" del "src\components\MockCheckoutButton.tsx"
if exist "src\components\ProductModal.tsx" del "src\components\ProductModal.tsx"
if exist "src\components\layout\navigation\MobileBottomNav.tsx" del "src\components\layout\navigation\MobileBottomNav.tsx"
if exist "src\components\CategoryIcons.tsx" del "src\components\CategoryIcons.tsx"
if exist "src\components\CategoryIconsShowcase.tsx" del "src\components\CategoryIconsShowcase.tsx"
if exist "src\components\test-rendering.tsx" del "src\components\test-rendering.tsx"
if exist "src\components\OnchainStoreItem.test.tsx" del "src\components\OnchainStoreItem.test.tsx"
if exist "src\components\OnchainStoreItems.tsx" del "src\components\OnchainStoreItems.tsx"
if exist "src\components\OnchainStore.tsx" del "src\components\OnchainStore.tsx"
if exist "src\components\OnchainStoreItem.tsx" del "src\components\OnchainStoreItem.tsx"
if exist "src\components\OnchainStoreSummary.tsx" del "src\components\OnchainStoreSummary.tsx"
if exist "src\components\ui\CategoryIcon.tsx" del "src\components\ui\CategoryIcon.tsx"
if exist "src\components\ui\CategoryTabs.test.tsx" del "src\components\ui\CategoryTabs.test.tsx"

echo Cleanup complete! 