// File: src/components/DynamicScale/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, Space, Radio, Button, Toast } from 'antd-mobile';
import { FormSchema, BranchLogic, QuestionType } from '../../interfaces/scaleEngine';
import { CanvasClock } from '../CanvasClock';
import AudioRecord from '../AudioRecord';

interface DynamicScaleProps {
  schema: FormSchema;
  onComplete: (answers: Record<string, any>) => void;
}

export default function DynamicScale({ schema, onComplete }: DynamicScaleProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(schema.entryQuestionId);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentAnswer, setCurrentAnswer] = useState<any>(undefined);

  // 当题目切换时，清空或恢复当前题目的答案状态
  useEffect(() => {
    setCurrentAnswer(answers[currentQuestionId] || undefined);
  }, [currentQuestionId, answers]);

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

  const currentQuestion = schema.questions[currentQuestionId];

  // 核心算法：处理下一题与跳题逻辑
  const handleNext = () => {
    // 表单校验
    if (currentQuestion.required && (currentAnswer === undefined || currentAnswer === '')) {
      Toast.show({ content: '请完成当前题目', position: 'bottom' });
      return;
    }

    // 1. 保存当前答案
    const newAnswers = { ...answers, [currentQuestionId]: currentAnswer };
    setAnswers(newAnswers);

    let nextId: string | undefined = undefined;

    // 2. 遍历读取 branches 进行条件匹配
    if (currentQuestion.branches && currentQuestion.branches.length > 0) {
      for (const branch of currentQuestion.branches) {
        if (evaluateCondition(branch, currentAnswer)) {
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

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case QuestionType.RADIO:
        return (
          <Radio.Group value={currentAnswer} onChange={setCurrentAnswer}>
            <Space direction="vertical" block style={{ '--gap': '12px' }}>
              {currentQuestion.options?.map(opt => (
                <Radio 
                  key={opt.value} 
                  value={opt.value} 
                  className="w-full p-3 bg-gray-50 rounded-xl border border-transparent transition-colors"
                  style={{
                    borderColor: currentAnswer === opt.value ? '#1677FF' : 'transparent',
                    backgroundColor: currentAnswer === opt.value ? '#E6F0FF' : '#F9FAFB'
                  }}
                >
                  <span className="text-gray-800 text-sm">{opt.label}</span>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );
      case QuestionType.CANVAS_CLOCK:
        return <CanvasClock onChange={(data) => setCurrentAnswer(data)} />;
      case QuestionType.AUDIO_REPEAT:
        return <AudioRecord onComplete={(text) => setCurrentAnswer(text)} />;
      default:
        return <div className="text-gray-400 text-sm text-center py-8">暂不支持的题型</div>;
    }
  };

  return (
    <div className="p-4">
      <Card className="shadow-sm border-none rounded-2xl bg-white">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 leading-snug mb-2">
            {currentQuestion.title}
          </h2>
          {currentQuestion.description && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {currentQuestion.description}
            </p>
          )}
        </div>
        
        <div className="mb-8 min-h-[200px]">
          {renderQuestionContent()}
        </div>

        <Button 
          block 
          color="primary" 
          size="large" 
          onClick={handleNext}
          disabled={currentQuestion.required && (currentAnswer === undefined || currentAnswer === '')}
          className="rounded-xl font-medium"
        >
          下一题
        </Button>
      </Card>
    </div>
  );
}
