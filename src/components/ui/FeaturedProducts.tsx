import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProducts() {
  const { products, loading, error } = useProducts({ 
    limit: 4,
    featured: true
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white">
            <CardHeader className="p-0">
              <Skeleton className="aspect-square w-full rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">No featured products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const firstVariant = product.variants[0];
        const price = firstVariant?.prices?.[0]?.amount || 0;
        
        return (
          <Card key={product.id} className="bg-white h-full flex flex-col">
            <CardHeader className="p-0">
              <Link href={`/products/${product.handle}`}>
                <div className="overflow-hidden rounded-t-lg">
                  <Image
                    src={product.thumbnail || '/images/placeholder/product-placeholder.jpg'}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="aspect-square object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <Link href={`/products/${product.handle}`}>
                <CardTitle className="text-lg font-medium hover:text-primary">
                  {product.title}
                </CardTitle>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {product.description}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="font-semibold">{formatCurrency(price / 100)}</div>
              <Button asChild size="sm">
                <Link href={`/products/${product.handle}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
} 