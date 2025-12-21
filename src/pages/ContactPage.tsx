import { useTranslation } from 'react-i18next';
import { Layout } from '../components/layout/Layout';
import { Mail, MapPin, Clock } from 'lucide-react';

export const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-1 mb-4">{t('contact.title')}</h1>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="heading-3 mb-2">{t('contact.email')}</h3>
              <a
                href="mailto:cs@skillsparkhub.com"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                cs@skillsparkhub.com
              </a>
            </div>

            {/* Address */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="heading-3 mb-2">{t('contact.address')}</h3>
              <address className="text-body text-gray-700 not-italic">
                香港九龍塘達之路 72 號<br />
                創新中心<br />
                Innocentre<br />
                72 Tat Chee Avenue<br />
                Kowloon Tong, Hong Kong
              </address>
            </div>
          </div>

          {/* Office Hours */}
          <div className="card mb-8">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-primary-600 mr-2" />
              <h3 className="heading-3">{t('contact.officeHours')}</h3>
            </div>
            <div className="text-center">
              <p className="text-body text-gray-700">
                {t('contact.officeHoursDesc')}
              </p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="card">
            <h3 className="heading-3 mb-4 text-center">{t('contact.location')}</h3>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">{t('contact.mapPlaceholder')}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

