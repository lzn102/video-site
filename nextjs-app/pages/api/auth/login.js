import nextConnect from 'next-connect';
import User from '../../../models/UserPostgres';
import { comparePassword, generateToken } from '../../../lib/auth';

const handler = nextConnect();

handler.post(async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // 查找用户
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    // 验证密码
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    // 更新最后登录时间
    const updatedUser = await User.updateLastLogin(user.id);
    
    // 生成JWT token
    const token = generateToken(user.id);
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default handler;