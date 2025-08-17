import { initUserTable } from '../lib/dbPostgres.js';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// 初始化用户表
async function initDatabase() {
  try {
    await initUserTable();
    console.log('数据库初始化成功');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();