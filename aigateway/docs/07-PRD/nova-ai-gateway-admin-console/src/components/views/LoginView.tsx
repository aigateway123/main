import React, { useState } from 'react';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@nova.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('请输入邮箱和密码');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-full w-full bg-[#f8f9fa] flex items-center justify-center p-6">
      {/* Centered White Card */}
      <div className="w-full max-w-[420px] bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-8 space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#2563eb] text-white shadow-md mb-2">
            <Zap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">
            Nova AI Gateway
          </h2>
          <p className="text-xs text-[#64748b]">
            企业级 AI 大模型统一控制台与网关管理系统
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#64748b]" />
              管理员邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入管理员邮箱"
              className="w-full h-10 px-3 text-sm bg-[#ffffff] border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#64748b]" />
                密码
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('请联系系统高级管理员重置安全密钥');
                }}
                className="text-[11px] text-[#2563eb] hover:underline"
              >
                忘记密码？
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入登录密码"
              className="w-full h-10 px-3 text-sm bg-[#ffffff] border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-[#2563eb] hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-md transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-70 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                安全验证中...
              </span>
            ) : (
              <>
                <span>登 录</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-center gap-2 text-[11px] text-[#64748b]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>受系统高级鉴权策略保护 (B2B Multi-Tenant Safety)</span>
        </div>
      </div>
    </div>
  );
};
