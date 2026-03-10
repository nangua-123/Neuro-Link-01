export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
  color?: string;
}

export interface IoTVitals {
  hrv: number; // 心率变异性 (ms)
  deepSleepRatio: number; // 深睡比例 (%)
  eegStability: number; // 脑电波形健康度/专注度 (0-100)
  lastSyncTime: string; // 最后同步时间
}
