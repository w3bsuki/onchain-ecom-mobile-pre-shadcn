import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { medusaClient } from '@/lib/medusa-client';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parentId = searchParams.get('parentId');
  
  try {
    // Get categories from Medusa
    const { product_categories } = await medusaClient.productCategories.list({
      // Filter by parent_id if provided
      parent_category_id: parentId === 'null' ? null : parentId || undefined,
    });
    
    return NextResponse.json({ categories: product_categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

// POST, PUT and DELETE operations should be handled through Medusa Admin API
export async function POST() {
  return NextResponse.json(
    { error: 'Please use Medusa Admin API to create categories' },
    { status: 405 }
  );
}

// PUT /api/categories/:id - Update a category
export async function PUT() {
  return NextResponse.json(
    { error: 'Please use Medusa Admin API to update categories' },
    { status: 405 }
  );
}

// DELETE /api/categories/:id - Delete a category
export async function DELETE() {
  return NextResponse.json(
    { error: 'Please use Medusa Admin API to delete categories' },
    { status: 405 }
  );
} 