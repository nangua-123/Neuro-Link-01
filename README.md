# 华西脑健康 (Neuro-Link) C端 APP

## 项目介绍
纯 C 端神经专病 AI 智能管理平台。受众为高危人群及确诊患者（AD、癫痫、偏头痛）。
采用 React Mobile Web (H5/PWA) 技术栈，基于 Ant Design Mobile 极简设计风格。

## 已生成文件清单
- `src/index.css`: 全局样式与 Ant Design Mobile 主题覆盖（主色调 #1677FF）。
- `src/configs/constants.ts`: 核心合规协议常量与疾病枚举配置。
- `src/configs/scales.ts`: 动态量表硬编码配置（如 MoCA 极简版）。
- `src/configs/scales/ilae.ts`: 癫痫 ILAE 分类树配置。
- `src/configs/scales/moca_avlt.ts`: 认知障碍 MoCA 与 AVLT 配置。
- `src/configs/scales/cdr.ts`: 认知障碍 CDR 知情者问卷配置。
- `src/interfaces/user.ts`: 用户身份（双轨制）与授权状态 Schema。
- `src/interfaces/chat.ts`: 预问诊聊天消息 Schema。
- `src/interfaces/scale.ts`: 动态量表 JSON Schema 与画钟数据结构。
- `src/interfaces/scaleEngine.ts`: 动态表单渲染引擎 Schema。
- `src/interfaces/manager.ts`: 专病管家核心业务 Schema (ILAE, 头痛日记, CDR)。
- `src/mocks/chat.ts`: 模拟的数字华佗 AI 交互流数据。
- `src/services/envCapture.ts`: 静默环境探针服务（Mock LBS 与气象数据）。
- `src/services/speech.ts`: 底层语音识别服务封装 (Web Speech API)。
- `src/store/index.ts`: Zustand 全局状态管理（含 MOH 防火墙状态）。
- `src/store/recall.ts`: 全局 Recall 熔断总线状态管理。
- `src/components/AuthGuard/index.tsx`: 场景化合规路由守卫 (JIT Route Guard)。
- `src/components/AgreementPopup/index.tsx`: 页面内 JIT 拦截协议弹窗。
- `src/components/CanvasClock/index.tsx`: 独立封装的科研级画钟组件。
- `src/components/DynamicScale/index.tsx`: 动态量表渲染引擎。
- `src/components/RecallOverlay/types.ts`: 全局 Recall 熔断总线高阶组件 Props 定义。
- `src/components/RecallOverlay/index.tsx`: 全局最高优先级预警组件（全屏红色熔断）。
- `src/router/index.tsx`: 全局路由骨架（接入 AuthGuard 与 RequireAuth）。
- `src/views/Login/index.tsx`: 极简准入登录页（支持双轨身份选择）。
- `src/views/Layout/index.tsx`: 底部 TabBar 导航布局。
- `src/views/Home/index.tsx`: 数字华佗预问诊模块（拟人化聊天流）。
- `src/views/Home/components/SymptomCard.tsx`: 初步症状提取图谱卡片与 1 元转化钩子。
- `src/views/Assessment/index.tsx`: 深度医学测评页（含前置动态补录与动态量表引擎）。
- `src/views/Manager/index.tsx`: 居家管家 Tab 占位（根据疾病标签动态渲染）。
- `src/views/Manager/Epilepsy/index.tsx`: 癫痫【护航管家】视图（含紧急录像与熔断触发）。
- `src/views/Manager/Migraine/index.tsx`: 偏头痛【头痛管家】视图（含头痛日记与 MOH 防火墙）。
- `src/views/Mall/index.tsx`: 商城 Tab 占位。
- `src/views/Profile/index.tsx`: 档案 Tab 占位。
- `src/App.tsx`: 挂载 RouterProvider 与 RecallOverlay。

## 依赖说明
- `react`, `react-dom`: React 核心库。
- `react-router-dom`: 路由管理。
- `zustand`: 状态管理。
- `antd-mobile`, `antd-mobile-icons`: UI 组件库。
- `tailwindcss`: 样式引擎。

## Changelog
### v0.9.1 (Phase 5.3 Migraine Manager Dashboard & MOH Firewall)
- 重构 `src/views/Manager/Migraine/index.tsx`，实现偏头痛管家核心业务面板：
  - **Status Overview & MOH Firewall**：从 `useAppStore` 读取 `painkillerDays`。当达到 15 天红线时，看板呈现极强的红色警示状态，警告极易诱发 MOH；未达红线时显示安全的紫色系状态。
  - **Daily Actions**：实现“记录今日头痛”的快捷入口（Mock），以及独立的“服用止痛药”打卡卡片。点击打卡实时触发 MOH 防火墙预警。
  - **Medical Services**：实现“CGRP 靶向药申请评估”和“历史头痛日历”的常驻入口。
  - 保持阿福式的克制与高级感，大量使用大圆角、柔和阴影与渐变背景。

### v0.9.0 (Phase 5.2 Epilepsy Manager Dashboard)
- 重构 `src/views/Manager/Epilepsy/index.tsx`，实现癫痫护航管家核心业务面板：
  - **Status Overview**：实现持续无发作天数（支持 Tailwind 静态类名映射的动态预警色）、用药依从率。
  - **Daily Actions**：实现大卡片式分时服药打卡（早/中/晚）与基于 CRF 的随访倒计时提醒。
  - **Medical Services**：实现专病医生咨询与发作日记趋势回顾的常驻入口。
  - **Emergency Recall**：将紧急录像重构为全局最高优先级的红色悬浮球，完美融合日常业务与极端医疗安全底线。

### v0.8.0 (Phase 5.1 Report Conversion & JIT Compliance)
- 新增 `src/components/AgreementModal.tsx`，实现《三方电子联合数据授权协议》的 UI 与交互。
- 更新 `src/store/index.ts`，引入 `hasSignedAgreement` 状态与 `signAgreement` 方法，用于全局合规状态管理。
- 重构 `src/views/Report/index.tsx`，实现转化流转与 JIT (Just-In-Time) 拦截：
  - 底部 CTA 按钮绑定点击事件，未授权时弹出 `AgreementModal`。
  - 授权通过后，安全放行并路由至 `/manager`。
- 重构 `src/views/Manager/index.tsx`，实现居家管家区的基础多病种分发机制：
  - 引入强路由守卫：未签署协议直接重定向至首页 (`/`)。
  - 动态业务分发：根据 `selectedDiseaseTag` 渲染 `CognitiveManager`、`EpilepsyManager` 或 `MigraineManager`。
  - 采用全新的 UI 规范实现各专病管家的骨架占位（包含专属渐变卡片与功能入口）。

### v0.7.0 (Phase 4.6 Multi-disease Scoring Engine & Dynamic Report)
- 重构 `src/utils/scoring.ts`，实现多病种计分逻辑分发引擎 (`calculateReport`)。
  - **认知 (AD)**：保留原有 CDR 逻辑，输出多维能力图谱与风险预警。
  - **癫痫 (Epilepsy)**：解析 V0 基线量表（发作频次、时长、用药依从性），生成癫痫专属的综合风险定级和多维特征。
  - **偏头痛 (Migraine)**：解析 MIDAS 初筛数据，生成偏头痛特有的失能评级和维度表现。
- 重构 `src/views/Report/index.tsx`，实现动态专病档案交付。
  - 动态渲染报告来源副标题 (`reportSource`)。
  - 动态渲染底部核心行动号召按钮文案 (`ctaText`)，实现向“认知护航管家”、“癫痫护航管家”或“偏头痛管家”的精准引流。
  - 完美承接来自 Assessment 测评流的 `diseaseTag` 与 `payload`。

### v0.6.0 (Phase 4.5 Assessment Dynamic Routing)
- 重构 `src/views/Assessment/index.tsx`，实现多病种动态路由策略。
- 引入 `DiseaseTag` 枚举，从 Zustand 全局 Store (`useAppStore`) 中读取 `selectedDiseaseTag`。
- 动态加载不同的测评步骤流：
  - **认知衰退 (`DiseaseTag.AD` 或默认为空时)**：加载 CDR 问卷的 3 个步骤，顶部副标题显示“CDR 知情者评估”。
  - **癫痫 (`DiseaseTag.EPILEPSY`)**：加载癫痫基线期 V0 的 3 个步骤，顶部副标题显示“华西癫痫基线期 (V0) 档案”。
  - **偏头痛 (`DiseaseTag.MIGRAINE`)**：加载 Mock 的 MIDAS 初筛步骤，顶部副标题显示“偏头痛 MIDAS 初筛”。
- 保留现有的 `framer-motion` 丝滑推拉动画以及顶部动态进度条。
- 在最后一步点击“提交评估”时，将当前的 `diseaseTag` 一起封装进 Payload 中，通过 `navigate('/report', { state: { payload, diseaseTag } })` 传递给报告页，为下一步重构多病种计分引擎做准备。

### v0.5.9 (Phase 3 Epilepsy CRF Ultimate Batch 5)
- 彻底完结华西癫痫专病底座搭建，向 `src/configs/scales/epilepsy.ts` 追加最终的【第五批次：产后随访 V5 与爱丁堡产后抑郁量表 EPDS】。
- 完整实现 EPDS 抑郁量表的正反交替计分逻辑映射，严格遵循 0-3 赋分因题而异的医学红线。
- 补齐后代随访发育指标、畸形、疾病及丹佛发展筛查测试等复杂嵌套题型。

### v0.5.8 (Phase 3 Medical Report & Mock Scoring Engine)
- 开发 `src/utils/scoring.ts`：实现简易的 Mock 计分引擎，接收 Assessment Payload 并生成结构化的评分结果（综合风险定级、多维能力得分、高危症状提取）。
- 开发 `src/views/Report/index.tsx`：实现纯 C 端高保真医学报告页。
  - **专病档案质感**：顶部采用深邃科技蓝渐变背景，叠加 "NEURO-PASS" 绝密医疗档案水印。
  - **数据可视化**：使用平滑的进度条动画直观展示患者在记忆力、定向力、社会活动等维度的受损情况。
  - **高亮警示**：提取高危症状并以醒目的红色/橙色 Tag 在核心区予以警告。
  - **商业化闭环钩子**：底部配置强力的 Call to Action 悬浮胶囊按钮，引导用户“开启 24 小时认知护航管家”或“获取深度解读报告”。
- 修改 `src/views/Assessment/index.tsx`：在测评完成后，携带 Payload 路由跳转至 `/report` 页面。
- 重构 `src/views/Assessment/index.tsx`，实现优雅的 C 端沉浸式多步测评流（Wizard 模式）。
- 引入 `framer-motion` 实现平滑的左右推拉过渡动画。
- 增加顶部精美进度指示器，实时感知答题进度。
- 维护全局 `assessmentData` 状态，无缝串联 CDR 知情者问卷的三个篇章（记忆篇、定向与判断篇、社会与生活自理篇）。

### v0.5.6 (Phase 3 Dynamic Scale Engine Ultimate Data Injection)
- 彻底修复 `src/configs/scales/cdr.ts` 数据截断问题，完整恢复并导出所有知情者问卷数据：
  - `scale_cdr_informant_memory`：补齐缺失的 9-15 题，包含 `input_group` 出生年月/省市和 `textarea` 工作/退休原因。
  - `scale_cdr_informant_orientation_judgment`：保留定向 8 题 + 判断 6 题。
  - 新增 `scale_cdr_informant_social_home_care`：追加社会事务、家务与爱好、个人生活自理的完整数据。
- 严格遵循医疗系统 CRF 量表不可篡改的 P0 级红线，确保数据 100% 完整无省略。

### v0.5.5 (Phase 3 Dynamic Scale Engine Hotfix)
- 修复 `src/configs/scales/cdr.ts` 数据丢失问题，完整恢复并导出 `scale_cdr_informant_memory`（记忆篇）。
- 修复 `AssessmentEngine` 渲染器残缺问题：
  - 新增 `QuestionType.TEXTAREA` 渲染逻辑，支持多行主观简答题。
  - 补充 `QuestionType.RADIO_WITH_NESTED_INPUT` 支持，实现单选选项下嵌套多个输入框的动态渲染。

### v0.5.4 (Phase 3 Dynamic Scale Data Batch 2)
- 严格按照 1:1 像素级复刻精神，向 `src/configs/scales/cdr.ts` 追加【定向篇】与【判断篇】的真实医疗量表数据。
- 升级 `AssessmentEngine` 动态渲染引擎：
  - 完美兼容并渲染 `radio_with_input` 题型（如判断力第 4 题的“具体原因”填空）。
  - 增强 Schema 字段的向下兼容性，支持 `text` 作为 `title` 的别名，支持 `scaleId` 作为 `id` 的别名。

### v0.5.3 (Phase 3 Pre-consultation UI Refinement)
- 彻底重构预问诊模块 (`src/views/Home/index.tsx`)：
  - **状态机驱动对话**：引入 `DIALOGUE_TREE` 数据层，完整实现认知衰退、癫痫、偏头痛三大专病的 6 轮阶梯式问诊逻辑。
  - **悬浮药丸输入舱 (Floating Pill)**：废弃臃肿的底部输入区，改为悬浮在底部的精致胶囊条，完美解决间距问题，释放对话视口。
  - **多模态打断与回归**：支持语音、键盘、拍照输入切换。实现用户自定义输入打断当前流程，AI 柔性兜底并引导回归当前问诊节点的逻辑。
  - **动态风险提示**：根据问诊分支动态生成高危风险提示（如 AD 风险、持续状态风险、MOH 风险），并在最终转化卡片中高亮展示。

### v0.5.2 (Phase 2 AI Pre-consultation UI Refactor Planning)
- 规划全新沉浸式 AI 预问诊视图 (`src/views/Home/index.tsx`)：
  - **沉浸式管家氛围**：顶部悬浮 AI 状态感知栏（呼吸光晕头像与“正在聆听”状态），全局浅色弥散渐变背景。
  - **温情对话气泡**：AI 气泡采用极淡蓝紫底色与微小阴影，用户气泡采用高对比度主色调，区分明显且专业克制。
  - **极简多模态输入区**：底部悬浮毛玻璃操作台，主推巨大的、带渐变发光阴影的“语音录入”胶囊/圆形按钮，文字输入降级为辅助入口。
  - **高价值转化卡片**：重构《初步症状提取图谱》，采用“加密医疗档案”视觉风格（精致描边、高亮 Tag 标签），底部配置极具诱惑力的发光渐变“1 元解锁”超级胶囊按钮。

### v0.5.1 (Phase 1 UI Refactor Planning)
- 规划全局 App Shell (`src/views/Layout/index.tsx`)：设计高级毛玻璃模糊效果（backdrop-blur）的底部导航栏。
- 规划全新商业级首页 (`src/views/Home/index.tsx`)：
  - 顶部管家式问候与柔和渐变氛围。
  - 黄金转化区：设计带有发光阴影与胶囊按钮的“1 元深度早筛”入口卡片。
  - 动态状态卡片：设计 VIP 登机牌样式的 Neuro-Pass 专属就诊码卡片（高危标签态）。
  - 金刚区 (Grid)：规划精致的圆形/圆角快捷入口图标区域。

### v0.4.4 (Phase 4.4 Architecture Planning)
- 落地底层硬件服务 `speech.ts`，基于 Web Speech API 支持语音复述测试。
- 落地核心业务配置抽离 (`configs/scales/`)，将华西金标准（ILAE, MoCA, CDR）转化为 JSON Schema。
- 落地动态表单渲染引擎 Schema (`interfaces/scaleEngine.ts`)，设计跳题逻辑与双端流转契约。

### v0.4.3 (Phase 4.3)
- 开发静默环境探针服务 `envCapture.ts`，模拟抓取 LBS、气压、温湿度等环境数据。
- 开发偏头痛【头痛管家】视图 (`Manager/Migraine`)，采用极度现代、精致的 UI 设计。
- 实现【又头痛了】极简记录抽屉，支持疼痛等级滑动与快捷诱因标签，保存时异步抓取环境数据。
- 实现【服药打卡】与 MOH 药物防火墙：当本月服药天数达到 15 天时，强制弹出无法关闭的警告 Modal，锁死服药记录并提示就医。

### v0.4.2 (Phase 4.2)
- 开发 `RecallOverlay` 全局高阶组件，实现极具压迫感的全屏警示红 UI，并挂载至 `App.tsx`。
- 开发癫痫【护航管家】视图 (`Manager/Epilepsy`)，实现最大红色悬浮按钮【紧急录像】。
- 实现极简救命级防呆交互：点击紧急录像跳过所有弹窗直接模拟录像，录像结束后强制弹出必选项卡片。
- 打通红线逻辑：若家属选择发作“超过5分钟”，瞬间触发全局红色报警总线，全屏拦截并联动 120。

### v0.4.1 (Phase 4.1 Architecture)
- 设计全局 Recall 熔断总线状态 (`store/recall.ts`)，定义最高优先级报警机制。
- 定义专病管家核心业务 Schema (`interfaces/manager.ts`)，包含癫痫 ILAE 分类、偏头痛日记环境数据、认知障碍 CDR 规则树。
- 定义全局高阶组件 Props (`components/RecallOverlay/types.ts`)，规划全屏红色预警与联动 120 的接口契约。

### v0.3.1 (Phase 3.1)
- 定义基于 JSON Schema 的动态表单结构 (`interfaces/scale.ts`)。
- 硬编码 AD MoCA 测试极简版配置 (`configs/scales.ts`)。
- 开发硬核前端组件 `CanvasClock`，支持触摸事件监听，捕获笔触坐标与停顿毫秒数。
- 开发动态量表引擎 `DynamicScale`，根据 Schema 动态渲染 UI。
- 新增 `/assessment` 测评路由，实现“前置动态补录”弹窗强制拦截逻辑，填完后方可渲染量表。
- 打通 1 元支付成功后跳转至 `/assessment` 的完整闭环。

### v0.2.0 (Phase 2)
- 开发极简登录页 (`/login`)，实现手机号验证码模拟登录与双轨身份（患者/家属）选择。
- 更新全局路由，增加 `RequireAuth` 登录态校验，未登录重定向至 `/login`。
- 开发“数字华佗”预问诊对话模块，实现拟人化聊天流 UI。
- 渲染《初步症状提取图谱》卡片，并埋入“1 元支付”转化钩子。
- 完善 JIT 拦截机制：点击支付时动态呼出 `AgreementPopup` 协议抽屉，签署后方可放行。

### v0.1.1 (Phase 1 Refined)
- 搭建高内聚解耦底层目录结构 (`configs`, `interfaces`, `components`, `store`, `views`, `router`)。
- 配置带有 `#1677FF` 主色调的 Ant Design Mobile 全局主题。
- 初始化支持双轨身份（患者/家属）的全局 Zustand Store。
- 实现包含《三方电子联合数据授权协议》JIT 拦截验证的全局路由骨架。
- 预问诊（Home）全量开放，居家管家、商城、档案模块接入 `AuthGuard` 强制拦截。
