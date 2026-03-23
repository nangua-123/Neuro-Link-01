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
- `src/interfaces/manager_dashboard.ts`: [新增] 趋势洞察与 IoT 体征数据的契约。
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
- `src/components/Charts/TrendBarChart.tsx`: [新增] 基于 recharts 的柱状趋势图。
- `src/components/Charts/VitalsGrid.tsx`: [新增] IoT 体征数据网格。
- `src/components/IoTStatusCard/index.tsx`: [新增] 穿戴设备连接状态与快捷操作卡片。
- `src/router/index.tsx`: 全局路由骨架（接入 AuthGuard 与 RequireAuth）。
- `src/views/Login/index.tsx`: 极简准入登录页（支持双轨身份选择）。
- `src/views/Layout/index.tsx`: 底部 TabBar 导航布局。
- `src/views/Home/index.tsx`: 数字华佗预问诊模块（拟人化聊天流）。
- `src/views/Home/components/SymptomCard.tsx`: 初步症状提取图谱卡片与 1 元转化钩子。
- `src/views/Assessment/index.tsx`: 深度医学测评页（含前置动态补录与动态量表引擎）。
- `src/views/Manager/index.tsx`: 居家管家 Tab 占位（根据疾病标签动态渲染）。
- `src/views/Manager/Epilepsy/index.tsx`: [重构] 癫痫【护航管家】视图（统一使用 ServicesAndTools）。
- `src/views/Manager/Migraine/index.tsx`: [重构] 偏头痛【头痛管家】视图（统一使用 ServicesAndTools）。
- `src/views/Manager/Cognitive/index.tsx`: [重构] 认知【护航管家】视图（统一使用 ServicesAndTools）。
- `src/views/Manager/Default/index.tsx`: [重构] 默认【健康管家】视图（统一使用 ServicesAndTools）。
- `src/components/ServicesAndTools/index.tsx`: [新增] 统一的医疗服务与工具箱组件，根据 DiseaseTag 动态渲染专属服务。
- `src/views/Mall/index.tsx`: 商城 Tab 占位。
- `src/views/Profile/index.tsx`: 档案 Tab 占位。
- `src/App.tsx`: 挂载 RouterProvider 与 RecallOverlay。

## 依赖说明
- `react`, `react-dom`: React 核心库。
- `react-router-dom`: 路由管理。
- `zustand`: 状态管理。
- `antd-mobile`, `antd-mobile-icons`: UI 组件库。
- `tailwindcss`: 样式引擎。
- `recharts`: [新增] 数据可视化图表库。

## Changelog
### Batch 24: 居家管家与装备库 UI/UX 深度重构 (Premium UI/UX Refactoring)
- **Objective:** Refactor the UI styles of the "Manager" and "Equipments" pages to align with a modern, clean, and premium aesthetic, eliminating deviations from the established system instructions.
- **Key Changes:**
  - **Background and Aura:** Introduced a subtle blue-gray background (`bg-[#F4F7FB]`) with a soft blue gradient halo effect (`blur-3xl`) across both views to create a premium, breathable atmosphere.
  - **Hero Sections:** Replaced standard headers with prominent, gradient-based "Hero" sections. `ManagerView` now features a personalized greeting, while `EquipmentsView` highlights the "soft-hardware integration" value proposition.
  - **Card Styling:** Updated all cards (`ClinicReportCard`, `DailyTaskManager`, `VitalsGrid`, `UniversalToolbox`, and Equipment product cards) to use large rounded corners (`rounded-[24px]` or `rounded-[32px]`), soft diffused shadows (`shadow-[0_4px_20px_rgba(0,0,0,0.03)]`), and eliminated harsh borders.
  - **`ClinicReportCard` Redesign:** Transformed into a premium, full-gradient card (`bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]`) with glassmorphism stats, reinforcing the "全景数字病历" concept.
  - **Equipment Cards:** Replaced static product images with dynamic CSS gradients and decorative glow effects. Enhanced typography and spacing for a more commercial, high-end presentation.
  - **Action Buttons:** Restyled primary action buttons with high contrast, gradient effects, and prominent icons (e.g., `ChevronRight`, `CheckCircle2`) to improve click-through rates and visual hierarchy.
  - **Spacing and Typography:** Significantly increased whitespace ("breathing room") and adjusted font sizes/weights to enhance readability and the overall premium feel, strictly adhering to the C-end consumer medical design paradigm.

### Batch 23: 全景数字病历重构 (Panoramic Digital Medical Record)
- **Objective:** Consolidate fragmented analysis and reporting modules into a unified, medically rigorous "全景数字病历" (Neuro-Dossier) for both C-end users and B-end doctors.
- **Key Changes:**
  - **Unified Reporting System:** Removed old fragmented reports (`TriggerAnalysis`, `VisitSummary`, `ProgressionAnalysis`, `CaregiverReport`, `AIHealthBriefing`) and introduced a single, comprehensive `/clinic-report` route.
  - **ClinicReportView:** Developed a new tabbed interface presenting an AI Executive Summary alongside raw, objective data across multiple dimensions (History, Clinical Events, Medications, IoT Vitals, Standardized Scales).
  - **B-End Integration (QR Code):** Implemented a prominent QR code modal within the report summary, allowing doctors to scan and access the full patient dossier on their workstations.
  - **ManagerView Refinement:** Replaced the `AIHealthBriefing` with a new, professional `ClinicReportCard` and removed the "Premium Services" section to streamline the dashboard.
  - **Profile Navigation:** Updated quick action grids and family management links in `ProfileView` to direct users to the new "全景档案" (Panoramic Archive).
  - **Medical-Grade UI/UX:** Shifted the aesthetic of the report section towards a clean, high-density, high-contrast "medical-grade" design, distinct from the softer "AI Butler" style used elsewhere.

### Batch 22: Equipment Module Commercialization & Banner Unification
- **Objective:** Elevate the commercial appeal of the Equipment module and unify the visual presentation of top-level banners across the application.
- **Key Changes:**
  - **Visual Overhaul:** Replaced broken external image URLs with high-quality CSS gradients and Lucide icons in both `EquipmentsView` and `EquipmentDetailView` to ensure a premium, commercial-grade user experience.
  - **Banner Unification:** Refactored `AIHealthBriefing` in `ManagerView` to use the `HeroBanner` component, ensuring visual consistency across the application's top-level modules.
  - **Component Enhancements:** Updated `HeroBanner` to accept `children` and `className` props for greater flexibility.

### Batch 9: 生产环境准备与性能优化 (Production Ready & Optimization)
- **Objective:** Improve application performance, bundle size, and resilience in poor network conditions.
- **Key Changes:**
  - Implemented **Lazy Loading** and **Code Splitting** for all views in `src/router/index.tsx` using `React.lazy` and `Suspense`.
  - Added `ProfileSkeleton` and `MallSkeleton` components to improve the perceived loading speed and provide a better UX during data fetching.
  - Created `OfflineBoundary` component to detect network status (`navigator.onLine`) and display a graceful fallback UI when the user is offline.
  - Wrapped the entire application with `ErrorBoundary` in `src/main.tsx` to catch unhandled React errors and prevent white screens.

### Batch 21: Paywall Refactoring & Global Layout Standardization
- **Objective:** Implement a flat display of premium services, enhance the Paywall component for direct equipment routing, and strictly enforce global layout and scrolling rules.
- **Key Changes:**
  - **Flat Premium Services (No "Thousand Faces"):** Refactored `ManagerView` to display all 4 premium services (Trigger Analysis, Visit Summary, Progression Analysis, Family Care) universally, regardless of the selected disease tag. Locked services are visually dimmed.
  - **Paywall Enhancement:** Updated the `Paywall` component to accept an `equipmentId` parameter, allowing direct redirection to specific equipment detail pages (e.g., `/equipments/eeg_patch_24h`) when a user attempts to access a locked feature.
  - **Deep Report Interception:** Applied the updated `Paywall` logic across all deep report views (`TriggerAnalysisView`, `VisitSummaryView`, `ProgressionAnalysisView`, `CaregiverReportView`) to ensure un-unlocked users are correctly intercepted and guided to the relevant hardware purchase.
  - **Global UI/UX Layout Fixes:** 
    - Eradicated the use of `min-h-screen` and `h-[100dvh]` across child views (`TriggerAnalysisView`, `VisitSummaryView`, `ProgressionAnalysisView`, `CaregiverReportView`, `AssessmentView`) to prevent layout stretching and scrolling calculation errors.
    - Removed nested `overflow-y-auto` containers in `HomeView`, delegating scrolling entirely to the global `Layout` component (Single Scroll Context).
    - Adjusted floating element bottom spacing in `HomeView` to perfectly align with the `Layout`'s safe area and TabBar padding, eliminating excessive white space.

### Batch 20: Equipment Purchase Flow & Paywall Integration
- **Objective:** Implement the equipment purchase flow and integrate high-level software privileges into the ManagerView with seamless Paywall redirection.
- **Key Changes:**
  - **Equipment Catalog & Detail:** Refactored `EquipmentsView` to act as a catalog and created `EquipmentDetailView` for detailed information, JIT agreement, and purchase logic.
  - **Paywall Refinement:** Enhanced `Paywall` component to accept a `targetPath` prop, redirecting users to specific equipment pages (e.g., `/equipments/eeg_patch_24h`) based on the locked feature and disease tag.
  - **ManagerView Enhancements:** Added a "Premium Services" section to `ManagerView`, displaying high-level privileges (locked/unlocked) and linking to respective analysis views.
  - **Dynamic Routing:** Updated `TriggerAnalysisView`, `VisitSummaryView`, `ProgressionAnalysisView`, and `CaregiverReportView` to use dynamic `targetPath` in Paywall based on `selectedDiseaseTag`.
  - **UI/UX Consistency:** Ensured all new views and components adhere to the project's design guidelines (soft colors, gradients, rounded corners).
- **Objective:** Refine the device management experience by consolidating functionalities into a modal and removing standalone pages.
- **Key Changes:**
  - Deprecated the independent `/device` route and removed `DeviceManagement` and `Device` views.
  - Integrated `DeviceManagerModal` into `IoTDashboardCard` and `ProfileView`.
  - Updated navigation flows in `DeviceAuthView`, `DeviceConnectView`, `MallView`, and `IoTStatusCard` to redirect to `/profile` instead of `/device`.
  - Added a "Settings" button to the `IoTDashboardCard` to open the `DeviceManagerModal`.
  - Ensured seamless user flow for connecting, viewing status, and disconnecting devices.

### Batch 18: Diary Module Separation (Independent Modules)
- **Scope**: `src/views/Diary/index.tsx`, `src/components/ServiceMatrix/index.tsx`
- **Action**: 
  - Completely removed the tab switcher from the Diary view. 
  - Split the generic "Diary" entry in the Service Matrix into "Seizure Diary" and "Migraine Diary" to ensure they act as independent modules.
- **Outcome**: The Seizure Diary and Migraine Diary now function as completely independent modules. Users navigating to either diary will no longer see a tab switcher, providing a more focused and immersive experience that aligns with the user's explicit intent.

### Batch 17: 全局主色调规范化重构 (Tech Blue)
- **视觉红线对齐**:
  - 彻底移除了全站泛滥的 `indigo`（靛蓝）、`violet`（紫罗兰）、`purple`（紫色）及 `#5470FF` 等偏紫色调。
  - 将全局主色调严格统一为极具信任感的科技蓝（Tech Blue，近似 `blue-600` / `#2563eb` / `#1677FF`）。
  - 批量重构了所有浅色弥散背景（`bg-blue-50`）、发光阴影（`rgba(37,99,235,...)`）以及渐变色（`from-blue-500 to-blue-600`），确保 UI/UX 规范的一致性与医疗级产品的专业感。

### Batch 16: 全局核心操作按钮视觉风格极致统一 (UI/UX Consistency)
- **视觉风格统一**:
  - `MedicationsView` & `MedicationSetupModal`: 响应设计规范，将“添加用药计划”与“确定”按钮的样式统一重构为高质感的纯色悬浮风格（`bg-[#5470FF]`）。
  - 统一采用大圆角（`rounded-[20px]`）、精致的同色系弥散阴影（`shadow-[0_8px_24px_rgba(84,112,255,0.25)]`）以及一致的底部安全区留白（`pb-[calc(env(safe-area-inset-bottom)+24px)]`）。
  - 彻底消除了不同页面间按钮的视觉割裂感，提升了 C 端产品的品牌一致性与现代高级感。

### Batch 14: 用药管家 UI/UX 深度优化与状态一致性 (Completed)
- **UI/UX 视觉升级**:
  - `MedicationsView`: 为“今日用药”进度卡片添加了柔和的弥散光晕背景，并优化了进度条的圆角与渐变效果。
  - **任务列表重构**: 优化了用药任务列表的禁用态（已服药状态透明度降低至 70%），移除了已服药按钮的边框与阴影，并调整了未服药按钮的阴影透明度，使其更符合 C 端柔和、现代的设计风格。
  - **极致间距压缩**: 进一步压缩了 `DailyTaskManager` 和 `UniversalToolbox` 内部的 padding（减至 `p-3.5`）和 `space-y` 间距，提升了首页信息密度，消除了大面积无意义留白。
- **功能增强与状态一致性**:
  - `MedicationPlan` 接口扩展：新增 `reminderEnabled` 和 `reminderTime` 字段。
  - `MedicationSetupModal`: 集成用药提醒开关（Switch），支持用户在添加/编辑计划时设置是否开启系统提醒。
  - **全局提醒引擎 (Global Reminder Engine)**: 新增 `useMedicationReminder` 钩子并在 `App.tsx` 顶层挂载。引擎会每分钟轮询全局状态机，当到达设定的 `reminderTime` 时，自动触发系统级弹窗通知（Dialog），并支持在弹窗内“一键打卡”或“稍后提醒”。引入了 `triggeredReminders` 状态以防止重复打扰。
  - **状态机强一致性**: 修复了 `removeMedicationPlan` 函数，确保在删除用药计划时，同步清理 `medicationHistory` 中当天的服药记录，保证基于日期的服药记录追踪绝对准确。

### Phase 11: Task-Driven Engine & Zero State (Current)
- **Batch 12: 用药管理模块深度重构与 UI/UX 升维 (Medication Management Polish)**：
  - **架构与数据流**:
    - `MedicationPlan` 接口升级，支持 `reminderEnabled` 和 `reminderTime` 字段。
    - `Zustand Store` 引入 `medicationHistory` 状态，实现基于日期的历史服药记录追踪。
    - 重构 `toggleMedication` 和 `removeMedicationPlan`，确保历史记录与当前计划的强一致性。
  - **UI/UX 升维 (MedicationsView)**:
    - 引入 `Tabs` 结构，清晰分离“今日服药”与“历史记录”。
    - **今日服药**: 优化进度卡片（柔和光晕、圆角进度条），重构任务列表（优雅的禁用态、柔和的按钮阴影）。
    - **历史记录**: 集成 `recharts` 实现 30 天依从性面积图，列表化展示历史每日服药详情。
  - **配置弹窗重构 (MedicationSetupModal)**:
    - 新增用药提醒开关与时间选择器。
    - 彻底抛弃硬边表单，采用无边界底色输入框（`bg-slate-50`）和焦点态柔和过渡。
    - 优化当前服药清单的展示逻辑，提升信息密度与视觉亲和力。
- **Batch 11: 居家管家 UI/UX 深度优化 (Manager Dashboard Spacing & Typography)**：
  - **层级字体优化**: 统一了 `Manager` 视图中的模块标题大小（`text-[17px]`），并优化了 `DailyTaskManager` 和 `UniversalToolbox` 中的子标题字体大小（`text-[12px]`），建立了清晰且一致的视觉层级。
  - **极致间距压缩**: 针对用户反馈的“部分功能留白太大”问题，大幅缩减了 `DailyTaskManager` 和 `UniversalToolbox` 内部的 padding（从 `p-5` 减至 `p-4`），并压缩了元素间的 `space-y` 间距。
  - **已完成任务高密度重构**: 针对“已完成部分字体和任务之间间距太大”的专属任务，将间距精确压缩至 `8px`（`space-y-2` 配合 `pt-1`），并将已完成任务卡片的 padding 减小（`py-2.5 px-3.5`），图标缩小至 `w-8 h-8`，使其更像紧凑的列表项而非臃肿的卡片，极大地提升了信息密度。
  - **全局呼吸感统一**: 确立了模块间 `space-y-4` (16px) 和标题与内容间 `space-y-2.5` (10px) 的统一间距节奏，完美契合 C 端管家“高密度、高亲和力、紧凑且会呼吸”的设计红线。
- **Batch 10: 健康日记模块深度重构 (Health Diary Sheets Polish)**：
  - **极致 UI 降噪与 C 端管家范式**: 深度优化了 `SeizureDiarySheet`（癫痫发作日记）、`MigraineDiarySheet`（偏头痛闪记）和 `CDRDiarySheet`（AD 行为日记）。严格遵循 C 端柔和、无边界、高密度的设计规范。移除了生硬的边框，采用浅色弥散背景（如 `bg-slate-50/80`）、大圆角（`rounded-[24px]`）和渐变胶囊按钮，大幅提升了输入体验的亲和力与温度感。
  - **动态表单与联动逻辑**: 
    - 癫痫日记：实现了发作类型（全面性/局灶性）与意识障碍开关的动态联动。当持续时间超过 5 分钟时，底部会动态渲染红色的“医疗紧急情况”预警，并与全局 Recall 熔断总线（`triggerRecall`）深度打通。
    - 偏头痛日记：重构了 VAS 疼痛评分的交互，使用 Emoji 和动态颜色（从绿到红）直观反映疼痛程度。
    - AD 照护日记：采用多选标签组记录 BPSD（精神行为症状），并强制要求选择严重程度，确保数据维度的完整性。
  - **状态机持久化**: 将所有日记的提交逻辑与 Zustand Store (`recordSeizureAttack`, `recordMigraineAttack`, `recordCdrDiary`) 完美对接，实现数据的本地持久化，并支持在 `/diary` 历史列表中反向渲染。
- **Batch 9: IoT Dashboard 深度重构 (IoT Dashboard Polish)**：
  - **极致 UI 降噪与动效增强**: 彻底重构了 `IoTDashboardCard` 的未绑定状态（紧凑诱饵态），采用极具科技感的蓝紫渐变背景、弥散光晕（Aura）和毛玻璃效果，并加入了 `framer-motion` 的点击缩放动效。
  - **多设备数据赋能态**: 已绑定状态下，使用 `Swiper` 轮播展示多设备数据。卡片设计严格遵循 C 端管家范式，采用大圆角、柔和阴影和无边界底色，每个核心体征指标（心率、步数、深睡比例等）均配有专属的柔和背景色与图标。
  - **疾病专属预警联动 (Disease-Specific Warnings)**: 深度打通了 IoT 数据与疾病标签的联动逻辑。例如，当用户标签为“癫痫”且深睡比例低于 30% 时，卡片底部会自动渲染“睡眠剥夺预警”；当标签为“偏头痛”且 HRV 偏低时，会触发“压力水平偏高”预警。
  - **设备连接模拟流 (Device Connect Flow)**: 完善了 `/device-connect` 视图，实现了从“寻找设备”到“弹出三方数据授权协议”，再到“同意并绑定”的完整模拟闭环。授权弹窗严格遵循 JIT (Just-In-Time) 拦截策略。
- **Batch 8.3: 居家管家全局架构与功能深度重构 (Manager Dashboard Master Plan)**：
  - **化繁为简，统一生命周期**: 彻底废弃了按“病种”隔离的管家视图，也废弃了评测前后（NEW vs ACTIVE）完全割裂的页面结构。构建了统一的四大核心舱位：AI 简报、今日任务、体征监测、全量工具箱。
  - **AI 简报前置**: 将“可视化记录的数据和总结”提升至页面最高优先级（Module 1），评测后直接透出 AI 综合健康简报与核心指标微件。
  - **行为驱动的工具箱**: 打破病种壁垒，将所有工具按“日常记录”、“测评与报告”、“干预与守护”三大医疗行为重新分类，彻底消除了功能冗余，且评测前后展示完全一致。
  - **极致 UI 降噪**: 严格执行 C 端管家范式，全页面采用浅色弥散背景、Bento 网格布局、大圆角与柔和阴影，彻底消灭了高饱和色块与大面积留白。
- **Batch 5: 商业转化闭环与路由联动 (IoT Conversion Loop)**：
  - **设备接入 UI 统一**: 将 `NewStateView` 中硬编码的设备状态卡片（图一）替换为 `IoTDashboardCard`，统一使用 Swiper 轮播组件展示多设备数据（图二）。
  - **紧凑型诱饵态**: 重构了 `IoTDashboardCard` 的未绑定状态，移除了大面积渐变卡片和多余按钮，改为紧凑的胶囊状入口，严格遵循“不允许大卡片导致大面积留白”的设计红线。
  - **滑动添加设备**: 在已绑定的设备轮播列表末尾，保留了“添加更多设备”的卡片（图三），点击可进入设备绑定流程。
  - 点击“绑定已有设备”精准路由至 `/device-connect`（添加健康数据页），引导用户完成标准化的设备选择与授权流程。
  - 点击“探索华西定制脑电睡眠仪”精准路由至 `/mall`（健康商城），打通“硬带软”的商业变现最终一公里。
  - 完美衔接全局 Zustand 状态机，用户在子页面完成绑定后，首页卡片自动无缝切换为数据赋能态。
- **Batch 4: 居家管家 1+1+N 架构重构 (Manager View Refactor) (已完成)**：
  - **第一层：专属健康控制台 (My Dashboard)**：根据用户状态（首次/二次登录、测评完成度、IoT 设备绑定情况）动态变形，提供个性化数据概览与今日待办。
  - **第二层：IoT 硬件转化引擎 (Hardware Hub)**：新增 `IoTDashboardCard` 模块，专门用于推广和销售智能硬件。未绑定状态采用极具科技感的设计，强调“24h 医疗级监测”价值；已绑定状态展示实时的生命体征数据。
  - **第三层：全量脑健康服务矩阵 (Service Matrix)**：重构 `ServicesAndTools`，采用“Bento Box（便当盒）”网格布局，全量展示所有病种的核心功能。引入“引导态 (Guide)”与“激活态 (Active)”双轨制，未解锁功能通过柔和的视觉引导用户完成前置任务。
  - **跨病种探索拦截**: 当用户在非当前专病模式下点击某个功能时，弹出柔和的模式切换引导弹窗，鼓励用户完成测评以激活专属管家。
  - **破冰引导页重构**: 将 `DefaultManager` 重构为纯粹的“破冰引导页”，包含 AI 问诊和专业量表测评的入口，移除冗余的组件调用。
- **Batch 1: 底层状态机与冷启动破冰 (已完成)**：
  - **状态机引入**: 在 Zustand 中引入 `userStage` ('NEW' | 'ACTIVE' | 'STABLE')，解决冷启动数据错乱问题。
  - **Zero State 设计**: 
    - 认知/癫痫/偏头痛管家新增 `NEW` 状态专属 UI（AI 欢迎语、新手启航任务）。
    - `TrendBarChart` 新增无数据时的“数据采集中”占位态。
  - **UI/UX 统一**: 强化 Glassmorphism（毛玻璃）与 Aura（弥散光晕）设计语言，去除生硬边框。
- **Batch 2: 任务驱动引擎 (已完成)**：
  - **目标**: 将散落的医疗动作（服药、训练、测评）收拢为统一的、时间感知的“今日任务”流。
  - **核心组件**: `DailyTaskManager`，支持按时间段（早/中/晚）动态排序与沉浸式打卡微交互。
  - **数据契约**: 建立统一的 `Task` 模型，通过 Zustand 集中调度。
  - **视图重构**: 认知、癫痫、偏头痛三大管家视图全面接入 `DailyTaskManager`，替换原有的散落干预入口。
- **Batch 3: 闭环反馈与工具箱重构 (已完成)**：
  - **工具箱 Bento 化**: 重构 `MedicalToolbox`，采用现代化的 Bento Box（便当盒）网格布局。通过不同尺寸的卡片建立视觉层级，突出“体检报告与 AI 解读”、“发作日记”等高频核心工具，并优化了动态状态指示器（如“今日已服”、“今日 X 次”）。
  - **AI 智能洞察 (AI Insights)**: 升级 `TrendBarChart` 组件，新增 `aiInsight` 属性。在认知、癫痫、偏头痛三大管家的健康趋势图表下方，动态渲染基于当前数据与用户身份（患者本人/家属）的专属 AI 洞察建议，形成“数据采集 -> 趋势展示 -> AI 建议”的完整闭环。

- **Batch 5: 服务与工具组件大一统 (Services & Tools Refactor)**：
  - **组件合并**: 彻底移除了冗余的 `MedicalServices` 与 `MedicalToolbox` 组件，统一合并为 `ServicesAndTools` 组件。
  - **动态渲染**: `ServicesAndTools` 组件通过接收 `diseaseTag` 属性，动态渲染不同专病的专属服务（如癫痫的“发作日记”、偏头痛的“头痛日历”、认知的“照护日记”等）。
  - **视图重构**: 认知、癫痫、偏头痛、默认四大管家视图全面接入 `ServicesAndTools`，大幅精简了页面代码，提升了组件复用率与维护性。
  - **弹窗重构**: 将 `SeizureCalendar` 与 `MigraineCalendar` 重构为标准的 `Popup` 弹窗组件，统一了交互体验。
  - **类型修复**: 修复了 `DiseaseTag` 枚举值的大小写问题，确保全局类型安全。
- **Batch 7: 居家管家功能深度重构与分析引擎接入 (Manager View Deep Refactor) (已完成)**：
  - **废弃低频占位组件**: 彻底删除了底部的 `ServicesAndTools` 组件，移除了“靶向药评估”、“专家在线复诊”等偏 B 端、低频且对患者无直接价值的占位功能，避免页面功能散落成“大杂烩”。
  - **1+2 核心架构落地**: 将三大专病管家（偏头痛、癫痫、认知）统一重构为“1个核心状态舱 + 2个高内聚业务引擎”的极简架构。
  - **干预引擎 (Intervention Hub)**: 强化 `DailyTaskManager`，将所有需要用户“动手做”的高频动作（如：头痛闪记、服药打卡、脑力训练、暗室舒缓音频）全部收拢至今日待办中，严格受 `userStage` 状态机控制。
  - **智能数据与分析中心 (Data & Analysis Hub)**: 升级 `HealthInsightsBento`，深度整合“数据展示”与“AI 分析”。在图表下方新增全宽的渐变发光 CTA 按钮，精准路由至对应的深度分析报告页（`/feature/trigger-analysis` 诱因图谱分析、`/feature/visit-summary` 就诊一页纸报表、`/feature/progression-analysis` 衰退延缓评估报告）。
  - **UI/UX 极致降噪**: 为 `TrendBarChart` 新增 `className` 透传能力，消除嵌套在 Bento 盒中时的双重内边距与阴影。确保页面无大面积留白，文案全面转向“生活赋能”的管家视角，严格遵循 C 端消费级医疗的柔和、高级视觉规范。

- **Batch 8: 深度分析报告页 (Analysis Reports Implementation) (已完成)**：
  - **独立路由与视图**: 为三大专病分别构建独立的深度分析报告视图，脱离通用的 `FeatureView`，以承载更复杂的图表与业务逻辑。
  - **诱因图谱分析 (`/analysis/trigger`)**: 针对偏头痛，通过雷达图或关系图直观展示睡眠、天气、压力等诱因与发作的相关性，并提供 AI 规避建议。
  - **就诊一页纸报表 (`/analysis/visit-summary`)**: 针对癫痫，设计适合医生快速阅览的卡片式布局，汇总发作频率、最长持续时间、用药依从率等核心指标。
  - **衰退延缓评估报告 (`/analysis/progression`)**: 针对认知障碍，展示认知评分趋势、脑力训练表现，并进行睡眠与认知的交叉分析。
  - **UI/UX 规范**: 严格遵循 C 端消费级医疗的柔和、高级视觉规范，避免大面积留白，采用大圆角、柔和阴影与渐变色彩。

- **Batch 9: 脑力训练与 LBS 安全围栏独立视图 (Brain Training & LBS Fence Implementation) (已完成)**：
  - **独立路由与视图**: 为认知障碍管家的“脑力训练”与“LBS 安全围栏”构建独立的视图，脱离通用的 `FeatureView`。
  - **脑力训练 (`/feature/brain-training`)**: 提供“记忆力强化”、“注意力聚焦”、“反应力敏捷”等模块，展示今日训练进度与历史训练数据图表。
  - **LBS 安全围栏 (`/feature/lbs-fence`)**: 提供基于高精度定位的防走失电子围栏设置，支持活动半径调节与报警联动设置（App 弹窗、短信通知、设备端蜂鸣）。
  - **UI/UX 规范**: 采用极浅弥散渐变背景，结合卡片式布局与毛玻璃效果，提供高级、柔和的 C 端体验。

- **Batch 10: 修复全量脑健康服务矩阵缺失问题 (Service Matrix Bugfix) (已完成)**：
  - **组件补齐**: 实现了 `ServiceMatrix` 组件，采用“Bento Box（便当盒）”网格布局，全量展示所有病种的核心功能（发作日记、智能用药、脑力训练、安全围栏、照护专区）。
  - **双轨制状态**: 引入“引导态 (Guide)”与“激活态 (Active)”双轨制。未解锁功能（如未选择专病）呈现柔和的置灰与发光引导态，点击后弹出模式切换引导弹窗，鼓励用户完成专业量表测评。
  - **视图集成**: 将 `ServiceMatrix` 作为 Layer 3 深度集成至 `ManagerView`，完美填补了“专属健康管家”底部的功能空白，实现了 1+1+N 架构的最终闭环。

- **Batch 11: 开放全量服务体验 (Service Matrix Open Access) (已完成)**：
  - **移除引导态锁定**: 响应用户需求，移除了 `ServiceMatrix` 中未选择专病时的置灰锁定状态。
  - **全量开放体验**: 现在，即使用户处于 Default（未测评）状态，也可以自由点击并体验底部的所有核心功能（发作日记、智能用药、脑力训练、安全围栏、照护专区），降低了用户的探索门槛。

- **Batch 12: 发作日记多病种兼容 (Diary View Multi-Disease Support) (已完成)**：
  - **动态 Tab 切换**: 修复了在未选择专病（Default 态）时，进入“发作日记”只能看到癫痫日记的问题。现在，当用户处于 Default 态时，顶部会渲染一个柔和的毛玻璃 Tab 切换器，允许用户在“癫痫日记”和“偏头痛日记”之间自由切换。
  - **主题平滑过渡**: 切换日记类型时，页面的背景光晕、图标、主色调（紫色/玫瑰色）以及 AI 洞察提示均会进行平滑的过渡动画（`transition-colors duration-500`），提供极致的 C 端体验。
  - **Tailwind 动态类名修复**: 修复了原先使用字符串拼接导致 Tailwind 无法正确打包颜色的问题，改用静态类名映射，确保生产环境样式正常渲染。

- **Batch 13: 专病功能区重构与扁平化设计 (Manager View Flattening) (已完成)**：
  - **移除全局 ServiceMatrix**: 从 `ManagerView` 中移除底部的全量服务矩阵，实现“所见即所得”的扁平化体验。
  - **EpilepsyManager 增强**: 新增扁平化快捷操作区，包含“记录发作”和“今日服药”的大卡片。新增全屏沉浸式“视频记录发作”功能（带倒计时和录制状态）。
  - **MigraineManager 增强**: 新增 Bento 风格快捷操作区，包含“头痛闪记”大卡片，以及“吃止痛药”和“头痛日历”小卡片。
  - **CognitiveManager 增强**: 新增 Bento 风格快捷操作区，包含“开始训练”大卡片，以及“LBS 围栏”和“照护者空间”小卡片。
  - **DefaultManager 增强**: 新增“核心能力预览”模块，向未测评用户展示三大专病的核心功能，引导其进行测评。

### Phase 14: “居家管家”全局扁平化重构 (Unified Manager Refactoring) (已完成)
- **核心痛点**: 当前基于病种 Tag 切换不同管家视图的逻辑过于割裂，增加了用户的点击层级，且无法很好地服务共病患者。
- **重构目标**: 废弃分病种的独立视图，构建一个全局统一的超级看板 (`UnifiedManager`)。
- **场景一：首次进入 (NEW 态)**:
  - 顶部强引导：进行详细的专业量表测评，并承诺输出详细测评报告。
  - 设备引导：引导绑定 IoT 穿戴设备。
  - 全量工具展示：不分病种隐藏，而是按“癫痫、偏头痛、认知”分专区平铺展示所有工具（含测评工具），让用户直观感受平台价值。
- **场景二：后续进入 (ACTIVE 态)**:
  - 模块 1 (顶部)：全局健康洞察（聚合展示发作、用药、训练等所有数据的分析结果与测评报告入口）。
  - 模块 2：今日任务（跨病种聚合的打卡、训练待办）。
  - 模块 3：设备监测核心数据（HRV、睡眠、压力等）。
  - 模块 4 (底部)：分专区的专病工具快捷入口。
- **架构调整**: 删除 `DefaultManager`, `EpilepsyManager`, `MigraineManager`, `CognitiveManager`，统一在 `ManagerView/index.tsx` 中实现上述响应式布局。

### Phase 15: 全链路数据闭环与高阶商业化转化 (Data Loop & Advanced Monetization) (Current)
- **Vitals 模块优化 (VitalsGrid)**:
  - 新增 `VitalsGrid` 组件，替代原有的 `IoTDashboardCard`，提供更直观、高密度的体征数据展示。
  - **核心指标展示**: 采用 2x2 网格布局，集中展示 HRV 变异性、深睡比例、脑电平稳度、今日活动（步数）等关键健康指标。
  - **UI/UX 规范**: 严格遵循 C 端管家设计范式，使用大圆角 (`rounded-[20px]`)、柔和弥散光晕背景 (`blur-2xl opacity-60`)、精致的微阴影与无边界设计。
  - **状态联动**: 顶部新增同步状态栏，根据设备绑定状态（`isBound`）动态切换“实时同步中”与“演示数据”的文案与指示灯，并提供“设备管理”的快捷入口。
- **Batch 2: 装备库与商业化闭环 (Equipment Library & Monetization) (Current)**:
  - **战略升级**: 将原有的“商城 (Mall)”模块全面重构为“专属装备 (Equipments)”库，确立“硬件作为现金牛，高阶软件特权作为价值锚点”的商业模式。
  - **数据结构重构**: 在 Zustand Store 中移除旧版的 `isVip` 和 `isPremium` 状态，新增 `ownedEquipments`（已购设备）、`unlockedPrivileges`（解锁特权）和 `isRweAuthorized`（RWE 数据授权状态）。
  - **UI/UX 升维**: 开发全新的 `EquipmentsView`，采用类似“Apple Store for Medical”的高端极简设计风格。强调硬件的医疗级认证与附赠的高阶软件特权（如复诊一页纸、诱因热力图）。
  - **JIT 合规拦截**: 开发 `JITAgreementModal` 组件。在用户点击购买/绑定设备时，强制拦截并要求签署《三方电子联合数据授权协议》与《知情同意书》，确保 RWE（真实世界数据）收集的绝对合规。
  - **路由重构**: 将 `/mall` 路由重定向至全新的 `EquipmentsView`，并更新底部导航栏的文案与图标。

- **Batch 3: 付费墙重构与商业化闭环 (Paywall Refactoring & Loop Completion) (Upcoming)**:
  - **Paywall 组件重构**: 彻底废弃按月/季订阅的纯软件收费模式，将 `Paywall` 重构为“硬件解锁墙 (Hardware Unlock Wall)”。当用户尝试访问高级功能时，引导其前往“专属装备”库购买对应硬件。
  - **深度分析报告改造**: 更新诱因图谱分析 (`TriggerAnalysis`)、就诊一页纸 (`VisitSummary`)、衰退延缓评估 (`ProgressionAnalysis`) 等视图，将解锁条件从 `isPremium` 替换为 `unlockedPrivileges` 数组中是否包含对应特权 ID。
  - **闭环验证**: 确保从免费工具 -> 触发痛点 -> 遇到硬件解锁墙 -> 购买硬件并签署 JIT 协议 -> 成功解锁高级功能的完整数据流转与 UI 呈现正确无误。
- **重构目标**: 
  1. **数据中台化**: 完善 Zustand Store，将所有零散的 Mock 数据（如任务、体征、日记）统一为全局状态，实现跨页面的实时联动。
  2. **高阶商业化转化 (Premium Upsell)**: 在深度分析报告（如诱因图谱、衰退延缓评估）中，植入“解锁高级 AI 洞察”或“购买华西定制硬件”的付费墙 (Paywall) 交互。
  3. **家庭照护者闭环**: 完善 `ProfileView` 中的家庭成员管理，实现患者与家属账号的绑定模拟，并在家属视角下展示专属的“照护者周报”。

- **Batch 13: 核心系统级业务组件落地 (System-Level Components) (Upcoming)**：
  - **JIT Route Guard (场景化合规路由守卫)**: Implemented `AgreementModal` and `useJITGuard` to intercept core business nodes (payment, device binding) without blocking the initial free experience.
  - **Identity Switching (身份双轨制状态模型)**: Added `IdentitySwitcher` in Profile and integrated `identity` state across views for dynamic first/third-person perspective rendering.
  - **Global Recall Bus (全局熔断总线)**: Designed a global event bus to handle critical medical alerts (e.g., prolonged seizures) with full-screen warnings and emergency contacts.
  - **Dynamic Scale Engine Enhancements (动态量表引擎升级)**: Extended `AssessmentEngine` to support advanced question types including Canvas-based clock drawing and Voice input.

- **Batch 6: 核心服务页面补齐与路由打通 (Service Pages Implementation) (已完成)**：
  - **智能用药管家 (`/medications`)**: 构建全屏用药管理视图，展示今日服药任务与历史依从性统计，复用 `MedicationSetupModal` 进行药物配置。
  - **发作日记 (`/diary`)**: 构建偏头痛与癫痫通用的日记主页，采用日历视图展示历史发作记录，通过 FAB 唤起 `MigraineDiarySheet` 或 `SeizureDiarySheet`。
  - **认知与记忆专区 (`/cdr`)**: 构建 AD 专属照护看板，集成 `CDRDiarySheet` 用于日常 BPSD 记录，并提供入口跳转至动态量表测评引擎。
  - **动态功能页 (`/feature/:id`)**: 新增 `FeatureView`，通过 `featureConfig` 动态渲染不同功能的详情页（如睡眠日志、健康报告、发作频次、依从性报告、LBS 围栏、脑力训练等），支持图表、列表、状态等多种展示形式。
  - **管家视图深度联动**: 更新三大专病管家视图（认知、癫痫、偏头痛），将原本的“敬请期待”占位符替换为真实的路由跳转，直达对应的 `FeatureView`。
  - **个人中心与商城联动**: 更新 `ProfileView` 中的“体检报告”入口，直达 `/feature/health-report`。优化 `MallView` 与 `DeviceView` 的设备绑定与连接流程，实现无缝闭环。

- **Batch 7: 家庭照护者闭环 (Family Caregiver Loop) (已完成)**：
  - **照护对象管理**: 增强 `ProfileView`，在家属视角下展示绑定的照护对象列表，支持多患者无缝切换（联动 Zustand `currentPatientId` 与 `selectedDiseaseTag`）。
  - **模拟绑定流程**: 完善 `FamilyBindingModal`，支持输入专属码或扫码模拟绑定长辈账号，绑定成功后自动切换至家属视角。
  - **家属周报 (`/caregiver-report`)**: 新增专属的“家属周报”视图，聚合展示患者本周的综合健康指数、异常预警次数、活动量趋势以及专病管理概况（用药依从性、日记记录等），并提供 PDF 报告下载入口。
  - **双向确认机制**: 在患者视角的 `ProfileView` 中新增“我的照护者”模块，展示已绑定的家属信息，并提供邀请家属的入口，形成完整的双向照护闭环。

- [x] **Batch 8: 全局走查与体验打磨 (Global Walkthrough & UX Polish) (已完成)**：
  - **图表组件颜色修复**: 修正了 `TrendBarChart` 和 `WaveChart` 中 Recharts 对 Tailwind 颜色类名不兼容的问题，统一替换为标准 Hex 色值，确保生产环境渲染正确。
  - **全局 UI/UX 规范校验**: 走查了所有核心视图（Home, Manager, Profile, Mall, Report 等），确保布局紧凑、无大面积留白。严格执行了 C 端管家范式 UI 规范（毛玻璃效果、弥散渐变背景、大圆角卡片、柔和阴影）。
  - **核心业务流连贯性测试**: 验证了从预问诊 -> 测评 -> 报告 -> 购买 -> 绑定 -> 任务 -> 家属的完整闭环，确保状态流转与 UI 呈现正确无误。
  - **居家管家 (ManagerView) 体验优化**: 彻底移除了深色卡片与大面积留白，重构为极具呼吸感的浅色弥散渐变风格。将横向滚动的健康洞察升级为置顶的“AI 健康简报”卡片。优化了设备绑定流，已绑定时动态展示带有心跳动效的实时体征数据卡片。修复了测评与绑定完成后未正确流转至 ACTIVE 态的数据同步 Bug。

---

## 🚀 待办事项 (To-Do)
- [x] **Batch 25: 居家管家首屏深度重构 (AI Insight Board & Health Summary)**
  - [x] 废弃静态问候语，升级为动态“AI 智能洞察舱”，根据测评状态、疾病标签和身份动态生成高密度洞察文案。
  - [x] 废弃静态“全景数字病历”入口，升级为“AI 阶段健康摘要”白玻拟物卡片，动态提取用药依从性、体征监测、发作控制、脑力训练等核心指标，形成“洞察 -> 任务 -> 沉淀”的业务闭环。
  - [x] 统一背景光晕与弥散渐变
  - [x] 重构 Hero Section 与欢迎语，提升信息密度
  - [x] 卡片大圆角与柔和阴影重构，引入白玻拟物风格 (White Glassmorphism)
  - [x] 装备库商业化视觉升级，缩小卡片高度，提升信息密度
- [x] **Batch 9: 生产环境准备与性能优化 (Production Ready & Optimization)**
  - [x] 路由懒加载 (Lazy Loading) 与代码分割 (Code Splitting)
  - [x] 静态资源预加载与骨架屏 (Skeleton) 覆盖率提升
  - [x] 极端网络环境下的降级体验 (Offline/Error Boundaries)

### v1.1.0 (Phase 6.1 Data Flow & Business Loop Integration)
- **Batch 2: 身份双轨制深度适配 (Dual-Identity Adaptation)**：
  - **癫痫管家 (`EpilepsyManager`)**：读取 `useAppStore` 中的 `identity`。当身份为家属 (`UserIdentity.FAMILY`) 时，动态将标题切换为“长辈癫痫护航管家”，并将紧急录像后的熔断报警文案切换为第三人称视角（“长辈癫痫发作已超过 5 分钟...”）。
  - **偏头痛管家 (`MigraineManager`)**：读取 `identity`。当身份为家属时，动态将标题切换为“长辈偏头痛管家”，将干预按钮文案切换为“记录长辈头痛”、“长辈服用止痛药”，并将 MOH 红色防火墙的警告文案切换为第三人称视角的协助提醒。
  - **设备看板 (`DeviceView`)**：读取 `identity`。当身份为家属时，将夜间持续异常放电的熔断报警文案从“我已安全”切换为“长辈已安全”，并将系统通知文案调整为“系统已自动通知其他紧急联系人”。
- **Batch 1: 全局状态持久化与业务闭环 (State Persistence & Business Loop)**：
  - 在 `src/store/index.ts` 中新增 `medicationStatus`（癫痫服药状态）和 `sleepRating`（认知睡眠评价）状态。
  - 接入 Zustand `persist` 中间件，确保用户打卡数据在本地持久化存储。
  - **认知管家**：打通“复查动态量表”入口，精准路由至 `/assessment?diseaseTag=AD`；“今日脑力训练”接入 Mock 交互。
  - **癫痫管家**：重构“服药打卡”逻辑，直接读取并更新全局 Store；“专家在线复诊”接入 Mock 交互。
  - **偏头痛管家**：重构“服用止痛药”逻辑，点击后更新全局 `painkillerDays` 并触发 Toast 提示；“CGRP 靶向药”入口精准路由至 `/assessment?diseaseTag=Migraine`；“记录今日头痛”与“历史日历”接入 Mock 交互。

### v1.4.0 (Phase 6.3 Manager Dashboard Deep Polish)
- **Batch 1: 全局状态与 Mock 数据深度整合 (State & Data Linkage)**：
  - 将三大管家（认知、癫痫、偏头痛）的图表数据（训练时长、用药依从性、头痛频率）与体征数据（HRV、深度睡眠、脑电稳定性）提取到 Zustand Store 中。
  - 确保设备处于 `isDeviceBound` 状态时，三大管家视图读取统一的动态体征数据。
- **Batch 2: 核心交互闭环与联动逻辑完善 (Interaction Loop)**：
  - **偏头痛管家**：升级“记录今日头痛”为 ActionSheet 交互，用户选择疼痛等级后，动态更新图表数据。
  - **癫痫管家**：服药打卡后，动态计算依从率并更新图表中的“今日”柱状图。
  - **认知管家**：家属视角的“照护微随访（睡眠打分）”完成后，动态联动更新全局体征数据中的“深度睡眠比例”。
- **Batch 3: UI 细节与体验打磨 (UI Polish)**：
  - **加载动画优化 (Staggered Animation)**：为三大管家视图内的各个模块（Overview -> Insights -> Vitals -> Actions）增加了基于 `motion/react` 的阶梯式（Staggered）入场动画，增强页面的呼吸感与高级感。
  - **统一未开放功能提示**：新增 `showComingSoon` 全局工具方法，将目前生硬的 `Toast.show('正在加载...')`（如专家在线复诊、心理支持等）统一替换为更优雅的定制化 Modal 提示，提升 C 端体验。

### v1.5.0 (Phase 7 Profile & Mall Modules)
- **Batch 1: 个人中心重构 (Profile Refactor)**：
  - 引入身份双轨制切换入口，支持在患者本人与家属/照护者之间无缝切换（联动 Zustand Store）。
  - 增加“隐私协议与授权管理”模块，允许用户查看《三方电子联合数据授权协议》详情，并支持撤销授权（撤销后联动触发路由守卫）。
  - 引入 `motion/react` 阶梯式入场动画，提升页面加载时的呼吸感。
- **Batch 2: 商城模块优化 (Mall Enhancement)**：
  - 优化商城 UI，突出医疗级与消费级结合的质感，采用大图、弥散阴影和柔和的卡片设计。
  - 完善订阅与发货的商业化闭环，模拟设备购买与绑定流程。
  - 点击“立即绑定”后，更新全局 Store 中的 `isDeviceBound` 状态，并动态解锁首页和管家页面的“体征基座”模块。
  - 增加“我的订单”入口占位。

## Phase 10: Final Polish & Delivery (Current)
- **Batch 4: 核心状态舱 UI/UX 极致降噪与升温 (Status Overview Refactor)**：
  - **IoT 穿戴设备卡片 (`IoTStatusCard`)**：彻底废弃深色渐变（B端大屏感），改用纯白底色配合极淡的科技蓝弥散光晕。移除占面积较大的微图表，压缩为高度极简的横向胶囊卡片。将文案从冷冰冰的技术描述（如“未连接穿戴设备”）升级为有温度的管家视角（如“守护升级：绑定 Neuro-Band，开启 24h 异常预警”）。
  - **专病核心状态舱 (`StatusOverview`)**：全面抛弃高饱和色块，替换为极淡的浅色背景（如 `bg-emerald-50/80`）配合柔和的发光阴影。将上下堆叠的排版改为更紧凑的左右图文混排，大幅降低卡片高度。增加管家视角的解读文案（如“状态极佳：已持续 142 天无发作，请继续保持”）。
  - **默认健康管家舱 (`DefaultManager`)**：将原本体积庞大、色彩浓重的“专病智能核心舱”重构为浅色呼吸感设计的“专属健康管家”。精简了冗长的引导文案，并将巨大的上下堆叠按钮改为紧凑的并排胶囊按钮，大幅释放了首屏空间。
  - **消除全局冗余横幅**：彻底移除了 `ManagerView` 首页顶部冗余的“连接智能设备”全局横幅，将设备连接引导统一收敛至 `IoTStatusCard`，释放首屏空间，提升核心医疗状态的视觉优先级。
  - **设备管理页重构 (`DeviceView`)**：参考蚂蚁阿福的设计语言，彻底重构了 `/device` 页面。未连接时，隐藏所有空数据卡片，展示居中的高精美“引导连接舱”；已连接时，引入 `CountUp` 数字滚动动效与心跳呼吸灯，模拟真实数据流转。所有体征数据（心率、步数等）均接入全局 Zustand Store，消除硬编码。
  - **设备连接路由优化 (Routing Polish)**：修复了未绑定设备时，首页点击“守护升级”会进入空状态过渡页的冗余层级问题。现在未绑定状态下点击将**直达设备选择列表 (`/device-connect`)**，而 `/device` 的空状态仅作为用户主动断开连接后的平滑降级（Fallback）展示，极致缩短转化链路。
- **Batch 3: UI/UX 极致信息密度优化 (High-Density UI Polish)**：
  - **通用组件优化**：全面重构 `DTxCard`、`MedicationTracker`、`IoTStatusCard`、`VisitSummaryModal` 等核心组件，大幅缩减内边距 (padding)、外边距 (margin) 与圆角大小 (border-radius)，将字号进一步精简至 `text-[10px]` 到 `text-[14px]` 区间，显著提升单屏信息密度。
  - **专病表单优化**：深度打磨 `SeizureDiarySheet`（癫痫日记）、`MigraineDiarySheet`（偏头痛日记）、`CDRDiarySheet`（照护日记），优化表单项间距与按钮尺寸，使复杂医疗表单在移动端呈现出更紧凑、专业的视觉体验。
  - **日历视图优化**：重构 `MigraineCalendar` 与 `SeizureCalendar`，缩小日期网格尺寸与图表高度，优化图例排版，在有限的屏幕空间内展示更长周期的健康趋势。
  - **管家视图重构**：同步更新 `CognitiveManager` 与 `EpilepsyManager` 视图的整体布局间距，配合上述组件的优化，打造出极具现代感、高信息密度且不失呼吸感的 C 端数字医疗管家体验。
- **Batch 2: 动态医学量表渲染引擎 (Assessment Engine)**：
  - 升级 `AssessmentEngine` 动态表单渲染引擎，新增对 `SLIDER`（滑动条）题型的支持，采用 C 端柔和视觉规范。
  - 引入真实的医学量表数据配置：新增 `src/configs/scales/ad8.ts` (AD8 早期认知筛查) 与 `src/configs/scales/phq9.ts` (PHQ-9 抑郁筛查)。
  - 实现动态跳题逻辑 (Skip Logic)：在 PHQ-9 中通过 `dependsOn` 字段实现高危自杀倾向的动态追问拦截。
  - 重构 `/assessment` 测评流，将 AD8 与 PHQ-9 无缝串联至认知障碍综合评估路径（AD8 -> PHQ-9 -> CDR）。
- **Batch 1: 空状态与引导优化 & 商业化闭环**：
  - 完善 `DeviceView`（我的设备）的蓝牙连接流，在未绑定设备时展示精美的空状态与引导文案，并新增“去商城了解”的转化入口。
  - 深化 `MallView`（服务商城）的订阅闭环，模拟设备购买后的自动发现与绑定流程，绑定成功后自动跳转至设备看板。
  - 引入全局 `ErrorBoundary`（错误边界）组件，捕获渲染异常并提供友好的重试界面。
  - 引入 `useNetworkStatus` 钩子，实现全局弱网/断网环境下的 Toast 提示兜底。

## Phase 9: Manager Dashboard Expansion
- **Batch 4: 数据洞察与就诊报告 (Zone D)**：
  - 升级 `TrendBarChart` 组件，新增 `complianceRate` 与 `complianceLabel` 属性，支持在图表右上角展示“依从性达标率”、“控制率”等复杂维度。
  - 开发 `VisitSummaryModal`（生成就诊摘要）组件，模拟 AI 生成专业的 RWE（真实世界证据）总结文本。
  - 根据不同的 `DiseaseTag`，动态生成针对癫痫（发作频次、用药依从性、EEG 稳定性）、偏头痛（VAS 评分、急性药天数、MOH 风险）和认知障碍（训练完成率、BPSD 追踪、睡眠比例）的专属医疗摘要。
  - 将“生成就诊摘要”入口深度集成至三大专病管家的“数据洞察”模块中。
- **Batch 3: 认知照护与全量工具箱 (Zone B - AD & Zone C)**：
  - 开发 `CDRDiarySheet`（日常观察者日记）组件，为认知障碍家属提供 BPSD（精神行为症状）追踪打卡工具。
  - 引入 BPSD 严重程度评估逻辑，当家属选择“重度 (有危险)”时，动态推入红色紧急就医提示。
  - 开发 `MedicalToolbox`（全量工具箱）组件（Zone C），采用 Bento 网格风格平铺所有医疗工具（发作日记、头痛日记、照护日记、睡眠日志等）。
  - 将 `MedicalToolbox` 挂载到所有 Manager 视图（包括无标签的 Default 视图）的底部，打破病种壁垒，支持跨病种的 RWE（真实世界证据）数据收集。
- **Batch 2: 癫痫与偏头痛深度表单 (Zone B - EP & MG)**：
  - 开发 `SeizureDiarySheet`（癫痫发作日记）组件，支持发作类型（全面/局灶）选择，并在选择局灶时动态展开“意识障碍”开关。
  - 引入极端事件熔断逻辑：在癫痫发作日记中，若持续时间选择 `>5min`，保存时将立即触发全局红色熔断总线（SOS 预警）。
  - 开发 `MedicationTracker`（早中晚用药打卡）组件，支持剂量进度条计算，并增加漏服补救提示（下午/晚上打卡时若早上未服药则触发警告）。
  - 开发 `MigraineDiarySheet`（偏头痛日记）组件，引入 0-10 分 VAS 疼痛滑动条配以动态表情包反馈，支持伴随症状多选。
  - 在偏头痛日记中明确区分“急性止痛药”与“预防性药物”，选择急性药时自动联动全局 MOH 防火墙统计。
- **Batch 1: 底座完善与无标签引导 (Zone A & Zone B-Fallback)**：
  - 重构 `ManagerView` 路由分发逻辑，新增 `DefaultManager` 组件处理无病种标签 (`DiseaseTag.NONE`) 的空状态，提供精美的“开启深度测评”引导卡片。
  - 提取并升级 `DailyHealthBase` 组件（Zone A），新增“泛健康体能打卡”模块，采用类似苹果健身圆环的视觉反馈展示步数与屏幕使用时间。
  - 引入异常体征微干预逻辑，当深度睡眠比例偏低时，动态推入助眠建议提示。
  - 提取 `DTxCard` 组件，作为数字疗法 (DTx) 的统一入口，并增加连续打卡天数 (Streak) 的激励徽章展示。
  - 将 `DailyHealthBase` 和 `DTxCard` 深度集成到认知、癫痫、偏头痛三大专病管家视图中。

## Phase 8: Final Polish & Delivery
- **Batch 1: 全局路由与导航优化 (Navigation Polish)**：
  - 修复 TabBar 状态同步，确保底部 TabBar 在不同路由下的高亮状态完全准确。
  - 增加全局页面转场动画，使用 `motion/react` 的 `AnimatePresence` 实现平滑过渡。
  - 增加网络异常兜底机制，在 AI 预问诊和提交测评中模拟网络延迟与错误重试。
  - 优化空状态，新增“我的设备”页面，在未绑定设备时展示精美的空状态与引导文案。

- **Batch 2: 极端边界情况兜底 (Edge Cases & Fallbacks)**：
  - 完善全局异常捕获与错误边界 (Error Boundary)，新增 `GlobalError` 组件并在路由层面拦截渲染错误。
  - 优化弱网环境下的骨架屏 (Skeleton) 体验，为三大管家视图（癫痫、偏头痛、认知）新增 `ManagerSkeleton` 骨架屏加载状态。

### v1.2.0 (Phase 6.2 IoT Interaction Enhancements)
- **Batch 3: IoT 交互增强 (IoT Interaction Enhancements)**：
  - **全局 Store**：新增 `unbindDevice` 动作，完善设备生命周期管理。
  - **IoTStatusCard**：优化未连接态的引导动效与已连接态的动态数据展示（引入微图表与呼吸动效）。
  - **DeviceView**：完善蓝牙扫描、连接、断开的交互闭环，并与全局 Store 状态强绑定，实现状态同步。

### v1.0.0 (Phase 6 Manager Dashboard Commercial Refactor)
- **UI/UX 体验红线纠偏**：全面重构 `Manager` 目录下的三大专病管家视图。彻底摒弃适老化的大字体设计，将字号降级为 `text-sm`、`text-xs`，采用更紧凑的间距（`gap-3`, `p-4`），恢复标准的、严肃的、现代 C 端消费级 SaaS 的排版体系。
- **业务目标 1：新增“健康趋势洞察”看板**：
  - 引入 `recharts` 库，新增 `TrendBarChart` 组件。
  - 在管家首页的“专属核心舱”区域，基于 Mock 的历史打卡记录，渲染直观的趋势分析（如：近 7 日用药依从性、近 30 天发作频率变化）。
- **业务目标 2：深化“IoT 软硬一体化”数据生态**：
  - 新增 `IoTStatusCard` 和 `VitalsGrid` 组件。
  - 在“日常健康基座”区域，动态展示由 Neuro-Band 同步的 24 小时高价值体征数据概览（如 HRV、夜间深睡比例、EEG 脑电波形健康度）。
  - 强化设备接入感，未连接时提供极简的连接引导。

### v0.9.3 (Phase 5.5 LBS Triage & Neuro-Pass Routing)
- 提取 `NeuroPassModal` 组件至 `src/components/NeuroPassModal.tsx`，实现跨组件复用的动态二维码凭证弹窗。
- 重构 `src/views/Report/index.tsx`，在报告页尾部接入 LBS 智能分流与导诊闭环：
  - **LBS 智能分流引擎**：当患者测评结果为“中高风险”（`riskScore < 80`）时，动态渲染“就近协作网络 (LBS)”卡片。
  - **线下履约凭证流转**：
    - 实现 Mock 的一键地图导航逻辑（Toast 提示）。
    - 实现跨组件唤起 `NeuroPassModal`，打通“线上检出异常 -> LBS 匹配就近网点 -> 唤起动态码准备就医”的完整患者流转链路。
  - 严格遵循 C 端管家范式，卡片采用纯白底色、柔和阴影与精致的标签排版。

### v0.9.2 (Phase 5.4 Cognitive Manager Dashboard & Dual Identity)
- 重构 `src/views/Manager/Cognitive/index.tsx`，实现认知护航管家核心业务面板：
  - **Status Overview**：引入身份双轨制，根据 `useAppStore` 的 `identity` 动态切换患者/家属视角的文案。实现“LBS 实时安全围栏”状态卡片，提供安心的视觉反馈。
  - **Daily Actions**：实现“今日脑力训练”卡片（DTx 数字疗法入口）。针对家属视角，独家展示“照护微随访”模块，提供极轻量的日常状态收集（如睡眠质量评价）。
  - **Medical Services**：实现“复查动态量表（CDR）”与“照护者心理支持”的常驻入口。
  - 彻底规避适老化设计，保持与癫痫、偏头痛管家高度一致的“阿福式”现代科技质感，大量使用充裕留白、高级柔和阴影与深邃蓝/科技蓝弥散渐变。

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

### v0.5.8 (Phase 5.8 UI Refinement - Eliminate Whitespace)
- **优化体征监测模块 (`VitalsGrid`)**：
  - 移除了 `Swiper` 外层的 `paddingBottom: 24px`，将底部留白转移到卡片内部的 `pb-7`，让分页指示器 (Dots) 自然悬浮在卡片底部的安全区域内，彻底消除了外部大面积的突兀白边。
  - 将“添加健康设备”卡片从垂直布局 (Vertical) 重构为水平紧凑布局 (Horizontal Compact)，大幅降低了卡片的最小高度，避免了因高度撑开导致的空旷感。
  - 进一步压缩了内部元素的间距 (`p-4` -> `p-3`, `py-3` -> `py-2`)，提升了整体的信息密度，使其更符合商业级 C 端医疗产品的精致感。

### v0.6.1 (Phase 6.1 Equipment Detail & JIT Purchase Flow)
- **开发装备详情页 (`EquipmentDetailView`)**：
  - 采用沉浸式 Hero 视觉，展示装备大图、价格与核心卖点。
  - 结构化展示“专属高阶权益 (Bundled Privileges)”与“硬件规格 (Hardware Specs)”。
  - 底部悬浮操作栏 (Floating Action Bar) 动态适配 iOS 安全区，并根据购买状态切换按钮（“立即解锁”/“已拥有”）。
- **落地 JIT 合规协议拦截 (`JITAgreementModal`)**：
  - 在用户点击购买/绑定时，瞬间拦截路由，强制弹出《三方电子联合数据授权协议》。
  - 签署后方可放行购买逻辑，并记录 RWE (真实世界数据) 授权状态，完成合规闭环。

### v0.6.0 (Phase 6.0 Equipment Mall List)
- **重构健康商城 (`EquipmentsView`)**：
  - 定位为“数字医疗装备库”，仅展示与底层临床 CRF 数据打通的救命/防风险装备（如 AD 防走失胸牌、癫痫脑电贴、偏头痛手环）。
  - 采用高密度卡片布局，展示装备缩略图、名称、价格及附赠的高阶软件特权。
  - 移除硬编码的底部内边距，统一由全局 Layout 接管滚动与留白，彻底解决底部大面积白屏问题。

### v0.5.7 (Phase 5.7 UI Refinement - Swiper Carousel)
- **优化体征监测模块 (`VitalsGrid`)**：
  - 将原生 CSS `snap-x` 滚动替换为 `antd-mobile` 的 `Swiper` 组件。
  - 解决了右侧大面积留白的问题，卡片现在 100% 占满容器宽度。
  - 引入了底部指示器 (Pagination Indicators)，让多设备切换的交互更加直观和优雅。
  - 增大了卡片内的圆角和间距，进一步提升了商业级 C 端医疗产品的视觉质感。

### v0.5.6 (Phase 5.6 High-Density UI Refinement)
- **重构体征监测模块 (`VitalsGrid`)**：
  - 废弃垂直 2x2 网格，采用**高密度横向滚动卡片 (Horizontal Snap Scroll)** 布局。
  - 大幅提升单卡片信息密度，将核心体征指标（心率、步数、脑电等）压缩至单行展示。
  - 完美支持多设备横向滑动切换，并在队列末尾固定展示“添加健康设备”引导卡片。
  - 优化商业级医疗文案，采用“授权同步基础体征，或接入医疗级高精度设备”。
  - 保留并集成原有的 `DeviceManagerModal` 半屏设备管理交互。

### v0.5.5 (Phase 5.5 Bugfix & Logic Rollback)
- **修复逻辑漏洞**：重构 `ManagerView` 中的“体征监测”模块，严格根据 `connectedDevices` 状态进行条件渲染。
- **回滚与优化**：
  - 移除无视设备状态强制渲染的 `VitalsGrid` 数据。
  - 恢复设备空状态引导设计（Empty State）。当用户未绑定设备时，展示引导绑定卡片并提供前往 `/device-connect` 的快捷入口，彻底杜绝“幽灵数据”问题。
  - 修复了 Vite HMR 导致的动态导入模块失败问题。

### v0.5.4 (Phase 5.4)
- 完善 `VitalsGrid` 组件，实现 2x2 网格布局展示体征数据（HRV、深睡占比、脑电稳定度、步数），并集成设备连接状态栏。
- 将 `VitalsGrid` 替换到 `ManagerView` 中，提升体征监测模块的视觉体验。
- 在深度分析报告（`TriggerAnalysisView`, `ProgressionAnalysisView`, `VisitSummaryView`）中植入 `Paywall` 付费墙交互，实现高阶商业化转化。
- 完善 `ProfileView` 中的家庭成员管理，实现患者与家属账号的绑定模拟。
- 开发 `CaregiverReportView`，在家属视角下展示专属的“照护者周报”。

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
