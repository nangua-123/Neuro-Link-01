// File: src/components/RecallOverlay/types.ts
import { DangerLevel, RecallReason } from '../../store/recall';

/**
 * 全局 Recall 熔断总线高阶组件 Props
 * 挂载于 App.tsx 根节点，跨越所有路由的最高优先级报警机制。
 */
export interface RecallOverlayProps {
  /**
   * 是否触发熔断（从 useRecallStore 订阅）
   */
  isTriggered: boolean;
  
  /**
   * 危险等级（决定 UI 渲染策略：全屏爆红 / 强警告弹窗）
   */
  dangerLevel: DangerLevel | null;
  
  /**
   * 触发原因（用于渲染具体的警告文案和后续急救指导）
   */
  triggerReason: RecallReason | null;
  
  /**
   * 具体的警告信息（如：“患者癫痫发作已超过 5 分钟，极可能进入癫痫持续状态！”）
   */
  message: string | null;
  
  /**
   * 联动 120 回调：一键拨打急救电话并向华西总院发送 GPS 定位
   */
  onCallEmergency: () => void;
  
  /**
   * 联动家属回调：一键通知绑定的 Family ID 成员
   */
  onNotifyFamily: () => void;
  
  /**
   * 解除熔断回调（需极高权限，如医生输入授权码）
   */
  onDismiss: (authCode: string) => void;
}
