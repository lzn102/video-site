import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <footer className="text-center py-4 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-sm text-gray-500 mb-1">
          <p>{t.warning}</p>
        </div>
        <div className="text-gray-600 text-sm">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}