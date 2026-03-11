export const scale_phq9 = {
  scaleId: "phq9_v1",
  title: "PHQ-9 抑郁症筛查量表",
  description: "在过去的两周里，您生活中以下症状出现的频率有多少？",
  questions: [
    {
      id: "phq9_1",
      type: "radio",
      text: "1. 做事时提不起劲或没有兴趣",
      options: [
        { label: "完全不会", value: 0 },
        { label: "好几天", value: 1 },
        { label: "一半以上的天数", value: 2 },
        { label: "几乎每天", value: 3 }
      ],
      required: true
    },
    {
      id: "phq9_2",
      type: "radio",
      text: "2. 感到心情低落、沮丧或绝望",
      options: [
        { label: "完全不会", value: 0 },
        { label: "好几天", value: 1 },
        { label: "一半以上的天数", value: 2 },
        { label: "几乎每天", value: 3 }
      ],
      required: true
    },
    {
      id: "phq9_3",
      type: "radio",
      text: "3. 入睡困难、睡不安稳或睡眠过多",
      options: [
        { label: "完全不会", value: 0 },
        { label: "好几天", value: 1 },
        { label: "一半以上的天数", value: 2 },
        { label: "几乎每天", value: 3 }
      ],
      required: true
    },
    {
      id: "phq9_4",
      type: "radio",
      text: "4. 感觉疲倦或没有活力",
      options: [
        { label: "完全不会", value: 0 },
        { label: "好几天", value: 1 },
        { label: "一半以上的天数", value: 2 },
        { label: "几乎每天", value: 3 }
      ],
      required: true
    },
    {
      id: "phq9_5",
      type: "radio",
      text: "5. 食欲不振或吃太多",
      options: [
        { label: "完全不会", value: 0 },
        { label: "好几天", value: 1 },
        { label: "一半以上的天数", value: 2 },
        { label: "几乎每天", value: 3 }
      ],
      required: true
    },
    {
      id: "phq9_6",
      type: "radio",
      text: "6. 觉得自己很糟，或觉得自己很失败，或让自己或家人失望",
      options: [
        { label: "完全不会", value: 0 },
        { label: "好几天", value: 1 },
        { label: "一半以上的天数", value: 2 },
        { label: "几乎每天", value: 3 }
      ],
      required: true
    },
    {
      id: "phq9_7",
      type: "radio",
      text: "7. 对事物注意力不集中，例如阅读报纸或看电视时",
      options: [
        { label: "完全不会", value: 0 },
        { label: "好几天", value: 1 },
        { label: "一半以上的天数", value: 2 },
        { label: "几乎每天", value: 3 }
      ],
      required: true
    },
    {
      id: "phq9_8",
      type: "radio",
      text: "8. 动作或说话速度缓慢到别人已经察觉；或正好相反，烦躁或坐立不安，动来动去的情况比平常多",
      options: [
        { label: "完全不会", value: 0 },
        { label: "好几天", value: 1 },
        { label: "一半以上的天数", value: 2 },
        { label: "几乎每天", value: 3 }
      ],
      required: true
    },
    {
      id: "phq9_9",
      type: "radio",
      text: "9. 有不如死掉或用某种方式伤害自己的念头",
      options: [
        { label: "完全不会", value: 0 },
        { label: "好几天", value: 1 },
        { label: "一半以上的天数", value: 2 },
        { label: "几乎每天", value: 3 }
      ],
      required: true
    },
    {
      id: "phq9_9_risk",
      type: "radio_with_input",
      text: "9a. (高危预警) 您提到有伤害自己的念头，请问是否已经有了具体的计划？",
      options: [
        { label: "没有具体计划，只是偶尔有想法", value: 0 },
        { label: "有模糊的计划", value: 1 },
        { label: "有非常具体的计划", value: 2, requiresInput: true, inputPlaceholder: "请简述您的计划（选填）" }
      ],
      dependsOn: {
        questionId: "phq9_9",
        value: [1, 2, 3] // Array format is supported by AssessmentEngine
      },
      required: true
    },
    {
      id: "phq9_10",
      type: "slider",
      text: "10. 总体而言，这些问题在多大程度上让您在工作、照顾家庭或与人相处时感到困难？(0=完全没有困难, 10=极度困难)",
      min: 0,
      max: 10,
      step: 1,
      minLabel: "完全没有困难",
      maxLabel: "极度困难",
      required: true
    }
  ]
};
