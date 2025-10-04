import api from './api'

export const paymentService = {
  // Supported payment methods with their configurations
  paymentMethods: {
    cod: {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      icon: 'fas fa-money-bill-wave',
      fee: 0,
      isOnline: false
    },
    gcash: {
      id: 'gcash',
      name: 'GCash',
      description: 'Pay instantly with GCash',
      logo: '/images/gcash-logo.png',
      fee: 0,
      isOnline: true
    },
    maya: {
      id: 'maya',
      name: 'Maya (PayMaya)',
      description: 'Pay instantly with Maya',
      logo: '/images/maya-logo.png',
      fee: 0,
      isOnline: true
    },
    stripe: {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Secure payment with Stripe',
      icon: 'fas fa-credit-card',
      fee: 0.035, // 3.5% processing fee
      isOnline: true
    },
    paypal: {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      logo: '/images/paypal-logo.png',
      fee: 0.044, // 4.4% processing fee
      isOnline: true
    }
  },

  // Get available payment methods
  getPaymentMethods() {
    return Object.values(this.paymentMethods)
  },

  // Get payment method by ID
  getPaymentMethod(methodId) {
    return this.paymentMethods[methodId] || null
  },

  // Calculate payment fees
  calculateFee(amount, methodId) {
    const method = this.getPaymentMethod(methodId)
    if (!method || !method.fee) return 0
    return amount * method.fee
  },

  // Validate payment data
  validatePaymentData(paymentData) {
    const { method, amount, orderData } = paymentData
    const errors = []

    if (!method) {
      errors.push('Payment method is required')
    }

    if (!amount || amount <= 0) {
      errors.push('Payment amount must be greater than 0')
    }

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      errors.push('Order data is required')
    }

    // Method-specific validations
    if (method === 'stripe' && !paymentData.cardData) {
      errors.push('Credit card information is required')
    }

    if (method === 'paypal' && !paymentData.paypalData) {
      errors.push('PayPal account information is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Process payment based on method
  async processPayment(paymentData) {
    try {
      const validation = this.validatePaymentData(paymentData)
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        }
      }

      const { method } = paymentData

      switch (method) {
        case 'cod':
          return await this.processCOD(paymentData)
        case 'gcash':
          return await this.processGCash(paymentData)
        case 'maya':
          return await this.processMaya(paymentData)
        case 'stripe':
          return await this.processStripe(paymentData)
        case 'paypal':
          return await this.processPayPal(paymentData)
        default:
          return {
            success: false,
            message: 'Unsupported payment method'
          }
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      return {
        success: false,
        message: error.message || 'Payment processing failed'
      }
    }
  },

  // Cash on Delivery processing
  async processCOD(paymentData) {
    try {
      const response = await api.post('/payments/cod', {
        amount: paymentData.amount,
        order: paymentData.orderData,
        customer: paymentData.customer
      })

      return {
        success: true,
        data: response,
        message: 'Order placed successfully. Pay when delivered.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'COD processing failed'
      }
    }
  },

  // GCash payment processing
  async processGCash(paymentData) {
    try {
      const response = await api.post('/payments/gcash', {
        amount: paymentData.amount,
        order: paymentData.orderData,
        customer: paymentData.customer,
        phone: paymentData.gcashPhone
      })

      return {
        success: true,
        data: response,
        message: 'GCash payment initiated. Please complete payment on your phone.',
        requiresConfirmation: true
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'GCash payment failed'
      }
    }
  },

  // Maya payment processing
  async processMaya(paymentData) {
    try {
      const response = await api.post('/payments/maya', {
        amount: paymentData.amount,
        order: paymentData.orderData,
        customer: paymentData.customer,
        phone: paymentData.mayaPhone
      })

      return {
        success: true,
        data: response,
        message: 'Maya payment initiated. Please complete payment on your phone.',
        requiresConfirmation: true
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Maya payment failed'
      }
    }
  },

  // Stripe payment processing
  async processStripe(paymentData) {
    try {
      // First, create payment intent
      const intentResponse = await api.post('/payments/stripe/create-intent', {
        amount: paymentData.amount,
        currency: 'php',
        order: paymentData.orderData
      })

      // Process the payment with card data
      const response = await api.post('/payments/stripe/confirm', {
        payment_intent_id: intentResponse.payment_intent_id,
        card_data: paymentData.cardData,
        customer: paymentData.customer
      })

      return {
        success: true,
        data: response,
        message: 'Credit card payment processed successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Credit card payment failed'
      }
    }
  },

  // PayPal payment processing
  async processPayPal(paymentData) {
    try {
      const response = await api.post('/payments/paypal', {
        amount: paymentData.amount,
        order: paymentData.orderData,
        customer: paymentData.customer
      })

      return {
        success: true,
        data: response,
        message: 'PayPal payment initiated. Redirecting to PayPal...',
        redirectUrl: response.approval_url
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'PayPal payment failed'
      }
    }
  },

  // Get payment status
  async getPaymentStatus(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}/status`)
      return {
        success: true,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get payment status'
      }
    }
  },

  // Refund payment
  async refundPayment(paymentId, refundData) {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, refundData)
      return {
        success: true,
        data: response,
        message: 'Refund processed successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Refund processing failed'
      }
    }
  },

  // Format payment amount
  formatAmount(amount) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  },

  // Generate payment reference
  generatePaymentReference() {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 6)
    return `PAY-${timestamp}-${random}`.toUpperCase()
  }
}

export default paymentService
