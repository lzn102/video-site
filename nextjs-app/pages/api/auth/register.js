import nextConnect from 'next-connect';
import User from '../../../models/UserPostgres';
import { hashPassword, generateToken } from '../../../lib/auth';

const handler = nextConnect();

handler.post(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email, and password are required' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findByEmailOrUsername(email, username);
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }
    
    // 创建新用户
    const hashedPassword = await hashPassword(password);
    const user = await User.create(username, email, hashedPassword);
    
    // 生成JWT token
    const token = generateToken(user.id);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'Username already exists' || error.message === 'Email already exists') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default handler;