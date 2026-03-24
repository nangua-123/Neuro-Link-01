export interface Equipment {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  certification: string;
  icon: string;
  gradient: string;
  targetDisease: 'AD' | '癫痫' | '偏头痛' | '通用';
  bundledPrivileges: {
    id: string;
    title: string;
    desc: string;
    icon: string;
  }[];
  tags: string[];
}

export const EQUIPMENTS_MOCK: Equipment[] = [
  {
    id: 'neuro_band_pro',
    name: 'Neuro-Band Pro 预警手环',
    subtitle: '24h 动态体征监测，精准捕捉异常放电与发作预警',
    price: 1299,
    certification: '国械注准 20232070012',
    icon: 'Watch',
    gradient: 'from-blue-50 to-indigo-50/80',
    targetDisease: '癫痫',
    bundledPrivileges: [
      {
        id: 'seizure_alert',
        title: '发作预警与 120 联动',
        desc: '毫秒级异常识别，自动呼叫紧急联系人',
        icon: 'BellRing'
      },
      {
        id: 'visit_summary',
        title: '华西标准复诊一页纸',
        desc: '就诊免沟通，医生一秒看懂病情趋势',
        icon: 'FileText'
      },
      {
        id: 'family_care',
        title: '家属异地共管',
        desc: '子女随时随地查看长辈脑电与睡眠状态',
        icon: 'Users'
      }
    ],
    tags: ['医疗级高精度', '支持医保支付']
  },
  {
    id: 'neuro_tracker_ad',
    name: 'Neuro-Tracker 认知守护环',
    subtitle: '防走失电子围栏与跌倒报警，全天候守护长辈安全',
    price: 1599,
    certification: '国械注准 20242070088',
    icon: 'Watch',
    gradient: 'from-emerald-50 to-teal-50/80',
    targetDisease: 'AD',
    bundledPrivileges: [
      {
        id: 'anti_wandering',
        title: '防走失与跌倒报警',
        desc: '精准定位，意外跌倒秒级通知家属',
        icon: 'MapPin'
      },
      {
        id: 'sleep_rhythm',
        title: '睡眠节律与认知分析',
        desc: '监测夜间游荡，辅助评估认知衰退',
        icon: 'BrainCircuit'
      },
      {
        id: 'family_care',
        title: '家属异地共管',
        desc: '子女随时随地查看长辈位置与状态',
        icon: 'Users'
      }
    ],
    tags: ['北斗高精定位', '适老化设计']
  },
  {
    id: 'neuro_sense_migraine',
    name: 'Neuro-Sense 舒缓头带',
    subtitle: '脑电波舒缓与压力监测，精准记录偏头痛诱因',
    price: 899,
    certification: '国械注准 20222070158',
    icon: 'Activity',
    gradient: 'from-violet-50 to-purple-50/80',
    targetDisease: '偏头痛',
    bundledPrivileges: [
      {
        id: 'trigger_analysis',
        title: '诱因热力图分析',
        desc: 'AI 深度挖掘发作诱因，精准规避风险',
        icon: 'Activity'
      },
      {
        id: 'eeg_soothing',
        title: '脑电波靶向舒缓',
        desc: '定制化声光干预，缓解急性头痛',
        icon: 'Wind'
      },
      {
        id: 'visit_summary',
        title: '华西标准复诊一页纸',
        desc: '就诊免沟通，医生一秒看懂病情趋势',
        icon: 'FileText'
      }
    ],
    tags: ['无感佩戴', '物理舒缓']
  }
];
