// 数据库迁移脚本 - 添加积分字段
import { query } from '../lib/dbPostgres.js';

async function migrateDatabase() {
  try {
    // 为现有用户表添加积分字段
    const addPointsColumnQuery = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0
    `;
    
    await query(addPointsColumnQuery);
    console.log('成功添加积分字段到用户表');
    
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
    
    await query(createPointsTransactionTableQuery);
    console.log('积分交易记录表创建成功');
    
    console.log('数据库迁移完成');
    process.exit(0);
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  }
}

migrateDatabase();