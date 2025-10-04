const express = require('express')
const { getPool } = require('../db')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// GET user's cart (requires authentication)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool()
    const userId = req.user.id

    console.log('[Cart] Fetching cart for user:', userId)

    const [cartItems] = await pool.execute(`
      SELECT 
        c.id as cart_id,
        c.quantity,
        p.id,
        p.name,
        p.price,
        p.image,
        p.stock,
        p.category,
        p.brand
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [userId])

    console.log('[Cart] Found', cartItems.length, 'items in cart')
    
    res.json({ cart: cartItems })
  } catch (error) {
    console.error('[Cart] Error fetching cart:', error)
    res.status(500).json({ message: 'Error fetching cart' })
  }
})

// ADD item to cart (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body
    const userId = req.user.id
    const pool = getPool()

    console.log('[Cart] Adding product to cart:', { userId, product_id, quantity })

    // Check if product exists
    const [products] = await pool.execute(
      'SELECT id, name, price, stock FROM products WHERE id = ?',
      [product_id]
    )

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check if item already in cart
    const [existingItems] = await pool.execute(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    )

    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + quantity
      await pool.execute(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      )
      console.log('[Cart] Updated quantity to:', newQuantity)
    } else {
      // Insert new item
      await pool.execute(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity]
      )
      console.log('[Cart] Added new item to cart')
    }

    // Return updated cart
    const [cartItems] = await pool.execute(`
      SELECT 
        c.id as cart_id,
        c.quantity,
        p.id,
        p.name,
        p.price,
        p.image,
        p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId])

    res.json({ 
      message: 'Item added to cart',
      cart: cartItems
    })
  } catch (error) {
    console.error('[Cart] Error adding to cart:', error)
    res.status(500).json({ message: 'Error adding to cart' })
  }
})

// UPDATE cart item quantity (requires authentication)
router.put('/:cartId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body
    const { cartId } = req.params
    const userId = req.user.id
    const pool = getPool()

    console.log('[Cart] Updating cart item:', { cartId, quantity, userId })

    // Verify cart item belongs to user
    const [cartItems] = await pool.execute(
      'SELECT id FROM cart WHERE id = ? AND user_id = ?',
      [cartId, userId]
    )

    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await pool.execute('DELETE FROM cart WHERE id = ?', [cartId])
      console.log('[Cart] Removed item from cart')
    } else {
      // Update quantity
      await pool.execute(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [quantity, cartId]
      )
      console.log('[Cart] Updated quantity to:', quantity)
    }

    res.json({ message: 'Cart updated successfully' })
  } catch (error) {
    console.error('[Cart] Error updating cart:', error)
    res.status(500).json({ message: 'Error updating cart' })
  }
})

// DELETE item from cart (requires authentication)
router.delete('/:cartId', authenticateToken, async (req, res) => {
  try {
    const { cartId } = req.params
    const userId = req.user.id
    const pool = getPool()

    console.log('[Cart] Removing cart item:', { cartId, userId })

    // Verify cart item belongs to user
    const [cartItems] = await pool.execute(
      'SELECT id FROM cart WHERE id = ? AND user_id = ?',
      [cartId, userId]
    )

    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    await pool.execute('DELETE FROM cart WHERE id = ?', [cartId])
    console.log('[Cart] Item removed from cart')

    res.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('[Cart] Error removing from cart:', error)
    res.status(500).json({ message: 'Error removing from cart' })
  }
})

// CLEAR cart (requires authentication)
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const pool = getPool()

    console.log('[Cart] Clearing cart for user:', userId)

    await pool.execute('DELETE FROM cart WHERE user_id = ?', [userId])
    console.log('[Cart] Cart cleared')

    res.json({ message: 'Cart cleared successfully' })
  } catch (error) {
    console.error('[Cart] Error clearing cart:', error)
    res.status(500).json({ message: 'Error clearing cart' })
  }
})

module.exports = { router }
