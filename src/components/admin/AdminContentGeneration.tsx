import { useState } from 'react';
import { Sparkles, Play } from 'lucide-react';

export const AdminContentGeneration = () => {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">AI 內容生成</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="heading-3 mb-4 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
            生成文章
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主題
              </label>
              <input
                type="text"
                placeholder="例如：如何使用 Gamma 創建簡報"
                className="input-field"
              />
            </div>
            <button className="btn-primary w-full inline-flex items-center justify-center">
              <Play className="w-5 h-5 mr-2" />
              生成文章
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="heading-3 mb-4 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
            生成工具描述
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工具名稱
              </label>
              <input
                type="text"
                placeholder="例如：Gamma"
                className="input-field"
              />
            </div>
            <button className="btn-primary w-full inline-flex items-center justify-center">
              <Play className="w-5 h-5 mr-2" />
              生成描述
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="heading-3 mb-4">生成歷史</h3>
        <div className="text-center py-12 text-gray-500">
          生成歷史將在此顯示...
        </div>
      </div>
    </div>
  );
};

