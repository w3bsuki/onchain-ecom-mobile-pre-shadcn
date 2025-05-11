'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MEDUSA_API_URL } from '../../config';

export default function MedusaTestPage() {
  const [status, setStatus] = useState<string>('Waiting to test...');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [medusaUrl, setMedusaUrl] = useState<string>(MEDUSA_API_URL);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState<boolean>(false);

  const runDiagnostics = async () => {
    setStatus('Running diagnostics...');
    setErrorDetails(null);
    setIsRunningDiagnostics(true);
    
    try {
      // Test 1: Health endpoint through proxy
      let result = 'Diagnostics results:\n\n';
      
      try {
        result += '1. Testing health endpoint...\n';
        const healthResponse = await fetch('/api/medusa-proxy?endpoint=/health');
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          result += `✅ Health endpoint: Success (Status: ${healthResponse.status})\n`;
          
          // Health endpoint special case
          if (healthData.message === 'OK') {
            result += `Response: Medusa is healthy\n\n`;
          } else {
            result += `Response: ${JSON.stringify(healthData)}\n\n`;
          }
        } else {
          const errorText = await healthResponse.text();
          result += `❌ Health endpoint: Failed (Status: ${healthResponse.status})\n`;
          result += `Error: ${errorText}\n\n`;
          setStatus('Connection Error');
          setErrorDetails(result);
          setIsRunningDiagnostics(false);
          return;
        }
      } catch (error: any) {
        result += `❌ Health endpoint: Exception\n`;
        result += `Error: ${error.message}\n\n`;
        setStatus('Connection Error');
        setErrorDetails(result);
        setIsRunningDiagnostics(false);
        return;
      }
      
      // Test 2: Store products endpoint
      try {
        result += '2. Testing store/products endpoint...\n';
        const productsResponse = await fetch('/api/medusa-proxy?endpoint=/store/products');
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          result += `✅ Products endpoint: Success (Status: ${productsResponse.status})\n`;
          
          // Check if we got products
          if (productsData.products && productsData.products.length > 0) {
            result += `Found ${productsData.products.length} products\n`;
            result += `First product: ${productsData.products[0].title}\n\n`;
          } else {
            result += `⚠️ No products found. Have you created and published products in Medusa?\n\n`;
          }
        } else {
          const errorText = await productsResponse.text();
          result += `❌ Products endpoint: Failed (Status: ${productsResponse.status})\n`;
          result += `Error: ${errorText}\n\n`;
        }
      } catch (error: any) {
        result += `❌ Products endpoint: Exception\n`;
        result += `Error: ${error.message}\n\n`;
      }
      
      // Success if we got this far
      setStatus('Connection Successful');
      setErrorDetails(result);
    } catch (error: any) {
      setStatus('Diagnostics Error');
      setErrorDetails(`Error: ${error.message}`);
    }
    
    setIsRunningDiagnostics(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medusa Integration Test</h1>
      
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {status === 'Connection Successful' 
            ? '✅ Connection Successful' 
            : status === 'Connection Error' 
              ? '❌ Medusa Connection Error'
              : '🔄 ' + status}
        </h2>
        
        {errorDetails && (
          <div className="mt-4 bg-gray-100 p-4 rounded-md overflow-auto max-h-80">
            <pre className="text-sm whitespace-pre-wrap">{errorDetails}</pre>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Medusa URL:</h3>
          <p className="text-sm mb-4 font-mono bg-gray-100 p-2 rounded">{medusaUrl}</p>
          
          <button 
            onClick={runDiagnostics}
            disabled={isRunningDiagnostics}
            className={`px-4 py-2 rounded-md ${
              isRunningDiagnostics 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-medium`}
          >
            {isRunningDiagnostics ? 'Running...' : 'Run Diagnostics'}
          </button>
          
          <Link href="/medusa-check" className="ml-4 text-blue-500 hover:underline">
            Try Another Test
          </Link>
        </div>
      </div>
      
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps:</h2>
        <ul className="list-disc pl-5 space-y-3">
          <li>Check if your Medusa server is running at <code className="bg-gray-100 px-1 py-0.5 rounded">{medusaUrl}</code></li>
          <li>Verify CORS is properly configured in your Medusa <code className="bg-gray-100 px-1 py-0.5 rounded">medusa-config.js</code> file</li>
          <li>Make sure your <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file has the correct Medusa URL</li>
          <li>If you've added products in Medusa, check they are published</li>
          <li>See the <Link href="/docs" className="text-blue-500 hover:underline">Medusa Setup Guide</Link> for detailed instructions.</li>
        </ul>
      </div>
    </div>
  );
} 