import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import { imagesService } from '../../services/imagesService';

interface ImageUploadFormData {
  alt_text: string;
  alt_text_chinese: string;
  category: string;
}

interface ImageUploadModalProps {
  onUploadComplete: (image: any) => void;
  onCancel: () => void;
}

export const ImageUploadModal = ({ onUploadComplete, onCancel }: ImageUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<ImageUploadFormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const onSubmit = async (data: ImageUploadFormData) => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const image = await imagesService.upload(file, {
        alt_text: data.alt_text || null,
        alt_text_chinese: data.alt_text_chinese || null,
        category: data.category || null,
      });
      onUploadComplete(image);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-3">上傳圖片</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇圖片 *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    重新選擇
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-primary-600 hover:text-primary-700 font-medium">
                      點擊選擇圖片
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
            {error && <p className="text-error text-sm mt-2">{error}</p>}
          </div>

          {file && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text
                  </label>
                  <input
                    {...register('alt_text')}
                    className="input-field"
                    placeholder="Image description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (Chinese)
                  </label>
                  <input
                    {...register('alt_text_chinese')}
                    className="input-field"
                    placeholder="圖片描述"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  {...register('category')}
                  className="input-field"
                  placeholder="blog, tools, lessons, etc."
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline"
              disabled={uploading}
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!file || uploading}
            >
              {uploading ? '上傳中...' : '上傳'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

