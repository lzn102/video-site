// 积分交易记录模型
import pool, { query } from '../lib/dbPostgres.js';

export class PointsTransaction {
  constructor(id, userId, amount, type, description, balanceAfter, createdAt) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.type = type;
    this.description = description;
    this.balanceAfter = balanceAfter;
    this.createdAt = createdAt;
  }

  // 获取用户积分交易记录
  static async getUserTransactions(userId, limit = 20, offset = 0) {
    const queryText = `
      SELECT id, user_id, amount, type, description, balance_after, created_at
      FROM points_transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [userId, limit, offset];
    
    try {
      const result = await query(queryText, values);
      return result.rows.map(row => new PointsTransaction(
        row.id,
        row.user_id,
        row.amount,
        row.type,
        row.description,
        row.balance_after,
        row.created_at
      ));
    } catch (error) {
      throw error;
    }
  }
  
  // 获取用户积分余额
  static async getUserBalance(userId) {
    const queryText = 'SELECT points FROM users WHERE id = $1';
    const values = [userId];
    
    try {
      const result = await query(queryText, values);
      if (result.rows.length === 0) return 0;
      return result.rows[0].points;
    } catch (error) {
      throw error;
    }
  }
}