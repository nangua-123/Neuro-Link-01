// File: src/mocks/chat.ts
import { ChatMessage, MessageRole } from '../interfaces/chat';

export const MOCK_CHAT_FLOW: ChatMessage[] = [
  {
    id: 'msg-1',
    role: MessageRole.AI,
    content: '您好，我是数字华佗。请问最近哪里不舒服？',
    timestamp: Date.now() - 60000,
  },
  {
    id: 'msg-2',
    role: MessageRole.USER,
    content: '最近总是头痛，像针扎一样，还怕光。',
    timestamp: Date.now() - 50000,
  },
  {
    id: 'msg-3',
    role: MessageRole.AI,
    content: '了解了。头痛持续多久了？有没有伴随恶心想吐的感觉？',
    timestamp: Date.now() - 40000,
  },
  {
    id: 'msg-4',
    role: MessageRole.USER,
    content: '大概有两三天了，偶尔会觉得恶心。',
    timestamp: Date.now() - 30000,
  },
  {
    id: 'msg-5',
    role: MessageRole.SYSTEM,
    content: 'SYMPTOM_CARD', // 标识渲染症状图谱卡片
    timestamp: Date.now() - 20000,
    isCard: true,
  }
];
