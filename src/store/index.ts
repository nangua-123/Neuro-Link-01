import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserIdentity, PatientProfile } from '../interfaces/user';
import { DiseaseTag } from '../configs/constants';

export interface MedicationPlan {
  id: string;
  name: string;
  dose: string;
  time: 'morning' | 'noon' | 'evening' | 'bedtime';
}

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
  steps: number;
  heartRate: number;
  calories: number;
  screenTime: number;
  water: number;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'app' | 'hardware';
  status: string;
  syncTime: string;
  battery?: number;
}

interface AppState {
  isAuthenticated: boolean;
  userToken: string | null;
  identity: UserIdentity | null;
  familyId: string | null;
  boundPatients: PatientProfile[];
  currentPatientId: string | null;
  hasSignedAgreement: boolean;
  selectedDiseaseTag: DiseaseTag;
  painkillerDates: string[]; // 本月已服止痛药的日期列表 (MOH 防火墙)
  connectedDevices: ConnectedDevice[];
  vitals: Vitals;
  
  // 用药管家状态
  medicationPlans: MedicationPlan[];
  todayTakenIds: string[];
  lastMedicationDate: string;
  epilepsyAdherenceData: ChartDataPoint[];
  seizureFrequencyData: ChartDataPoint[];
  
  sleepRating: number | null;
  cognitiveTrainingData: ChartDataPoint[];
  todayCdrRecorded: boolean;
  migraineFrequencyData: ChartDataPoint[];
  
  setAuth: (token: string, identity: UserIdentity, familyId?: string) => void;
  bindPatient: (patient: PatientProfile) => void;
  switchPatient: (patientId: string) => void;
  signAgreement: () => void;
  revokeAgreement: () => void;
  clearAuth: () => void;
  setDiseaseTag: (tag: DiseaseTag) => void;
  recordPainkiller: (date?: string) => void;
  recordMigraineAttack: (severity: string, trigger: string) => void;
  recordSeizureAttack: () => void;
  recordCdrDiary: () => void;
  connectDevice: (device: ConnectedDevice) => void;
  disconnectDevice: (id: string) => void;
  updateVitals: (vitals: Partial<Vitals>) => void;
  
  // 用药管家 Actions
  addMedicationPlan: (plan: Omit<MedicationPlan, 'id'>) => void;
  removeMedicationPlan: (id: string) => void;
  toggleMedication: (id: string) => void;
  
  rateSleep: (rating: number) => void;
}

const initialVitals: Vitals = {
  hrv: 42,
  deepSleepRatio: 28,
  eegStability: 95,
  lastSyncTime: '刚刚',
  steps: 6240,
  heartRate: 72,
  calories: 320,
  screenTime: 4.2,
  water: 1.2
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

const initialSeizureData: ChartDataPoint[] = [
  { date: '10.21', value: 0 },
  { date: '10.22', value: 1, color: '#6366f1' },
  { date: '10.23', value: 0 },
  { date: '10.24', value: 0 },
  { date: '10.25', value: 0 },
  { date: '10.26', value: 0 },
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

const defaultMedications: MedicationPlan[] = [
  { id: 'm1', name: '左乙拉西坦片', dose: '500mg', time: 'morning' },
  { id: 'm2', name: '丙戊酸钠缓释片', dose: '500mg', time: 'noon' },
  { id: 'm3', name: '左乙拉西坦片', dose: '500mg', time: 'evening' },
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
      painkillerDates: ['2023-10-01', '2023-10-05', '2023-10-10', '2023-10-12', '2023-10-15', '2023-10-18', '2023-10-20', '2023-10-22', '2023-10-24', '2023-10-25', '2023-10-26', '2023-10-27', '2023-10-28', '2023-10-29'], // Mock: 14 days
      connectedDevices: [],
      vitals: initialVitals,
      
      medicationPlans: defaultMedications,
      todayTakenIds: [],
      lastMedicationDate: new Date().toDateString(),
      epilepsyAdherenceData: initialEpilepsyData,
      seizureFrequencyData: initialSeizureData,
      
      sleepRating: null,
      cognitiveTrainingData: initialCognitiveData,
      todayCdrRecorded: false,
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
          currentPatientId: state.currentPatientId || patient.id,
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
        painkillerDates: [],
        connectedDevices: [],
        vitals: initialVitals,
        medicationPlans: defaultMedications,
        todayTakenIds: [],
        lastMedicationDate: new Date().toDateString(),
        epilepsyAdherenceData: initialEpilepsyData,
        seizureFrequencyData: initialSeizureData,
        sleepRating: null,
        cognitiveTrainingData: initialCognitiveData,
        todayCdrRecorded: false,
        migraineFrequencyData: initialMigraineData
      }),
      
      setDiseaseTag: (tag) => set({ selectedDiseaseTag: tag }),
      
      recordPainkiller: (date?: string) => set((state) => {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const isTaken = state.painkillerDates.includes(targetDate);
        return {
          painkillerDates: isTaken 
            ? state.painkillerDates.filter(d => d !== targetDate)
            : [...state.painkillerDates, targetDate]
        };
      }),
      
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

      recordSeizureAttack: () => set((state) => {
        const newData = [...state.seizureFrequencyData];
        const todayIndex = newData.findIndex(d => d.date === '今日');
        if (todayIndex !== -1) {
          newData[todayIndex] = {
            ...newData[todayIndex],
            value: newData[todayIndex].value + 1,
            color: '#6366f1'
          };
        }
        return { seizureFrequencyData: newData };
      }),

      recordCdrDiary: () => set({ todayCdrRecorded: true }),
      
      connectDevice: (device) => set((state) => ({ 
        connectedDevices: [...state.connectedDevices.filter(d => d.id !== device.id), device] 
      })),
      disconnectDevice: (id) => set((state) => ({ 
        connectedDevices: state.connectedDevices.filter(d => d.id !== id) 
      })),
      updateVitals: (newVitals) => set((state) => ({
        vitals: { ...state.vitals, ...newVitals }
      })),
      
      addMedicationPlan: (plan) => set((state) => ({
        medicationPlans: [...state.medicationPlans, { ...plan, id: Math.random().toString(36).substring(2, 9) }]
      })),

      removeMedicationPlan: (id) => set((state) => {
        const newPlans = state.medicationPlans.filter(p => p.id !== id);
        const newTakenIds = state.todayTakenIds.filter(takenId => takenId !== id);
        
        const totalCount = newPlans.length;
        const adherence = totalCount === 0 ? 0 : Math.round((newTakenIds.length / totalCount) * 100);
        
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
          medicationPlans: newPlans,
          todayTakenIds: newTakenIds,
          epilepsyAdherenceData: newData
        };
      }),

      toggleMedication: (id) => set((state) => {
        const today = new Date().toDateString();
        let currentTakenIds = state.todayTakenIds;
        
        if (state.lastMedicationDate !== today) {
          currentTakenIds = [];
        }

        const isTaken = currentTakenIds.includes(id);
        const newTakenIds = isTaken 
          ? currentTakenIds.filter(tId => tId !== id)
          : [...currentTakenIds, id];
        
        const totalCount = state.medicationPlans.length;
        const adherence = totalCount === 0 ? 0 : Math.round((newTakenIds.length / totalCount) * 100);
        
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
          todayTakenIds: newTakenIds,
          lastMedicationDate: today,
          epilepsyAdherenceData: newData
        };
      }),
      
      rateSleep: (rating) => set((state) => {
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
