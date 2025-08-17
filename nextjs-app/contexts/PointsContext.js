import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import User from '../models/UserPostgres';

const PointsContext = createContext();

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const { user } = useAuth();
  
  // 获取用户的积分余额
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user && user.id) {
        try {
          const userPoints = await User.getPoints(user.id);
          setPoints(userPoints);
        } catch (error) {
          console.error('获取用户积分失败:', error);
        }
      } else {
        setPoints(0);
      }
    };
    
    fetchUserPoints();
  }, [user]);
  
  // 扣除积分
  const deductPoints = async (amount, description = '') => {
    if (!user || !user.id) {
      return false;
    }
    
    try {
      const newBalance = await User.deductPoints(user.id, amount, description);
      setPoints(newBalance);
      return true;
    } catch (error) {
      console.error('扣除积分失败:', error);
      return false;
    }
  };
  
  // 增加积分
  const addPoints = async (amount, description = '') => {
    if (!user || !user.id) {
      return;
    }
    
    try {
      const newBalance = await User.addPoints(user.id, amount, description);
      setPoints(newBalance);
    } catch (error) {
      console.error('增加积分失败:', error);
    }
  };
  
  return (
    <PointsContext.Provider value={{ points, deductPoints, addPoints }}>
      {children}
    </PointsContext.Provider>
  );
};