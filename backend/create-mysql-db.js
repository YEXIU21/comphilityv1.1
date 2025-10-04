const mysql = require('mysql2/promise')

async function createDatabase() {
  let connection
  
  try {
    // First connect without specifying a database
    console.log('Connecting to MySQL...')
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Empty password for local dev
    })
    
    // Create the database
    console.log('Creating comphility database...')
    await connection.execute('CREATE DATABASE IF NOT EXISTS comphility')
    console.log('✅ Database "comphility" created (or already exists)')
    
    // Switch to the database
    await connection.execute('USE comphility')
    
    // Create users table
    console.log('Creating users table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ Table "users" created (or already exists)')
    
    // Check the table structure
    const [columns] = await connection.execute('SHOW COLUMNS FROM users')
    console.log('\n📋 Users table structure:')
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`)
    })
    
    // Check existing users
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users')
    console.log(`\n📊 Current users in database: ${users[0].count}`)
    
    console.log('\n✅ MySQL database setup complete!')
    console.log('🚀 You can now start using the application.')
    console.log('📝 Check your MySQL database (using phpMyAdmin or MySQL Workbench) to see the "comphility" database.')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n⚠️ Access denied. Please check your MySQL credentials:')
      console.log('  - Username: root')
      console.log('  - Password: (empty or your MySQL root password)')
      console.log('\nIf you have a password, update the .env file:')
      console.log('  DB_PASSWORD=your_mysql_password')
    }
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

createDatabase()
