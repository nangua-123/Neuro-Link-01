export const BPSD_SYMPTOMS_DICT = [
  { id: 'delusion', label: '妄想/怀疑', isHighRisk: false },
  { id: 'hallucination', label: '幻觉', isHighRisk: true },
  { id: 'agitation', label: '激越/攻击', isHighRisk: true },
  { id: 'depression', label: '抑郁/流泪', isHighRisk: false },
  { id: 'anxiety', label: '焦虑/紧张', isHighRisk: false },
  { id: 'euphoria', label: '异常欣快', isHighRisk: false },
  { id: 'apathy', label: '情感淡漠', isHighRisk: false },
  { id: 'disinhibition', label: '脱抑制行为', isHighRisk: true },
  { id: 'irritability', label: '易激惹', isHighRisk: false },
  { id: 'aberrant_motor', label: '异常动作/游荡', isHighRisk: true },
  { id: 'sleep_disorder', label: '睡眠障碍/日落综合征', isHighRisk: false },
  { id: 'appetite_change', label: '饮食异常', isHighRisk: false }
];

export const BASIC_STATUS_DICT = {
  sleep: [
    { value: 'good', label: '安稳', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'normal', label: '一般', color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'poor', label: '极差/昼夜颠倒', color: 'text-rose-500', bg: 'bg-rose-50' }
  ],
  appetite: [
    { value: 'good', label: '正常', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'reduced', label: '食欲减退', color: 'text-amber-500', bg: 'bg-amber-50' },
    { value: 'increased', label: '暴食/异食', color: 'text-rose-500', bg: 'bg-rose-50' }
  ],
  mood: [
    { value: 'calm', label: '平静', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'low', label: '低落', color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'agitated', label: '烦躁', color: 'text-rose-500', bg: 'bg-rose-50' }
  ]
};

export const ADL_ITEMS = [
  { id: 'eating', label: '进食' },
  { id: 'dressing', label: '穿衣' },
  { id: 'grooming', label: '洗漱' },
  { id: 'toileting', label: '如厕' },
  { id: 'bathing', label: '洗澡' },
  { id: 'transferring', label: '床椅转移' }
];

export const ADL_LEVELS = [
  { value: 'independent', label: '完全独立' },
  { value: 'assistance', label: '需要部分协助' },
  { value: 'dependent', label: '完全依赖' }
];
