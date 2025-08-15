import { usePoints } from '../contexts/PointsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

// 不同服务的积分消耗
const SERVICE_POINTS = {
  extract: 10,      // 视频语音提取
  transcribe: 15,   // 语音转字幕
  translate: 20,    // 字幕翻译
  merge: 25         // 视频音频合并
};

export const useServicePoints = () => {
  const { points, deductPoints } = usePoints();
  const { language } = useLanguage();
  const t = translations[language];
  
  const getServicePoints = (service) => {
    return SERVICE_POINTS[service] || 0;
  };
  
  const canUseService = (service) => {
    const requiredPoints = getServicePoints(service);
    return points >= requiredPoints;
  };
  
  const useService = (service) => {
    const requiredPoints = getServicePoints(service);
    return deductPoints(requiredPoints);
  };
  
  const getPointsMessage = (service) => {
    const requiredPoints = getServicePoints(service);
    if (language === 'zh') {
      return `使用此服务需要 ${requiredPoints} 积分，您当前有 ${points} 积分。`;
    } else {
      return `This service requires ${requiredPoints} points. You currently have ${points} points.`;
    }
  };
  
  return {
    points,
    getServicePoints,
    canUseService,
    useService,
    getPointsMessage
  };
};