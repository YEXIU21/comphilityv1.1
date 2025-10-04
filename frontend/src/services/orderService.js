import api from './api'

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData)
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create order' 
      }
    }
  },

  // Get user's orders
  async getOrders(params = {}) {
    try {
      const response = await api.get('/orders', { params })
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch orders' 
      }
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Order not found' 
      }
    }
  },

  // Cancel order
  async cancelOrder(orderId) {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`)
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to cancel order' 
      }
    }
  },

  // Track order
  async trackOrder(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`)
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to track order' 
      }
    }
  },

  // Request return/refund
  async requestReturn(orderId, returnData) {
    try {
      const response = await api.post(`/orders/${orderId}/return`, returnData)
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to request return' 
      }
    }
  }
}
