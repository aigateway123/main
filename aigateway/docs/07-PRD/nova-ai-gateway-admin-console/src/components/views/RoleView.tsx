import React, { useState } from 'react';
import { RoleItem, Permission } from '../../types';
import { ShieldCheck, Plus, Edit, Trash2, X, Check, Lock } from 'lucide-react';

interface RoleViewProps {
  roles: RoleItem[];
  allPermissions: Permission[];
  onCreateRole: (r: { name: string; description: string }) => void;
  onUpdateRolePermissions: (roleId: string, perms: string[]) => void;
  onDeleteRole: (roleId: string) => void;
}

export const RoleView: React.FC<RoleViewProps> = ({
  roles,
  allPermissions,
  onCreateRole,
  onUpdateRolePermissions,
  onDeleteRole,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

  // Create Form
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');

  // Permission Edit Form
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState('');

  const handleOpenEditPermissions = (role: RoleItem) => {
    setEditingRole(role);
    setCheckedPermissions(role.permissions || []);
    setSuccessToast('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;
    onCreateRole({ name: roleName, description: roleDesc });
    setShowCreateModal(false);
    setRoleName('');
    setRoleDesc('');
  };

  const handleTogglePerm = (code: string) => {
    if (checkedPermissions.includes(code)) {
      setCheckedPermissions(checkedPermissions.filter((c) => c !== code));
    } else {
      setCheckedPermissions([...checkedPermissions, code]);
    }
  };

  const handleSavePermsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;
    onUpdateRolePermissions(editingRole.id, checkedPermissions);
    setSuccessToast('角色权限配置已保存！');
    setTimeout(() => {
      setSuccessToast('');
      setEditingRole(null);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-[#e2e8f0]">
        <div>
          <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2563eb]" />
            系统角色与 RBAC 权限管理
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            配置系统运维、财务审计及管理员角色，精细化进行节点与API鉴权控制
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          创建角色
        </button>
      </div>

      {/* Role Table */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 space-y-4">
        <div className="overflow-x-auto rounded border border-[#e2e8f0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-semibold h-10">
                <th className="px-4 py-2">角色名称</th>
                <th className="px-4 py-2">描述</th>
                <th className="px-4 py-2">权限数</th>
                <th className="px-4 py-2">绑定的用户数</th>
                <th className="px-4 py-2">创建时间</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {roles.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={item.id}
                    className={`h-12 transition-colors hover:bg-[#eff6ff]/60 ${
                      isEven ? 'bg-white' : 'bg-[#fafbfc]'
                    }`}
                  >
                    <td className="px-4 py-2 font-bold text-[#1e293b] flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.isSystem && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                          系统
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-[#64748b] max-w-xs truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="px-4 py-2 font-mono font-bold text-[#1e293b]">
                      {item.permissionCount}
                    </td>
                    <td className="px-4 py-2 font-mono text-[#64748b]">
                      {item.userCount}人
                    </td>
                    <td className="px-4 py-2 text-[#64748b] font-mono text-[11px]">
                      {item.createdAt}
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditPermissions(item)}
                        className="px-2.5 py-1 text-[#2563eb] hover:bg-blue-50 border border-blue-200 rounded text-xs font-medium transition-colors cursor-pointer"
                      >
                        编辑权限
                      </button>
                      {/* System roles do NOT have delete button as required */}
                      {!item.isSystem ? (
                        <button
                          onClick={() => onDeleteRole(item.id)}
                          className="px-2.5 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          删除
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-xl font-bold text-[#1e293b]">创建新角色</h3>
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
                  角色名称
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="如：值班运维专员 / 安全合规审核员"
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  角色描述
                </label>
                <textarea
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  placeholder="描述该角色的职能与权限管控边界..."
                  rows={3}
                  className="w-full p-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
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
                  创建角色
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Permissions Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div>
                <h3 className="text-xl font-bold text-[#1e293b]">
                  配置角色权限 - {editingRole.name}
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  {editingRole.description}
                </p>
              </div>
              <button
                onClick={() => setEditingRole(null)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                {successToast}
              </div>
            )}

            <form onSubmit={handleSavePermsSubmit} className="space-y-4">
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <label className="text-xs font-bold text-[#1e293b]">
                  系统 RBAC 权限勾选矩阵:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allPermissions.map((perm) => {
                    const isChecked = checkedPermissions.includes(perm.code);
                    return (
                      <label
                        key={perm.code}
                        className="flex items-start gap-2.5 p-2.5 rounded border border-[#e2e8f0] bg-[#f8f9fa] hover:bg-white cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePerm(perm.code)}
                          className="mt-0.5 rounded text-[#2563eb] focus:ring-[#2563eb]"
                        />
                        <div className="text-xs space-y-0.5">
                          <div className="font-semibold text-[#1e293b]">
                            {perm.name}
                          </div>
                          <div className="font-mono text-[10px] text-[#2563eb]">
                            code: {perm.code}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Bottom blue save permissions button */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="h-9 px-4 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 font-medium text-xs rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors shadow-xs"
                >
                  保存权限
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
