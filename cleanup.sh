#!/bin/bash

# E-Commerce Project Cleanup Script
# This script will remove Supabase and existing Medusa implementations
# to prepare for a fresh Medusa.js installation

echo "Starting cleanup process..."

# Remove Supabase integration files
echo "Removing Supabase files..."
rm -f src/lib/supabase-client.ts
rm -f src/utils/supabase/middleware.ts
rm -rf src/context/SupabaseProvider.tsx

# Remove API routes
echo "Removing Supabase API routes..."
rm -f src/app/api/debug-products/route.ts
rm -f src/app/api/seed-products/route.ts
rm -f src/app/api/setup-database/route.ts

# Remove hooks and components
echo "Removing Supabase-dependent hooks and components..."
rm -f src/hooks/useProducts.ts
rm -f src/hooks/useCart.ts

# Remove Supabase database files
echo "Removing Supabase database files..."
rm -rf supabase/
rm -f supabase_image_storage_setup.md
rm -f supabase_json_field_guide.md
rm -f troubleshooting_supabase.md

# Remove existing Medusa implementation
echo "Removing existing Medusa implementation..."
rm -rf my-medusa-store/
rm -f src/components/MedusaImage.tsx
rm -f src/components/errors/MedusaConnectionError.tsx
rm -f src/app/api/medusa-direct-test/route.ts
rm -f src/app/api/medusa-image/route.ts
rm -f src/app/api/medusa-proxy/route.ts
rm -f src/app/api/medusa-status/route.ts
rm -f src/app/api/medusa-test/route.ts
rm -f src/app/image-test/page.tsx
rm -f src/app/image-proxy-test/page.tsx
rm -f src/app/image-debug/page.tsx

# Clean Next.js cache
echo "Cleaning Next.js cache..."
rm -rf .next/

# Update config.ts file to remove Supabase references
echo "Updating config.ts to remove Supabase..."
# Note: This is a simple grep-based replacement. For more complex changes,
# manual editing might be needed
grep -v "Supabase" src/config.ts | grep -v "NEXT_PUBLIC_SUPABASE" > src/config.ts.new
mv src/config.ts.new src/config.ts

echo "Cleanup completed! Next steps:"
echo "1. Review remaining files for any missed Supabase or old Medusa references"
echo "2. Run 'npm prune && npm install' to clean up dependencies"
echo "3. Install the new Medusa.js backend following the instructions in cleanup.md" 