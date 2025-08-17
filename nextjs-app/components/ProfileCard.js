import { useLanguage } from '../contexts/LanguageContext';

const ProfileCard = ({ user }) => {
  const { language } = useLanguage();

  const translations = {
    zh: {
      profile: '用户资料',
      username: '用户名',
      email: '邮箱',
      memberSince: '注册时间',
      lastLogin: '最后登录'
    },
    en: {
      profile: 'User Profile',
      username: 'Username',
      email: 'Email',
      memberSince: 'Member Since',
      lastLogin: 'Last Login'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          {t.profile}
        </div>
        <div className="block mt-4 text-lg leading-tight font-medium text-black">
          {user.username}
        </div>
        <div className="mt-2 text-gray-500">
          <p><strong>{t.email}:</strong> {user.email}</p>
          <p><strong>{t.memberSince}:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          {user.lastLogin && (
            <p><strong>{t.lastLogin}:</strong> {new Date(user.lastLogin).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;