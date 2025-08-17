import { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken } from '../lib/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 页面加载时检查用户认证状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        // 这里可以调用API获取用户详细信息
        setUser({ id: payload.userId });
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // 用户登录
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // 用户登出
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // 检查用户是否已认证
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};