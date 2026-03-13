import React, { useState } from 'react';
import { Popup, Button } from 'antd-mobile';
import { FileText, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { DiseaseTag } from '../../configs/constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  diseaseTag: DiseaseTag;
}

export function VisitSummaryModal({ visible, onClose, diseaseTag }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    // 模拟 AI 生成 RWE 报告的延迟
    setTimeout(() => {
      setIsGenerating(false);
      if (diseaseTag === DiseaseTag.EPILEPSY) {
        setSummary('患者近 30 天内无全面强直阵挛发作，局灶性发作 2 次（均在夜间）。左乙拉西坦片与丙戊酸钠缓释片用药依从率达 95%。脑电图 (EEG) 稳定性良好，未见持续异常放电。建议维持当前剂量，3 个月后复查血药浓度。');
      } else if (diseaseTag === DiseaseTag.MIGRAINE) {
        setSummary('患者近 30 天内偏头痛发作 4 次，平均 VAS 疼痛评分为 6 分。急性止痛药（布洛芬）使用天数为 3 天，未触及 MOH（药物过度使用性头痛）红线。主要诱因为“熬夜”与“情绪波动”。建议考虑引入 CGRP 靶向药预防治疗，并继续保持规律作息。');
      } else {
        setSummary('患者近 30 天内认知训练完成率 85%，MoCA 极简版自测得分稳定。家属照护日记显示，近期偶发“睡眠障碍”与“轻度焦虑”，无严重精神行为症状 (BPSD)。夜间深度睡眠比例平均 22%，需警惕睡眠剥夺对认知的负面影响。建议增加日间户外活动时间。');
      }
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    // 延迟重置状态，避免关闭动画时闪烁
    setTimeout(() => {
      setSummary(null);
      setIsGenerating(false);
    }, 300);
  };

  return (
    <Popup 
      visible={visible} 
      onMaskClick={handleClose} 
      bodyStyle={{ 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px', 
        padding: '16px', 
        backgroundColor: '#FAFAFA', 
        minHeight: '40vh' 
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-500" />
            就诊摘要生成
          </h3>
        </div>

        {!summary && !isGenerating && (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-[12px] p-3 text-center space-y-1.5">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <h4 className="text-[12px] font-bold text-indigo-900">AI 智能总结</h4>
            <p className="text-[10px] text-indigo-700/80 leading-relaxed">
              基于您近期的打卡记录、体征数据与量表结果，一键生成结构化的真实世界证据 (RWE) 摘要，方便医生快速了解您的病情变化。
            </p>
            <Button 
              block 
              className="mt-2 bg-indigo-600 text-white border-none rounded-[10px] h-9 font-bold text-[12px] shadow-[0_2px_8px_rgba(79,70,229,0.2)]"
              onClick={handleGenerate}
            >
              立即生成摘要
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="bg-white border border-slate-100 rounded-[12px] p-5 text-center space-y-2 shadow-sm">
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin mx-auto" />
            <p className="text-[11px] font-medium text-slate-600">正在分析多维健康数据...</p>
          </div>
        )}

        {summary && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-2.5">
            <div className="bg-white border border-slate-200 rounded-[12px] p-3 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-50 rounded-full blur-xl -mr-6 -mt-6" />
              <div className="flex items-center gap-1 mb-1.5 relative z-10">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-900">生成完毕</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed relative z-10 text-justify">
                {summary}
              </p>
            </div>
            <Button 
              block 
              className="bg-slate-900 text-white border-none rounded-[10px] h-9 font-bold text-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              onClick={handleClose}
            >
              完成并关闭
            </Button>
          </div>
        )}
      </div>
    </Popup>
  );
}
