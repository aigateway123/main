import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini on Server Side
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. Using smart simulation mode.");
}

// Helper to call Gemini with schema or fallback
async function callGemini(prompt: string, schema: any, systemInstruction?: string) {
  if (!aiClient) {
    throw new Error("No Gemini API client initialized. Please set GEMINI_API_KEY in Secrets.");
  }
  try {
    const config: any = {
      responseMimeType: "application/json",
      responseSchema: schema,
    };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: config,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    return JSON.parse(text);
  } catch (err: any) {
    console.error("Gemini API call failed:", err);
    throw err;
  }
}

// 1. 爆文拆解 (Post Dissection) Endpoint
app.post("/api/gemini/dissect", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing Xiaohongshu url" });
  }

  const systemInstruction = "You are an elite product director and veteran Xiaohongshu growth hacker. Analyze explosive content structures.";
  const prompt = `Please analyze the Xiaohongshu post at URL/Topic: "${url}". If the URL is simulated or standard, perform a high-quality analysis of a typical viral post in that general category. Provide a complete, structured analysis report containing: a viral hook Title, the simulated Post Content body, and structured analysis of the title structure, opening hooks, content layout, emotional triggers, comment tactics, and conversion drivers. Write the response in Chinese.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Simulated or actual explosive title with emojis" },
      content: { type: Type.STRING, description: "Detailed viral content body copy with Xiaohongshu layout and emojis" },
      analysis: {
        type: Type.OBJECT,
        properties: {
          titleStructure: { type: Type.STRING, description: "How the title uses hooks, curiosity, pain points, or urgency" },
          hookStructure: { type: Type.STRING, description: "Analysis of the opening 3 seconds hook and visual focus" },
          bodyStructure: { type: Type.STRING, description: "Analysis of the storytelling flow or informative layout" },
          emotionTriggers: { type: Type.STRING, description: "Emotional triggers deployed (anxiety, aspiration, curiosity, vanity)" },
          commentTactics: { type: Type.STRING, description: "Comment section guide tactics, sticky pins, simulated Q&A" },
          conversionDrivers: { type: Type.STRING, description: "Leads/sales funnel conversion tactics shown in post" }
        },
        required: ["titleStructure", "hookStructure", "bodyStructure", "emotionTriggers", "commentTactics", "conversionDrivers"]
      }
    },
    required: ["title", "content", "analysis"]
  };

  try {
    if (!aiClient) {
      // Return beautiful precomputed simulation if no key
      return res.json({
        title: "🔥 救命！这套【自媒体爆文模板】太狂了！7天涨粉1W+",
        content: "宝子们！今天真憋不住了！😭\n作为一个普通打工人，摸鱼测试了一个月小红书，竟然发现有一套起号底层公式！\n只要往里填内容，文章点赞全破千！\n\n💡【爆粉公式公开】\n1. 前3秒一定要制造痛点：‘你是不是也每天加班还存不到钱？’\n2. 给出意想不到的数字反差：‘一个普通前台，如何靠副业月入5W+’\n3. 正文一定要‘步骤化’：步骤一、步骤二，别写一坨，多用Emoji！\n\n赶紧收藏这篇，别等下架了再来后悔！👇\n#小红书运营 #自媒体干货 #搞钱路子 #干货分享",
        analysis: {
          titleStructure: "【口语化极度情绪词(新式惊叹)】 + 【巨大痛点/核心收益】 + 【极短确定性结果】。例如‘救命’、‘太狂了’能瞬间抓住眼球。",
          hookStructure: "开篇‘憋不住了’+‘流泪表情’制造即时悬念，第二句交代‘普通人测试成功’降低读者防备，建立极高信任感。",
          bodyStructure: "经典‘总-分-总’。首段情绪切入，中段提供具体的步骤1、2、3并用符号段落化，末尾设计‘催促收藏’防止跳失。",
          emotionTriggers: "击中读者的‘职场焦虑’和‘搞钱渴望’，通过‘打工人逆袭’的故事外壳来激发群体认同感和行动力。",
          commentTactics: "置顶评论：‘加了干货表格在后台，回复【起号】发给你’。通过福利钩子提高互动率并洗粉。",
          conversionDrivers: "后端导流链路闭环。利用评论区引导词进行私信卡片推送，把公域高意向创作者直接沉淀入私信池内。"
        }
      });
    }

    const result = await callGemini(prompt, schema, systemInstruction);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to process dissection" });
  }
});

// 2. AI选题工厂 (Topic Factory) Endpoint
app.post("/api/gemini/topics", async (req, res) => {
  const { industry, keyword, targetAudience } = req.body;
  
  const systemInstruction = "You are a professional Xiaohongshu traffic expert and digital marketer. Generate highly clickable viral topics.";
  const prompt = `Generate 5 distinctive explosive topics for: Industry: "${industry || 'General'}", Keywords: "${keyword || 'Hot'}", Target Audience: "${targetAudience || 'Any'}". 
  For each topic, evaluate:
  - "title": click-worthy viral headline
  - "angle": unique content angle/hook
  - "explosiveIndex": integer 60-99 (traffic potential)
  - "competitionRate": integer 10-90 (difficulty rate, lower is better)
  - "conversionPotential": integer 50-99 (leads potential)
  - "hook": the first sentence to hook readers
  Format in Chinese with appropriate emojis.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      topics: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            angle: { type: Type.STRING },
            explosiveIndex: { type: Type.INTEGER },
            competitionRate: { type: Type.INTEGER },
            conversionPotential: { type: Type.INTEGER },
            hook: { type: Type.STRING }
          },
          required: ["title", "angle", "explosiveIndex", "competitionRate", "conversionPotential", "hook"]
        }
      }
    },
    required: ["topics"]
  };

  try {
    if (!aiClient) {
      return res.json({
        topics: [
          {
            title: `💡 建议收藏！给${industry || '创作者'}的5大逆袭搞钱指南`,
            angle: "利用反差感，讲述普通人如何利用信息差实现超越，给出具有诱惑性的结论。",
            explosiveIndex: 96,
            competitionRate: 25,
            conversionPotential: 92,
            hook: "普通人逆袭唯一的出路，就是比别人早知道这3个行业底层信息差！"
          },
          {
            title: `😱 避坑！90%的${targetAudience || '新手'}都踩过的这几个致命雷区`,
            angle: "反向否定法。用痛点加警示的方式，让受众主动校验自己是否犯错。",
            explosiveIndex: 91,
            competitionRate: 35,
            conversionPotential: 85,
            hook: "真别乱来了！为什么你累死累活，粉丝数和阅读量却还是一动不动？"
          },
          {
            title: `⏱️ 终极懒人包：每天10分钟搞定${keyword || '爆款内容'}的提效工具`,
            angle: "效率提速流。解决现代人时间不够、精力不够的问题，极具保存转发率。",
            explosiveIndex: 88,
            competitionRate: 40,
            conversionPotential: 80,
            hook: "收藏这一期！带你盘盘我自用两年的自动提效神器，彻底解放双手！"
          },
          {
            title: `🤫 行业内幕：为什么我不建议你盲目跟风做${keyword || '热门赛道'}`,
            angle: "观点争议流。打破常识，输出具有深度的批判型见解，拉动评论区高烈度吐槽和辩论。",
            explosiveIndex: 93,
            competitionRate: 20,
            conversionPotential: 89,
            hook: "千万别听那些大V吹嘘了，如果现在还无脑冲这个赛道，就是在交智商税..."
          },
          {
            title: `🔥 10万赞复盘！我把搞懂的底层逻辑写成了这份一页纸极简大地图`,
            angle: "资源赠送，价值锚定法。提供实打实的工具文档包，大幅拉长互动停留时长。",
            explosiveIndex: 97,
            competitionRate: 15,
            conversionPotential: 95,
            hook: "今天不废话，我把我团队2年来操盘过百个爆款账号的底层白皮书直接奉上！"
          }
        ]
      });
    }

    const result = await callGemini(prompt, schema, systemInstruction);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate topics" });
  }
});

// 3. 内容生成中心 (Content Generation) Endpoint
app.post("/api/gemini/content", async (req, res) => {
  const { industry, product, style, length, channel, contentType } = req.body;

  const systemInstruction = "You are a master copywriter specialized in Xiaohongshu (RED) and viral video scripts. You craft perfectly formatted social copy with appropriate emojis and bullet points.";
  const prompt = `Write high-converting Xiaohongshu content based on these params:
  - Industry/Topic: "${industry || 'General'}"
  - Product/Core Message: "${product || 'None'}"
  - Tone/Style: "${style || 'Witty/Expert'}"
  - Approximate word count: ${length || 400}
  - Platform/Channel: "${channel || 'Xiaohongshu'}"
  - Output requested type: "${contentType || 'copy'}" (Can be "copy" for post, "script" for short video, "cover" for cover headlines, "comments" for viral scripts).

  Please return:
  - "titleOptions": List of 3 magnetic clickable titles
  - "bodyText": The complete generated content body formatted elegantly in Markdown with emojis and line breaks.
  - "tags": List of 5 viral hashtags
  - "coverText": Suggestions for visual keywords or title text overlays to put on the cover image
  - "suggestedImages": List of 2 detail descriptions for background images or visual scene descriptions.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      titleOptions: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      bodyText: { type: Type.STRING },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      coverText: { type: Type.STRING },
      suggestedImages: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["titleOptions", "bodyText", "tags", "coverText", "suggestedImages"]
  };

  try {
    if (!aiClient) {
      return res.json({
        titleOptions: [
          "🔥 惊掉下巴！原来大V都在偷偷用这个神级公式写爆文！",
          "别怪我没提醒你！小白做自媒体最容易亏死的3大巨坑",
          "纯干货！手把手带你用一套极简闭环实现自动涨粉获客"
        ],
        bodyText: `宝子们！快停下你那毫无逻辑的疯狂发文！😭\n\n很多人自媒体做不起来，不是因为不够勤快，而是因为根本没有建立一个**能自动咬合的轮子**！⚙️\n\n今天把这套我团队私用的「三步螺旋涨粉法」彻底说透，学不会算我输：\n\n📌 **第一步：建立极致定位钩子**\n别再写‘什么都懂的博主’了。要把客群定位精准到特定的细节人物。比如：别做‘搞钱博主’，要做‘教大二考研党如果通过副业提效50%的自律师姐’。定义范围缩得越细，用户心智占领越快！\n\n📌 **第二步：设置评论高潮互动**\n评论区不仅是聊天的，更是引流和做数据的阵地！在正文适当留下诱钩，比如‘私信123送我整理了3个月的行业提效底层飞书表’，直接刺激高互动。\n\n📌 **第三步：通过反馈循环优化**\n不要每天只看点赞数。要看「点击率」和「停留时间」。标题起得好不好决定了点击，正文写得硬不硬核决定了停留。\n\n💡 听劝，从今天开始放弃日更自燃，先用这套底层飞轮精修3篇内容看效果！\n\n大家关于这个步骤有什么疑问，在评论区敲下暗号【3步法】，我挑10位伙伴手把手诊断！👇`,
        tags: ["#自媒体工具", "#爆款训练营", "#小红书搞钱", "#运营提效", "#爆款逻辑"],
        coverText: "左侧大字：‘听劝！放弃日更自燃’\n右侧高亮标签：‘3步套用公式 涨粉其实不算难’",
        suggestedImages: [
          "一张极简科技感对比图：左边是一堆杂乱无章的文章，红叉；右边是一个亮眼的极简飞轮流程，绿勾。",
          "个人深色工作台iPad界面高清特写，屏幕上有一个结构清晰的拆解逻辑图，透露专业高级感。"
        ]
      });
    }

    const result = await callGemini(prompt, schema, systemInstruction);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate content" });
  }
});

// 4. 评论成交Agent (Comments Conversions) Endpoint
app.post("/api/gemini/replies", async (req, res) => {
  const { product, price, sellingPoints } = req.body;

  const systemInstruction = "You are a master conversion agent and highly responsive social customer success representative. You write persuasive comments, private messages, and closing scripts.";
  const prompt = `Develop high-converting engagement script options for social platforms based on:
  - Product: "${product || 'Viral Course'}"
  - Price: "${price || '￥199'}"
  - Unique Selling Points: "${sellingPoints || '3 Steps, Direct Template, 1v1 Support'}"

  Provide a structured script suite in Chinese including:
  - "commentsReplies": List of 3 scenario-based clever comment templates (e.g. how to handle "how to buy", "is it useful", "is it too expensive")
  - "dmReplies": List of 3 private message flow steps (Initial greetings, value delivery, pitch)
  - "salesClosing": List of 3 conversational templates displaying high emotional intelligence (EQ) for customer objections.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      commentsReplies: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            reply: { type: Type.STRING }
          },
          required: ["scenario", "reply"]
        }
      },
      dmReplies: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            trigger: { type: Type.STRING },
            reply: { type: Type.STRING }
          },
          required: ["trigger", "reply"]
        }
      },
      salesClosing: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            step: { type: Type.STRING },
            lines: { type: Type.STRING }
          },
          required: ["step", "lines"]
        }
      }
    },
    required: ["commentsReplies", "dmReplies", "salesClosing"]
  };

  try {
    if (!aiClient) {
      return res.json({
        commentsReplies: [
          { scenario: "询问怎么买/求链接", reply: "宝！详细的闭环搞钱链路和入口，我已经悄悄在私信里发给你啦，记得查收右下角气泡哦~" },
          { scenario: "质疑价格/觉得贵", reply: "明白伙伴的顾虑！但说真的，一杯奶茶钱就能拿到团队打磨了2年的现成表格，帮你少走2个月弯路，省下来的精力够赚十倍了，真的很超值！" },
          { scenario: "怀疑自己学不会/小白", reply: "哈哈放心！这是专为零基础设计的，里面全都是傻瓜式填空模板。我们还有1对1专属班主任督学，你只需要复制粘贴就能上手！" }
        ],
        dmReplies: [
          { trigger: "第一句自动打招呼与欢迎", reply: "哈喽宝子！期待跟你一起变强！✨ 这里是你刚刚求的【爆款大地图+提效方案包】链接：aistudio.com/map。这是我和团队3个月复盘的心血，先拿去用，有任何问题随时敲我！" },
          { trigger: "探知核心痛点", reply: "冒昧问下，你现在目前是在做什么赛道呢？或者目前最大的卡点是在选题难上，还是在写文案耗费太多精力呀？我可以帮你简单参考一二。" },
          { trigger: "限时锁客高转化抛钩", reply: "对了包子！如果你也想省时间，可以直接套用我们这套【系统爆粉陪跑班】。支持随时跟大咖老师面对面提问核心方案。今天我们给从爆文雷达进来的前20位伙伴限时优惠￥199（平时原价899）。你可以点这个卡片先看看提大纲介绍哦！" }
        ],
        salesClosing: [
          { step: "痛点同频", lines: "非常理解现在的纠结，大家开始都有这个顾虑，毕竟钱不能乱花。但我相信你想入局一定是想少花时间，多拿结果对不对？" },
          { step: "算账对比", lines: "你想想看，如果跟着市面上的普通网课瞎试，一次投出废片，耗费的时间成本就不止几千。而我们￥199包含了20套经过验证、拿来就能填空的文案地图，还能跟高手抱团取暖，真的是最安全的投资。" },
          { step: "推一把/锁定库存", lines: "今天的名额其实只剩下最后4个了，如果你现在定下来，除了上面的资料，我个人直接再送你一套【小红书违规敏感词自动监控工具包】。你要不要立刻建个档试一下？" }
        ]
      });
    }

    const result = await callGemini(prompt, schema, systemInstruction);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate conversions" });
  }
});

// 5. 数据诊断中心 (Data Diagnostics) Endpoint
app.post("/api/gemini/diagnose", async (req, res) => {
  const { stats, notes } = req.body;

  const systemInstruction = "You are a seasoned Xiaohongshu algorithm engineer and senior growth analytics consultant. Analyze account dashboard metrics and give rigorous recommendations.";
  const prompt = `Diagnose my Xiaohongshu account performance with these input stats:
  - Total Impressions (曝光): ${stats?.views || 50000}
  - Total Click-Through Index/Clicks (展示点击): ${stats?.clicks || 1500}
  - Total Likes & Collects/Interactions (互动量): ${stats?.interactions || 120}
  - Conversion Actions/Messages (私信/成交): ${stats?.conversions || 8}
  - Extra Creator Notes: "${notes || 'No notes added'}"

  Evaluate exactly:
  - "metrics": Calculate exact conversion conversion rates (ctr %, engagementRate %, conversionRate %).
  - "evaluation": Detailed analysis of overall account performance and algorithm health in Chinese.
  - "issues": List of 3 core problems (e.g. low ctr means cover issue; low engagement means content or layout issue; low messages means weak CTAs).
  - "suggestions": List of 3 step-by-step actionable optimization suggestions.
  - "growthPlan": 3-step action roadmap (e.g., Week 1, Week 2, Week 3).`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      metrics: {
        type: Type.OBJECT,
        properties: {
          ctr: { type: Type.NUMBER, description: "Calculate CTR as percentage from impressions and clicks" },
          engagementRate: { type: Type.NUMBER, description: "Calculate engagement rate as percentage from clicks and interactions" },
          conversionRate: { type: Type.NUMBER, description: "Calculate conversion rate as percentage from interactions and conversions" }
        },
        required: ["ctr", "engagementRate", "conversionRate"]
      },
      evaluation: { type: Type.STRING },
      issues: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      suggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      growthPlan: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            phase: { type: Type.STRING },
            action: { type: Type.STRING }
          },
          required: ["phase", "action"]
        }
      }
    },
    required: ["metrics", "evaluation", "issues", "suggestions", "growthPlan"]
  };

  try {
    if (!aiClient) {
      // Calculate basic percentages
      const v = stats?.views || 50000;
      const c = stats?.clicks || 1500;
      const j = stats?.interactions || 120;
      const conv = stats?.conversions || 8;

      const ctr = parseFloat(((c / v) * 100).toFixed(2));
      const engagementRate = parseFloat(((j / c) * 100).toFixed(2));
      const conversionRate = parseFloat(((conv / j) * 100).toFixed(2));

      return res.json({
        metrics: { ctr, engagementRate, conversionRate },
        evaluation: `整体账号呈现「低点击、中互动、低转化」的典型新号病状。点击率(CTR)仅为 ${ctr}% (行业健康水平一般为 8%~12%)，代表笔记在用户推荐页里极易被掠过；互动率达 ${engagementRate}% 说明点击进来的用户能被优质内容留住；但后端的互动到私信转化率偏低，表明缺乏临兵一脚的强力钩子。`,
        issues: [
          "首图和标题的视觉重量不够，被杂乱信息稀释了黄金3秒曝光。",
          "正文内容排版过于紧密，缺少精简数字段落和高辨识度标签引导。",
          "笔记末尾没有强有力的钩子机制，用户看完顺手退出了，没有形成私信或关注转化力。"
        ],
        suggestions: [
          "改版首图模板：聚焦一到两个主色调，使用「大号加粗黑体字 + 小字黄色高亮」增加视觉震慑性。",
          "内容结构拆碎：每两句话强制换行，多用 ✅ 🧨 🤫 💡 等视觉符号来梳理段落逻辑层次。",
          "卡片化文案引流：在最后一段或第一条评论区，用免费干货资料包作为引子强诱导用户发出私信指令。"
        ],
        growthPlan: [
          { phase: "第1阶段（1-5天）视觉改造", action: "设计并迭代3套全新的封面模板，把文字占比控制在40%以内，高饱和高反差，强力把CTR拉过8%分界线。" },
          { phase: "第2阶段（6-10天）留存转化", action: "编写置顶钩子评论，加入‘回复【爆文资料】触发自动私信’机制，提升后置对话链路通畅感。" },
          { phase: "第3阶段（11-15天）数据AB测试", action: "同时推进2组不同结尾CTA的测试。一组给直接解决，一组给资料索取，验证哪种用户路径更偏好转化。" }
        ]
      });
    }

    const result = await callGemini(prompt, schema, systemInstruction);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to process diagnostics" });
  }
});


// Configure Vite Node Server Middleware / Production Build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
