// File: src/views/Assessment/index.tsx
import React, { useState, useCallback } from 'react';
import { NavBar, Result, SafeArea } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store';
import { AssessmentEngine } from '../../components/AssessmentEngine';
import {
  scale_cdr_informant_memory,
  scale_cdr_informant_orientation_judgment,
  scale_cdr_informant_social_home_care,
} from '../../configs/scales/cdr';

// Define the schemas for each step
const assessmentSteps = [
  {
    id: 'step1',
    title: '记忆篇',
    schema: scale_cdr_informant_memory,
  },
  {
    id: 'step2',
    title: '定向与判断篇',
    schema: scale_cdr_informant_orientation_judgment,
  },
  {
    id: 'step3',
    title: '社会与生活自理篇',
    schema: scale_cdr_informant_social_home_care,
  },
];

export default function AssessmentView() {
  const navigate = useNavigate();
  const { selectedDiseaseTag } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [direction, setDirection] = useState(1);

  const currentStep = assessmentSteps[currentStepIndex];

  const handleNextStep = useCallback(
    (stepData: Record<string, any>) => {
      setAssessmentData(prev => ({ ...prev, ...stepData }));
      if (currentStepIndex < assessmentSteps.length - 1) {
        setDirection(1);
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Last step, submit all data
        const finalData = { ...assessmentData, ...stepData };
        console.log('【测评完成】生成的答卷 Payload:', finalData);
        setIsCompleted(true);
        setTimeout(() => {
          navigate('/report', { state: { payload: finalData } });
        }, 1500);
      }
    },
    [currentStepIndex, assessmentSteps.length, assessmentData]
  );

  const handleBackStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(prev => prev - 1);
    } else {
      navigate(-1); // Go back if on the first step
    }
  }, [currentStepIndex, navigate]);

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <NavBar onBack={() => navigate(-1)} className="bg-white border-b border-gray-100">
          测评完成
        </NavBar>
        <div className="flex-1 flex flex-col items-center justify-center pb-20 px-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">测评已完成</h2>
          <p className="text-gray-500 text-center">
            正在为您生成华西 AI 脑健康风险分层报告...
          </p>
        </div>
        <SafeArea position="bottom" />
      </div>
    );
  }

  const progressPercent = ((currentStepIndex + 1) / assessmentSteps.length) * 100;

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col overflow-hidden">
      <div className="bg-white z-10 shadow-sm relative">
        <NavBar
          onBack={handleBackStep}
          className="bg-white"
        >
          <div className="flex flex-col items-center">
            <span className="text-base font-medium text-gray-900">
              {currentStepIndex + 1} / {assessmentSteps.length} {currentStep.title}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">CDR 知情者问卷</span>
          </div>
        </NavBar>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: `${(currentStepIndex / assessmentSteps.length) * 100}%` }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep.id}
            custom={direction}
            variants={stepTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full h-full overflow-y-auto"
          >
            <div className="pt-6 pb-24">
              <AssessmentEngine 
                schema={currentStep.schema as any}
                onSubmit={handleNextStep}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}

const stepTransitionVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};
