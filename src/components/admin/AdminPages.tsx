import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export const AdminPages = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">頁面管理</h2>
        <button className="btn-primary inline-flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          新增頁面
        </button>
      </div>

      <div className="card">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜尋頁面..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="text-center py-12 text-gray-500">
          頁面管理功能開發中...
        </div>
      </div>
    </div>
  );
};

