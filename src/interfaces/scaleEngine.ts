// File: src/interfaces/scaleEngine.ts

export enum QuestionType {
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  CANVAS_CLOCK = 'CANVAS_CLOCK',
  AUDIO_REPEAT = 'AUDIO_REPEAT',
  TEXT = 'TEXT',
}

export type TargetAudience = 'PATIENT' | 'FAMILY' | 'BOTH';

export interface QuestionOption {
  label: string;
  value: string | number;
  score?: number; // 用于量表计分
}

export interface BranchLogic {
  condition: {
    operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN';
    value: any;
  };
  nextQuestionId: string; // 满足条件时跳转的题目ID
}

export interface CanvasConfig {
  recordStrokes?: boolean; // 预留采集笔触坐标流 (x, y, timestamp) 的字段
  strokeDataField?: string;
}

export interface AudioConfig {
  targetWords: string[]; // 必须包含的基准词汇
  isDelayedRecall?: boolean; // 是否为延迟回忆
  delayMinutes?: number; // 延迟分钟数 (如 5, 20)
  repeatCount?: number; // 回忆次数 (如即刻回忆的第1、2、3次)
}

export interface QuestionNode {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  target: TargetAudience; // 题目受众，用于双端流转
  options?: QuestionOption[];
  required?: boolean;
  
  // 针对特殊高阶题型的配置
  audioConfig?: AudioConfig;
  canvasConfig?: CanvasConfig;

  // 跳题逻辑引擎
  branches?: BranchLogic[];
  
  // 如果没有命中任何 branch，默认的下一题 ID。若为空则表示结束或按顺序下一题
  defaultNextId?: string; 
}

export interface FormSchema {
  id: string;
  version: string;
  name: string;
  description?: string;
  entryQuestionId: string; // 入口题目ID
  questions: Record<string, QuestionNode>; // 以 ID 为 Key 的题目字典，方便 O(1) 查找与跳题
}
