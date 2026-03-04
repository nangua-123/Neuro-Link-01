import { QuestionType } from "../../interfaces/scaleEngine";

export const scale_migraine_midas_mock = {
  scaleId: "migraine_midas_mock",
  title: "偏头痛 MIDAS 初筛 (Mock)",
  description: "这是一个偏头痛 MIDAS 初筛的占位量表，后续将注入真实量表。",
  questions: [
    {
      id: "migraine_q1",
      type: QuestionType.RADIO,
      text: "1. 过去3个月内，您有多少天因为头痛而无法上班或上学？",
      options: [
        { label: "0天", value: 0 },
        { label: "1-2天", value: 1 },
        { label: "3-5天", value: 2 },
        { label: "6天及以上", value: 3 },
      ],
      required: true,
    },
    {
      id: "migraine_q2",
      type: QuestionType.RADIO,
      text: "2. 过去3个月内，您有多少天因为头痛导致工作或学习效率降低一半以上？",
      options: [
        { label: "0天", value: 0 },
        { label: "1-2天", value: 1 },
        { label: "3-5天", value: 2 },
        { label: "6天及以上", value: 3 },
      ],
      required: true,
    },
  ],
};
