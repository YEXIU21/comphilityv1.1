<template>
  <div class="order-details">
    <div class="page-header">
      <h1 class="page-title">Order Details</h1>
    </div>
    
    <div class="order-card">
      <!-- Order Header Info -->
      <div class="order-header">
        <div class="order-date">
          <i class="fas fa-calendar"></i>
          <span>{{ formatDate(order.date) }}</span>
        </div>
        
        <div class="order-id">
          <span>Order ID : {{ order.id }}</span>
        </div>
        
        <div class="order-status">
          <span>Status : </span>
          <span class="status-badge" :class="order.status.toLowerCase()">
            {{ order.status }}
          </span>
        </div>
      </div>
      
      <!-- Customer and Shipping Info -->
      <div class="info-section">
        <div class="customer-info">
          <div class="info-header">
            <i class="fas fa-user"></i>
            <span>{{ order.customer.name }}</span>
          </div>
          <div class="info-details">
            <p><i class="fas fa-envelope"></i> {{ order.customer.email }}</p>
            <p><i class="fas fa-phone"></i> {{ order.customer.phone }}</p>
          </div>
        </div>
        
        <div class="shipping-info">
          <div class="info-header">
            <i class="fas fa-truck"></i>
            <span>{{ order.shipping.service }}</span>
          </div>
          <div class="info-details">
            <p><i class="fas fa-map-marker-alt"></i> {{ order.shipping.address }}</p>
          </div>
        </div>
      </div>
      
      <!-- Products Table -->
      <div class="products-section">
        <table class="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id">
              <td>
                <div class="product-cell">
                  <img :src="item.image" :alt="item.name" class="product-img" />
                  <span>{{ item.name }}</span>
                </div>
              </td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-right">₱{{ formatPrice(item.unitPrice) }}</td>
              <td class="text-right total">₱{{ formatPrice(item.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Order Summary -->
      <div class="order-summary">
        <div class="summary-row">
          <span>Subtotal :</span>
          <span>₱{{ formatPrice(order.subtotal) }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping :</span>
          <span>₱{{ formatPrice(order.shipping.fee) }}</span>
        </div>
        <div class="summary-row total">
          <span>TOTAL :</span>
          <span>₱{{ formatPrice(order.total) }}</span>
        </div>
      </div>
      
      <!-- Payment Method -->
      <div class="payment-section">
        <span class="payment-label">Payment Method : </span>
        <span class="payment-method">{{ order.paymentMethod }}</span>
      </div>
      
      <!-- Action Button -->
      <div class="order-actions">
        <button 
          v-if="order.status === 'Pending'" 
          class="btn-accept"
          @click="acceptOrder"
        >
          Accept Order
        </button>
        <button 
          v-else-if="order.status === 'Shipped'" 
          class="btn-delivered"
          @click="markDelivered"
        >
          Mark as Delivered
        </button>
        <button 
          v-else 
          class="btn-complete"
          disabled
        >
          Order Complete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetails',
  data() {
    return {
      order: {
        id: '59217342',
        date: new Date('2025-04-19T10:00:00'),
        status: 'Pending',
        customer: {
          name: 'Ryan Jay Miano',
          email: 'rjmiano23@gmail.com',
          phone: '09939920841'
        },
        shipping: {
          service: 'J&T Express',
          address: 'Gabi, Cordova, Cebu, 6017',
          fee: 200.00
        },
        items: [
          {
            id: 1,
            name: 'Ryzen 5 5600G',
            image: 'https://via.placeholder.com/60',
            quantity: 1,
            unitPrice: 7175.00,
            total: 7175.00
          },
          {
            id: 2,
            name: 'MSI NVIDIA GeForce GTX 1650',
            image: 'https://via.placeholder.com/60',
            quantity: 2,
            unitPrice: 8995.00,
            total: 17990.00
          },
          {
            id: 3,
            name: 'Asrock B550M Pro',
            image: 'https://via.placeholder.com/60',
            quantity: 3,
            unitPrice: 5750.00,
            total: 17250.00
          }
        ],
        subtotal: 42415.00,
        total: 42615.00,
        paymentMethod: 'Cash on Delivery'
      }
    }
  },
  mounted() {
    // Load order based on route param
    const orderId = this.$route.params.id
    // In real app, fetch order details from API
    console.log('Loading order:', orderId)
  },
  methods: {
    formatDate(date) {
      const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      return date.toLocaleDateString('en-US', options)
    },
    formatPrice(price) {
      return price.toLocaleString('en-PH', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      })
    },
    acceptOrder() {
      if (confirm('Accept this order and mark it as Shipped?')) {
        this.order.status = 'Shipped'
        // API call to update order status
        alert('Order accepted and marked as Shipped!')
      }
    },
    markDelivered() {
      if (confirm('Mark this order as Delivered?')) {
        this.order.status = 'Delivered'
        // API call to update order status
        alert('Order marked as Delivered!')
      }
    }
  }
}
</script>

<style scoped>
.order-details {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 1.8rem;
  color: #5b7eff;
  font-weight: bold;
  margin: 0;
}

.order-card {
  background: #5b7eff;
  border-radius: 16px;
  padding: 30px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 25px;
}

.order-date {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 500;
}

.order-id {
  font-size: 1.1rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 50px;
}

.order-status {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.status-badge {
  padding: 8px 20px;
  border-radius: 50px;
  background: white;
  color: #5b7eff;
  font-weight: 600;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.shipped {
  background: #cfe2ff;
  color: #084298;
}

.status-badge.delivered {
  background: #d1e7dd;
  color: #0f5132;
}

/* Info Section */
.info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.customer-info,
.shipping-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.info-details p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.9;
}

.info-details i {
  width: 20px;
  text-align: center;
  opacity: 0.7;
}

/* Products Table */
.products-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 25px;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table thead {
  background: #f5f5f5;
}

.products-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.products-table td {
  padding: 15px;
  border-top: 1px solid #f0f0f0;
  color: #333;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  background: #f5f5f5;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.products-table td.total {
  font-weight: 600;
  color: #5b7eff;
}

/* Order Summary */
.order-summary {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 1rem;
}

.summary-row.total {
  padding-top: 15px;
  margin-top: 10px;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 1.3rem;
  font-weight: bold;
}

/* Payment Section */
.payment-section {
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 20px;
  border-radius: 50px;
  margin-bottom: 30px;
  text-align: center;
  font-size: 1.1rem;
}

.payment-label {
  font-weight: 600;
}

.payment-method {
  font-weight: 500;
  margin-left: 10px;
}

/* Action Button */
.order-actions {
  display: flex;
  justify-content: center;
}

.btn-accept,
.btn-delivered,
.btn-complete {
  padding: 14px 50px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.btn-accept {
  background: white;
  color: #5b7eff;
}

.btn-accept:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.btn-delivered {
  background: #4caf50;
  color: white;
}

.btn-delivered:hover {
  background: #45a049;
  transform: scale(1.05);
}

.btn-complete {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .info-section {
    grid-template-columns: 1fr;
  }
  
  .products-table {
    font-size: 0.9rem;
  }
  
  .product-img {
    width: 40px;
    height: 40px;
  }
  
  .order-card {
    padding: 20px;
  }
}
</style>
