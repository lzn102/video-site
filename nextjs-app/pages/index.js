import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { usePoints } from '../contexts/PointsContext';
import { translations } from '../lib/translations';

export default function Home() {
  const { language } = useLanguage();
  const { points } = usePoints();
  const t = translations[language];
  
  // 积分消耗信息
  const servicePoints = {
    extract: 10,
    transcribe: 15,
    translate: 20,
    merge: 25
  };
  
  return (
    <div id="home-container-1" className="min-h-screen bg-gradient">
      <Head>
        <title id="home-title-1">{t.homeTitle} - {language === 'zh' ? '一站式视频音频处理平台' : 'One-stop Video Audio Processing Platform'}</title>
        <meta id="home-description-meta-1" name="description" content={language === 'zh' ? '专业的视频音频处理工具集，提供视频语音提取、语音转字幕、字幕翻译、视频音频合并等功能' : 'Professional video and audio processing toolset, providing video audio extraction, speech to subtitle, subtitle translation, video audio merging and other functions'} />
        <link id="home-favicon-link-1" rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main id="home-main-1" className="main container">
        
        <div id="home-hero-section-1" className="text-center pt-16 pb-12">
          <h1 id="home-heading-1" className="text-4xl md-text-5xl font-bold text-gray-800 mb-6">
            {t.homeTitle}
          </h1>
          <p id="home-description-1" className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.homeDescription}
          </p>
        </div>

        <div id="home-features-grid-1" className="grid gap-6 max-w-6xl mx-auto lg-grid-cols-4 md-grid-cols-2">
          <Link id="home-extract-link-1" href="/extract" className="card">
            <h2 id="home-extract-title-1" className="text-xl font-bold">
              {t.videoExtract} 
              <span id="home-extract-icon-1" className="text-blue-500 text-2xl">🔊</span>
            </h2>
            <p id="home-extract-description-1" className="mt-3 text-gray-600">{language === 'zh' ? '从视频中提取高质量音频文件，支持多种视频格式' : 'Extract high-quality audio files from videos, supports multiple video formats'}</p>
            <div id="home-extract-points-1" className="mt-2 text-sm text-gray-500">
              {language === 'zh' ? `消耗积分: ${servicePoints.extract}` : `Points: ${servicePoints.extract}`}
            </div>
          </Link>

          <Link id="home-transcribe-link-1" href="/transcribe" className="card">
            <h2 id="home-transcribe-title-1" className="text-xl font-bold">
              {t.audioTranscribe} 
              <span id="home-transcribe-icon-1" className="text-blue-500 text-2xl">📝</span>
            </h2>
            <p id="home-transcribe-description-1" className="mt-3 text-gray-600">{language === 'zh' ? '将音频文件智能转换为带时间戳的字幕文件' : 'Intelligently convert audio files to timestamped subtitle files'}</p>
            <div id="home-transcribe-points-1" className="mt-2 text-sm text-gray-500">
              {language === 'zh' ? `消耗积分: ${servicePoints.transcribe}` : `Points: ${servicePoints.transcribe}`}
            </div>
          </Link>

          <Link id="home-translate-link-1" href="/translate" className="card">
            <h2 id="home-translate-title-1" className="text-xl font-bold">
              {t.subtitleTranslate} 
              <span id="home-translate-icon-1" className="text-blue-500 text-2xl">🌍</span>
            </h2>
            <p id="home-translate-description-1" className="mt-3 text-gray-600">{language === 'zh' ? '将字幕文件翻译为多种语言，支持国际化内容' : 'Translate subtitle files into multiple languages, supports international content'}</p>
            <div id="home-translate-points-1" className="mt-2 text-sm text-gray-500">
              {language === 'zh' ? `消耗积分: ${servicePoints.translate}` : `Points: ${servicePoints.translate}`}
            </div>
          </Link>

          <Link id="home-merge-link-1" href="/merge" className="card">
            <h2 id="home-merge-title-1" className="text-xl font-bold">
              {t.videoMerge} 
              <span id="home-merge-icon-1" className="text-blue-500 text-2xl">🎥</span>
            </h2>
            <p id="home-merge-description-1" className="mt-3 text-gray-600">{language === 'zh' ? '将视频和音频文件无缝合并为新的视频文件' : 'Seamlessly merge video and audio files into new video files'}</p>
            <div id="home-merge-points-1" className="mt-2 text-sm text-gray-500">
              {language === 'zh' ? `消耗积分: ${servicePoints.merge}` : `Points: ${servicePoints.merge}`}
            </div>
          </Link>
        </div>

        <div id="home-instructions-section-1" className="mt-16 text-center">
          <div id="home-instructions-container-1" className="inline-block rounded-lg p-6 max-w-6xl w-full">
            <h2 id="home-instructions-title-1" className="text-2xl font-bold text-gray-800 mb-6">{t.howToUse}</h2>
            <div id="home-instructions-grid-1" className="grid grid-cols-1 md-grid-cols-2 gap-8">
              <div id="home-step-1-container-1" className="text-left">
                <h3 id="home-step-1-title-1" className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span id="home-step-1-number-1" className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">1️⃣</span>
                  {t.step1} 🔍
                </h3>
                <p id="home-step-1-description-1" className="text-gray-600 ml-11">
                  {t.step1Desc}
                </p>
              </div>
              
              <div id="home-step-2-container-1" className="text-left">
                <h3 id="home-step-2-title-1" className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span id="home-step-2-number-1" className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">2️⃣</span>
                  {t.step2} 📤
                </h3>
                <p id="home-step-2-description-1" className="text-gray-600 ml-11">
                  {t.step2Desc}
                </p>
              </div>
              
              <div id="home-step-3-container-1" className="text-left">
                <h3 id="home-step-3-title-1" className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span id="home-step-3-number-1" className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">3️⃣</span>
                  {t.step3} ⏳
                </h3>
                <p id="home-step-3-description-1" className="text-gray-600 ml-11">
                  {t.step3Desc}
                </p>
              </div>
              
              <div id="home-step-4-container-1" className="text-left">
                <h3 id="home-step-4-title-1" className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span id="home-step-4-number-1" className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">4️⃣</span>
                  {t.step4} 📥
                </h3>
                <p id="home-step-4-description-1" className="text-gray-600 ml-11">
                  {t.step4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="home-features-section-1" className="mt-16 text-center">
          <div id="home-features-container-1" className="inline-block bg-blue-50 rounded-lg shadow-md p-6 max-w-4xl w-full">
            <h2 id="home-features-title-1" className="text-2xl font-bold text-gray-800 mb-4">{t.whyChooseUs}</h2>
            <div id="home-features-benefits-grid-1" className="grid grid-cols-1 md-grid-cols-3 gap-6 mt-6">
              <div id="home-feature-1-container-1" className="p-4 bg-white rounded-lg flex flex-col items-center text-center">
                <div id="home-feature-1-icon-1" className="text-blue-600 text-3xl mb-3">⚡</div>
                <h3 id="home-feature-1-title-1" className="font-semibold text-gray-800 mb-2">{t.fastProcessing}</h3>
                <p id="home-feature-1-description-1" className="text-gray-600 text-sm">
                  {t.fastProcessingDesc}
                </p>
              </div>
              <div id="home-feature-2-container-1" className="p-4 bg-white rounded-lg flex flex-col items-center text-center">
                <div id="home-feature-2-icon-1" className="text-blue-600 text-3xl mb-3">🔒</div>
                <h3 id="home-feature-2-title-1" className="font-semibold text-gray-800 mb-2">{t.secureReliable}</h3>
                <p id="home-feature-2-description-1" className="text-gray-600 text-sm">
                  {t.secureReliableDesc}
                </p>
              </div>
              <div id="home-feature-3-container-1" className="p-4 bg-white rounded-lg flex flex-col items-center text-center">
                <div id="home-feature-3-icon-1" className="text-blue-600 text-3xl mb-3">🌐</div>
                <h3 id="home-feature-3-title-1" className="font-semibold text-gray-800 mb-2">{t.multilingualSupport}</h3>
                <p id="home-feature-3-description-1" className="text-gray-600 text-sm">
                  {t.multilingualSupportDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}