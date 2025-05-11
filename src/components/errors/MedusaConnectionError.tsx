import React from 'react';

interface MedusaConnectionErrorProps {
  error: string;
  medusaUrl?: string;
  onRetry?: () => void;
}

export function MedusaConnectionError({ 
  error, 
  medusaUrl = 'http://localhost:9000',
  onRetry 
}: MedusaConnectionErrorProps) {
  return (
    <div className="p-4 border rounded bg-red-50">
      <h2 className="text-lg font-bold mb-4">Medusa Connection Error</h2>
      <p className="text-red-500 mb-2">Error: {error}</p>
      
      <div className="mt-4">
        <p className="font-semibold">Medusa URL:</p>
        <p className="font-mono text-sm">{medusaUrl}</p>
      </div>
      
      {onRetry && (
        <div className="mt-4">
          <button
            onClick={onRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-white rounded border">
        <p className="font-semibold mb-2">Troubleshooting Steps:</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Check if your Medusa server is running at <code className="bg-gray-100 px-1">{medusaUrl}</code></li>
          <li>Verify CORS is properly configured in your Medusa <code className="bg-gray-100 px-1">medusa-config.js</code> file</li>
          <li>Make sure your <code className="bg-gray-100 px-1">.env.local</code> file has the correct Medusa URL</li>
          <li>If you've added products in Medusa, check they are published</li>
        </ol>
        
        <p className="mt-4 text-sm">
          See the <a href="/docs/MEDUSA_SETUP.md" className="text-blue-500 hover:underline">Medusa Setup Guide</a> for detailed instructions.
        </p>
      </div>
    </div>
  );
} 