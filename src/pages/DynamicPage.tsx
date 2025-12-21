import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { pageService } from '../services/pageService';
import ReactMarkdown from 'react-markdown';

export const DynamicPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => pageService.getBySlug(slug!),
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

  if (!page) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="heading-2 mb-4">{t('common.pageNotFound')}</h1>
          <p className="text-body-lg text-gray-600 mb-6">
            {t('common.pageNotFoundDesc')}
          </p>
          <Link to="/" className="btn-primary inline-flex items-center">
            <ArrowLeft className="mr-2 w-5 h-5" />
            {t('common.backToHome')}
          </Link>
        </div>
      </Layout>
    );
  }

  // Determine which content to show (prefer Chinese if available, fallback to English)
  const displayTitle = page.title_chinese || page.title;
  const displayContent = page.content_chinese || page.content || '';

  return (
    <Layout>
      <article className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-50 to-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.backToHome')}
            </Link>
            <h1 className="heading-1">{displayTitle}</h1>
            {page.title_chinese && page.title && (
              <p className="text-2xl text-gray-600 mt-2">{page.title}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            {displayContent ? (
              <ReactMarkdown>{displayContent}</ReactMarkdown>
            ) : (
              <p className="text-gray-500">{t('common.noContent')}</p>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link to="/" className="btn-outline inline-flex items-center">
              <ArrowLeft className="mr-2 w-5 h-5" />
              {t('common.backToHome')}
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

