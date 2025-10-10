const mysql = require('mysql2/promise')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '../backend/.env' })

const sampleProducts = [
  {
    name: 'Gaming PC - Intel Core i7',
    description: 'High-performance gaming PC with Intel Core i7 processor, RTX 4070, 16GB RAM, and 1TB SSD. Perfect for gaming and content creation.',
    price: 89999.00,
    original_price: 99999.00,
    image: '/images/gaming-pc-i7.jpg',
    category: 'PC Sets',
    subcategory: 'Gaming PCs',
    brand: 'COMPHILITY Custom',
    stock_quantity: 15,
    rating: 4.8,
    review_count: 24,
    is_featured: true,
    is_active: true
  },
  {
    name: 'ASUS ROG Strix Gaming Laptop',
    description: 'Powerful gaming laptop with AMD Ryzen 7, RTX 4060, 16GB RAM, and 512GB SSD. Perfect for gaming on the go.',
    price: 75999.00,
    original_price: 82999.00,
    image: '/images/asus-rog-laptop.jpg',
    category: 'Laptops',
    subcategory: 'Gaming Laptops',
    brand: 'ASUS',
    stock_quantity: 8,
    rating: 4.6,
    review_count: 18,
    is_featured: true,
    is_active: true
  },
  {
    name: 'Intel Core i9-13900K Processor',
    description: 'Latest Intel Core i9 processor with 24 cores and 32 threads. Excellent for gaming and professional workloads.',
    price: 28999.00,
    image: '/images/intel-i9-13900k.jpg',
    category: 'Components',
    subcategory: 'Processors',
    brand: 'Intel',
    stock_quantity: 25,
    rating: 4.9,
    review_count: 45,
    is_featured: false,
    is_active: true
  },
  {
    name: 'NVIDIA RTX 4080 Graphics Card',
    description: 'High-end graphics card for 4K gaming and ray tracing. Features 16GB GDDR6X memory.',
    price: 65999.00,
    original_price: 69999.00,
    image: '/images/rtx-4080.jpg',
    category: 'Components',
    subcategory: 'Graphics Cards',
    brand: 'NVIDIA',
    stock_quantity: 12,
    rating: 4.7,
    review_count: 32,
    is_featured: true,
    is_active: true
  },
  {
    name: 'Corsair DDR5 32GB RAM Kit',
    description: 'High-speed DDR5 memory kit with 32GB capacity. Perfect for gaming and professional applications.',
    price: 12999.00,
    image: '/images/corsair-ddr5-32gb.jpg',
    category: 'Components',
    subcategory: 'Memory',
    brand: 'Corsair',
    stock_quantity: 30,
    rating: 4.5,
    review_count: 28,
    is_featured: false,
    is_active: true
  },
  {
    name: 'Samsung 980 PRO 2TB NVMe SSD',
    description: 'Ultra-fast NVMe SSD with 2TB capacity. Ideal for operating system and game storage.',
    price: 8999.00,
    original_price: 9999.00,
    image: '/images/samsung-980-pro-2tb.jpg',
    category: 'Components',
    subcategory: 'Storage',
    brand: 'Samsung',
    stock_quantity: 20,
    rating: 4.8,
    review_count: 56,
    is_featured: false,
    is_active: true
  },
  {
    name: 'Office PC - Budget Build',
    description: 'Affordable office PC perfect for productivity tasks, web browsing, and light computing.',
    price: 25999.00,
    image: '/images/office-pc-budget.jpg',
    category: 'PC Sets',
    subcategory: 'Office PCs',
    brand: 'COMPHILITY Custom',
    stock_quantity: 10,
    rating: 4.3,
    review_count: 12,
    is_featured: false,
    is_active: true
  },
  {
    name: 'MacBook Air M2',
    description: 'Apple MacBook Air with M2 chip, 8GB RAM, and 256GB SSD. Perfect for productivity and creative work.',
    price: 65999.00,
    image: '/images/macbook-air-m2.jpg',
    category: 'Laptops',
    subcategory: 'Ultrabooks',
    brand: 'Apple',
    stock_quantity: 5,
    rating: 4.9,
    review_count: 67,
    is_featured: true,
    is_active: true
  }
]

async function seedProducts() {
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

    // Check if products already exist
    const [existingProducts] = await connection.execute('SELECT COUNT(*) as count FROM products')
    const currentCount = existingProducts[0].count

    console.log(`📦 Current products in database: ${currentCount}`)

    if (currentCount > 0) {
      console.log('⚠️  Products already exist in database')
      console.log('   Skipping product seeding to avoid duplicates')
      console.log('   If you want to reset products, manually clear the products table first')
      return true
    }

    console.log('🛍️ Seeding sample products...')

    // Insert each product
    for (const product of sampleProducts) {
      const [result] = await connection.execute(`
        INSERT INTO products (
          name, description, price, original_price, image, category, 
          subcategory, brand, stock_quantity, rating, review_count, 
          is_featured, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        product.name,
        product.description,
        product.price,
        product.original_price || null,
        product.image,
        product.category,
        product.subcategory,
        product.brand,
        product.stock_quantity,
        product.rating,
        product.review_count,
        product.is_featured,
        product.is_active
      ])

      console.log(`  ✓ Added: ${product.name} (ID: ${result.insertId})`)
    }

    // Show summary
    const [newCount] = await connection.execute('SELECT COUNT(*) as count FROM products')
    const [featuredCount] = await connection.execute('SELECT COUNT(*) as count FROM products WHERE is_featured = TRUE')
    const [categories] = await connection.execute('SELECT DISTINCT category FROM products ORDER BY category')

    console.log('\n📊 Products Summary:')
    console.log(`   Total Products: ${newCount[0].count}`)
    console.log(`   Featured Products: ${featuredCount[0].count}`)
    console.log('   Categories:')
    categories.forEach(cat => {
      console.log(`     • ${cat.category}`)
    })

    console.log('\n🎉 Product seeding completed successfully!')
    return true

  } catch (error) {
    console.error('❌ Product seeding error:', error.message)
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n⚠️ Products table does not exist. Please run database setup first:')
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

module.exports = seedProducts

// Run directly if called from command line
if (require.main === module) {
  seedProducts()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
}
