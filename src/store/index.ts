// File: src/store/index.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserIdentity, PatientProfile } from '../interfaces/user';
import { DiseaseTag } from '../configs/constants';

interface ChartDataPoint {
  date: string;
  value: number;
  color?: string;
}

interface Vitals {
  hrv: number;
  deepSleepRatio: number;
  eegStability: number;
  lastSyncTime: string;
}

interface AppState {
  // 鉴权与身份双轨制状态
  isAuthenticated: boolean;
  userToken: string | null;
  identity: UserIdentity | null;
  familyId: string | null;
  boundPatients: PatientProfile[];
  currentPatientId: string | null;
  
  // 核心合规状态
  hasSignedAgreement: boolean;
  
  // 业务状态
  selectedDiseaseTag: DiseaseTag;
  painkillerDays: number; // 本月已服止痛药天数 (MOH 防火墙)
  isDeviceBound: boolean; // IoT 设备绑定状态
  
  // 统一体征基座
  vitals: Vitals;
  
  // 癫痫管家状态
  medicationStatus: { morning: boolean; noon: boolean; evening: boolean };
  epilepsyAdherenceData: ChartDataPoint[];
  
  // 认知管家状态
  sleepRating: number | null;
  cognitiveTrainingData: ChartDataPoint[];
  
  // 偏头痛管家状态
  migraineFrequencyData: ChartDataPoint[];
  
  // Actions
  setAuth: (token: string, identity: UserIdentity, familyId?: string) => void;
  bindPatient: (patient: PatientProfile) => void;
  switchPatient: (patientId: string) => void;
  signAgreement: () => void;
  revokeAgreement: () => void;
  clearAuth: () => void;
  setDiseaseTag: (tag: DiseaseTag) => void;
  recordPainkiller: () => void;
  recordMigraineAttack: (severity: string, trigger: string) => void;
  bindDevice: () => void;
  unbindDevice: () => void;
  checkInMedication: (time: 'morning' | 'noon' | 'evening') => void;
  rateSleep: (rating: number) => void;
}

const initialVitals: Vitals = {
  hrv: 42,
  deepSleepRatio: 28,
  eegStability: 95,
  lastSyncTime: '刚刚'
};

const initialCognitiveData: ChartDataPoint[] = [
  { date: '10.21', value: 15 },
  { date: '10.22', value: 20 },
  { date: '10.23', value: 0, color: '#f59e0b' },
  { date: '10.24', value: 15 },
  { date: '10.25', value: 30 },
  { date: '10.26', value: 15 },
  { date: '今日', value: 0, color: '#94a3b8' },
];

const initialEpilepsyData: ChartDataPoint[] = [
  { date: '10.21', value: 100 },
  { date: '10.22', value: 100 },
  { date: '10.23', value: 66, color: '#f59e0b' },
  { date: '10.24', value: 100 },
  { date: '10.25', value: 100 },
  { date: '10.26', value: 100 },
  { date: '今日', value: 0, color: '#94a3b8' },
];

const initialMigraineData: ChartDataPoint[] = [
  { date: '10.21', value: 0 },
  { date: '10.22', value: 2, color: '#f43f5e' },
  { date: '10.23', value: 0 },
  { date: '10.24', value: 1, color: '#f43f5e' },
  { date: '10.25', value: 0 },
  { date: '10.26', value: 0 },
  { date: '今日', value: 0, color: '#94a3b8' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userToken: null,
      identity: null,
      familyId: null,
      boundPatients: [],
      currentPatientId: null,
      hasSignedAgreement: false,
      selectedDiseaseTag: DiseaseTag.NONE,
      painkillerDays: 14, // Mock：默认14天，逼近15天红线以便测试 MOH 拦截
      isDeviceBound: false,
      vitals: initialVitals,
      medicationStatus: { morning: false, noon: false, evening: false },
      epilepsyAdherenceData: initialEpilepsyData,
      sleepRating: null,
      cognitiveTrainingData: initialCognitiveData,
      migraineFrequencyData: initialMigraineData,
      
      setAuth: (token, identity, familyId) => set({ 
        isAuthenticated: true, 
        userToken: token, 
        identity, 
        familyId: familyId || null 
      }),

      bindPatient: (patient) => set((state) => {
        const newPatients = [...state.boundPatients, patient];
        return {
          boundPatients: newPatients,
          currentPatientId: state.currentPatientId || patient.id, // 如果没有当前患者，则默认选中新绑定的
          selectedDiseaseTag: patient.diseaseTag as DiseaseTag || state.selectedDiseaseTag
        };
      }),

      switchPatient: (patientId) => set((state) => {
        const patient = state.boundPatients.find(p => p.id === patientId);
        if (patient) {
          return {
            currentPatientId: patientId,
            selectedDiseaseTag: patient.diseaseTag as DiseaseTag || DiseaseTag.NONE
          };
        }
        return state;
      }),
      
      signAgreement: () => set({ hasSignedAgreement: true }),
      revokeAgreement: () => set({ hasSignedAgreement: false }),
      
      clearAuth: () => set({ 
        isAuthenticated: false, 
        userToken: null, 
        identity: null, 
        familyId: null, 
        boundPatients: [],
        currentPatientId: null,
        hasSignedAgreement: false,
        selectedDiseaseTag: DiseaseTag.NONE,
        painkillerDays: 14,
        isDeviceBound: false,
        vitals: initialVitals,
        medicationStatus: { morning: false, noon: false, evening: false },
        epilepsyAdherenceData: initialEpilepsyData,
        sleepRating: null,
        cognitiveTrainingData: initialCognitiveData,
        migraineFrequencyData: initialMigraineData
      }),
      
      setDiseaseTag: (tag) => set({ selectedDiseaseTag: tag }),
      
      recordPainkiller: () => set((state) => ({ painkillerDays: state.painkillerDays + 1 })),
      
      recordMigraineAttack: (severity, trigger) => set((state) => {
        const newData = [...state.migraineFrequencyData];
        const todayIndex = newData.findIndex(d => d.date === '今日');
        if (todayIndex !== -1) {
          newData[todayIndex] = {
            ...newData[todayIndex],
            value: newData[todayIndex].value + 1,
            color: '#f43f5e'
          };
        }
        return { migraineFrequencyData: newData };
      }),
      
      bindDevice: () => set({ isDeviceBound: true }),
      unbindDevice: () => set({ isDeviceBound: false }),
      
      checkInMedication: (time) => set((state) => {
        const newStatus = { ...state.medicationStatus, [time]: true };
        const takenCount = Object.values(newStatus).filter(Boolean).length;
        const totalCount = Object.keys(newStatus).length;
        const adherence = Math.round((takenCount / totalCount) * 100);
        
        const newData = [...state.epilepsyAdherenceData];
        const todayIndex = newData.findIndex(d => d.date === '今日');
        if (todayIndex !== -1) {
          newData[todayIndex] = {
            ...newData[todayIndex],
            value: adherence,
            color: adherence === 100 ? undefined : '#f59e0b'
          };
        }
        
        return {
          medicationStatus: newStatus,
          epilepsyAdherenceData: newData
        };
      }),
      
      rateSleep: (rating) => set((state) => {
        // rating: 1(安稳), 2(一般), 3(易醒)
        // 动态调整深度睡眠比例
        let newDeepSleep = state.vitals.deepSleepRatio;
        if (rating === 1) newDeepSleep = Math.min(newDeepSleep + 5, 40);
        else if (rating === 3) newDeepSleep = Math.max(newDeepSleep - 8, 10);
        
        return { 
          sleepRating: rating,
          vitals: { ...state.vitals, deepSleepRatio: newDeepSleep }
        };
      }),
    }),
    {
      name: 'neuro-link-app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
