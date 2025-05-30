@echo off
echo E-Commerce Project Cleanup Script
echo This script will remove Supabase and existing Medusa implementations
echo to prepare for a fresh Medusa.js installation

echo.
echo Starting cleanup process...

rem Remove Supabase integration files
echo Removing Supabase files...
if exist src\lib\supabase-client.ts del /q src\lib\supabase-client.ts
if exist src\utils\supabase\middleware.ts del /q src\utils\supabase\middleware.ts
if exist src\context\SupabaseProvider.tsx del /q src\context\SupabaseProvider.tsx

rem Remove API routes
echo Removing Supabase API routes...
if exist src\app\api\debug-products\route.ts del /q src\app\api\debug-products\route.ts
if exist src\app\api\seed-products\route.ts del /q src\app\api\seed-products\route.ts
if exist src\app\api\setup-database\route.ts del /q src\app\api\setup-database\route.ts

rem Remove hooks and components
echo Removing Supabase-dependent hooks and components...
if exist src\hooks\useProducts.ts del /q src\hooks\useProducts.ts
if exist src\hooks\useCart.ts del /q src\hooks\useCart.ts

rem Remove Supabase database files
echo Removing Supabase database files...
if exist supabase rmdir /s /q supabase
if exist supabase_image_storage_setup.md del /q supabase_image_storage_setup.md
if exist supabase_json_field_guide.md del /q supabase_json_field_guide.md
if exist troubleshooting_supabase.md del /q troubleshooting_supabase.md

rem Remove existing Medusa implementation
echo Removing existing Medusa implementation...
if exist my-medusa-store rmdir /s /q my-medusa-store
if exist src\components\MedusaImage.tsx del /q src\components\MedusaImage.tsx
if exist src\components\errors\MedusaConnectionError.tsx del /q src\components\errors\MedusaConnectionError.tsx
if exist src\app\api\medusa-direct-test\route.ts del /q src\app\api\medusa-direct-test\route.ts
if exist src\app\api\medusa-image\route.ts del /q src\app\api\medusa-image\route.ts
if exist src\app\api\medusa-proxy\route.ts del /q src\app\api\medusa-proxy\route.ts
if exist src\app\api\medusa-status\route.ts del /q src\app\api\medusa-status\route.ts
if exist src\app\api\medusa-test\route.ts del /q src\app\api\medusa-test\route.ts
if exist src\app\image-test\page.tsx del /q src\app\image-test\page.tsx
if exist src\app\image-proxy-test\page.tsx del /q src\app\image-proxy-test\page.tsx
if exist src\app\image-debug\page.tsx del /q src\app\image-debug\page.tsx

rem Clean Next.js cache
echo Cleaning Next.js cache...
if exist .next rmdir /s /q .next

rem Note: The config.ts file will need to be updated manually in Windows
echo.
echo Config file update required:
echo Please manually edit src\config.ts to remove Supabase references

echo.
echo Cleanup completed! Next steps:
echo 1. Review remaining files for any missed Supabase or old Medusa references
echo 2. Run 'npm prune && npm install' to clean up dependencies 
echo 3. Install the new Medusa.js backend following the instructions in cleanup.md

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