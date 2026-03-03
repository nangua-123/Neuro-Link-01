// File: src/interfaces/mall_device.ts

export enum VendorWhitelist {
  CHANGHONG_MEDICAL = 'CHANGHONG_MEDICAL',
  HUAWEI_HEALTH = 'HUAWEI_HEALTH',
  APPLE_HEALTH = 'APPLE_HEALTH',
}

export interface ServicePackage {
  packageId: string;
  title: string;
  price: number;
  duration: string; // 例如：'1年', '6个月'
  includedHardware: string; // 附属硬件，例如：'长虹健康手环 V2 (医疗版)'
  privileges: string[]; // 包含的特权，例如：['7x24小时异常放电预警', '3次三甲医院绿通', '专属健康管家']
}

export interface IoTDevice {
  macAddress: string;
  vendorId: VendorWhitelist | string;
  deviceName: string;
  batteryLevel: number;
  connectionState: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
}

export interface PrescriptionDrug {
  name: string;
  dosage: string;
  quantity: number;
}

export interface ReconciliationPayload {
  receiptId: string;
  hospitalName: string;
  doctorName: string;
  date: string;
  totalAmount: number;
  prescriptionDrugs?: PrescriptionDrug[];
  aedConcentration?: string; // AED 谷浓度 (如丙戊酸血药浓度)
}
