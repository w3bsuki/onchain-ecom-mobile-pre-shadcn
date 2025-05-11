'use client';

import { useState } from 'react';
import ProductImage from '../../components/ProductImage';

export default function ImageProxyTestPage() {
  const [testPath, setTestPath] = useState('/uploads/test.jpg');
  const [showResults, setShowResults] = useState(false);
  
  const testImages = [
    '/uploads/test.jpg',
    'uploads/product.png',
    'http://localhost:9000/uploads/test.jpg',
    'https://via.placeholder.com/300x300?text=Test',
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="font-bold mb-6 text-2xl">Image Proxy Test</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col mb-4">
          <label htmlFor="testPath" className="mb-2">Test Image Path:</label>
          <input
            id="testPath"
            type="text"
            value={testPath}
            onChange={(e) => setTestPath(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-500 font-semibold hover:bg-blue-600 px-4 py-2 rounded text-white"
        >
          Test Image Loading
        </button>
      </form>
      
      {showResults && (
        <div className="border-t pt-6">
          <h2 className="font-semibold mb-4 text-xl">Test Results for: {testPath}</h2>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="border p-4 rounded">
              <h3 className="font-medium mb-2">Direct Image URL</h3>
              <div className="bg-gray-100 h-64 relative">
                <img
                  src={testPath}
                  alt="Direct URL test"
                  className="h-full object-contain w-full"
                  onError={(e) => console.error("Direct image failed to load")}
                />
              </div>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-medium mb-2">Via ProductImage Component</h3>
              <div className="bg-gray-100 h-64 relative">
                <ProductImage
                  src={testPath}
                  alt="ProductImage component test"
                  className="h-full object-contain w-full"
                />
              </div>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-medium mb-2">Direct API Proxy URL</h3>
              <div className="bg-gray-100 h-64 relative">
                <img
                  src={`/api/medusa-image?path=${encodeURIComponent(testPath)}`}
                  alt="API proxy test"
                  className="h-full object-contain w-full"
                  onError={(e) => console.error("API proxy image failed to load")}
                />
              </div>
            </div>
          </div>
          
          <h2 className="font-semibold mb-4 mt-8 text-xl">Common Test Images</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {testImages.map((path, index) => (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-medium mb-2 text-sm truncate">{path}</h3>
                <div className="bg-gray-100 h-40 relative">
                  <ProductImage
                    src={path}
                    alt={`Test image ${index + 1}`}
                    className="h-full object-contain w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 