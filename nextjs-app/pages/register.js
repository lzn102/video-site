import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const RegisterPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { language } = useLanguage();

  const translations = {
    zh: {
      title: '用户注册',
      alreadyHaveAccount: '已有账户？',
      login: '登录',
      registrationSuccess: '注册成功！'
    },
    en: {
      title: 'User Registration',
      alreadyHaveAccount: 'Already have an account?',
      login: 'Login',
      registrationSuccess: 'Registration successful!'
    }
  };

  const t = translations[language] || translations.en;

  const handleRegister = async (formData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      alert(t.registrationSuccess);
      // 自动登录用户
      login(data.token, data.user);
      router.push('/profile');
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient flex flex-col">
      <Head>
        <title>{t.title} - {language === 'zh' ? '多媒体工具' : 'Media Tools'}</title>
        <meta name="description" content={language === 'zh' ? '用户注册多媒体工具平台账户' : 'Register for a Media Tools platform account'} />
      </Head>
      
      <Header />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t.title}</h1>
          <AuthForm type="register" onSubmit={handleRegister} />
          <div className="text-center mt-4">
            <p className="text-gray-600">
              {t.alreadyHaveAccount}{' '}
              <button 
                onClick={() => router.push('/login')}
                className="text-blue-500 hover:text-blue-700 underline"
              >
                {t.login}
              </button>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;