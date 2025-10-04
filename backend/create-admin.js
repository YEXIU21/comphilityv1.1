const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

async function createAdminUser() {
  let connection
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'comphility'
    })

    console.log('✅ Connected to MySQL database')

    // Admin user credentials
    const adminEmail = 'admin@comphility.com'
    const adminPassword = 'admin123'
    const adminName = 'Admin User'

    // Check if admin already exists
    const [existingUsers] = await connection.execute(
      'SELECT id, email, role FROM users WHERE email = ?',
      [adminEmail]
    )

    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists:', existingUsers[0])
      
      // Update existing user to admin role
      await connection.execute(
        'UPDATE users SET role = ? WHERE email = ?',
        ['admin', adminEmail]
      )
      console.log('✅ Updated user role to admin')
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(adminPassword, salt)

      // Insert admin user
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [adminName, adminEmail, passwordHash, 'admin']
      )

      console.log('✅ Admin user created successfully!')
      console.log('   ID:', result.insertId)
    }

    console.log('\n📋 Admin Login Credentials:')
    console.log('   Email:', adminEmail)
    console.log('   Password:', adminPassword)
    console.log('\n⚠️  Please change the password after first login!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n✅ Database connection closed')
    }
  }
}

createAdminUser()
