import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AuthForm = ({ type, onSubmit }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const translations = {
    zh: {
      username: '用户名',
      email: '邮箱',
      password: '密码',
      register: '注册',
      login: '登录',
      registering: '注册中...',
      loggingIn: '登录中...',
      requiredFields: '请填写所有必填字段'
    },
    en: {
      username: 'Username',
      email: 'Email',
      password: 'Password',
      register: 'Register',
      login: 'Login',
      registering: 'Registering...',
      loggingIn: 'Logging in...',
      requiredFields: 'Please fill in all required fields'
    }
  };

  const t = translations[language] || translations.en;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // 基本验证
    if (type === 'register' && (!formData.username || !formData.email || !formData.password)) {
      setError(t.requiredFields);
      setLoading(false);
      return;
    }
    
    if (type === 'login' && (!formData.email || !formData.password)) {
      setError(t.requiredFields);
      setLoading(false);
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {type === 'register' && (
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
            {t.username}
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={type === 'register'}
          />
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          {t.email}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
          {t.password}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      {error && (
        <div className="mb-4 text-red-500 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {loading 
          ? (type === 'register' ? t.registering : t.loggingIn) 
          : (type === 'register' ? t.register : t.login)}
      </button>
    </form>
  );
};

export default AuthForm;