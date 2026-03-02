// File: src/interfaces/chat.ts

export enum MessageRole {
  AI = 'AI',
  USER = 'USER',
  SYSTEM = 'SYSTEM', // 用于渲染系统卡片（如症状图谱）
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isCard?: boolean; // 若为 true，则根据 content 渲染特殊卡片
}
