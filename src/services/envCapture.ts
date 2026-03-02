// File: src/services/envCapture.ts
import { EnvironmentData } from '../interfaces/manager';

/**
 * 静默环境探针服务 (Mock)
 * 模拟调用手机底层传感器，获取 LBS 与环境数据
 */
export const captureEnvironment = async (): Promise<EnvironmentData> => {
  return new Promise((resolve) => {
    // 模拟异步传感器调用延迟
    setTimeout(() => {
      resolve({
        latitude: 30.6586,           // 纬度 (成都)
        longitude: 104.0648,         // 经度 (成都)
        atmosphericPressure: 1008.5, // 气压 (hPa) - 偏头痛易发低压
        altitude: 500,               // 海拔 (m)
        temperature: 26.5,           // 温度 (°C)
        humidity: 65,                // 湿度 (%)
      });
    }, 800);
  });
};
