<template>
  <div class="statistics">
    <!-- Date Range Selector -->
    <div class="date-range-selector">
      <div class="date-input">
        <label>From:</label>
        <input type="date" v-model="dateRange.from" />
      </div>
      <div class="date-input">
        <label>To:</label>
        <input type="date" v-model="dateRange.to" />
      </div>
      <button class="apply-btn" @click="applyDateRange">
        Apply
      </button>
    </div>
    
    <!-- Quick Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="stat-content">
          <h3>Total Orders</h3>
          <p class="stat-value">1,234</p>
          <span class="stat-change positive">
            <i class="fas fa-arrow-up"></i> 12.5%
          </span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-peso-sign"></i>
        </div>
        <div class="stat-content">
          <h3>Total Revenue</h3>
          <p class="stat-value">₱2.45M</p>
          <span class="stat-change positive">
            <i class="fas fa-arrow-up"></i> 23.1%
          </span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>New Customers</h3>
          <p class="stat-value">321</p>
          <span class="stat-change positive">
            <i class="fas fa-arrow-up"></i> 8.7%
          </span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <h3>Conversion Rate</h3>
          <p class="stat-value">3.45%</p>
          <span class="stat-change negative">
            <i class="fas fa-arrow-down"></i> 2.3%
          </span>
        </div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="charts-container">
      <!-- Sales Chart -->
      <div class="chart-card">
        <h3 class="chart-title">Sales Overview</h3>
        <div class="chart-placeholder">
          <i class="fas fa-chart-area"></i>
          <p>Sales chart will be displayed here</p>
        </div>
      </div>
      
      <!-- Category Distribution -->
      <div class="chart-card">
        <h3 class="chart-title">Sales by Category</h3>
        <div class="chart-placeholder">
          <i class="fas fa-chart-pie"></i>
          <p>Category distribution chart</p>
        </div>
      </div>
    </div>
    
    <!-- Top Products Table -->
    <div class="table-card">
      <h3 class="section-title">Top Selling Products</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Units Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in topProducts" :key="product.id">
            <td>
              <span class="rank-badge" :class="getRankClass(index + 1)">
                {{ index + 1 }}
              </span>
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.unitsSold }}</td>
            <td>₱{{ formatPrice(product.revenue) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Recent Activity -->
    <div class="activity-card">
      <h3 class="section-title">Recent Activity</h3>
      <div class="activity-list">
        <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
          <div class="activity-icon" :class="activity.type">
            <i :class="getActivityIcon(activity.type)"></i>
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  data() {
    return {
      dateRange: {
        from: '',
        to: ''
      },
      topProducts: [
        {
          id: 1,
          name: 'AMD Ryzen 5 5600X',
          category: 'Processor',
          unitsSold: 245,
          revenue: 734500
        },
        {
          id: 2,
          name: 'GeForce RTX 3060',
          category: 'Graphics Card',
          unitsSold: 189,
          revenue: 567000
        },
        {
          id: 3,
          name: 'Samsung 980 Pro 1TB',
          category: 'Storage',
          unitsSold: 167,
          revenue: 334000
        },
        {
          id: 4,
          name: 'Corsair Vengeance 16GB',
          category: 'Memory',
          unitsSold: 156,
          revenue: 234000
        },
        {
          id: 5,
          name: 'ASUS ROG Strix B550',
          category: 'Motherboard',
          unitsSold: 134,
          revenue: 201000
        }
      ],
      recentActivities: [
        {
          id: 1,
          type: 'order',
          text: 'New order #59217345 received',
          time: '2 minutes ago'
        },
        {
          id: 2,
          type: 'user',
          text: 'New customer registration',
          time: '15 minutes ago'
        },
        {
          id: 3,
          type: 'product',
          text: 'Product stock low: RTX 3060',
          time: '1 hour ago'
        },
        {
          id: 4,
          type: 'payment',
          text: 'Payment received for order #59217344',
          time: '2 hours ago'
        }
      ]
    }
  },
  mounted() {
    // Set default date range (last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    this.dateRange.from = thirtyDaysAgo.toISOString().split('T')[0]
    this.dateRange.to = today.toISOString().split('T')[0]
  },
  methods: {
    applyDateRange() {
      // Fetch data for selected date range
      console.log('Applying date range:', this.dateRange)
    },
    formatPrice(price) {
      return price.toLocaleString('en-PH')
    },
    getRankClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      if (rank === 3) return 'bronze'
      return ''
    },
    getActivityIcon(type) {
      const icons = {
        order: 'fas fa-shopping-cart',
        user: 'fas fa-user',
        product: 'fas fa-box',
        payment: 'fas fa-credit-card'
      }
      return icons[type] || 'fas fa-circle'
    }
  }
}
</script>

<style scoped>
.statistics {
  max-width: 1400px;
  margin: 0 auto;
}

/* Date Range Selector */
.date-range-selector {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.date-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-input label {
  font-weight: 600;
  color: #666;
}

.date-input input {
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.date-input input:focus {
  outline: none;
  border-color: #5b7eff;
}

.apply-btn {
  padding: 10px 30px;
  background: #5b7eff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-btn:hover {
  background: #4a6eef;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
  align-items: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.stat-change {
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
}

.stat-change.positive {
  color: #4caf50;
}

.stat-change.negative {
  color: #f44336;
}

/* Charts Container */
.charts-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 8px;
  color: #999;
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #5b7eff;
  opacity: 0.3;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f5f5f5;
}

.data-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.data-table td {
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  color: #333;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: #e0e0e0;
  color: #666;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
}

.rank-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #333;
}

.rank-badge.bronze {
  background: #cd7f32;
  color: white;
}

/* Activity Card */
.activity-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  gap: 15px;
  align-items: start;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: #f0f0f0;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.activity-icon.order {
  background: #2196f3;
}

.activity-icon.user {
  background: #4caf50;
}

.activity-icon.product {
  background: #ff9800;
}

.activity-icon.payment {
  background: #9c27b0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #333;
  margin-bottom: 5px;
  font-weight: 500;
}

.activity-time {
  color: #999;
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 768px) {
  .date-range-selector {
    flex-direction: column;
    gap: 10px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .data-table {
    font-size: 0.85rem;
  }
}
</style>
