// File: src/configs/scales/epilepsy.ts
import { QuestionType } from "../../interfaces/scaleEngine";

export const scale_epilepsy_crf_v0_part1 = {
  scaleId: "epilepsy_crf_v0_p1",
  title: "癫痫病例报告表 - 基线期 V0 (入排标准与基本信息)",
  description:
    "女性癫痫患者孕期不同剂量叶酸补充降低子代不良结局的效果及安全性的随机对照试验",
  questions: [
    // --- 入选标准 ---
    {
      id: "epi_in_1",
      type: QuestionType.RADIO,
      text: "1. 根据国际抗癫痫联盟（ILAE）癫痫诊断标准 确诊的女性癫痫患者",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_in_2",
      type: QuestionType.RADIO,
      text: "2. 年龄 18至 45岁",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_in_3",
      type: QuestionType.RADIO,
      text: "3. 妊娠试验阳性，且孕周<8周",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_in_4",
      type: QuestionType.RADIO,
      text: "4. 患者已签署知情同意书",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },

    // --- 排除标准 ---
    {
      id: "epi_ex_1",
      type: QuestionType.RADIO,
      text: "1. 孕前 3月内出现癫痫发作",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_2",
      type: QuestionType.RADIO,
      text: "2. 既往妊娠史中存在神经管缺陷或其他胎儿先天畸形史",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_3",
      type: QuestionType.RADIO,
      text: "3. 患者本人患有神经管缺陷或其他先天畸形或存在相关家族病史",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_4",
      type: QuestionType.RADIO,
      text: "4. 患者配偶患有神经管缺陷或其他先天畸形或存在相关家族病史",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_5",
      type: QuestionType.RADIO,
      text: "5. 合并巨幼细胞性贫血",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_6",
      type: QuestionType.RADIO,
      text: "6. 合并恶性肿瘤或严重疾病（例如克罗恩病、类风湿性关节炎、溃疡性结肠炎）",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_7",
      type: QuestionType.RADIO,
      text: "7. 正在服用会干扰叶酸代谢的药物，例如甲氨蝶呤、柳氮磺吡啶、抗疟疾药物（抗癫痫发作药物除外）",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_8",
      type: QuestionType.RADIO,
      text: "8. 高同型半胱氨酸血症",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_9",
      type: QuestionType.RADIO,
      text: "9. 长期接触放射物质",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_10",
      type: QuestionType.RADIO,
      text: "10. 酒精滥用（过去 12月内＞500ml/周）",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_11",
      type: QuestionType.RADIO,
      text: "11. 补充叶酸＞0.4mg/d超过 1个月",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_12",
      type: QuestionType.RADIO,
      text: "12. 对叶酸过敏或存在叶酸使用禁忌",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },
    {
      id: "epi_ex_13",
      type: QuestionType.RADIO,
      text: "13. 正在接受其他临床研究",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      required: true,
    },

    // --- 一、基本信息 ---
    {
      id: "epi_b_1",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "具体民族：",
      options: [
        { label: "汉族", value: 1 },
        {
          label: "其他",
          value: 2,
          requiresInput: true,
          inputPlaceholder: "具体为",
        },
      ],
      required: true,
    },
    {
      id: "epi_b_2",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "常住地：",
      options: [
        { label: "农村", value: 1 },
        {
          label: "城市（包括县城）",
          value: 2,
          requiresInput: true,
          inputPlaceholder: "具体居住地（省、市、区/县）",
        },
      ],
      required: true,
    },
    {
      id: "epi_b_3",
      type: QuestionType.RADIO,
      text: "是否长期居住在高原地区（海拔>2500米）：",
      options: [
        { label: "否", value: 0 },
        { label: "是", value: 1 },
      ],
      required: true,
    },
    {
      id: "epi_b_4",
      type: QuestionType.RADIO,
      text: "学历：",
      options: [
        { label: "未上学", value: 1 },
        { label: "小学", value: 2 },
        { label: "初中", value: 3 },
        { label: "高中或中专", value: 4 },
        { label: "本科或大专", value: 5 },
        { label: "硕士及以上", value: 6 },
      ],
      required: true,
    },
    {
      id: "epi_b_5",
      type: QuestionType.RADIO,
      text: "从事职业：",
      options: [
        { label: "国家机关/党群组织/企业/事业单位负责人", value: 1 },
        { label: "专业技术人员", value: 2 },
        { label: "办事人员和有关人员", value: 3 },
        { label: "商业/服务业人员", value: 4 },
        { label: "农/林/牧/渔/水利业生产人员", value: 5 },
        { label: "生产/运输设备操作人员及有关人员", value: 6 },
        { label: "军人", value: 7 },
        { label: "学生", value: 8 },
        { label: "下岗或无业", value: 9 },
        { label: "其他", value: 10 },
      ],
      required: true,
    },
    {
      id: "epi_b_6",
      type: QuestionType.RADIO,
      text: "家庭人均月收入：",
      options: [
        { label: "<5000元/月", value: 1 },
        { label: "≥5000元/月", value: 2 },
      ],
      required: true,
    },

    // --- 二、妊娠情况 ---
    {
      id: "epi_p_1",
      type: QuestionType.INPUT_GROUP,
      text: "2-1 此次妊娠为第几次怀孕",
      fields: [{ id: "preg_count", suffix: "次", type: "number" }],
      required: true,
    },
    {
      id: "epi_p_2",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "2-2 此次妊娠为",
      options: [
        { label: "单胎", value: 1 },
        { label: "双胎", value: 2 },
        {
          label: "多胎",
          value: 3,
          requiresInput: true,
          inputPlaceholder: "具体胎数",
        },
      ],
      required: true,
    },
    {
      id: "epi_p_3",
      type: QuestionType.RADIO,
      text: "2-3 此次妊娠是否备孕：",
      options: [
        { label: "计划怀孕", value: 1 },
        { label: "意外怀孕", value: 2 },
      ],
      required: true,
    },
    {
      id: "epi_p_4",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "2-4 是否出现孕期并发症：",
      options: [
        { label: "无", value: 0 },
        {
          label: "有",
          value: 1,
          subQuestions: [
            {
              id: "epi_p_4_sub",
              type: QuestionType.CHECKBOX_WITH_INPUT,
              text: "并发症详情",
              options: [
                {
                  label: "阴道出血",
                  value: "c1",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "妊娠期高血压",
                  value: "c2",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "妊娠期糖尿病",
                  value: "c3",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "妊娠期贫血",
                  value: "c4",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "妊娠期甲减",
                  value: "c5",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "妊娠期甲亢",
                  value: "c6",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "妊娠期胆汁淤积症",
                  value: "c7",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "妊娠期急性脂肪肝",
                  value: "c8",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "妊娠剧吐",
                  value: "c9",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "超重",
                  value: "c10",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
                {
                  label: "其他",
                  value: "c11",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
              ],
            },
          ],
        },
      ],
      required: true,
    },
    {
      id: "epi_p_5",
      type: QuestionType.RADIO,
      text: "2-5 妊娠期间是否吸烟：",
      options: [
        { label: "不吸烟", value: 0 },
        { label: "吸烟（每天>1支）", value: 1 },
        { label: "已戒烟", value: 2 },
        {
          label:
            "被动吸烟（一周中有 1d以上吸入吸烟者呼出烟雾的时间>15min/d。）",
          value: 3,
        },
      ],
      required: true,
    },
    {
      id: "epi_p_6",
      type: QuestionType.RADIO,
      text: "2-6 妊娠期间是否饮酒：",
      options: [
        { label: "不饮酒", value: 0 },
        { label: "饮酒（每周>1次）", value: 1 },
      ],
      required: true,
    },
  ],
};

export const scale_epilepsy_crf_v0_part2 = {
  scaleId: "epilepsy_crf_v0_p2",
  title: "癫痫病例报告表 - 基线期 V0 (癫痫史与发作矩阵)",
  description: "基于 ILAE 最新分类标准，请准确勾选患者的发作表现与病因。",
  questions: [
    // --- ILAE 发作分类矩阵 ---
    {
      id: "epi_matrix_focal",
      type: QuestionType.CHECKBOX,
      text: "【ILAE 矩阵】局灶起源发作表现 (可多选)：",
      options: [
        { label: "知觉保留", value: "focal_aware" },
        { label: "知觉障碍", value: "focal_impaired" },
        { label: "运动起源: 自动症", value: "f_m_auto" },
        { label: "运动起源: 失张力", value: "f_m_atonic" },
        { label: "运动起源: 阵挛", value: "f_m_clonic" },
        { label: "运动起源: 癫痫痉挛", value: "f_m_spasm" },
        { label: "运动起源: 过度运动", value: "f_m_hyper" },
        { label: "运动起源: 肌阵挛", value: "f_m_myo" },
        { label: "运动起源: 强直", value: "f_m_tonic" },
        { label: "非运动起源: 自主神经发作", value: "f_nm_auto" },
        { label: "非运动起源: 运动停止发作", value: "f_nm_arrest" },
        { label: "非运动起源: 认知发作", value: "f_nm_cog" },
        { label: "非运动起源: 情绪发作", value: "f_nm_emo" },
        { label: "非运动起源: 感觉发作", value: "f_nm_sensory" },
        { label: "局灶到双侧的强直阵挛发作", value: "focal_to_bilateral" },
      ],
    },
    {
      id: "epi_matrix_gen",
      type: QuestionType.CHECKBOX,
      text: "【ILAE 矩阵】全面起源发作表现 (可多选)：",
      options: [
        { label: "运动: 强直-阵挛", value: "g_m_tc" },
        { label: "运动: 阵挛", value: "g_m_c" },
        { label: "运动: 肌阵挛", value: "g_m_m" },
        { label: "运动: 肌阵挛-强直-阵挛", value: "g_m_mtc" },
        { label: "运动: 肌阵挛-失张力", value: "g_m_ma" },
        { label: "运动: 失张力", value: "g_m_a" },
        { label: "运动: 癫痫痉挛", value: "g_m_s" },
        { label: "非运动(失神): 典型", value: "g_nm_typ" },
        { label: "非运动(失神): 非典型", value: "g_nm_atyp" },
        { label: "非运动(失神): 肌阵挛", value: "g_nm_m" },
        { label: "非运动(失神): 眼睑肌阵挛", value: "g_nm_eye" },
      ],
    },
    {
      id: "epi_matrix_unk",
      type: QuestionType.CHECKBOX,
      text: "【ILAE 矩阵】未知起源及未分类 (可多选)：",
      options: [
        { label: "未知-运动: 强直-阵挛", value: "u_m_tc" },
        { label: "未知-运动: 癫痫痉挛", value: "u_m_s" },
        { label: "未知-非运动: 运动停止等", value: "u_nm_arrest" },
        { label: "未分类", value: "unclassified" },
      ],
    },

    // --- 癫痫史基础情况 ---
    {
      id: "epi_h_1",
      type: QuestionType.INPUT_GROUP,
      text: "1) 首次发作年龄：",
      fields: [{ id: "first_onset_age", suffix: "岁", type: "number" }],
      required: true,
    },
    {
      id: "epi_h_2",
      type: QuestionType.RADIO,
      text: "2) 是否出现 GTCS (全面强直阵挛发作)：",
      options: [
        { label: "无", value: 0 },
        { label: "有", value: 1 },
      ],
      required: true,
    },
    {
      id: "epi_h_3",
      type: QuestionType.INPUT_GROUP,
      text: "3) 发病至今共计发作类型数量：",
      fields: [{ id: "seizure_type_count", suffix: "种", type: "number" }],
      required: true,
    },
    {
      id: "epi_h_4",
      type: QuestionType.RADIO,
      text: "4) 难治性癫痫：",
      description:
        "提示：正确选择且能耐受的两种及以上抗癫痫发作药物（单药或联合用药）半年及以上仍未能达到持续无发作。",
      options: [
        { label: "否", value: 0 },
        { label: "是", value: 1 },
        { label: "目前无法判断", value: 2 },
      ],
      required: true,
    },
    {
      id: "epi_h_5",
      type: QuestionType.RADIO,
      text: "5) 癫痫手术史：",
      options: [
        { label: "否", value: 0 },
        { label: "是", value: 1 },
      ],
      required: true,
    },

    // --- 具体发作与病因 ---
    {
      id: "epi_type_1_desc",
      type: QuestionType.TEXTAREA,
      text: "2-2-1 第一种发作类型具体描述：",
      placeholder:
        "包括：清醒/睡眠发作，先兆、发作时意识状态、具体表现、持续时间、发作后症状",
    },
    {
      id: "epi_type_1_class",
      type: QuestionType.INPUT_GROUP,
      text: "发作类型分类与频率：",
      fields: [
        { id: "class_name", label: "类型分类", type: "text" },
        { id: "freq_1yr", label: "近1年发作频率", type: "text" },
      ],
    },
    {
      id: "epi_type_1_dates",
      type: QuestionType.INPUT_GROUP,
      text: "发作时间记录：",
      fields: [
        { id: "last_seizure_date", label: "最近一次发作时间", type: "date" },
        {
          id: "pre_preg_seizure_date",
          label: "妊娠前最近一次发作时间",
          type: "date",
        },
      ],
    },
    {
      id: "epi_type_other",
      type: QuestionType.RADIO,
      text: "是否有其他发作类型：",
      options: [
        { label: "否，仅一种发作类型", value: 1 },
        { label: "有 2 种发作类型", value: 2 },
        { label: "有 3 种发作类型", value: 3 },
        { label: "有 4 种发作类型", value: 4 },
      ],
    },
    {
      id: "epi_etiology",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "2-3 癫痫病因判定：",
      options: [
        {
          label: "结构",
          value: 1,
          subQuestions: [
            {
              id: "et_struct",
              type: QuestionType.CHECKBOX_WITH_INPUT,
              text: "具体结构病因",
              options: [
                { label: "脑血管病", value: "v1" },
                { label: "脑外伤", value: "v2" },
                { label: "脑畸形或发育异常", value: "v3" },
                { label: "脑肿瘤", value: "v4" },
                { label: "灰质异位", value: "v5" },
                { label: "脑血管", value: "v6" },
                { label: "出血灶", value: "v7" },
                { label: "瘢痕", value: "v8" },
                {
                  label: "其他",
                  value: "other",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
              ],
            },
          ],
        },
        {
          label: "感染",
          value: 2,
          subQuestions: [
            {
              id: "et_infect",
              type: QuestionType.CHECKBOX_WITH_INPUT,
              text: "具体感染病因",
              options: [
                { label: "病毒性感染", value: "i1" },
                { label: "真菌性感染", value: "i2" },
                { label: "细菌性感染", value: "i3" },
                {
                  label: "其他",
                  value: "other",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
              ],
            },
          ],
        },
        {
          label: "代谢",
          value: 3,
          subQuestions: [
            {
              id: "et_meta",
              type: QuestionType.CHECKBOX_WITH_INPUT,
              text: "具体代谢病因",
              options: [
                { label: "糖代谢异常", value: "m1" },
                { label: "氨基酸代谢病", value: "m2" },
                { label: "有机酸代谢病", value: "m3" },
                { label: "过氧化物酶体病", value: "m4" },
                { label: "溶酶体贮积病", value: "m5" },
                { label: "线粒体脑肌病", value: "m6" },
                {
                  label: "其他",
                  value: "other",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
              ],
            },
          ],
        },
        {
          label: "免疫",
          value: 4,
          subQuestions: [
            {
              id: "et_immune",
              type: QuestionType.CHECKBOX_WITH_INPUT,
              text: "具体免疫病因",
              options: [
                { label: "自身免疫性脑炎", value: "im1" },
                { label: "系统性红斑狼疮", value: "im2" },
                { label: "白塞病", value: "im3" },
                { label: "干燥综合征", value: "im4" },
                { label: "POEM病", value: "im5" },
                {
                  label: "其他",
                  value: "other",
                  requiresInput: true,
                  inputPlaceholder: "具体描述",
                },
              ],
            },
          ],
        },
        {
          label: "遗传",
          value: 5,
          subQuestions: [
            {
              id: "et_gene",
              type: QuestionType.INPUT_GROUP,
              fields: [{ id: "gene", label: "异常基因", type: "text" }],
            },
          ],
        },
        { label: "未知", value: 6 },
      ],
      required: true,
    },
  ],
};

export const scale_epilepsy_crf_v0_part3 = {
  scaleId: "epilepsy_crf_v0_p3",
  title: "癫痫病例报告表 - 基线期 V0 (用药、病史与检查)",
  description:
    "请如实记录患者的用药情况、既往病史、家族史及基线期体格与辅助检查结果。",
  questions: [
    // --- 四、药物服用 ---
    {
      id: "epi_m_1",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "3-1 目前抗癫痫发作药物服用情况：",
      options: [
        { label: "未用药", value: 0 },
        {
          label: "已用药",
          value: 1,
          subQuestions: [
            {
              id: "epi_m_1_1",
              type: QuestionType.INPUT_GROUP,
              text: "3-1-1 第一种药物",
              fields: [
                { id: "drug1_name", label: "药物名称", type: "text" },
                { id: "drug1_start_y", label: "开始用药(年)", type: "number" },
                { id: "drug1_start_m", label: "开始用药(月)", type: "number" },
                { id: "drug1_start_d", label: "开始用药(日)", type: "number" },
                { id: "drug1_morn", label: "早上(mg)", type: "number" },
                { id: "drug1_noon", label: "中午(mg)", type: "number" },
                { id: "drug1_night", label: "晚上(mg)", type: "number" },
              ],
            },
            {
              id: "epi_m_1_2",
              type: QuestionType.INPUT_GROUP,
              text: "3-1-2 第二种药物",
              fields: [
                { id: "drug2_name", label: "药物名称", type: "text" },
                { id: "drug2_start_y", label: "开始用药(年)", type: "number" },
                { id: "drug2_start_m", label: "开始用药(月)", type: "number" },
                { id: "drug2_start_d", label: "开始用药(日)", type: "number" },
                { id: "drug2_morn", label: "早上(mg)", type: "number" },
                { id: "drug2_noon", label: "中午(mg)", type: "number" },
                { id: "drug2_night", label: "晚上(mg)", type: "number" },
              ],
            },
          ],
        },
      ],
      required: true,
    },
    {
      id: "epi_m_2",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "3-2 抗癫痫发作药物史：妊娠前 1年至今是否停用任何抗癫痫发作药物：",
      options: [
        { label: "否", value: 0 },
        {
          label: "是",
          value: 1,
          subQuestions: [
            {
              id: "epi_m_2_1",
              type: QuestionType.INPUT_GROUP,
              text: "3-2-1 第一种停用药物",
              fields: [
                { id: "stop_drug1_name", label: "药物名称", type: "text" },
                {
                  id: "stop_drug1_start",
                  label: "开始日期(年月日)",
                  type: "text",
                },
                { id: "stop_drug1_morn", label: "早上(mg)", type: "number" },
                { id: "stop_drug1_noon", label: "中午(mg)", type: "number" },
                { id: "stop_drug1_night", label: "晚上(mg)", type: "number" },
                {
                  id: "stop_drug1_end",
                  label: "停用时间(年月日)",
                  type: "text",
                },
              ],
            },
            {
              id: "epi_m_2_1_reason",
              type: QuestionType.RADIO_WITH_INPUT,
              text: "停用原因 (第一种停用药物)：",
              options: [
                { label: "更换药物", value: 1 },
                { label: "自行停药", value: 2 },
                { label: "副作用（不良反应）", value: 3 },
                { label: "医生建议停药", value: 4 },
                {
                  label: "其他",
                  value: 5,
                  requiresInput: true,
                  inputPlaceholder: "请填写其他原因",
                },
              ],
            },
            {
              id: "epi_m_2_2",
              type: QuestionType.INPUT_GROUP,
              text: "3-2-2 第二种停用药物",
              fields: [
                { id: "stop_drug2_name", label: "药物名称", type: "text" },
                {
                  id: "stop_drug2_start",
                  label: "开始日期(年月日)",
                  type: "text",
                },
                { id: "stop_drug2_morn", label: "早上(mg)", type: "number" },
                { id: "stop_drug2_noon", label: "中午(mg)", type: "number" },
                { id: "stop_drug2_night", label: "晚上(mg)", type: "number" },
                {
                  id: "stop_drug2_end",
                  label: "停用时间(年月日)",
                  type: "text",
                },
              ],
            },
            {
              id: "epi_m_2_2_reason",
              type: QuestionType.RADIO_WITH_INPUT,
              text: "停用原因 (第二种停用药物)：",
              options: [
                { label: "更换药物", value: 1 },
                { label: "自行停药", value: 2 },
                { label: "副作用（不良反应）", value: 3 },
                { label: "医生建议停药", value: 4 },
                {
                  label: "其他",
                  value: 5,
                  requiresInput: true,
                  inputPlaceholder: "请填写其他原因",
                },
              ],
            },
          ],
        },
      ],
      required: true,
    },
    {
      id: "epi_m_3_1",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "3-3-1 目前是否服用叶酸：",
      options: [
        { label: "否", value: 0 },
        {
          label: "是",
          value: 1,
          subQuestions: [
            {
              id: "epi_m_3_1_details",
              type: QuestionType.INPUT_GROUP,
              fields: [
                { id: "folic_dose", label: "叶酸剂量(mg/d)", type: "number" },
                { id: "folic_start", label: "开始日期(年月日)", type: "text" },
              ],
            },
            {
              id: "epi_m_3_1_stop",
              type: QuestionType.RADIO_WITH_INPUT,
              text: "中间是否停用：",
              options: [
                { label: "否", value: 0 },
                {
                  label: "是",
                  value: 1,
                  requiresInput: true,
                  inputPlaceholder: "停用天数",
                },
              ],
            },
          ],
        },
      ],
      required: true,
    },
    {
      id: "epi_m_3_2",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "3-3-2 目前是否服用包含叶酸成分的其他药物：",
      options: [
        { label: "否", value: 0 },
        {
          label: "是",
          value: 1,
          subQuestions: [
            {
              id: "epi_m_3_2_details",
              type: QuestionType.INPUT_GROUP,
              fields: [
                { id: "other_folic_name", label: "药物名称", type: "text" },
                { id: "other_folic_dose", label: "剂量(mg/d)", type: "number" },
                { id: "other_folic_freq", label: "频次", type: "text" },
                { id: "other_folic_reason", label: "服用原因", type: "text" },
                {
                  id: "other_folic_content",
                  label: "该药物成分中的叶酸剂量(mg/d)",
                  type: "number",
                },
                {
                  id: "other_folic_start",
                  label: "开始日期(年月日)",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
      required: true,
    },
    {
      id: "epi_m_4",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "3-4 其他药物服用情况 目前是否服用除抗癫痫发作药物以外的其他药物：",
      options: [
        { label: "否", value: 0 },
        {
          label: "是",
          value: 1,
          subQuestions: [
            {
              id: "epi_m_4_details",
              type: QuestionType.INPUT_GROUP,
              text: "3-4-1 其他药物明细",
              fields: [
                { id: "other_drug_name", label: "药物名称", type: "text" },
                { id: "other_drug_dose", label: "剂量(mg/d)", type: "number" },
                { id: "other_drug_freq", label: "频次", type: "text" },
                { id: "other_drug_reason", label: "服用原因", type: "text" },
              ],
            },
          ],
        },
      ],
      required: true,
    },

    // --- 五、其他疾病史（孕前） ---
    {
      id: "epi_history_other",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "是否合并和其他疾病：",
      options: [
        { label: "无", value: 0 },
        {
          label: "有",
          value: 1,
          subQuestions: [
            {
              id: "epi_history_other_details",
              type: QuestionType.INPUT_GROUP,
              fields: [
                { id: "disease_sys", label: "部位/系统", type: "text" },
                { id: "disease_name", label: "疾病名称", type: "text" },
                { id: "disease_date", label: "诊断时间", type: "text" },
                { id: "disease_persistent", label: "是否持续", type: "text" },
              ],
            },
          ],
        },
      ],
      required: true,
    },

    // --- 六、本人家族史（不包括配偶） ---
    {
      id: "epi_fam_1",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "6-1 癫痫家族史：",
      options: [
        { label: "无", value: 0 },
        {
          label: "有",
          value: 1,
          subQuestions: [
            {
              id: "epi_fam_1_details",
              type: QuestionType.INPUT_GROUP,
              fields: [
                { id: "direct_who", label: "直系(具体哪位)", type: "text" },
                { id: "direct_disease", label: "直系(疾病为)", type: "text" },
                { id: "collateral_who", label: "旁系(具体哪位)", type: "text" },
                {
                  id: "collateral_disease",
                  label: "旁系(疾病为)",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
      required: true,
    },
    {
      id: "epi_fam_2",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "6-2 神经和精神系统疾病：",
      options: [
        { label: "无", value: 0 },
        {
          label: "有",
          value: 1,
          subQuestions: [
            {
              id: "epi_fam_2_details",
              type: QuestionType.INPUT_GROUP,
              fields: [
                { id: "direct_who_ns", label: "直系(具体哪位)", type: "text" },
                {
                  id: "direct_disease_ns",
                  label: "直系(疾病为)",
                  type: "text",
                },
                {
                  id: "collateral_who_ns",
                  label: "旁系(具体哪位)",
                  type: "text",
                },
                {
                  id: "collateral_disease_ns",
                  label: "旁系(疾病为)",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
      required: true,
    },
    {
      id: "epi_fam_3_1",
      type: QuestionType.RADIO,
      text: "6-3 配偶情况 - 1) 配偶学历：",
      options: [
        { label: "未上学", value: 1 },
        { label: "小学", value: 2 },
        { label: "初中", value: 3 },
        { label: "高中或中专", value: 4 },
        { label: "本科或大专", value: 5 },
        { label: "硕士及以上", value: 6 },
      ],
    },
    {
      id: "epi_fam_3_2",
      type: QuestionType.RADIO,
      text: "6-3 配偶情况 - 2) 配偶是否吸烟：",
      options: [
        { label: "无", value: 0 },
        { label: "是", value: 1 },
      ],
    },
    {
      id: "epi_fam_3_3",
      type: QuestionType.RADIO,
      text: "6-3 配偶情况 - 3) 配偶是否饮酒：",
      options: [
        { label: "无", value: 0 },
        { label: "是", value: 1 },
      ],
    },
    {
      id: "epi_fam_3_4",
      type: QuestionType.RADIO,
      text: "6-3 配偶情况 - 4) 配偶是否有癫痫：",
      options: [
        { label: "无", value: 0 },
        { label: "是", value: 1 },
      ],
    },
    {
      id: "epi_fam_3_5",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "6-3 配偶情况 - 5) 配偶是否有家族遗传性疾病：",
      options: [
        { label: "无", value: 0 },
        {
          label: "有",
          value: 1,
          requiresInput: true,
          inputPlaceholder: "具体为",
        },
      ],
    },

    // --- 七、生育史 ---
    {
      id: "epi_repo_1",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "7-1 是否首次怀孕：",
      options: [
        { label: "是", value: 1 },
        {
          label: "否",
          value: 0,
          subQuestions: [
            {
              id: "epi_repo_details",
              type: QuestionType.INPUT_GROUP,
              fields: [
                { id: "total_preg", label: "共计孕(次)", type: "number" },
                { id: "total_delivery", label: "生产(次)", type: "number" },
                {
                  id: "natural_abortion",
                  label: "自然流产(次)",
                  type: "number",
                },
                { id: "stillbirth", label: "死胎(次)", type: "number" },
                { id: "teratism_count", label: "畸胎(次)", type: "number" },
                { id: "teratism_detail", label: "具体畸形为", type: "text" },
                { id: "unwanted", label: "主观不想要(次)", type: "number" },
                { id: "other_count", label: "其他(次)", type: "number" },
                { id: "other_detail", label: "具体原因", type: "text" },
              ],
            },
          ],
        },
      ],
      required: true,
    },

    // --- 八、体格检查 ---
    {
      id: "epi_pe_1",
      type: QuestionType.INPUT_GROUP,
      text: "八、体格检查",
      fields: [
        { id: "height", label: "身高", suffix: "cm", type: "number" },
        { id: "weight", label: "体重", suffix: "kg", type: "number" },
        { id: "bp_systolic", label: "收缩压", suffix: "mmHg", type: "number" },
        { id: "bp_diastolic", label: "舒张压", suffix: "mmHg", type: "number" },
      ],
      required: true,
    },

    // --- 九、辅助检查 ---
    {
      id: "epi_aux_1",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "9-1 脑电图（是否有脑电图检测结果）：",
      options: [
        { label: "无", value: 0 },
        {
          label: "有",
          value: 1,
          subQuestions: [
            {
              id: "epi_aux_1_details",
              type: QuestionType.INPUT_GROUP,
              fields: [
                { id: "eeg_date", label: "检测时间(年月日)", type: "text" },
                { id: "eeg_result", label: "结果描述", type: "text" },
              ],
            },
          ],
        },
      ],
      required: true,
    },
    {
      id: "epi_aux_2_1",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "9-2-1 MRI（是否有头部MRI检测结果）：",
      options: [
        { label: "无", value: 0 },
        {
          label: "有",
          value: 1,
          subQuestions: [
            {
              id: "epi_aux_2_1_date",
              type: QuestionType.INPUT_GROUP,
              fields: [
                { id: "mri_date", label: "检查日期(年月日)", type: "text" },
              ],
            },
            {
              id: "epi_aux_2_1_abnormal",
              type: QuestionType.RADIO_WITH_COMPLEX_SUB,
              text: "检查结果是否异常：",
              options: [
                { label: "无", value: 0 },
                {
                  label: "有",
                  value: 1,
                  subQuestions: [
                    {
                      id: "mri_desc",
                      type: QuestionType.TEXTAREA,
                      text: "结果描述：",
                    },
                    {
                      id: "mri_lesion",
                      type: QuestionType.CHECKBOX_WITH_INPUT,
                      text: "癫痫相关病灶性质(可多选)：",
                      options: [
                        { label: "软化灶", value: 1 },
                        { label: "海马硬化", value: 2 },
                        { label: "皮质发育不良", value: 3 },
                        { label: "肿瘤", value: 4 },
                        { label: "灰质异位", value: 5 },
                        { label: "脑血管", value: 6 },
                        { label: "出血灶", value: 7 },
                        { label: "瘢痕", value: 8 },
                        {
                          label: "其他",
                          value: 9,
                          requiresInput: true,
                          inputPlaceholder: "具体描述",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      required: true,
    },
    {
      id: "epi_aux_2_2",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "9-2-2 是否有其他影像学检查：",
      options: [
        { label: "无", value: 0 },
        { label: "头颅 CT", value: 1 },
        { label: "PET-CT", value: 2 },
        { label: "PET-MRI", value: 3 },
      ],
      required: true,
    },
    {
      id: "epi_aux_2_2_details",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "（若选有其他影像学检查）检查结果是否异常：",
      dependsOn: { questionId: "epi_aux_2_2", value: 1 }, // Note: Needs complex condition logic in real engine, simplifying for schema delivery
      options: [
        { label: "无", value: 0 },
        {
          label: "有",
          value: 1,
          subQuestions: [
            {
              id: "other_img_abnormal_details",
              type: QuestionType.INPUT_GROUP,
              fields: [
                { id: "abnormal_site", label: "异常部位", type: "text" },
                { id: "abnormal_desc", label: "异常情况描述", type: "text" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const scale_epilepsy_crf_v1_v3 = {
  scaleId: "epilepsy_crf_v1_v3",
  title: "癫痫随访报告表 - 孕期随访 (V1-V3通用)",
  description: "适用于孕 12、24、36 周末的常规随访，重点追踪发作频率与药物浓度。",
  questions: [
    {
      id: "epi_v_status",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "目前妊娠情况：",
      options: [
        {
          label: "孕中", value: 1,
          subQuestions: [{ id: "preg_weeks", type: QuestionType.INPUT_GROUP, fields: [{ id: "weeks", suffix: "周", type: "number" }] }]
        },
        {
          label: "流产/死胎", value: 2,
          subQuestions: [
            { id: "abort_date", type: QuestionType.INPUT_GROUP, fields: [{ id: "date", label: "时间(年月日)", type: "text" }] },
            { id: "abort_type", type: QuestionType.RADIO_WITH_INPUT, text: "类型与原因", options: [
              { label: "自然流产", value: 1, requiresInput: true, inputPlaceholder: "原因" },
              { label: "人工流产", value: 2, requiresInput: true, inputPlaceholder: "原因" }
            ]},
            { id: "abort_fetus_rel", type: QuestionType.RADIO, text: "是否与胎儿健康相关", options: [{ label: "否", value: 0 }, { label: "是", value: 1 }, { label: "不详", value: 2 }] }
          ]
        }
      ],
      required: true
    },
    // --- 1. 发作情况 ---
    {
      id: "epi_v_sz_total",
      type: QuestionType.INPUT_GROUP,
      text: "1-1 上次随访至今癫痫发作总次数：",
      fields: [{ id: "total", suffix: "次", type: "number" }]
    },
    {
      id: "epi_v_sz_gtcs",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "1-2 全面强直阵挛发作 (GTCS)：",
      options: [
        { label: "无", value: 0 },
        {
          label: "有", value: 1,
          subQuestions: [
            { id: "gtcs_count", type: QuestionType.INPUT_GROUP, fields: [{ id: "count", label: "次数", suffix: "次", type: "number" }] },
            { id: "gtcs_duration", type: QuestionType.RADIO, text: "最长持续时间", options: [
              { label: "<1min或数秒", value: 1 }, { label: "<5min", value: 2 }, { label: "5-15min", value: 3 }, { label: "15-30min", value: 4 }, { label: ">30min", value: 5 }
            ]}
          ]
        }
      ]
    },
    {
      id: "epi_v_sz_non_gtcs",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "1-3 非全面强直阵挛发作：",
      options: [
        { label: "无", value: 0 },
        {
          label: "有", value: 1,
          subQuestions: [
            { id: "ngtcs_count", type: QuestionType.INPUT_GROUP, fields: [{ id: "count", label: "次数", suffix: "次", type: "number" }] },
            { id: "ngtcs_aware", type: QuestionType.RADIO, text: "是否伴意识障碍", options: [{ label: "否", value: 0 }, { label: "是", value: 1 }] },
            { id: "ngtcs_duration", type: QuestionType.RADIO, text: "最长持续时间", options: [
              { label: "<1min或数秒", value: 1 }, { label: "<5min", value: 2 }, { label: "5-15min", value: 3 }, { label: "15-30min", value: 4 }, { label: ">30min", value: 5 }
            ]}
          ]
        }
      ]
    },
    // --- 2. 用药调整 ---
    {
      id: "epi_v_med_adj",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "2-2 抗癫痫发作药物较上次随访是否调整：",
      options: [
        { label: "否", value: 0 },
        { label: "是", value: 1, requiresInput: true, inputPlaceholder: "具体调整情况" }
      ]
    },
    // --- 5. 检查报告 ---
    {
      id: "epi_v_lab",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "5. 抗癫痫药物浓度结果：",
      options: [
        { label: "未测", value: 0 },
        {
          label: "已测", value: 1,
          subQuestions: [
            { id: "lab_details", type: QuestionType.INPUT_GROUP, fields: [
              { id: "date", label: "采集时间", type: "text", placeholder: "年月日" },
              { id: "drug_name", label: "药物名称", type: "text" },
              { id: "dose", label: "采集时服用剂量", suffix: "mg/d", type: "number" },
              { id: "concentration", label: "谷浓度", type: "text" }
            ]}
          ]
        }
      ]
    }
  ]
};

export const scale_epilepsy_crf_v4 = {
  scaleId: "epilepsy_crf_v4",
  title: "癫痫随访报告表 - 产后随访 (V4)",
  description: "记录生产信息、新生儿健康信息及产妇癫痫状态。",
  questions: [
    // --- 1. 生产信息 ---
    {
      id: "epi_v4_delivery_1",
      type: QuestionType.INPUT_GROUP,
      text: "1. 生产日期与孕周：",
      fields: [
        { id: "date", label: "生产日期", type: "text", placeholder: "年月日" },
        { id: "weeks", label: "孕周", suffix: "周", type: "number" },
        { id: "days", label: "零", suffix: "天", type: "number" }
      ],
      required: true
    },
    {
      id: "epi_v4_delivery_2",
      type: QuestionType.CHECKBOX,
      text: "分娩特征 (可多选)：",
      options: [
        { label: "早产 (<37周)", value: "premature" },
        { label: "超早产 (<28周)", value: "extreme_premature" },
        { label: "过期产 (>42周)", value: "postterm" }
      ]
    },
    {
      id: "epi_v4_delivery_3",
      type: QuestionType.RADIO,
      text: "妊娠结局：",
      options: [{ label: "活胎", value: 1 }, { label: "死胎", value: 2 }],
      required: true
    },
    {
      id: "epi_v4_delivery_4",
      type: QuestionType.CHECKBOX_WITH_INPUT,
      text: "生产并发症：",
      options: [
        { label: "无", value: "0" },
        { label: "产后出血", value: "1" },
        { label: "羊水栓塞", value: "2" },
        { label: "子宫破裂", value: "3" },
        { label: "其他", value: "4", requiresInput: true, inputPlaceholder: "具体描述" }
      ]
    },
    {
      id: "epi_v4_delivery_5",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "生产方式：",
      options: [
        { label: "顺产", value: 1 },
        { label: "剖宫产", value: 2, requiresInput: true, inputPlaceholder: "原因" },
        { label: "其他", value: 3, requiresInput: true, inputPlaceholder: "具体方式" }
      ],
      required: true
    },
    // --- 2. 新生儿信息 ---
    {
      id: "epi_v4_neo_1",
      type: QuestionType.INPUT_GROUP,
      text: "2. 新生儿基本体征：",
      fields: [
        { id: "weight", label: "体重", suffix: "kg", type: "number" },
        { id: "length", label: "身长", suffix: "cm", type: "number" },
        { id: "head", label: "头围", suffix: "cm", type: "number" }
      ],
      required: true
    },
    {
      id: "epi_v4_neo_2",
      type: QuestionType.RADIO,
      text: "新生儿性别：",
      options: [{ label: "女", value: 1 }, { label: "男", value: 2 }]
    },
    {
      id: "epi_v4_neo_3",
      type: QuestionType.RADIO,
      text: "是否低出生体重 (<2500g)：",
      options: [{ label: "否", value: 0 }, { label: "是", value: 1 }]
    },
    {
      id: "epi_v4_neo_4",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "是否畸形：",
      options: [
        { label: "无", value: 0 },
        { label: "有", value: 1, requiresInput: true, inputPlaceholder: "具体描述" }
      ]
    },
    {
      id: "epi_v4_neo_5",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "Apgar 评分：",
      options: [
        { label: "有", value: 1, requiresInput: true, inputPlaceholder: "填写总分" },
        { label: "不详", value: 2 }
      ]
    },
    {
      id: "epi_v4_neo_6",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "出生时特殊情况处理：",
      options: [
        { label: "无", value: 0 },
        { label: "有", value: 1, requiresInput: true, inputPlaceholder: "具体描述" }
      ]
    }
  ]
};

export const scale_epilepsy_crf_v5 = {
  scaleId: "epilepsy_crf_v5",
  title: "癫痫随访报告表 - 产后随访 (V5) 及 EPDS 量表",
  description: "记录产后后代发育情况、产妇癫痫状态及爱丁堡产后抑郁量表(EPDS)评估。EPDS总分≥9为筛查抑郁症状的临界值。",
  questions: [
    // --- 1. 后代随访 ---
    {
      id: "epi_v5_child_1",
      type: QuestionType.INPUT_GROUP,
      text: "1-1 后代基本发育指标：",
      fields: [
        { id: "age_months", label: "小孩年龄", suffix: "月", type: "number" },
        { id: "height", label: "身高", suffix: "cm", type: "number" },
        { id: "weight", label: "体重", suffix: "kg", type: "number" }
      ],
      required: true
    },
    {
      id: "epi_v5_child_2",
      type: QuestionType.RADIO_WITH_INPUT,
      text: "1-2 后代畸形：",
      options: [
        { label: "无", value: 0 },
        { label: "有", value: 1, requiresInput: true, inputPlaceholder: "具体为" }
      ]
    },
    {
      id: "epi_v5_child_3",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "1-3 后代疾病：",
      options: [
        { label: "无", value: 0 },
        { 
          label: "有", value: 1, 
          subQuestions: [
            { id: "disease_details", type: QuestionType.INPUT_GROUP, fields: [
              { id: "disease_name", label: "具体为", type: "text" },
              { id: "diagnose_date", label: "诊断时间(年月日)", type: "text" }
            ]}
          ] 
        }
      ]
    },
    {
      id: "epi_v5_child_4",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "1-4 是否完成丹佛发展筛查测试：",
      options: [
        { label: "否", value: 0 },
        { 
          label: "是", value: 1, 
          subQuestions: [
            { id: "denver_date", type: QuestionType.INPUT_GROUP, fields: [{ id: "date", label: "检测日期(年月日)", type: "text" }] },
            { id: "denver_abnormal", type: QuestionType.RADIO_WITH_INPUT, text: "是否异常", options: [
              { label: "无", value: 0 }, { label: "有", value: 1, requiresInput: true, inputPlaceholder: "具体为" }
            ]}
          ] 
        }
      ]
    },
    {
      id: "epi_v5_child_5",
      type: QuestionType.RADIO_WITH_COMPLEX_SUB,
      text: "1-5 发育行为评估：",
      options: [
        { label: "未测 (原表无此项，为逻辑闭环补充)", value: 0 },
        {
          label: "已测", value: 1,
          subQuestions: [
            { id: "dev_eval_date", type: QuestionType.INPUT_GROUP, fields: [{ id: "date", label: "检测日期(年月日)", type: "text" }] },
            { id: "dev_eval_abnormal", type: QuestionType.RADIO_WITH_INPUT, text: "是否异常", options: [
              { label: "无", value: 0 }, { label: "有", value: 1, requiresInput: true, inputPlaceholder: "具体为" }
            ]}
          ]
        }
      ]
    },

    // --- 5. 爱丁堡产后抑郁量表(EPDS) ---
    {
      id: "epi_v5_epds_1",
      type: QuestionType.RADIO,
      text: "【EPDS】1. 我能看到事物有趣的一面，并笑得开心。",
      options: [
        { label: "同以前一样 (0分)", value: 0 },
        { label: "没有以前那么多 (1分)", value: 1 },
        { label: "肯定比以前少 (2分)", value: 2 },
        { label: "完全不能 (3分)", value: 3 }
      ],
      required: true
    },
    {
      id: "epi_v5_epds_2",
      type: QuestionType.RADIO,
      text: "【EPDS】2. 我欣然期待未来的一切。",
      options: [
        { label: "同以前一样 (0分)", value: 0 },
        { label: "没有以前那么多 (1分)", value: 1 },
        { label: "肯定比以前少 (2分)", value: 2 },
        { label: "完全不能 (3分)", value: 3 }
      ],
      required: true
    },
    {
      id: "epi_v5_epds_3",
      type: QuestionType.RADIO,
      text: "【EPDS】3. 当事情出错时，我会不必要地责备自己。",
      options: [
        { label: "大部分时候这样 (3分)", value: 3 },
        { label: "有时候这样 (2分)", value: 2 },
        { label: "不经常这样 (1分)", value: 1 },
        { label: "没有这样 (0分)", value: 0 }
      ],
      required: true
    },
    {
      id: "epi_v5_epds_4",
      type: QuestionType.RADIO,
      text: "【EPDS】4. 我无缘无故感到焦虑和担心。",
      options: [
        { label: "一点也没有 (0分)", value: 0 },
        { label: "极少有 (1分)", value: 1 },
        { label: "有时候这样 (2分)", value: 2 },
        { label: "经常这样 (3分)", value: 3 }
      ],
      required: true
    },
    {
      id: "epi_v5_epds_5",
      type: QuestionType.RADIO,
      text: "【EPDS】5. 我无缘无故感到害怕和恐慌。",
      options: [
        { label: "相当多时候这样 (3分)", value: 3 },
        { label: "有时候这样 (2分)", value: 2 },
        { label: "不经常这样 (1分)", value: 1 },
        { label: "一点也没有 (0分)", value: 0 }
      ],
      required: true
    },
    {
      id: "epi_v5_epds_6",
      type: QuestionType.RADIO,
      text: "【EPDS】6. 很多事情冲着我过来，使我透不过气。",
      options: [
        { label: "大多数时候我都不能应付 (3分)", value: 3 },
        { label: "有时候我不能像平时那样应付得好 (2分)", value: 2 },
        { label: "大部分时候我都能像平时那样应付得好 (1分)", value: 1 },
        { label: "我一直能应付得好 (0分)", value: 0 }
      ],
      required: true
    },
    {
      id: "epi_v5_epds_7",
      type: QuestionType.RADIO,
      text: "【EPDS】7. 我很不开心，以致失眠。",
      options: [
        { label: "大部分时候这样 (3分)", value: 3 },
        { label: "有时候这样 (2分)", value: 2 },
        { label: "不经常这样 (1分)", value: 1 },
        { label: "一点也没有 (0分)", value: 0 }
      ],
      required: true
    },
    {
      id: "epi_v5_epds_8",
      type: QuestionType.RADIO,
      text: "【EPDS】8. 我感到难过和悲伤。",
      options: [
        { label: "大部分时候这样 (3分)", value: 3 },
        { label: "相当多时候这样 (2分)", value: 2 },
        { label: "不经常这样 (1分)", value: 1 },
        { label: "一点也没有 (0分)", value: 0 }
      ],
      required: true
    },
    {
      id: "epi_v5_epds_9",
      type: QuestionType.RADIO,
      text: "【EPDS】9. 我不开心到哭。",
      options: [
        { label: "大部分时候这样 (3分)", value: 3 },
        { label: "有时候这样 (2分)", value: 2 },
        { label: "只是偶尔这样 (1分)", value: 1 },
        { label: "没有这样 (0分)", value: 0 }
      ],
      required: true
    },
    {
      id: "epi_v5_epds_10",
      type: QuestionType.RADIO,
      text: "【EPDS】10. 我想过要伤害自己。",
      options: [
        { label: "相当多时候这样 (3分)", value: 3 },
        { label: "有时候这样 (2分)", value: 2 },
        { label: "很少这样 (1分)", value: 1 },
        { label: "没有这样 (0分)", value: 0 }
      ],
      required: true
    }
  ]
};
