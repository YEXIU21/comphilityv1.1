#!/usr/bin/env node

/**
 * COMPHILITY - Master Setup Script
 * 
 * This script sets up the complete COMPHILITY backend system:
 * 1. Creates MySQL database and tables
 * 2. Creates admin user
 * 3. Seeds sample products
 * 4. Verifies setup completion
 * 
 * Usage: node master-setup.js
 */

const path = require('path')
const dotenv = require('dotenv')

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../backend/.env') })

// Import setup modules
const createDatabase = require('./01-create-database')
const createAdminUser = require('./02-create-admin')
const seedProducts = require('./03-seed-products')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function printHeader() {
  console.log('')
  log('╔══════════════════════════════════════════════════════════════╗', 'cyan')
  log('║                    COMPHILITY SETUP                         ║', 'cyan')
  log('║              Master Database Setup Script                   ║', 'cyan')
  log('╚══════════════════════════════════════════════════════════════╝', 'cyan')
  console.log('')
}

function printStep(stepNumber, title, description) {
  log(`📋 Step ${stepNumber}: ${title}`, 'bright')
  log(`   ${description}`, 'yellow')
  console.log('')
}

function printSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function printError(message) {
  log(`❌ ${message}`, 'red')
}

function printWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

async function runSetup() {
  const startTime = Date.now()
  
  try {
    printHeader()
    
    log('🚀 Starting COMPHILITY complete setup...', 'bright')
    log(`📁 Working directory: ${process.cwd()}`, 'blue')
    log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`, 'blue')
    
    // Display configuration
    console.log('')
    log('📋 Database Configuration:', 'bright')
    log(`   Host: ${process.env.DB_HOST || 'localhost'}`)
    log(`   Port: ${process.env.DB_PORT || 3306}`)
    log(`   User: ${process.env.DB_USER || 'root'}`)
    log(`   Password: ${process.env.DB_PASSWORD ? '[SET]' : '[EMPTY]'}`)
    log(`   Database: ${process.env.DB_DATABASE || 'comphility'}`)
    console.log('')

    // Step 1: Create Database and Tables
    printStep(1, 'Database Setup', 'Creating database and tables')
    const dbSuccess = await createDatabase()
    
    if (!dbSuccess) {
      printError('Database setup failed!')
      printWarning('Please check MySQL connection and credentials')
      return false
    }
    
    printSuccess('Database and tables created successfully')
    console.log('')

    // Step 2: Create Admin User
    printStep(2, 'Admin User Setup', 'Creating system administrator account')
    const adminSuccess = await createAdminUser()
    
    if (!adminSuccess) {
      printError('Admin user creation failed!')
      return false
    }
    
    printSuccess('Admin user created successfully')
    console.log('')

    // Step 3: Seed Products (Optional)
    printStep(3, 'Product Seeding', 'Adding sample products to the database')
    const seedSuccess = await seedProducts()
    
    if (!seedSuccess) {
      printWarning('Product seeding failed (but setup can continue)')
    } else {
      printSuccess('Sample products added successfully')
    }
    console.log('')

    // Final Summary
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)
    
    log('╔══════════════════════════════════════════════════════════════╗', 'green')
    log('║                     SETUP COMPLETE!                         ║', 'green')
    log('╚══════════════════════════════════════════════════════════════╝', 'green')
    console.log('')
    
    printSuccess(`Setup completed in ${duration} seconds`)
    console.log('')
    
    log('🎉 COMPHILITY backend is now ready!', 'bright')
    console.log('')
    
    log('📋 What was created:', 'bright')
    log('   ✓ MySQL database: comphility')
    log('   ✓ Tables: users, products, cart')
    log('   ✓ Admin user: admin@comphility.com')
    log('   ✓ Sample products (if seeding succeeded)')
    console.log('')
    
    log('🚀 Next Steps:', 'bright')
    log('   1. Start the backend server:', 'yellow')
    log('      cd backend && npm run dev', 'cyan')
    console.log('')
    log('   2. Start the frontend:', 'yellow')
    log('      cd frontend && npm run serve', 'cyan')
    console.log('')
    log('   3. Login as admin:', 'yellow')
    log('      Email: admin@comphility.com', 'cyan')
    log('      Password: admin123', 'cyan')
    console.log('')
    
    printWarning('Remember to change the admin password after first login!')
    
    return true

  } catch (error) {
    console.log('')
    printError('Setup failed with unexpected error:')
    console.error(error)
    return false
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('')
  log('⚠️  Setup interrupted by user', 'yellow')
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Run the setup if this file is executed directly
if (require.main === module) {
  runSetup()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('Setup error:', error)
      process.exit(1)
    })
}

module.exports = { runSetup }
