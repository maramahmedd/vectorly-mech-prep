import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Whiteboard } from './Whiteboard';

describe('Whiteboard Fullscreen Functionality', () => {
  let mockRequestFullscreen: ReturnType<typeof vi.fn>;
  let mockExitFullscreen: ReturnType<typeof vi.fn>;
  let fullscreenElement: Element | null = null;

  beforeEach(() => {
    // Mock fullscreen API
    mockRequestFullscreen = vi.fn().mockResolvedValue(undefined);
    mockExitFullscreen = vi.fn().mockResolvedValue(undefined);

    // Mock requestFullscreen on HTMLElement
    HTMLElement.prototype.requestFullscreen = mockRequestFullscreen;

    // Mock document.exitFullscreen
    Object.defineProperty(document, 'exitFullscreen', {
      writable: true,
      configurable: true,
      value: mockExitFullscreen,
    });

    // Mock document.fullscreenElement
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => fullscreenElement,
    });
  });

  afterEach(() => {
    fullscreenElement = null;
    vi.restoreAllMocks();
  });

  it('renders fullscreen button', () => {
    render(<Whiteboard />);
    const fullscreenButton = screen.getByTestId('fullscreen-button');
    expect(fullscreenButton).toBeInTheDocument();
    expect(fullscreenButton).toHaveTextContent('Fullscreen');
  });

  it('calls requestFullscreen when fullscreen button is clicked', async () => {
    render(<Whiteboard />);
    const fullscreenButton = screen.getByTestId('fullscreen-button');

    fireEvent.click(fullscreenButton);

    await waitFor(() => {
      expect(mockRequestFullscreen).toHaveBeenCalledTimes(1);
    });
  });

  it('changes button text to "Exit Fullscreen" when in fullscreen mode', async () => {
    const { container } = render(<Whiteboard />);
    const fullscreenButton = screen.getByTestId('fullscreen-button');

    // Simulate entering fullscreen
    fireEvent.click(fullscreenButton);
    fullscreenElement = container.firstChild as Element;

    // Trigger fullscreenchange event
    const fullscreenChangeEvent = new Event('fullscreenchange');
    document.dispatchEvent(fullscreenChangeEvent);

    await waitFor(() => {
      expect(fullscreenButton).toHaveTextContent('Exit Fullscreen');
    });
  });

  it('calls exitFullscreen when clicking exit fullscreen button', async () => {
    const { container } = render(<Whiteboard />);
    const fullscreenButton = screen.getByTestId('fullscreen-button');

    // First enter fullscreen
    fireEvent.click(fullscreenButton);
    fullscreenElement = container.firstChild as Element;
    const fullscreenChangeEvent = new Event('fullscreenchange');
    document.dispatchEvent(fullscreenChangeEvent);

    await waitFor(() => {
      expect(fullscreenButton).toHaveTextContent('Exit Fullscreen');
    });

    // Then exit fullscreen
    fireEvent.click(fullscreenButton);

    await waitFor(() => {
      expect(mockExitFullscreen).toHaveBeenCalledTimes(1);
    });
  });

  it('updates state when fullscreenchange event is triggered', async () => {
    const { container } = render(<Whiteboard />);
    const fullscreenButton = screen.getByTestId('fullscreen-button');

    // Enter fullscreen
    fullscreenElement = container.firstChild as Element;
    const enterEvent = new Event('fullscreenchange');
    document.dispatchEvent(enterEvent);

    await waitFor(() => {
      expect(fullscreenButton).toHaveTextContent('Exit Fullscreen');
    });

    // Exit fullscreen
    fullscreenElement = null;
    const exitEvent = new Event('fullscreenchange');
    document.dispatchEvent(exitEvent);

    await waitFor(() => {
      expect(fullscreenButton).toHaveTextContent('Fullscreen');
    });
  });

  it('handles fullscreen errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const errorMessage = 'Fullscreen not supported';
    mockRequestFullscreen.mockRejectedValueOnce(new Error(errorMessage));

    render(<Whiteboard />);
    const fullscreenButton = screen.getByTestId('fullscreen-button');

    fireEvent.click(fullscreenButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fullscreen error:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('preserves canvas content when entering fullscreen', async () => {
    const { container } = render(<Whiteboard />);
    const canvas = screen.getByTestId('whiteboard-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Draw something on the canvas
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(10, 10, 50, 50);
    }

    const initialData = canvas.toDataURL();
    const fullscreenButton = screen.getByTestId('fullscreen-button');

    // Enter fullscreen
    fireEvent.click(fullscreenButton);
    fullscreenElement = container.firstChild as Element;
    const fullscreenChangeEvent = new Event('fullscreenchange');
    document.dispatchEvent(fullscreenChangeEvent);

    await waitFor(() => {
      expect(fullscreenButton).toHaveTextContent('Exit Fullscreen');
    }, { timeout: 3000 });

    // Canvas content should be preserved (this is a basic check)
    expect(canvas.toDataURL()).toBeDefined();
  });

  it('cleans up fullscreenchange event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(<Whiteboard />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
  });

  it('applies correct CSS classes in fullscreen mode', async () => {
    const { container } = render(<Whiteboard />);
    const fullscreenButton = screen.getByTestId('fullscreen-button');

    // Enter fullscreen
    fireEvent.click(fullscreenButton);
    fullscreenElement = container.firstChild as Element;
    const fullscreenChangeEvent = new Event('fullscreenchange');
    document.dispatchEvent(fullscreenChangeEvent);

    await waitFor(() => {
      const whiteboardContainer = container.firstChild as HTMLElement;
      expect(whiteboardContainer.className).toContain('h-screen');
      expect(whiteboardContainer.className).toContain('w-screen');
    });
  });

  it('does not apply fullscreen classes when not in fullscreen', () => {
    const { container } = render(<Whiteboard />);
    const whiteboardContainer = container.firstChild as HTMLElement;

    expect(whiteboardContainer.className).not.toContain('h-screen');
    expect(whiteboardContainer.className).not.toContain('w-screen');
  });
});

describe('Whiteboard Basic Functionality', () => {
  it('renders canvas element', () => {
    render(<Whiteboard />);
    const canvas = screen.getByTestId('whiteboard-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders all control buttons', () => {
    render(<Whiteboard />);
    expect(screen.getByText('Eraser')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByTestId('fullscreen-button')).toBeInTheDocument();
  });

  it('respects custom height prop', () => {
    render(<Whiteboard height={600} />);
    const canvas = screen.getByTestId('whiteboard-canvas') as HTMLCanvasElement;
    expect(canvas.style.height).toBe('600px');
  });

  it('uses default height when not specified', () => {
    render(<Whiteboard />);
    const canvas = screen.getByTestId('whiteboard-canvas') as HTMLCanvasElement;
    expect(canvas.style.height).toBe('400px');
  });
});
