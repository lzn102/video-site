import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { usePoints } from '../contexts/PointsContext';

const RechargeSuccessPage = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { points } = usePoints();
  const { points: addedPoints, balance: newBalance } = router.query;

  // 如果用户未登录，重定向到登录页面
  if (!user) {
    typeof window !== 'undefined' && router.push('/login');
    return null;
  }

  const translations = {
    zh: {
      title: '充值成功',
      successMessage: '积分充值成功！',
      addedPoints: '充值积分',
      newBalance: '当前余额',
      backToHome: '返回首页',
      viewHistory: '查看交易记录'
    },
    en: {
      title: 'Recharge Successful',
      successMessage: 'Points recharge successful!',
      addedPoints: 'Added Points',
      newBalance: 'New Balance',
      backToHome: 'Back to Home',
      viewHistory: 'View Transaction History'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gradient flex flex-col">
      <Head>
        <title>{t.title} - {language === 'zh' ? '多媒体工具' : 'Media Tools'}</title>
        <meta name="description" content={language === 'zh' ? '积分充值成功' : 'Points recharge successful'} />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-green-500 text-6xl mb-6">✓</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t.successMessage}</h1>
            
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-600 mb-2">{t.addedPoints}</div>
                  <div className="text-2xl font-bold text-green-600">+{addedPoints || 0}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-2">{t.newBalance}</div>
                  <div className="text-2xl font-bold text-blue-600">{newBalance || points}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm-flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                {t.backToHome}
              </button>
              <button
                onClick={() => router.push('/points-history')}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                {t.viewHistory}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RechargeSuccessPage;