import nextConnect from 'next-connect';
import User from '../../../models/UserPostgres';
import { PointsTransaction } from '../../../models/PointsTransaction';
import { verifyToken } from '../../../lib/auth';

const handler = nextConnect();

// 获取用户积分余额
handler.get(async (req, res) => {
  try {
    // 从Authorization头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // 获取用户积分余额
    const points = await User.getPoints(payload.userId);
    
    res.status(200).json({ points });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 充值积分
handler.post(async (req, res) => {
  try {
    // 从Authorization头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const { amount } = req.body;
    
    // 验证输入
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // 计算积分数量（假设1元=10积分）
    const points = amount * 10;
    
    // 这里应该集成实际的支付系统
    // 为了演示，我们直接增加积分
    
    // 增加用户积分
    const newBalance = await User.addPoints(
      payload.userId, 
      points, 
      req.language === 'zh' ? `充值${amount}元` : `Recharge ${amount} Yuan`
    );
    
    res.status(200).json({ 
      message: 'Recharge successful',
      points: newBalance
    });
  } catch (error) {
    console.error('Recharge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default handler;