import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  
  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };
  
  return (
    <div id="language-switcher-container-1" className="language-switcher">
      <select 
        id="language-switcher-select-1"
        value={language} 
        onChange={handleLanguageChange}
        className="language-select"
      >
        <option id="language-switcher-option-zh-1" value="zh">中文 🇨🇳</option>
        <option id="language-switcher-option-en-1" value="en">English 🇺🇸</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;