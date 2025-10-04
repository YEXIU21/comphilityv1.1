const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getPool } = require('../db')

const router = Router()

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: true, message: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dev_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: true, message: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Helper: build token and user response
function buildAuthResponse(user) {
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'customer'
  }

  // Include user data in JWT token for easy access
  const token = jwt.sign(
    { 
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'customer'
    },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  return { token, user: safeUser }
}

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match')
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: true, message: errors.array()[0].msg })
    }

    const { name, email, password } = req.body

    try {
      const pool = getPool()

      // Check if email already exists
      const [existingRows] = await pool.execute(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email]
      )
      if (existingRows.length > 0) {
        return res.status(409).json({ error: true, message: 'Email already registered' })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)

      // Insert user
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, passwordHash]
      )

      const newUser = { id: result.insertId, name, email, role: 'customer' }
      const payload = buildAuthResponse(newUser)

      return res.status(201).json(payload)
    } catch (err) {
      console.error('[Auth:Register] Error:', err)
      return res.status(500).json({ error: true, message: 'Internal server error' })
    }
  }
)

// Optional: POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    console.log('🔒 [Backend] Login attempt for email:', req.body.email)
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log('🔒 [Backend] Validation errors:', errors.array())
      return res.status(422).json({ error: true, message: errors.array()[0].msg })
    }

    const { email, password } = req.body
    console.log('🔒 [Backend] Validated credentials, searching for user...')

    try {
      const pool = getPool()
      const [rows] = await pool.execute(
        'SELECT id, name, email, role, password_hash FROM users WHERE email = ? LIMIT 1',
        [email]
      )

      if (rows.length === 0) {
        console.log('🔒 [Backend] User not found for email:', email)
        return res.status(401).json({ error: true, message: 'Invalid credentials' })
      }

      const user = rows[0]
      console.log('🔒 [Backend] User found:', { id: user.id, name: user.name, email: user.email, role: user.role })
      
      const isMatch = await bcrypt.compare(password, user.password_hash)
      if (!isMatch) {
        console.log('🔒 [Backend] Password does not match for user:', email)
        return res.status(401).json({ error: true, message: 'Invalid credentials' })
      }

      console.log('🔒 [Backend] Password matches, generating token...')
      const payload = buildAuthResponse(user)
      console.log('🔒 [Backend] Login successful, sending response:', { 
        user: payload.user, 
        tokenGenerated: !!payload.token 
      })
      return res.json(payload)
    } catch (err) {
      console.error('🔒 [Backend] Login Error:', err)
      return res.status(500).json({ error: true, message: 'Internal server error' })
    }
  }
)

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'User not found' })
    }

    const user = rows[0]
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    }

    return res.json({ user: safeUser })
  } catch (err) {
    console.error('[Auth:Me] Error:', err)
    return res.status(500).json({ error: true, message: 'Internal server error' })
  }
})

// PUT /api/auth/profile - Update user profile
router.put('/profile', authenticateToken, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail()
], async (req, res) => {
  console.log('👤 [Backend] Profile update attempt for user:', req.user.id)
  
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('👤 [Backend] Validation errors:', errors.array())
    return res.status(422).json({ error: true, message: errors.array()[0].msg })
  }

  const { name, email } = req.body
  console.log('👤 [Backend] Updating profile with:', { name, email })

  try {
    const pool = getPool()
    
    // Check if email is already taken by another user
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1',
      [email, req.user.id]
    )
    
    if (existingUsers.length > 0) {
      console.log('👤 [Backend] Email already taken:', email)
      return res.status(409).json({ error: true, message: 'Email already in use' })
    }

    // Update user profile
    await pool.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, req.user.id]
    )

    // Get updated user data
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    )

    const updatedUser = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role,
      createdAt: rows[0].created_at
    }

    console.log('👤 [Backend] Profile updated successfully:', updatedUser)
    return res.json({ user: updatedUser })
  } catch (err) {
    console.error('👤 [Backend] Profile update error:', err)
    return res.status(500).json({ error: true, message: 'Internal server error' })
  }
})

// PUT /api/auth/password - Change password
router.put('/password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match')
], async (req, res) => {
  console.log('🔑 [Backend] Password change attempt for user:', req.user.id)
  
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('🔑 [Backend] Validation errors:', errors.array())
    return res.status(422).json({ error: true, message: errors.array()[0].msg })
  }

  const { currentPassword, newPassword } = req.body
  console.log('🔑 [Backend] Validating current password...')

  try {
    const pool = getPool()
    
    // Get current user with password hash
    const [rows] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    )

    if (rows.length === 0) {
      console.log('🔑 [Backend] User not found:', req.user.id)
      return res.status(404).json({ error: true, message: 'User not found' })
    }

    const user = rows[0]
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)
    
    if (!isCurrentPasswordValid) {
      console.log('🔑 [Backend] Current password is incorrect')
      return res.status(401).json({ error: true, message: 'Current password is incorrect' })
    }

    // Hash new password
    console.log('🔑 [Backend] Current password valid, hashing new password...')
    const salt = await bcrypt.genSalt(10)
    const newPasswordHash = await bcrypt.hash(newPassword, salt)

    // Update password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, req.user.id]
    )

    console.log('🔑 [Backend] Password updated successfully')
    return res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('🔑 [Backend] Password update error:', err)
    return res.status(500).json({ error: true, message: 'Internal server error' })
  }
})

module.exports = { router, authenticateToken }
