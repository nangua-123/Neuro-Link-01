export interface ScoringResult {
  riskLevel: string;
  riskScore: number; // 0-100
  dimensions: {
    name: string;
    score: number; // 0-100
    status: 'normal' | 'warning' | 'danger';
  }[];
  highRiskSymptoms: string[];
}

export function calculateMockScore(payload: Record<string, any>): ScoringResult {
  // 简易的 Mock 算法，模拟复杂的 CDR 计分逻辑
  
  let memoryScore = 85;
  let orientationScore = 90;
  let socialScore = 75;
  let homeCareScore = 80;
  
  const symptoms: string[] = [];
  
  // 模拟基于 payload 字段的扣分逻辑
  const randomFactor = Math.random();
  
  if (randomFactor > 0.7) {
    memoryScore = 40;
    symptoms.push('近期记忆显著减退');
    symptoms.push('无法回忆几天前发生的事');
  } else if (randomFactor > 0.3) {
    memoryScore = 65;
    symptoms.push('偶发性遗忘');
  }
  
  // 假设 payload 中有这些字段（实际根据 Schema 决定）
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
    {
      name: '记忆力',
      score: memoryScore,
      status: (memoryScore > 80 ? 'normal' : memoryScore > 60 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger',
    },
    {
      name: '定向力',
      score: orientationScore,
      status: (orientationScore > 80 ? 'normal' : orientationScore > 60 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger',
    },
    {
      name: '社会活动',
      score: socialScore,
      status: (socialScore > 80 ? 'normal' : socialScore > 60 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger',
    },
    {
      name: '生活自理',
      score: homeCareScore,
      status: (homeCareScore > 80 ? 'normal' : homeCareScore > 60 ? 'warning' : 'danger') as 'normal' | 'warning' | 'danger',
    }
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
  };
}
