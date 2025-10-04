<template>
  <div class="order-management">
    <!-- Filter Controls -->
    <div class="filter-bar">
      <div class="filter-group">
        <label>Order ID:</label>
        <input type="text" v-model="filters.orderId" placeholder="Search Order ID" class="filter-input">
      </div>
      
      <div class="filter-group">
        <label>Search:</label>
        <div class="search-box">
          <input type="text" v-model="filters.search" placeholder="Customer name, email..." class="filter-input">
          <i class="fas fa-search"></i>
        </div>
      </div>
      
      <div class="filter-group">
        <label>Status:</label>
        <select v-model="filters.status" class="filter-select">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
    
    <!-- Orders Table -->
    <div class="orders-table-wrapper">
      <table class="orders-table">
        <thead>
          <tr>
            <th>ORDER NUMBER</th>
            <th>ORDER ID</th>
            <th>STATUS</th>
            <th>ITEMS</th>
            <th>CUSTOMER NAME</th>
            <th>SHIPPING SERVICE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td>{{ order.number }}</td>
            <td class="order-id">{{ order.orderId }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </td>
            <td>{{ order.items }}</td>
            <td>{{ order.customerName }}</td>
            <td class="shipping-service">
              <span :class="getShippingClass(order.shipping)">
                • {{ order.shipping }}
              </span>
            </td>
            <td>
              <button class="view-btn" @click="viewOrder(order)">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div class="pagination">
      <button class="page-btn" @click="previousPage" :disabled="currentPage === 1">
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <span class="page-info">{{ currentPage }}</span>
      
      <button 
        v-for="page in visiblePages" 
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      
      <span v-if="showEllipsis" class="ellipsis">...</span>
      
      <button 
        v-if="totalPages > 5"
        class="page-btn"
        :class="{ active: totalPages === currentPage }"
        @click="goToPage(totalPages)"
      >
        {{ totalPages }}
      </button>
      
      <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderManagement',
  data() {
    return {
      orders: [
        {
          id: 1,
          number: 1,
          orderId: '59217342',
          status: 'Pending',
          items: 1,
          customerName: 'Ryan Jay Miano',
          shipping: 'Standard'
        },
        {
          id: 2,
          number: 2,
          orderId: '59217343',
          status: 'Pending',
          items: 2,
          customerName: 'Xander Llamas',
          shipping: 'Standard'
        },
        {
          id: 3,
          number: 3,
          orderId: '59217344',
          status: 'Shipped',
          items: 10,
          customerName: 'Serwin Torijos',
          shipping: 'Express'
        },
        {
          id: 4,
          number: 4,
          orderId: '59217345',
          status: 'Shipped',
          items: 22,
          customerName: 'Vincent Tupalangit',
          shipping: 'Express'
        }
      ],
      filters: {
        orderId: '',
        search: '',
        status: ''
      },
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders
      
      // Filter by order ID
      if (this.filters.orderId) {
        filtered = filtered.filter(order => 
          order.orderId.includes(this.filters.orderId)
        )
      }
      
      // Filter by search (customer name)
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(order => 
          order.customerName.toLowerCase().includes(search)
        )
      }
      
      // Filter by status
      if (this.filters.status) {
        filtered = filtered.filter(order => 
          order.status.toLowerCase() === this.filters.status
        )
      }
      
      return filtered
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredOrders.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage)
    },
    visiblePages() {
      const pages = []
      const maxVisible = 3
      let start = Math.max(2, this.currentPage - 1)
      let end = Math.min(this.totalPages - 1, this.currentPage + 1)
      
      if (this.totalPages <= 5) {
        for (let i = 2; i < this.totalPages; i++) {
          pages.push(i)
        }
      } else {
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
      }
      
      return pages
    },
    showEllipsis() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2
    }
  },
  methods: {
    getStatusClass(status) {
      const statusMap = {
        'Pending': 'pending',
        'Shipped': 'shipped',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled'
      }
      return statusMap[status] || 'pending'
    },
    getShippingClass(shipping) {
      return shipping === 'Express' ? 'express' : 'standard'
    },
    viewOrder(order) {
      this.$router.push(`/admin/orders/${order.orderId}`)
    },
    goToPage(page) {
      this.currentPage = page
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    }
  }
}
</script>

<style scoped>
.order-management {
  max-width: 1400px;
  margin: 0 auto;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 600;
  color: #666;
  white-space: nowrap;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #5b7eff;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.filter-select {
  min-width: 150px;
}

/* Orders Table */
.orders-table-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table thead {
  background: #f5f5f5;
}

.orders-table th {
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  color: #666;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.orders-table td {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  color: #333;
}

.order-id {
  color: #5b7eff;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
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

.status-badge.cancelled {
  background: #f8d7da;
  color: #842029;
}

.shipping-service span {
  font-weight: 600;
}

.shipping-service .standard {
  color: #5b7eff;
}

.shipping-service .express {
  color: #ff5722;
}

.view-btn {
  padding: 8px 12px;
  background: #5b7eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: #4a6eef;
  transform: scale(1.05);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background: #5b7eff;
  color: white;
  border-color: #5b7eff;
}

.page-btn.active {
  background: #5b7eff;
  color: white;
  border-color: #5b7eff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: none;
}

.ellipsis {
  color: #999;
  padding: 0 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-input,
  .filter-select {
    width: 100%;
  }
  
  .orders-table {
    font-size: 0.9rem;
  }
  
  .orders-table th,
  .orders-table td {
    padding: 10px;
  }
}
</style>
