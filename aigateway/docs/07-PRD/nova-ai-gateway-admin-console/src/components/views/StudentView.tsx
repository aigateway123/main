import React, { useState } from 'react';
import { StudentItem, ModelItem } from '../../types';
import {
  Users,
  Search,
  Plus,
  Eye,
  X,
  DollarSign,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';

interface StudentViewProps {
  students: StudentItem[];
  availableModels: ModelItem[];
  onCreateStudent: (student: {
    email: string;
    nickname: string;
  }) => void;
  onToggleStatus: (id: string) => void;
  onSetQuota: (id: string, newQuota: number) => void;
  onSaveAllowedModels: (id: string, allowedModels: string[]) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  students,
  availableModels,
  onCreateStudent,
  onToggleStatus,
  onSetQuota,
  onSaveAllowedModels,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(
    null
  );

  // Create Student Form
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createNickname, setCreateNickname] = useState('');

  // Quota & Permission Form in Detail Modal
  const [quotaInput, setQuotaInput] = useState<number>(0);
  const [checkedModelCodes, setCheckedModelCodes] = useState<string[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDetail = (student: StudentItem) => {
    setSelectedStudent(student);
    setQuotaInput(student.quotaBalance);
    setCheckedModelCodes(student.allowedModels || []);
    setSaveSuccessMsg('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmail.trim()) return;
    onCreateStudent({
      email: createEmail,
      nickname: createNickname || '高校学生',
    });
    setShowCreateModal(false);
    setCreateEmail('');
    setCreatePassword('');
    setCreateNickname('');
  };

  const handleUpdateQuota = () => {
    if (!selectedStudent) return;
    onSetQuota(selectedStudent.id, quotaInput);
    setSelectedStudent({ ...selectedStudent, quotaBalance: quotaInput });
    setSaveSuccessMsg('额度更新成功！');
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const handleToggleModelCheckbox = (code: string) => {
    if (checkedModelCodes.includes(code)) {
      setCheckedModelCodes(checkedModelCodes.filter((c) => c !== code));
    } else {
      setCheckedModelCodes([...checkedModelCodes, code]);
    }
  };

  const handleSavePermissions = () => {
    if (!selectedStudent) return;
    onSaveAllowedModels(selectedStudent.id, checkedModelCodes);
    setSelectedStudent({ ...selectedStudent, allowedModels: checkedModelCodes });
    setSaveSuccessMsg('模型访问权限已成功保存！');
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
      {/* Top Bar: Search Bar + Create Student Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#e2e8f0]">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索邮箱或学生昵称..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#f8f9fa] border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:bg-white focus:border-[#2563eb]"
            />
          </div>
          <button
            onClick={() => {}}
            className="h-8 px-3 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            搜索
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          创建学生
        </button>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 space-y-4">
        <div className="overflow-x-auto rounded border border-[#e2e8f0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-semibold h-10">
                <th className="px-4 py-2">邮箱</th>
                <th className="px-4 py-2">昵称</th>
                <th className="px-4 py-2">状态</th>
                <th className="px-4 py-2">额度余额</th>
                <th className="px-4 py-2">创建时间</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredStudents.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={item.id}
                    className={`h-12 transition-colors hover:bg-[#eff6ff]/60 ${
                      isEven ? 'bg-white' : 'bg-[#fafbfc]'
                    }`}
                  >
                    <td className="px-4 py-2 font-medium text-[#1e293b]">
                      {item.email}
                    </td>
                    <td className="px-4 py-2 text-[#1e293b] font-medium">
                      {item.nickname}
                    </td>
                    <td className="px-4 py-2">
                      {item.status === 'enabled' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          启用
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
                          禁用
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 font-mono font-bold text-[#1e293b]">
                      ¥{item.quotaBalance.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-[#64748b] font-mono text-[11px]">
                      {item.createdAt}
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      {/* Gray detail button */}
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="px-2.5 py-1 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 rounded text-xs font-medium transition-colors cursor-pointer"
                      >
                        详情
                      </button>
                      {/* Green enable / Red disable button */}
                      {item.status === 'enabled' ? (
                        <button
                          onClick={() => onToggleStatus(item.id)}
                          className="px-2.5 py-1 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          禁用
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleStatus(item.id)}
                          className="px-2.5 py-1 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          启用
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Student Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-xl font-bold text-[#1e293b]">创建学生账号</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  学生邮箱
                </label>
                <input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="student@university.edu.cn"
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  初始化密码
                </label>
                <input
                  type="password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="请输入初始登录密码"
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  昵称 (可选)
                </label>
                <input
                  type="text"
                  value={createNickname}
                  onChange={(e) => setCreateNickname(e.target.value)}
                  placeholder="如：张三 (清华人工智能实验室)"
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="h-9 px-4 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 font-medium text-xs rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors shadow-xs"
                >
                  确定创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-xl font-bold text-[#1e293b]">学生详情及配额设置</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                {saveSuccessMsg}
              </div>
            )}

            {/* Top Info Header */}
            <div className="p-3 bg-[#f8f9fa] rounded border border-[#e2e8f0] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1e293b]">
                  {selectedStudent.email}
                </span>
                {selectedStudent.status === 'enabled' ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    启用中
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
                    已禁用
                  </span>
                )}
              </div>
              <div className="text-xs text-[#64748b]">
                昵称: <span className="font-medium text-[#1e293b]">{selectedStudent.nickname}</span> | 注册时间:{' '}
                {selectedStudent.createdAt}
              </div>
            </div>

            {/* Quota Management Section */}
            <div className="p-4 border border-[#e2e8f0] rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#2563eb]" /> 额度管理
              </h4>
              <div className="flex items-center gap-3">
                <div className="text-xs text-[#64748b]">
                  当前额度: <span className="font-mono font-bold text-[#1e293b]">¥{selectedStudent.quotaBalance.toFixed(2)}</span>
                </div>
                <input
                  type="number"
                  step="10"
                  value={quotaInput}
                  onChange={(e) => setQuotaInput(parseFloat(e.target.value) || 0)}
                  className="w-28 h-8 px-2.5 text-xs font-mono bg-white border border-[#e2e8f0] rounded text-[#1e293b]"
                />
                <button
                  type="button"
                  onClick={handleUpdateQuota}
                  className="h-8 px-3 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors cursor-pointer"
                >
                  设置额度
                </button>
              </div>
            </div>

            {/* Model Permissions Section */}
            <div className="p-4 border border-[#e2e8f0] rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2563eb]" /> 模型权限 (勾选即授权)
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableModels.map((m) => {
                  const isChecked = checkedModelCodes.includes(m.code);
                  return (
                    <label
                      key={m.id}
                      className="flex items-center gap-2 p-2 rounded border border-[#e2e8f0] bg-[#f8f9fa] hover:bg-white cursor-pointer transition-colors text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleModelCheckbox(m.code)}
                        className="rounded text-[#2563eb] focus:ring-[#2563eb]"
                      />
                      <div className="truncate">
                        <div className="font-medium text-[#1e293b] truncate">{m.name}</div>
                        <div className="font-mono text-[10px] text-[#64748b] truncate">{m.code}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleSavePermissions}
                className="w-full h-8 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors cursor-pointer"
              >
                保存模型权限
              </button>
            </div>

            <div className="pt-2 border-t border-[#e2e8f0] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="h-9 px-4 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 font-medium text-xs rounded-md transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
