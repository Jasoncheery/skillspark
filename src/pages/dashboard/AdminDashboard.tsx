import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Users, FileText, Image, BookOpen, Sparkles, Settings, ImageIcon } from 'lucide-react';
import { AdminUsers } from '../../components/admin/AdminUsers';
import { AdminAITools } from '../../components/admin/AdminAITools';
import { AdminLessons } from '../../components/admin/AdminLessons';
import { AdminBlog } from '../../components/admin/AdminBlog';
import { AdminPages } from '../../components/admin/AdminPages';
import { AdminImages } from '../../components/admin/AdminImages';
import { AdminContentGeneration } from '../../components/admin/AdminContentGeneration';

type AdminTab = 'overview' | 'users' | 'ai-tools' | 'lessons' | 'blog' | 'pages' | 'images' | 'content-generation';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs = [
    { id: 'overview' as AdminTab, label: '總覽', icon: Settings },
    { id: 'users' as AdminTab, label: '用戶管理', icon: Users },
    { id: 'ai-tools' as AdminTab, label: 'AI 工具', icon: Sparkles },
    { id: 'lessons' as AdminTab, label: '課程管理', icon: BookOpen },
    { id: 'blog' as AdminTab, label: '文章管理', icon: FileText },
    { id: 'pages' as AdminTab, label: '頁面管理', icon: FileText },
    { id: 'images' as AdminTab, label: '圖片庫', icon: ImageIcon },
    { id: 'content-generation' as AdminTab, label: '內容生成', icon: Sparkles },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="heading-1 mb-8">管理後台</h1>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'ai-tools' && <AdminAITools />}
            {activeTab === 'lessons' && <AdminLessons />}
            {activeTab === 'blog' && <AdminBlog />}
            {activeTab === 'pages' && <AdminPages />}
            {activeTab === 'images' && <AdminImages />}
            {activeTab === 'content-generation' && <AdminContentGeneration />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">總用戶數</p>
              <p className="text-3xl font-bold mt-2">-</p>
            </div>
            <Users className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI 工具</p>
              <p className="text-3xl font-bold mt-2">-</p>
            </div>
            <Sparkles className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">課程數</p>
              <p className="text-3xl font-bold mt-2">-</p>
            </div>
            <BookOpen className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">文章數</p>
              <p className="text-3xl font-bold mt-2">-</p>
            </div>
            <FileText className="w-12 h-12 text-primary-600" />
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="heading-3 mb-4">快速操作</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="btn-outline text-left p-4">
            <Sparkles className="w-6 h-6 mb-2" />
            <div className="font-semibold">新增 AI 工具</div>
            <div className="text-sm text-gray-600">添加新的 AI 工具介紹</div>
          </button>
          <button className="btn-outline text-left p-4">
            <BookOpen className="w-6 h-6 mb-2" />
            <div className="font-semibold">新增課程</div>
            <div className="text-sm text-gray-600">創建新的線上或線下課程</div>
          </button>
          <button className="btn-outline text-left p-4">
            <FileText className="w-6 h-6 mb-2" />
            <div className="font-semibold">撰寫文章</div>
            <div className="text-sm text-gray-600">發布新的 AI 攻略文章</div>
          </button>
        </div>
      </div>
    </div>
  );
};
