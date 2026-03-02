// File: src/configs/scales/ilae.ts
import { FormSchema, QuestionType } from '../../interfaces/scaleEngine';

export const ILAE_SCHEMA: FormSchema = {
  id: 'ilae_2017_patient',
  version: '1.0.0',
  name: '癫痫发作类型智能分类 (基于 ILAE 2017)',
  entryQuestionId: 'q_onset',
  questions: {
    'q_onset': {
      id: 'q_onset',
      type: QuestionType.RADIO,
      title: '发作最开始的时候，身体是哪一部分先出现异常的？',
      target: 'BOTH',
      required: true,
      options: [
        { label: '只有身体的一侧（比如单侧手脚抽动、或者只有一边脸麻木）', value: 'FOCAL' },
        { label: '一开始就是全身同时发作（比如全身僵硬、双眼上翻）', value: 'GENERALIZED' },
        { label: '没看清/不知道怎么开始的（比如在睡梦中发作）', value: 'UNKNOWN' },
      ],
      branches: [
        { condition: { operator: 'EQUALS', value: 'FOCAL' }, nextQuestionId: 'q_focal_awareness' },
        { condition: { operator: 'EQUALS', value: 'GENERALIZED' }, nextQuestionId: 'q_generalized_type' },
        { condition: { operator: 'EQUALS', value: 'UNKNOWN' }, nextQuestionId: 'q_unknown_type' },
      ]
    },
    'q_focal_awareness': {
      id: 'q_focal_awareness',
      type: QuestionType.RADIO,
      title: '在发作过程中，患者能听懂别人说话并做出正确反应吗？',
      target: 'BOTH',
      required: true,
      options: [
        { label: '能，神志完全清醒，知道发生了什么', value: 'FOCAL_AWARE' },
        { label: '不能，发作时神志不清/听不懂别人说话', value: 'FOCAL_IMPAIRED' },
      ],
      defaultNextId: 'q_focal_motor_type'
    },
    'q_focal_motor_type': {
      id: 'q_focal_motor_type',
      type: QuestionType.RADIO,
      title: '发作时主要表现为什么动作？',
      target: 'BOTH',
      required: true,
      options: [
        { label: '有明显的动作（如抽搐、手脚僵硬、或者无意识地搓手等）', value: 'FOCAL_MOTOR' },
        { label: '没有明显动作（如突然愣神、感觉异常、心慌等）', value: 'FOCAL_NON_MOTOR' },
        { label: '一开始是局部抽动，后来变成了全身剧烈抽搐', value: 'FOCAL_TO_BILATERAL_TONIC_CLONIC' },
      ],
      branches: [
        { condition: { operator: 'EQUALS', value: 'FOCAL_MOTOR' }, nextQuestionId: 'q_focal_motor_detail' },
        { condition: { operator: 'EQUALS', value: 'FOCAL_NON_MOTOR' }, nextQuestionId: 'q_focal_non_motor_detail' },
      ]
    },
    'q_focal_motor_detail': {
      id: 'q_focal_motor_detail',
      type: QuestionType.RADIO,
      title: '具体的动作表现是哪一种？',
      target: 'BOTH',
      required: true,
      options: [
        { label: '无意识的重复动作（如吧唧嘴、摸索衣物）', value: 'AUTOMATISMS' },
        { label: '突然像断电一样全身发软跌倒', value: 'ATONIC' },
        { label: '有节律的抽动', value: 'CLONIC' },
        { label: '突然的点头或弯腰（痉挛）', value: 'EPILEPTIC_SPASMS' },
        { label: '剧烈的手舞足蹈或蹬车动作', value: 'HYPERKINETIC' },
        { label: '触电一样的瞬间抖动', value: 'MYOCLONIC' },
        { label: '肢体持续僵硬绷直', value: 'TONIC' },
      ]
    },
    'q_focal_non_motor_detail': {
      id: 'q_focal_non_motor_detail',
      type: QuestionType.RADIO,
      title: '具体的非动作表现是哪一种？',
      target: 'BOTH',
      required: true,
      options: [
        { label: '心慌、出汗、胃部有一股气往上冲', value: 'AUTONOMIC' },
        { label: '动作突然停止，像被定住了一样', value: 'BEHAVIOR_ARREST' },
        { label: '似曾相识感、或者突然听不懂话', value: 'COGNITIVE' },
        { label: '莫名的恐惧、高兴或发怒', value: 'EMOTIONAL' },
        { label: '闻到奇怪的味道、看到闪光或感觉身体发麻', value: 'SENSORY' },
      ]
    },
    'q_generalized_type': {
      id: 'q_generalized_type',
      type: QuestionType.RADIO,
      title: '全身发作时的主要表现是？',
      target: 'BOTH',
      required: true,
      options: [
        { label: '有明显的抽搐或僵硬动作', value: 'GENERALIZED_MOTOR' },
        { label: '只是短暂的愣神，没有大动作', value: 'GENERALIZED_NON_MOTOR_ABSENCE' },
      ],
      branches: [
        { condition: { operator: 'EQUALS', value: 'GENERALIZED_MOTOR' }, nextQuestionId: 'q_generalized_motor_detail' },
        { condition: { operator: 'EQUALS', value: 'GENERALIZED_NON_MOTOR_ABSENCE' }, nextQuestionId: 'q_generalized_absence_detail' },
      ]
    },
    'q_generalized_motor_detail': {
      id: 'q_generalized_motor_detail',
      type: QuestionType.RADIO,
      title: '具体的全身动作表现是哪一种？',
      target: 'BOTH',
      required: true,
      options: [
        { label: '全身僵硬并剧烈抽搐', value: 'TONIC_CLONIC' },
        { label: '全身有节律的抽动', value: 'CLONIC' },
        { label: '全身持续僵硬绷直', value: 'TONIC' },
        { label: '触电一样的瞬间抖动', value: 'MYOCLONIC' },
        { label: '突然像断电一样全身发软跌倒', value: 'ATONIC' },
        { label: '突然的点头或弯腰（痉挛）', value: 'EPILEPTIC_SPASMS' },
      ]
    },
    'q_generalized_absence_detail': {
      id: 'q_generalized_absence_detail',
      type: QuestionType.RADIO,
      title: '具体的愣神表现是哪一种？',
      target: 'BOTH',
      required: true,
      options: [
        { label: '突然愣神，几秒钟就恢复了', value: 'TYPICAL' },
        { label: '开始和结束都比较慢的愣神', value: 'ATYPICAL' },
        { label: '愣神伴随肌肉抽动', value: 'MYOCLONIC' },
        { label: '愣神伴随眼皮跳动', value: 'EYELID_MYOCLONIA' },
      ]
    },
    'q_unknown_type': {
      id: 'q_unknown_type',
      type: QuestionType.RADIO,
      title: '虽然不知道怎么开始的，但发作时主要看到了什么？',
      target: 'BOTH',
      required: true,
      options: [
        { label: '全身僵硬抽搐', value: 'UNKNOWN_MOTOR_TONIC_CLONIC' },
        { label: '突然像断电一样全身发软跌倒', value: 'UNKNOWN_MOTOR_ATONIC' },
        { label: '突然愣神，动作停止', value: 'UNKNOWN_NON_MOTOR_BEHAVIOR_ARREST' },
      ]
    }
  }
};
