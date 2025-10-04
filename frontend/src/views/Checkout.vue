<template>
  <div class="checkout">
    <div class="container">
      <!-- Page Header -->
      <div class="checkout-header">
        <h1 class="checkout-title">CHECKOUT</h1>
      </div>

      <!-- Customer Information -->
      <div class="checkout-content">
        <div class="customer-info">
          <div class="info-card">
            <div class="customer-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="customer-details">
              <div class="customer-name">{{ customerInfo.name }}</div>
              <div class="customer-contact">
                <div class="contact-item">
                  <i class="fas fa-phone"></i>
                  {{ customerInfo.phone }}
                </div>
                <div class="contact-item">
                  <i class="fas fa-envelope"></i>
                  {{ customerInfo.email }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="address-card">
            <div class="address-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="address-details">
              {{ customerInfo.address }}
              <div class="edit-icon">
                <i class="fas fa-edit"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Options -->
        <div class="shipping-section">
          <h3 class="section-title">
            Shipping Options
            <i class="fas fa-chevron-right"></i>
          </h3>
          
          <div class="shipping-options">
            <div 
              v-for="option in shippingOptions" 
              :key="option.id"
              class="shipping-option"
              :class="{ active: selectedShipping === option.id }"
              @click="selectedShipping = option.id"
            >
              <div class="shipping-info">
                <div class="shipping-name">{{ option.name }}</div>
                <div class="shipping-description">{{ option.description }}</div>
                <div class="shipping-price">₱{{ formatPrice(option.price) }}</div>
              </div>
              <div class="shipping-radio">
                <i v-if="selectedShipping === option.id" class="fas fa-check-circle"></i>
                <i v-else class="far fa-circle"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items">
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartItems" :key="item.id">
                <td class="product-cell">
                  <div class="product-info">
                    <div class="product-image">
                      <img 
                        :src="getSafeImageUrl(item.image, 'thumbnail')" 
                        :alt="item.name"
                        @error="handleImageError($event, 'thumbnail')"
                      >
                    </div>
                    <div class="product-name">{{ item.name }}</div>
                  </div>
                </td>
                <td class="quantity-cell">{{ item.quantity }}</td>
                <td class="price-cell">₱{{ formatPrice(item.price) }}</td>
                <td class="total-cell">₱{{ formatPrice(item.price * item.quantity) }}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Order Summary -->
          <div class="order-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>₱{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span>₱{{ formatPrice(shippingCost) }}</span>
            </div>
            <div class="summary-row total">
              <span>TOTAL:</span>
              <span>₱{{ formatPrice(totalAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Enhanced Payment Methods -->
        <div class="payment-section">
          <PaymentMethodSelector
            :amount="totalAmount"
            :selected-method="selectedPayment"
            @method-selected="handlePaymentMethodSelection"
            @payment-data="handlePaymentData"
            @validation-change="handlePaymentValidation"
          />
        </div>

        <!-- Enhanced Place Order Button -->
        <div class="order-actions">
          <button 
            @click="placeOrder" 
            class="btn btn-primary place-order-btn"
            :disabled="!canPlaceOrder || isProcessingOrder"
          >
            <i v-if="isProcessingOrder" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-shopping-bag"></i>
            {{ isProcessingOrder ? 'Processing Order...' : 'Place Order' }}
          </button>
          <div v-if="!isPaymentValid" class="validation-message">
            <i class="fas fa-exclamation-triangle"></i>
            Please complete payment information
          </div>
        </div>
      </div>
    </div>

    <!-- Order Confirmation Modal -->
    <div v-if="showConfirmation" class="modal-overlay">
      <div class="confirmation-modal">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Thank You for Ordering!</h2>
        <div class="modal-actions">
          <button @click="viewOrder" class="btn btn-primary">View Order</button>
          <button @click="continueShopping" class="btn btn-outline">Continue Shopping</button>
        </div>
      </div>
    </div>

    <!-- Order Tracking Modal -->
    <div v-if="showTracking" class="modal-overlay" @click="hideTracking">
      <div class="tracking-modal" @click.stop>
        <div class="modal-header">
          <h3>Track your Order</h3>
          <button @click="hideTracking" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Order ID</label>
            <input v-model="trackingForm.orderId" type="text" class="form-input" placeholder="Enter Order ID">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="trackingForm.email" type="email" class="form-input" placeholder="Enter Email">
          </div>
          <button @click="trackOrder" class="btn btn-primary track-btn">
            TRACK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import imageFallback from '@/mixins/imageFallback'
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector.vue'
import { paymentService } from '@/services/paymentService'
import { orderService } from '@/services/orderService'

export default {
  name: 'Checkout',
  components: {
    PaymentMethodSelector
  },
  mixins: [imageFallback],
  data() {
    return {
      selectedShipping: 'express',
      selectedPayment: 'cod',
      showConfirmation: false,
      showTracking: false,
      isProcessingOrder: false,
      isPaymentValid: true,
      paymentData: null,
      orderError: null,
      customerInfo: {
        name: 'Ryan Jay Miano',
        phone: '09939920841',
        email: 'rjmiano23@gmail.com',
        address: 'Gabi, Cordova, Cebu, Visayas, 6017'
      },
      shippingOptions: [
        {
          id: 'standard',
          name: 'Standard Local',
          description: 'Guaranteed get in 12 Days',
          price: 120.00
        },
        {
          id: 'express',
          name: 'Express',
          description: 'Guaranteed get in 7 Days',
          price: 200.00
        },
        {
          id: 'pickup',
          name: 'Self Pickup',
          description: '',
          price: 0.00
        }
      ],
      trackingForm: {
        orderId: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotal']),
    
    cartItems() {
      return this.cart
    },
    
    subtotal() {
      return this.cartTotal
    },
    
    shippingCost() {
      const selectedOption = this.shippingOptions.find(opt => opt.id === this.selectedShipping)
      return selectedOption ? selectedOption.price : 0
    },
    
    totalAmount() {
      const baseAmount = this.subtotal + this.shippingCost
      const paymentFee = this.paymentFee
      return baseAmount + paymentFee
    },
    
    paymentFee() {
      if (!this.selectedPayment) return 0
      return paymentService.calculateFee(this.subtotal + this.shippingCost, this.selectedPayment)
    },
    
    canPlaceOrder() {
      return this.cartItems.length > 0 && 
             this.isPaymentValid && 
             !this.isProcessingOrder
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    async placeOrder() {
      if (!this.canPlaceOrder) return
      
      this.isProcessingOrder = true
      this.orderError = null
      
      try {
        // Prepare order data
        const orderData = {
          id: this.generateOrderId(),
          items: this.cartItems,
          shipping: {
            method: this.selectedShipping,
            cost: this.shippingCost
          },
          payment: {
            method: this.selectedPayment,
            fee: this.paymentFee,
            data: this.paymentData
          },
          totals: {
            subtotal: this.subtotal,
            shipping: this.shippingCost,
            paymentFee: this.paymentFee,
            total: this.totalAmount
          },
          customer: this.customerInfo,
          createdAt: new Date().toISOString()
        }
        
        // Process payment
        const paymentResult = await paymentService.processPayment({
          method: this.selectedPayment,
          amount: this.totalAmount,
          orderData: orderData,
          customer: this.customerInfo,
          ...this.paymentData
        })
        
        if (!paymentResult.success) {
          throw new Error(paymentResult.message)
        }
        
        // Create order in backend
        const orderResult = await orderService.createOrder({
          ...orderData,
          paymentReference: paymentResult.data?.reference
        })
        
        if (!orderResult.success) {
          throw new Error(orderResult.message)
        }
        
        // Store order locally as backup
        const orders = JSON.parse(localStorage.getItem('orders') || '[]')
        orders.push(orderData)
        localStorage.setItem('orders', JSON.stringify(orders))
        
        // Clear cart
        this.$store.commit('clearCart')
        
        // Show confirmation
        this.showConfirmation = true
        
      } catch (error) {
        console.error('Order placement failed:', error)
        this.orderError = error.message || 'Failed to place order. Please try again.'
        
        // Show error notification
        this.$nextTick(() => {
          alert(this.orderError)
        })
      } finally {
        this.isProcessingOrder = false
      }
    },
    
    generateOrderId() {
      const timestamp = Date.now().toString(36)
      const random = Math.random().toString(36).substr(2, 6)
      return `ORD-${timestamp}-${random}`.toUpperCase()
    },
    
    handlePaymentMethodSelection(methodId) {
      this.selectedPayment = methodId
      this.isPaymentValid = methodId === 'cod' // COD is always valid by default
    },
    
    handlePaymentData(data) {
      this.paymentData = data
    },
    
    handlePaymentValidation(isValid) {
      this.isPaymentValid = isValid
    },
    
    viewOrder() {
      this.showConfirmation = false
      this.$router.push('/profile#orders')
    },
    
    continueShopping() {
      this.showConfirmation = false
      this.$router.push('/')
    },
    
    showTrackingModal() {
      this.showTracking = true
    },
    
    hideTracking() {
      this.showTracking = false
      this.trackingForm = { orderId: '', email: '' }
    },
    
    trackOrder() {
      // Simulate order tracking
      if (!this.trackingForm.orderId || !this.trackingForm.email) {
        alert('Please fill in all fields')
        return
      }
      
      alert(`Tracking order ${this.trackingForm.orderId}...`)
      this.hideTracking()
    }
  }
}
</script>

<style scoped>
.checkout {
  padding: 3rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-blue) 0%, #3B82F6 50%, var(--primary-blue-dark) 100%);
  color: var(--white);
  position: relative;
  overflow: hidden;
}

.checkout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 2px, transparent 2px),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 2px, transparent 2px);
  background-size: 150px 150px, 200px 200px;
  animation: float 25s infinite linear;
}

.checkout-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.checkout-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}

.checkout-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.customer-info {
  display: flex;
  gap: 2rem;
}

.info-card,
.address-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: var(--border-radius);
  flex: 1;
}

.customer-avatar,
.address-icon {
  font-size: 2rem;
  color: var(--white);
}

.customer-details {
  flex: 1;
}

.customer-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.customer-contact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.address-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-icon {
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.edit-icon:hover {
  opacity: 1;
}

.shipping-section,
.payment-section {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  color: var(--gray-800);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-blue);
  font-size: 1.125rem;
  font-weight: 600;
}

.shipping-options,
.payment-methods {
  display: flex;
  gap: 1rem;
}

.shipping-option,
.payment-method {
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.shipping-option:hover,
.payment-method:hover {
  border-color: var(--primary-blue);
}

.shipping-option.active,
.payment-method.active {
  border-color: var(--primary-blue);
  background: var(--secondary-blue);
}

.shipping-info {
  flex: 1;
}

.shipping-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.shipping-description {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
}

.shipping-price {
  font-weight: 600;
  color: var(--primary-blue);
}

.shipping-radio,
.payment-radio {
  font-size: 1.25rem;
  color: var(--primary-blue);
}

.payment-method {
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.payment-icon {
  font-size: 2rem;
  color: var(--primary-blue);
}

.payment-icon img {
  height: 2rem;
  width: auto;
}

.payment-name {
  font-weight: 600;
}

.order-items {
  background: var(--white);
  border-radius: var(--border-radius);
  color: var(--gray-800);
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
}

.items-table th {
  background: var(--gray-50);
  font-weight: 600;
  color: var(--primary-blue);
}

.product-cell {
  width: 40%;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 3rem;
  height: 3rem;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: var(--gray-100);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quantity-cell,
.price-cell,
.total-cell {
  text-align: center;
  font-weight: 600;
}

.order-summary {
  padding: 2rem;
  border-top: 2px solid var(--gray-200);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary-blue);
  border-top: 1px solid var(--gray-200);
  padding-top: 0.75rem;
}

.order-actions {
  text-align: center;
}

.place-order-btn {
  font-size: 1.125rem;
  font-weight: 600;
  padding: 1rem 3rem;
  background: var(--white);
  color: var(--primary-blue);
  border: none;
}

.place-order-btn:hover:not(:disabled) {
  background: var(--gray-100);
  transform: translateY(-2px);
}

.place-order-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.place-order-btn i {
  margin-right: 0.5rem;
}

.validation-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

.validation-message i {
  color: #f59e0b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirmation-modal {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 3rem;
  text-align: center;
  color: var(--gray-800);
  max-width: 400px;
  width: 90%;
}

.success-icon {
  font-size: 4rem;
  color: var(--success);
  margin-bottom: 1rem;
}

.confirmation-modal h2 {
  color: var(--primary-blue);
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.tracking-modal {
  background: var(--white);
  border-radius: var(--border-radius);
  max-width: 400px;
  width: 90%;
  color: var(--gray-800);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h3 {
  margin: 0;
  color: var(--primary-blue);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--gray-600);
  cursor: pointer;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.track-btn {
  width: 100%;
  padding: 1rem;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .checkout {
    padding: 1rem 0;
  }
  
  .customer-info {
    flex-direction: column;
    gap: 1rem;
  }
  
  .shipping-options,
  .payment-methods {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .items-table {
    font-size: 0.875rem;
  }
  
  .items-table th,
  .items-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .product-info {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}

@media (max-width: 576px) {
  .checkout-content {
    gap: 1rem;
  }
  
  .shipping-section,
  .payment-section {
    padding: 1.5rem;
  }
  
  .place-order-btn {
    width: 100%;
  }
  
  .confirmation-modal {
    padding: 2rem;
  }
}
</style>
