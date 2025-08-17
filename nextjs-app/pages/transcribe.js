import Head from 'next/head';
import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { usePoints } from '../contexts/PointsContext';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../lib/translations';

export default function Transcribe() {
  const { language } = useLanguage();
  const { points, deductPoints } = usePoints();
  const { isAuthenticated } = useAuth();
  const t = translations[language];
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (formData) => {
    try {
      setError(null);
      
      // 检查用户是否已登录
      if (!isAuthenticated) {
        const errorMsg = language === 'zh' ? 
          '请先登录以使用此服务' :
          'Please log in to use this service';
        setError(errorMsg);
        return;
      }
      
      // 检查积分是否足够
      if (points < 15) {
        const errorMsg = language === 'zh' ? 
          '积分不足，无法使用此服务。当前积分: ' + points + '，需要积分: 15' :
          'Insufficient points to use this service. Current points: ' + points + ', Required points: 15';
        setError(errorMsg);
        return;
      }
      
      // 扣除积分
      const deductionSuccess = await deductPoints(15, language === 'zh' ? '语音转字幕服务' : 'Audio to Subtitle Service');
      if (!deductionSuccess) {
        const errorMsg = language === 'zh' ? 
          '积分扣除失败，请重试' :
          'Failed to deduct points, please try again';
        setError(errorMsg);
        return;
      }
      
      const response = await fetch('/api/speech-to-subtitle', {
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
        ?.replace(/"/g, '') || 'transcribed-subtitles.srt';
      
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

  return (
    <div id="transcribe-container-1" className="min-h-screen bg-gradient">
      <Head>
        <title id="transcribe-title-1">{t.transcribeTitle} - {t.homeTitle}</title>
        <meta id="transcribe-description-meta-1" name="description" content={language === 'zh' ? '将音频文件智能转换为带时间戳的字幕文件' : 'Intelligently convert audio files to timestamped subtitle files'} />
      </Head>

      <Header />
      <main id="transcribe-main-1" className="main container">
        
        <div id="transcribe-hero-section-1" className="text-center pt-16 pb-12">
          <h1 id="transcribe-heading-1" className="text-4xl font-bold text-gray-800 mb-4">
            {t.transcribeTitle}
          </h1>
          <p id="transcribe-description-1" className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.transcribeDescription}
          </p>
        </div>

        <div id="transcribe-form-container-1" className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <UploadForm 
            onFileUpload={handleFileUpload} 
            fileType="audio" 
            buttonText={`${t.transcribeButton} 📝 (${language === 'zh' ? '消耗15积分' : '15 points'})`} 
          />
        </div>

        {error && (
          <div id="transcribe-error-container-1" className="bg-red-50 border border-red-200 rounded-md p-4 mt-6 text-center text-red-700 max-w-2xl mx-auto">
            <p id="transcribe-error-message-1">{error}</p>
          </div>
        )}

        {result && (
          <div id="transcribe-result-container-1" className="bg-green-50 border border-green-200 rounded-md p-4 mt-6 text-center max-w-2xl mx-auto">
            <h2 id="transcribe-result-title-1" className="text-xl font-bold text-green-800 mb-3">{t.transcribeSuccess}</h2>
            <a 
              id="transcribe-download-link-1"
              href={result.url} 
              download={result.filename}
              className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover-bg-blue-700"
            >
              {t.transcribeDownload} {result.filename}
            </a>
            <div id="transcribe-points-deducted-1" className="mt-3 text-sm text-green-700">
              {language === 'zh' ? '已扣除 15 积分' : '15 points deducted'}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}