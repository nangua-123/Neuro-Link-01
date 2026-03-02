// File: src/configs/constants.ts

// 核心合规协议常量
export const AGREEMENT_TITLE = '三方电子联合数据授权协议';
export const AGREEMENT_CONTENT = '明确告知用户，其脱敏数据将用于合作药企的新药研发及真实世界研究（RWE）。用户必须勾选同意，否则无法进行下一步。这是未来 P 端数据能够合法以百万级客单价售卖给药企的唯一法律依据。';

// 疾病标签枚举（用于动态量表与业务分流）
export enum DiseaseTag {
  NONE = 'NONE',
  AD = 'AD',             // 认知障碍 (阿尔茨海默病)
  EPILEPSY = 'EPILEPSY', // 癫痫
  MIGRAINE = 'MIGRAINE', // 偏头痛
}
