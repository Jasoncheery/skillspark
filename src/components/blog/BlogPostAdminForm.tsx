import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image as ImageIcon } from 'lucide-react';
import type { BlogPost } from '../../types/database';
import { ImagePicker } from '../images/ImagePicker';
import type { Image } from '../../types/database';

interface BlogPostFormData {
  slug: string;
  title: string;
  title_chinese: string;
  excerpt: string;
  excerpt_chinese: string;
  content: string;
  content_chinese: string;
  cover_image_url: string;
  author_id: string;
  category: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  is_published: boolean;
  published_at: string;
  is_featured: boolean;
}

interface BlogPostAdminFormProps {
  post?: BlogPost;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  onCancel: () => void;
}

export const BlogPostAdminForm = ({ post, onSubmit, onCancel }: BlogPostAdminFormProps) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<BlogPostFormData>({
    defaultValues: post ? {
      slug: post.slug,
      title: post.title,
      title_chinese: post.title_chinese || '',
      excerpt: post.excerpt || '',
      excerpt_chinese: post.excerpt_chinese || '',
      content: post.content,
      content_chinese: post.content_chinese || '',
      cover_image_url: post.cover_image_url || '',
      author_id: post.author_id || '',
      category: post.category || '',
      tags: post.tags || [],
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      seo_keywords: post.seo_keywords || '',
      is_published: post.is_published,
      published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
      is_featured: post.is_featured,
    } : {
      content: '',
      is_published: false,
      is_featured: false,
    },
  });

  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const coverImageUrl = watch('cover_image_url') || post?.cover_image_url || '';

  const handleImageSelect = (image: Image) => {
    setValue('cover_image_url', image.url);
    setShowImagePicker(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: BlogPostFormData) => {
    await onSubmit({
      ...data,
      tags,
      published_at: data.is_published && data.published_at ? new Date(data.published_at).toISOString() : null,
    });
  };

  return (
    <>
      {showImagePicker && (
        <ImagePicker
          onSelect={handleImageSelect}
          onCancel={() => setShowImagePicker(false)}
          currentImageUrl={coverImageUrl}
        />
      )}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            {...register('slug', { required: true })}
            className="input-field"
            placeholder="my-ai-guide"
          />
          {errors.slug && <p className="text-error text-sm mt-1">Slug is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            {...register('title', { required: true })}
            className="input-field"
            placeholder="My AI Guide"
          />
          {errors.title && <p className="text-error text-sm mt-1">Title is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chinese Title
          </label>
          <input
            {...register('title_chinese')}
            className="input-field"
            placeholder="我的 AI 指南"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            {...register('category')}
            className="input-field"
            placeholder="Tutorial"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
          </label>
          <div className="flex space-x-2">
            <input
              {...register('cover_image_url')}
              type="url"
              className="input-field flex-1"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="btn-outline px-4"
              title="從圖片庫選擇"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt="Cover preview"
              className="mt-2 max-h-32 rounded-lg border border-gray-200"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Published At
          </label>
          <input
            {...register('published_at')}
            type="datetime-local"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          {...register('excerpt')}
          className="input-field"
          rows={2}
          placeholder="Brief excerpt..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt (Chinese)
        </label>
        <textarea
          {...register('excerpt_chinese')}
          className="input-field"
          rows={2}
          placeholder="簡短摘要..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <textarea
          {...register('content', { required: true })}
          className="input-field"
          rows={12}
          placeholder="Full content in Markdown..."
        />
        {errors.content && <p className="text-error text-sm mt-1">Content is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content (Chinese)
        </label>
        <textarea
          {...register('content_chinese')}
          className="input-field"
          rows={12}
          placeholder="完整內容（Markdown）..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            className="input-field flex-1"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="btn-outline text-sm"
          >
            Add Tag
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-primary-700 hover:text-primary-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Title
          </label>
          <input
            {...register('seo_title')}
            className="input-field"
            placeholder="SEO optimized title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Keywords
          </label>
          <input
            {...register('seo_keywords')}
            className="input-field"
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SEO Description
        </label>
        <textarea
          {...register('seo_description')}
          className="input-field"
          rows={2}
          placeholder="SEO meta description..."
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            {...register('is_published')}
            type="checkbox"
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Published</span>
        </label>
        <label className="flex items-center">
          <input
            {...register('is_featured')}
            type="checkbox"
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {post ? 'Update' : 'Create'} Post
        </button>
      </div>
    </form>
    </>
  );
};

