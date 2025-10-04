<template>
  <div class="cart">
    <div class="container">
      <!-- Page Header -->
      <div class="cart-header fade-in">
        <h1 class="page-title">Shopping Cart</h1>
        <p class="cart-subtitle">Review your items before checkout</p>
      </div>
      <p v-if="cartItems.length > 0" class="cart-count">{{ cartItemCount }} items in your cart</p>

      <!-- Empty Cart -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
        <router-link to="/" class="btn btn-primary">Continue Shopping</router-link>
      </div>

      <!-- Cart Content -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div class="cart-header">
            <div class="cart-actions">
              <button @click="clearCart" class="btn btn-outline">
                Clear Cart
              </button>
              <button @click="proceedToCheckout" class="btn btn-primary">
                Proceed to Checkout
              </button>
            </div>
            <h3>Cart Items</h3>
          </div>
          
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img 
                :src="getImageUrl(item.image)" 
                :alt="item.name"
                @error="handleImageError"
              />
            </div>
            
            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-price">₱{{ formatPrice(item.price) }}</p>
              <p v-if="item.category" class="item-category">{{ item.category }}</p>
            </div>
            
            <div class="item-quantity">
              <button @click="decreaseQuantity(item)" class="quantity-btn">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)" class="quantity-btn">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            
            <div class="item-total">
              <p class="total-price">₱{{ formatPrice(item.price * item.quantity) }}</p>
              <button @click="removeItem(item)" class="remove-btn" title="Remove item">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3>Order Summary</h3>
            
            <div class="summary-row">
              <span>Subtotal ({{ cartItemCount }} items)</span>
              <span>₱{{ formatPrice(subtotal) }}</span>
            </div>
            
            <div class="summary-row">
              <span>Shipping Fee</span>
              <span>₱{{ formatPrice(shippingFee) }}</span>
            </div>
            
            <div class="summary-row">
              <span>Tax</span>
              <span>₱{{ formatPrice(tax) }}</span>
            </div>
            
            <hr class="summary-divider">
            
            <div class="summary-row total-row">
              <span>Total</span>
              <span>₱{{ formatPrice(total) }}</span>
            </div>
            
            <button @click="proceedToCheckout" class="btn btn-primary checkout-btn">
              <i class="fas fa-lock"></i>
              Proceed to Checkout
            </button>
            
            <router-link to="/" class="continue-shopping">
              <i class="fas fa-arrow-left"></i>
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirm Clear Cart Modal -->
    <ConfirmModal
      :show="showClearConfirm"
      title="Clear Cart?"
      message="Are you sure you want to remove all items from your cart? This action cannot be undone."
      confirmText="Clear Cart"
      cancelText="Keep Items"
      type="danger"
      @confirm="confirmClearCart"
      @cancel="showClearConfirm = false"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

export default {
  name: 'Cart',
  components: {
    ConfirmModal
  },
  data() {
    return {
      showClearConfirm: false
    }
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotal', 'cartItemCount']),
    
    cartItems() {
      return this.cart
    },
    
    subtotal() {
      return this.cartTotal
    },
    
    shippingFee() {
      return this.subtotal > 5000 ? 0 : 150
    },
    
    tax() {
      return this.subtotal * 0.12 // 12% VAT
    },
    
    total() {
      return this.subtotal + this.shippingFee + this.tax
    }
  },
  methods: {
    ...mapMutations(['removeFromCart', 'updateCartQuantity']),
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    async increaseQuantity(item) {
      console.log('➕ [Cart] Increasing quantity for:', item.name)
      
      // Update local cart immediately
      this.updateCartQuantity({
        productId: item.id,
        quantity: item.quantity + 1
      })
      
      // Sync with database if authenticated
      if (this.$store.state.isAuthenticated && item.cart_id) {
        try {
          const api = require('@/services/api').default
          await api.put(`/cart/${item.cart_id}`, {
            quantity: item.quantity + 1
          })
          console.log('✅ [Cart] Quantity updated in database')
        } catch (error) {
          console.error('❌ [Cart] Failed to update quantity in database:', error)
        }
      }
    },
    
    async decreaseQuantity(item) {
      console.log('➖ [Cart] Decreasing quantity for:', item.name)
      
      if (item.quantity > 1) {
        // Update local cart immediately
        this.updateCartQuantity({
          productId: item.id,
          quantity: item.quantity - 1
        })
        
        // Sync with database if authenticated
        if (this.$store.state.isAuthenticated && item.cart_id) {
          try {
            const api = require('@/services/api').default
            await api.put(`/cart/${item.cart_id}`, {
              quantity: item.quantity - 1
            })
            console.log('✅ [Cart] Quantity updated in database')
          } catch (error) {
            console.error('❌ [Cart] Failed to update quantity in database:', error)
          }
        }
      } else {
        this.removeItem(item)
      }
    },
    
    async removeItem(item) {
      console.log('🗑️ [Cart] Removing item:', item.name)
      
      // Remove from local cart immediately
      this.removeFromCart(item.id)
      
      // Remove from database if authenticated
      if (this.$store.state.isAuthenticated && item.cart_id) {
        try {
          const api = require('@/services/api').default
          await api.delete(`/cart/${item.cart_id}`)
          console.log('✅ [Cart] Item removed from database')
        } catch (error) {
          console.error('❌ [Cart] Failed to remove item from database:', error)
        }
      }
    },
    
    clearCart() {
      console.log('🗑️ [Cart] Clear cart button clicked')
      this.showClearConfirm = true
    },
    
    async confirmClearCart() {
      console.log('🗑️ [Cart] Clearing entire cart')
      this.showClearConfirm = false
      
      // Clear local cart immediately
      this.$store.commit('clearCart')
      
      // Clear database cart if authenticated
      if (this.$store.state.isAuthenticated) {
        try {
          const api = require('@/services/api').default
          await api.delete('/cart')
          console.log('✅ [Cart] Cart cleared in database')
        } catch (error) {
          console.error('❌ [Cart] Failed to clear cart in database:', error)
        }
      }
    },
    
    proceedToCheckout() {
      this.$router.push('/checkout')
    },
    
    getImageUrl(imagePath) {
      console.log('🖼️ [Cart] Getting image URL for:', imagePath)
      
      if (!imagePath) {
        console.warn('⚠️ [Cart] No image path provided')
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23E5E7EB" width="100" height="100"/%3E%3Ctext fill="%236B7280" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
      }
      
      if (imagePath.startsWith('http')) {
        console.log('🔗 [Cart] Image is full URL:', imagePath)
        return imagePath
      }
      
      // Get base URL without /api suffix for images
      const apiBaseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api'
      const baseURL = apiBaseURL.replace('/api', '')
      const fullUrl = `${baseURL}${imagePath}`
      console.log('✅ [Cart] Constructed image URL:', fullUrl)
      return fullUrl
    },
    
    handleImageError(event) {
      console.error('❌ [Cart] Image failed to load:', event.target.src)
      event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%236B7280" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
      event.target.onerror = null
    }
  }
}
</script>

<style scoped>
.cart {
  padding: 3rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-50) 0%, #f0f4ff 100%);
}

.cart-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-blue) 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.cart-subtitle {
  font-size: 1.25rem;
  color: var(--gray-600);
  font-weight: 500;
  margin: 0;
}

.cart-count {
  color: var(--gray-600);
  font-size: 1.125rem;
  margin: 0;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gray-500);
}

.empty-cart i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-cart h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}

.empty-cart p {
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-items {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.cart-header h3 {
  margin: 0;
  color: var(--gray-800);
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-100);
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: var(--gray-50);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--gray-800);
  line-height: 1.3;
}

.item-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 0.25rem;
}

.item-category {
  font-size: 0.875rem;
  color: var(--gray-500);
  margin: 0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 0.25rem;
}

.quantity-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: var(--gray-600);
  cursor: pointer;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.quantity-btn:hover {
  background: var(--gray-100);
}

.quantity {
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
}

.item-total {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.total-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease;
}

.remove-btn:hover {
  background: rgba(220, 53, 69, 0.1);
}

.cart-summary {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
}

.summary-card h3 {
  margin-bottom: 1.5rem;
  color: var(--gray-800);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.summary-row:last-of-type {
  margin-bottom: 0;
}

.summary-divider {
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: 1.5rem 0;
}

.total-row {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-800);
}

.checkout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.continue-shopping {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--primary-blue);
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease;
}

.continue-shopping:hover {
  background: var(--gray-50);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .cart-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .cart-item {
    grid-template-columns: 60px 1fr;
    gap: 1rem;
  }
  
  .item-quantity,
  .item-total {
    grid-column: 2;
    justify-self: end;
    margin-top: 0.75rem;
  }
  
  .item-total {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
}

@media (max-width: 576px) {
  .cart {
    padding: 1rem 0;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .cart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .empty-cart {
    padding: 3rem 1rem;
  }
  
  .empty-cart i {
    font-size: 3rem;
  }
  
  .empty-cart h3 {
    font-size: 1.25rem;
  }
}

/* iPhone 14 Pro Max Mobile Responsive */
@media (max-width: 430px) {
  .cart {
    padding: 0.75rem 0;
  }
  
  .page-header {
    padding: 1.5rem 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .cart-item {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
  }
  
  .item-details {
    text-align: center;
  }
  
  .item-name {
    font-size: 0.875rem;
  }
  
  .quantity-controls {
    justify-content: center;
  }
  
  .checkout-summary {
    padding: 0.75rem;
  }
}
</style>
