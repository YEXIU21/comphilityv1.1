import api from './api'

export const wishlistService = {
  // Get user's wishlist
  async getWishlist() {
    try {
      const response = await api.get('/wishlist')
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch wishlist' 
      }
    }
  },

  // Add item to wishlist
  async addToWishlist(productId) {
    try {
      const response = await api.post('/wishlist/add', { productId })
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to wishlist' 
      }
    }
  },

  // Remove item from wishlist
  async removeFromWishlist(productId) {
    try {
      const response = await api.delete(`/wishlist/items/${productId}`)
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item from wishlist' 
      }
    }
  },

  // Clear entire wishlist
  async clearWishlist() {
    try {
      const response = await api.delete('/wishlist')
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear wishlist' 
      }
    }
  },

  // Move item from wishlist to cart
  async moveToCart(productId, quantity = 1) {
    try {
      const response = await api.post('/wishlist/move-to-cart', { 
        productId, 
        quantity 
      })
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to move item to cart' 
      }
    }
  }
}
