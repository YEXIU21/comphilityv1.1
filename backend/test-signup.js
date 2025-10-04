const axios = require('axios')
const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')
const path = require('path')

async function checkDatabase() {
  console.log('\n--- Checking Database ---')
  try {
    const dbPath = path.join(__dirname, 'comphility.db')
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    
    const users = await db.all('SELECT id, name, email, role, created_at FROM users')
    console.log(`Found ${users.length} users in database:`)
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`)
    })
    
    await db.close()
  } catch (error) {
    console.error('Database error:', error.message)
  }
}

async function testSignup() {
  console.log('\n--- Testing Signup API ---')
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    confirmPassword: 'password123'
  }
  
  try {
    console.log('Sending signup request...')
    console.log('User data:', testUser)
    
    const response = await axios.post('http://localhost:3001/api/auth/register', testUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Signup successful!')
    console.log('Response:', JSON.stringify(response.data, null, 2))
    
    // Check database after signup
    await checkDatabase()
    
  } catch (error) {
    console.error('Signup failed!')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Error:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
  }
}

async function main() {
  // First check what's in the database
  await checkDatabase()
  
  // Then test signup
  await testSignup()
}

main().catch(console.error)
