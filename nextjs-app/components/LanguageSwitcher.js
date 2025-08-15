import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  
  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };
  
  return (
    <div className="language-switcher">
      <select 
        value={language} 
        onChange={handleLanguageChange}
        className="language-select"
      >
        <option value="zh">中文 🇨🇳</option>
        <option value="en">English 🇺🇸</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;