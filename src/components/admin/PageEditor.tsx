import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Eye } from 'lucide-react';
import type { Page, PageType } from '../../types/database';
import ReactMarkdown from 'react-markdown';

interface PageFormData {
  slug: string;
  title: string;
  title_chinese: string;
  content: string;
  content_chinese: string;
  page_type: PageType;
  is_published: boolean;
  order_index: number;
}

interface PageEditorProps {
  page?: Page;
  onSave: (data: PageFormData) => Promise<void>;
  onCancel: () => void;
}

export const PageEditor = ({ page, onSave, onCancel }: PageEditorProps) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PageFormData>({
    defaultValues: page
      ? {
          slug: page.slug,
          title: page.title,
          title_chinese: page.title_chinese || '',
          content: page.content || '',
          content_chinese: page.content_chinese || '',
          page_type: page.page_type,
          is_published: page.is_published,
          order_index: page.order_index,
        }
      : {
          slug: '',
          title: '',
          title_chinese: '',
          content: '',
          content_chinese: '',
          page_type: 'static',
          is_published: false,
          order_index: 0,
        },
  });

  const content = watch('content');
  const title = watch('title');

  const onSubmit = async (data: PageFormData) => {
    await onSave(data);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="heading-3">{page ? '編輯頁面' : '新增頁面'}</h3>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
            className="btn-outline inline-flex items-center"
          >
            {activeTab === 'edit' ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                預覽
              </>
            ) : (
              <>
                <X className="w-4 h-4 mr-2" />
                編輯
              </>
            )}
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {activeTab === 'edit' ? (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  {...register('slug', {
                    required: 'Slug is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Slug can only contain lowercase letters, numbers, and hyphens',
                    },
                    validate: (value) => {
                      const reserved = ['admin', 'dashboard', 'login', 'register', 'api', 'blog', 'lessons', 'ai-tools', 'reset-password'];
                      if (reserved.includes(value)) {
                        return 'This slug is reserved and cannot be used';
                      }
                      return true;
                    },
                  })}
                  className="input-field"
                  placeholder="about-us"
                  disabled={!!page} // Don't allow changing slug of existing pages
                />
                {errors.slug && (
                  <p className="text-error text-sm mt-1">{errors.slug.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  URL: /{watch('slug') || 'page-slug'}
                  {page && <span className="text-gray-400 ml-2">(Slug cannot be changed)</span>}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Type *
                </label>
                <select {...register('page_type', { required: true })} className="input-field">
                  <option value="static">Static Page</option>
                  <option value="landing">Landing Page</option>
                  <option value="custom">Custom Page</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (English) *
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="input-field"
                  placeholder="About Us"
                />
                {errors.title && (
                  <p className="text-error text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Chinese)
                </label>
                <input
                  {...register('title_chinese')}
                  className="input-field"
                  placeholder="關於我們"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (English) - Markdown supported
              </label>
              <textarea
                {...register('content')}
                className="input-field"
                rows={12}
                placeholder="Enter page content in Markdown format..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (Chinese) - Markdown supported
              </label>
              <textarea
                {...register('content_chinese')}
                className="input-field"
                rows={12}
                placeholder="輸入頁面內容（支援 Markdown）..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Index
                </label>
                <input
                  {...register('order_index', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    {...register('is_published')}
                    type="checkbox"
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
              </div>
            </div>
          </>
        ) : (
          <div className="border rounded-lg p-6 bg-white">
            <h1 className="heading-1 mb-4">{title || 'Page Title'}</h1>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{content || 'No content yet...'}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button type="button" onClick={onCancel} className="btn-outline">
            取消
          </button>
          <button type="submit" className="btn-primary inline-flex items-center">
            <Save className="w-5 h-5 mr-2" />
            {page ? '更新' : '建立'}頁面
          </button>
        </div>
      </form>
    </div>
  );
};

