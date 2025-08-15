import { createContext, useContext, useState, useEffect } from 'react';

const PointsContext = createContext();

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(100); // 默认初始积分为100
  
  // 从localStorage获取保存的积分
  useEffect(() => {
    const savedPoints = localStorage.getItem('userPoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
  }, []);
  
  // 保存积分到localStorage
  const updatePoints = (newPoints) => {
    setPoints(newPoints);
    localStorage.setItem('userPoints', newPoints.toString());
  };
  
  // 扣除积分
  const deductPoints = (amount) => {
    if (points >= amount) {
      const newPoints = points - amount;
      updatePoints(newPoints);
      return true;
    }
    return false;
  };
  
  // 增加积分
  const addPoints = (amount) => {
    const newPoints = points + amount;
    updatePoints(newPoints);
  };
  
  return (
    <PointsContext.Provider value={{ points, deductPoints, addPoints, updatePoints }}>
      {children}
    </PointsContext.Provider>
  );
};