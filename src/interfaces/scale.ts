// File: src/interfaces/scale.ts

export enum QuestionType {
  RADIO = 'Radio',
  CANVAS_CLOCK = 'Canvas-Clock',
  AUDIO_REPEAT = 'Audio-Repeat',
}

export interface QuestionOption {
  label: string;
  value: string | number;
}

export interface ScaleQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: QuestionOption[];
  required?: boolean;
}

export interface ScaleSchema {
  id: string;
  name: string;
  description?: string;
  questions: ScaleQuestion[];
}

// 科研级画钟数据结构
export interface StrokePoint {
  x: number;
  y: number;
  timestamp: number;
  type: 'start' | 'move' | 'end';
}

export interface CanvasClockData {
  strokes: StrokePoint[];
  totalPauseDurationMs: number; // 总停顿耗时（毫秒）
  totalDrawDurationMs: number;  // 总绘制耗时（毫秒）
}
