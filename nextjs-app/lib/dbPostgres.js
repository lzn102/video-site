import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// 只在服务器端加载环境变量
if (typeof window === 'undefined') {
  // 加载环境变量
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  
  console.log('数据库配置:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('PGHOST:', process.env.PGHOST);
  console.log('PGUSER:', process.env.PGUSER);
  console.log('PGPASSWORD:', process.env.PGPASSWORD);
  console.log('PGDATABASE:', process.env.PGDATABASE);
  console.log('PGPORT:', process.env.PGPORT);
}

// 创建PostgreSQL连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || process.env.PG_PASSWORD,
  database: process.env.PGDATABASE || 'nextjs_auth',
  port: process.env.PGPORT || 5432,
});

// 测试数据库连接
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL数据库连接成功');
    client.release();
    return true;
  } catch (error) {
    console.error('PostgreSQL数据库连接失败:', error);
    return false;
  }
};

// 执行查询
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('执行查询', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('查询执行错误:', error);
    throw error;
  }
};

// 初始化用户表
export const initUserTable = async () => {
  // 创建用户表
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      points INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    );
  `;
  
  // 创建积分交易记录表
  const createPointsTransactionTableQuery = `
    CREATE TABLE IF NOT EXISTS points_transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      amount INTEGER NOT NULL,
      type VARCHAR(20) NOT NULL,
      description TEXT,
      balance_after INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await query(createUserTableQuery);
    console.log('用户表初始化成功');
    
    await query(createPointsTransactionTableQuery);
    console.log('积分交易记录表初始化成功');
  } catch (error) {
    console.error('数据库表初始化失败:', error);
    throw error;
  }
};

export default pool;