const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '../backend/.env' })

async function createAdminUser() {
  let connection
  
  try {
    console.log('🔌 Connecting to MySQL database...')
    
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
    const adminName = 'System Administrator'

    console.log('👤 Checking for existing admin user...')
    
    // Check if admin already exists
    const [existingUsers] = await connection.execute(
      'SELECT id, email, role FROM users WHERE email = ?',
      [adminEmail]
    )

    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists:', existingUsers[0])
      
      // Update existing user to admin role if not already
      if (existingUsers[0].role !== 'admin') {
        await connection.execute(
          'UPDATE users SET role = ?, name = ? WHERE email = ?',
          ['admin', adminName, adminEmail]
        )
        console.log('✅ Updated user role to admin')
      } else {
        console.log('✅ User is already an admin')
      }
    } else {
      console.log('🔐 Creating new admin user...')
      
      // Hash password
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(adminPassword, salt)

      // Insert admin user
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [adminName, adminEmail, passwordHash, 'admin']
      )

      console.log('✅ Admin user created successfully!')
      console.log('   User ID:', result.insertId)
    }

    // Verify admin user
    const [adminUsers] = await connection.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE role = "admin"'
    )
    
    console.log('\n👑 Admin Users Summary:')
    adminUsers.forEach(admin => {
      console.log(`  • ID: ${admin.id}`)
      console.log(`    Name: ${admin.name}`)
      console.log(`    Email: ${admin.email}`)
      console.log(`    Role: ${admin.role}`)
      console.log(`    Created: ${admin.created_at}`)
      console.log('')
    })

    console.log('📋 Admin Login Credentials:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('')
    console.log('⚠️  IMPORTANT: Please change the password after first login!')
    console.log('🎉 Admin user setup completed successfully!')
    
    return true

  } catch (error) {
    console.error('❌ Admin user creation error:', error.message)
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n⚠️ Users table does not exist. Please run database setup first:')
      console.log('  node 01-create-database.js')
    }
    
    return false
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Database connection closed')
    }
  }
}

module.exports = createAdminUser

// Run directly if called from command line
if (require.main === module) {
  createAdminUser()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
}
