// 身份双轨制枚举
export enum UserIdentity {
  SELF = 'SELF',           // 本人
  CAREGIVER = 'CAREGIVER'  // 照护者/家属
}

// 设备连接状态
export enum DeviceStatus {
  UNBOUND = 'UNBOUND',     // 未绑定
  DISCONNECTED = 'DISCONNECTED', // 已绑定但断开
  CONNECTED = 'CONNECTED', // 已连接
  SYNCING = 'SYNCING'      // 数据同步中
}

// 脑健康核心监测指标类型
export enum NeuroMetricType {
  SLEEP_EEG = 'SLEEP_EEG', // 睡眠与脑电
  HRV = 'HRV',             // 心率变异性
  GAIT = 'GAIT',           // 步态与活动
  VITALS = 'VITALS'        // 基础体征(血压/血氧)
}

export interface MetricData {
  id: string;
  type: NeuroMetricType;
  title: string;
  value: string | number;
  unit: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  colorTheme: 'indigo' | 'rose' | 'emerald' | 'amber';
  chartData: any[];
}
