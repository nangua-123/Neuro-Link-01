// File: src/store/recall.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export enum DangerLevel {
  WARNING = 'WARNING', // 黄色预警（如：用药超标）
  CRITICAL = 'CRITICAL', // 红色熔断（如：癫痫持续状态、自杀倾向）
}

export enum RecallReason {
  EPILEPSY_STATUS = 'EPILEPSY_STATUS', // 癫痫持续状态超5分钟
  EPDS_SUICIDE = 'EPDS_SUICIDE',       // 孕产妇EPDS量表第10题触发自杀倾向
  IOT_ABNORMAL = 'IOT_ABNORMAL',       // 穿戴设备捕获极危心/脑电波
  MOH_RISK = 'MOH_RISK',               // 药物过度使用性头痛风险
}

export interface RecallPayload {
  level: DangerLevel;
  reason: RecallReason;
  message: string;
  patientId: string;
  timestamp: number;
}

interface RecallState {
  isTriggered: boolean;
  dangerLevel: DangerLevel | null;
  triggerReason: RecallReason | null;
  message: string | null;
  patientId: string | null;
  timestamp: number | null;
  
  // 历史追溯记录
  history: RecallPayload[];
  
  // Actions
  triggerRecall: (payload: RecallPayload) => void;
  dismissRecall: (authCode: string) => boolean; // 需要极高权限（如医生授权码或家属强确认）才能解除
}

export const useRecallStore = create<RecallState>()(
  persist(
    (set) => ({
      isTriggered: false,
      dangerLevel: null,
      triggerReason: null,
      message: null,
      patientId: null,
      timestamp: null,
      history: [],

      triggerRecall: (payload) => set((state) => ({
        isTriggered: true,
        dangerLevel: payload.level,
        triggerReason: payload.reason,
        message: payload.message,
        patientId: payload.patientId,
        timestamp: payload.timestamp,
        history: [...state.history, payload],
      })),

      dismissRecall: (authCode) => {
        // 模拟权限校验：只有特定授权码才能解除红色熔断
        if (authCode === 'EMERGENCY_OVERRIDE_120') {
          set({
            isTriggered: false,
            dangerLevel: null,
            triggerReason: null,
            message: null,
            patientId: null,
            timestamp: null,
          });
          return true;
        }
        return false;
      }
    }),
    {
      name: 'neuro-link-recall-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
