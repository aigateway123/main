import React, { useState } from "react";
import { AppView } from "../types";
import {
  Settings,
  Users,
  Shield,
  Cpu,
  CreditCard,
  CheckCircle,
  Plus,
  Trash2,
  Lock,
  ExternalLink,
  ChevronRight,
  Globe
} from "lucide-react";

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<"team" | "models" | "billing">("team");

  // Mock members list
  const [members, setMembers] = useState([
    { name: "张小豪", role: "MCN 增长合伙人 (Owner)", email: "zhang@viralmaker.com", status: "Active" },
    { name: "林妙儿", role: "文案主编 (Writer)", email: "lin@viralmaker.com", status: "Active" },
    { name: "陈大川", role: "带货团队投手 (Advertiser)", email: "chen@viralmaker.com", status: "Pending" }
  ]);

  const [newMemName, setNewMemName] = useState("");
  const [newMemRole, setNewMemRole] = useState("运营经理 (Ops Specialist)");
  const [newMemEmail, setNewMemEmail] = useState("");

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName || !newMemEmail) return;
    setMembers([
      ...members,
      { name: newMemName, role: newMemRole, email: newMemEmail, status: "Pending" }
    ]);
    setNewMemName("");
    setNewMemEmail("");
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  // Billing Plans simulator State
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "pro" | "enterprise">("pro");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-pink-500" />
          系统与企业级设置 Settings
        </h2>
        <p className="text-xs text-zinc-400">
          管理机构子账户分配、模型首发配流路由、API 密钥可用状态检验检测，以及企业成长升级付费套餐。
        </p>
      </div>

      {/* Grid: Toggles (Left 3 cols), Content Box (Right 9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Toggle menus (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-1.5 p-3 rounded-xl bg-[#0c0c0e] border border-zinc-900">
          {[
            { id: "team", label: "团队与子账号分配", icon: Users },
            { id: "models", label: "大语言模型首发路由", icon: Cpu },
            { id: "billing", label: "订阅套餐与商户支付", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`settings-tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-zinc-900 text-pink-400 border border-zinc-805 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content detail blocks (9 cols) */}
        <div className="lg:col-span-9 p-5 rounded-xl bg-[#0c0c0e] border border-zinc-800/80">
          {/* TAB 1: Team operations */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-pink-500" />
                  MCN 团队机构子账号管理
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">多子账号协同，支持同时部署十个以上起号矩阵账号</p>
              </div>

              {/* Members stack list */}
              <div className="space-y-2">
                {members.map((mem, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900 flex items-center justify-between font-mono text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-display text-pink-400 font-bold">
                        {mem.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-200">{mem.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                            mem.status === "Active" ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30" : "bg-amber-950/30 text-amber-400 border border-amber-900/30"
                          }`}>
                            {mem.status === "Active" ? "激活" : "受邀"}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{mem.email} • {mem.role}</p>
                      </div>
                    </div>

                    <button
                      id={`remove-member-btn-${idx}`}
                      onClick={() => handleRemoveMember(idx)}
                      className="p-1 px-2.5 rounded bg-zinc-950 hover:bg-rose-950/20 border border-zinc-900 hover:border-rose-900/30 text-[10px] text-zinc-500 hover:text-rose-400 cursor-pointer transition-all flex items-center gap-1 font-sans"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>移出</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add form */}
              <form onSubmit={handleAddMemberSubmit} className="p-4 rounded-lg bg-zinc-950/30 border border-zinc-900 space-y-3">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  邀请新运营伙计 (Invite partner)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newMemName}
                    onChange={(e) => setNewMemName(e.target.value)}
                    placeholder="成员称呼 (如: 甜甜)"
                    className="px-3 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-sans"
                    required
                  />
                  <input
                    type="email"
                    value={newMemEmail}
                    onChange={(e) => setNewMemEmail(e.target.value)}
                    placeholder="邮箱地址 (例如: tian@mcn.com)"
                    className="px-3 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-mono"
                    required
                  />
                  <select
                    value={newMemRole}
                    onChange={(e) => setNewMemRole(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-sans"
                  >
                    <option value="运营主理 (Core Ops Manager)">运营主理 (Core Ops Manager)</option>
                    <option value="文案创作家 (Copy Writer)">文案创作家 (Copy Writer)</option>
                    <option value="电商投放手 (Media Buyer)">电商投放手 (Media Buyer)</option>
                  </select>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="submit"
                    id="add-member-btn"
                    className="px-4 py-1.5 rounded bg-pink-500 hover:bg-pink-600 text-xs font-bold text-white flex items-center gap-1 shadow-lg shadow-pink-500/10 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加受邀成员</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Model Management and API credentials */}
          {activeTab === "models" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-pink-500" />
                  大语言模型及统一云大脑设置
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">管理底层接口路由。系统已针对小红书爆款风格进行多维度专项预调优。</p>
              </div>

              {/* Models status lists */}
              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-900 border-l-2 border-l-emerald-500 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-200 text-xs">Google Gemini 3.5-flash (默认)</span>
                      <span className="text-[9px] bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 px-1 rounded font-semibold">首要主选</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-sans">承担快速选题、心智解剖和对话抗阻模组。反应用时 400-800ms。</p>
                  </div>
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                </div>

                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-90 w-full flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-400 text-xs">DeepSeek V3 (爆款强化)</span>
                      <span className="text-[9px] bg-zinc-900 text-zinc-500 border border-zinc-800 px-1 rounded">可作为热备份</span>
                    </div>
                    <p className="text-zinc-600 text-[10px] font-sans">由小红书千万级高赞文案语料强效微修。针对特定客群痛点更犀利。</p>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                </div>

                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-90 w-full flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-400 text-xs">Claude 3.5 Sonnet (长镜头)</span>
                    </div>
                    <p className="text-zinc-600 text-[10px] font-sans">专用于长视频多镜框分阶台词和极其复杂的商业大推案。客满并发调用时可用。</p>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                </div>
              </div>

              {/* Secrets guide block with no input */}
              <div className="p-4 rounded-lg bg-zinc-950/40 border border-zinc-900 space-y-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-pink-500" />
                  API 密钥及安全规则声明
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  爆款工厂采取**零侵入、纯密闭**的安全机制。系统 API Key 来自平台底层 Secrets 注入。我们承诺不会在浏览器或任何前端明文包内流出、记录您的私密信息。
                </p>
                <div className="pt-2 text-[10px] font-mono text-pink-400 flex items-center gap-1">
                  <span>状态：</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/30">
                    GEMINI_API_KEY 已于云端秘密预装载 (OK)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Pricing & billing package */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-pink-500" />
                  套餐订阅与商户收单系统
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">灵活扩展流量包。支持按单充值以及按月包养模式。</p>
              </div>

              {/* Package cards options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tier 1 */}
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between h-64 cursor-pointer transition-all ${
                    selectedPlan === "standard"
                      ? "bg-zinc-950 border-pink-500/50 shadow-lg shadow-pink-500/5"
                      : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                  }`}
                  onClick={() => setSelectedPlan("standard")}
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">个人极度体验版</p>
                    <p className="text-xl font-extrabold text-white font-display">免费体验</p>
                    <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                      包含每日免费爆文雷达 10 次，AI 文案生成 3 篇。无需绑定商户渠道。
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 font-mono">随时过期体验</span>
                </div>

                {/* Tier 2 */}
                <div
                  className={`p-5 rounded-xl border flex flex-col justify-between h-64 cursor-pointer transition-all relative ${
                    selectedPlan === "pro"
                      ? "bg-zinc-950 border-pink-500 shadow-xl shadow-pink-500/10"
                      : "bg-[#09090b]/80 border-zinc-900 hover:border-zinc-805"
                  }`}
                  onClick={() => setSelectedPlan("pro")}
                >
                  <span className="absolute top-2.5 right-2.5 text-[9px] bg-pink-500 text-white font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wide scale-90">
                    最热首选
                  </span>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wide">机构专业矩阵版</p>
                    <p className="text-xl font-extrabold text-white font-display">￥ 199 <span className="text-xs text-zinc-500 font-normal">/ 月</span></p>
                    <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                      不配比调用上限。畅享 6 大自主 Agent 编排终端训练、批量起号爆文拆析、50条评论截流文案生成。
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-pink-400 font-mono">正在使用当前席位套餐</span>
                </div>

                {/* Tier 3 */}
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between h-64 cursor-pointer transition-all ${
                    selectedPlan === "enterprise"
                      ? "bg-zinc-950 border-pink-500/50 shadow-lg shadow-pink-500/5"
                      : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                  }`}
                  onClick={() => setSelectedPlan("enterprise")}
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">MCN尊贵定制版</p>
                    <p className="text-xl font-extrabold text-white font-display">￥ 899 <span className="text-xs text-zinc-500 font-normal">/ 月</span></p>
                    <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                      支持部署 100+ 子账户，1对1专家运营，专属定制小红书违规卡点自动扫描和API私有代理部署。
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 font-mono">高端尊贵定制席位</span>
                </div>
              </div>

              {/* Checkout Mock panel */}
              <div className="p-4 rounded-lg bg-zinc-950/40 border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">升级 / 续订商户支付结算</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">快捷绑定主流结汇渠道，全自动开具电子增长专票。</p>
                </div>
                <button
                  id="checkout-mock-btn"
                  onClick={() => alert("测试环境已模拟：1秒内极速升级成功，感谢支持！")}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-bold text-white shadow-lg shadow-pink-500/10 cursor-pointer"
                >
                  一键安全结算升级
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
