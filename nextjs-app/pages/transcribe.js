import Head from 'next/head';
import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { usePoints } from '../contexts/PointsContext';
import { translations } from '../lib/translations';

export default function Transcribe() {
  const { language } = useLanguage();
  const { points, deductPoints } = usePoints();
  const t = translations[language];
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (formData) => {
    try {
      setError(null);
      
      // 检查积分是否足够
      if (points < 15) {
        const errorMsg = language === 'zh' ? 
          '积分不足，无法使用此服务。当前积分: ' + points + '，需要积分: 15' :
          'Insufficient points to use this service. Current points: ' + points + ', Required points: 15';
        setError(errorMsg);
        return;
      }
      
      // 扣除积分
      if (!deductPoints(15)) {
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
    <div className="min-h-screen bg-gradient">
      <Head>
        <title>{t.transcribeTitle} - {t.homeTitle}</title>
        <meta name="description" content={language === 'zh' ? '将音频文件智能转换为带时间戳的字幕文件' : 'Intelligently convert audio files to timestamped subtitle files'} />
      </Head>

      <Header />
      <main className="main container">
        
        <div className="text-center pt-16 pb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t.transcribeTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.transcribeDescription}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <UploadForm 
            onFileUpload={handleFileUpload} 
            fileType="audio" 
            buttonText={`${t.transcribeButton} 📝 (${language === 'zh' ? '消耗15积分' : '15 points'})`} 
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-6 text-center text-red-700 max-w-2xl mx-auto">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-6 text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-green-800 mb-3">{t.transcribeSuccess}</h2>
            <a 
              href={result.url} 
              download={result.filename}
              className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover-bg-blue-700"
            >
              {t.transcribeDownload} {result.filename}
            </a>
            <div className="mt-3 text-sm text-green-700">
              {language === 'zh' ? '已扣除 15 积分' : '15 points deducted'}
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}