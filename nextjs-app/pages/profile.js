import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import ProfileCard from '../components/ProfileCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const ProfilePage = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const translations = {
    zh: {
      title: '我的资料',
      logout: '退出登录',
      loading: '加载中...',
      error: '加载用户资料时出错'
    },
    en: {
      title: 'My Profile',
      logout: 'Logout',
      loading: 'Loading...',
      error: 'Error loading user profile'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data.user);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router, t]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient flex flex-col">
      <Head>
        <title>{t.title} - {language === 'zh' ? '多媒体工具' : 'Media Tools'}</title>
        <meta name="description" content={language === 'zh' ? '用户个人资料页面' : 'User profile page'} />
      </Head>
      
      <Header />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              {t.logout}
            </button>
          </div>
          
          {profileData && <ProfileCard user={profileData} />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;