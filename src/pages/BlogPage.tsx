import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Calendar, Eye, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { blogService } from '../services/blogService';
import { format } from 'date-fns';

export const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts', selectedCategory],
    queryFn: () => blogService.getAll({ category: selectedCategory === 'all' ? undefined : selectedCategory }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => blogService.getCategories(),
  });

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.title_chinese?.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-1 mb-4">AI 攻略</h1>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              最新 AI 技術資訊與實用教學內容
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4 md:flex md:items-center md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋文章..."
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

          {/* Posts Grid */}
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
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-body-lg text-gray-600">找不到相關的文章</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const BlogPostCard = ({ post }: { post: any }) => {
  return (
    <Link to={`/blog/${post.slug}`} className="card-hover group block">
      {post.cover_image_url && (
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.is_featured && (
            <div className="absolute top-2 right-2 bg-secondary-500 text-white px-2 py-1 rounded text-xs font-semibold">
              精選
            </div>
          )}
        </div>
      )}
      {post.category && (
        <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded mb-2">
          {post.category}
        </span>
      )}
      <h3 className="heading-3 mb-2 group-hover:text-primary-600 transition-colors">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-body text-gray-600 line-clamp-3 mb-4">
          {post.excerpt}
        </p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        {post.published_at && (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(post.published_at), 'yyyy-MM-dd')}</span>
          </div>
        )}
        {post.view_count > 0 && (
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{post.view_count}</span>
          </div>
        )}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag: string, idx: number) => (
            <span
              key={idx}
              className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center text-primary-600 group-hover:text-primary-700">
        <span className="text-sm font-medium">閱讀更多</span>
        <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </Link>
  );
};

