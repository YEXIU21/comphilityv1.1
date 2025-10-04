const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

async function updateAdminPassword() {
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

    // Admin credentials
    const adminEmail = 'codesenpai@gmail.com'
    const newPassword = 'admin123'

    console.log('🔍 Searching for user:', adminEmail)

    // Check if user exists
    const [users] = await connection.execute(
      'SELECT id, name, email, role FROM users WHERE email = ?',
      [adminEmail]
    )

    if (users.length === 0) {
      console.log('❌ User not found with email:', adminEmail)
      process.exit(1)
    }

    console.log('✅ User found:', users[0])

    // Hash password
    console.log('🔐 Hashing new password...')
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(newPassword, salt)

    // Update password
    console.log('💾 Updating password in database...')
    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [passwordHash, adminEmail]
    )

    console.log('✅ Password updated successfully! Rows affected:', result.affectedRows)
    console.log('\n📋 Admin Login Credentials:')
    console.log('   Email:', adminEmail)
    console.log('   Password:', newPassword)
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

updateAdminPassword()
