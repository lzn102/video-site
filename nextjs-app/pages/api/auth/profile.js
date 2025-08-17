import nextConnect from 'next-connect';
import User from '../../../models/UserPostgres';
import { verifyToken } from '../../../lib/auth';

const handler = nextConnect();

// 获取用户资料
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
    
    // 获取用户信息
    const user = await User.getPublicProfile(payload.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default handler;