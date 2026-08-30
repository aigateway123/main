export enum AppView {
  DASHBOARD = "dashboard",
  RADAR = "radar",
  DISSECT = "dissect",
  TOPICS = "topics",
  GENERATION = "generation",
  REPLIES = "replies",
  DIAGNOSTICS = "diagnostics",
  ASSETS = "assets",
  AGENT_HUB = "agent_hub",
  SETTINGS = "settings"
}

export interface StatsBlock {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface RadarPost {
  id: string;
  title: string;
  cover: string;
  likes: number;
  collects: number;
  comments: number;
  date: string;
  category: string;
  url: string;
}

export interface DissectReport {
  title: string;
  content: string;
  analysis: {
    titleStructure: string;
    hookStructure: string;
    bodyStructure: string;
    emotionTriggers: string;
    commentTactics: string;
    conversionDrivers: string;
  };
}

export interface TopicIdea {
  title: string;
  angle: string;
  explosiveIndex: number;
  competitionRate: number;
  conversionPotential: number;
  hook: string;
  isFavorite?: boolean;
}

export interface GeneratedContent {
  titleOptions: string[];
  bodyText: string;
  tags: string[];
  coverText: string;
  suggestedImages: string[];
}

export interface ConversionsPack {
  commentsReplies: Array<{ scenario: string; reply: string }>;
  dmReplies: Array<{ trigger: string; reply: string }>;
  salesClosing: Array<{ step: string; lines: string }>;
}

export interface DiagnosticsResult {
  metrics: {
    ctr: number;
    engagementRate: number;
    conversionRate: number;
  };
  evaluation: string;
  issues: string[];
  suggestions: string[];
  growthPlan: Array<{ phase: string; action: string }>;
}

export interface Asset {
  id: string;
  title: string;
  type: "copy" | "topic" | "script" | "image" | "preset";
  category: string;
  tags: string[];
  content: string;
  createdAt: string;
}

export interface AgentLog {
  timestamp: string;
  agent: string;
  status: "idle" | "running" | "completed" | "failed";
  message: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle" | "paused";
  tasksExecuted: number;
  successRate: string;
  logs: string[];
}
