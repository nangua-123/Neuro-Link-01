// File: src/configs/scales.ts
import { ScaleSchema, QuestionType } from '../interfaces/scale';

// 认知障碍 (AD) MoCA 测试极简版配置
export const MOCA_SCALE_CONFIG: ScaleSchema = {
  id: 'moca_lite_001',
  name: 'MoCA 认知评估 (极简版)',
  description: '华西标准深度医学测评与 AI 风险解析',
  questions: [
    {
      id: 'q_clock_1',
      type: QuestionType.CANVAS_CLOCK,
      title: '画钟测试 (Visuoconstructional Skills)',
      description: '请在下方空白处画一个钟表，填上所有的数字，并指示时间为 11点10分。',
      required: true,
    },
    {
      id: 'q_audio_1',
      type: QuestionType.AUDIO_REPEAT,
      title: '语音复述测试 (Language)',
      description: '请点击录音，并准确复述以下句子：“我只知道今天张三是来帮过忙的”。',
      required: true,
    },
    {
      id: 'q_radio_1',
      type: QuestionType.RADIO,
      title: '定向力测试 (Orientation)',
      description: '请问今天是星期几？',
      options: [
        { label: '星期一', value: 1 },
        { label: '星期二', value: 2 },
        { label: '星期三', value: 3 },
        { label: '星期四', value: 4 },
        { label: '星期五', value: 5 },
        { label: '星期六', value: 6 },
        { label: '星期日', value: 7 },
      ],
      required: true,
    }
  ]
};
