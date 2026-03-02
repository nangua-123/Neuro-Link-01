// File: src/views/Home/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_CHAT_FLOW } from '../../mocks/chat';
import { MessageRole, ChatMessage } from '../../interfaces/chat';
import { SymptomCard } from './components/SymptomCard';

export default function HomeView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 模拟对话流逐条出现
  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < MOCK_CHAT_FLOW.length) {
        const nextMsg = MOCK_CHAT_FLOW[currentIndex];
        if (nextMsg) {
          setMessages(prev => {
            // 防止重复添加同一个消息（Strict Mode 下可能发生）
            if (prev.some(m => m.id === nextMsg.id)) return prev;
            return [...prev, nextMsg];
          });
        }
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 1200); // 每1.2秒出现一条，模拟打字感

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const renderMessage = (msg: ChatMessage) => {
    if (!msg) return null;
    if (msg.isCard && msg.content === 'SYMPTOM_CARD') {
      return <SymptomCard key={msg.id} />;
    }

    const isAI = msg.role === MessageRole.AI;

    return (
      <div key={msg.id} className={`flex w-full mb-4 px-4 animate-fade-in ${isAI ? 'justify-start' : 'justify-end'}`}>
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mr-2 shrink-0">
            AI
          </div>
        )}
        <div 
          className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
            isAI 
              ? 'bg-white text-gray-800 rounded-tl-none shadow-sm' 
              : 'bg-primary text-white rounded-tr-none shadow-md shadow-blue-500/20'
          }`}
        >
          {msg.content}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center justify-center">
        <h1 className="text-base font-bold text-gray-900">数字华佗</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4" ref={scrollRef}>
        <div className="text-center mb-6">
          <span className="text-xs text-gray-400 bg-gray-200/50 px-2 py-1 rounded-full">
            免费预问诊已开启
          </span>
        </div>
        {messages.map(renderMessage)}
      </div>
    </div>
  );
}
