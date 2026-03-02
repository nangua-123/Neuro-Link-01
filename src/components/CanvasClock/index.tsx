// File: src/components/CanvasClock/index.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Button } from 'antd-mobile';
import { StrokePoint, CanvasClockData } from '../../interfaces/scale';

interface Props {
  onChange?: (data: CanvasClockData) => void;
}

export const CanvasClock: React.FC<Props> = ({ onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<StrokePoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // 记录上一次抬笔的时间，用于计算停顿
  const lastEndTimestamp = useRef<number | null>(null);
  const totalPauseDuration = useRef<number>(0);
  const firstStartTimestamp = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // 动态设置 Canvas 实际分辨率以防模糊
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 300; // 固定高度
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#333333';
      }
    }
  }, []);

  const getCoordinates = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const now = Date.now();
    
    if (!firstStartTimestamp.current) {
      firstStartTimestamp.current = now;
    }

    // 计算停顿时间
    if (lastEndTimestamp.current) {
      totalPauseDuration.current += (now - lastEndTimestamp.current);
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    recordStroke(x, y, now, 'start');
  };

  const draw = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const now = Date.now();

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    recordStroke(x, y, now, 'move');
  };

  const stopDrawing = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);
    const now = Date.now();
    lastEndTimestamp.current = now;
    
    // 结束时不需要坐标，取最后一次的坐标或0
    recordStroke(0, 0, now, 'end');
    
    // 触发 onChange 通知父组件
    if (onChange) {
      onChange({
        strokes,
        totalPauseDurationMs: totalPauseDuration.current,
        totalDrawDurationMs: firstStartTimestamp.current ? now - firstStartTimestamp.current : 0
      });
    }
  };

  const recordStroke = (x: number, y: number, timestamp: number, type: 'start' | 'move' | 'end') => {
    setStrokes(prev => [...prev, { x, y, timestamp, type }]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setStrokes([]);
      lastEndTimestamp.current = null;
      totalPauseDuration.current = 0;
      firstStartTimestamp.current = null;
      if (onChange) {
        onChange({ strokes: [], totalPauseDurationMs: 0, totalDrawDurationMs: 0 });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white relative" style={{ touchAction: 'none' }}>
        <canvas
          ref={canvasRef}
          className="w-full block bg-gray-50/50"
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="absolute bottom-3 right-3">
          <Button size="mini" color="default" onClick={clearCanvas} className="rounded-lg text-xs shadow-sm">
            重画
          </Button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400 flex justify-between px-1">
        <span>* 请直接在上方区域手写绘制</span>
        {strokes.length > 0 && <span>已记录 {strokes.length} 个笔触点</span>}
      </div>
    </div>
  );
};
