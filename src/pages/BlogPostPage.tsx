import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { blogService } from '../services/blogService';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

export const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogService.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="heading-2 mb-4">文章未找到</h1>
          <Link to="/blog" className="btn-primary inline-flex items-center">
            <ArrowLeft className="mr-2 w-5 h-5" />
            返回文章列表
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-50 to-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回文章列表
            </Link>
            {post.category && (
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full mb-4">
                {post.category}
              </span>
            )}
            <h1 className="heading-1 mb-4">{post.title}</h1>
            {post.title_chinese && (
              <p className="text-2xl text-gray-600 mb-6">{post.title_chinese}</p>
            )}
            {post.excerpt && (
              <p className="text-body-lg text-gray-700 mb-6">{post.excerpt}</p>
            )}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              {post.published_at && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.published_at), 'yyyy年MM月dd日')}</span>
                </div>
              )}
              {post.view_count > 0 && (
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count} 次瀏覽</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">標籤：</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              to="/blog"
              className="btn-outline inline-flex items-center"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              返回文章列表
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

