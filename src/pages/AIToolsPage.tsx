import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, Sparkles, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { aiToolsService } from '../services/aiToolsService';
import type { AITool } from '../types/database';

export const AIToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['ai-tools', selectedCategory],
    queryFn: () => aiToolsService.getAll({ category: selectedCategory === 'all' ? undefined : selectedCategory }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['ai-tools-categories'],
    queryFn: () => aiToolsService.getCategories(),
  });

  const filteredTools = tools.filter(tool => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.name_chinese?.toLowerCase().includes(query) ||
      tool.description?.toLowerCase().includes(query) ||
      tool.short_description?.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-1 mb-4">AI 工具</h1>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              探索各種實用 AI 工具，從簡報生成到影片製作，提升您的教學效率
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4 md:flex md:items-center md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋 AI 工具..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="all">所有類別</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tools Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-body-lg text-gray-600">找不到相關的 AI 工具</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <AIToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const AIToolCard = ({ tool }: { tool: AITool }) => {
  return (
    <Link
      to={`/ai-tools/${tool.slug}`}
      className="card-hover group block"
    >
      {tool.cover_image_url && (
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={tool.cover_image_url}
            alt={tool.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {tool.is_featured && (
            <div className="absolute top-2 right-2 bg-secondary-500 text-white px-2 py-1 rounded text-xs font-semibold">
              精選
            </div>
          )}
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className="heading-3 group-hover:text-primary-600 transition-colors">
          {tool.name}
        </h3>
        {tool.website_url && (
          <a
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-primary-600"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
      {tool.category && (
        <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded mb-2">
          {tool.category}
        </span>
      )}
      <p className="text-body text-gray-600 line-clamp-3">
        {tool.short_description || tool.description}
      </p>
      {tool.features && tool.features.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};

