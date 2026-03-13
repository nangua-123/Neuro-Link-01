import React from 'react';
import { MetricCard } from './MetricCard';
import { NeuroMetricType, MetricData } from '../../../interfaces/device';

// 模拟图表数据
const generateWaveData = () => Array.from({ length: 10 }, (_, i) => ({ value: 50 + Math.random() * 30 + Math.sin(i) * 10 }));
const generateBarData = () => Array.from({ length: 7 }, () => ({ value: 30 + Math.random() * 70 }));

const mockMetrics: MetricData[] = [
  {
    id: '1',
    type: NeuroMetricType.SLEEP_EEG,
    title: '睡眠质量',
    value: 28,
    unit: '% 深睡',
    trend: '较昨日 +5%',
    trendDirection: 'up',
    colorTheme: 'indigo',
    chartData: generateBarData(),
  },
  {
    id: '2',
    type: NeuroMetricType.VITALS,
    title: '实时心率',
    value: 72,
    unit: 'bpm',
    trend: '静息处于正常范围',
    trendDirection: 'neutral',
    colorTheme: 'rose',
    chartData: generateWaveData(),
  },
  {
    id: '3',
    type: NeuroMetricType.HRV,
    title: 'HRV 压力',
    value: 42,
    unit: 'ms',
    trend: '较昨日 -2ms',
    trendDirection: 'down',
    colorTheme: 'emerald',
    chartData: generateWaveData(),
  },
  {
    id: '4',
    type: NeuroMetricType.EEG_ABNORMALITY,
    title: '异常脑电',
    value: 2,
    unit: '次',
    trend: '较昨日 -1次',
    trendDirection: 'down',
    colorTheme: 'amber',
    chartData: generateBarData(),
  }
];

export const DashboardGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {mockMetrics.map((metric) => (
        <MetricCard key={metric.id} data={metric} />
      ))}
    </div>
  );
};
