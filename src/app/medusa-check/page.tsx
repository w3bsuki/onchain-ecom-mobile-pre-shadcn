'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MEDUSA_API_URL } from '../../config';

export default function MedusaCheckPage() {
  const [status, setStatus] = useState<string>('Checking Medusa connection...');
  const [details, setDetails] = useState<string | null>(null);
  const [medusaUrl, setMedusaUrl] = useState<string>(MEDUSA_API_URL);

  useEffect(() => {
    async function checkMedusa() {
      try {
        // Use the proxy API route to avoid CORS issues
        const response = await fetch('/api/medusa-proxy?endpoint=/health');
        
        if (response.ok) {
          const data = await response.json();
          setStatus('✅ Medusa is running correctly!');
          setDetails(JSON.stringify(data, null, 2));
        } else {
          const errorText = await response.text();
          setStatus('❌ Failed to connect to Medusa');
          setDetails(`Error: ${errorText}\n\nMake sure your Medusa server is running at ${medusaUrl}`);
        }
      } catch (error: any) {
        setStatus('❌ Failed to connect to API route');
        setDetails(`Error: ${error.message}\n\nMake sure your Next.js server is running properly.`);
      }
    }
    
    checkMedusa();
  }, [medusaUrl]);

  const testConnection = async () => {
    setStatus('Testing Medusa connection again...');
    try {
      // Use the proxy API route to avoid CORS issues
      const response = await fetch('/api/medusa-proxy?endpoint=/health');
      
      if (response.ok) {
        const data = await response.json();
        setStatus('✅ Medusa is running correctly!');
        setDetails(JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        setStatus('❌ Failed to connect to Medusa');
        setDetails(`Error: ${errorText}\n\nMake sure your Medusa server is running at ${medusaUrl}`);
      }
    } catch (error: any) {
      setStatus('❌ Failed to connect to API route');
      setDetails(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medusa Connection Test</h1>
      
      <div className="w-full bg-yellow-100 p-4 rounded-md mb-4 border border-yellow-300">
        <h2 className="text-lg font-semibold mb-2">⚠️ Important Note</h2>
        <p>You're running the Next.js app on port 3001 and Medusa on port 3000.</p>
        <p className="mt-2">Make sure you've configured CORS in your Medusa backend to allow requests from: <code>http://localhost:3001</code></p>
      </div>
      
      <Link href="/" className="text-blue-500 mb-8 hover:underline">
        ← Back to Store
      </Link>
      
      <div className="w-full bg-gray-100 p-4 rounded-md mb-4">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        <p className="mb-2">{status}</p>
        
        <h3 className="font-medium mt-4 mb-2">Connection Details</h3>
        <div className="bg-white p-3 rounded overflow-auto max-h-60">
          <pre className="text-sm">{details || 'No details available'}</pre>
        </div>
        
        <h3 className="font-medium mt-4 mb-2">Medusa API URL</h3>
        <p className="text-sm mb-2">{medusaUrl}</p>
        
        <div className="mt-4">
          <button 
            onClick={testConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Connection Again
          </button>
        </div>
      </div>
      
      <div className="w-full bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Make sure your Medusa server is running at <code>{medusaUrl}</code></li>
          <li>Verify the Medusa server is started with <code>npm start</code> in the medusa-backend folder</li>
          <li>Check that you have products created in your Medusa database</li>
          <li>If using a custom environment URL, ensure it's set correctly in your <code>.env.local</code> file</li>
          <li><strong>CORS Configuration:</strong> Update your Medusa's <code>medusa-config.js</code> file to include:
            <pre className="bg-white p-2 rounded mt-1 text-xs">
{`const STORE_CORS = process.env.STORE_CORS || "http://localhost:3001";

module.exports = {
  projectConfig: {
    store_cors: STORE_CORS,
    // ...other configs
  },
  // ...plugins
};`}
            </pre>
          </li>
        </ul>
      </div>
    </div>
  );
} 