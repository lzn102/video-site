import nextConnect from 'next-connect';
import { PointsTransaction } from '../../../models/PointsTransaction';
import { verifyToken } from '../../../lib/auth';

const handler = nextConnect();

// 获取用户积分交易记录
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
    
    // 获取用户积分交易记录
    const transactions = await PointsTransaction.getUserTransactions(payload.userId);
    
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default handler;