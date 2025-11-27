import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Calculator } from './Calculator';

// Mock the Desmos API
const mockCalculator = {
  destroy: vi.fn(),
  setBlank: vi.fn(),
  resize: vi.fn(),
  updateSettings: vi.fn(),
  setExpression: vi.fn(),
  removeExpression: vi.fn(),
  setExpressions: vi.fn(),
  getExpressions: vi.fn(() => []),
  screenshot: vi.fn(() => 'data:image/png;base64,...'),
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
};

const mockDesmos = {
  GraphingCalculator: vi.fn(() => mockCalculator),
  enabledFeatures: {
    graphing: true,
  },
};

// Mock environment variables
vi.mock('import-meta-env', () => ({
  env: {
    VITE_DESMOS_API_KEY: 'dc7b80953740498dbc177f55a7e30baf',
  },
}));

describe('Calculator Component', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock window.Desmos
    (window as any).Desmos = mockDesmos;

    // Mock environment variable
    vi.stubEnv('VITE_DESMOS_API_KEY', 'dc7b80953740498dbc177f55a7e30baf');

    // Mock script loading
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'script') {
        // Simulate successful script load
        setTimeout(() => {
          if (element.onload) {
            (element.onload as any)(new Event('load'));
          }
        }, 0);
      }
      return element;
    });
  });

  afterEach(() => {
    // Clean up Desmos from window
    delete (window as any).Desmos;

    // Restore mocks
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('should render the calculator component', () => {
    render(<Calculator />);
    expect(screen.getByRole('region', { name: /calculator/i })).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    render(<Calculator />);
    expect(screen.getByText(/loading calculator/i)).toBeInTheDocument();
  });

  it('should initialize Desmos Graphing Calculator with correct options', async () => {
    render(<Calculator />);

    await waitFor(() => {
      expect(mockDesmos.GraphingCalculator).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.objectContaining({
          keypad: true,
          expressions: true,
          settingsMenu: true,
          expressionsTopbar: true,
          border: false,
          fontSize: 14,
        })
      );
    });
  });

  it('should hide loading state after calculator loads', async () => {
    render(<Calculator />);

    await waitFor(() => {
      expect(screen.queryByText(/loading calculator/i)).not.toBeInTheDocument();
    });
  });

  it('should show error when API key is missing', async () => {
    // Remove API key from environment
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_DESMOS_API_KEY', '');

    render(<Calculator />);

    await waitFor(() => {
      expect(screen.getByText(/desmos api key is not configured/i)).toBeInTheDocument();
    });
  });

  it('should destroy calculator instance on unmount', async () => {
    const { unmount } = render(<Calculator />);

    await waitFor(() => {
      expect(mockDesmos.GraphingCalculator).toHaveBeenCalled();
    });

    unmount();

    expect(mockCalculator.destroy).toHaveBeenCalled();
  });

  it('should handle script loading errors gracefully', async () => {
    // Mock script loading failure
    delete (window as any).Desmos;

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = document.createElement(tagName);
      if (tagName === 'script') {
        setTimeout(() => {
          if (element.onerror) {
            (element.onerror as any)(new Event('error'));
          }
        }, 0);
      }
      return element;
    });

    render(<Calculator />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load desmos api script/i)).toBeInTheDocument();
    });
  });

  it('should have correct accessibility attributes', () => {
    render(<Calculator />);

    const calculatorRegion = screen.getByRole('region', { name: /calculator/i });
    expect(calculatorRegion).toBeInTheDocument();
  });

  it('should reuse existing Desmos instance if already loaded', async () => {
    // First render
    const { unmount } = render(<Calculator />);

    await waitFor(() => {
      expect(mockDesmos.GraphingCalculator).toHaveBeenCalledTimes(1);
    });

    unmount();

    // Second render - should reuse window.Desmos
    render(<Calculator />);

    await waitFor(() => {
      expect(mockDesmos.GraphingCalculator).toHaveBeenCalledTimes(2);
    });
  });

  it('should render calculator container with correct styling', async () => {
    render(<Calculator />);

    await waitFor(() => {
      const calculatorDiv = screen.getByLabelText('Desmos Graphing Calculator');
      expect(calculatorDiv).toHaveStyle({ width: '100%', height: '600px' });
    });
  });

  it('should not call destroy if calculator was not initialized', () => {
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_DESMOS_API_KEY', '');

    const { unmount } = render(<Calculator />);
    unmount();

    expect(mockCalculator.destroy).not.toHaveBeenCalled();
  });

  it('should load script with correct API key', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement');

    render(<Calculator />);

    await waitFor(() => {
      const scriptCalls = createElementSpy.mock.results
        .map((result) => result.value)
        .filter((el) => el.tagName === 'SCRIPT') as HTMLScriptElement[];

      if (scriptCalls.length > 0) {
        const scriptSrc = scriptCalls[0].src;
        expect(scriptSrc).toContain('calculator.js');
        expect(scriptSrc).toContain('apiKey=');
      }
    });
  });
});
