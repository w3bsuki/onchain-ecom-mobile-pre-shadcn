import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { medusaClient, ProductFilterOptions } from '@/lib/medusa-client';

// GET /api/products - Get all products or filter by category
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const featured = searchParams.get('featured');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
  
  try {
    // Build filter options
    const options: ProductFilterOptions = { limit };
    
    if (featured === 'true') {
      options.collection_id = ['featured'];
    }
    
    if (categoryId) {
      options.category_id = [categoryId];
    }
    
    const { products, count } = await medusaClient.products.list(options);
    
    return NextResponse.json({ products, count });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}

// POST, PUT and DELETE operations should be handled through Medusa Admin API
// These are kept as stubs for compatibility
export async function POST() {
  return NextResponse.json(
    { error: 'Please use Medusa Admin API to create products' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Please use Medusa Admin API to update products' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Please use Medusa Admin API to delete products' },
    { status: 405 }
  );
} 