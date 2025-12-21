import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Check } from 'lucide-react';
import { imagesService } from '../../services/imagesService';
import type { Image } from '../../types/database';

interface ImagePickerProps {
  onSelect: (image: Image) => void;
  onCancel: () => void;
  currentImageUrl?: string | null;
}

export const ImagePicker = ({ onSelect, onCancel, currentImageUrl }: ImagePickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['images', selectedCategory],
    queryFn: () => imagesService.getAll({ category: selectedCategory || undefined }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['image-categories'],
    queryFn: () => imagesService.getCategories(),
  });

  const filteredImages = images.filter(image => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      image.original_filename.toLowerCase().includes(query) ||
      image.alt_text?.toLowerCase().includes(query) ||
      image.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-3">選擇圖片</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜尋圖片..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedCategory === ''
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">載入中...</div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? '沒有找到匹配的圖片' : '圖片庫為空'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => {
              const isSelected = currentImageUrl === image.url;
              return (
                <div
                  key={image.id}
                  className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-600 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => onSelect(image)}
                >
                  <img
                    src={image.url}
                    alt={image.alt_text || image.original_filename}
                    className="w-full h-32 object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">
                      {image.original_filename}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

