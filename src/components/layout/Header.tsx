import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import siteStructure from '../../config/siteStructure.json';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { user, profile } = useAuthStore();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">SkillSpark</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {siteStructure.navigation.main.map((item) => {
              const navKey = item.path === '/' ? 'home' : 
                            item.path === '/ai-tools' ? 'aiTools' :
                            item.path === '/lessons' ? 'lessons' :
                            item.path === '/blog' ? 'blog' :
                            item.path === '/about' ? 'about' :
                            item.path === '/contact' ? 'contact' : '';
              const label = navKey ? t(`nav.${navKey}`) : item.label;
              
              if (item.children) {
                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-primary-600'
                          : 'text-gray-700 hover:text-primary-600'
                      }`}
                    >
                      <span>{label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {profile?.full_name || user.email}
                </span>
                <Link
                  to={`/dashboard/${profile?.role === 'admin' ? 'admin' : profile?.role === 'teacher' ? 'teacher' : 'student'}`}
                  className="text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  {t('common.dashboard')}
                </Link>
                <button
                  onClick={async () => {
                    await useAuthStore.getState().signOut();
                    window.location.href = '/';
                  }}
                  className="btn-ghost text-sm"
                >
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  {t('common.login')}
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  {t('common.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button and language switcher */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {siteStructure.navigation.main.map((item) => {
              const navKey = item.path === '/' ? 'home' : 
                            item.path === '/ai-tools' ? 'aiTools' :
                            item.path === '/lessons' ? 'lessons' :
                            item.path === '/blog' ? 'blog' :
                            item.path === '/about' ? 'about' :
                            item.path === '/contact' ? 'contact' : '';
              const label = navKey ? t(`nav.${navKey}`) : item.label;
              
              return (
                <div key={item.path}>
                  {item.children ? (
                    <div>
                      <button
                        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => handleDropdownToggle(item.label)}
                      >
                        <span>{label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openDropdown === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  )}
                </div>
              );
            })}
            <div className="mt-4 pt-4 border-t border-gray-200 px-4 space-y-2">
              {user ? (
                <>
                  <div className="text-sm text-gray-600 mb-2 text-center">
                    {profile?.full_name || user.email}
                  </div>
                  <Link
                    to={`/dashboard/${profile?.role === 'admin' ? 'admin' : profile?.role === 'teacher' ? 'teacher' : 'student'}`}
                    className="block btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('common.dashboard')}
                  </Link>
                  <button
                    onClick={async () => {
                      await useAuthStore.getState().signOut();
                      setMobileMenuOpen(false);
                      window.location.href = '/';
                    }}
                    className="block w-full btn-outline text-center"
                  >
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block btn-outline text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('common.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

