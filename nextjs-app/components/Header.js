import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { usePoints } from '../contexts/PointsContext';
import { translations } from '../lib/translations';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { language } = useLanguage();
  const { points } = usePoints();
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
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;