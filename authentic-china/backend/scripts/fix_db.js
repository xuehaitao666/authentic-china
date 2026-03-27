const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123456',
    database: process.env.DB_NAME || 'authentic_china'
  });

  try {
    console.log('--- Database Toxic Purge ---');
    console.log('Disabling foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    console.log('Dropping table "users" to clear redundant indexes...');
    await connection.query('DROP TABLE IF EXISTS `users`;');
    
    console.log('Enabling foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    
    console.log('Table "users" dropped successfully. It will be recreated on next server start.');
  } catch (error) {
    console.error('Failed to fix database:', error.message);
  } finally {
    await connection.end();
  }
}

fixDatabase();
