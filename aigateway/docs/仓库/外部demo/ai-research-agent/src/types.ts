export type AgentRole = 'orchestrator' | 'literature' | 'analysis' | 'coding' | 'reviewer';

export type AgentStatusType = 'waiting' | 'running' | 'completed' | 'error';

export interface AgentInfo {
  id: AgentRole;
  name: string;
  enName: string;
  role: string;
  iconName: string;
  status: AgentStatusType;
  currentTask: string;
  progress: number;
  completedTasks: string[];
  logs: Array<{
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'process' | 'warning';
  }>;
}

export interface InterAgentMessage {
  id: string;
  from: AgentRole;
  to: AgentRole;
  content: string;
  timestamp: string;
  artifactType?: 'literature_packet' | 'gap_matrix' | 'baseline_code' | 'review_score';
}

export interface StarRating {
  researchValue: number; // 1-5
  innovationSpace: number; // 1-5
  dataAvailability: number; // 1-5
  experimentDifficulty: number; // 1-5
}

export interface ResearchOpportunity {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  ratings: StarRating;
  description: string;
  keyChallenges: string[];
  breakthroughPoint: string;
  recommendedDataset: string;
  recommendedModels: string[];
  expectedImpact: string;
  tags: string[];
}

export interface RecommendedScheme {
  researchQuestion: string;
  hypothesis: string;
  baselineModels: Array<{
    name: string;
    category: string;
    strength: string;
    weakness: string;
  }>;
  addedVariables: Array<{
    name: string;
    category: string;
    importance: string;
    source: string;
  }>;
  evaluations: Array<{
    metric: string;
    fullName: string;
    description: string;
    targetValue: string;
  }>;
  technicalRoadmap: Array<{
    step: string;
    title: string;
    methods: string;
  }>;
}

export interface ReportSection {
  number: number;
  title: string;
  enTitle: string;
  summary: string;
  content: string;
  highlights?: string[];
}

export interface ResearchReport {
  title: string;
  subtitle: string;
  generatedDate: string;
  authors: string[];
  abstract: string;
  sections: ReportSection[];
  references: Array<{
    id: number;
    title: string;
    authors: string;
    venue: string;
    year: number;
    doi?: string;
  }>;
}

export interface LiteratureItem {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  citations: number;
  relevanceScore: number;
  coreContribution: string;
  limitations: string;
  bibtex: string;
  tags: string[];
}

export interface ExperimentSchemeDetail {
  title: string;
  datasetPreprocessing: string[];
  ablationStudies: Array<{
    component: string;
    baselineSetup: string;
    proposedSetup: string;
    expectedOutcome: string;
  }>;
  hyperparameters: Array<{
    param: string;
    range: string;
    defaultVal: string;
  }>;
  hardwareRequirement: string;
}

export interface CodingExperimentDetail {
  framework: string;
  pythonVersion: string;
  files: Array<{
    filename: string;
    language: string;
    description: string;
    code: string;
  }>;
}

export interface MilestoneItem {
  stage: string;
  duration: string;
  objective: string;
  deliverables: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ResearchAnalysisData {
  topic: string;
  opportunities: ResearchOpportunity[];
  recommendedScheme: RecommendedScheme;
  report: ResearchReport;
  literatureList: LiteratureItem[];
  experimentDetail: ExperimentSchemeDetail;
  codingDetail: CodingExperimentDetail;
  milestones: MilestoneItem[];
}
