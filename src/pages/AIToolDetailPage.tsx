import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, Play, Image as ImageIcon, DollarSign } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { aiToolsService } from '../services/aiToolsService';

export const AIToolDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: tool, isLoading } = useQuery({
    queryKey: ['ai-tool', slug],
    queryFn: () => aiToolsService.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

  if (!tool) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="heading-2 mb-4">工具未找到</h1>
          <Link to="/ai-tools" className="btn-primary inline-flex items-center">
            <ArrowLeft className="mr-2 w-5 h-5" />
            返回 AI 工具列表
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/ai-tools"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回 AI 工具列表
            </Link>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="heading-1">{tool.name}</h1>
                  {tool.is_featured && (
                    <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      精選
                    </span>
                  )}
                </div>
                {tool.name_chinese && (
                  <p className="text-2xl text-gray-600 mb-4">{tool.name_chinese}</p>
                )}
                {tool.short_description && (
                  <p className="text-body-lg text-gray-700 mb-6">{tool.short_description}</p>
                )}
                {tool.website_url && (
                  <a
                    href={tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center"
                  >
                    訪問官方網站
                    <ExternalLink className="ml-2 w-5 h-5" />
                  </a>
                )}
              </div>
              {tool.cover_image_url && (
                <div className="ml-8 hidden lg:block">
                  <img
                    src={tool.cover_image_url}
                    alt={tool.name}
                    className="w-64 h-64 object-cover rounded-xl shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {tool.description && (
                <section>
                  <h2 className="heading-3 mb-4">關於此工具</h2>
                  <div className="text-body whitespace-pre-line">{tool.description}</div>
                </section>
              )}

              {/* Features */}
              {tool.features && tool.features.length > 0 && (
                <section>
                  <h2 className="heading-3 mb-4">主要功能</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <span className="text-body">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Use Cases */}
              {tool.use_cases && tool.use_cases.length > 0 && (
                <section>
                  <h2 className="heading-3 mb-4">應用場景</h2>
                  <div className="space-y-3">
                    {tool.use_cases.map((useCase, idx) => (
                      <div key={idx} className="card">
                        <p className="text-body">{useCase}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Screenshots */}
              {tool.screenshots && tool.screenshots.length > 0 && (
                <section>
                  <h2 className="heading-3 mb-4">截圖展示</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {tool.screenshots.map((screenshot, idx) => (
                      <div key={idx} className="rounded-lg overflow-hidden">
                        <img
                          src={screenshot}
                          alt={`${tool.name} screenshot ${idx + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Demo Video */}
              {tool.demo_video_url && (
                <section>
                  <h2 className="heading-3 mb-4">示範影片</h2>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <iframe
                      src={tool.demo_video_url}
                      className="w-full h-full"
                      allowFullScreen
                      title={`${tool.name} demo video`}
                    />
                  </div>
                </section>
              )}

              {/* Tutorials */}
              {tool.tutorial_urls && tool.tutorial_urls.length > 0 && (
                <section>
                  <h2 className="heading-3 mb-4">教學資源</h2>
                  <div className="space-y-2">
                    {tool.tutorial_urls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block card-hover p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-body">教學資源 {idx + 1}</span>
                          <ExternalLink className="w-5 h-5 text-primary-600" />
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Quick Info */}
                <div className="card">
                  <h3 className="heading-3 mb-4">工具資訊</h3>
                  <div className="space-y-3">
                    {tool.category && (
                      <div>
                        <span className="text-sm text-gray-500">類別</span>
                        <p className="text-body font-medium">{tool.category}</p>
                      </div>
                    )}
                    {tool.pricing_info && (
                      <div>
                        <span className="text-sm text-gray-500 flex items-center mb-1">
                          <DollarSign className="w-4 h-4 mr-1" />
                          定價
                        </span>
                        <div className="text-body">
                          {tool.pricing_info.free && (
                            <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-sm mr-2">
                              免費
                            </span>
                          )}
                          {tool.pricing_info.paid && (
                            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                              付費
                            </span>
                          )}
                          {tool.pricing_info.price && (
                            <p className="mt-1">{tool.pricing_info.price} {tool.pricing_info.currency || 'HKD'}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comparison */}
                {tool.comparison_data && (
                  <div className="card">
                    <h3 className="heading-3 mb-4">與其他工具比較</h3>
                    <div className="text-body text-sm text-gray-600">
                      {/* Render comparison data */}
                      <p>比較資訊將在此顯示</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

