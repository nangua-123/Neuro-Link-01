// File: src/components/ReceiptOCR/index.tsx
import React, { useState } from 'react';
import { Card, Button, ImageUploader, Toast, Tag } from 'antd-mobile';
import { CameraOutline, CheckCircleFill } from 'antd-mobile-icons';
import { ocrEngine } from '../../services/ocrEngine';
import { ReconciliationPayload } from '../../interfaces/mall_device';

export default function ReceiptOCR() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ReconciliationPayload | null>(null);

  // 模拟图片上传与 OCR 解析
  const handleUpload = async () => {
    setIsScanning(true);
    setResult(null);
    try {
      // 模拟传入一个空文件触发解析
      const payload = await ocrEngine.scanReceipt(null);
      setResult(payload);
      Toast.show({ icon: 'success', content: '解析成功' });
    } catch (error) {
      Toast.show({ icon: 'fail', content: '解析失败，请重新拍摄' });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-1">单据采集与对账</h2>
        <p className="text-xs text-gray-500">请拍摄您在基层医院的处方单或收费单，用于完善健康档案与双盲对账。</p>
      </div>

      {!result ? (
        <Card className="shadow-sm border border-gray-100 rounded-xl bg-white flex flex-col items-center justify-center p-8 min-h-[200px]">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <CameraOutline className="text-[#1677FF] text-3xl" />
          </div>
          <Button 
            color="primary" 
            loading={isScanning}
            loadingText="AI 正在解析单据..."
            onClick={handleUpload}
            className="rounded-lg font-medium px-8"
          >
            拍照上传单据
          </Button>
          <div className="text-[10px] text-gray-400 mt-4 text-center">
            支持 JPG/PNG 格式，请确保文字清晰可见
          </div>
        </Card>
      ) : (
        <div className="animate-fade-in">
          <Card className="shadow-sm border-none rounded-xl bg-white overflow-hidden p-0 mb-4">
            <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-2">
              <CheckCircleFill className="text-emerald-500 text-lg" />
              <span className="text-sm font-medium text-emerald-700">单据解析成功</span>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-baseline mb-4">
                <div className="text-xs text-gray-500">就诊机构</div>
                <div className="text-sm font-medium text-gray-900">{result.hospitalName}</div>
              </div>
              <div className="flex justify-between items-baseline mb-4">
                <div className="text-xs text-gray-500">就诊日期</div>
                <div className="text-sm font-mono text-gray-900">{result.date}</div>
              </div>
              <div className="flex justify-between items-baseline mb-6">
                <div className="text-xs text-gray-500">总金额</div>
                <div className="text-lg font-bold text-[#1677FF] font-mono">¥{result.totalAmount.toFixed(2)}</div>
              </div>

              {/* 核心医疗数据高亮区 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-2">
                <div className="text-xs font-medium text-gray-700 mb-3">提取到处方药物</div>
                {result.prescriptionDrugs?.map((drug, idx) => (
                  <div key={idx} className="flex justify-between items-center mb-2 last:mb-0">
                    <span className="text-sm text-gray-900">{drug.name}</span>
                    <span className="text-xs text-gray-500 font-mono">{drug.dosage} x{drug.quantity}</span>
                  </div>
                ))}
              </div>

              {result.aedConcentration && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <div className="text-xs font-medium text-orange-800 mb-1">关键检验指标</div>
                  <div className="text-sm text-orange-900">{result.aedConcentration}</div>
                </div>
              )}
            </div>
          </Card>
          
          <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <CheckCircleFill className="text-gray-300" />
            单据已上传云端，双盲对账已完成
          </div>
          
          <Button 
            block 
            fill="outline" 
            color="primary" 
            className="mt-6 rounded-lg border-dashed"
            onClick={() => setResult(null)}
          >
            继续上传其他单据
          </Button>
        </div>
      )}
    </div>
  );
}
