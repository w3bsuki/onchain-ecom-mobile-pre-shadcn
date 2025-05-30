/**
 * Centralized Medusa client configuration
 * This file provides a single source of truth for Medusa client configuration
 * and prevents multiple client instances across the application.
 */

import Medusa from "@medusajs/medusa-js";
import { MedusaError } from "@medusajs/medusa-js";

// Configuration
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const MAX_RETRIES = 3;

// Hard-coded publishable API key to guarantee it's set
const PUBLISHABLE_API_KEY = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';

// Create a singleton instance of the Medusa client
let clientInstance: Medusa | null = null;

/**
 * Get the Medusa client instance
 * This ensures we always use the same instance throughout the application
 */
export const getMedusaClient = (): Medusa => {
  if (!clientInstance) {
    clientInstance = new Medusa({ 
      baseUrl: MEDUSA_BACKEND_URL,
      maxRetries: MAX_RETRIES
    });
    
    // Always set the publishable API key
    clientInstance.setPublishableKey(PUBLISHABLE_API_KEY);
    
    console.log(`Medusa client initialized with URL: ${MEDUSA_BACKEND_URL}`);
    console.log(`Medusa client API key set: ${PUBLISHABLE_API_KEY.substring(0, 10)}...`);
  }
  
  return clientInstance;
};

/**
 * Reset the Medusa client instance
 * Useful for testing or when configuration changes
 */
export const resetMedusaClient = (): void => {
  clientInstance = null;
};

/**
 * Handle Medusa API errors in a consistent way
 */
export const handleMedusaError = (error: unknown): Error => {
  if (error instanceof MedusaError) {
    // Handle specific Medusa error types
    const { message, type, code } = error;
    console.error(`Medusa API Error (${type} - ${code}): ${message}`);
    return new Error(`Medusa API Error: ${message}`);
  }
  
  // Handle other error types
  console.error('Unexpected error in Medusa operation:', error);
  return error instanceof Error 
    ? error 
    : new Error('An unexpected error occurred with the Medusa API');
};

/**
 * Check if the Medusa server is available
 */
export const checkMedusaConnection = async (): Promise<boolean> => {
  try {
    const client = getMedusaClient();
    // Try a simple health check operation
    await client.health.status();
    return true;
  } catch (error) {
    console.error('Medusa server connection check failed:', error);
    return false;
  }
};

// Export the default client for backward compatibility
export default getMedusaClient(); 