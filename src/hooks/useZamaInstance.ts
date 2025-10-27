import { useState, useEffect } from 'react';
import { createInstance, initSDK, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';

// Singleton pattern to prevent multiple initializations
let globalInstance: any = null;
let globalInitialized = false;
let globalLoading = false;
let globalError: string | null = null;

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(globalInstance);
  const [isLoading, setIsLoading] = useState(globalLoading);
  const [error, setError] = useState<string | null>(globalError);
  const [isInitialized, setIsInitialized] = useState(globalInitialized);

  const initializeZama = async () => {
    // If already initialized or currently loading, return
    if (globalInitialized || globalLoading) {
      return;
    }

    try {
      globalLoading = true;
      setIsLoading(true);
      setError(null);
      globalError = null;

      // Check if ethereum provider is available
      if (!(window as any).ethereum) {
        throw new Error('Ethereum provider not found. Please install MetaMask or another Web3 wallet.');
      }

      // Wait a bit for the provider to be fully ready
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Initializing FHE SDK...');
      await initSDK();

      const config = {
        ...SepoliaConfig,
        network: (window as any).ethereum
      };

      console.log('Creating FHE instance...');
      const zamaInstance = await createInstance(config);
      
      // Set global state
      globalInstance = zamaInstance;
      globalInitialized = true;
      globalLoading = false;
      globalError = null;
      
      // Update local state
      setInstance(zamaInstance);
      setIsInitialized(true);
      setIsLoading(false);
      setError(null);
      
      console.log('FHE SDK initialized successfully');

    } catch (err) {
      console.error('Failed to initialize Zama instance:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const fullErrorMessage = `Failed to initialize encryption service: ${errorMessage}. Please ensure you have a wallet connected and try refreshing the page.`;
      
      // Set global state
      globalError = fullErrorMessage;
      globalLoading = false;
      
      // Update local state
      setError(fullErrorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only initialize if not already initialized
    if (!globalInitialized && !globalLoading) {
      initializeZama();
    }
  }, []);

  return {
    instance,
    isLoading,
    error,
    isInitialized,
    initializeZama
  };
}
