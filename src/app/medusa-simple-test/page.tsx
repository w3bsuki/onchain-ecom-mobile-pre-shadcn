'use client'

import { useState, useEffect } from 'react'
import { getProducts } from '../../lib/medusa-client'
import Link from 'next/link'

export default function MedusaSimpleTestPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        console.log('Fetching products from Medusa...')
        const productData = await getProducts()
        console.log('Products fetched:', productData)
        setProducts(productData)
        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching products:', err)
        setError(err?.message || 'Error fetching products')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Medusa Simple Test</h1>
      <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Back to Home
      </Link>

      {loading ? (
        <div className="animate-pulse bg-gray-100 p-4 rounded">
          Loading products...
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded border border-red-200">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Make sure your Medusa backend is running at <code className="bg-gray-100 px-1 py-0.5 rounded">http://localhost:9000</code>
          </p>
        </div>
      ) : (
        <div>
          <div className="bg-green-50 p-4 rounded mb-6 border border-green-200">
            <p className="text-green-700">✓ Connected to Medusa successfully!</p>
            <p className="text-sm text-green-600">Found {products.length} products</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h2 className="font-semibold text-lg">{product.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  {product.variants && product.variants[0]?.prices && (
                    <p className="font-bold">
                      ${(product.variants[0].prices[0]?.amount / 100).toFixed(2)}
                    </p>
                  )}
                  <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 