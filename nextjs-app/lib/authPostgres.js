import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool, { createUsersTable } from './dbPostgres';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

// 生成JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// 验证JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 加密密码
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// 验证密码
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// 初始化数据库表
export const initializeDatabase = async () => {
  try {
    await createUsersTable();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};