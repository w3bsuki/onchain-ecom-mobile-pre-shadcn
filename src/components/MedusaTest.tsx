'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '../lib/medusa-client';
import { MEDUSA_API_URL } from '../config';
import { MedusaConnectionError } from './errors/MedusaConnectionError';
import MedusaProductList from './MedusaProductList';

export default function MedusaTest() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [medusaUrl, setMedusaUrl] = useState<string>(MEDUSA_API_URL);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      setDiagnostics(null);
      console.log('Fetching products from Medusa...');
      
      // First check the health endpoint
      const healthCheck = await fetch('/api/medusa-proxy?endpoint=/health');
      console.log('Medusa health check status:', healthCheck.status);
      
      // If health check fails, stop here
      if (!healthCheck.ok) {
        throw new Error(`Medusa health check failed: ${healthCheck.status}`);
      }
      
      // Try to fetch products with explicit expand parameters
      const productData = await getProducts();
      console.log('Products fetched successfully:', productData);
      setProducts(productData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setLoading(false);
    }
  }

  const runDiagnostics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our debug endpoint
      const response = await fetch('/api/medusa-debug');
      const data = await response.json();
      
      console.log('Diagnostics result:', data);
      setDiagnostics(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error running diagnostics:', err);
      setError(`Diagnostics error: ${err.message}`);
      setLoading(false);
    }
  };

  const renderDiagnostics = () => {
    if (!diagnostics) return null;
    
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded border">
        <h3 className="text-md font-semibold mb-3">Medusa Diagnostics</h3>
        
        <div className="space-y-4">
          <div>
            <p className="font-medium">Medusa URL: <span className="font-mono">{diagnostics.medusaUrl}</span></p>
          </div>
          
          <div>
            <p className="font-medium">Health Check: 
              <span className={`ml-2 ${diagnostics.health.status === 200 ? 'text-green-600' : 'text-red-600'}`}>
                {diagnostics.health.status === 200 ? '✓ OK' : `✗ Failed (${diagnostics.health.status})`}
              </span>
            </p>
            {diagnostics.health.error && (
              <p className="text-sm text-red-500 mt-1">{diagnostics.health.error}</p>
            )}
          </div>
          
          <div>
            <p className="font-medium">Products Endpoint: 
              <span className={`ml-2 ${diagnostics.products.status === 200 ? 'text-green-600' : 'text-red-600'}`}>
                {diagnostics.products.status === 200 ? '✓ OK' : `✗ Failed (${diagnostics.products.status})`}
              </span>
            </p>
            {diagnostics.products.error && (
              <p className="text-sm text-red-500 mt-1">{diagnostics.products.error}</p>
            )}
            {diagnostics.products.data && (
              <p className="text-sm mt-1">Found {diagnostics.products.data.products?.length || 0} products</p>
            )}
          </div>
          
          <div>
            <p className="font-medium">Regions Endpoint:
              <span className={`ml-2 ${diagnostics.regions.status === 200 ? 'text-green-600' : 'text-red-600'}`}>
                {diagnostics.regions.status === 200 ? '✓ OK' : `✗ Failed (${diagnostics.regions.status})`}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 border rounded">
        <h2 className="text-lg font-bold mb-4">Medusa Integration Test</h2>
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading products from Medusa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded">
        <h2 className="text-lg font-bold mb-4">Medusa Integration Test</h2>
        <MedusaConnectionError 
          error={error}
          medusaUrl={medusaUrl}
          onRetry={fetchProducts}
        />
        <div className="mt-4">
          <button
            onClick={runDiagnostics}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Run Diagnostics
          </button>
        </div>
        {renderDiagnostics()}
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Medusa Integration Test</h2>
        
        <div className="flex space-x-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={debugMode}
              onChange={() => setDebugMode(!debugMode)}
              className="mr-2"
            />
            <span className="text-sm">Debug Mode</span>
          </label>
          
          <button
            onClick={fetchProducts}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Refresh Products
          </button>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div>
          <p>No products found in Medusa. Try adding some products to your Medusa backend.</p>
          <div className="mt-4">
            <p className="font-semibold">Medusa URL:</p>
            <p className="font-mono text-sm">{medusaUrl}</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Successfully connected to Medusa!
            </p>
            <p className="text-sm text-green-600 ml-7">Found {products.length} products</p>
          </div>
          
          {debugMode && (
            <div className="mb-4 p-3 bg-gray-50 border rounded">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Debug Information</h3>
                <button
                  onClick={runDiagnostics}
                  className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
                >
                  Run Diagnostics
                </button>
              </div>
              {renderDiagnostics()}
            </div>
          )}
          
          <MedusaProductList products={products} />
        </div>
      )}
    </div>
  );
} 