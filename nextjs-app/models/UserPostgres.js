// PostgreSQL用户模型
import pool, { query } from '../lib/dbPostgres.js';

class User {
  constructor(id, username, email, password, points, createdAt, lastLogin) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.points = points;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
  }

  // 创建新用户
  static async create(username, email, password) {
    const queryText = `
      INSERT INTO users (username, email, password, points)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, points, created_at, last_login
    `;
    const values = [username, email, password, 0];
    
    try {
      const result = await query(queryText, values);
      const userData = result.rows[0];
      return new User(
        userData.id,
        userData.username,
        userData.email,
        null, // 不返回密码
        userData.points,
        userData.created_at,
        userData.last_login
      );
    } catch (error) {
      if (error.code === '23505') {
        // 唯一约束违反错误
        if (error.detail.includes('username')) {
          throw new Error('Username already exists');
        } else if (error.detail.includes('email')) {
          throw new Error('Email already exists');
        }
      }
      throw error;
    }
  }

  // 根据ID查找用户
  static async findById(id) {
    const queryText = `
      SELECT id, username, email, password, points, created_at, last_login
      FROM users
      WHERE id = $1
    `;
    const values = [id];
    
    try {
      const result = await query(queryText, values);
      if (result.rows.length === 0) return null;
      
      const userData = result.rows[0];
      return new User(
        userData.id,
        userData.username,
        userData.email,
        userData.password,
        userData.points,
        userData.created_at,
        userData.last_login
      );
    } catch (error) {
      throw error;
    }
  }

  // 根据邮箱查找用户
  static async findByEmail(email) {
    const queryText = `
      SELECT id, username, email, password, points, created_at, last_login
      FROM users
      WHERE email = $1
    `;
    const values = [email];
    
    try {
      const result = await query(queryText, values);
      if (result.rows.length === 0) return null;
      
      const userData = result.rows[0];
      return new User(
        userData.id,
        userData.username,
        userData.email,
        userData.password,
        userData.points,
        userData.created_at,
        userData.last_login
      );
    } catch (error) {
      throw error;
    }
  }

  // 根据用户名或邮箱查找用户
  static async findByEmailOrUsername(email, username) {
    const queryText = `
      SELECT id, username, email, password, points, created_at, last_login
      FROM users
      WHERE email = $1 OR username = $2
    `;
    const values = [email, username];
    
    try {
      const result = await query(queryText, values);
      if (result.rows.length === 0) return null;
      
      const userData = result.rows[0];
      return new User(
        userData.id,
        userData.username,
        userData.email,
        userData.password,
        userData.points,
        userData.created_at,
        userData.last_login
      );
    } catch (error) {
      throw error;
    }
  }

  // 更新用户最后登录时间
  static async updateLastLogin(id) {
    const queryText = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, username, email, points, created_at, last_login
    `;
    const values = [id];
    
    try {
      const result = await query(queryText, values);
      if (result.rows.length === 0) return null;
      
      const userData = result.rows[0];
      return new User(
        userData.id,
        userData.username,
        userData.email,
        null, // 不返回密码
        userData.points,
        userData.created_at,
        userData.last_login
      );
    } catch (error) {
      throw error;
    }
  }

  // 获取用户信息（不包含密码）
  static async getPublicProfile(id) {
    const queryText = `
      SELECT id, username, email, points, created_at, last_login
      FROM users
      WHERE id = $1
    `;
    const values = [id];
    
    try {
      const result = await query(queryText, values);
      if (result.rows.length === 0) return null;
      
      const userData = result.rows[0];
      return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        points: userData.points,
        createdAt: userData.created_at,
        lastLogin: userData.last_login
      };
    } catch (error) {
      throw error;
    }
  }
  
  // 获取用户积分余额
  static async getPoints(id) {
    const queryText = 'SELECT points FROM users WHERE id = $1';
    const values = [id];
    
    try {
      const result = await query(queryText, values);
      if (result.rows.length === 0) return 0;
      return result.rows[0].points;
    } catch (error) {
      throw error;
    }
  }
  
  // 更新用户积分
  static async updatePoints(id, points) {
    const queryText = 'UPDATE users SET points = $1 WHERE id = $2 RETURNING points';
    const values = [points, id];
    
    try {
      const result = await query(queryText, values);
      if (result.rows.length === 0) return null;
      return result.rows[0].points;
    } catch (error) {
      throw error;
    }
  }
  
  // 增加用户积分
  static async addPoints(id, amount, description = '') {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 更新用户积分
      const updateQuery = 'UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points';
      const updateValues = [amount, id];
      const updateResult = await client.query(updateQuery, updateValues);
      
      if (updateResult.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const newBalance = updateResult.rows[0].points;
      
      // 记录积分交易
      const insertTransactionQuery = `
        INSERT INTO points_transactions (user_id, amount, type, description, balance_after)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const insertTransactionValues = [id, amount, 'recharge', description, newBalance];
      await client.query(insertTransactionQuery, insertTransactionValues);
      
      await client.query('COMMIT');
      return newBalance;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // 扣除用户积分
  static async deductPoints(id, amount, description = '') {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 检查余额是否足够
      const checkQuery = 'SELECT points FROM users WHERE id = $1';
      const checkValues = [id];
      const checkResult = await client.query(checkQuery, checkValues);
      
      if (checkResult.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const currentPoints = checkResult.rows[0].points;
      if (currentPoints < amount) {
        throw new Error('Insufficient points');
      }
      
      // 更新用户积分
      const updateQuery = 'UPDATE users SET points = points - $1 WHERE id = $2 RETURNING points';
      const updateValues = [amount, id];
      const updateResult = await client.query(updateQuery, updateValues);
      
      const newBalance = updateResult.rows[0].points;
      
      // 记录积分交易
      const insertTransactionQuery = `
        INSERT INTO points_transactions (user_id, amount, type, description, balance_after)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const insertTransactionValues = [id, amount, 'consume', description, newBalance];
      await client.query(insertTransactionQuery, insertTransactionValues);
      
      await client.query('COMMIT');
      return newBalance;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default User;