import React, { useState, useCallback, useMemo } from 'react';
import { NavBar, Result, SafeArea, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import { AssessmentEngine } from '../../components/AssessmentEngine';
import { simulateNetworkRequest } from '../../utils/network';
import {
  scale_cdr_informant_memory,
  scale_cdr_informant_orientation_judgment,
  scale_cdr_informant_social_home_care,
} from '../../configs/scales/cdr';
import { scale_ad8 } from '../../configs/scales/ad8';
import { scale_phq9 } from '../../configs/scales/phq9';
import {
  scale_epilepsy_crf_v0_part1,
  scale_epilepsy_crf_v0_part2,
  scale_epilepsy_crf_v0_part3,
} from '../../configs/scales/epilepsy';
import { scale_migraine_midas_mock } from '../../configs/scales/migraine';

export default function AssessmentView() {
  const navigate = useNavigate();
  const { selectedDiseaseTag } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [direction, setDirection] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { steps: assessmentSteps, subtitle } = useMemo(() => {
    switch (selectedDiseaseTag) {
      case DiseaseTag.EPILEPSY:
        return {
          subtitle: '华西癫痫基线期 (V0) 档案',
          steps: [
            {
              id: 'epi_step1',
              title: '入排与基本信息',
              schema: scale_epilepsy_crf_v0_part1,
            },
            {
              id: 'epi_step2',
              title: '癫痫史与发作矩阵',
              schema: scale_epilepsy_crf_v0_part2,
            },
            {
              id: 'epi_step3',
              title: '用药、病史与检查',
              schema: scale_epilepsy_crf_v0_part3,
            },
          ],
        };
      case DiseaseTag.MIGRAINE:
        return {
          subtitle: '偏头痛 MIDAS 初筛',
          steps: [
            {
              id: 'mig_step1',
              title: 'MIDAS 初筛',
              schema: scale_migraine_midas_mock,
            },
          ],
        };
      case DiseaseTag.AD:
      case DiseaseTag.NONE:
      default:
        return {
          subtitle: '认知障碍综合评估',
          steps: [
            {
              id: 'ad8_step',
              title: 'AD8 早期筛查',
              schema: scale_ad8,
            },
            {
              id: 'phq9_step',
              title: 'PHQ-9 抑郁筛查',
              schema: scale_phq9,
            },
            {
              id: 'cdr_step1',
              title: 'CDR 记忆篇',
              schema: scale_cdr_informant_memory,
            },
            {
              id: 'cdr_step2',
              title: 'CDR 定向与判断篇',
              schema: scale_cdr_informant_orientation_judgment,
            },
            {
              id: 'cdr_step3',
              title: 'CDR 社会与生活自理篇',
              schema: scale_cdr_informant_social_home_care,
            },
          ],
        };
    }
  }, [selectedDiseaseTag]);

  const currentStep = assessmentSteps[currentStepIndex];

  const handleNextStep = useCallback(
    async (stepData: Record<string, any>) => {
      setAssessmentData(prev => ({ ...prev, ...stepData }));
      if (currentStepIndex < assessmentSteps.length - 1) {
        setDirection(1);
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Last step, submit all data
        const finalData = { ...assessmentData, ...stepData };
        
        setIsSubmitting(true);
        try {
          await simulateNetworkRequest(null, 1500, 0.2); // 20% 概率模拟提交失败
          setIsSubmitting(false);
          setIsCompleted(true);
          setTimeout(() => {
            navigate('/report', { state: { payload: finalData, diseaseTag: selectedDiseaseTag } });
          }, 1500);
        } catch (error) {
          setIsSubmitting(false);
          Toast.show({ content: '提交失败，请重试', icon: 'fail' });
        }
      }
    },
    [currentStepIndex, assessmentSteps.length, assessmentData, navigate, selectedDiseaseTag]
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
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <NavBar onBack={() => navigate(-1)} className="bg-white border-b border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <span className="font-semibold text-[16px] text-slate-900">测评完成</span>
        </NavBar>
        <div className="flex-1 flex flex-col items-center justify-center pb-20 px-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mb-8 shadow-[0_8px_30px_rgba(59,130,246,0.15)]"
          >
            <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-[24px] font-bold text-slate-900 mb-3 tracking-tight">测评已完成</h2>
          <p className="text-[14px] text-slate-500 text-center leading-relaxed font-medium">
            正在为您生成华西 AI 脑健康风险分层报告...
          </p>
        </div>
        <SafeArea position="bottom" />
      </div>
    );
  }

  const progressPercent = ((currentStepIndex + 1) / assessmentSteps.length) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col overflow-hidden">
      <div className="bg-white z-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative">
        <NavBar
          onBack={handleBackStep}
          className="bg-white"
        >
          <div className="flex flex-col items-center">
            <span className="text-[16px] font-bold text-slate-900">
              {currentStepIndex + 1} / {assessmentSteps.length} {currentStep.title}
            </span>
            <span className="text-[12px] text-slate-500 mt-0.5 tracking-wide font-medium">{subtitle}</span>
          </div>
        </NavBar>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
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
                isSubmitting={isSubmitting}
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
