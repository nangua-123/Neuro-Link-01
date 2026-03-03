// File: src/services/bluetooth.ts
import { IoTDevice, VendorWhitelist } from '../interfaces/mall_device';

export class BluetoothService {
  private connectedDevice: IoTDevice | null = null;
  private monitoringTimer: NodeJS.Timeout | null = null;

  /**
   * 模拟 Web Bluetooth API 扫描与连接
   * 核心逻辑 1：生态拦截（白名单机制）
   */
  public async scanAndConnect(mockVendorId: string = VendorWhitelist.CHANGHONG_MEDICAL): Promise<IoTDevice> {
    console.log('正在调用底层蓝牙协议栈扫描附近的 IoT 设备...');
    
    // 模拟蓝牙扫描与握手延迟
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 校验厂商白名单 (商业壁垒拦截)
    const isWhitelisted = Object.values(VendorWhitelist).includes(mockVendorId as VendorWhitelist);
    
    if (!isWhitelisted) {
      console.error(`拦截异常设备接入: VendorID [${mockVendorId}]`);
      throw new Error('设备未获得 Neuro-Link 认证，连接阻断');
    }

    this.connectedDevice = {
      macAddress: '00:1A:22:0A:B3:4C',
      vendorId: mockVendorId,
      deviceName: 'Neuro-Band Pro (长虹医疗定制版)',
      batteryLevel: 85,
      connectionState: 'CONNECTED'
    };

    console.log('设备连接成功，已建立加密数据通道:', this.connectedDevice.deviceName);
    return this.connectedDevice;
  }

  /**
   * 核心逻辑 2：被动熔断（夜间体征监测与极端事件预警）
   */
  public startNightMonitoring(onRecallTriggered?: () => void): void {
    if (!this.connectedDevice) {
      throw new Error('未连接任何设备，无法开启夜间监测');
    }

    console.log('已开启夜间体征监测，正在持续接收脑电/心率数据流...');

    // 模拟随机触发极端医疗事件（如：癫痫持续状态超过5分钟）
    // 在真实场景中，这里是处理蓝牙特征值 (Characteristic) 通知的地方
    const randomTriggerTime = Math.floor(Math.random() * 5000) + 3000; // 3-8秒内随机触发

    this.monitoringTimer = setTimeout(() => {
      console.error('【严重警告】检测到癫痫持续发作 > 5分钟！');
      console.error('即将触发全局 Recall 熔断总线...');
      
      if (onRecallTriggered) {
        onRecallTriggered();
      }
    }, randomTriggerTime);
  }

  public stopNightMonitoring(): void {
    if (this.monitoringTimer) {
      clearTimeout(this.monitoringTimer);
      this.monitoringTimer = null;
    }
    console.log('已停止夜间体征监测');
  }
  
  public disconnect(): void {
    this.connectedDevice = null;
    this.stopNightMonitoring();
    console.log('设备已断开连接');
  }
}

export const bluetoothService = new BluetoothService();
