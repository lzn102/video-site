import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <footer id="footer-container-1" className="text-center py-4 border-t border-gray-200">
      <div id="footer-content-1" className="max-w-4xl mx-auto px-4">
        <div id="footer-warning-1" className="text-sm text-gray-500 mb-1">
          <p id="footer-warning-text-1">{t.warning}</p>
        </div>
        <div id="footer-copyright-1" className="text-gray-600 text-sm">
          <p id="footer-copyright-text-1">{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}