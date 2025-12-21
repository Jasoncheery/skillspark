import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image as ImageIcon } from 'lucide-react';
import type { AITool } from '../../types/database';
import { ImagePicker } from '../images/ImagePicker';
import type { Image } from '../../types/database';

interface AIToolFormData {
  slug: string;
  name: string;
  name_chinese: string;
  description: string;
  short_description: string;
  category: string;
  icon_url: string;
  cover_image_url: string;
  features: string[];
  use_cases: string[];
  pricing_info: {
    free: boolean;
    paid: boolean;
    price?: string;
    currency?: string;
  };
  tutorial_urls: string[];
  screenshots: string[];
  demo_video_url: string;
  website_url: string;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
}

interface AIToolAdminFormProps {
  tool?: AITool;
  onSubmit: (data: AIToolFormData) => Promise<void>;
  onCancel: () => void;
}

export const AIToolAdminForm = ({ tool, onSubmit, onCancel }: AIToolAdminFormProps) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<AIToolFormData>({
    defaultValues: tool ? {
      slug: tool.slug,
      name: tool.name,
      name_chinese: tool.name_chinese || '',
      description: tool.description || '',
      short_description: tool.short_description || '',
      category: tool.category || '',
      icon_url: tool.icon_url || '',
      cover_image_url: tool.cover_image_url || '',
      features: tool.features || [],
      use_cases: tool.use_cases || [],
      pricing_info: tool.pricing_info || { free: false, paid: false },
      tutorial_urls: tool.tutorial_urls || [],
      screenshots: tool.screenshots || [],
      demo_video_url: tool.demo_video_url || '',
      website_url: tool.website_url || '',
      is_featured: tool.is_featured,
      is_active: tool.is_active,
      order_index: tool.order_index,
    } : undefined,
  });

  const [features, setFeatures] = useState<string[]>(tool?.features || []);
  const [useCases, setUseCases] = useState<string[]>(tool?.use_cases || []);
  const [tutorialUrls, setTutorialUrls] = useState<string[]>(tool?.tutorial_urls || []);
  const [screenshots, setScreenshots] = useState<string[]>(tool?.screenshots || []);
  const [showImagePicker, setShowImagePicker] = useState<'cover' | 'icon' | null>(null);
  const coverImageUrl = watch('cover_image_url') || tool?.cover_image_url || '';
  const iconUrl = watch('icon_url') || tool?.icon_url || '';

  const handleImageSelect = (image: Image) => {
    if (showImagePicker === 'cover') {
      setValue('cover_image_url', image.url);
    } else if (showImagePicker === 'icon') {
      setValue('icon_url', image.url);
    }
    setShowImagePicker(null);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: AIToolFormData) => {
    await onSubmit({
      ...data,
      features,
      use_cases: useCases,
      tutorial_urls: tutorialUrls,
      screenshots,
    });
  };

  return (
    <>
      {showImagePicker && (
        <ImagePicker
          onSelect={handleImageSelect}
          onCancel={() => setShowImagePicker(null)}
          currentImageUrl={showImagePicker === 'cover' ? coverImageUrl : iconUrl}
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
            placeholder="gamma"
          />
          {errors.slug && <p className="text-error text-sm mt-1">Slug is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            {...register('name', { required: true })}
            className="input-field"
            placeholder="Gamma"
          />
          {errors.name && <p className="text-error text-sm mt-1">Name is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chinese Name
          </label>
          <input
            {...register('name_chinese')}
            className="input-field"
            placeholder="伽馬"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            {...register('category')}
            className="input-field"
            placeholder="Presentation"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description
        </label>
        <textarea
          {...register('short_description')}
          className="input-field"
          rows={2}
          placeholder="Brief description..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          className="input-field"
          rows={6}
          placeholder="Full description..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon URL
          </label>
          <div className="flex space-x-2">
            <input
              {...register('icon_url')}
              className="input-field flex-1"
              type="url"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => setShowImagePicker('icon')}
              className="btn-outline px-4"
              title="從圖片庫選擇"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          {iconUrl && (
            <img
              src={iconUrl}
              alt="Icon preview"
              className="mt-2 max-h-16 rounded-lg border border-gray-200"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
          </label>
          <div className="flex space-x-2">
            <input
              {...register('cover_image_url')}
              className="input-field flex-1"
              type="url"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => setShowImagePicker('cover')}
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
            Website URL
          </label>
          <input
            {...register('website_url')}
            className="input-field"
            type="url"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="input-field flex-1"
                placeholder="Feature description"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="px-3 py-2 bg-error text-white rounded-lg hover:bg-error/80 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="btn-outline text-sm"
          >
            + Add Feature
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            {...register('is_featured')}
            type="checkbox"
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
        <label className="flex items-center">
          <input
            {...register('is_active')}
            type="checkbox"
            defaultChecked
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {tool ? 'Update' : 'Create'} Tool
        </button>
      </div>
    </form>
    </>
  );
};

