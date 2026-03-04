// File: src/configs/scales/cdr.ts
import { FormSchema, QuestionType as EngineQuestionType } from '../../interfaces/scaleEngine';

export const CDR_SCHEMA: FormSchema = {
  id: 'cdr_family_001',
  version: '1.0.0',
  name: '临床痴呆评定量表 (CDR) - 知情者问卷',
  description: '请家属/照护者根据患者近期的实际表现如实作答。',
  entryQuestionId: 'q_memory',
  questions: {
    'q_memory': {
      id: 'q_memory',
      type: EngineQuestionType.RADIO,
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
      type: EngineQuestionType.RADIO,
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
      type: EngineQuestionType.RADIO,
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
      type: EngineQuestionType.RADIO,
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
      type: EngineQuestionType.RADIO,
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
      type: EngineQuestionType.RADIO,
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

export const scale_cdr_informant_memory = {
  scaleId: "cdr_informant_memory_v1",
  title: "临床痴呆评定量表(CDR) - 询问知情者 (记忆篇)",
  description: "请最了解患者日常生活的家属或照护者根据患者真实情况作答。",
  questions: [
    {
      id: "cdr_m_1",
      type: "radio",
      text: "1. 他/她有记忆力减退吗？",
      options: [
        { label: "没有", value: 1 },
        { label: "有", value: 2 }
      ],
      required: true
    },
    {
      id: "cdr_m_2",
      type: "radio",
      text: "2. 如果有记忆力减退，是最近的事情记不清（如昨天吃什么），还是以前的事情记不清（如年轻时的经历）？",
      options: [
        { label: "主要是最近的事情记不清", value: 1 },
        { label: "主要是以前的事情记不清", value: 2 },
        { label: "都有", value: 3 },
        { label: "不适用（没有记忆力减退）", value: 4 }
      ],
      dependsOn: {
        questionId: "cdr_m_1",
        value: 2
      }
    },
    {
      id: "cdr_m_3",
      type: "radio",
      text: "3. 他/她能记住最近发生的事情吗？",
      options: [
        { label: "经常", value: 1 },
        { label: "有时", value: 2 },
        { label: "很少", value: 3 },
        { label: "不详", value: 4 }
      ],
      required: true
    },
    {
      id: "cdr_m_4",
      type: "radio",
      text: "4. 他/她能记住几天前谈话的内容吗？",
      options: [
        { label: "经常", value: 1 },
        { label: "有时", value: 2 },
        { label: "很少", value: 3 },
        { label: "不详", value: 4 }
      ],
      required: true
    },
    {
      id: "cdr_m_5",
      type: "radio",
      text: "5. 他/她能记住自己的生日、结婚纪念日等重要日期吗？",
      options: [
        { label: "经常", value: 1 },
        { label: "有时", value: 2 },
        { label: "很少", value: 3 },
        { label: "不详", value: 4 }
      ],
      required: true
    },
    {
      id: "cdr_m_6",
      type: "radio",
      text: "6. 他/她能记住自己把东西放在哪里了吗？",
      options: [
        { label: "经常", value: 1 },
        { label: "有时", value: 2 },
        { label: "很少", value: 3 },
        { label: "不详", value: 4 }
      ],
      required: true
    },
    {
      id: "cdr_m_7",
      type: "radio",
      text: "7. 他/她能记住自己刚刚做过的事情吗？（如刚吃过饭、刚吃过药）",
      options: [
        { label: "经常", value: 1 },
        { label: "有时", value: 2 },
        { label: "很少", value: 3 },
        { label: "不详", value: 4 }
      ],
      required: true
    },
    {
      id: "cdr_m_8",
      type: "radio",
      text: "8. 他/她能认出熟悉的人吗？",
      options: [
        { label: "经常", value: 1 },
        { label: "有时", value: 2 },
        { label: "很少", value: 3 },
        { label: "不详", value: 4 }
      ],
      required: true
    },
    {
      id: "cdr_m_9",
      type: "input_group",
      text: "9. 请提供他/她的出生年月：",
      fields: [
        { id: "year", label: "年", type: "number", placeholder: "如 1950" },
        { id: "month", label: "月", type: "number", placeholder: "如 10" }
      ],
      required: true
    },
    {
      id: "cdr_m_10",
      type: "input_group",
      text: "10. 请提供他/她的出生地：",
      fields: [
        { id: "province", label: "省", type: "text", placeholder: "如 四川" },
        { id: "city", label: "市", type: "text", placeholder: "如 成都" }
      ],
      required: true
    },
    {
      id: "cdr_m_11",
      type: "textarea",
      text: "11. 请填写他/她曾经就读的学校（如小学、中学、大学）：",
      required: true
    },
    {
      id: "cdr_m_12",
      type: "textarea",
      text: "12. 请填写他/她曾经的主要工作或职业：",
      required: true
    },
    {
      id: "cdr_m_13",
      type: "textarea",
      text: "13. 他/她是什么时候退休的？（如未退休请填“未退休”）：",
      required: true
    },
    {
      id: "cdr_m_14",
      type: "textarea",
      text: "14. 请填写他/她退休的主要原因（如正常退休、因病退休等）：",
      required: true
    },
    {
      id: "cdr_m_15",
      type: "radio",
      text: "15. 他/她能回忆起年轻时发生的一些重大事件吗？",
      options: [
        { label: "经常", value: 1 },
        { label: "有时", value: 2 },
        { label: "很少", value: 3 },
        { label: "不详", value: 4 }
      ],
      required: true
    }
  ]
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

export const scale_cdr_informant_social_home_care = {
  scaleId: "cdr_informant_shc_v1",
  title: "临床痴呆评定量表(CDR) - 询问知情者 (社会事务、家务与爱好、个人生活自理)",
  description: "请最了解患者日常生活的家属或照护者根据患者真实情况作答。",
  questions: [
    // --- 社会活动方面 ---
    {
      id: "cdr_s_1",
      type: "radio",
      text: "工作方面 1. 他/她仍在工作吗？",
      options: [ { label: "是", value: 1 }, { label: "否", value: 2 }, { label: "不适用", value: 3 } ],
      required: true
    },
    {
      id: "cdr_s_2",
      type: "radio",
      text: "工作方面 2. 他/她决定退休是因为记忆减退或考虑问题困难吗？",
      dependsOn: { questionId: "cdr_s_1", value: 2 },
      options: [ { label: "是", value: 1 }, { label: "否", value: 2 }, { label: "不知道", value: 3 } ]
    },
    {
      id: "cdr_s_3",
      type: "radio",
      text: "工作方面 3. 他/她的记忆减退或考虑问题困难，经常引起明显的工作困难吗？",
      dependsOn: { questionId: "cdr_s_1", value: 1 },
      options: [ { label: "无或很少", value: 1 }, { label: "有时", value: 2 }, { label: "经常", value: 3 }, { label: "不知道", value: 4 } ]
    },
    {
      id: "cdr_s_4_1",
      type: "radio",
      text: "社交方面 4-1. 他/她过去开过车或独自乘坐公共交通工具吗？",
      options: [ { label: "是", value: 1 }, { label: "否", value: 2 } ],
      required: true
    },
    {
      id: "cdr_s_4_2",
      type: "radio",
      text: "社交方面 4-2. 他/她现在是否还能够开车或独自乘坐公共交通工具？",
      options: [ { label: "是", value: 1 }, { label: "否", value: 2 } ],
      required: true
    },
    {
      id: "cdr_s_4_3",
      type: "radio",
      text: "社交方面 4-3. 假如现在不能，是否由于记忆或思维问题？",
      dependsOn: { questionId: "cdr_s_4_2", value: 2 },
      options: [ { label: "是", value: 1 }, { label: "否", value: 2 } ]
    },
    {
      id: "cdr_s_5",
      type: "radio",
      text: "社交方面 5. 如果他/她仍有开车或独自乘坐公共交通工具，你认为是否他/她会因此而出现危险吗？",
      dependsOn: { questionId: "cdr_s_4_2", value: 1 },
      options: [ { label: "是", value: 1 }, { label: "否", value: 2 } ]
    },
    {
      id: "cdr_s_6",
      type: "radio",
      text: "社交方面 6. 他/她能独立去购物吗？",
      options: [
        { label: "很少或从来不(每次购物均需别人陪同)", value: 1 },
        { label: "有时(购买有限数量的物品；重复购买或忘记所需要的物品)", value: 2 },
        { label: "经常", value: 3 },
        { label: "不知道", value: 4 }
      ],
      required: true
    },
    {
      id: "cdr_s_7",
      type: "radio",
      text: "社交方面 7. 他/她能独立外出活动吗？",
      options: [
        { label: "很少或从来不(没有帮助一般不能外出)", value: 1 },
        { label: "有时(有限地或进行常规的活动，如开会、理发)", value: 2 },
        { label: "经常(有意义的参加活动，如发表意见、选举)", value: 3 },
        { label: "不详", value: 4 }
      ],
      required: true
    },
    {
      id: "cdr_s_8",
      type: "radio_with_input",
      text: "社交方面 8. 有没有带他/她去参加家庭以外的社交活动？",
      options: [
        { label: "有", value: 1 },
        { label: "没有", value: 2, requiresInput: true, inputPlaceholder: "假如否，为什么？请描述" }
      ],
      required: true
    },
    {
      id: "cdr_s_9",
      type: "radio",
      text: "社交方面 9. 一个偶尔看到他/她的行为的人，会觉得他/她行为异常吗？",
      options: [ { label: "否", value: 1 }, { label: "是", value: 2 } ],
      required: true
    },
    {
      id: "cdr_s_10",
      type: "radio",
      text: "社交方面 10. 如果在养老院里，他/她能很好地参加社交活动吗？",
      options: [ { label: "能", value: 1 }, { label: "不能", value: 2 } ],
      required: true
    },

    // --- 家务与爱好方面 ---
    { id: "cdr_h_1a", type: "textarea", text: "1a. 他/她做家务的能力有什么变化吗？" },
    { id: "cdr_h_1b", type: "textarea", text: "1b. 他/她现在还能做好哪些家务？" },
    { id: "cdr_h_2a", type: "textarea", text: "2a. 他/她参加业余爱好的能力有什么变化？" },
    { id: "cdr_h_2b", type: "textarea", text: "2b. 他/她还能做好哪些爱好的事情？" },
    { id: "cdr_h_3", type: "textarea", text: "3. 如果在养老院，他/她再也无法做好哪些家务和爱好的事情了？" },
    {
      id: "cdr_h_4",
      type: "radio_with_input",
      text: "4. 处理家务的能力：",
      options: [ 
        { label: "没有丧失 (0分)", value: 0 }, 
        { label: "有些丧失 (0.5分)", value: 0.5 }, 
        { label: "严重丧失 (1分)", value: 1, requiresInput: true, inputPlaceholder: "请描述" } 
      ],
      required: true
    },
    {
      id: "cdr_h_5",
      type: "radio",
      text: "5. 他/她做家务的能力以下哪个答案最合适(检査者根据以上信息判断)：",
      options: [
        { label: "缺乏有意义的功能(只有在高度提示指导下才可完成简单的活动，如铺床)", value: 1 },
        { label: "仅能从事有限的活动(在指导下，洗碗基本干净、能摆碗筷)", value: 2 },
        { label: "能独立完成某些活动(使用电器，如吸尘器；做简单的饭)", value: 3 },
        { label: "日常活动不如过去", value: 4 },
        { label: "日常活动正常", value: 5 }
      ],
      required: true
    },

    // --- 个人生活自理能力 ---
    {
      id: "cdr_p_1",
      type: "radio",
      text: "1. 穿衣",
      options: [
        { label: "独立完成", value: 0 }, 
        { label: "有时系错扣子等", value: 1 },
        { label: "顺序错误，常忘记某一些步骤", value: 2 }, 
        { label: "不能穿衣", value: 3 }
      ],
      required: true
    },
    {
      id: "cdr_p_2",
      type: "radio",
      text: "2. 洗漱与梳妆打扮",
      options: [
        { label: "无须帮助", value: 0 }, 
        { label: "需要督促", value: 1 },
        { label: "有时需要帮助", value: 2 }, 
        { label: "总是或几乎总是需要帮助", value: 3 }
      ],
      required: true
    },
    {
      id: "cdr_p_3",
      type: "radio",
      text: "3. 吃饭",
      options: [
        { label: "干净，适当使用餐具", value: 0 }, 
        { label: "零乱，只用汤勺", value: 1 },
        { label: "只能吃简单的固体食物", value: 2 }, 
        { label: "完全依赖他人喂食", value: 3 }
      ],
      required: true
    },
    {
      id: "cdr_p_4",
      type: "radio",
      text: "4. 二便控制",
      options: [
        { label: "控制正常", value: 0 }, 
        { label: "有时尿床", value: 1 },
        { label: "经常尿床", value: 2 }, 
        { label: "大小便失禁", value: 3 }
      ],
      required: true
    }
  ]
};
