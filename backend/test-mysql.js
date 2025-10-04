const mysql = require('mysql2/promise')
const axios = require('axios')

async function checkMySQLDatabase() {
  console.log('\n=== MySQL Database Check ===')
  
  try {
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Empty password for local dev
      database: 'comphility'
    })
    
    // Check users table
    const [users] = await connection.execute('SELECT id, name, email, role, created_at FROM users')
    console.log(`\nTotal users in MySQL database: ${users.length}`)
    
    if (users.length > 0) {
      console.log('\nUser List:')
      console.log('-'.repeat(80))
      users.forEach(user => {
        console.log(`ID: ${user.id}`)
        console.log(`Name: ${user.name}`)
        console.log(`Email: ${user.email}`)
        console.log(`Role: ${user.role || 'customer'}`)
        console.log(`Created: ${user.created_at}`)
        console.log('-'.repeat(80))
      })
    }
    
    await connection.end()
  } catch (error) {
    console.error('MySQL Error:', error.message)
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\nThe "comphility" database does not exist yet.')
      console.log('It will be created automatically when the server starts.')
    }
  }
}

async function testMySQLSignup() {
  console.log('\n=== Testing Signup with MySQL ===')
  
  const testUser = {
    name: 'MySQL Test User',
    email: `mysql_test_${Date.now()}@example.com`,
    password: 'password123',
    confirmPassword: 'password123'
  }
  
  try {
    console.log('Sending signup request...')
    console.log('User data:', testUser)
    
    const response = await axios.post('http://localhost:3001/api/auth/register', testUser)
    
    console.log('\n✅ Signup successful!')
    console.log('Response:', JSON.stringify(response.data, null, 2))
    
    // Check database after signup
    await checkMySQLDatabase()
    
  } catch (error) {
    console.error('\n❌ Signup failed!')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Error:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
  }
}

async function main() {
  console.log('🔍 Checking MySQL Database Setup...\n')
  
  // First check what's in the database
  await checkMySQLDatabase()
  
  // Then test signup
  await testMySQLSignup()
  
  console.log('\n✅ All tests completed!')
  console.log('\n📝 Note: You can now check your MySQL database using phpMyAdmin or MySQL Workbench')
  console.log('   The "comphility" database should be visible with a "users" table.')
}

main().catch(console.error)
