// File: src/configs/scales/cdr.ts
import { FormSchema, QuestionType } from '../../interfaces/scaleEngine';

export const CDR_SCHEMA: FormSchema = {
  id: 'cdr_family_001',
  version: '1.0.0',
  name: '临床痴呆评定量表 (CDR) - 知情者问卷',
  description: '请家属/照护者根据患者近期的实际表现如实作答。',
  entryQuestionId: 'q_memory',
  questions: {
    'q_memory': {
      id: 'q_memory',
      type: QuestionType.RADIO,
      title: '【记忆力】他/她最近的记忆力怎么样？',
      target: 'FAMILY',
      required: true,
      options: [
        { label: '完全正常，没有记忆力减退，能记住最近发生的事', value: 0, score: 0 },
        { label: '偶尔会忘事，比如忘记东西放在哪，但能自己想起来（良性健忘）', value: 0.5, score: 0.5 },
        { label: '经常忘记最近发生的事，反复问同一个问题，已经影响了日常生活', value: 1, score: 1 },
        { label: '只能记住很久以前的事，新发生的事完全记不住', value: 2, score: 2 },
        { label: '严重的记忆丧失，只剩下一些零碎的片段，连亲人的名字都叫不出来', value: 3, score: 3 },
      ],
      defaultNextId: 'q_orientation'
    },
    'q_orientation': {
      id: 'q_orientation',
      type: QuestionType.RADIO,
      title: '【定向力】他/她对时间、地点的认知清晰吗？',
      target: 'FAMILY',
      required: true,
      options: [
        { label: '完全清楚现在是哪年哪月，知道自己在哪里，完全正常', value: 0, score: 0 },
        { label: '偶尔搞错具体的日期或星期几，但时间定向只有轻微困难', value: 0.5, score: 0.5 },
        { label: '经常搞错时间，在陌生的地方容易迷路，中度困难', value: 1, score: 1 },
        { label: '对时间完全没有概念，在熟悉的地方（比如小区里）也会迷路', value: 2, score: 2 },
        { label: '只认识自己，对周围环境完全没有概念，不知道身在何处', value: 3, score: 3 },
      ],
      defaultNextId: 'q_judgment'
    },
    'q_judgment': {
      id: 'q_judgment',
      type: QuestionType.RADIO,
      title: '【判断力与解决问题能力】他/她处理日常问题或突发情况的能力如何？',
      target: 'FAMILY',
      required: true,
      options: [
        { label: '解决日常问题、处理财务都很好，和以前一样正常', value: 0, score: 0 },
        { label: '处理复杂问题（如算账、理财）有些吃力，有轻微的损害', value: 0.5, score: 0.5 },
        { label: '处理问题有中度困难，但还能保留一些基本的社会判断力', value: 1, score: 1 },
        { label: '严重损害，完全无法独立判断或解决问题', value: 2, score: 2 },
        { label: '完全不能做出判断，无法理解周围发生的事情', value: 3, score: 3 },
      ],
      defaultNextId: 'q_community'
    },
    'q_community': {
      id: 'q_community',
      type: QuestionType.RADIO,
      title: '【社会事务】他/她还能独立参加社交活动或工作吗？',
      target: 'FAMILY',
      required: true,
      options: [
        { label: '能独立工作、购物、参加社交活动，表现完全正常', value: 0, score: 0 },
        { label: '有些轻微困难，但勉强能应付一些简单的社交', value: 0.5, score: 0.5 },
        { label: '无法独立进行社交或购物，偶尔表现正常，出门需要别人陪同', value: 1, score: 1 },
        { label: '无法独立进行室外活动，出门必须有人带着', value: 2, score: 2 },
        { label: '完全无法进行室外活动，只能待在家里', value: 3, score: 3 },
      ],
      defaultNextId: 'q_home'
    },
    'q_home': {
      id: 'q_home',
      type: QuestionType.RADIO,
      title: '【家庭与爱好】他/她还能做家务或保持以前的兴趣爱好吗？',
      target: 'FAMILY',
      required: true,
      options: [
        { label: '家务和爱好都保持得很好，生活丰富正常', value: 0, score: 0 },
        { label: '家务做得不如以前好，爱好有所减少，轻微受损', value: 0.5, score: 0.5 },
        { label: '放弃了难度大的家务和复杂的爱好，只能做些简单的', value: 1, score: 1 },
        { label: '只能做很简单的家务，兴趣极其有限', value: 2, score: 2 },
        { label: '完全不能做家务，丧失了所有有意义的家庭活动', value: 3, score: 3 },
      ],
      defaultNextId: 'q_personal_care'
    },
    'q_personal_care': {
      id: 'q_personal_care',
      type: QuestionType.RADIO,
      title: '【个人料理】他/她能自己穿衣、洗漱、吃饭吗？',
      target: 'FAMILY',
      required: true,
      options: [
        { label: '完全有能力自我照料，不需要任何帮忙', value: 0, score: 0 },
        { label: '完全能自我照料，但偶尔需要别人督促一下', value: 0.5, score: 0.5 },
        { label: '穿衣、个人卫生等方面需要他人的帮助', value: 1, score: 1 },
        { label: '需要大量的帮助，经常出现大小便失禁的情况', value: 2, score: 2 },
        { label: '完全依赖他人照顾，自己什么都做不了', value: 3, score: 3 },
      ]
    }
  }
};

export const scale_cdr_informant_orientation_judgment = {
  scaleId: "cdr_informant_oj_v1",
  title: "临床痴呆评定量表(CDR) - 询问知情者 (定向与判断篇)",
  description: "请最了解患者日常生活的家属或照护者根据患者真实情况作答。",
  questions: [
    // --- 定向问题 ---
    {
      id: "cdr_o_1",
      type: "radio",
      text: "1. 他/她是否经常准确知道日期？",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    },
    {
      id: "cdr_o_2",
      type: "radio",
      text: "2. 他/她是否经常准确知道月份？",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    },
    {
      id: "cdr_o_3",
      type: "radio",
      text: "3. 他/她是否经常准确知道年份？",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    },
    {
      id: "cdr_o_4",
      type: "radio",
      text: "4. 他/她是否经常准确知道星期几？",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    },
    {
      id: "cdr_o_5",
      type: "radio",
      text: "5. 当事情先后发生时，他/她是否能判断清楚先后顺序？",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    },
    {
      id: "cdr_o_6",
      type: "radio",
      text: "6. 他/她能否在熟悉的街道找到路？",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    },
    {
      id: "cdr_o_7",
      type: "radio",
      text: "7. 他/她能否在自己家以外的地方知道如何从一个地方到另一个地方？",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    },
    {
      id: "cdr_o_8",
      type: "radio",
      text: "8. 他/她是否在熟悉的室内找不到地方？",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    },

    // --- 判断和解决问题的能力 ---
    {
      id: "cdr_j_1",
      type: "radio",
      text: "1. 现在必须评估他/她解决问题的总体能力，请你考虑以下答案哪一种最适合：",
      options: [
        { label: "和以前一样好", value: 1 },
        { label: "不如以前好", value: 2 },
        { label: "差不多", value: 3 },
        { label: "差", value: 4 },
        { label: "根本没有能力", value: 5 }
      ],
      required: true
    },
    {
      id: "cdr_j_2",
      type: "radio",
      text: "2. 评估他/她处理少量钱财的能力（如换零钱、找零钱）",
      options: [
        { label: "没有丧失", value: 1 },
        { label: "有些丧失", value: 2 },
        { label: "严重丧失", value: 3 }
      ],
      required: true
    },
    {
      id: "cdr_j_3",
      type: "radio",
      text: "3. 评估他/她处理复杂财务或买卖的能力（如收支平衡、付费）",
      options: [
        { label: "没有丧失", value: 1 },
        { label: "有些丧失", value: 2 },
        { label: "严重丧失", value: 3 }
      ],
      required: true
    },
    {
      id: "cdr_j_4",
      type: "radio_with_input",
      text: "4. 他/她能否处理家庭中发生的紧急情况（如水管渗漏、着火）",
      options: [
        { label: "和以前一样好", value: 1 },
        { label: "因为思维障碍，不如以前好", value: 2 },
        { label: "由于其他原因不如以前好", value: 3, requiresInput: true, inputPlaceholder: "请填写具体原因" }
      ],
      required: true
    },
    {
      id: "cdr_j_5",
      type: "radio",
      text: "5. 他/她能明白所处的场合或其他人对某一问题的解释吗？",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    },
    {
      id: "cdr_j_6",
      type: "radio",
      text: "6. 在社交场合或与他人交往时，他/她的行为得体吗？（和他/她平常的风格一样吗？）",
      options: [ { label: "经常", value: 1 }, { label: "有时", value: 2 }, { label: "很少", value: 3 }, { label: "不详", value: 4 } ],
      required: true
    }
  ]
};
