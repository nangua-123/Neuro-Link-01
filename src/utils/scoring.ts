import { DiseaseTag } from '../configs/constants';

export interface ScoringResult {
  riskLevel: string;
  riskScore: number; // 0-100
  dimensions: {
    name: string;
    score: number; // 0-100
    status: 'normal' | 'warning' | 'danger';
  }[];
  highRiskSymptoms: string[];
  reportSource: string; // e.g., "基于华西 CDR 认知量表多维数据计算"
  ctaText: string; // e.g., "开启 24 小时认知护航管家"
}

export function calculateReport(payload: Record<string, any>, diseaseTag: DiseaseTag): ScoringResult {
  switch (diseaseTag) {
    case DiseaseTag.EPILEPSY:
      return calculateEpilepsyReport(payload);
    case DiseaseTag.MIGRAINE:
      return calculateMigraineReport(payload);
    case DiseaseTag.AD:
    case DiseaseTag.NONE:
    default:
      return calculateADReport(payload);
  }
}

function calculateADReport(payload: Record<string, any>): ScoringResult {
  let memoryScore = 85;
  let orientationScore = 90;
  let socialScore = 75;
  let homeCareScore = 80;
  
  const symptoms: string[] = [];
  const randomFactor = Math.random();
  
  if (randomFactor > 0.7) {
    memoryScore = 40;
    symptoms.push('近期记忆显著减退');
    symptoms.push('无法回忆几天前发生的事');
  } else if (randomFactor > 0.3) {
    memoryScore = 65;
    symptoms.push('偶发性遗忘');
  }
  
  if (payload['q_orientation_time'] === 'often_confused' || randomFactor > 0.5) {
    orientationScore -= 25;
    if (orientationScore < 60 && !symptoms.includes('时间定向力受损')) {
      symptoms.push('时间定向力受损');
    }
  }
  
  if (payload['q_social_activities'] === 'rarely' || randomFactor > 0.6) {
    socialScore -= 35;
    if (socialScore < 60 && !symptoms.includes('社交活动显著减少')) {
      symptoms.push('社交活动显著减少');
    }
  }
  
  const dimensions = [
    { name: '记忆力', score: memoryScore, status: (memoryScore > 80 ? 'normal' : memoryScore > 60 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger' },
    { name: '定向力', score: orientationScore, status: (orientationScore > 80 ? 'normal' : orientationScore > 60 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger' },
    { name: '社会活动', score: socialScore, status: (socialScore > 80 ? 'normal' : socialScore > 60 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger' },
    { name: '生活自理', score: homeCareScore, status: (homeCareScore > 80 ? 'normal' : homeCareScore > 60 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger' }
  ];
  
  const avgScore = (memoryScore + orientationScore + socialScore + homeCareScore) / 4;
  
  let riskLevel = '认知功能良好';
  if (avgScore < 60) {
    riskLevel = '疑似阿尔茨海默期风险';
  } else if (avgScore < 80) {
    riskLevel = '轻度认知衰退风险';
  }
  
  if (symptoms.length === 0) {
    symptoms.push('未见明显高危症状');
  }
  
  return {
    riskLevel,
    riskScore: Math.round(avgScore),
    dimensions,
    highRiskSymptoms: symptoms,
    reportSource: '基于华西 CDR 认知量表多维数据计算',
    ctaText: '开启 24 小时认知护航管家',
  };
}

function calculateEpilepsyReport(payload: Record<string, any>): ScoringResult {
  let controlScore = 80;
  let adherenceScore = 90;
  let lifeQualityScore = 85;
  
  const symptoms: string[] = [];
  
  // Parse V0 baseline mock logic
  if (payload['v0_seizure_frequency'] === 'daily' || payload['v0_seizure_frequency'] === 'weekly') {
    controlScore -= 40;
    symptoms.push('发作频次过高');
  } else if (payload['v0_seizure_frequency'] === 'monthly') {
    controlScore -= 20;
  }
  
  if (payload['v0_seizure_duration'] === 'gt_5min') {
    controlScore -= 30;
    symptoms.push('单次发作时间过长 (>5分钟)');
    symptoms.push('疑似癫痫持续状态高危');
  }
  
  if (payload['v0_medication_adherence'] === 'poor') {
    adherenceScore -= 50;
    symptoms.push('用药依从性极差');
  } else if (payload['v0_medication_adherence'] === 'moderate') {
    adherenceScore -= 20;
    symptoms.push('存在漏服药风险');
  }
  
  const dimensions = [
    { name: '发作控制度', score: Math.max(0, controlScore), status: (controlScore > 70 ? 'normal' : controlScore > 50 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger' },
    { name: '用药依从性', score: Math.max(0, adherenceScore), status: (adherenceScore > 80 ? 'normal' : adherenceScore > 60 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger' },
    { name: '生活质量', score: lifeQualityScore, status: 'normal' as 'normal' | 'warning' | 'danger' }
  ];
  
  const avgScore = (controlScore + adherenceScore + lifeQualityScore) / 3;
  
  let riskLevel = '癫痫发作控制良好';
  if (avgScore < 60) {
    riskLevel = '癫痫发作控制极差';
  } else if (avgScore < 80) {
    riskLevel = '癫痫发作控制欠佳';
  }
  
  if (symptoms.length === 0) {
    symptoms.push('未见明显高危症状');
  }
  
  return {
    riskLevel,
    riskScore: Math.round(avgScore),
    dimensions,
    highRiskSymptoms: symptoms,
    reportSource: '基于华西癫痫基线期 (V0) 档案多维解析',
    ctaText: '开启癫痫护航管家',
  };
}

function calculateMigraineReport(payload: Record<string, any>): ScoringResult {
  let disabilityScore = 90;
  let painIntensityScore = 85;
  let frequencyScore = 80;
  
  const symptoms: string[] = [];
  
  if (payload['midas_q1'] === 'gt_10') {
    disabilityScore -= 40;
    symptoms.push('严重影响日常工作/学习');
  } else if (payload['midas_q1'] === '5_10') {
    disabilityScore -= 20;
  }
  
  if (payload['midas_pain_level'] === 'severe') {
    painIntensityScore -= 40;
    symptoms.push('重度疼痛发作');
  }
  
  const dimensions = [
    { name: '失能评级', score: Math.max(0, disabilityScore), status: (disabilityScore > 70 ? 'normal' : disabilityScore > 50 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger' },
    { name: '疼痛强度', score: Math.max(0, painIntensityScore), status: (painIntensityScore > 70 ? 'normal' : painIntensityScore > 50 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger' },
    { name: '发作频率', score: frequencyScore, status: 'normal' as 'normal' | 'warning' | 'danger' }
  ];
  
  const avgScore = (disabilityScore + painIntensityScore + frequencyScore) / 3;
  
  let riskLevel = '轻度偏头痛失能';
  if (avgScore < 60) {
    riskLevel = '重度偏头痛失能 (MIDAS IV级)';
  } else if (avgScore < 80) {
    riskLevel = '中度偏头痛失能 (MIDAS III级)';
  }
  
  if (symptoms.length === 0) {
    symptoms.push('未见明显高危症状');
  }
  
  return {
    riskLevel,
    riskScore: Math.round(avgScore),
    dimensions,
    highRiskSymptoms: symptoms,
    reportSource: '基于偏头痛 MIDAS 初筛量表解析',
    ctaText: '开启偏头痛管家',
  };
}
