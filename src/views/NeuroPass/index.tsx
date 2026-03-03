// File: src/views/NeuroPass/index.tsx
import React, { useEffect, useState } from 'react';
import { NavBar, Card, Button, Tag, Skeleton, Result, SafeArea } from 'antd-mobile';
import { CheckCircleFill, ExclamationCircleFill, EnvironmentOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { triageEngine } from '../../services/triageEngine';
import { TriageResult, RiskLevel } from '../../interfaces/triage';

export default function NeuroPassView() {
  const navigate = useNavigate();
  const { selectedDiseaseTag } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TriageResult | null>(null);

  useEffect(() => {
    // 模拟从上一个页面传递过来的 answers，这里使用空对象触发 Mock 逻辑
    const mockAnswers = { 'q_memory': 2 }; // 强制触发红灯测试
    
    triageEngine.generateTriageReport(mockAnswers, selectedDiseaseTag)
      .then(res => {
        setResult(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Triage failed:', err);
        setLoading(false);
      });
  }, [selectedDiseaseTag]);

  if (loading || !result) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Skeleton.Title animated />
        <Skeleton.Paragraph lineCount={5} animated />
      </div>
    );
  }

  // 绿灯：会员转化卡片
  if (result.riskLevel === RiskLevel.GREEN) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar onBack={() => navigate(-1)} className="bg-white border-b border-gray-100">
          测评结果
        </NavBar>
        <div className="flex-1 p-4 flex flex-col items-center pt-12">
          <CheckCircleFill style={{ fontSize: 64, color: '#00B578' }} />
          <h2 className="text-xl font-medium mt-6 mb-2 text-gray-900">{result.suggestionTitle}</h2>
          <p className="text-gray-500 text-center text-sm leading-relaxed px-4 mb-10">
            {result.suggestionDetail}
          </p>
          <Card className="w-full shadow-sm border-none rounded-xl bg-gradient-to-br from-[#E6F0FF] to-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-[#1677FF] text-lg">Neuro-Link 基础会员</div>
                <div className="text-xs text-gray-500 mt-1">解锁日常脑力训练与健康档案</div>
              </div>
              <div className="text-xl font-bold text-[#1677FF]">¥9.9<span className="text-xs font-normal">/月</span></div>
            </div>
            <Button block color="primary" className="mt-6 rounded-lg font-medium">
              立即开通
            </Button>
          </Card>
        </div>
        <SafeArea position="bottom" />
      </div>
    );
  }

  // 红/黄灯：Neuro-Pass 电子凭证 (登机牌风格)
  const isRed = result.riskLevel === RiskLevel.RED;
  const themeColor = isRed ? '#FF3141' : '#FF8F1F'; // 红色高危，橙色中危

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      <NavBar 
        onBack={() => navigate(-1)} 
        className="bg-[#141414] text-white border-b border-gray-800"
        style={{ '--title-font-size': '16px', '--title-color': '#fff', '--back-arrow-color': '#fff' }}
      >
        Neuro-Pass 专属绿通
      </NavBar>
      
      <div className="flex-1 p-5 pt-8">
        {/* 登机牌主体 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl relative">
          
          {/* 顶部状态条 */}
          <div 
            className="h-2 w-full" 
            style={{ backgroundColor: themeColor }}
          />

          {/* 警告头部 */}
          <div className="p-6 border-b border-dashed border-gray-300 relative">
            <div className="flex items-start gap-3">
              <ExclamationCircleFill style={{ fontSize: 24, color: themeColor, marginTop: 2 }} />
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {result.suggestionTitle}
                </h2>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {result.suggestionDetail}
                </p>
              </div>
            </div>
            
            {/* 登机牌半圆缺口 */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#141414] rounded-full" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#141414] rounded-full" />
          </div>

          {/* 凭证核心信息区 */}
          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Pass Code</div>
                <div className="font-mono text-xl font-bold text-gray-900 tracking-tight">
                  {result.neuroPassCode}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Valid For</div>
                <Tag color="primary" fill="outline" className="font-mono">
                  {result.diseaseTag}
                </Tag>
              </div>
            </div>

            {/* 匹配的医疗机构 */}
            {result.recommendedClinic && (
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Assigned Clinic</div>
                <div className="font-medium text-gray-900 mb-1">
                  {result.recommendedClinic.name}
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <EnvironmentOutline className="mr-1" />
                  距您 {result.recommendedClinic.distanceKm} km · {result.recommendedClinic.address}
                </div>
                
                {/* 设备强校验 Tag */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider w-full mb-1">Required Equipment Verified</div>
                  {result.recommendedClinic.equipmentList.map(eq => (
                    <Tag 
                      key={eq} 
                      color={eq === result.requiredEquipment ? 'success' : 'default'}
                      fill={eq === result.requiredEquipment ? 'solid' : 'outline'}
                      className="font-mono text-[10px]"
                    >
                      {eq}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 底部操作区 */}
          <div className="p-6 bg-white">
            <Button 
              block 
              style={{ backgroundColor: '#1677FF', color: '#fff', border: 'none' }}
              className="rounded-lg font-medium text-sm h-12"
            >
              一键预约该机构
            </Button>
            <div className="text-center text-[10px] text-gray-400 mt-4">
              凭此码在合作机构可享受免排队绿通服务
            </div>
          </div>
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
