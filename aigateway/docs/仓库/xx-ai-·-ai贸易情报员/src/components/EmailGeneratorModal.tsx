import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Sliders, 
  Download, 
  Send, 
  Languages, 
  Building2,
  Mail,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { CompanyLead } from '../types';

interface EmailGeneratorModalProps {
  lead: CompanyLead | null;
  onClose: () => void;
}

export const EmailGeneratorModal: React.FC<EmailGeneratorModalProps> = ({
  lead,
  onClose,
}) => {
  const [tone, setTone] = useState<'problem' | 'professional' | 'cost' | 'tech'>('problem');
  const [language, setLanguage] = useState<'en' | 'bilingual' | 'de' | 'es'>('en');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedSubjectIdx, setSelectedSubjectIdx] = useState(0);

  if (!lead) return null;

  const keyContact = lead.contacts.find(c => c.isKeyDecisionMaker) || lead.contacts[0];
  const contactName = keyContact ? keyContact.name.split(' ')[0] : 'Procurement Team';

  const subjectOptions = [
    `Aluminum Windows & Sliding Doors Supply for ${lead.name} [NFRC / Title 24 Compliant]`,
    `Shortening lead time & reducing fenestration sourcing costs for ${lead.city} projects`,
    `Direct Factory Partnership: Slimline Panoramic Doors & Thermal Break Systems for ${lead.name}`,
  ];

  const getEmailContent = () => {
    if (language === 'bilingual') {
      return `Subject: ${subjectOptions[selectedSubjectIdx]}

Hi ${contactName},

Hope this email finds you well.

We noticed that ${lead.name} has been expanding its high-performance building materials and fenestration product lines in ${lead.region}. We were particularly impressed by your commitment to modern residential and commercial solutions.
(我们注意到 ${lead.name} 在 ${lead.region} 持续扩大高性能建材与门窗产品线，对贵司在现代化商住项目上的专业度印象深刻。)

With North American lead times stretching and strict energy standards (such as Title 24 & Energy Star), finding a agile, certified manufacturing partner is essential. We are a direct manufacturer specializing in:
(针对目前北美交期延长及加州Title 24严苛能效标准的痛点，我们作为源头制造工厂可提供：)

1. Thermal Break Aluminum Systems (U-factor ≤ 0.28, NFRC / AAMA certified)
   (断桥铝合金系统门窗，通过NFRC/AAMA权威认证)
2. Ultra-Slimline Panoramic Sliding & Bi-fold Doors (20mm sightline)
   (极窄边框20mm全景推拉门与超重型折叠门)
3. Direct DDP Door-to-Door Delivery within 25-30 Days Production Cycle
   (25-30天敏捷排产周期，支持DDP门到门海运清关到仓)

We have already completed customs clearance for over 80 containers to the US/Canada this year with zero damage. 
(今年我们已向北美合规交付80余个货柜，拥有成熟的免熏蒸木箱防震包装体系。)

Would you be open for a brief 5-minute introductory call this Thursday, or may I send over our 2026 US Project Spec Catalog & Corner Cut Samples?
(本周四您是否有5分钟简短线上交流？或者我先向您发送2026北美工程选型画册与免费实物切角样块？)

Best regards,

David Chen | VP of Global Business Development
XX AI Fenestration & Architectural Systems
WhatsApp / WeChat: +86 138 0000 8888
Website: https://www.xx-fenestration-ai.com`;
    }

    if (tone === 'cost') {
      return `Subject: ${subjectOptions[selectedSubjectIdx]}

Dear ${contactName},

Greetings from XX Fenestration Systems.

We understand that maintaining healthy distributor margins while meeting demanding delivery schedules in ${lead.region} has become increasingly challenging with domestic lead times averaging 12-16 weeks.

As a tier-1 OEM/ODM manufacturer for North American building distributors, we help companies like ${lead.name} achieve:
• 35% - 45% Direct Cost Savings on high-end thermal break windows and heavy-duty sliding doors.
• Rapid 28-day factory turnaround + stable vessel booking.
• Full compliance with NFRC, AAMA, and Florida Impact standards.

Would you be interested in receiving a comparative quotation based on your typical project takeoff schedules? 

Let me know if we can ship a complimentary set of corner cut samples directly to your ${lead.city} facility.

Warm regards,

David Chen | Export Director
XX Fenestration Systems
Direct: +86 138 0000 8888 | info@xx-fenestration-ai.com`;
    }

    if (tone === 'tech') {
      return `Subject: ${subjectOptions[selectedSubjectIdx]}

Dear ${contactName},

I am reaching out regarding the fenestration specifications and architectural glazing requirements for ${lead.name}'s ongoing developments in ${lead.region}.

Our engineering team specializes in high-thermal-efficiency aluminum profiles and triple-glazed Low-E units engineered specifically for extreme climatic zones:
• Thermal transmittance: U-value ≤ 0.26 BTU/(hr·ft²·°F) / SHGC ≤ 0.22
• Multi-cavity polyamide PA66 thermal barrier with structural silicone injection
• Air infiltration: Class AW-PG70 certified according to AAMA/WDMA/CSA 101/I.S.2/A440

We provide complete AutoCAD / Revit shop drawings and third-party NFRC laboratory test certificates.

Could we schedule a 10-minute engineering introduction, or should I forward our Technical Whitepaper for your architectural team's review?

Best regards,

Technical Sourcing Desk
XX Architectural Systems
engineering@xx-fenestration-ai.com`;
    }

    // Default Problem-solving tone
    return `Subject: ${subjectOptions[selectedSubjectIdx]}

Hi ${contactName},

Hope this email finds you well.

We noticed that ${lead.name} specializes in high-quality building materials and architectural window solutions across ${lead.region}.

Given the current market demand for energy-efficient fenestration complying with Title 24 / Energy Star standards, many distributors are seeking reliable manufacturing partners to bypass local 14-week delivery bottlenecks.

We are a premier fenestration manufacturer with 15+ years of export experience to North America. We provide:
1. Ultra-Slimline Panoramic Sliding & Bi-fold Doors (contemporary minimalist designs)
2. NFRC & AAMA Certified Thermal Break Aluminum Windows
3. 25-Day Fast-Track Production with Direct DDP to your warehouse
4. Zero-risk sample corner cuts delivered to your office in 4 business days

Would you be open for a brief 5-minute call this week to explore if our product catalog fits your upcoming contractor orders?

Best regards,

International Sales Team
XX AI Fenestration & Building Solutions
Phone: +86 138 0000 8888
Website: https://www.xx-fenestration-ai.com`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getEmailContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>AI 定制开发邮件生成器</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Target: {lead.name}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                AI 已自动根据企业画像、采购负责人（{contactName}）及当地行业痛点智能定制话术
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Toolbar: Tone & Language Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tone Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-600 font-semibold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>语气策略:</span>
            </span>
            <button
              onClick={() => { setTone('problem'); handleRegenerate(); }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-xs font-medium ${
                tone === 'problem'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              解决交期痛点 (推荐)
            </button>
            <button
              onClick={() => { setTone('cost'); handleRegenerate(); }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-xs font-medium ${
                tone === 'cost'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              供应链成本优势 (40%利润空间)
            </button>
            <button
              onClick={() => { setTone('tech'); handleRegenerate(); }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-xs font-medium ${
                tone === 'tech'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              技术与认证规范 (NFRC/AAMA)
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value as any); handleRegenerate(); }}
              className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer text-xs"
            >
              <option value="en">English 英文原版 (北美买家偏好)</option>
              <option value="bilingual">English + 中文业务员对照版</option>
              <option value="de">German 德文标准版</option>
              <option value="es">Spanish 西班牙语版</option>
            </select>
          </div>
        </div>

        {/* Alternative Subject Lines */}
        <div className="px-5 py-3 bg-white border-b border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold text-slate-700">A/B测试高打开率主题行 (点击切换):</span>
            <span className="text-[10px] text-blue-600 font-mono font-bold">HIGHEST OPEN RATE: 42.8%</span>
          </div>
          <div className="space-y-1">
            {subjectOptions.map((subj, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSubjectIdx(idx)}
                className={`w-full text-left px-3 py-1.5 rounded-md transition-colors flex items-center justify-between text-xs cursor-pointer ${
                  selectedSubjectIdx === idx
                    ? 'bg-blue-50 border border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="truncate">方案 {idx + 1}: {subj}</span>
                {selectedSubjectIdx === idx && (
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Email Body Preview */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text border-b border-slate-200">
          {isRegenerating ? (
            <div className="py-20 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <div className="text-slate-600 font-semibold">AI 正在重新微调语气与关键词...</div>
            </div>
          ) : (
            getEmailContent()
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>已内置反垃圾邮件协议（SPF/DKIM/DMARC友好的词频与排版）</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleRegenerate}
              className="px-3.5 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>重新生成</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '已复制全部内容' : '一键复制邮件内容'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
