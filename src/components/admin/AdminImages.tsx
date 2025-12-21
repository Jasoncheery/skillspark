import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Search, Trash2, Edit, X } from 'lucide-react';
import { imagesService } from '../../services/imagesService';
import { ImageUploadModal } from '../images/ImageUploadModal';
import type { Image } from '../../types/database';

export const AdminImages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['admin-images', selectedCategory],
    queryFn: () => imagesService.getAll({ category: selectedCategory || undefined }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['image-categories'],
    queryFn: () => imagesService.getCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => imagesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
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

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    queryClient.invalidateQueries({ queryKey: ['admin-images'] });
    queryClient.invalidateQueries({ queryKey: ['images'] });
    queryClient.invalidateQueries({ queryKey: ['image-categories'] });
  };

  const handleUpdate = async (updates: Partial<Image>) => {
    if (!editingImage) return;
    await imagesService.update(editingImage.id, updates);
    setEditingImage(null);
    queryClient.invalidateQueries({ queryKey: ['admin-images'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">圖片庫</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary inline-flex items-center"
        >
          <Upload className="w-5 h-5 mr-2" />
          上傳圖片
        </button>
      </div>

      {showUploadModal && (
        <ImageUploadModal
          onUploadComplete={handleUploadComplete}
          onCancel={() => setShowUploadModal(false)}
        />
      )}

      {editingImage && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="heading-3">編輯圖片資訊</h3>
            <button
              onClick={() => setEditingImage(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text
              </label>
              <input
                type="text"
                defaultValue={editingImage.alt_text || ''}
                onBlur={(e) => {
                  if (e.target.value !== editingImage.alt_text) {
                    handleUpdate({ alt_text: e.target.value || null });
                  }
                }}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text (Chinese)
              </label>
              <input
                type="text"
                defaultValue={editingImage.alt_text_chinese || ''}
                onBlur={(e) => {
                  if (e.target.value !== editingImage.alt_text_chinese) {
                    handleUpdate({ alt_text_chinese: e.target.value || null });
                  }
                }}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                defaultValue={editingImage.category || ''}
                onBlur={(e) => {
                  if (e.target.value !== editingImage.category) {
                    handleUpdate({ category: e.target.value || null });
                  }
                }}
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}

      <div className="card">
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
            {searchQuery ? '沒有找到匹配的圖片' : '圖片庫為空，請上傳圖片'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.alt_text || image.original_filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => setEditingImage(image)}
                      className="p-1.5 bg-white rounded shadow hover:bg-gray-50"
                      title="編輯"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('確定要刪除此圖片嗎？')) {
                          deleteMutation.mutate(image.id);
                        }
                      }}
                      className="p-1.5 bg-white rounded shadow hover:bg-gray-50"
                      title="刪除"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-sm font-medium truncate">{image.original_filename}</p>
                  {image.category && (
                    <span className="text-xs text-gray-500">{image.category}</span>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {(image.file_size || 0) / 1024 / 1024 > 1
                      ? `${((image.file_size || 0) / 1024 / 1024).toFixed(2)} MB`
                      : `${((image.file_size || 0) / 1024).toFixed(0)} KB`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

