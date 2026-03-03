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
