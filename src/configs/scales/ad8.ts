export const scale_ad8 = {
  scaleId: "ad8_v1",
  title: "AD8 早期认知障碍筛查量表",
  description: "请回想患者在过去几年的变化。如果患者有以下变化，请选择“是，有改变”。如果没有，请选择“否，无改变”。",
  questions: [
    {
      id: "ad8_1",
      type: "radio",
      text: "1. 判断力上的困难（例如：做决定困难、错误的财务决定、思考障碍）",
      options: [
        { label: "是，有改变", value: 1 },
        { label: "否，无改变", value: 0 },
        { label: "不知道", value: -1 }
      ],
      required: true
    },
    {
      id: "ad8_2",
      type: "radio",
      text: "2. 对活动和嗜好的兴趣降低",
      options: [
        { label: "是，有改变", value: 1 },
        { label: "否，无改变", value: 0 },
        { label: "不知道", value: -1 }
      ],
      required: true
    },
    {
      id: "ad8_3",
      type: "radio",
      text: "3. 重复相同的问题、故事和陈述",
      options: [
        { label: "是，有改变", value: 1 },
        { label: "否，无改变", value: 0 },
        { label: "不知道", value: -1 }
      ],
      required: true
    },
    {
      id: "ad8_4",
      type: "radio",
      text: "4. 在学习如何使用工具、设备和小器具上有困难（例如：电视、遥控器、微波炉）",
      options: [
        { label: "是，有改变", value: 1 },
        { label: "否，无改变", value: 0 },
        { label: "不知道", value: -1 }
      ],
      required: true
    },
    {
      id: "ad8_5",
      type: "radio",
      text: "5. 忘记正确的年份和月份",
      options: [
        { label: "是，有改变", value: 1 },
        { label: "否，无改变", value: 0 },
        { label: "不知道", value: -1 }
      ],
      required: true
    },
    {
      id: "ad8_6",
      type: "radio",
      text: "6. 处理复杂的财务上有困难（例如：缴费、记账）",
      options: [
        { label: "是，有改变", value: 1 },
        { label: "否，无改变", value: 0 },
        { label: "不知道", value: -1 }
      ],
      required: true
    },
    {
      id: "ad8_7",
      type: "radio",
      text: "7. 记不住正确的约会时间",
      options: [
        { label: "是，有改变", value: 1 },
        { label: "否，无改变", value: 0 },
        { label: "不知道", value: -1 }
      ],
      required: true
    },
    {
      id: "ad8_8",
      type: "radio",
      text: "8. 有持续的思考和记忆方面的问题",
      options: [
        { label: "是，有改变", value: 1 },
        { label: "否，无改变", value: 0 },
        { label: "不知道", value: -1 }
      ],
      required: true
    }
  ]
};
