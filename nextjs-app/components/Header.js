import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { usePoints } from '../contexts/PointsContext';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../lib/translations';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { language } = useLanguage();
  const { points } = usePoints();
  const { user, logout } = useAuth();
  const t = translations[language];
  
  return (
    <header id="header-container-1" className="header">
      <div id="header-content-1" className="header-content">
        <div id="header-left-1" className="header-left">
          <Link id="header-logo-link-1" href="/" className="logo">
            <span id="header-logo-icon-1" className="logo-icon">🎬</span>
            <span id="header-logo-text-1" className="logo-text">{language === 'zh' ? '多媒体工具' : 'Media Tools'}</span>
          </Link>
        </div>
        <div id="header-right-1" className="header-right">
          <div id="header-points-display-1" className="points-display-header">
            <span id="header-points-label-1" className="points-label">💎</span>
            <span id="header-points-value-1" className="points-value">{points}</span>
          </div>
          {user ? (
            <div id="header-user-actions-1" className="flex items-center space-x-4">
              <Link 
                id="header-recharge-link-1"
                href="/recharge" 
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors hidden md:inline"
              >
                {language === 'zh' ? '充值' : 'Recharge'}
              </Link>
              <span id="header-username-1" className="text-gray-700 hidden md:inline">
                {user.username}
              </span>
              <button
                id="header-logout-button-1"
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                {language === 'zh' ? '退出' : 'Logout'}
              </button>
            </div>
          ) : (
            <Link 
              id="header-login-link-1"
              href="/login" 
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {language === 'zh' ? '登录' : 'Login'}
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;