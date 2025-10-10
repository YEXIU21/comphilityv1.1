<template>
  <div class="dashboard">
    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">TOTAL PRODUCTS</span>
        </div>
        <div class="stat-value">1.1K</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">TOTAL ORDERS</span>
        </div>
        <div class="stat-value">300</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">TOTAL USERS</span>
        </div>
        <div class="stat-value">100</div>
      </div>
      
      <div class="stat-card revenue">
        <div class="stat-header">
          <span class="stat-label">REVENUE TODAY</span>
        </div>
        <div class="stat-value">₱12.5K</div>
      </div>
    </div>
    
    <!-- Best Selling Products -->
    <div class="best-sellers">
      <h2 class="section-title">TOP 5 BEST SELLING PRODUCTS</h2>
      
      <div class="product-list">
        <div class="product-item" v-for="(product, index) in bestSellers" :key="product.id">
          <div class="rank">
            <div class="rank-badge" :class="getRankClass(index + 1)">
              <i v-if="index === 0" class="fas fa-trophy"></i>
              <i v-else-if="index === 1" class="fas fa-medal"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
          </div>
          
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="product-category">{{ product.category }}</p>
          </div>
          
          <div class="product-sales">
            <span class="sales-count">{{ product.sold }} SOLD</span>
            <button class="view-btn">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      bestSellers: [
        {
          id: 1,
          name: 'AMD Ryzen 5 5600X Socket AM4 3.7GHz Processor',
          category: 'Processor',
          image: 'https://via.placeholder.com/80',
          sold: 100
        },
        {
          id: 2,
          name: 'Team Elite Vulcan TUF 16gb 2x8 3200mhz Ddr4 Gaming Memory',
          category: 'Memory',
          image: 'https://via.placeholder.com/80',
          sold: 80
        },
        {
          id: 3,
          name: 'Nvision PRO 180HZ Flat IPS Panel 24" Gaming Monitor Black',
          category: 'Monitor',
          image: 'https://via.placeholder.com/80',
          sold: 60
        },
        {
          id: 4,
          name: 'MSI A520m-A Pro AMD Am4 Ddr4 Micro-ATX PCB Gaming Motherboard',
          category: 'Motherboard',
          image: 'https://via.placeholder.com/80',
          sold: 50
        },
        {
          id: 5,
          name: 'Rakk Alti BVR/RGY Illuminated Gaming Mouse',
          category: 'Mouse',
          image: 'https://via.placeholder.com/80',
          sold: 40
        }
      ]
    }
  },
  methods: {
    getRankClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      return 'bronze'
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

/* Statistics Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.25);
}

.stat-card:nth-child(1) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card.revenue {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-header {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: 1rem;
  font-weight: 700;
  opacity: 0.95;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.stat-value {
  font-size: 3rem;
  font-weight: 900;
  position: relative;
  z-index: 1;
  line-height: 1;
}

/* Best Sellers Section */
.best-sellers {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 12px 35px rgba(44, 62, 80, 0.15);
  position: relative;
  overflow: hidden;
}

.best-sellers::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  pointer-events: none;
}

.section-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid rgba(52, 152, 219, 0.5);
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  z-index: 1;
}

.product-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.product-item:hover {
  transform: translateX(8px) translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

.rank {
  margin-right: 20px;
}

.rank-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
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
  background: #f97316;
  color: white;
}

.product-image {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 5px;
  font-weight: 600;
}

.product-category {
  color: #666;
  font-size: 0.9rem;
}

.product-sales {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sales-count {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.view-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  background: #5b7eff;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .product-item {
    flex-wrap: wrap;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
  }
}
</style>
