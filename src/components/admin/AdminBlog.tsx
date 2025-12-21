import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { blogService } from '../../services/blogService';
import { BlogPostAdminForm } from '../blog/BlogPostAdminForm';
import type { BlogPost } from '../../types/database';

export const AdminBlog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: () => blogService.getAll({ includeUnpublished: true }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
    },
  });

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return post.title.toLowerCase().includes(query);
  });

  const handleSubmit = async (data: any) => {
    // Convert empty strings to null for optional fields
    const processedData = {
      ...data,
      published_at: data.published_at || null,
      author_id: data.author_id || null,
      title_chinese: data.title_chinese || null,
      excerpt: data.excerpt || null,
      excerpt_chinese: data.excerpt_chinese || null,
      content_chinese: data.content_chinese || null,
      cover_image_url: data.cover_image_url || null,
      category: data.category || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      seo_keywords: data.seo_keywords || null,
    };

    if (editingPost) {
      await blogService.update(editingPost.id, processedData);
    } else {
      await blogService.create(processedData);
    }
    setShowForm(false);
    setEditingPost(null);
    queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">文章管理</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          新增文章
        </button>
      </div>

      {showForm && (
        <div className="card">
          <BlogPostAdminForm
            post={editingPost || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingPost(null);
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
              placeholder="搜尋文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">載入中...</div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {post.category && <span>類別: {post.category}</span>}
                      <span>瀏覽: {post.view_count}</span>
                      <span className={post.is_published ? 'text-green-600' : 'text-gray-500'}>
                        {post.is_published ? '已發布' : '未發布'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setShowForm(true);
                      }}
                      className="p-2 text-gray-600 hover:text-primary-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('確定要刪除此文章嗎？')) {
                          deleteMutation.mutate(post.id);
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-error"
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
    </div>
  );
};

