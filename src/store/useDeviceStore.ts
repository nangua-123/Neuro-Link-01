import { create } from 'zustand';
import { UserIdentity, DeviceStatus } from '../interfaces/device';

interface DeviceState {
  identity: UserIdentity;
  setIdentity: (identity: UserIdentity) => void;
  
  deviceStatus: DeviceStatus;
  setDeviceStatus: (status: DeviceStatus) => void;
  
  hasSignedAgreement: boolean;
  setHasSignedAgreement: (signed: boolean) => void;
  
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  
  // 模拟 JIT 路由守卫拦截
  requireAuth: (callback: () => void) => void;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  identity: UserIdentity.SELF,
  setIdentity: (identity) => set({ identity }),
  
  deviceStatus: DeviceStatus.CONNECTED, // 默认已连接以展示数据
  setDeviceStatus: (status) => set({ deviceStatus: status }),
  
  hasSignedAgreement: false, // 默认未签署，演示 JIT 拦截
  setHasSignedAgreement: (signed) => set({ hasSignedAgreement: signed }),
  
  showAuthModal: false,
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  
  requireAuth: (callback) => {
    const { hasSignedAgreement } = get();
    if (!hasSignedAgreement) {
      // 触发全局熔断/拦截，弹出授权协议
      set({ showAuthModal: true });
    } else {
      callback();
    }
  }
}));
