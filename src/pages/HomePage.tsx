import { Link } from 'react-router-dom';
import { Sparkles, Video, Users, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/layout/Layout';
import siteStructure from '../config/siteStructure.json';

export const HomePage = () => {
  const { t } = useTranslation();
  const hero = siteStructure.pages.home.sections.find(s => s.type === 'hero');
  const features = siteStructure.pages.home.sections.find(s => s.type === 'features');
  const stats = siteStructure.pages.home.sections.find(s => s.type === 'stats');
  const cta = siteStructure.pages.home.sections.find(s => s.type === 'cta');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="w-8 h-8" />;
      case 'video':
        return <Video className="w-8 h-8" />;
      case 'users':
        return <Users className="w-8 h-8" />;
      case 'book':
        return <BookOpen className="w-8 h-8" />;
      default:
        return <Sparkles className="w-8 h-8" />;
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="heading-1 mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-body-lg max-w-3xl mx-auto mb-8 text-gray-600">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hero?.cta?.primary && (
                <Link to={hero.cta.primary.path} className="btn-primary inline-flex items-center">
                  {hero.cta.primary.label}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              )}
              {hero?.cta?.secondary && (
                <Link to={hero.cta.secondary.path} className="btn-outline inline-flex items-center">
                  {hero.cta.secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {features && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">{t('home.features.title')}</h2>
              <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.items?.map((item: any, index) => {
                if (!item.path || !item.icon) return null;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className="card-hover group"
                  >
                    <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                      {getIcon(item.icon)}
                    </div>
                    <h3 className="heading-3 mb-2">{item.title}</h3>
                    <p className="text-body text-gray-600">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {stats && (
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 text-white mb-4">{stats.title}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {stats.items?.map((stat: any, index) => {
                if (!stat.value || !stat.label) return null;
                return (
                  <div key={index} className="text-center">
                    <div className="text-5xl font-bold mb-2">{stat.value}</div>
                    <div className="text-xl text-primary-100">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">{t('home.about.title')}</h2>
              <div className="space-y-4 text-body">
                <p>
                  <strong>{t('home.about.identity')}</strong>
                </p>
                <p>
                  <strong>{t('home.about.mission')}</strong>{t('home.about.missionText')}
                </p>
                <div>
                  <strong>{t('home.about.background')}</strong>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{t('home.about.background1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{t('home.about.background2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{t('home.about.background3')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="heading-3 mb-6">{t('home.about.whatWeDo')}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">{t('home.about.services')}</h4>
                  <p className="text-body text-gray-600">
                    {t('home.about.servicesText')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('home.about.empower')}</h4>
                  <p className="text-body text-gray-600">
                    {t('home.about.empowerText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {cta && (
        <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="heading-2 text-white mb-4">{cta.title}</h2>
            <p className="text-body-lg text-primary-100 mb-8">{cta.description}</p>
            {cta.button && (
              <Link to={cta.button.path} className="btn-secondary inline-flex items-center">
                {cta.button.label}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
};

