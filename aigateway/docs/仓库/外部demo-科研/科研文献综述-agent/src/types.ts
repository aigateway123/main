export interface ResearchTopicData {
  id: string;
  topic: string;
  question: string;
  overview: ResearchOverview;
  hotspots: ResearchHotspot[];
  mapNodes: MapNode[];
  gaps: ResearchGap[];
  recommendation: AiRecommendation;
  corePapers: CorePaper[];
  proposalOutline: ProposalOutline;
  experimentSetup: ExperimentSetup;
}

export interface ResearchOverview {
  topic: string;
  totalPapers: number;
  highRelevancePapers: number;
  keyPapers: number;
  mainDirectionsCount: number;
  potentialOpportunitiesCount: number;
  timeRange: string;
  topJournals: string[];
  yearDistribution: { year: number; count: number }[];
}

export interface ResearchHotspot {
  id: string;
  name: string;
  stars: number; // 1 to 5
  ratingText: string;
  heatScore: number; // percentage
  citationCount: number;
  trend: 'up' | 'stable' | 'hot';
  summary: string;
  commonMethods: string[];
  representativeStudies: {
    title: string;
    authors: string;
    venue: string;
    year: number;
    citations: number;
    contribution: string;
  }[];
  currentTrends: string[];
  commonDatasets: string[];
}

export interface MapNode {
  id: string;
  title: string;
  subtitle: string;
  stage: string;
  era: string;
  color: string;
  description: string;
  keyAlgorithms: string[];
  strengths: string[];
  bottlenecks: string[];
  classicPaper: {
    title: string;
    venue: string;
    year: number;
  };
}

export interface ResearchGap {
  id: string;
  opportunityNumber: string;
  title: string;
  currentStatus: string;
  potentialInnovation: string;
  innovationScore: number;
  feasibilityScore: number;
  recommendationStars: number;
  suggestedMethods: string[];
  impactLevel: 'High Impact' | 'Breakthrough' | 'High Feasibility';
}

export interface AiRecommendation {
  recommendedTitle: string;
  backgroundSummary: string;
  baselines: string[];
  newVariables: {
    name: string;
    category: string;
    description: string;
  }[];
  evaluationMetrics: {
    name: string;
    formula: string;
    targetValue: string;
    description: string;
  }[];
}

export interface CorePaper {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  citations: number;
  doi: string;
  tags: string[];
  abstract: string;
  keyContribution: string;
  bibtex: string;
}

export interface ProposalOutline {
  title: string;
  background: string[];
  keyScientificProblems: string[];
  technicalRoute: string[];
  majorInnovations: string[];
  expectedMilestones: { phase: string; goal: string }[];
}

export interface ExperimentSetup {
  taskDefinition: string;
  datasetPrep: string[];
  modelArchitecture: string[];
  ablationStudies: { group: string; configuration: string; purpose: string }[];
  hyperparameters: { param: string; value: string; note: string }[];
  pytorchSnippet: string;
}
