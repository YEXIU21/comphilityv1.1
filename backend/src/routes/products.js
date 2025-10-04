const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { getPool } = require('../db')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../../images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
  console.log('[Products] Created images directory:', imagesDir)
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'))
    }
  }
})

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query
    const pool = getPool()
    
    let query = 'SELECT * FROM products WHERE 1=1'
    const params = []

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit))

    const [products] = await pool.execute(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1'
    const countParams = []
    
    if (category) {
      countQuery += ' AND category = ?'
      countParams.push(category)
    }
    
    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)'
      countParams.push(`%${search}%`, `%${search}%`)
    }

    const [countResult] = await pool.execute(countQuery, countParams)
    const total = countResult[0].total

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('[Products] Error fetching products:', error)
    res.status(500).json({ message: 'Error fetching products' })
  }
})

// GET single product (public)
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    )

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(products[0])
  } catch (error) {
    console.error('[Products] Error fetching product:', error)
    res.status(500).json({ message: 'Error fetching product' })
  }
})

// CREATE product (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, specifications } = req.body
    const image = req.file ? `/images/${req.file.filename}` : null

    console.log('[Products] Creating product:', { name, category, image })

    const pool = getPool()
    const [result] = await pool.execute(
      `INSERT INTO products (name, description, price, stock, category, brand, image, specifications)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        parseFloat(price),
        parseInt(stock),
        category,
        brand || null,
        image,
        specifications ? JSON.stringify(specifications) : null
      ]
    )

    const [newProduct] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    )

    console.log('[Products] Product created successfully:', newProduct[0])
    res.status(201).json(newProduct[0])
  } catch (error) {
    console.error('[Products] Error creating product:', error)
    // Delete uploaded file if database insert fails
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }
    res.status(500).json({ message: 'Error creating product' })
  }
})

// UPDATE product (admin only)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, specifications } = req.body
    const pool = getPool()

    // Get existing product
    const [existingProducts] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    )

    if (existingProducts.length === 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(404).json({ message: 'Product not found' })
    }

    const existingProduct = existingProducts[0]
    let image = existingProduct.image

    // If new image uploaded, delete old image and use new one
    if (req.file) {
      if (existingProduct.image) {
        const oldImagePath = path.join(__dirname, '../..', existingProduct.image)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      image = `/images/${req.file.filename}`
    }

    console.log('[Products] Updating product:', req.params.id)

    await pool.execute(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, stock = ?, category = ?, brand = ?, image = ?, specifications = ?
       WHERE id = ?`,
      [
        name,
        description,
        parseFloat(price),
        parseInt(stock),
        category,
        brand || null,
        image,
        specifications ? JSON.stringify(specifications) : null,
        req.params.id
      ]
    )

    const [updatedProduct] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    )

    console.log('[Products] Product updated successfully')
    res.json(updatedProduct[0])
  } catch (error) {
    console.error('[Products] Error updating product:', error)
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }
    res.status(500).json({ message: 'Error updating product' })
  }
})

// DELETE product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool()

    // Get product to delete image
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    )

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const product = products[0]

    // Delete image file if exists
    if (product.image) {
      const imagePath = path.join(__dirname, '../..', product.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
        console.log('[Products] Deleted image:', imagePath)
      }
    }

    // Delete product from database
    await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id])

    console.log('[Products] Product deleted successfully:', req.params.id)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('[Products] Error deleting product:', error)
    res.status(500).json({ message: 'Error deleting product' })
  }
})

module.exports = { router }
