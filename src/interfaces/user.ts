// File: src/interfaces/user.ts

export enum UserIdentity {
  PATIENT = 'PATIENT', // 患者本人
  FAMILY = 'FAMILY',   // 家属/照护者
}

export interface PatientProfile {
  id: string;
  name: string;
  relation: string; // e.g., '父亲', '母亲', '爷爷'
  diseaseTag?: string; // 绑定的疾病标签
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  identity: UserIdentity;
  familyId?: string; // 若为家属，后台自动创建或绑定的家庭群组ID
  hasSignedAgreement: boolean; // 是否已签署《三方电子联合数据授权协议》
  boundPatients?: PatientProfile[]; // 家属绑定的长辈列表
  currentPatientId?: string; // 当前正在照护的长辈ID
}
