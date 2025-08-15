// PostgreSQL数据库连接示例
import pool, { query, testConnection } from '../lib/dbPostgres';
import User from '../models/UserPostgres';

// 测试数据库连接
export const testDatabaseConnection = async () => {
  console.log('Testing PostgreSQL database connection...');
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('✅ Database connection successful!');
  } else {
    console.log('❌ Database connection failed!');
  }
  
  return isConnected;
};

// 示例：创建用户
export const createUserExample = async () => {
  try {
    const user = await User.create('john_doe', 'john@example.com', 'hashed_password_here');
    console.log('Created user:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// 示例：查找用户
export const findUserExample = async () => {
  try {
    // 根据ID查找
    const userById = await User.findById(1);
    console.log('User by ID:', userById);
    
    // 根据邮箱查找
    const userByEmail = await User.findByEmail('john@example.com');
    console.log('User by email:', userByEmail);
    
    return { userById, userByEmail };
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
};

// 示例：直接执行查询
export const rawQueryExample = async () => {
  try {
    // 查询所有用户
    const result = await query('SELECT * FROM users');
    console.log('All users:', result.rows);
    
    // 带参数的查询
    const userResult = await query('SELECT * FROM users WHERE email = $1', ['john@example.com']);
    console.log('User with email:', userResult.rows);
    
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// 使用示例
const runExamples = async () => {
  try {
    // 测试连接
    await testDatabaseConnection();
    
    // 创建用户示例
    // await createUserExample();
    
    // 查找用户示例
    // await findUserExample();
    
    // 原始查询示例
    // await rawQueryExample();
    
  } catch (error) {
    console.error('Error in examples:', error);
  }
};

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  runExamples();
}

export default {
  testDatabaseConnection,
  createUserExample,
  findUserExample,
  rawQueryExample
};