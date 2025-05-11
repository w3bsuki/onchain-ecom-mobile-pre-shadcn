import ProductImage from './ProductImage';

interface MedusaProduct {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  thumbnail: string | null;
  variants: Array<{
    id: string;
    title: string;
    prices: Array<{
      amount: number;
      currency_code: string;
    }>;
  }>;
}

interface MedusaProductListProps {
  products: MedusaProduct[];
}

export default function MedusaProductList({ products }: MedusaProductListProps) {
  if (!products.length) {
    return (
      <div className="border bg-yellow-50 p-4 rounded">
        <p>No products found in your Medusa store. Add some products in the Medusa admin panel.</p>
      </div>
    );
  }

  return (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
      {products.map((product) => (
        <div key={product.id} className="hover:shadow-md overflow-hidden rounded-lg shadow-sm transition-shadow">
          <div className="h-48 relative">
            <ProductImage src={product.thumbnail} alt={product.title} className="h-full object-cover w-full" />
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold mb-2 text-3xl">{product.title}</h3>
            
            {product.description && (
              <p className="mb-3 text-gray-600 text-sm">
                {product.description?.substring(0, 100)}
                {product.description?.length > 100 ? '...' : ''}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <span className="font-bold text-lg">
                {product.variants[0]?.prices[0]?.amount 
                  ? `$${(product.variants[0]?.prices[0]?.amount / 100).toFixed(2)}` 
                  : 'Price not available'}
              </span>
              
              <button 
                type="button"
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm text-white"
                // onClick={() => console.log('Add to cart:', product.id)} // Placeholder action
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 