import Head from 'next/head';
import { useState, useRef } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { usePoints } from '../contexts/PointsContext';
import { translations } from '../lib/translations';

export default function Merge() {
  const { language } = useLanguage();
  const { points, deductPoints } = usePoints();
  const t = translations[language];
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isMerging, setIsMerging] = useState(false);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile || !audioFile) {
      alert(language === 'zh' ? '请选择视频文件和音频文件' : 'Please select video and audio files');
      return;
    }
    
    // 检查积分是否足够
    if (points < 25) {
      const errorMsg = language === 'zh' ? 
        '积分不足，无法使用此服务。当前积分: ' + points + '，需要积分: 25' :
        'Insufficient points to use this service. Current points: ' + points + ', Required points: 25';
      setError(errorMsg);
      return;
    }
    
    // 扣除积分
    if (!deductPoints(25)) {
      const errorMsg = language === 'zh' ? 
        '积分扣除失败，请重试' :
        'Failed to deduct points, please try again';
      setError(errorMsg);
      return;
    }
    
    setIsMerging(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('audio', audioFile);
    
    try {
      const response = await fetch('/api/merge-video-audio', {
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
        ?.replace(/"/g, '') || 'merged-video.mp4';
      
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
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient">
      <Head>
        <title>{t.mergeTitle} - {t.homeTitle}</title>
        <meta name="description" content={language === 'zh' ? '将视频和音频文件无缝合并为新的视频文件' : 'Seamlessly merge video and audio files into new video files'} />
      </Head>

      <Header />
      <main className="main container">
        
        <div className="text-center pt-16 pb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t.mergeTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.mergeDescription}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="merge-form">
            <div className="file-input-container">
              <label className="block mb-2 font-medium text-gray-700">{t.videoFile}</label>
              <input 
                type="file" 
                ref={videoInputRef}
                onChange={handleVideoChange} 
                accept="video/*" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-outline-none focus-ring-2 focus-ring-blue-500 focus-border-blue-500"
              />
              {videoFile && <p className="mt-1 text-sm text-gray-500">{language === 'zh' ? '已选择视频:' : 'Selected video:'} {videoFile.name}</p>}
            </div>

            <div className="file-input-container">
              <label className="block mb-2 font-medium text-gray-700">{t.audioFile}</label>
              <input 
                type="file" 
                ref={audioInputRef}
                onChange={handleAudioChange} 
                accept="audio/*" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-outline-none focus-ring-2 focus-ring-blue-500 focus-border-blue-500"
              />
              {audioFile && <p className="mt-1 text-sm text-gray-500">{language === 'zh' ? '已选择音频:' : 'Selected audio:'} {audioFile.name}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={isMerging || !videoFile || !audioFile}
              className="btn-primary"
            >
              {isMerging ? (language === 'zh' ? `${t.merging} ⏳` : `${t.processing} ⏳`) : `${t.mergeButton} 🎬 (${language === 'zh' ? '消耗25积分' : '25 points'})`}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-6 text-center text-red-700 max-w-2xl mx-auto">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-6 text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-green-800 mb-3">{t.mergeSuccess}</h2>
            <a 
              href={result.url} 
              download={result.filename}
              className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover-bg-blue-700"
            >
              {t.mergeDownload} {result.filename}
            </a>
            <div className="mt-3 text-sm text-green-700">
              {language === 'zh' ? '已扣除 25 积分' : '25 points deducted'}
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}