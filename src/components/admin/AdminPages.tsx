import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye, ExternalLink } from 'lucide-react';
import { pageService } from '../../services/pageService';
import { PageEditor } from './PageEditor';
import { useToastStore } from '../../stores/toastStore';
import type { Page } from '../../types/database';

export const AdminPages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: () => pageService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      showToast('頁面已刪除', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || '刪除失敗', 'error');
    },
  });

  const filteredPages = pages.filter((page) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      page.title.toLowerCase().includes(query) ||
      page.slug.toLowerCase().includes(query) ||
      page.title_chinese?.toLowerCase().includes(query)
    );
  });

  const handleCreate = () => {
    setEditingPage(null);
    setShowEditor(true);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setShowEditor(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingPage) {
        await pageService.update(editingPage.id, data);
        showToast('頁面已更新', 'success');
      } else {
        await pageService.create(data);
        showToast('頁面已建立', 'success');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      setShowEditor(false);
      setEditingPage(null);
    } catch (error: any) {
      showToast(error.message || '儲存失敗', 'error');
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`確定要刪除頁面「${title}」嗎？此操作無法復原。`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">頁面管理</h2>
        <button onClick={handleCreate} className="btn-primary inline-flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          新增頁面
        </button>
      </div>

      {showEditor && (
        <PageEditor
          page={editingPage || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingPage(null);
          }}
        />
      )}

      {!showEditor && (
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

          {isLoading ? (
            <div className="text-center py-12">載入中...</div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? '找不到符合的頁面' : '尚未建立任何頁面'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        {page.title_chinese && (
                          <span className="text-sm text-gray-600">
                            ({page.title_chinese})
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            page.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {page.is_published ? '已發布' : '未發布'}
                        </span>
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                          {page.page_type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>Slug: /{page.slug}</span>
                        <span>Order: {page.order_index}</span>
                        <span>
                          建立: {new Date(page.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {page.content && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {page.content.substring(0, 150)}...
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {page.is_published && (
                        <a
                          href={`/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-primary-600"
                          title="View page"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(page)}
                        className="p-2 text-gray-600 hover:text-primary-600"
                        title="Edit page"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id, page.title)}
                        className="p-2 text-gray-600 hover:text-error"
                        title="Delete page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
