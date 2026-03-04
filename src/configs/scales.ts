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

export const scale_cognitive_crf_history: ScaleSchema = {
  id: 'crf_history_001',
  name: '受试者初筛选原始记录表 - 认知相关及既往史',
  description: '用于收集受试者的认知相关病史及既往病史信息。',
  questions: [
    {
      id: 'cog_q6',
      type: QuestionType.RADIO_WITH_INPUT,
      title: 'Q6:大便是否正常？',
      required: true,
      options: [
        { label: '否', value: 1 },
        { label: '是', value: 2, requiresInput: true, inputPlaceholder: '具体表现及时间' }
      ]
    },
    {
      id: 'hist_q2',
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      title: '2、是否伴有运动障碍',
      required: true,
      options: [
        { label: '否', value: 1 },
        {
          label: '是',
          value: 2,
          subQuestions: [
            {
              id: 'hist_q2_sub1',
              type: QuestionType.CHECKBOX_WITH_INPUT,
              title: '具体表现',
              options: [
                { label: '肢体不自主抖动', value: '1' },
                { label: '肢体无力', value: '2' },
                { label: '其它', value: '3', requiresInput: true, inputPlaceholder: '请填写其它表现' }
              ]
            },
            {
              id: 'hist_q2_sub2',
              type: QuestionType.RADIO,
              title: '出现在记忆力下降',
              options: [
                { label: '之后', value: 1 },
                { label: '之前', value: 2 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'memory_decline',
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      title: '1. 是否有记忆力减退？',
      required: true,
      options: [
        { label: '否', value: 0 },
        { 
          label: '是', 
          value: 1,
          subQuestions: [
            {
              id: 'memory_decline_duration',
              type: QuestionType.INPUT_GROUP,
              title: '记忆减退时长',
              fields: [
                { id: 'years', label: '年', type: 'number', placeholder: '如: 1' },
                { id: 'months', label: '月', type: 'number', placeholder: '如: 6' }
              ]
            },
            {
              id: 'memory_decline_course',
              type: QuestionType.RADIO,
              title: '病程特点',
              options: [
                { label: '逐渐加重', value: 'gradual' },
                { label: '阶梯式加重', value: 'stepwise' },
                { label: '波动性', value: 'fluctuating' },
                { label: '稳定', value: 'stable' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'hypertension',
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      title: '2. 高血压病史',
      required: true,
      options: [
        { label: '无', value: 0 },
        {
          label: '有',
          value: 1,
          subQuestions: [
            {
              id: 'hypertension_duration',
              type: QuestionType.INPUT_GROUP,
              title: '确诊时长',
              fields: [
                { id: 'years', label: '年', type: 'number' }
              ]
            },
            {
              id: 'hypertension_medication',
              type: QuestionType.RADIO_WITH_INPUT,
              title: '是否服药控制',
              options: [
                { label: '未服药', value: 0 },
                { label: '规律服药', value: 1, requiresInput: true, inputPlaceholder: '请填写药物名称' },
                { label: '不规律服药', value: 2, requiresInput: true, inputPlaceholder: '请填写药物名称' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'diabetes',
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      title: '3. 糖尿病病史',
      required: true,
      options: [
        { label: '无', value: 0 },
        {
          label: '有',
          value: 1,
          subQuestions: [
            {
              id: 'diabetes_duration',
              type: QuestionType.INPUT_GROUP,
              title: '确诊时长',
              fields: [
                { id: 'years', label: '年', type: 'number' }
              ]
            },
            {
              id: 'diabetes_medication',
              type: QuestionType.RADIO_WITH_INPUT,
              title: '治疗方式',
              options: [
                { label: '未治疗', value: 0 },
                { label: '口服药物', value: 1, requiresInput: true, inputPlaceholder: '请填写药物名称' },
                { label: '胰岛素注射', value: 2, requiresInput: true, inputPlaceholder: '请填写胰岛素类型' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'stroke_history',
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      title: '4. 脑卒中史',
      required: true,
      options: [
        { label: '无', value: 0 },
        {
          label: '有',
          value: 1,
          subQuestions: [
            {
              id: 'stroke_type',
              type: QuestionType.CHECKBOX_WITH_INPUT,
              title: '卒中类型（可多选）',
              options: [
                { label: '缺血性卒中（脑梗死）', value: 'ischemic' },
                { label: '出血性卒中（脑出血）', value: 'hemorrhagic' },
                { label: '蛛网膜下腔出血', value: 'sah' },
                { label: '其他', value: 'other', requiresInput: true, inputPlaceholder: '请具体说明' }
              ]
            },
            {
              id: 'stroke_times',
              type: QuestionType.INPUT_GROUP,
              title: '发作次数',
              fields: [
                { id: 'count', label: '次', type: 'number' }
              ]
            },
            {
              id: 'stroke_relation_to_memory',
              type: QuestionType.RADIO,
              title: '记忆力下降与卒中的关系',
              options: [
                { label: '记忆力下降在卒中之前', value: 'before' },
                { label: '记忆力下降在卒中之后（3个月内）', value: 'after_3m' },
                { label: '记忆力下降在卒中之后（3个月后）', value: 'after_later' },
                { label: '不确定', value: 'unknown' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'family_history',
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      title: '5. 痴呆家族史',
      required: true,
      options: [
        { label: '无', value: 0 },
        {
          label: '有',
          value: 1,
          subQuestions: [
            {
              id: 'family_members',
              type: QuestionType.CHECKBOX_WITH_INPUT,
              title: '患病亲属（可多选）',
              options: [
                { label: '父亲', value: 'father' },
                { label: '母亲', value: 'mother' },
                { label: '兄弟姐妹', value: 'siblings' },
                { label: '其他', value: 'other', requiresInput: true, inputPlaceholder: '请具体说明' }
              ]
            }
          ]
        }
      ]
    }
  ]
};
