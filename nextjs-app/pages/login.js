import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { language } = useLanguage();

  const translations = {
    zh: {
      title: '用户登录',
      noAccount: '没有账户？',
      register: '注册',
      loginSuccess: '登录成功！'
    },
    en: {
      title: 'User Login',
      noAccount: "Don't have an account?",
      register: 'Register',
      loginSuccess: 'Login successful!'
    }
  };

  const t = translations[language] || translations.en;

  const handleLogin = async (formData) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      alert(t.loginSuccess);
      login(data.token, data.user);
      router.push('/profile');
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient flex flex-col">
      <Head>
        <title>{t.title} - {language === 'zh' ? '多媒体工具' : 'Media Tools'}</title>
        <meta name="description" content={language === 'zh' ? '用户登录到多媒体工具平台' : 'Login to the Media Tools platform'} />
      </Head>
      
      <Header />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t.title}</h1>
          <AuthForm type="login" onSubmit={handleLogin} />
          <div className="text-center mt-4">
            <p className="text-gray-600">
              {t.noAccount}{' '}
              <button 
                onClick={() => router.push('/register')}
                className="text-blue-500 hover:text-blue-700 underline"
              >
                {t.register}
              </button>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;