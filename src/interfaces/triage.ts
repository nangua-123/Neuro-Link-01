// File: src/interfaces/triage.ts

export enum RiskLevel {
  GREEN = 'GREEN',   // 低风险
  YELLOW = 'YELLOW', // 中风险
  RED = 'RED',       // 高风险
}

export enum MedicalEquipment {
  MRI_1_5T = 'MRI_1_5T', // 1.5T 磁共振
  MRI_3_0T = 'MRI_3_0T', // 3.0T 磁共振
  EEG = 'EEG',           // 脑电图机
  CT = 'CT',             // 计算机断层扫描
}

export interface ClinicEntity {
  id: string;
  name: string;
  distanceKm: number;
  address: string;
  equipmentList: MedicalEquipment[];
  tags: string[]; // 医院标签，如 "三甲", "社区卫生服务中心"
}

export interface TriageResult {
  riskLevel: RiskLevel;
  diseaseTag: string;
  suggestionTitle: string;
  suggestionDetail: string;
  
  // 仅中高风险 (YELLOW/RED) 存在以下绿通凭证字段
  neuroPassCode?: string; 
  recommendedClinic?: ClinicEntity;
  requiredEquipment?: MedicalEquipment;
}
