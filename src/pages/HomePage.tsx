import { Link } from 'react-router-dom';
import { Sparkles, Video, Users, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import siteStructure from '../config/siteStructure.json';

export const HomePage = () => {
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
              {hero?.title || '香港首個 AI 實用教學及應用平台'}
            </h1>
            <p className="text-body-lg max-w-3xl mx-auto mb-8 text-gray-600">
              {hero?.subtitle || '賦能教育工作者，迎接 AI 教學新時代'}
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
              <h2 className="heading-2 mb-4">{features.title}</h2>
              <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
                {features.titleEn}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.items?.map((item, index) => (
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
              ))}
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
              {stats.items?.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-xl text-primary-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">我們是誰：從行業專家到 AI 教育者</h2>
              <div className="space-y-4 text-body">
                <p>
                  <strong>我們的身份：SkillSpark</strong>
                </p>
                <p>
                  <strong>我們的使命：</strong>賦能教育工作者，迎接 AI 教學新時代
                </p>
                <div>
                  <strong>我們的獨特背景：</strong>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>「我們不僅教授 AI；我們創造 AI。」</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>我們的根基來自一家領先的 IT 解決方案公司，曾為香港的學校和教育機構等重要客戶成功交付 AI 產品。</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>現在，我們經驗豐富的 AI 實踐團隊致力於通過教育分享這些實戰知識，將前沿的 AI 技術帶給教育工作者。</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="heading-3 mb-6">我們做什麼及為何對您重要</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">我們的服務：</h4>
                  <p className="text-body text-gray-600">
                    我們為專業人士、教育工作者和學生提供實用的動手 AI 和技術課程，幫助他們掌握未來所需的技能。我們擁有成功的培訓記錄，例如曾為本地學校和教育局成功舉辦工作坊，協助其團隊有效應用 AI 技術。
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">我們如何賦能中學教師：</h4>
                  <p className="text-body text-gray-600">
                    我們幫助您深入了解 AI 將如何變革教育行業，並提供實用的工具和策略，讓您在充滿變革的教學環境中保持領先。
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

