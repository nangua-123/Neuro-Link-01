// File: src/interfaces/scale.ts

export enum QuestionType {
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  DATE = 'date',
  NUMBER = 'number',
  RADIO_WITH_INPUT = 'radio_with_input',
  CHECKBOX_WITH_INPUT = 'checkbox_with_input',
  INPUT_GROUP = 'input_group',
  RADIO_WITH_NESTED_INPUT = 'radio_with_nested_input',
  RADIO_WITH_COMPLEX_SUB = 'radio_with_complex_sub',
  CANVAS_CLOCK = 'Canvas-Clock',
  AUDIO_REPEAT = 'Audio-Repeat',
}

export interface FormField {
  id: string;
  label?: string;
  type: 'text' | 'number' | 'date';
  placeholder?: string;
  unit?: string;
}

export interface QuestionOption {
  label: string;
  value: string | number;
  requiresInput?: boolean;
  inputPlaceholder?: string;
  nestedFields?: FormField[];
  subQuestions?: ScaleQuestion[];
}

export interface ScaleQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: QuestionOption[];
  fields?: FormField[];
  required?: boolean;
  placeholder?: string;
  dependsOn?: {
    questionId: string;
    value: any;
  };
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
