import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, QrCode, AlertTriangle, FileText, Activity, 
  Pill, Watch, BrainCircuit, Calendar, Clock, Download, Share, X
} from 'lucide-react';
import { useAppStore } from '../../store';
import { UserIdentity } from '../../interfaces/user';
import { DiseaseTag } from '../../configs/constants';

export default function ClinicReportView() {
  const navigate = useNavigate();
  const { 
    identity, 
    boundPatients, 
    currentPatientId, 
    selectedDiseaseTag,
    getAIInsights,
    seizureRecords,
    migraineRecords,
    careDiaryRecords,
    medicationPlans,
    medicationHistory,
    vitals,
    dtxProgress,
    dtxRadarData
  } = useAppStore();
  
  const isFamily = identity === UserIdentity.FAMILY;
  const currentPatient = boundPatients?.find(p => p.id === currentPatientId);
  
  const [activeTab, setActiveTab] = useState('summary');
  const [insights, setInsights] = useState<string[]>([]);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    setInsights(getAIInsights());
  }, [getAIInsights]);

  const tabs = [
    { id: 'summary', label: 'AI 主检总结' },
    { id: 'history', label: '病史与预问诊' },
    { id: 'events', label: '临床发作日记' },
    { id: 'meds', label: '用药与干预' },
    { id: 'iot', label: 'IoT 客观体征' },
    { id: 'scales', label: '量表与测评' },
  ];

  const renderDiseaseLabel = () => {
    switch(selectedDiseaseTag) {
      case DiseaseTag.AD: return '阿尔茨海默病';
      case DiseaseTag.EPILEPSY: return '癫痫';
      case DiseaseTag.MIGRAINE: return '偏头痛';
      default: return '未确诊';
    }
  };

  const today = new Date().toDateString();
  const todayTakenCount = medicationHistory[today]?.length || 0;
  const adherenceRate = medicationPlans.length > 0 ? Math.round((todayTakenCount / medicationPlans.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center justify-between px-4 h-14">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 -ml-2 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="text-[17px] font-bold text-slate-800">全景数字病历</div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 -mr-2 flex items-center justify-center active:scale-95 transition-transform">
              <Download className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar px-4 pb-2 gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-2 text-[14px] font-medium transition-colors relative ${
                activeTab === tab.id ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Raw Data Ledger - Summary */}
        {activeTab === 'summary' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Patient Baseline & QR Hub */}
            <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-bl-[100px] -z-10" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-[24px] font-extrabold text-slate-800 tracking-tight mb-1">
                    {isFamily && currentPatient ? currentPatient.name : '患者本人'}
                  </h1>
                  <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                    <span>{isFamily && currentPatient ? currentPatient.relation : '本人'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{renderDiseaseLabel()}</span>
                  </div>
                </div>
                
                {/* QR Code Hub */}
                <div 
                  className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  onClick={() => setShowQrModal(true)}
                >
                  <div className="w-14 h-14 bg-white rounded-[12px] shadow-sm border border-slate-200 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-800" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">医生扫码查阅</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-[16px] p-3.5 border border-slate-100">
                <div className="text-[12px] font-bold text-slate-400 mb-2">当前核心干预方案</div>
                <div className="flex flex-wrap gap-2">
                  {medicationPlans.length > 0 ? (
                    medicationPlans.map(plan => (
                      <span key={plan.id} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[13px] text-slate-700 font-medium">
                        {plan.name} {plan.dose}
                      </span>
                    ))
                  ) : (
                    <span className="text-[13px] text-slate-500">暂无用药方案</span>
                  )}
                  {dtxProgress.completed > 0 && (
                    <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[13px] text-slate-700 font-medium">数字认知训练</span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Executive Summary */}
            <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-[16px] font-bold text-slate-800">AI 主检医师总结</h2>
              </div>

              {/* Red Flags */}
              {(insights.length > 0 || adherenceRate < 80) && (
                <div className="bg-rose-50/50 rounded-[16px] p-3.5 border border-rose-100/50 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[13px] font-bold text-rose-700 mb-1">近期高危预警 (Red Flags)</div>
                      <ul className="text-[13px] text-rose-600/80 space-y-1 list-disc list-inside">
                        {insights.map((insight, idx) => (
                          <li key={idx}>{insight}</li>
                        ))}
                        {adherenceRate < 80 && medicationPlans.length > 0 && (
                          <li>近期用药依从性偏低 ({adherenceRate}%)。</li>
                        )}
                        {insights.length === 0 && adherenceRate >= 80 && (
                          <li>暂无明显高危预警。</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Text */}
              <p className="text-[14px] text-slate-600 leading-relaxed text-justify">
                基于 {renderDiseaseLabel()} 的管理路径，本周期内患者整体状况评估：
                {selectedDiseaseTag === DiseaseTag.AD && "认知功能较上月持平，未见显著衰退。手环客观数据显示深睡比例为 " + vitals.deepSleepRatio + "%。建议复诊时重点关注睡眠干预及家属照护压力。"}
                {selectedDiseaseTag === DiseaseTag.EPILEPSY && "发作频率与上周期相比有所变化，用药依从性为 " + adherenceRate + "%。建议复诊时结合发作日记调整抗癫痫药物剂量。"}
                {selectedDiseaseTag === DiseaseTag.MIGRAINE && "头痛发作频率及严重程度已记录，止痛药使用需防范药物过度使用头痛(MOH)。建议复诊时评估预防性治疗方案。"}
                {selectedDiseaseTag === DiseaseTag.NONE && "暂无特定专病数据，建议完善预问诊与量表测评。"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Raw Data Ledger - History */}
        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
              <h2 className="text-[16px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                预问诊与病史原件
              </h2>
              <div className="space-y-4">
                <div className="border-l-2 border-slate-200 pl-3 py-1">
                  <div className="text-[12px] text-slate-400 mb-1">主诉 (最近录入)</div>
                  <div className="text-[14px] text-slate-700 leading-relaxed">
                    {selectedDiseaseTag === DiseaseTag.AD ? '“最近记性越来越差，刚吃完饭就忘了，还老是怀疑保姆偷东西。晚上睡不好，总想往外跑。”' :
                     selectedDiseaseTag === DiseaseTag.EPILEPSY ? '“近期有发作先兆，感觉心慌、手抖，随后意识丧失。”' :
                     selectedDiseaseTag === DiseaseTag.MIGRAINE ? '“头痛频繁发作，伴有恶心、畏光，严重影响工作。”' : '暂无主诉记录。'}
                  </div>
                </div>
                <div className="border-l-2 border-slate-200 pl-3 py-1">
                  <div className="text-[12px] text-slate-400 mb-1">既往史</div>
                  <div className="text-[14px] text-slate-700 leading-relaxed">高血压 10 年（目前服用氨氯地平，血压控制可），2 型糖尿病 5 年。无食物/药物过敏史。</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Raw Data Ledger - Events */}
        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
              <h2 className="text-[16px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-500" />
                临床发作/异常行为原始记录
              </h2>
              
              <div className="space-y-5">
                {selectedDiseaseTag === DiseaseTag.EPILEPSY && seizureRecords.length > 0 ? (
                  seizureRecords.map(record => (
                    <div key={record.id} className="relative pl-4 border-l border-slate-200">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-rose-400 ring-4 ring-white" />
                      <div className="text-[12px] font-bold text-slate-800 mb-1">{new Date(record.timestamp).toLocaleString()}</div>
                      <div className="text-[14px] text-slate-700 mb-2">
                        发作类型: {record.type === 'generalized' ? '全面性发作' : '局灶性发作'}，
                        意识丧失: {record.impaired ? '是' : '否'}，
                        持续时间: {record.duration}。
                        诱因: {record.triggers.join(', ') || '无明显诱因'}。
                      </div>
                    </div>
                  ))
                ) : selectedDiseaseTag === DiseaseTag.MIGRAINE && migraineRecords.length > 0 ? (
                  migraineRecords.map(record => (
                    <div key={record.id} className="relative pl-4 border-l border-slate-200">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber-400 ring-4 ring-white" />
                      <div className="text-[12px] font-bold text-slate-800 mb-1">{new Date(record.timestamp).toLocaleString()}</div>
                      <div className="text-[14px] text-slate-700">
                        疼痛程度: {record.severity} (VAS: {record.vas})，
                        伴随症状: {record.symptoms.join(', ')}。
                        使用药物: {record.meds.join(', ') || '未使用'}。
                      </div>
                    </div>
                  ))
                ) : selectedDiseaseTag === DiseaseTag.AD && Object.keys(careDiaryRecords).length > 0 ? (
                  Object.values(careDiaryRecords).map(record => (
                    <div key={record.id} className="relative pl-4 border-l border-slate-200">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-rose-400 ring-4 ring-white" />
                      <div className="text-[12px] font-bold text-slate-800 mb-1">{new Date(record.timestamp).toLocaleString()}</div>
                      <div className="text-[14px] text-slate-700 mb-2">
                        精神行为症状: {record.bpsdSymptoms.join(', ')}。
                        严重意外: {record.hasSevereIncident ? '是' : '否'}。
                        {record.notes && `备注: ${record.notes}`}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[13px] text-slate-500 text-center py-4">暂无发作记录</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Raw Data Ledger - Meds */}
        {activeTab === 'meds' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
              <h2 className="text-[16px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-500" />
                用药与干预客观记录
              </h2>
              
              <div className="mb-4">
                <div className="text-[13px] font-bold text-slate-700 mb-3">近 7 天服药打卡热力图</div>
                <div className="flex justify-between items-end gap-1">
                  {[6, 5, 4, 3, 2, 1, 0].map((daysAgo) => {
                    const d = new Date();
                    d.setDate(d.getDate() - daysAgo);
                    const dateStr = d.toDateString();
                    const takenCount = medicationHistory[dateStr]?.length || 0;
                    const totalPlans = medicationPlans.length;
                    const isAllTaken = totalPlans > 0 && takenCount === totalPlans;
                    const isPartial = totalPlans > 0 && takenCount > 0 && takenCount < totalPlans;
                    const isMissed = totalPlans > 0 && takenCount === 0 && daysAgo > 0; // Don't mark today as missed yet
                    
                    return (
                      <div key={daysAgo} className="flex flex-col items-center gap-1.5 flex-1">
                        <div className={`w-full aspect-square rounded-[8px] ${
                          isAllTaken ? 'bg-emerald-400 border border-emerald-500' :
                          isPartial ? 'bg-emerald-200 border border-emerald-300' :
                          isMissed ? 'bg-rose-100 border border-rose-200' :
                          'bg-slate-100 border border-slate-200'
                        }`} />
                        <span className="text-[10px] text-slate-400">{d.getDate()}日</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500 justify-end">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-emerald-400" /> 全服</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-emerald-200" /> 部分</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-rose-100" /> 漏服</div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="text-[13px] font-bold text-slate-700 mb-3">数字疗法 (DTx) 训练记录</div>
                <div className="space-y-2">
                  {dtxProgress.completed > 0 ? (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-[12px]">
                      <div>
                        <div className="text-[13px] font-bold text-slate-800">认知功能训练</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">累计完成 {dtxProgress.completed} 分钟</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-bold text-emerald-600">进行中</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[13px] text-slate-500 text-center py-2">暂无训练记录</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Raw Data Ledger - IoT */}
        {activeTab === 'iot' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
              <h2 className="text-[16px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Watch className="w-5 h-5 text-indigo-500" />
                IoT 设备客观体征
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-[13px] font-bold text-slate-700 mb-2">睡眠分期原始图表 (昨夜)</div>
                  {/* Mock Chart Area */}
                  <div className="w-full h-40 bg-slate-50 rounded-[12px] border border-slate-200 p-3 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 49px, #cbd5e1 50px)', backgroundSize: '50px 100%' }} />
                    <div className="flex items-end h-full gap-1 w-full z-10">
                      {[40, 20, 80, 60, 30, 90, 20, 50, 70, 40, 20, 60].map((h, i) => (
                        <div key={i} className={`flex-1 rounded-t-sm ${h > 70 ? 'bg-indigo-200' : h > 40 ? 'bg-indigo-400' : 'bg-indigo-600'}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                    <span>22:00</span>
                    <span>02:00</span>
                    <span>06:00</span>
                  </div>
                  <div className="flex gap-4 mt-3 text-[12px]">
                    <div className="flex flex-col"><span className="text-slate-400">深睡</span><span className="font-bold text-slate-700">{vitals.deepSleepRatio}%</span></div>
                    <div className="flex flex-col"><span className="text-slate-400">心率变异性</span><span className="font-bold text-slate-700">{vitals.hrv} ms</span></div>
                    <div className="flex flex-col"><span className="text-slate-400">静息心率</span><span className="font-bold text-slate-700">{vitals.heartRate} bpm</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Raw Data Ledger - Scales */}
        {activeTab === 'scales' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
              <h2 className="text-[16px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-500" />
                量表与测评答卷切片
              </h2>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[14px] font-bold text-slate-800">MoCA 认知评估量表</div>
                    <div className="text-[14px] font-bold text-rose-600">22分 <span className="text-[11px] font-normal text-slate-400">(轻度认知障碍)</span></div>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-3">测评时间：最近一次</div>
                  
                  {/* Raw Drawing Slice */}
                  <div className="bg-slate-50 rounded-[12px] p-3 border border-slate-200">
                    <div className="text-[12px] font-bold text-slate-700 mb-2">视空间与执行功能：画钟测试 (11:10)</div>
                    <div className="w-full aspect-video bg-white rounded-[8px] border border-slate-200 flex items-center justify-center overflow-hidden">
                      {/* Placeholder for actual drawing image */}
                      <div className="w-24 h-24 rounded-full border-2 border-slate-800 relative">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px]">12</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px]">6</div>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px]">9</div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px]">3</div>
                        {/* Crooked hands */}
                        <div className="absolute top-1/2 left-1/2 w-1 h-8 bg-slate-800 origin-bottom -translate-x-1/2 -translate-y-full rotate-[15deg]" />
                        <div className="absolute top-1/2 left-1/2 w-1 h-10 bg-slate-800 origin-bottom -translate-x-1/2 -translate-y-full rotate-[110deg]" />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2">原始切片：轮廓正确，数字位置有轻微偏差，指针时间错误。得分：1/3。</div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[14px] font-bold text-slate-800">NPI 神经精神问卷</div>
                    <div className="text-[14px] font-bold text-amber-600">14分</div>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-3">测评时间：最近一次</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[13px] p-2 bg-slate-50 rounded-[8px]">
                      <span className="text-slate-700">妄想 (Delusions)</span>
                      <span className="font-bold text-slate-800">频度: 2, 严重度: 2</span>
                    </div>
                    <div className="flex justify-between text-[13px] p-2 bg-slate-50 rounded-[8px]">
                      <span className="text-slate-700">夜间行为 (Nighttime Behaviors)</span>
                      <span className="font-bold text-rose-600">频度: 4, 严重度: 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowQrModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[24px] p-6 shadow-2xl w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[18px] font-bold text-slate-800">医生工作站扫码</h3>
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="aspect-square w-full bg-slate-50 rounded-[16px] border border-slate-200 flex items-center justify-center mb-6">
                <QrCode className="w-32 h-32 text-slate-800" />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-[14px] text-slate-600 font-medium">请医生使用工作站扫码</p>
                <p className="text-[12px] text-slate-400">扫码后医生可查看完整的全景数字病历及原始数据</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
