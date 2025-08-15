import Head from 'next/head';
import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { usePoints } from '../contexts/PointsContext';
import { translations } from '../lib/translations';

export default function Translate() {
  const { language } = useLanguage();
  const { points, deductPoints } = usePoints();
  const t = translations[language];
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('en');

  const handleFileUpload = async (formData) => {
    try {
      setError(null);
      
      // 检查积分是否足够
      if (points < 20) {
        const errorMsg = language === 'zh' ? 
          '积分不足，无法使用此服务。当前积分: ' + points + '，需要积分: 20' :
          'Insufficient points to use this service. Current points: ' + points + ', Required points: 20';
        setError(errorMsg);
        return;
      }
      
      // 扣除积分
      if (!deductPoints(20)) {
        const errorMsg = language === 'zh' ? 
          '积分扣除失败，请重试' :
          'Failed to deduct points, please try again';
        setError(errorMsg);
        return;
      }
      
      // 添加目标语言到表单数据
      formData.append('targetLanguage', targetLanguage);
      
      const response = await fetch('/api/translate-subtitle', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        // 如果处理失败，退还积分
        const newPoints = points;
        localStorage.setItem('userPoints', newPoints.toString());
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // 获取文件名
      const filename = response.headers.get('content-disposition')
        ?.split('filename=')[1]
        ?.replace(/"/g, '') || `translated-subtitles-${targetLanguage}.srt`;
      
      // 创建下载链接
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setResult({
        url,
        filename
      });
    } catch (err) {
      setError(language === 'zh' ? '处理失败，请重试' : 'Processing failed, please try again');
      console.error(err);
    }
  };

  const getLanguageName = (langCode) => {
    switch (langCode) {
      case 'en': return language === 'zh' ? '英语 🇺🇸' : 'English 🇺🇸';
      case 'zh': return language === 'zh' ? '中文 🇨🇳' : 'Chinese 🇨🇳';
      case 'ja': return language === 'zh' ? '日语 🇯🇵' : 'Japanese 🇯🇵';
      case 'ko': return language === 'zh' ? '韩语 🇰🇷' : 'Korean 🇰🇷';
      case 'fr': return language === 'zh' ? '法语 🇫🇷' : 'French 🇫🇷';
      case 'de': return language === 'zh' ? '德语 🇩🇪' : 'German 🇩🇪';
      case 'es': return language === 'zh' ? '西班牙语 🇪🇸' : 'Spanish 🇪🇸';
      default: return language === 'zh' ? '英语 🇺🇸' : 'English 🇺🇸';
    }
  };

  return (
    <div id="translate-container-1" className="min-h-screen bg-gradient">
      <Head>
        <title id="translate-title-1">{t.translateTitle} - {t.homeTitle}</title>
        <meta id="translate-description-meta-1" name="description" content={language === 'zh' ? '将字幕文件翻译为多种语言，支持国际化内容' : 'Translate subtitle files into multiple languages, supports international content'} />
      </Head>

      <Header />
      <main id="translate-main-1" className="main container">
        
        <div id="translate-hero-section-1" className="text-center pt-16 pb-12">
          <h1 id="translate-heading-1" className="text-4xl font-bold text-gray-800 mb-4">
            {t.translateTitle}
          </h1>
          <p id="translate-description-1" className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.translateDescription}
          </p>
        </div>

        <div id="translate-form-container-1" className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div id="translate-language-selector-1" className="language-selector">
            <label id="translate-language-label-1" htmlFor="translate-language-select-1" className="block mb-2 font-medium text-gray-700">
              {t.targetLanguage} 🌍:
            </label>
            <select 
              id="translate-language-select-1" 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-outline-none focus-ring-2 focus-ring-blue-500 focus-border-blue-500"
            >
              <option id="translate-language-option-en-1" value="en">{getLanguageName('en')}</option>
              <option id="translate-language-option-zh-1" value="zh">{getLanguageName('zh')}</option>
              <option id="translate-language-option-ja-1" value="ja">{getLanguageName('ja')}</option>
              <option id="translate-language-option-ko-1" value="ko">{getLanguageName('ko')}</option>
              <option id="translate-language-option-fr-1" value="fr">{getLanguageName('fr')}</option>
              <option id="translate-language-option-de-1" value="de">{getLanguageName('de')}</option>
              <option id="translate-language-option-es-1" value="es">{getLanguageName('es')}</option>
            </select>
          </div>

          <UploadForm 
            onFileUpload={handleFileUpload} 
            fileType="subtitle" 
            buttonText={`${t.translateButton} 🌍 (${language === 'zh' ? '消耗20积分' : '20 points'})`} 
          />
        </div>

        {error && (
          <div id="translate-error-container-1" className="bg-red-50 border border-red-200 rounded-md p-4 mt-6 text-center text-red-700 max-w-2xl mx-auto">
            <p id="translate-error-message-1">{error}</p>
          </div>
        )}

        {result && (
          <div id="translate-result-container-1" className="bg-green-50 border border-green-200 rounded-md p-4 mt-6 text-center max-w-2xl mx-auto">
            <h2 id="translate-result-title-1" className="text-xl font-bold text-green-800 mb-3">{t.translateSuccess}</h2>
            <a 
              id="translate-download-link-1"
              href={result.url} 
              download={result.filename}
              className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover-bg-blue-700"
            >
              {t.translateDownload} {result.filename}
            </a>
            <div id="translate-points-deducted-1" className="mt-3 text-sm text-green-700">
              {language === 'zh' ? '已扣除 20 积分' : '20 points deducted'}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}