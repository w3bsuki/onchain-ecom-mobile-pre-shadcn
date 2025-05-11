'use client';

import { useState } from 'react';

export default function MedusaDirectTestPage() {
  const [imagePath, setImagePath] = useState('/uploads/test.jpg');
  const [imageResult, setImageResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/medusa-direct-test?path=${encodeURIComponent(imagePath)}`);
      
      // Check if it's an image response or JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('image/')) {
        // Create a URL for the image blob
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        setImageResult({
          isImage: true,
          imageUrl,
          status: response.status,
          contentType,
        });
      } else {
        // Parse JSON response
        const data = await response.json();
        setImageResult({
          isImage: false,
          data,
          status: response.status,
        });
      }
    } catch (error) {
      console.error('Error testing image:', error);
      setImageResult({
        isImage: false,
        error: 'Failed to test image. See console for details.',
        status: 500,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Predefined paths to test
  const testPaths = [
    '/uploads/test.jpg',
    '/uploads/thumbnail.jpg',
    '/assets/images/test.png',
    '/images/product.jpg',
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Medusa Direct Image Test</h1>
      <p className="mb-4">
        This page tests direct image access from your Medusa backend to diagnose issues.
      </p>
      
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex space-x-2">
          <input
            type="text"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            className="border p-2 rounded flex-grow"
            placeholder="Enter image path (e.g., /uploads/test.jpg)"
          />
          <button 
            onClick={testImage} 
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            {loading ? 'Testing...' : 'Test Image'}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {testPaths.map((path) => (
            <button
              key={path}
              onClick={() => {
                setImagePath(path);
                setImageResult(null);
              }}
              className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
            >
              {path}
            </button>
          ))}
        </div>
      </div>
      
      {imageResult && (
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Test Result</h2>
          <p className="mb-2">
            Status: <span className={imageResult.status === 200 ? 'text-green-600' : 'text-red-600'}>
              {imageResult.status}
            </span>
          </p>
          
          {imageResult.isImage ? (
            <div className="mb-4">
              <p className="mb-2">Content Type: {imageResult.contentType}</p>
              <div className="bg-gray-100 p-4 flex justify-center">
                <img 
                  src={imageResult.imageUrl} 
                  alt="Test result" 
                  className="max-h-[300px] border"
                />
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <p className="mb-2">Response:</p>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                {JSON.stringify(imageResult.data || imageResult.error, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-yellow-50 rounded">
            <h3 className="font-semibold mb-2">Troubleshooting</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>If you get a 404 error, the image path might not exist on your Medusa server</li>
              <li>Try using a known image path from a product in your admin panel</li>
              <li>Check if your Medusa server is running and accessible</li>
              <li>Verify that image serving is properly configured in your Medusa instance</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 