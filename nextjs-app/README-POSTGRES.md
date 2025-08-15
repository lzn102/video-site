# PostgreSQL Database Configuration for Next.js App

This document explains how to set up and use PostgreSQL database with this Next.js application.

## 1. Installation

The required dependencies have already been installed:
- `pg`: PostgreSQL client for Node.js
- `dotenv`: Environment variable loader

## 2. Environment Configuration

Update your `.env.local` file with your PostgreSQL database credentials:

```env
# PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/nextjs_auth
PGHOST=localhost
PGUSER=your_postgres_username
PGPASSWORD=your_postgres_password
PGDATABASE=nextjs_auth
PGPORT=5432
```

## 3. Database Schema

The user table will be automatically created with the following schema:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
)
```

## 4. File Structure

- `lib/dbPostgres.js`: Database connection and query functions
- `models/UserPostgres.js`: User model for PostgreSQL
- `lib/authPostgres.js`: Authentication functions for PostgreSQL
- `pages/api/auth/registerPostgres.js`: Registration API endpoint
- `pages/api/auth/loginPostgres.js`: Login API endpoint
- `pages/api/auth/profilePostgres.js`: Profile API endpoint
- `lib/postgresExamples.js`: Usage examples

## 5. Usage Examples

### Database Connection
```javascript
import pool, { query, testConnection } from '../lib/dbPostgres';

// Test connection
await testConnection();

// Execute queries
const result = await query('SELECT * FROM users WHERE email = $1', ['user@example.com']);
```

### User Operations
```javascript
import User from '../models/UserPostgres';

// Create a user
const user = await User.create('username', 'user@example.com', 'hashed_password');

// Find a user
const user = await User.findByEmail('user@example.com');

// Update last login
await User.updateLastLogin(userId);
```

## 6. API Endpoints

New PostgreSQL-based API endpoints have been created:
- POST `/api/auth/registerPostgres`: User registration
- POST `/api/auth/loginPostgres`: User login
- GET `/api/auth/profilePostgres`: Get user profile

## 7. Running the Application

1. Make sure PostgreSQL is running on your system
2. Update the environment variables in `.env.local`
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

## 8. Testing Database Connection

You can test the database connection using the provided script:
```bash
npm run db:init
```

This will test the connection and create the necessary tables.