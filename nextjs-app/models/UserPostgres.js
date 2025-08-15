// PostgreSQL用户模型
import pool, { query } from './dbPostgres';

class User {
  constructor(id, username, email, password, createdAt, lastLogin) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
  }

  // 创建新用户
  static async create(username, email, password) {
    const queryText = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at, last_login
    `;
    const values = [username, email, password];
    
    try {
      const result = await query(queryText, values);
      const userData = result.rows[0];
      return new User(
        userData.id,
        userData.username,
        userData.email,
        null, // 不返回密码
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
      SELECT id, username, email, password, created_at, last_login
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
      SELECT id, username, email, password, created_at, last_login
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
      SELECT id, username, email, password, created_at, last_login
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
      RETURNING id, username, email, created_at, last_login
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
      SELECT id, username, email, created_at, last_login
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
        createdAt: userData.created_at,
        lastLogin: userData.last_login
      };
    } catch (error) {
      throw error;
    }
  }
}

export default User;