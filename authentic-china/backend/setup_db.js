const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '123456'
    });
    
    await connection.query('CREATE DATABASE IF NOT EXISTS `authentic_china` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.log('Database authentic_china verified/created successfully.');
    
    await connection.end();
  } catch (error) {
    console.error('Failed to create database:', error.message);
    process.exit(1);
  }
}

createDatabase();
