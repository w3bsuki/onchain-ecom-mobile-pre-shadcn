import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint');
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  switch (endpoint) {
    case '/cart':
      try {
        const { data: cartItems, error } = await supabase
          .from('cart_items')
          .select('*, products(*)')
          .eq('user_id', userId);

        if (error) {
          throw error;
        }

        return NextResponse.json({ cartItems });
      } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
          { error: 'Error fetching cart' },
          { status: 500 },
        );
      }

    default:
      return NextResponse.json(
        { error: 'Invalid endpoint' },
        { status: 400 },
      );
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint');
  const body = await request.json();

  switch (endpoint) {
    case '/cart/add':
      try {
        const { userId, productId, quantity } = body;

        if (!userId || !productId) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 },
          );
        }

        // If quantity is 0, remove the item
        if (quantity === 0) {
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

          if (error) {
            throw error;
          }

          return NextResponse.json({ message: 'Item removed from cart' });
        }

        // Upsert the cart item
        const { error } = await supabase
          .from('cart_items')
          .upsert(
            {
              user_id: userId,
              product_id: productId,
              quantity,
            },
            {
              onConflict: 'user_id,product_id',
            },
          );

        if (error) {
          throw error;
        }

        return NextResponse.json({ message: 'Cart updated successfully' });
      } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json(
          { error: 'Error updating cart' },
          { status: 500 },
        );
      }

    default:
      return NextResponse.json(
        { error: 'Invalid endpoint' },
        { status: 400 },
      );
  }
} 