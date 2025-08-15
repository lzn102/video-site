import { usePoints } from '../contexts/PointsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

const PointsDisplay = () => {
  const { points } = usePoints();
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div id="points-display-container-1" className="points-display">
      <span id="points-display-label-1" className="points-label">💎</span>
      <span id="points-display-value-1" className="points-value">{points}</span>
    </div>
  );
};

export default PointsDisplay;