import nextConnect from 'next-connect';
import User from '../../../models/UserPostgres';
import { verifyToken } from '../../../lib/auth';

const handler = nextConnect();

// 创建支付订单
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
    
    // 在实际应用中，这里应该集成支付宝、微信支付等第三方支付系统
    // 创建支付订单并返回支付链接
    
    // 为了演示，我们直接返回成功消息
    const paymentId = 'pay_' + Date.now(); // 模拟支付订单ID
    
    // 增加用户积分
    const newBalance = await User.addPoints(
      payload.userId, 
      points, 
      req.language === 'zh' ? `充值${amount}元` : `Recharge ${amount} Yuan`
    );
    
    res.status(200).json({ 
      message: 'Payment successful',
      paymentId,
      points: newBalance
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default handler;