// File: src/interfaces/manager.ts

// ==========================================
// 1. 癫痫 (护航管家) - ILAE 分类树 Schema
// ==========================================
export enum SeizureOrigin {
  FOCAL = 'FOCAL',       // 局灶起源
  GENERALIZED = 'GENERALIZED', // 全面起源
  UNKNOWN = 'UNKNOWN',   // 未知起源
}

export enum AwarenessState {
  RETAINED = 'RETAINED', // 伴知觉保留
  IMPAIRED = 'IMPAIRED', // 伴知觉障碍
}

export enum SeizureDuration {
  UNDER_1_MIN = 'UNDER_1_MIN',
  UNDER_5_MIN = 'UNDER_5_MIN',
  OVER_5_MIN = 'OVER_5_MIN', // 触发 Recall 的红线
}

export interface EpilepsyRecordPayload {
  patientId: string;
  timestamp: number;
  duration: SeizureDuration;
  origin: SeizureOrigin;
  awareness: AwarenessState;
  hasVideoRecord: boolean; // 是否有关联的紧急录像
  videoUrl?: string;
}

// ==========================================
// 2. 偏头痛 (头痛日记) - 发作与环境 Schema
// ==========================================
export enum MigraineTrigger {
  COFFEE = 'COFFEE',     // 咖啡
  MILK_TEA = 'MILK_TEA', // 奶茶
  STRESS = 'STRESS',     // 压力
  LACK_OF_SLEEP = 'LACK_OF_SLEEP', // 缺觉
  MENSTRUATION = 'MENSTRUATION', // 生理期
}

export interface EnvironmentData {
  latitude: number;
  longitude: number;
  atmosphericPressure: number; // 气压 (hPa)
  altitude: number;            // 海拔 (m)
  temperature: number;         // 温度 (°C)
  humidity: number;            // 湿度 (%)
}

export interface MigraineDiaryPayload {
  patientId: string;
  timestamp: number;
  painLevel: number; // 1-10 疼痛等级
  triggers: MigraineTrigger[];
  medicationTaken: string[]; // 刚吃了什么药
  environment: EnvironmentData; // 静默抓取的环境数据
}

// ==========================================
// 3. 认知障碍 (记忆管家) - CDR 知情者问卷 Schema
// ==========================================
export enum CDRScore {
  NORMAL = 0,
  QUESTIONABLE = 0.5,
  MILD = 1,
  MODERATE = 2,
  SEVERE = 3,
}

export interface CDRQuestionnairePayload {
  patientId: string;
  familyId: string;
  timestamp: number;
  // 记忆 (M) 为主项的复杂规则树枚举
  memoryScore: CDRScore;
  orientationScore: CDRScore;
  judgmentScore: CDRScore;
  communityAffairsScore: CDRScore;
  homeHobbiesScore: CDRScore;
  personalCareScore: CDRScore;
  // 后台引擎根据上述 6 项（以 M 为主项）计算出的最终痴呆等级
  calculatedGlobalCDR?: CDRScore; 
}
