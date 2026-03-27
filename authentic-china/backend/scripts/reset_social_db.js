const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetSocial() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123456',
    database: process.env.DB_NAME || 'authentic_china'
  });

  try {
    console.log('--- Social Data Purge (Resetting Friendships & Messages) ---');
    console.log('Disabling foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    console.log('Dropping table "friendships"...');
    await connection.query('DROP TABLE IF EXISTS `friendships`;');
    
    console.log('Dropping table "messages"...');
    await connection.query('DROP TABLE IF EXISTS `messages`;');
    
    console.log('Enabling foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    
    console.log('Social tables dropped successfully. They will be recreated on next server start with correct IDs.');
  } catch (error) {
    console.error('Failed to reset social database:', error.message);
  } finally {
    await connection.end();
  }
}

resetSocial();
