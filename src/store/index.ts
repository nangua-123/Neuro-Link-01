import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserIdentity, PatientProfile } from '../interfaces/user';
import { DiseaseTag } from '../configs/constants';
import { Task } from '../interfaces/task';
import { CareDiaryRecord } from '../interfaces/careDiary';
import { BPSD_SYMPTOMS_DICT } from '../configs/careDiary';

export interface MedicationPlan {
  id: string;
  name: string;
  dose: string;
  time: 'morning' | 'noon' | 'evening' | 'bedtime';
  reminderEnabled?: boolean;
  reminderTime?: string;
  startDate?: string;
  duration?: string;
  usage?: string;
  planType?: 'daily' | 'interval';
  frequency?: number;
  times?: string[];
  doseAmount?: string;
  doseUnit?: string;
  instructions?: string;
  notes?: string;
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

export interface SeizureRecord {
  id: string;
  timestamp: number;
  date: string;
  type: 'generalized' | 'focal';
  impaired: boolean;
  duration: string;
  triggers: string[];
}

export interface MigraineRecord {
  id: string;
  timestamp: number;
  date: string;
  severity: string;
  vas: number;
  symptoms: string[];
  meds: string[];
}

export interface CdrRecord {
  id: string;
  timestamp: number;
  date: string;
  bpsd: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

interface AppState {
  isAuthenticated: boolean;
  userToken: string | null;
  identity: UserIdentity | null;
  familyId: string | null;
  boundPatients: PatientProfile[];
  currentPatientId: string | null;
  hasSignedAgreement: boolean;
  userStage: 'NEW' | 'ACTIVE' | 'STABLE';
  selectedDiseaseTag: DiseaseTag;
  
  // 1+1+N Architecture State
  isFirstVisit: boolean;
  hasCompletedAssessment: boolean;
  boundDevices: string[];
  isPremium: boolean;
  
  painkillerDates: string[]; // 本月已服止痛药的日期列表 (MOH 防火墙)
  missedMedicationDates: string[]; // 漏服药物的日期列表
  connectedDevices: ConnectedDevice[];
  isDeviceBound: boolean;
  vitals: Vitals;
  
  // Task Engine State
  tasks: Task[];
  completeTask: (taskId: string) => void;
  generateDailyTasks: () => void;
  
  // DTx Hub State
  dtxProgress: { completed: number; total: number };
  dtxRadarData: { subject: string; A: number; fullMark: number }[];
  completedDTxTasks: string[];
  dtxStreak: number;
  dtxTotalDuration: number;
  dtxOverallScore: number;
  dtxWeeklyData: { day: string; minutes: number }[];
  completeDTxTask: (taskId: string) => void;
  
  // 用药管家状态
  medicationPlans: MedicationPlan[];
  todayTakenIds: string[];
  lastMedicationDate: string;
  medicationHistory: Record<string, string[]>;
  triggeredReminders: Record<string, string[]>;
  epilepsyAdherenceData: ChartDataPoint[];
  seizureFrequencyData: ChartDataPoint[];
  
  // 日记记录状态
  seizureRecords: SeizureRecord[];
  migraineRecords: MigraineRecord[];
  cdrRecords: CdrRecord[];
  careDiaryRecords: Record<string, CareDiaryRecord>;
  
  sleepRating: number | null;
  cognitiveTrainingData: ChartDataPoint[];
  todayCdrRecorded: boolean;
  migraineFrequencyData: ChartDataPoint[];
  
  setAuth: (token: string, identity: UserIdentity, familyId?: string) => void;
  bindPatient: (patient: PatientProfile) => void;
  switchPatient: (patientId: string) => void;
  signAgreement: () => void;
  revokeAgreement: () => void;
  setUserStage: (stage: 'NEW' | 'ACTIVE' | 'STABLE') => void;
  clearAuth: () => void;
  setDiseaseTag: (tag: DiseaseTag) => void;
  recordPainkiller: (date?: string) => void;
  recordMissedMedication: (date?: string) => void;
  getMonthlyPainkillerCount: () => number;
  getAIInsights: () => string[];
  recordMigraineAttack: (data: Omit<MigraineRecord, 'id' | 'timestamp' | 'date'>) => void;
  recordSeizureAttack: (data: Omit<SeizureRecord, 'id' | 'timestamp' | 'date'>) => void;
  recordCdrDiary: (data: Omit<CdrRecord, 'id' | 'timestamp' | 'date'>) => void;
  addCareDiaryRecord: (data: Omit<CareDiaryRecord, 'id' | 'timestamp' | 'date'>) => void;
  connectDevice: (device: ConnectedDevice) => void;
  disconnectDevice: (id: string) => void;
  bindDevice: () => void;
  unbindDevice: () => void;
  updateVitals: (vitals: Partial<Vitals>) => void;
  checkAndUpgradeUserStage: () => void;
  
  // 1+1+N Architecture Actions
  completeFirstVisit: () => void;
  completeAssessment: () => void;
  bindIoTDevice: (deviceId: string) => void;
  unbindIoTDevice: (deviceId: string) => void;
  unlockPremium: () => void;
  
  // 用药管家 Actions
  addMedicationPlan: (plan: Omit<MedicationPlan, 'id'>) => void;
  removeMedicationPlan: (id: string) => void;
  toggleMedication: (id: string) => void;
  markReminderTriggered: (planId: string, date: string) => void;
  
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

const initialCognitiveData: ChartDataPoint[] = [];
const initialEpilepsyData: ChartDataPoint[] = [];
const initialSeizureData: ChartDataPoint[] = [];
const initialMigraineData: ChartDataPoint[] = [];
const defaultMedications: MedicationPlan[] = [];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userToken: null,
      identity: null,
      familyId: null,
      boundPatients: [],
      currentPatientId: null,
      hasSignedAgreement: false,
      userStage: 'NEW',
      selectedDiseaseTag: DiseaseTag.NONE,
      
      isFirstVisit: true,
      hasCompletedAssessment: false,
      boundDevices: [],
      isPremium: false,
      
      painkillerDates: [],
      missedMedicationDates: [],
      connectedDevices: [],
      isDeviceBound: false,
      vitals: initialVitals,
      
      // DTx Hub State
      dtxProgress: { completed: 0, total: 15 },
      dtxStreak: 0,
      dtxTotalDuration: 0,
      dtxOverallScore: 0,
      dtxWeeklyData: [
        { day: '周一', minutes: 0 },
        { day: '周二', minutes: 0 },
        { day: '周三', minutes: 0 },
        { day: '周四', minutes: 0 },
        { day: '周五', minutes: 0 },
        { day: '周六', minutes: 0 },
        { day: '周日', minutes: 0 },
      ],
      dtxRadarData: [
        { subject: '记忆力', A: 0, fullMark: 100 },
        { subject: '注意力', A: 0, fullMark: 100 },
        { subject: '执行力', A: 0, fullMark: 100 },
        { subject: '定向力', A: 0, fullMark: 100 },
        { subject: '反应力', A: 0, fullMark: 100 },
      ],
      completedDTxTasks: [],
      completeDTxTask: (taskId) => set((state) => {
        if (state.completedDTxTasks.includes(taskId)) return state;
        
        // Increase progress by 5 minutes for each completed task
        const newCompleted = Math.min(state.dtxProgress.completed + 5, state.dtxProgress.total);
        
        // Update weekly data for today (mocking today as '周三' for demo purposes, or just updating the last one)
        const newWeeklyData = [...state.dtxWeeklyData];
        const todayIndex = 2; // Assuming today is Wednesday for the demo
        newWeeklyData[todayIndex] = {
          ...newWeeklyData[todayIndex],
          minutes: newWeeklyData[todayIndex].minutes + 5
        };

        // Update radar data slightly to show progress
        const newRadarData = state.dtxRadarData.map(d => ({
          ...d,
          A: Math.min(100, d.A + Math.floor(Math.random() * 5) + 1)
        }));

        return {
          dtxProgress: { ...state.dtxProgress, completed: newCompleted },
          completedDTxTasks: [...state.completedDTxTasks, taskId],
          dtxTotalDuration: state.dtxTotalDuration + 5,
          dtxOverallScore: Math.min(100, state.dtxOverallScore + 1),
          dtxStreak: state.dtxStreak === 0 ? 1 : state.dtxStreak, // Start streak if 0
          dtxWeeklyData: newWeeklyData,
          dtxRadarData: newRadarData
        };
      }),

      tasks: [],
      completeTask: (taskId) => set((state) => {
        const newState = {
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' as const } : t)
        };
        if (state.userStage === 'NEW') {
          return { ...newState, userStage: 'ACTIVE' };
        }
        return newState;
      }),
      generateDailyTasks: () => set((state) => {
        const todayStr = new Date().toDateString();
        
        const existingTasksMap = new Map(state.tasks.map(t => [t.id, t]));
        const newTasks: Task[] = [];
        
        // 动态生成用药任务
        if (state.medicationPlans.length > 0) {
          state.medicationPlans.forEach(plan => {
            const taskId = `med_${plan.id}`;
            const existing = existingTasksMap.get(taskId);
            const isCompleted = existing?.status === 'COMPLETED' || state.todayTakenIds.includes(plan.id);
            
            newTasks.push({
              id: taskId,
              title: `${plan.time === 'morning' ? '早间' : plan.time === 'noon' ? '午间' : plan.time === 'evening' ? '晚间' : '睡前'}服药`,
              description: `${plan.name} ${plan.dose}`,
              type: 'MEDICATION',
              time: plan.time.toUpperCase() as any,
              status: isCompleted ? 'COMPLETED' : 'PENDING',
              actionLabel: '打卡',
              iconName: 'Pill'
            });
          });
        }
        
        if (state.selectedDiseaseTag === DiseaseTag.AD) {
          newTasks.push({ id: 't1', title: '每日脑力唤醒', description: '15分钟画钟与词汇回忆训练', type: 'TRAINING', time: 'MORNING', status: existingTasksMap.get('t1')?.status || 'PENDING', actionLabel: '去训练', iconName: 'Brain' });
          newTasks.push({ id: 't2', title: '记录异常行为', description: '随手记录长辈精神行为症状', type: 'DIARY', time: 'ANYTIME', status: existingTasksMap.get('t2')?.status || 'PENDING', actionLabel: '去记录', iconName: 'HeartHandshake' });
          if (state.medicationPlans.length === 0) {
            newTasks.push({ id: 't3', title: '日常用药打卡', description: '记录改善认知药物服用情况', type: 'MEDICATION', time: 'ANYTIME', status: existingTasksMap.get('t3')?.status || 'PENDING', actionLabel: '打卡', iconName: 'Pill' });
          }
        } else if (state.selectedDiseaseTag === DiseaseTag.EPILEPSY) {
          if (state.medicationPlans.length === 0) {
            newTasks.push({ id: 't1', title: '早间服药', description: '左乙拉西坦片 500mg', type: 'MEDICATION', time: 'MORNING', status: existingTasksMap.get('t1')?.status || 'PENDING', actionLabel: '打卡', iconName: 'Pill' });
            newTasks.push({ id: 't2', title: '午间服药', description: '丙戊酸钠缓释片 500mg', type: 'MEDICATION', time: 'NOON', status: existingTasksMap.get('t2')?.status || 'PENDING', actionLabel: '打卡', iconName: 'Pill' });
            newTasks.push({ id: 't3', title: '晚间服药', description: '左乙拉西坦片 500mg', type: 'MEDICATION', time: 'EVENING', status: existingTasksMap.get('t3')?.status || 'PENDING', actionLabel: '打卡', iconName: 'Pill' });
          }
          newTasks.push({ id: 't4', title: '记录发作日记', description: '如有发作请及时记录', type: 'DIARY', time: 'ANYTIME', status: existingTasksMap.get('t4')?.status || 'PENDING', actionLabel: '去记录', iconName: 'Activity' });
          newTasks.push({ id: 't5', title: '规律作息打卡', description: '保持充足睡眠，规避诱发因素', type: 'TRAINING', time: 'EVENING', status: existingTasksMap.get('t5')?.status || 'PENDING', actionLabel: '打卡', iconName: 'HeartHandshake' });
        } else if (state.selectedDiseaseTag === DiseaseTag.MIGRAINE) {
          newTasks.push({ id: 't1', title: '记录头痛闪记', description: '0-10分疼痛评估与症状记录', type: 'DIARY', time: 'ANYTIME', status: existingTasksMap.get('t1')?.status || 'PENDING', actionLabel: '去记录', iconName: 'Activity' });
          if (state.medicationPlans.length === 0) {
            newTasks.push({ id: 't2', title: '记录止痛药', description: '防范药物过度使用头痛(MOH)', type: 'MEDICATION', time: 'ANYTIME', status: existingTasksMap.get('t2')?.status || 'PENDING', actionLabel: '打卡', iconName: 'Pill' });
          }
          newTasks.push({ id: 't3', title: '暗室舒缓音频', description: '发作期白噪音与呼吸节律引导', type: 'TRAINING', time: 'ANYTIME', status: existingTasksMap.get('t3')?.status || 'PENDING', actionLabel: '去放松', iconName: 'Brain' });
        }
        
        return { tasks: newTasks };
      }),
      
      medicationPlans: defaultMedications,
      todayTakenIds: [],
      lastMedicationDate: new Date().toDateString(),
      medicationHistory: {},
      triggeredReminders: {},
      epilepsyAdherenceData: initialEpilepsyData,
      seizureFrequencyData: initialSeizureData,
      
      seizureRecords: [],
      migraineRecords: [],
      cdrRecords: [],
      careDiaryRecords: {},
      
      sleepRating: null,
      cognitiveTrainingData: initialCognitiveData,
      todayCdrRecorded: false,
      migraineFrequencyData: initialMigraineData,
      
      markReminderTriggered: (planId, date) => set((state) => {
        const currentTriggered = state.triggeredReminders[date] || [];
        if (currentTriggered.includes(planId)) return state;
        return {
          triggeredReminders: {
            ...state.triggeredReminders,
            [date]: [...currentTriggered, planId]
          }
        };
      }),

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
      setUserStage: (stage) => set({ userStage: stage }),
      
      clearAuth: () => set({ 
        isAuthenticated: false, 
        userToken: null, 
        identity: null, 
        familyId: null, 
        boundPatients: [],
        currentPatientId: null,
        hasSignedAgreement: false,
        userStage: 'NEW',
        selectedDiseaseTag: DiseaseTag.NONE,
        isFirstVisit: true,
        hasCompletedAssessment: false,
        boundDevices: [],
        isPremium: false,
        painkillerDates: [],
        missedMedicationDates: [],
        connectedDevices: [],
        isDeviceBound: false,
        vitals: initialVitals,
        tasks: [],
        medicationPlans: defaultMedications,
        todayTakenIds: [],
        lastMedicationDate: new Date().toDateString(),
        medicationHistory: {},
        triggeredReminders: {},
        epilepsyAdherenceData: initialEpilepsyData,
        seizureFrequencyData: initialSeizureData,
        seizureRecords: [],
        migraineRecords: [],
        cdrRecords: [],
        careDiaryRecords: {},
        sleepRating: null,
        cognitiveTrainingData: initialCognitiveData,
        todayCdrRecorded: false,
        migraineFrequencyData: initialMigraineData,
        dtxProgress: { completed: 0, total: 15 },
        dtxStreak: 0,
        dtxTotalDuration: 0,
        dtxOverallScore: 0,
        dtxWeeklyData: [
          { day: '周一', minutes: 0 },
          { day: '周二', minutes: 0 },
          { day: '周三', minutes: 0 },
          { day: '周四', minutes: 0 },
          { day: '周五', minutes: 0 },
          { day: '周六', minutes: 0 },
          { day: '周日', minutes: 0 },
        ],
        dtxRadarData: [
          { subject: '记忆力', A: 0, fullMark: 100 },
          { subject: '注意力', A: 0, fullMark: 100 },
          { subject: '执行力', A: 0, fullMark: 100 },
          { subject: '定向力', A: 0, fullMark: 100 },
          { subject: '反应力', A: 0, fullMark: 100 },
        ],
        completedDTxTasks: []
      }),
      
      setDiseaseTag: (tag) => set({ selectedDiseaseTag: tag }),
      
      recordPainkiller: (date?: string) => set((state) => {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const isTaken = state.painkillerDates.includes(targetDate);
        
        // Auto-complete medication task for migraine
        const newTasks = state.tasks.map(t => 
          (t.type === 'MEDICATION' && t.title.includes('止痛药')) ? { ...t, status: 'COMPLETED' as const } : t
        );
        
        const newState = {
          painkillerDates: isTaken 
            ? state.painkillerDates.filter(d => d !== targetDate)
            : [...state.painkillerDates, targetDate],
          tasks: newTasks
        };
        if (state.userStage === 'NEW') {
          return { ...newState, userStage: 'ACTIVE' };
        }
        return newState;
      }),
      
      recordMissedMedication: (date?: string) => set((state) => {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const today = new Date().toDateString();
        
        let newTakenIds = state.todayTakenIds;
        let newHistory = { ...state.medicationHistory };
        
        // 同步清理当天的服药记录，确保数据同源
        if (targetDate === new Date().toISOString().split('T')[0]) {
           newTakenIds = [];
           newHistory[today] = [];
        }
        
        if (!state.missedMedicationDates.includes(targetDate)) {
          return { 
            missedMedicationDates: [...state.missedMedicationDates, targetDate],
            todayTakenIds: newTakenIds,
            medicationHistory: newHistory
          };
        }
        return state;
      }),

      getMonthlyPainkillerCount: () => {
        const state = get();
        const currentMonth = new Date().toISOString().slice(0, 7);
        return state.painkillerDates.filter(d => d.startsWith(currentMonth)).length;
      },

      getAIInsights: () => {
        const state = get();
        const insights: string[] = [];
        
        // Seizure causality
        if (state.seizureRecords.length > 0 && state.missedMedicationDates.length > 0) {
          const hasCausality = state.seizureRecords.some(record => {
             const recordDate = new Date(record.timestamp);
             const prevDate = new Date(record.timestamp - 86400000);
             const d1 = recordDate.toISOString().split('T')[0];
             const d2 = prevDate.toISOString().split('T')[0];
             return state.missedMedicationDates.includes(d1) || state.missedMedicationDates.includes(d2);
          });
          if (hasCausality) {
            insights.push("💡 发现关联：您近期的 2 次发作均发生在漏服药物后");
          }
        }
        
        // Migraine MOH
        const painkillerCount = get().getMonthlyPainkillerCount();
        if (painkillerCount >= 9) {
          insights.push(`本月急性止痛药已服用 ${painkillerCount} 天，存在药物过度使用头痛(MOH)风险！`);
        } else if (painkillerCount >= 6) {
          insights.push(`本月急性止痛药已服用 ${painkillerCount} 天，请注意控制频率，避免MOH。`);
        }
        
        return insights;
      },
      
      recordMigraineAttack: (data) => set((state) => {
        const newRecord: MigraineRecord = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          date: new Date().toISOString().split('T')[0]
        };
        
        const newData = [...state.migraineFrequencyData];
        const todayIndex = newData.findIndex(d => d.date === '今日');
        if (todayIndex !== -1) {
          newData[todayIndex] = {
            ...newData[todayIndex],
            value: newData[todayIndex].value + 1,
            color: '#f43f5e'
          };
        }
        
        // Auto-complete diary task
        const newTasks = state.tasks.map(t => 
          (t.type === 'DIARY' && t.title.includes('头痛')) ? { ...t, status: 'COMPLETED' as const } : t
        );
        
        const newState = { 
          migraineFrequencyData: newData,
          migraineRecords: [...state.migraineRecords, newRecord],
          tasks: newTasks
        };
        if (state.userStage === 'NEW') {
          return { ...newState, userStage: 'ACTIVE' };
        }
        return newState;
      }),

      recordSeizureAttack: (data) => set((state) => {
        const newRecord: SeizureRecord = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          date: new Date().toISOString().split('T')[0]
        };
        
        const newData = [...state.seizureFrequencyData];
        const todayIndex = newData.findIndex(d => d.date === '今日');
        if (todayIndex !== -1) {
          newData[todayIndex] = {
            ...newData[todayIndex],
            value: newData[todayIndex].value + 1,
            color: '#6366f1'
          };
        }
        
        // Auto-complete diary task
        const newTasks = state.tasks.map(t => 
          (t.type === 'DIARY' && t.title.includes('发作')) ? { ...t, status: 'COMPLETED' as const } : t
        );
        
        const newState = { 
          seizureFrequencyData: newData,
          seizureRecords: [...state.seizureRecords, newRecord],
          tasks: newTasks
        };
        if (state.userStage === 'NEW') {
          return { ...newState, userStage: 'ACTIVE' };
        }
        return newState;
      }),

      recordCdrDiary: (data) => set((state) => {
        const newRecord: CdrRecord = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          date: new Date().toISOString().split('T')[0]
        };
        
        // Auto-complete diary task
        const newTasks = state.tasks.map(t => 
          (t.type === 'DIARY' && t.title.includes('行为')) ? { ...t, status: 'COMPLETED' as const } : t
        );
        
        const newState = { 
          todayCdrRecorded: true,
          cdrRecords: [...state.cdrRecords, newRecord],
          tasks: newTasks
        };
        
        if (state.userStage === 'NEW') {
          return { ...newState, userStage: 'ACTIVE' };
        }
        return newState;
      }),

      addCareDiaryRecord: (data) => set((state) => {
        const dateStr = new Date().toISOString().split('T')[0];
        const newRecord: CareDiaryRecord = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          date: dateStr
        };

        // 检查是否触发全局熔断 (Event Bus 逻辑，这里通过抛出事件或直接在组件层监听)
        const hasHighRiskBpsd = data.bpsdSymptoms.some(symptomId => {
          const dictItem = BPSD_SYMPTOMS_DICT.find(d => d.id === symptomId);
          return dictItem?.isHighRisk;
        });

        if (data.hasSevereIncident || hasHighRiskBpsd) {
          // 触发全局事件，让 App.tsx 或其他顶层组件捕获并弹出红色预警
          window.dispatchEvent(new CustomEvent('GLOBAL_RECALL_ALERT', { 
            detail: { 
              reason: data.hasSevereIncident ? '发生严重意外事件' : '出现高危精神行为症状',
              recordId: newRecord.id
            } 
          }));
        }

        // Auto-complete diary task
        const newTasks = state.tasks.map(t => 
          (t.type === 'DIARY' && t.title.includes('行为')) ? { ...t, status: 'COMPLETED' as const } : t
        );

        const newState = {
          careDiaryRecords: {
            ...state.careDiaryRecords,
            [dateStr]: newRecord
          },
          todayCdrRecorded: true,
          tasks: newTasks
        };

        if (state.userStage === 'NEW') {
          return { ...newState, userStage: 'ACTIVE' };
        }
        return newState;
      }),
      
      connectDevice: (device) => set((state) => ({ 
        connectedDevices: [...state.connectedDevices.filter(d => d.id !== device.id), device] 
      })),
      disconnectDevice: (id) => set((state) => ({ 
        connectedDevices: state.connectedDevices.filter(d => d.id !== id) 
      })),
      bindDevice: () => set((state) => {
        const newState = { isDeviceBound: true };
        if (state.userStage === 'NEW') {
          return { ...newState, userStage: 'ACTIVE' };
        }
        return newState;
      }),
      unbindDevice: () => set({ isDeviceBound: false }),
      updateVitals: (newVitals) => set((state) => {
        const newState = { vitals: { ...state.vitals, ...newVitals } };
        if (state.userStage === 'NEW') {
          return { ...newState, userStage: 'ACTIVE' };
        }
        return newState;
      }),
      
      checkAndUpgradeUserStage: () => set((state) => {
        if (state.userStage === 'NEW') {
          return { userStage: 'ACTIVE' };
        }
        return state;
      }),
      
      completeFirstVisit: () => set({ isFirstVisit: false }),
      completeAssessment: () => set((state) => {
        const newState = { hasCompletedAssessment: true };
        if (state.userStage === 'NEW') {
          return { ...newState, userStage: 'ACTIVE' };
        }
        return newState;
      }),
      bindIoTDevice: (deviceId) => set((state) => ({
        boundDevices: state.boundDevices.includes(deviceId) 
          ? state.boundDevices 
          : [...state.boundDevices, deviceId]
      })),
      unbindIoTDevice: (deviceId) => set((state) => ({
        boundDevices: state.boundDevices.filter(id => id !== deviceId)
      })),
      unlockPremium: () => set({ isPremium: true }),
      
      addMedicationPlan: (plan) => {
        set((state) => {
          const newPlan = { ...plan, id: Math.random().toString(36).substring(2, 9) };
          return {
            medicationPlans: [...state.medicationPlans, newPlan]
          };
        });
        get().generateDailyTasks();
      },

      removeMedicationPlan: (id) => {
        set((state) => {
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

          const today = new Date().toDateString();
          const newHistory = { ...state.medicationHistory };
          if (newHistory[today]) {
            newHistory[today] = newHistory[today].filter(takenId => takenId !== id);
          }

          return {
            medicationPlans: newPlans,
            todayTakenIds: newTakenIds,
            epilepsyAdherenceData: newData,
            medicationHistory: newHistory
          };
        });
        get().generateDailyTasks();
      },

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
          
        const newHistory = { ...state.medicationHistory };
        newHistory[today] = newTakenIds;
        
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
        
        // Auto-complete medication task if all taken or just mark one
        let newTasks = [...state.tasks];
        const taskIndex = newTasks.findIndex(t => t.id === `med_${id}`);
        if (taskIndex !== -1) {
          newTasks[taskIndex] = { ...newTasks[taskIndex], status: isTaken ? 'PENDING' : 'COMPLETED' };
        } else if (!isTaken) {
           // Fallback for generic medication tasks
           const pendingMedTaskIndex = newTasks.findIndex(t => t.type === 'MEDICATION' && t.status === 'PENDING');
           if (pendingMedTaskIndex !== -1) {
             newTasks[pendingMedTaskIndex] = { ...newTasks[pendingMedTaskIndex], status: 'COMPLETED' };
           }
        }
        
        return {
          todayTakenIds: newTakenIds,
          lastMedicationDate: today,
          medicationHistory: newHistory,
          epilepsyAdherenceData: newData,
          tasks: newTasks
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
