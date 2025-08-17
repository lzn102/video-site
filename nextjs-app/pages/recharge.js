import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { usePoints } from '../contexts/PointsContext';

const RechargePage = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { points } = usePoints();
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // 如果用户未登录，重定向到登录页面
  if (!user) {
    typeof window !== 'undefined' && router.push('/login');
    return null;
  }

  const translations = {
    zh: {
      title: '积分充值',
      currentBalance: '当前积分余额',
      rechargeAmount: '充值金额',
      selectAmount: '选择充值金额',
      customAmount: '自定义金额',
      rechargeOptions: [10, 30, 50, 100, 200, 500],
      yuan: '元',
      points: '积分',
      recharge: '充值',
      processing: '处理中...',
      rechargeSuccess: '充值成功！',
      rechargeFailed: '充值失败，请重试'
    },
    en: {
      title: 'Points Recharge',
      currentBalance: 'Current Points Balance',
      rechargeAmount: 'Recharge Amount',
      selectAmount: 'Select Recharge Amount',
      customAmount: 'Custom Amount',
      rechargeOptions: [10, 30, 50, 100, 200, 500],
      yuan: 'Yuan',
      points: 'Points',
      recharge: 'Recharge',
      processing: 'Processing...',
      rechargeSuccess: 'Recharge successful!',
      rechargeFailed: 'Recharge failed, please try again'
    }
  };

  const t = translations[language] || translations.en;

  // 计算积分数量（假设1元=10积分）
  const calculatePoints = (amount) => {
    return amount * 10;
  };

  const handleRecharge = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    
    if (!amount || amount <= 0) {
      setError(language === 'zh' ? '请输入有效的充值金额' : 'Please enter a valid recharge amount');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // 创建支付订单
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (response.ok) {
        // 重定向到支付成功页面
        router.push(`/recharge-success?points=${amount * 10}&balance=${points + (amount * 10)}`);
      } else {
        setError(data.error || t.rechargeFailed);
      }
    } catch (err) {
      setError(t.rechargeFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient flex flex-col">
      <Head>
        <title>{t.title} - {language === 'zh' ? '多媒体工具' : 'Media Tools'}</title>
        <meta name="description" content={language === 'zh' ? '积分充值页面' : 'Points recharge page'} />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t.title}</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{t.currentBalance}</h2>
              <div className="text-3xl font-bold text-blue-600">{points} {t.points}</div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.selectAmount}</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {t.rechargeOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`py-3 px-4 rounded-lg border transition-colors ${
                      selectedAmount === amount && !customAmount
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold">{amount} {t.yuan}</div>
                    <div className="text-sm text-gray-500">{calculatePoints(amount)} {t.points}</div>
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <label htmlFor="customAmount" className="block text-gray-700 font-medium mb-2">
                  {t.customAmount}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="customAmount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (e.target.value) {
                        setSelectedAmount(null);
                      }
                    }}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'zh' ? '输入金额' : 'Enter amount'}
                    min="1"
                  />
                  <div className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg">
                    {t.yuan}
                  </div>
                </div>
                {customAmount && (
                  <div className="mt-2 text-sm text-gray-500">
                    {calculatePoints(parseInt(customAmount) || 0)} {t.points}
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleRecharge}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessing ? t.processing : t.recharge}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {language === 'zh' ? '充值说明' : 'Recharge Instructions'}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>{language === 'zh' ? '积分可用于支付各种多媒体处理服务' : 'Points can be used to pay for various multimedia processing services'}</li>
              <li>{language === 'zh' ? '1元人民币 = 10积分' : '1 Yuan = 10 Points'}</li>
              <li>{language === 'zh' ? '充值后积分将立即到账' : 'Points will be credited immediately after recharge'}</li>
              <li>{language === 'zh' ? '积分永久有效，不会过期' : 'Points are valid permanently and will not expire'}</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RechargePage;