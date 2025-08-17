import nextConnect from 'next-connect';
import User from '../../../models/UserPostgres';
import { verifyToken } from '../../../lib/auth';

const handler = nextConnect();

// 支付成功回调
handler.get(async (req, res) => {
  try {
    const { orderId, amount } = req.query;
    
    // 验证订单ID和金额
    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
    
    // 在实际应用中，这里应该验证支付通知的真实性
    // 为了演示，我们直接处理积分增加
    
    // 从token中获取用户ID（在实际应用中，应该从订单数据中获取）
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // 计算积分数量（假设1元=10积分）
    const points = parseInt(amount) * 10;
    
    // 增加用户积分
    const newBalance = await User.addPoints(
      payload.userId, 
      points, 
      req.language === 'zh' ? `充值${amount}元` : `Recharge ${amount} Yuan`
    );
    
    // 重定向到充值成功页面
    res.redirect(`/recharge-success?points=${points}&balance=${newBalance}`);
  } catch (error) {
    console.error('Payment success callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default handler;