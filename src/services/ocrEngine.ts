// File: src/services/ocrEngine.ts
import { ReconciliationPayload } from '../interfaces/mall_device';

export class OcrEngine {
  /**
   * 模拟双盲对账 OCR 引擎
   * 扫描基层医院的处方单/收费单，提取关键信息用于 B 端分润核算对账
   */
  public async scanReceipt(imageFile: File | Blob | null): Promise<ReconciliationPayload> {
    console.log('正在上传单据并进行 OCR 图像解析...');
    
    // 模拟 1.5 秒的识别延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 返回极度逼真的基层医院收费单/处方单数据
    const mockResult: ReconciliationPayload = {
      receiptId: `REC-${Date.now()}`,
      hospitalName: '高新区第一社区卫生服务中心',
      doctorName: '李建国 (神经内科)',
      date: new Date().toISOString().split('T')[0],
      totalAmount: 325.50,
      prescriptionDrugs: [
        {
          name: '左乙拉西坦片 (Keppra)',
          dosage: '0.25g * 30片',
          quantity: 2
        },
        {
          name: '丙戊酸钠缓释片 (德巴金)',
          dosage: '0.5g * 30片',
          quantity: 1
        }
      ],
      aedConcentration: '丙戊酸血药谷浓度: 65.2 μg/mL (正常范围 50-100 μg/mL)'
    };

    console.log('OCR 解析完成，提取对账载荷:', mockResult);
    return mockResult;
  }
}

export const ocrEngine = new OcrEngine();
