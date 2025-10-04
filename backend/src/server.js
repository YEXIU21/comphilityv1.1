const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const { initDb } = require('./db')
const { router: authRoutes } = require('./routes/auth')
const { router: productsRoutes } = require('./routes/products')
const { router: usersRoutes } = require('./routes/users')
const { router: cartRoutes } = require('./routes/cart')

const app = express()

// Middleware
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:8080'
app.use(cors({ 
  origin: FRONTEND_ORIGIN, 
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Serve static images - MUST be before other routes
app.use('/images', express.static(path.join(__dirname, '../images'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Cache-Control', 'public, max-age=31536000')
  }
}))
console.log('[Server] Serving images from:', path.join(__dirname, '../images'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/cart', cartRoutes)

const PORT = process.env.PORT || 3000

// Start server after DB init attempt
initDb()
  .catch((err) => {
    console.error('[DB] Initialization error:', err.message)
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`COMPHILITY API listening on http://localhost:${PORT}`)
    })
  })
