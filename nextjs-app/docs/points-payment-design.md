# 积分充值和支付功能设计文档

## 1. 功能需求
- 用户可以通过支付充值积分
- 积分余额需要持久化存储在数据库中
- 需要记录充值和消费的交易历史
- 支持多种支付方式（支付宝、微信支付等）

## 2. 数据库设计

### 2.1 用户表修改
需要在现有 users 表中添加积分字段：
```sql
ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0;
```

### 2.2 积分交易记录表
创建新的积分交易记录表：
```sql
CREATE TABLE points_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'recharge' 或 'consume'
  description TEXT,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. API 端点设计

### 3.1 充值相关
- POST /api/points/recharge - 创建充值订单
- GET /api/points/balance - 获取用户积分余额
- GET /api/points/transactions - 获取用户积分交易记录

### 3.2 支付相关
- POST /api/payment/create - 创建支付订单
- POST /api/payment/notify - 支付回调通知

## 4. 前端页面
- /recharge - 积分充值页面
- /points-history - 积分交易记录页面

## 5. 技术实现方案
1. 修改用户模型以支持数据库积分存储
2. 创建积分交易记录模型
3. 实现支付接口集成（支付宝/微信支付）
4. 创建充值页面和相关API端点
5. 更新积分上下文以使用数据库存储