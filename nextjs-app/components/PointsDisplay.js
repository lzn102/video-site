import { usePoints } from '../contexts/PointsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

const PointsDisplay = () => {
  const { points } = usePoints();
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div className="points-display">
      <span className="points-label">💎</span>
      <span className="points-value">{points}</span>
    </div>
  );
};

export default PointsDisplay;