import React, { useState } from 'react';
import {
  PageId,
  ApiKeyItem,
  ProviderItem,
  ModelItem,
  PricingItem,
  BillingRecord,
  RequestLogItem,
  StudentItem,
  RoleItem,
} from './types';
import {
  INITIAL_RECENT_REQUESTS,
  INITIAL_API_KEYS,
  INITIAL_PROVIDERS,
  INITIAL_MODELS,
  INITIAL_PRICING,
  INITIAL_BILLING_RECORDS,
  INITIAL_REQUEST_LOGS,
  INITIAL_STUDENTS,
  INITIAL_ROLES,
  ALL_PERMISSIONS,
} from './mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { ApiKeyView } from './components/views/ApiKeyView';
import { ProviderView } from './components/views/ProviderView';
import { ModelView } from './components/views/ModelView';
import { PricingView } from './components/views/PricingView';
import { BillingView } from './components/views/BillingView';
import { RequestLogsView } from './components/views/RequestLogsView';
import { StudentView } from './components/views/StudentView';
import { RoleView } from './components/views/RoleView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // App Data States
  const [recentRequests, setRecentRequests] = useState(INITIAL_RECENT_REQUESTS);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(INITIAL_API_KEYS);
  const [providers, setProviders] = useState<ProviderItem[]>(INITIAL_PROVIDERS);
  const [models, setModels] = useState<ModelItem[]>(INITIAL_MODELS);
  const [pricings, setPricings] = useState<PricingItem[]>(INITIAL_PRICING);
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(
    INITIAL_BILLING_RECORDS
  );
  const [requestLogs, setRequestLogs] = useState<RequestLogItem[]>(
    INITIAL_REQUEST_LOGS
  );
  const [students, setStudents] = useState<StudentItem[]>(INITIAL_STUDENTS);
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);

  // Handlers
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  // API Key handlers
  const handleCreateApiKey = (data: { name: string; scope: string }) => {
    const randomHex = Math.random().toString(16).substring(2, 10);
    const fullKey = `nk_live_${randomHex}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    const newKeyItem: ApiKeyItem = {
      id: `key-${Date.now()}`,
      prefix: `nk_live_${randomHex}`,
      name: data.name,
      scope: data.scope,
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      fullKey,
    };
    setApiKeys([newKeyItem, ...apiKeys]);
    return { fullKey, newKey: newKeyItem };
  };

  const handleRevokeApiKey = (id: string) => {
    setApiKeys(
      apiKeys.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k))
    );
  };

  // Provider handlers
  const handleAddProvider = (p: Omit<ProviderItem, 'id'>) => {
    const newProv: ProviderItem = {
      ...p,
      id: `prov-${Date.now()}`,
    };
    setProviders([...providers, newProv]);
  };

  const handleUpdateProvider = (p: ProviderItem) => {
    setProviders(providers.map((item) => (item.id === p.id ? p : item)));
  };

  const handleDeleteProvider = (id: string) => {
    setProviders(providers.filter((p) => p.id !== id));
  };

  // Model handlers
  const handleAddModel = (m: Omit<ModelItem, 'id' | 'boundProviders'>) => {
    const newModel: ModelItem = {
      ...m,
      id: `mod-${Date.now()}`,
      boundProviders: [],
    };
    setModels([...models, newModel]);
  };

  const handleUpdateModel = (m: ModelItem) => {
    setModels(models.map((item) => (item.id === m.id ? m : item)));
  };

  const handleDeleteModel = (id: string) => {
    setModels(models.filter((item) => item.id !== id));
  };

  const handleBindProvider = (
    modelId: string,
    binding: { providerName: string; weight: number }
  ) => {
    setModels(
      models.map((m) => {
        if (m.id === modelId) {
          const existing = m.boundProviders || [];
          return {
            ...m,
            boundProviders: [...existing, binding],
          };
        }
        return m;
      })
    );
  };

  // Pricing handlers
  const handleUpdatePricing = (p: PricingItem) => {
    setPricings(pricings.map((item) => (item.id === p.id ? p : item)));
  };

  // Student handlers
  const handleCreateStudent = (student: { email: string; nickname: string }) => {
    const newStu: StudentItem = {
      id: `stu-${Date.now()}`,
      email: student.email,
      nickname: student.nickname,
      status: 'enabled',
      quotaBalance: 100.0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      allowedModels: ['gpt-4o-mini', 'deepseek-v3'],
    };
    setStudents([newStu, ...students]);
  };

  const handleToggleStudentStatus = (id: string) => {
    setStudents(
      students.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'enabled' ? 'disabled' : 'enabled' }
          : s
      )
    );
  };

  const handleSetStudentQuota = (id: string, newQuota: number) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, quotaBalance: newQuota } : s))
    );
  };

  const handleSaveStudentModels = (id: string, allowedModels: string[]) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, allowedModels } : s))
    );
  };

  // Role handlers
  const handleCreateRole = (r: { name: string; description: string }) => {
    const newRole: RoleItem = {
      id: `role-${Date.now()}`,
      name: r.name,
      description: r.description,
      isSystem: false,
      permissionCount: 2,
      userCount: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      permissions: ['model:read', 'billing:read'],
    };
    setRoles([...roles, newRole]);
  };

  const handleUpdateRolePermissions = (roleId: string, perms: string[]) => {
    setRoles(
      roles.map((r) =>
        r.id === roleId
          ? { ...r, permissions: perms, permissionCount: perms.length }
          : r
      )
    );
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId));
  };

  // Render Login Page mode
  if (!isLoggedIn || currentPage === 'login') {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f9fa] text-[#1e293b] font-sans antialiased">
      {/* 240px White Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        onLogout={handleLogout}
      />

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onSelectPage={(page) => setCurrentPage(page)}
        />

        {/* View Router Render */}
        <main className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardView recentRequests={recentRequests} />
          )}

          {currentPage === 'apikeys' && (
            <ApiKeyView
              apiKeys={apiKeys}
              onCreateKey={handleCreateApiKey}
              onRevokeKey={handleRevokeApiKey}
            />
          )}

          {currentPage === 'providers' && (
            <ProviderView
              providers={providers}
              onAddProvider={handleAddProvider}
              onUpdateProvider={handleUpdateProvider}
              onDeleteProvider={handleDeleteProvider}
            />
          )}

          {currentPage === 'models' && (
            <ModelView
              models={models}
              providers={providers}
              onAddModel={handleAddModel}
              onUpdateModel={handleUpdateModel}
              onDeleteModel={handleDeleteModel}
              onBindProvider={handleBindProvider}
            />
          )}

          {currentPage === 'pricing' && (
            <PricingView
              pricings={pricings}
              onUpdatePricing={handleUpdatePricing}
            />
          )}

          {currentPage === 'billing' && (
            <BillingView billingRecords={billingRecords} />
          )}

          {currentPage === 'logs' && <RequestLogsView logs={requestLogs} />}

          {currentPage === 'students' && (
            <StudentView
              students={students}
              availableModels={models}
              onCreateStudent={handleCreateStudent}
              onToggleStatus={handleToggleStudentStatus}
              onSetQuota={handleSetStudentQuota}
              onSaveAllowedModels={handleSaveStudentModels}
            />
          )}

          {currentPage === 'roles' && (
            <RoleView
              roles={roles}
              allPermissions={ALL_PERMISSIONS}
              onCreateRole={handleCreateRole}
              onUpdateRolePermissions={handleUpdateRolePermissions}
              onDeleteRole={handleDeleteRole}
            />
          )}
        </main>
      </div>
    </div>
  );
}
