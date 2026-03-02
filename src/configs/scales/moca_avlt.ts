// File: src/configs/scales/moca_avlt.ts
import { FormSchema, QuestionType } from '../../interfaces/scaleEngine';

const TARGET_WORDS = ['大衣', '长裤', '头巾', '手套', '司机', '木工', '士兵', '律师', '海棠', '百合', '腊梅', '玉兰'];

export const MOCA_AVLT_SCHEMA: FormSchema = {
  id: 'moca_avlt_h_001',
  version: '1.0.0',
  name: '认知障碍深度测评 (MoCA + 华西 AVLT-H)',
  entryQuestionId: 'q_clock',
  questions: {
    'q_clock': {
      id: 'q_clock',
      type: QuestionType.CANVAS_CLOCK,
      title: '画钟测试 (Visuoconstructional Skills)',
      description: '请在下方空白处画一个钟表，填上所有的数字，并指示时间为 11点10分。',
      target: 'PATIENT',
      required: true,
      canvasConfig: {
        recordStrokes: true,
        strokeDataField: 'strokes_x_y_timestamp'
      },
      defaultNextId: 'q_avlt_immediate_1'
    },
    'q_avlt_immediate_1': {
      id: 'q_avlt_immediate_1',
      type: QuestionType.AUDIO_REPEAT,
      title: '听觉词语学习测试 (AVLT) - 第一次即刻回忆',
      description: '请点击录音，并尽可能多地说出您刚才听到的词语（顺序不限）。',
      target: 'PATIENT',
      required: true,
      audioConfig: {
        targetWords: TARGET_WORDS,
        isDelayedRecall: false,
        repeatCount: 1
      },
      defaultNextId: 'q_avlt_immediate_2'
    },
    'q_avlt_immediate_2': {
      id: 'q_avlt_immediate_2',
      type: QuestionType.AUDIO_REPEAT,
      title: '听觉词语学习测试 (AVLT) - 第二次即刻回忆',
      description: '请再次回忆并说出刚才让您记住的那些词语。',
      target: 'PATIENT',
      required: true,
      audioConfig: {
        targetWords: TARGET_WORDS,
        isDelayedRecall: false,
        repeatCount: 2
      },
      defaultNextId: 'q_avlt_immediate_3'
    },
    'q_avlt_immediate_3': {
      id: 'q_avlt_immediate_3',
      type: QuestionType.AUDIO_REPEAT,
      title: '听觉词语学习测试 (AVLT) - 第三次即刻回忆',
      description: '请最后一次回忆并说出刚才让您记住的那些词语。',
      target: 'PATIENT',
      required: true,
      audioConfig: {
        targetWords: TARGET_WORDS,
        isDelayedRecall: false,
        repeatCount: 3
      },
      defaultNextId: 'q_avlt_delayed_5m'
    },
    'q_avlt_delayed_5m': {
      id: 'q_avlt_delayed_5m',
      type: QuestionType.AUDIO_REPEAT,
      title: '听觉词语学习测试 (AVLT) - 5分钟延迟回忆',
      description: '5分钟过去了，请回忆并说出刚才让您记住的那些词语。',
      target: 'PATIENT',
      required: true,
      audioConfig: {
        targetWords: TARGET_WORDS,
        isDelayedRecall: true,
        delayMinutes: 5
      },
      defaultNextId: 'q_avlt_delayed_20m'
    },
    'q_avlt_delayed_20m': {
      id: 'q_avlt_delayed_20m',
      type: QuestionType.AUDIO_REPEAT,
      title: '听觉词语学习测试 (AVLT) - 20分钟延迟回忆',
      description: '20分钟过去了，请再次回忆并说出刚才让您记住的那些词语。',
      target: 'PATIENT',
      required: true,
      audioConfig: {
        targetWords: TARGET_WORDS,
        isDelayedRecall: true,
        delayMinutes: 20
      }
    }
  }
};
