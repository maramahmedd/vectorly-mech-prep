import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function Calculator() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<Desmos.Calculator | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_DESMOS_API_KEY;

    if (!apiKey) {
      setError('Desmos API key is not configured. Please add VITE_DESMOS_API_KEY to your environment variables.');
      setIsLoading(false);
      return;
    }

    // Function to load Desmos API script
    const loadDesmosScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script is already loaded
        if (window.Desmos) {
          resolve();
          return;
        }

        // Check if script element already exists
        const existingScript = document.getElementById('desmos-api-script');
        if (existingScript && scriptLoadedRef.current) {
          // Wait for the script to finish loading
          const checkDesmos = setInterval(() => {
            if (window.Desmos) {
              clearInterval(checkDesmos);
              resolve();
            }
          }, 100);
          return;
        }

        // Create and load the script
        const script = document.createElement('script');
        script.id = 'desmos-api-script';
        script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${apiKey}`;
        script.async = true;

        script.onload = () => {
          scriptLoadedRef.current = true;
          resolve();
        };

        script.onerror = () => {
          reject(new Error('Failed to load Desmos API script'));
        };

        // Replace the placeholder script tag or append to head
        const placeholderScript = document.getElementById('desmos-api-script');
        if (placeholderScript && placeholderScript.parentNode) {
          placeholderScript.parentNode.replaceChild(script, placeholderScript);
        } else {
          document.head.appendChild(script);
        }
      });
    };

    // Initialize calculator
    const initializeCalculator = async () => {
      try {
        await loadDesmosScript();

        if (!calculatorRef.current) {
          setError('Calculator container not found');
          setIsLoading(false);
          return;
        }

        // Initialize the graphing calculator
        const calculator = window.Desmos.GraphingCalculator(calculatorRef.current, {
          keypad: true,
          expressions: true,
          settingsMenu: true,
          expressionsTopbar: true,
          border: false,
          fontSize: 14,
        });

        calculatorInstance.current = calculator;
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error initializing Desmos calculator:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize calculator');
        setIsLoading(false);
      }
    };

    initializeCalculator();

    // Cleanup function
    return () => {
      if (calculatorInstance.current) {
        try {
          calculatorInstance.current.destroy();
          calculatorInstance.current = null;
        } catch (err) {
          console.error('Error destroying calculator:', err);
        }
      }
    };
  }, []);

  return (
    <Card className="p-4 w-full" role="region" aria-label="Calculator">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && !error && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading calculator...</p>
          </div>
        </div>
      )}

      <div
        ref={calculatorRef}
        className={`${isLoading || error ? 'hidden' : ''}`}
        style={{ width: '100%', height: '600px' }}
        aria-label="Desmos Graphing Calculator"
      />
    </Card>
  );
}
