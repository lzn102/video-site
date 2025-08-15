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
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link href="/" className="logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">{language === 'zh' ? '多媒体工具' : 'Media Tools'}</span>
          </Link>
        </div>
        <div className="header-right">
          <div className="points-display-header">
            <span className="points-label">💎</span>
            <span className="points-value">{points}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;