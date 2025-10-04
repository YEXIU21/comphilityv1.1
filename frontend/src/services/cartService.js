import api from './api'

export const cartService = {
  // Get user's cart
  async getCart() {
    try {
      const response = await api.get('/cart')
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch cart' 
      }
    }
  },

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    try {
      const response = await api.post('/cart/add', { 
        productId, 
        quantity 
      })
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to cart' 
      }
    }
  },

  // Update cart item quantity
  async updateCartItem(itemId, quantity) {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity })
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart item' 
      }
    }
  },

  // Remove item from cart
  async removeFromCart(itemId) {
    try {
      const response = await api.delete(`/cart/items/${itemId}`)
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item from cart' 
      }
    }
  },

  // Clear entire cart
  async clearCart() {
    try {
      const response = await api.delete('/cart')
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      }
    }
  },

  // Apply coupon
  async applyCoupon(couponCode) {
    try {
      const response = await api.post('/cart/coupon', { code: couponCode })
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid coupon code' 
      }
    }
  },

  // Remove coupon
  async removeCoupon() {
    try {
      const response = await api.delete('/cart/coupon')
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove coupon' 
      }
    }
  }
}
