import Head from 'next/head';
import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { usePoints } from '../contexts/PointsContext';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../lib/translations';

export default function Extract() {
  const { language } = useLanguage();
  const { points, deductPoints } = usePoints();
  const { isAuthenticated } = useAuth();
  const t = translations[language];
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      if (points < 10) {
        const errorMsg = language === 'zh' ? 
          '积分不足，无法使用此服务。当前积分: ' + points + '，需要积分: 10' :
          'Insufficient points to use this service. Current points: ' + points + ', Required points: 10';
        setError(errorMsg);
        return;
      }
      
      // 扣除积分
      const deductionSuccess = await deductPoints(10, language === 'zh' ? '视频音频提取服务' : 'Video Audio Extraction Service');
      if (!deductionSuccess) {
        const errorMsg = language === 'zh' ? 
          '积分扣除失败，请重试' :
          'Failed to deduct points, please try again';
        setError(errorMsg);
        return;
      }
      
      setIsProcessing(true);
      
      const response = await fetch('/api/extract-audio', {
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
        ?.replace(/"/g, '') || 'extracted-audio.mp3';
      
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="extract-container-1" className="min-h-screen bg-gradient">
      <Head>
        <title id="extract-title-1">{t.extractTitle} - {t.homeTitle}</title>
        <meta id="extract-description-meta-1" name="description" content={language === 'zh' ? '从视频中提取音频文件，支持多种视频格式' : 'Extract audio files from videos, supports multiple video formats'} />
      </Head>

      <Header />
      <main id="extract-main-1" className="main container">
        
        <div id="extract-hero-section-1" className="text-center pt-16 pb-12">
          <h1 id="extract-heading-1" className="text-4xl font-bold text-gray-800 mb-4">
            {t.extractTitle}
          </h1>
          <p id="extract-description-1" className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.extractDescription}
          </p>
        </div>

        <div id="extract-form-container-1" className="rounded-lg shadow-md p-8 max-w-2xl mx-auto w-4/5">
          <UploadForm 
            onFileUpload={handleFileUpload} 
            fileType="video" 
            buttonText={isProcessing ? (language === 'zh' ? '处理中... ⏳' : 'Processing... ⏳') : `${t.extractButton} 🔊 (${language === 'zh' ? '消耗10积分' : '10 points'})`} 
            showPreview={true}
          />
        </div>

        {error && (
          <div id="extract-error-container-1" className="bg-red-50 border border-red-200 rounded-md p-4 mt-6 text-center text-red-700 max-w-2xl mx-auto">
            <p id="extract-error-message-1">{error}</p>
          </div>
        )}

        {result && (
          <div id="extract-result-container-1" className="bg-green-50 border border-green-200 rounded-md p-4 mt-6 text-center max-w-2xl mx-auto">
            <h2 id="extract-result-title-1" className="text-xl font-bold text-green-800 mb-3">{t.extractSuccess}</h2>
            <a 
              id="extract-download-link-1"
              href={result.url} 
              download={result.filename}
              className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover-bg-blue-700"
            >
              {t.extractDownload} {result.filename}
            </a>
            <div id="extract-points-deducted-1" className="mt-3 text-sm text-green-700">
              {language === 'zh' ? '已扣除 10 积分' : '10 points deducted'}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}