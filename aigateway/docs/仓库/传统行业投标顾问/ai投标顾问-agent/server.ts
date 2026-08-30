import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // 1. Analyze Tender Document Pipeline
  app.post('/api/analyze-tender', async (req, res) => {
    try {
      const { tenderText, tenderTitle, companyProfile } = req.body;
      if (!tenderText || typeof tenderText !== 'string') {
        return res.status(400).json({ error: '请提供有效的招标文件文本内容' });
      }

      const genAI = getGenAI();
      if (!genAI) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY 未配置，请在设置中配置密钥，或直接选择预置的真实行业标书案例进行体验。',
        });
      }

      const prompt = `你是一名拥有15年招投标咨询经验的顶级「AI投标顾问 Agent」，服务对象为建筑工程、IT集成、设备制造、医疗器械、安防、政府采购等需要参与招投标的中小企业。

请严格根据用户提供的招标文件内容进行全流程深度解剖。
【绝对遵循的准则】：
1. 不得编造招标文件中不存在的信息。
2. 所有关键判断必须能够追溯到招标文件原文（必须给出 sourceQuote / originalQuote）。
3. 如果企业材料不足以确认，资格和能力匹配必须标记为“待确认”，不得主观假设企业已满足。
4. 废标风险（一票否决项）必须置顶重点警示并给出具体的“原文要求 + 风险解释 + 建议动作”。
5. 必须明确标记技术方案框架中“哪些章节对应评分项”。
6. 给出可量化的投标文件健康度体检及提交前必须解决的Top 10问题清单。
7. 最终给出“AI投标作战报告”并明确判定【建议参与 / 谨慎参与 / 不建议参与】及核心理由。

【招标文件标题/说明】：${tenderTitle || '未命名招标文件'}
【用户企业画像/资质背景（如提供）】：${JSON.stringify(companyProfile || '标准中小企业')}

【招标文件原文全文/节选】：
${tenderText.slice(0, 30000)}

请输出符合系统要求的 JSON 格式（确保字段完整、数据结构严密）。`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: `你是一个专业的中国招投标合规与策略顾问。请始终以结构化、严谨、客观且具备强实战操作性的中文JSON返回。
返回的JSON对象必须包含以下顶层字段：
- overview: { projectName, tenderer, projectCode, projectType, budget, submissionDeadline, bidOpeningTime, deliveryPeriod, bidBond, evaluationMethod, coreSummary, sourceFile, fileIntegrityNote }
- qualifications: array of { id, category, requirement, status ('已满足' | '待确认' | '不满足'), riskLevel ('high' | 'medium' | 'low'), supplementNeeded, sourceQuote }
- risks: array of { id, title, riskLevel ('high' | 'medium' | 'low'), category, originalQuote, riskExplanation, suggestedAction }
- evaluationScores: array of { id, name, category, maxScore (number), criteria, currentStatus, expectedScore (number), improvementPotential (number), improvementTips }
- strategy: { mustPassItems: string[], coreScoringItems: string[], competitiveGapItems: string[], bonusItems: string[], actionableTactics: array of { title, detail, estimatedGain, priority ('high'|'medium'|'low') } }
- capabilityMatrix: array of { id, requirement, companyCapability, matchScore (number 0-100), gap, suggestion, status ('fully_matched' | 'partially_matched' | 'gap_found') }
- combatTasks: array of { id, task, owner, deadline, priority ('high'|'medium'|'low'), status ('pending'|'in_progress'|'completed'), note }
- proposalOutline: array of { id, chapterNumber, title, description, correspondsToScoreItem, scoreWeight, keyRequirements: string[] }
- healthCheck: { healthScore (number), highRiskCount, mediumRiskCount, lowRiskCount, summary, dimensionChecks: { qualification, commercial, technical, scoreCoverage, formatting, consistency }, top10Issues: array of { rank, category, issue, severity, location, fixAdvice } }
- finalReport: { projectName, recommendation ('recommend'|'caution'|'not_recommend'), coreReasons: { qualificationMatchRate, experienceMatchRate, expectedScore, maxScore, primaryStrength, primaryWeakness, maxDisqualificationRisk, maxScoreOpportunity }, strategicVerdict, timestamp }`,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        parsed.id = 'custom-' + Date.now();
        parsed.timestamp = new Date().toLocaleString('zh-CN');
        return res.json(parsed);
      } catch (err) {
        console.error('JSON parse error from Gemini output:', text);
        return res.status(500).json({ error: 'AI响应解析异常，请重试', rawText: text });
      }
    } catch (error: any) {
      console.error('Analyze tender error:', error);
      return res.status(500).json({ error: error.message || '分析过程发生错误' });
    }
  });

  // 2. Interactive AI Bidding Consultant Chat
  app.post('/api/chat-consultant', async (req, res) => {
    try {
      const { message, tenderContext, chatHistory } = req.body;
      const genAI = getGenAI();
      if (!genAI) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY 未配置，请在设置中配置 API Key。',
        });
      }

      const systemPrompt = `你是一名拥有15年招投标咨询与法律合规实战经验的顶级「AI投标顾问 Agent」。
当前用户正在就一份具体的招标文件向你提问。
【原则】：
1. 严禁瞎编，所有回答尽量追溯到招标文件要求与通用政府采购/招投标法规（如《招标投标法》《政府采购法》）。
2. 若招标文件未提及，务必客观指出“招标文件中未明确”，并指导用户在答疑澄清截止时间前向招标人/招标代理发起书面澄清函。
3. 重点突出：废标红线、防扣分策略、证明材料合规细节、盖章签署规范。

【当前招标文件背景摘要】：
项目名称：${tenderContext?.overview?.projectName || '未命名项目'}
招标人：${tenderContext?.overview?.tenderer || '未知'}
预算：${tenderContext?.overview?.budget || '未知'}
评标方法：${tenderContext?.overview?.evaluationMethod || '综合评分法'}
截止时间：${tenderContext?.overview?.submissionDeadline || '未知'}
保证金：${tenderContext?.overview?.bidBond || '未知'}
核心总结：${tenderContext?.overview?.coreSummary || ''}
废标风险摘要：${JSON.stringify(tenderContext?.risks?.map((r: any) => r.title) || [])}
`;

      const contents: any[] = [];
      if (Array.isArray(chatHistory)) {
        for (const msg of chatHistory.slice(-6)) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await genAI.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        },
      });

      return res.json({ reply: response.text });
    } catch (error: any) {
      console.error('Chat consultant error:', error);
      return res.status(500).json({ error: error.message || '对话服务异常' });
    }
  });

  // 3. One-Click Draft Generator for Technical Proposal Section
  app.post('/api/generate-proposal-section', async (req, res) => {
    try {
      const { chapterTitle, chapterDescription, keyRequirements, tenderOverview, customRequirements } = req.body;
      const genAI = getGenAI();
      if (!genAI) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY 未配置，请配置密钥。',
        });
      }

      const prompt = `请作为资深投标方案主笔工程师，为以下投标文件章节撰写专业、规范、符合评标专家偏好的「技术方案正式正文草稿」：

【项目名称】：${tenderOverview?.projectName || '项目'}
【章节标题】：${chapterTitle}
【章节定位与要求】：${chapterDescription}
【响应的关键技术参数与实质性要求】：${(keyRequirements || []).join('； ')}
【用户特定补充要求/企业优势】：${customRequirements || '突出专业性、高可靠性、合规性及清晰的实施步骤'}

【写作规范】：
1. 语言严谨、专业度高，符合国标及招投标技术规范。
2. 包含系统架构/工作流设计、实施步骤、量化指标及保障措施。
3. 重点突出对评分项的无缝呼应，使用清晰的层级标题（1.1, 1.2, 1.3...）与图表文字描述。
4. 字数在 600 - 1000 字左右，结构紧凑。`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          temperature: 0.4,
        },
      });

      return res.json({ content: response.text });
    } catch (error: any) {
      console.error('Proposal generator error:', error);
      return res.status(500).json({ error: error.message || '方案生成失败' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Bidding Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
