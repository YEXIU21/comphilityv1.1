const mysql = require('mysql2/promise')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '../backend/.env' })

async function createDatabase() {
  let connection
  
  try {
    // First connect without specifying a database
    console.log('🔌 Connecting to MySQL server...')
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    })
    
    console.log('✅ Connected to MySQL server successfully')
    
    // Create the database
    const dbName = process.env.DB_DATABASE || 'comphility'
    console.log(`📊 Creating database "${dbName}"...`)
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)
    console.log(`✅ Database "${dbName}" created (or already exists)`)
    
    // Close connection and reconnect to the specific database
    await connection.end()
    
    // Reconnect to the specific database
    console.log(`🔌 Connecting to database "${dbName}"...`)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName
    })
    
    console.log(`✅ Connected to database "${dbName}" successfully`)
    
    // Create users table
    console.log('👥 Creating users table...')
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
    console.log('✅ Users table created (or already exists)')
    
    // Create products table
    console.log('🛍️ Creating products table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        image VARCHAR(500),
        category VARCHAR(100),
        subcategory VARCHAR(100),
        brand VARCHAR(100),
        stock_quantity INT DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        review_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_brand (brand),
        INDEX idx_featured (is_featured),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ Products table created (or already exists)')
    
    // Create cart table
    console.log('🛒 Creating cart table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ Cart table created (or already exists)')
    
    // Show table status
    console.log('\n📋 Database structure created:')
    const [tables] = await connection.execute('SHOW TABLES')
    tables.forEach(table => {
      const tableName = Object.values(table)[0]
      console.log(`  ✓ ${tableName}`)
    })
    
    // Check users count
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users')
    console.log(`\n👥 Current users in database: ${userCount[0].count}`)
    
    console.log('\n🎉 Database setup completed successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Database setup error:', error.message)
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n⚠️ Access denied. Please check your MySQL credentials:')
      console.log('  - Username:', process.env.DB_USER || 'root')
      console.log('  - Password:', process.env.DB_PASSWORD ? '[SET]' : '[EMPTY]')
      console.log('\nIf you have a password, update the backend/.env file:')
      console.log('  DB_PASSWORD=your_mysql_password')
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n⚠️ Cannot connect to MySQL server. Please ensure:')
      console.log('  - MySQL server is running')
      console.log('  - Connection details are correct in backend/.env')
    }
    
    return false
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Database connection closed')
    }
  }
}

module.exports = createDatabase

// Run directly if called from command line
if (require.main === module) {
  createDatabase()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
}
