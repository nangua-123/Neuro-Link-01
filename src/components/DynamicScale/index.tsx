// File: src/components/DynamicScale/index.tsx
import React, { useState } from 'react';
import { FormSchema, BranchLogic } from '../../interfaces/scaleEngine';

interface DynamicScaleProps {
  schema: FormSchema;
  onComplete: (answers: Record<string, any>) => void;
}

export default function DynamicScale({ schema, onComplete }: DynamicScaleProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(schema.entryQuestionId);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // 核心算法：条件匹配评估器
  const evaluateCondition = (logic: BranchLogic, answerValue: any): boolean => {
    const { operator, value: targetValue } = logic.condition;
    switch (operator) {
      case 'EQUALS':
        return answerValue === targetValue;
      case 'NOT_EQUALS':
        return answerValue !== targetValue;
      case 'CONTAINS':
        return Array.isArray(answerValue) 
          ? answerValue.includes(targetValue) 
          : String(answerValue).includes(String(targetValue));
      case 'GREATER_THAN':
        return Number(answerValue) > Number(targetValue);
      case 'LESS_THAN':
        return Number(answerValue) < Number(targetValue);
      default:
        return false;
    }
  };

  // 核心算法：处理下一题与跳题逻辑
  const handleNext = (answerValue: any) => {
    // 1. 保存当前答案
    const newAnswers = { ...answers, [currentQuestionId]: answerValue };
    setAnswers(newAnswers);

    const currentQuestion = schema.questions[currentQuestionId];
    let nextId: string | undefined = undefined;

    // 2. 遍历读取 branches 进行条件匹配
    if (currentQuestion.branches && currentQuestion.branches.length > 0) {
      for (const branch of currentQuestion.branches) {
        if (evaluateCondition(branch, answerValue)) {
          nextId = branch.nextQuestionId;
          break; // 命中第一个满足条件的跳题规则，立即中断
        }
      }
    }

    // 3. 匹配失败时降级到 defaultNextId
    if (!nextId) {
      nextId = currentQuestion.defaultNextId;
    }

    // 4. 执行跳转或触发完成回调
    if (nextId && schema.questions[nextId]) {
      setCurrentQuestionId(nextId);
    } else {
      // 没有下一题，完成测评
      onComplete(newAnswers);
    }
  };

  return <div>UI Placeholder</div>;
}
