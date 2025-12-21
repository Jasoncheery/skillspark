import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import siteStructure from '../../config/siteStructure.json';

export const Footer = () => {
  const footerSections = siteStructure.navigation.footer.sections;
  const socialLinks = siteStructure.navigation.footer.social;

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-white">SkillSpark</span>
            </Link>
            <p className="text-sm mb-4">
              技撚星火 - 香港首個 AI 實用教學及應用平台
            </p>
            <p className="text-sm">
              賦能教育工作者，迎接 AI 教學新時代
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-primary-400" />
              <a
                href="mailto:info@skillspark.hk"
                className="text-sm hover:text-primary-400 transition-colors"
              >
                info@skillspark.hk
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-primary-400" />
              <a
                href="tel:+85212345678"
                className="text-sm hover:text-primary-400 transition-colors"
              >
                +852 1234 5678
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary-400" />
              <span className="text-sm">香港</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SkillSpark. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label={social.platform}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

