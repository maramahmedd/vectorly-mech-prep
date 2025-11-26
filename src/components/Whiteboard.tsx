import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Trash2, Pencil } from 'lucide-react';

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [isEraser, setIsEraser] = useState(false);

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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

  return (
    <div className="border rounded-lg p-4 bg-white">
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
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-gray-200 rounded cursor-crosshair w-full"
        style={{ height: `${height}px` }}
      />
    </div>
  );
});
