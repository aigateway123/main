import { BiomedicalDataset } from '../types';

/**
 * Generate random gaussian number using Box-Muller transform
 */
function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

/**
 * Preset Dataset 1: Anticancer Drug Targeted Screening Assay
 */
function generateDrugScreeningData(): Array<Record<string, any>> {
  const rows: Array<Record<string, any>> = [];
  const groups = [
    { name: 'Vehicle_Control_0.1%DMSO', meanViab: 99.4, stdViab: 4.2, meanCasp: 1.02, n: 24 },
    { name: 'Standard_Cisplatin_10uM', meanViab: 42.1, stdViab: 5.6, meanCasp: 4.85, n: 24 },
    { name: 'Compound_X_0.1uM', meanViab: 91.8, stdViab: 4.9, meanCasp: 1.34, n: 24 },
    { name: 'Compound_X_1.0uM', meanViab: 68.3, stdViab: 5.1, meanCasp: 2.89, n: 24 },
    { name: 'Compound_X_10.0uM', meanViab: 23.4, stdViab: 4.1, meanCasp: 6.72, n: 24 },
  ];

  let sampleIdx = 1;
  groups.forEach((grp, gIdx) => {
    for (let i = 0; i < grp.n; i++) {
      const plate = `Plate_0${Math.floor(i / 12) + 1}`;
      const wellRow = String.fromCharCode(65 + (i % 8));
      const wellCol = (Math.floor(i / 8) + 1).toString().padStart(2, '0');
      const wellId = `${wellRow}${wellCol}`;

      let viab = Number(gaussianRandom(grp.meanViab, grp.stdViab).toFixed(2));
      let casp = Number(gaussianRandom(grp.meanCasp, grp.meanCasp * 0.12).toFixed(2));
      let atp = Number((viab * 1250 + gaussianRandom(0, 1500)).toFixed(0));
      let od450 = Number((viab * 0.024 + 0.05 + gaussianRandom(0, 0.03)).toFixed(3));

      // Inject 3 distinct lab anomalies matching real experimental pitfalls:
      // Anomaly 1: Pipetting volume double-dispense error in Plate 2
      if (gIdx === 4 && i === 7) {
        viab = 88.9; // Should be ~23.4%
        atp = 112400;
        od450 = 2.18;
      }
      // Anomaly 2: Optical bubble / dye precipitation artifact in Control
      if (gIdx === 0 && i === 18) {
        viab = 184.2; // Absurdly high > 180%
        od450 = 3.95;
      }
      // Anomaly 3: Edge effect evaporation well in Cisplatin
      if (gIdx === 1 && i === 23) {
        viab = 5.2; // Over-dried edge well
        casp = 12.8;
      }

      rows.push({
        Sample_ID: `SMP_DRUG_${sampleIdx.toString().padStart(4, '0')}`,
        Plate_Batch: plate,
        Well_Position: wellId,
        Treatment_Group: grp.name,
        Cell_Viability_Pct: Math.max(0, viab),
        ATP_Luminescence_RLU: Math.max(100, atp),
        Caspase3_7_Activation: Math.max(0.1, casp),
        Optical_Density_450nm: Math.max(0.01, od450),
        Replicate_Num: (i % 3) + 1,
      });

      sampleIdx++;
    }
  });

  return rows;
}

/**
 * Preset Dataset 2: Immuno-Oncology RNA-Seq Transcriptomics (Single/Combination Immunotherapy)
 */
function generateRnaSeqData(): Array<Record<string, any>> {
  const rows: Array<Record<string, any>> = [];
  const groups = [
    { name: 'Control_IgG', cd8: 4.1, ifng: 2.2, pdcd1: 3.1, gzmb: 2.8, foxp3: 5.4, n: 20 },
    { name: 'Anti_PD1_Monotherapy', cd8: 6.8, ifng: 5.1, pdcd1: 7.2, gzmb: 5.9, foxp3: 4.8, n: 20 },
    { name: 'Combination_PD1_CTLA4', cd8: 9.4, ifng: 8.6, pdcd1: 8.9, gzmb: 9.1, foxp3: 2.1, n: 20 },
  ];

  let sampleIdx = 1;
  groups.forEach((grp, gIdx) => {
    for (let i = 0; i < grp.n; i++) {
      let cd8 = Number(gaussianRandom(grp.cd8, 0.65).toFixed(2));
      let ifng = Number(gaussianRandom(grp.ifng, 0.72).toFixed(2));
      let pdcd1 = Number(gaussianRandom(grp.pdcd1, 0.58).toFixed(2));
      let gzmb = Number(gaussianRandom(grp.gzmb, 0.61).toFixed(2));
      let foxp3 = Number(gaussianRandom(grp.foxp3, 0.55).toFixed(2));
      let cytScore = Number(((cd8 + ifng + gzmb) / 3).toFixed(2));
      let rinScore = Number(gaussianRandom(8.8, 0.3).toFixed(1));

      // Inject anomaly: Degraded RNA sample in Combination group
      if (gIdx === 2 && i === 11) {
        rinScore = 3.9; // Heavily degraded
        cd8 = 1.8;
        ifng = 0.9;
        gzmb = 1.1;
        cytScore = 1.27;
      }
      // Inject anomaly: Super-responder / clonal expansion in Anti-PD1
      if (gIdx === 1 && i === 4) {
        ifng = 14.8;
        gzmb = 15.2;
        cytScore = 12.27;
      }

      rows.push({
        BioSample_ID: `RNA_SEQ_TME_${sampleIdx.toString().padStart(3, '0')}`,
        Cohort_Group: grp.name,
        Sequencing_Batch: i < 10 ? 'Batch_Illumina_A' : 'Batch_Illumina_B',
        RIN_Quality_Score: Math.min(10, Math.max(1, rinScore)),
        CD8A_Log2TPM: cd8,
        IFNG_Log2TPM: ifng,
        PDCD1_Log2TPM: pdcd1,
        GZMB_Log2TPM: gzmb,
        FOXP3_Log2TPM: foxp3,
        Cytolytic_Score: cytScore,
      });

      sampleIdx++;
    }
  });

  return rows;
}

/**
 * Preset Dataset 3: Alzheimer's Disease Clinical Biomarkers Cohort
 */
function generateAlzheimerData(): Array<Record<string, any>> {
  const rows: Array<Record<string, any>> = [];
  const groups = [
    { name: 'Healthy_Control', ptau: 14.2, abeta42: 1180, mmse: 29.1, n: 30 },
    { name: 'Mild_Cognitive_Impairment', ptau: 28.6, abeta42: 740, mmse: 24.8, n: 30 },
    { name: 'AD_Dementia', ptau: 52.4, abeta42: 430, mmse: 16.2, n: 30 },
  ];

  let sampleIdx = 1;
  groups.forEach((grp, gIdx) => {
    for (let i = 0; i < grp.n; i++) {
      let ptau = Number(gaussianRandom(grp.ptau, grp.ptau * 0.18).toFixed(1));
      let abeta = Number(gaussianRandom(grp.abeta42, 85).toFixed(1));
      let mmse = Math.min(30, Math.max(0, Math.round(gaussianRandom(grp.mmse, 1.8))));
      let age = Math.round(gaussianRandom(71.5, 5.2));
      let apoe4 = gIdx === 2 ? (Math.random() > 0.3 ? 'Carrier' : 'Non-Carrier') : (Math.random() > 0.8 ? 'Carrier' : 'Non-Carrier');

      // Inject Hemolysis artifact
      if (gIdx === 0 && i === 12) {
        ptau = 129.5; // Contaminated lumbar sample
      }
      // Inject severe atypical early onset
      if (gIdx === 1 && i === 8) {
        ptau = 84.1;
        mmse = 11;
      }

      rows.push({
        Patient_Code: `PT_ALZ_${sampleIdx.toString().padStart(4, '0')}`,
        Diagnostic_Group: grp.name,
        Age_Years: age,
        Gender: i % 2 === 0 ? 'Female' : 'Male',
        ApoE4_Status: apoe4,
        CSF_pTau181_pg_ml: Math.max(2, ptau),
        CSF_Abeta42_pg_ml: Math.max(100, abeta),
        MMSE_Cognitive_Score: mmse,
        Tau_Abeta_Ratio: Number((ptau / abeta).toFixed(4)),
      });

      sampleIdx++;
    }
  });

  return rows;
}

/**
 * Preset Dataset 4: CRISPR Gene Knockout & Apoptosis Kinetics
 */
function generateCrisprData(): Array<Record<string, any>> {
  const rows: Array<Record<string, any>> = [];
  const groups = [
    { name: 'sgControl_NT', meanApop: 6.2, meanCol: 145, n: 25 },
    { name: 'sgGeneX_Target1', meanApop: 38.4, meanCol: 34, n: 25 },
    { name: 'sgGeneX_Target2', meanApop: 44.1, meanCol: 21, n: 25 },
    { name: 'Rescue_cDNA_Vector', meanApop: 11.3, meanCol: 122, n: 25 },
  ];

  let sampleIdx = 1;
  groups.forEach((grp, gIdx) => {
    for (let i = 0; i < grp.n; i++) {
      let apop = Number(gaussianRandom(grp.meanApop, 3.2).toFixed(1));
      let col = Math.max(0, Math.round(gaussianRandom(grp.meanCol, 12)));
      let viability = Number((100 - apop * 1.8 + gaussianRandom(0, 2)).toFixed(1));

      // Inject anomaly: incomplete electroporation / wildtype escapee
      if (gIdx === 2 && i === 19) {
        apop = 7.1; // Failed KO
        col = 138;
        viability = 92.4;
      }

      rows.push({
        Clone_ID: `CLONE_CRISPR_${sampleIdx.toString().padStart(3, '0')}`,
        Knockout_Condition: grp.name,
        Passage_Number: `P${(i % 5) + 3}`,
        AnnexinV_Apoptosis_Pct: Math.max(0.5, apop),
        Colony_Formation_Count: col,
        Relative_Cell_Viability: Math.max(1, viability),
        Cas9_Editing_Efficiency_Pct: gIdx === 0 ? 0 : Number(gaussianRandom(92.5, 3.1).toFixed(1)),
      });

      sampleIdx++;
    }
  });

  return rows;
}

export const PRESET_DATASETS: BiomedicalDataset[] = [
  {
    id: 'drug-screening',
    name: '抗癌小分子化合物靶向筛选与毒力测试 (Anticancer Drug Screening & IC50)',
    category: 'Drug Screening',
    description: '96/384孔板高通量细胞活力 (Cell Viability) 与凋亡酶激活 (Caspase-3/7) 测定数据，包含不同浓度梯度及阴性/阳性对照。',
    sourceInfo: '生物医药国家重点实验室 · 高通量药物筛选平台 (96-Well Luminescence & Spectrophotometry)',
    primaryGroupCol: 'Treatment_Group',
    primaryMetricCol: 'Cell_Viability_Pct',
    idCol: 'Sample_ID',
    batchCol: 'Plate_Batch',
    data: generateDrugScreeningData(),
    suggestedPrompt: '分析不同实验组之间的细胞存活率差异，定位异常孔位数据，并给出统计检验与可复现代码。',
  },
  {
    id: 'rnaseq-tme',
    name: '肿瘤免疫微环境转录组 RNA-Seq 差异表达 (Immuno-Oncology RNA-Seq)',
    category: 'RNA-Seq Transcriptomics',
    description: '单抗/联用免疫治疗肿瘤微环境中 CD8+ T 细胞浸润、IFN-γ 及细胞毒性基因表达量 (Log2TPM) 及 RIN 质检指标。',
    sourceInfo: '肿瘤转化医学中心 · Illumina NovaSeq 6000 双端转录组测序',
    primaryGroupCol: 'Cohort_Group',
    primaryMetricCol: 'Cytolytic_Score',
    idCol: 'BioSample_ID',
    batchCol: 'Sequencing_Batch',
    data: generateRnaSeqData(),
    suggestedPrompt: '比较联合用药组与对照组的细胞毒性评分 (Cytolytic Score) 与 IFN-γ 表达差异，排查是否存在 RIN 质检异常样本。',
  },
  {
    id: 'alzheimer-cohort',
    name: '神经退行性疾病临床生物标志物队列 (Alzheimer CSF Biomarkers)',
    category: 'Clinical Biomarkers',
    description: '健康对照组、轻度认知障碍 (MCI) 与阿尔茨海默病 (AD) 患者脑脊液磷酸化 Tau 蛋白 (pTau181) 及 Aβ42 浓度。',
    sourceInfo: '神经内科临床研究中心 · Lumipulse G1200 全自动化学发光免疫分析仪',
    primaryGroupCol: 'Diagnostic_Group',
    primaryMetricCol: 'CSF_pTau181_pg_ml',
    idCol: 'Patient_Code',
    data: generateAlzheimerData(),
    suggestedPrompt: '分析不同认知障碍分期患者 CSF pTau181 的差异显著性，检测是否存在脑脊液红细胞溶血异常样本。',
  },
  {
    id: 'crispr-kinetics',
    name: 'CRISPR-Cas9 靶向敲除增殖与细胞凋亡动力学 (CRISPR KO Viability)',
    category: 'Flow Cytometry / CRISPR',
    description: '靶向敲除候选原癌基因后肿瘤克隆的 Annexin V 流式细胞凋亡率及克隆形成数量 (Colony Formation Count)。',
    sourceInfo: '功能基因组学中心 · BD FACSAria III 流式细胞分选系统',
    primaryGroupCol: 'Knockout_Condition',
    primaryMetricCol: 'AnnexinV_Apoptosis_Pct',
    idCol: 'Clone_ID',
    data: generateCrisprData(),
    suggestedPrompt: '比较不同 sgRNA 靶向敲除克隆的凋亡诱导效果，并找出是否有脱靶或未成功敲除的逃逸样本。',
  },
];
