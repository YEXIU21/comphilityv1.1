const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')
const path = require('path')

async function checkDatabase() {
  console.log('\n=== Database Check ===')
  try {
    const dbPath = path.join(__dirname, 'comphility.db')
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    
    const users = await db.all('SELECT id, name, email, role, created_at FROM users')
    console.log(`\nTotal users in database: ${users.length}`)
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
    
    await db.close()
  } catch (error) {
    console.error('Database error:', error.message)
  }
}

checkDatabase().catch(console.error)
