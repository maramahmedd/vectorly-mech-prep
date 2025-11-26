import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Trash2, Pencil, Maximize2, Minimize2 } from 'lucide-react';

interface WhiteboardProps {
  height?: number;
  initialData?: string;
  onChange?: (dataUrl: string) => void;
}

export interface WhiteboardRef {
  getCanvasData: () => string;
  loadCanvasData: (dataUrl: string) => void;
  clear: () => void;
}

export const Whiteboard = forwardRef<WhiteboardRef, WhiteboardProps>(({ height = 400, initialData, onChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [isEraser, setIsEraser] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(height);
  const maxCanvasSizeRef = useRef({ width: 0, height });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = height;

    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load initial data if provided
    if (initialData) {
      loadCanvasData(initialData);
    }
  }, [height]);

  const getCanvasData = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    return canvas.toDataURL();
  };

  const loadCanvasData = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getCanvasData,
    loadCanvasData,
    clear: clearCanvas,
  }));

  // Notify parent of changes
  const notifyChange = () => {
    if (onChange) {
      onChange(getCanvasData());
    }
  };

  const getScaledCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    // Get mouse position relative to canvas display
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Scale coordinates based on the ratio between actual canvas size and display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: mouseX * scaleX,
      y: mouseY * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getScaledCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getScaledCoordinates(e);

    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? 20 : lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    notifyChange();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    notifyChange();
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const inFullscreen = !!document.fullscreenElement;
      setIsFullscreen(inFullscreen);

      // Resize canvas when entering/exiting fullscreen
      const canvas = canvasRef.current;
      if (!canvas) return;

      const currentData = getCanvasData();

      // Wait for layout to settle
      setTimeout(() => {
        const newHeight = inFullscreen ? window.innerHeight - 100 : height;
        const newWidth = canvas.offsetWidth;

        // Track the maximum dimensions ever used
        if (newWidth > maxCanvasSizeRef.current.width) {
          maxCanvasSizeRef.current.width = newWidth;
        }
        if (newHeight > maxCanvasSizeRef.current.height) {
          maxCanvasSizeRef.current.height = newHeight;
        }

        // Set display height
        setCanvasHeight(newHeight);

        // Always use the maximum dimensions for the actual canvas size
        // This prevents content loss when switching between fullscreen and normal
        const actualWidth = Math.max(newWidth, maxCanvasSizeRef.current.width);
        const actualHeight = Math.max(newHeight, maxCanvasSizeRef.current.height);

        if (canvas.width !== actualWidth || canvas.height !== actualHeight) {
          // Need to resize canvas
          const img = new Image();
          img.onload = () => {
            canvas.width = actualWidth;
            canvas.height = actualHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.drawImage(img, 0, 0);
            }
          };
          if (currentData) {
            img.src = currentData;
          }
        }
      }, 100);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [height]);

  return (
    <div ref={containerRef} className={`border rounded-lg p-4 bg-white ${isFullscreen ? 'h-screen w-screen' : ''}`}>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Button
          variant={isEraser ? 'default' : 'outline'}
          size="sm"
          onClick={toggleEraser}
        >
          <Eraser className="w-4 h-4 mr-2" />
          Eraser
        </Button>

        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-8 cursor-pointer"
            disabled={isEraser}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Width:</span>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-24"
            disabled={isEraser}
          />
        </div>

        <Button variant="outline" size="sm" onClick={clearCanvas}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          data-testid="fullscreen-button"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 mr-2" />
          ) : (
            <Maximize2 className="w-4 h-4 mr-2" />
          )}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-gray-200 rounded cursor-crosshair w-full"
        style={{
          height: `${canvasHeight}px`,
          display: 'block'
        }}
        data-testid="whiteboard-canvas"
      />
    </div>
  );
});
