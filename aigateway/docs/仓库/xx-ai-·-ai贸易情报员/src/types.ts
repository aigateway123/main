export type TabType = 
  | 'home' 
  | 'customers' 
  | 'suppliers' 
  | 'market' 
  | 'competitors' 
  | 'radar' 
  | 'tasks' 
  | 'favorites' 
  | 'history' 
  | 'settings';

export type LeadTier = 'A' | 'B' | 'C';

export interface CompanyLead {
  id: string;
  name: string;
  legalName?: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  companyType: string;
  industry: string;
  establishedYear: number;
  employeeScale: string;
  annualRevenue: string;
  website: string;
  logoInitial: string;
  productMatch: number; // 0 - 100
  purchasePotential: number; // 0 - 100
  overallScore: number; // 0 - 100
  tier: LeadTier;
  recommendedAction: '立即开发' | '重点跟进' | '培育跟进' | '持续观察';
  actionColor: string;
  summary: string;
  isStarred?: boolean;
  
  // Detailed intelligence
  businessPortrait: {
    overview: string;
    targetMarketSegment: string;
    chinaCooperationPotential: string;
    keyHighlights: string[];
  };
  
  productMatchDetails: {
    overall: number;
    categories: {
      name: string;
      percentage: number;
    }[];
    aiVerdict: string[];
  };
  
  scoreBreakdown: {
    productMatch: number;
    companyScale: number;
    marketMatch: number;
    purchasePotential: number;
    cooperationProbability: number;
  };
  
  aiOpportunities: {
    id: string;
    title: string;
    description: string;
    level: '高' | '中高' | '中';
    tag: string;
  }[];
  
  nextSteps: {
    id: number;
    step: string;
    status: 'pending' | 'in_progress' | 'completed';
    recommendedTime: string;
  }[];
  
  contacts: {
    name: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    isKeyDecisionMaker: boolean;
  }[];
  
  informationSources: {
    sourceName: string;
    sourceType: '企业官网' | '海关提单' | '行业目录' | '展会名录' | '商业数据库' | '企业财报';
    sourceDate: string;
    reliability: number;
    linkTitle: string;
    verified: boolean;
  }[];
  
  importData?: {
    hasImportHistory: boolean;
    mainImportOrigin: string[];
    annualImportShipments: number;
    recentCustomsRecord: string;
  };
}

export interface SupplierItem {
  id: string;
  name: string;
  location: string;
  province: string;
  mainProducts: string[];
  establishedYear: number;
  employeeScale: string;
  annualCapacity: string;
  productMatch: number;
  supplierScore: number;
  tier: '优质供应商' | '重点供应商' | '备选供应商';
  certifications: string[];
  priceAdvantage: '极高' | '高' | '中等';
  moq: string;
  leadTime: string;
  oemOdm: string;
  portrait: string;
  advantages: string[];
}

export interface MarketOpportunity {
  id: string;
  region: string;
  country: string;
  opportunityIndex: number;
  marketSize: string;
  growthRate: string;
  mainDemandRegions: string[];
  keyCustomerTypes: string[];
  topProductTrends: string[];
  policySummary: string;
  entryBarrier: string;
  aiRecommendation: string;
}

export interface CompetitorItem {
  id: string;
  name: string;
  country: string;
  marketShare: string;
  priceRange: string;
  productStructure: string[];
  targetChannels: string[];
  coreAdvantages: string[];
  weaknesses: string[];
  ourCompetitiveEdge: string[];
}

export interface CommercialOpportunity {
  id: string;
  title: string;
  companyName: string;
  country: string;
  countryFlag: string;
  industry: string;
  opportunityLevel: 5 | 4 | 3;
  discoveredTime: string;
  demandSummary: string;
  targetProduct: string;
  estimatedVolume: string;
  aiSuggestedAction: string;
  status: 'new' | 'contacted' | 'negotiating';
}

export interface TaskHistoryItem {
  id: string;
  title: string;
  product: string;
  market: string;
  targetClients: string;
  status: 'completed' | 'processing' | 'queued';
  date: string;
  collectedCount: number;
  identifiedCount: number;
  qualifiedCount: number;
  highPotentialCount: number;
  keyLeadsCount: number;
}
