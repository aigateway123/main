import React, { useState } from "react";
import { AppView, Asset } from "../types";
import {
  FolderHeart,
  Search,
  Tag,
  Copy,
  Trash2,
  ExternalLink,
  Plus,
  BookOpen,
  Calendar,
  X,
  FileText,
  Lightbulb,
  Sparkles
} from "lucide-react";

interface AssetLibraryViewProps {
  assets: Asset[];
  onRemoveAsset: (id: string) => void;
  onAddAsset: (asset: Omit<Asset, "id" | "createdAt">) => void;
}

export default function AssetLibraryView({ assets, onRemoveAsset, onAddAsset }: AssetLibraryViewProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "copy" | "topic" | "script" | "preset">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Quick preset fields to add manual note or templates
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<"copy" | "topic" | "script" | "preset">("copy");
  const [newCategory, setNewCategory] = useState("穿搭");

  // Filter conditions
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = activeCategory === "all" || asset.type === activeCategory;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    onAddAsset({
      title: newTitle,
      content: newContent,
      type: newType,
      category: newCategory,
      tags: ["#自定义", `#${newCategory}`]
    });
    setNewTitle("");
    setNewContent("");
    setShowAddForm(false);
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-pink-500" />
            内容资产管理库 (SaaS Vault)
          </h2>
          <p className="text-xs text-zinc-400">
            存储您从爆文雷达、拆解中心、AI选题智造中心生成的每一份高含金量创意。一站式打通标签查找、共享与复制。
          </p>
        </div>

        <button
          id="add-asset-toggle-form"
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/10"
        >
          <Plus className="w-4 h-4" />
          手动收录资产
        </button>
      </div>

      {/* FILTER SEARCH TUBES */}
      <div className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex items-center gap-1.5 bg-[#08080a] p-1 rounded-lg border border-zinc-900 overflow-x-auto scrollbar-none">
          {[
            { id: "all", label: "全部资产" },
            { id: "copy", label: "爆款图文" },
            { id: "topic", label: "主题干货" },
            { id: "script", label: "镜头脚本" },
            { id: "preset", label: "诊断及预设" },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`asset-cat-btn-${cat.id}`}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`shrink-0 px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? "bg-zinc-900 border border-zinc-800 text-pink-400"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500" />
          </span>
          <input
            type="text"
            id="asset-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索资产、行业或特定标签内容..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-950 text-xs border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-mono"
          />
        </div>
      </div>

      {/* ASSET LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            id={`asset-card-${asset.id}`}
            className="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-90 w-full hover:border-zinc-800 transition-all flex flex-col justify-between group relative h-64 overflow-hidden"
          >
            <div className="space-y-3 flex-1 overflow-hidden" onClick={() => setSelectedAsset(asset)}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono px-2 py-0.5 rounded">
                  {asset.category}
                </span>

                <span className="text-[10px] font-mono text-zinc-500">
                  {asset.createdAt}
                </span>
              </div>

              <h4 className="text-xs font-bold text-zinc-200 group-hover:text-pink-400 transition-colors line-clamp-1">
                {asset.title}
              </h4>

              <p className="text-[11px] text-zinc-500 leading-relaxed font-mono whitespace-pre-wrap line-clamp-5 cursor-pointer">
                {asset.content}
              </p>
            </div>

            {/* Bottom Actions footer */}
            <div className="pt-3.5 mt-2 border-t border-zinc-900 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                {asset.tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 font-mono text-pink-400 border border-zinc-900"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  id={`asset-copy-btn-${asset.id}`}
                  onClick={() => handleCopy(asset.content, asset.id)}
                  className="p-2 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
                  title="一键复制到剪贴板"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`asset-remove-btn-${asset.id}`}
                  onClick={() => onRemoveAsset(asset.id)}
                  className="p-2 rounded bg-zinc-950 hover:bg-rose-950/20 border border-zinc-900 hover:border-rose-900/30 text-zinc-500 hover:text-rose-400 cursor-pointer"
                  title="彻底舍弃该资产"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="p-20 bg-[#0c0c0e] border border-zinc-900 rounded-xl text-center space-y-3 select-none">
          <BookOpen className="w-8 h-8 text-zinc-500 mx-auto" />
          <h4 className="text-xs font-bold text-zinc-400 font-mono">资产空空如也</h4>
          <p className="text-[10px] text-zinc-600 max-w-sm mx-auto leading-tight">
            目前未筛查到匹配项。可以在雷达、拆解或写内容区域点击「存入资产库」，将其保存。
          </p>
        </div>
      )}

      {/* POPUP: Manual Create Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-[#000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAssetSubmit}
            className="w-full max-w-lg bg-[#0c0c0e] rounded-xl border border-zinc-800 p-6 space-y-4 shadow-2xl relative animate-zoom-in"
          >
            <button
              type="button"
              id="close-add-form"
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-pink-500" />
                手动载入数字资产
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">归纳管理在小红书发过的爆文或日常爆款记录</p>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">素材/文档主标题</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-pink-500"
                  placeholder="例如: 时尚国潮新中式大纲..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">主要类别归属</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none"
                  >
                    <option value="copy">图文文案</option>
                    <option value="topic">选题主轴</option>
                    <option value="script">脚本视频</option>
                    <option value="preset">诊断预设</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">业务线名称</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-pink-500"
                    placeholder="如: 美食, 护肤..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">正文/记录大纲内容</label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-pink-500 font-mono leading-relaxed"
                  placeholder="在此写入完整的文案、脚本台词、大纲或标签..."
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                id="add-asset-cancel"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200"
              >
                取消
              </button>
              <button
                type="submit"
                id="add-asset-submit"
                className="px-5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-xs font-bold text-white shadow-lg shadow-pink-500/10 cursor-pointer"
              >
                收录归档
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POPUP: Read Full Asset Detail */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-[#000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0c0c0e] rounded-xl border border-zinc-800 p-6 space-y-5 shadow-2xl relative animate-zoom-in">
            <button
              id="close-asset-detail"
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-900 text-pink-400 font-bold uppercase">
                  {selectedAsset.type === "copy" ? "爆款图文" : selectedAsset.type === "topic" ? "干货选题" : "视频脚本"}
                </span>
                <span>归属赛道: {selectedAsset.category}</span>
                <span>•</span>
                <span>存入于: {selectedAsset.createdAt}</span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug pt-1">{selectedAsset.title}</h3>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-90 font-mono text-xs text-zinc-300 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap select-text">
              {selectedAsset.content}
            </div>

            <div className="pt-3 border-t border-zinc-900/60 flex justify-between items-center text-[11px] text-zinc-500 font-mono">
              <span>共计 {selectedAsset.content?.length} 字符</span>
              <button
                id="detail-copy"
                onClick={() => handleCopy(selectedAsset.content, "detail")}
                className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-xs font-bold text-white flex items-center gap-1 cursor-pointer shadow-lg shadow-pink-500/10"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedId === "detail" ? "已完美复制" : "复制全部"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
