// File: src/services/triageEngine.ts
import { RiskLevel, MedicalEquipment, ClinicEntity, TriageResult } from '../interfaces/triage';
import { DiseaseTag } from '../configs/constants';

// Mock 基层医疗机构数据库
const MOCK_CLINICS: ClinicEntity[] = [
  {
    id: 'c_001',
    name: '高新区第一社区卫生服务中心',
    distanceKm: 1.2,
    address: '高新区天府大道中段 111 号',
    equipmentList: [MedicalEquipment.EEG],
    tags: ['社区中心', '医保定点']
  },
  {
    id: 'c_002',
    name: '成都市第七人民医院 (天府院区)',
    distanceKm: 3.5,
    address: '双流区双兴大道 1188 号',
    equipmentList: [MedicalEquipment.MRI_1_5T, MedicalEquipment.MRI_3_0T, MedicalEquipment.CT],
    tags: ['三级甲等', '综合医院']
  },
  {
    id: 'c_003',
    name: '武侯区玉林社区卫生服务中心',
    distanceKm: 2.1,
    address: '武侯区玉林南路 3 号',
    equipmentList: [],
    tags: ['社区中心', '全科门诊']
  },
  {
    id: 'c_004',
    name: '四川大学华西医院 (主院区)',
    distanceKm: 5.8,
    address: '武侯区国学巷 37 号',
    equipmentList: [MedicalEquipment.MRI_1_5T, MedicalEquipment.MRI_3_0T, MedicalEquipment.EEG, MedicalEquipment.CT],
    tags: ['三级甲等', '国家级中心']
  }
];

export class TriageEngine {
  /**
   * 核心算法：基于量表答案与病种计算风险等级
   * 这里使用 Mock 逻辑：假设答案中包含特定高危选项则判定为红灯，否则绿灯。
   */
  private calculateRisk(answers: Record<string, any>, diseaseTag: string): RiskLevel {
    // 强触发逻辑：如果 CDR 记忆力得分为 3 (极严重)，直接红灯
    if (diseaseTag === DiseaseTag.AD && answers['q_memory'] >= 2) {
      return RiskLevel.RED;
    }
    
    // 强触发逻辑：如果癫痫发作为全身强直阵挛，直接红灯
    if (diseaseTag === DiseaseTag.EPILEPSY && 
       (answers['q_generalized_motor_detail'] === 'TONIC_CLONIC' || 
        answers['q_focal_motor_type'] === 'FOCAL_TO_BILATERAL_TONIC_CLONIC')) {
      return RiskLevel.RED;
    }

    // 默认 Mock 逻辑：如果有答案，随机给个黄灯测试绿通，否则绿灯
    const hasAnswers = Object.keys(answers).length > 0;
    return hasAnswers ? RiskLevel.YELLOW : RiskLevel.GREEN;
  }

  /**
   * 核心算法：基于设备强校验的 LBS 匹配
   */
  private fetchNearbyClinics(requiredEquipment: MedicalEquipment): ClinicEntity | undefined {
    // 1. 强过滤：必须包含指定设备
    const validClinics = MOCK_CLINICS.filter(clinic => 
      clinic.equipmentList.includes(requiredEquipment)
    );

    // 2. 排序：按距离由近到远
    validClinics.sort((a, b) => a.distanceKm - b.distanceKm);

    // 3. 返回最近的一家
    return validClinics.length > 0 ? validClinics[0] : undefined;
  }

  /**
   * 主调度总线：生成分诊报告与绿通凭证
   */
  public async generateTriageReport(answers: Record<string, any>, diseaseTag: string): Promise<TriageResult> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    const riskLevel = this.calculateRisk(answers, diseaseTag);

    if (riskLevel === RiskLevel.GREEN) {
      return {
        riskLevel,
        diseaseTag,
        suggestionTitle: '暂无高危风险',
        suggestionDetail: '您的脑健康状况良好。建议开通线上基础健康会员，获取日常脑力训练与定期随访服务。'
      };
    }

    // 中高风险，触发绿通逻辑
    let requiredEquipment: MedicalEquipment;
    if (diseaseTag === DiseaseTag.AD) {
      requiredEquipment = MedicalEquipment.MRI_1_5T; // AD 强依赖核磁
    } else {
      requiredEquipment = MedicalEquipment.EEG; // 癫痫/其他默认依赖脑电图
    }

    const recommendedClinic = this.fetchNearbyClinics(requiredEquipment);
    const neuroPassCode = `NP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return {
      riskLevel,
      diseaseTag,
      suggestionTitle: riskLevel === RiskLevel.RED ? '检测到高危风险信号' : '建议进行线下专科筛查',
      suggestionDetail: `根据您的测评结果，系统已为您匹配具备 [${requiredEquipment}] 检查能力的就近医疗机构。请凭此 Neuro-Pass 享受优先通道。`,
      neuroPassCode,
      recommendedClinic,
      requiredEquipment
    };
  }
}

export const triageEngine = new TriageEngine();
