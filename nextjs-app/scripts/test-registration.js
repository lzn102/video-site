// 测试用户注册逻辑
import { hashPassword } from '../lib/auth.js';
import User from '../models/UserPostgres.js';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testRegistration() {
  try {
    // 测试数据
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    // 检查用户是否已存在
    const existingUser = await User.findByEmailOrUsername(testUser.email, testUser.username);
    if (existingUser) {
      console.log('用户已存在:', existingUser.username);
      return;
    }
    
    // 创建新用户
    const hashedPassword = await hashPassword(testUser.password);
    const user = await User.create(
      testUser.username, 
      testUser.email, 
      hashedPassword
    );
    
    console.log('用户创建成功:', {
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('测试注册时出错:', error.message);
  }
}

testRegistration();