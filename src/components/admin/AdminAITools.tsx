import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { aiToolsService } from '../../services/aiToolsService';
import { AIToolAdminForm } from '../ai-tools/AIToolAdminForm';
import type { AITool } from '../../types/database';

export const AdminAITools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['admin-ai-tools'],
    queryFn: () => aiToolsService.getAll({ includeInactive: true }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => aiToolsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ai-tools'] });
    },
  });

  const filteredTools = tools.filter(tool => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return tool.name.toLowerCase().includes(query) || tool.slug.toLowerCase().includes(query);
  });

  const handleSubmit = async (data: any) => {
    try {
      if (editingTool) {
        await aiToolsService.update(editingTool.id, data);
      } else {
        await aiToolsService.create(data);
      }
      setShowForm(false);
      setEditingTool(null);
      queryClient.invalidateQueries({ queryKey: ['admin-ai-tools'] });
    } catch (error: any) {
      console.error('Error saving AI tool:', error);
      alert(error.message || '儲存失敗，請稍後再試');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">AI 工具管理</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          新增工具
        </button>
      </div>

      {showForm && (
        <div className="card">
          <AIToolAdminForm
            tool={editingTool || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTool(null);
            }}
          />
        </div>
      )}

      <div className="card">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜尋工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">載入中...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{tool.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingTool(tool);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-600 hover:text-primary-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('確定要刪除此工具嗎？')) {
                          deleteMutation.mutate(tool.id);
                        }
                      }}
                      className="p-1 text-gray-600 hover:text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{tool.short_description || tool.description}</p>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${tool.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {tool.is_active ? '啟用' : '停用'}
                  </span>
                  {tool.is_featured && (
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs">
                      精選
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

