<template>
  <div class="product-comparison-modal" v-if="showComparison" @click="closeComparison">
    <div class="comparison-container" @click.stop>
      <div class="comparison-header">
        <h2>Product Performance Comparison</h2>
        <button @click="closeComparison" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="comparison-content">
        <!-- Product Selection -->
        <div class="product-selector">
          <div class="product-slot" v-for="(product, index) in comparisonProducts" :key="index">
            <div v-if="product" class="selected-product">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p class="product-price">₱{{ formatPrice(product.price) }}</p>
              </div>
              <button @click="removeProduct(index)" class="remove-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-else class="empty-slot" @click="selectProduct(index)">
              <i class="fas fa-plus"></i>
              <span>Add Product</span>
            </div>
          </div>
        </div>
        
        <!-- Performance Comparison Charts -->
        <div class="charts-comparison" v-if="hasProducts">
          <div class="chart-container" v-for="(product, index) in validProducts" :key="index">
            <h4 class="chart-title">{{ product.name }}</h4>
            <div class="performance-chart-small">
              <svg viewBox="0 0 300 300" class="comparison-chart">
                <!-- Gradient Definitions -->
                <defs>
                  <linearGradient :id="`gradient${index}`" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" :style="`stop-color:${chartColors[index].start};stop-opacity:0.6`" />
                    <stop offset="50%" :style="`stop-color:${chartColors[index].mid};stop-opacity:0.7`" />
                    <stop offset="100%" :style="`stop-color:${chartColors[index].end};stop-opacity:0.8`" />
                  </linearGradient>
                </defs>
                
                <!-- Hexagon Background -->
                <polygon 
                  points="150,30 240,90 240,180 150,240 60,180 60,90" 
                  class="chart-bg"
                />
                
                <!-- Performance Data -->
                <polygon 
                  :points="getProductPolygon(product, index)" 
                  :fill="`url(#gradient${index})`"
                  :stroke="chartColors[index].stroke"
                  stroke-width="2"
                  class="performance-data"
                />
                
                <!-- Grid Lines -->
                <g class="grid-lines">
                  <polygon points="150,50 220,100 220,170 150,220 80,170 80,100" class="grid-line" />
                  <polygon points="150,70 200,110 200,150 150,190 100,150 100,110" class="grid-line" />
                </g>
                
                <!-- Labels -->
                <text x="150" y="20" text-anchor="middle" class="chart-label-small">CPU</text>
                <text x="250" y="95" text-anchor="start" class="chart-label-small">GPU</text>
                <text x="250" y="185" text-anchor="start" class="chart-label-small">GAME</text>
                <text x="150" y="260" text-anchor="middle" class="chart-label-small">RAM</text>
                <text x="50" y="185" text-anchor="end" class="chart-label-small">FEAT</text>
                <text x="50" y="95" text-anchor="end" class="chart-label-small">PWR</text>
              </svg>
            </div>
            
            <!-- Numeric Comparison -->
            <div class="numeric-stats">
              <div class="stat-row" v-for="(value, key) in getProductMetrics(product)" :key="key">
                <span class="stat-label">{{ key.toUpperCase() }}</span>
                <div class="stat-bar">
                  <div class="stat-fill" :style="`width: ${value}%; background: ${chartColors[index].mid}`"></div>
                  <span class="stat-value">{{ Math.round(value) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Side-by-Side Comparison Table -->
        <div class="comparison-table" v-if="hasProducts">
          <table>
            <thead>
              <tr>
                <th>Specification</th>
                <th v-for="(product, index) in validProducts" :key="index">{{ product.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Price</strong></td>
                <td v-for="product in validProducts" :key="product.id">₱{{ formatPrice(product.price) }}</td>
              </tr>
              <tr>
                <td><strong>Computing Power</strong></td>
                <td v-for="product in validProducts" :key="product.id">
                  <div class="performance-badge" :class="getPerformanceLevel(getProductMetrics(product).computing)">
                    {{ Math.round(getProductMetrics(product).computing) }}%
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>Graphics Performance</strong></td>
                <td v-for="product in validProducts" :key="product.id">
                  <div class="performance-badge" :class="getPerformanceLevel(getProductMetrics(product).rendering)">
                    {{ Math.round(getProductMetrics(product).rendering) }}%
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>Gaming Score</strong></td>
                <td v-for="product in validProducts" :key="product.id">
                  <div class="performance-badge" :class="getPerformanceLevel(getProductMetrics(product).gaming)">
                    {{ Math.round(getProductMetrics(product).gaming) }}%
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>Memory</strong></td>
                <td v-for="product in validProducts" :key="product.id">
                  <div class="performance-badge" :class="getPerformanceLevel(getProductMetrics(product).memory)">
                    {{ Math.round(getProductMetrics(product).memory) }}%
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>Overall Score</strong></td>
                <td v-for="product in validProducts" :key="product.id">
                  <div class="overall-score" :style="`background: ${chartColors[validProducts.indexOf(product)].mid}`">
                    {{ Math.round(getOverallScore(product)) }}%
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Action Buttons -->
        <div class="comparison-actions" v-if="hasProducts">
          <button @click="addAllToCart" class="btn btn-primary">
            <i class="fas fa-shopping-cart"></i>
            Add All to Cart
          </button>
          <button @click="clearComparison" class="btn btn-outline">
            <i class="fas fa-trash"></i>
            Clear Comparison
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductComparison',
  props: {
    showComparison: {
      type: Boolean,
      default: false
    },
    initialProducts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      comparisonProducts: [null, null, null], // Up to 3 products
      chartColors: [
        {
          start: '#FF6B9D',
          mid: '#E91E63', 
          end: '#C2185B',
          stroke: '#E91E63'
        },
        {
          start: '#4FC3F7',
          mid: '#2196F3',
          end: '#1976D2', 
          stroke: '#2196F3'
        },
        {
          start: '#81C784',
          mid: '#4CAF50',
          end: '#388E3C',
          stroke: '#4CAF50'
        }
      ]
    }
  },
  computed: {
    hasProducts() {
      return this.comparisonProducts.some(product => product !== null)
    },
    
    validProducts() {
      return this.comparisonProducts.filter(product => product !== null)
    }
  },
  watch: {
    initialProducts: {
      handler(newProducts) {
        if (newProducts && newProducts.length > 0) {
          newProducts.forEach((product, index) => {
            if (index < 3) {
              this.$set(this.comparisonProducts, index, product)
            }
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    closeComparison() {
      this.$emit('close')
    },
    
    selectProduct(index) {
      // In a real app, this would open a product selection modal
      // For now, we'll emit an event for the parent to handle
      this.$emit('select-product', index)
    },
    
    removeProduct(index) {
      this.$set(this.comparisonProducts, index, null)
    },
    
    getProductMetrics(product) {
      // Calculate performance metrics based on product data
      // This would use real product specifications in a real app
      const baseScore = Math.min((product.price / 1000) * 10, 100)
      
      return {
        computing: Math.min(baseScore + Math.random() * 20, 100),
        rendering: Math.min(baseScore + Math.random() * 25, 100), 
        gaming: Math.min(baseScore + Math.random() * 30, 100),
        memory: Math.min(baseScore + Math.random() * 15, 100),
        features: Math.min(baseScore + Math.random() * 20, 100),
        power: Math.min(baseScore + Math.random() * 10, 100)
      }
    },
    
    getProductPolygon(product, index) {
      const metrics = this.getProductMetrics(product)
      const center = 150
      const maxRadius = 90
      const minRadius = 30
      
      const scale = (value) => {
        return minRadius + (maxRadius - minRadius) * (value / 100)
      }
      
      const angles = [
        -Math.PI/2,     // Top (CPU)
        -Math.PI/6,     // Top Right (GPU)
        Math.PI/6,      // Bottom Right (Gaming)
        Math.PI/2,      // Bottom (Memory)
        5*Math.PI/6,    // Bottom Left (Features)
        7*Math.PI/6     // Top Left (Power)
      ]
      
      const values = [
        metrics.computing,
        metrics.rendering,
        metrics.gaming,
        metrics.memory,
        metrics.features,
        metrics.power
      ]
      
      const points = angles.map((angle, i) => {
        const radius = scale(values[i] || 0)
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        return `${x},${y}`
      })
      
      return points.join(' ')
    },
    
    getOverallScore(product) {
      const metrics = this.getProductMetrics(product)
      const scores = Object.values(metrics)
      return scores.reduce((sum, score) => sum + score, 0) / scores.length
    },
    
    getPerformanceLevel(score) {
      if (score >= 80) return 'high'
      if (score >= 60) return 'medium'
      return 'low'
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    addAllToCart() {
      this.validProducts.forEach(product => {
        this.$store.commit('addToCart', product)
      })
      this.$emit('close')
      alert(`Added ${this.validProducts.length} products to cart!`)
    },
    
    clearComparison() {
      this.comparisonProducts = [null, null, null]
    },
    
    addProduct(product) {
      const emptyIndex = this.comparisonProducts.findIndex(p => p === null)
      if (emptyIndex !== -1) {
        this.$set(this.comparisonProducts, emptyIndex, product)
      }
    }
  }
}
</script>

<style scoped>
.product-comparison-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.comparison-container {
  background: var(--white);
  border-radius: var(--border-radius-xl);
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 2px solid var(--gray-100);
  background: linear-gradient(135deg, var(--primary-blue) 0%, #3B82F6 100%);
  color: var(--white);
}

.comparison-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: var(--white);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(255,255,255,0.1);
}

.comparison-content {
  padding: 2rem;
}

.product-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.product-slot {
  border: 2px dashed var(--gray-300);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.selected-product {
  width: 100%;
  text-align: center;
  position: relative;
}

.selected-product .product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
}

.selected-product h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-800);
}

.product-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary-blue);
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--danger);
  color: var(--white);
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.75rem;
}

.empty-slot {
  cursor: pointer;
  color: var(--gray-500);
  transition: all 0.2s ease;
}

.empty-slot:hover {
  color: var(--primary-blue);
  border-color: var(--primary-blue);
}

.empty-slot i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.charts-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.chart-container {
  text-align: center;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
}

.performance-chart-small {
  margin-bottom: 1.5rem;
}

.comparison-chart {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.chart-bg {
  fill: rgba(240, 242, 247, 0.8);
  stroke: rgba(200, 206, 218, 0.6);
  stroke-width: 1;
}

.grid-line {
  fill: none;
  stroke: rgba(200, 206, 218, 0.4);
  stroke-width: 1;
}

.chart-label-small {
  fill: var(--gray-600);
  font-size: 10px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.numeric-stats {
  text-align: left;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
  width: 60px;
}

.stat-bar {
  flex: 1;
  height: 20px;
  background: var(--gray-200);
  border-radius: 10px;
  position: relative;
  margin: 0 1rem;
}

.stat-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.stat-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-700);
  width: 40px;
}

.comparison-table {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
}

.comparison-table th {
  background: var(--gray-50);
  font-weight: 600;
  color: var(--primary-blue);
}

.performance-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
}

.performance-badge.high {
  background: var(--success);
  color: var(--white);
}

.performance-badge.medium {
  background: var(--warning);
  color: var(--white);
}

.performance-badge.low {
  background: var(--gray-400);
  color: var(--white);
}

.overall-score {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  color: var(--white);
  font-weight: 700;
  text-align: center;
}

.comparison-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .product-selector {
    grid-template-columns: 1fr;
  }
  
  .charts-comparison {
    grid-template-columns: 1fr;
  }
  
  .comparison-actions {
    flex-direction: column;
  }
}
</style>
