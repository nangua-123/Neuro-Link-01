// File: src/store/index.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserIdentity } from '../interfaces/user';
import { DiseaseTag } from '../configs/constants';

interface AppState {
  // 鉴权与身份双轨制状态
  isAuthenticated: boolean;
  userToken: string | null;
  identity: UserIdentity | null;
  familyId: string | null;
  
  // 核心合规状态
  hasSignedAgreement: boolean;
  
  // 业务状态
  selectedDiseaseTag: DiseaseTag;
  painkillerDays: number; // 本月已服止痛药天数 (MOH 防火墙)
  
  // Actions
  setAuth: (token: string, identity: UserIdentity, familyId?: string) => void;
  signAgreement: () => void;
  revokeAgreement: () => void;
  clearAuth: () => void;
  setDiseaseTag: (tag: DiseaseTag) => void;
  recordPainkiller: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userToken: null,
      identity: null,
      familyId: null,
      hasSignedAgreement: false,
      selectedDiseaseTag: DiseaseTag.NONE,
      painkillerDays: 14, // Mock：默认14天，逼近15天红线以便测试 MOH 拦截
      
      setAuth: (token, identity, familyId) => set({ 
        isAuthenticated: true, 
        userToken: token, 
        identity, 
        familyId: familyId || null 
      }),
      
      signAgreement: () => set({ hasSignedAgreement: true }),
      revokeAgreement: () => set({ hasSignedAgreement: false }),
      
      clearAuth: () => set({ 
        isAuthenticated: false, 
        userToken: null, 
        identity: null, 
        familyId: null, 
        hasSignedAgreement: false,
        selectedDiseaseTag: DiseaseTag.NONE,
        painkillerDays: 14
      }),
      
      setDiseaseTag: (tag) => set({ selectedDiseaseTag: tag }),
      
      recordPainkiller: () => set((state) => ({ painkillerDays: state.painkillerDays + 1 })),
    }),
    {
      name: 'neuro-link-app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
