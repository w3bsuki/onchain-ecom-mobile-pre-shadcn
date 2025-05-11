'use client';

import { useState } from 'react';

export default function ImageTestPage() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  async function testDirectImage() {
    // Use a known Medusa image URL (you may need to adjust this)
    const testUrl = '/uploads/thumbnail.jpg';
    setImageUrl(`/api/medusa-image?path=${encodeURIComponent(testUrl)}`);
    setLoading(false);
    setError(null);
    setImageLoaded(false);
    setImageError(false);
  }

  async function testCustomImage() {
    const inputUrl = prompt('Enter Medusa image path (e.g., /uploads/test.jpg):');
    if (!inputUrl) return;
    
    setImageUrl(`/api/medusa-image?path=${encodeURIComponent(inputUrl)}`);
    setLoading(false);
    setError(null);
    setImageLoaded(false);
    setImageError(false);
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Medusa Image Loading Test</h1>
      
      <div className="flex space-x-4 mb-8">
        <button 
          onClick={testDirectImage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Test Default Image
        </button>
        
        <button 
          onClick={testCustomImage}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Test Custom Image
        </button>
      </div>
      
      {imageUrl && (
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Image Test Result</h2>
          <p className="mb-2">URL: {imageUrl}</p>
          
          <div className="aspect-video bg-gray-100 relative mb-4 overflow-hidden">
            <img
              src={imageUrl}
              alt="Test image"
              className="object-contain max-h-[300px] mx-auto"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
          
          {imageLoaded && <p className="text-green-600">✅ Image loaded successfully!</p>}
          {imageError && <p className="text-red-600">❌ Failed to load image</p>}
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Troubleshooting Info:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check if Medusa backend is running</li>
              <li>Verify the image path is correct</li>
              <li>Check browser network tab for errors</li>
              <li>Try using a different image path</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 