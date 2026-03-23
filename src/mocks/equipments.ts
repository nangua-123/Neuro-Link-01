export interface Equipment {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  certification: string;
  imageUrl: string;
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
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?auto=format&fit=crop&q=80&w=800&h=600',
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
        id: 'progression_analysis',
        title: '衰退延缓评估报告',
        desc: '综合脑力游戏通关率与睡眠质量，评估干预效果',
        icon: 'BrainCircuit'
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
    id: 'eeg_patch_24h',
    name: '24h 动态脑电贴',
    subtitle: '隐形穿戴，无感记录全天候脑电波形',
    price: 899,
    certification: '国械注准 20222070158',
    imageUrl: 'https://images.unsplash.com/photo-1550005973-e4c8d0d0f41a?auto=format&fit=crop&q=80&w=800&h=600',
    bundledPrivileges: [
      {
        id: 'trigger_analysis',
        title: '诱因热力图分析',
        desc: 'AI 深度挖掘发作诱因，精准规避风险',
        icon: 'Activity'
      },
      {
        id: 'visit_summary',
        title: '华西标准复诊一页纸',
        desc: '就诊免沟通，医生一秒看懂病情趋势',
        icon: 'FileText'
      }
    ],
    tags: ['无感佩戴', '防水防汗']
  },
  {
    id: 'sleep_monitor_max',
    name: '高精度睡眠监测仪 Max',
    subtitle: '非接触式雷达监测，深度解析睡眠分期与呼吸暂停',
    price: 1599,
    certification: '国械注准 20242070088',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5e4a8716b?auto=format&fit=crop&q=80&w=800&h=600',
    bundledPrivileges: [
      {
        id: 'sleep_apnea_alert',
        title: '睡眠呼吸暂停预警',
        desc: '实时监测血氧与呼吸，异常自动唤醒',
        icon: 'Wind'
      },
      {
        id: 'progression_analysis',
        title: '衰退延缓评估报告',
        desc: '综合脑力游戏通关率与睡眠质量，评估干预效果',
        icon: 'BrainCircuit'
      },
      {
        id: 'family_care',
        title: '家属异地共管',
        desc: '子女随时随地查看长辈脑电与睡眠状态',
        icon: 'Users'
      }
    ],
    tags: ['非接触式', '雷达级精度']
  }
];
