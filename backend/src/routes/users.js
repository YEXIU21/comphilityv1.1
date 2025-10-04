const express = require('express')
const bcrypt = require('bcryptjs')
const { getPool } = require('../db')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// GET all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query
    const pool = getPool()
    
    let query = 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE 1=1'
    const params = []

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    if (role) {
      query += ' AND role = ?'
      params.push(role)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit))

    const [users] = await pool.execute(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1'
    const countParams = []
    
    if (search) {
      countQuery += ' AND (name LIKE ? OR email LIKE ?)'
      countParams.push(`%${search}%`, `%${search}%`)
    }
    
    if (role) {
      countQuery += ' AND role = ?'
      countParams.push(role)
    }

    const [countResult] = await pool.execute(countQuery, countParams)
    const total = countResult[0].total

    console.log(`[Users] Retrieved ${users.length} users`)
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('[Users] Error fetching users:', error)
    res.status(500).json({ message: 'Error fetching users' })
  }
})

// GET single user (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool()
    const [users] = await pool.execute(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
      [req.params.id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(users[0])
  } catch (error) {
    console.error('[Users] Error fetching user:', error)
    res.status(500).json({ message: 'Error fetching user' })
  }
})

// UPDATE user (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body
    const pool = getPool()

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.params.id]
    )

    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if email is already taken by another user
    const [emailCheck] = await pool.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, req.params.id]
    )

    if (emailCheck.length > 0) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    console.log('[Users] Updating user:', req.params.id)

    await pool.execute(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, req.params.id]
    )

    const [updatedUser] = await pool.execute(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
      [req.params.id]
    )

    console.log('[Users] User updated successfully')
    res.json(updatedUser[0])
  } catch (error) {
    console.error('[Users] Error updating user:', error)
    res.status(500).json({ message: 'Error updating user' })
  }
})

// DELETE user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool()

    // Prevent deleting yourself
    if (req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.params.id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Delete user
    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id])

    console.log('[Users] User deleted successfully:', req.params.id)
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('[Users] Error deleting user:', error)
    res.status(500).json({ message: 'Error deleting user' })
  }
})

// UPDATE user password (admin only)
router.put('/:id/password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { password } = req.body
    
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const pool = getPool()
    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, req.params.id]
    )

    console.log('[Users] Password updated for user:', req.params.id)
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('[Users] Error updating password:', error)
    res.status(500).json({ message: 'Error updating password' })
  }
})

module.exports = { router }
