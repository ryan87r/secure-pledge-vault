import { useState, useEffect } from 'react';
import { createInstance, initSDK, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeZama = async () => {
    if (isLoading || isInitialized) return;

    try {
      setIsLoading(true);
      setError(null);

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
      setInstance(zamaInstance);
      setIsInitialized(true);
      console.log('FHE SDK initialized successfully');

    } catch (err) {
      console.error('Failed to initialize Zama instance:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to initialize encryption service: ${errorMessage}. Please ensure you have a wallet connected and try refreshing the page.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeZama();
  }, []);

  return {
    instance,
    isLoading,
    error,
    isInitialized,
    initializeZama
  };
}
