<template>
  <div class="build-pc">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">BUILD YOUR PC</h1>
        <p class="page-description">
          Create your custom PC build by selecting components. Our compatibility checker ensures all parts work together perfectly.
        </p>
      </div>

        <!-- PC Builder Diagram -->
        <div class="pc-builder-diagram">
          <div class="diagram-container">
            <div class="performance-chart">
              <div class="performance-header">
                <h3>Performance Analysis</h3>
                <p class="performance-subtitle">Real-time visualization of your build's capabilities</p>
              </div>
              <div class="performance-pentagon">
                <svg viewBox="0 0 500 500" class="pentagon-chart">
                <!-- Gradient Definitions -->
                <defs>
                  <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#5B7EFF;stop-opacity:0.9" />
                    <stop offset="30%" style="stop-color:#3B82F6;stop-opacity:0.7" />
                    <stop offset="70%" style="stop-color:#8B5CF6;stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:#6366F1;stop-opacity:0.4" />
                  </linearGradient>
                  <filter id="glowEffect">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <!-- Hexagon Background (6 sides for better layout) -->
                <polygon 
                  points="250,90 370,170 370,290 250,370 130,290 130,170" 
                  class="pentagon-bg"
                />
                
                <!-- Performance Data Overlay -->
                <polygon 
                  :points="performancePolygon"
                  class="performance-overlay"
                  filter="url(#glowEffect)"
                />
                
                <!-- Grid Lines -->
                <g class="grid-lines">
                  <polygon points="250,120 340,180 340,280 250,340 160,280 160,180" class="grid-line" />
                  <polygon points="250,150 310,190 310,270 250,310 190,270 190,190" class="grid-line" />
                  <polygon points="250,180 280,200 280,260 250,280 220,260 220,200" class="grid-line" />
                </g>
                
                <!-- Labels with proper spacing around centered hexagon -->
                <text x="250" y="60" text-anchor="middle" class="chart-label">
                  <tspan x="250" y="60">GENERAL INFO</tspan>
                  <tspan x="250" y="72" class="label-sub">(Processor)</tspan>
                </text>
                
                <text x="410" y="175" text-anchor="start" class="chart-label">
                  <tspan x="410" y="175">PERFORMANCE</tspan>
                  <tspan x="410" y="187" class="label-sub">(Graphics)</tspan>
                </text>
                
                <text x="410" y="295" text-anchor="start" class="chart-label">
                  <tspan x="410" y="295">BENCHMARKS</tspan>
                  <tspan x="410" y="307" class="label-sub">(Gaming)</tspan>
                </text>
                
                <text x="250" y="420" text-anchor="middle" class="chart-label">
                  <tspan x="250" y="420">MEMORY</tspan>
                  <tspan x="250" y="432" class="label-sub">(RAM/Storage)</tspan>
                </text>
                
                <text x="90" y="295" text-anchor="end" class="chart-label">
                  <tspan x="90" y="295">FEATURES</tspan>
                  <tspan x="90" y="307" class="label-sub">(Connectivity)</tspan>
                </text>
                
                <text x="90" y="175" text-anchor="end" class="chart-label">
                  <tspan x="90" y="175">POWER</tspan>
                  <tspan x="90" y="187" class="label-sub">(Supply)</tspan>
                </text>
              </svg>
            </div>
            
            <!-- Performance Level Indicator -->
            <div class="performance-indicator">
              <div class="performance-bar">
                <div class="performance-level" :style="{ width: overallPerformance + '%' }">
                  <span class="performance-text">{{ performanceLabel }}</span>
                </div>
              </div>
              <div class="performance-range">
                <span class="range-label low">Low End</span>
                <span class="range-label mid">Mid Range</span>
                <span class="range-label high">High End</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Build Progress -->
      <div class="build-progress">
        <div class="progress-header">
          <h3>Build Progress</h3>
          <div class="estimated-total">
            <span>Estimated Total: ₱{{ formatPrice(totalPrice) }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="progress-text">{{ completedComponents }}/{{ totalComponents }} components selected</p>
      </div>

      <!-- PC Builder -->
      <div class="pc-builder">
        <!-- Component Categories -->
        <div class="component-categories">
          <div 
            v-for="category in componentCategories" 
            :key="category.id"
            class="component-category"
            :class="{ completed: selectedComponents[category.id] }"
          >
            <div class="category-header" @click="toggleCategory(category.id)">
              <div class="category-info">
                <div class="category-icon">
                  <i :class="category.icon"></i>
                </div>
                <div class="category-details">
                  <h4 class="category-name">{{ category.name }}</h4>
                  <p class="category-description">{{ category.description }}</p>
                  <div v-if="selectedComponents[category.id]" class="selected-component">
                    <span class="component-name">{{ selectedComponents[category.id].name }}</span>
                    <span class="component-price">₱{{ formatPrice(selectedComponents[category.id].price) }}</span>
                  </div>
                </div>
              </div>
              <div class="category-actions">
                <div class="category-status">
                  <i v-if="selectedComponents[category.id]" class="fas fa-check-circle completed-icon"></i>
                  <i v-else class="far fa-circle pending-icon"></i>
                </div>
                <button class="select-btn">
                  {{ selectedComponents[category.id] ? 'Change' : 'Select' }}
                </button>
              </div>
            </div>
            
            <!-- Component Options (expanded when category is active) -->
            <div v-if="activeCategory === category.id" class="component-options">
              <div class="options-header">
                <h5>Choose {{ category.name }}</h5>
                <div class="filter-options">
                  <select v-model="categoryFilters[category.id]" class="filter-select">
                    <option value="all">All Brands</option>
                    <option value="intel">Intel</option>
                    <option value="amd">AMD</option>
                    <option value="nvidia">NVIDIA</option>
                    <option value="corsair">Corsair</option>
                  </select>
                </div>
              </div>
              
              <div class="component-grid">
                <div 
                  v-for="component in getFilteredComponents(category.id)" 
                  :key="component.id"
                  class="component-option"
                  :class="{ selected: selectedComponents[category.id]?.id === component.id }"
                  @click="selectComponent(category.id, component)"
                >
                  <div class="component-image">
                    <img :src="component.image || '/images/placeholder-component.png'" :alt="component.name" />
                  </div>
                  <div class="component-info">
                    <h6 class="component-name">{{ component.name }}</h6>
                    <p class="component-specs">{{ component.specs }}</p>
                    <div class="component-price">₱{{ formatPrice(component.price) }}</div>
                  </div>
                  <div class="component-select">
                    <i v-if="selectedComponents[category.id]?.id === component.id" class="fas fa-check-circle"></i>
                    <i v-else class="far fa-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Build Summary -->
        <div class="build-summary">
          <div class="summary-card">
            <h3>Build Summary</h3>
            
            <div class="compatibility-check">
              <div class="compatibility-status" :class="{ compatible: isCompatible, incompatible: !isCompatible }">
                <i :class="isCompatible ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'"></i>
                <span>{{ isCompatible ? 'Components Compatible' : 'Compatibility Issues Found' }}</span>
              </div>
              <div v-if="!isCompatible" class="compatibility-warnings">
                <ul>
                  <li v-for="warning in compatibilityWarnings" :key="warning">{{ warning }}</li>
                </ul>
              </div>
            </div>
            
            <div class="price-breakdown">
              <div v-for="category in componentCategories" :key="category.id" class="price-item">
                <span>{{ category.name }}</span>
                <span>{{ selectedComponents[category.id] ? '₱' + formatPrice(selectedComponents[category.id].price) : '₱0.00' }}</span>
              </div>
              <hr>
              <div class="total-price">
                <span>Total</span>
                <span>₱{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>
            
            <div class="build-actions">
              <button @click="saveBuild" class="btn btn-outline" :disabled="completedComponents === 0">
                <i class="fas fa-save"></i>
                Save Build
              </button>
              <button @click="addBuildToCart" class="btn btn-primary" :disabled="!isCompatible || completedComponents === 0">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
            </div>
            
            <button @click="clearBuild" class="btn btn-secondary clear-btn">
              <i class="fas fa-trash"></i>
              Clear Build
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuildPc',
  data() {
    return {
      activeCategory: null,
      selectedComponents: {},
      categoryFilters: {
        cpu: 'all',
        motherboard: 'all',
        memory: 'all',
        storage: 'all',
        gpu: 'all',
        psu: 'all',
        case: 'all'
      },
      componentCategories: [
        {
          id: 'cpu',
          name: 'Processor (CPU)',
          description: 'The brain of your computer',
          icon: 'fas fa-microchip',
          required: true
        },
        {
          id: 'motherboard',
          name: 'Motherboard',
          description: 'Connects all components together',
          icon: 'fas fa-memory',
          required: true
        },
        {
          id: 'memory',
          name: 'Memory (RAM)',
          description: 'System memory for multitasking',
          icon: 'fas fa-memory',
          required: true
        },
        {
          id: 'storage',
          name: 'Storage',
          description: 'SSD or HDD for data storage',
          icon: 'fas fa-hdd',
          required: true
        },
        {
          id: 'gpu',
          name: 'Graphics Card',
          description: 'For gaming and graphics work',
          icon: 'fas fa-tv',
          required: false
        },
        {
          id: 'psu',
          name: 'Power Supply',
          description: 'Powers your entire system',
          icon: 'fas fa-plug',
          required: true
        },
        {
          id: 'case',
          name: 'PC Case',
          description: 'Houses all your components',
          icon: 'fas fa-cube',
          required: true
        }
      ],
      availableComponents: {
        cpu: [
          {
            id: 'cpu1',
            name: 'Intel Core i5-12400F',
            specs: '6 Cores, 12 Threads, 2.5GHz Base',
            price: 8500,
            brand: 'intel',
            socket: 'LGA1700'
          },
          {
            id: 'cpu2',
            name: 'AMD Ryzen 5 5600X',
            specs: '6 Cores, 12 Threads, 3.7GHz Base',
            price: 9200,
            brand: 'amd',
            socket: 'AM4'
          }
        ],
        motherboard: [
          {
            id: 'mb1',
            name: 'ASUS PRIME B560M-A',
            specs: 'Micro-ATX, LGA1700, DDR4',
            price: 4500,
            brand: 'asus',
            socket: 'LGA1700'
          },
          {
            id: 'mb2',
            name: 'MSI B450M PRO-VDH MAX',
            specs: 'Micro-ATX, AM4, DDR4',
            price: 3800,
            brand: 'msi',
            socket: 'AM4'
          }
        ],
        memory: [
          {
            id: 'ram1',
            name: 'Corsair Vengeance LPX 16GB',
            specs: 'DDR4-3200, 2x8GB',
            price: 3200,
            brand: 'corsair',
            type: 'DDR4'
          }
        ],
        storage: [
          {
            id: 'ssd1',
            name: 'Samsung 970 EVO Plus 500GB',
            specs: 'NVMe M.2 SSD, 3500MB/s Read',
            price: 3500,
            brand: 'samsung'
          }
        ],
        gpu: [
          {
            id: 'gpu1',
            name: 'NVIDIA RTX 4060',
            specs: '8GB GDDR6, 1080p Gaming',
            price: 18500,
            brand: 'nvidia'
          }
        ],
        psu: [
          {
            id: 'psu1',
            name: 'Corsair CV550',
            specs: '550W, 80+ Bronze',
            price: 2800,
            brand: 'corsair'
          }
        ],
        case: [
          {
            id: 'case1',
            name: 'Cooler Master MasterBox Q300L',
            specs: 'Micro-ATX, Mini-ITX',
            price: 2200,
            brand: 'coolermaster'
          }
        ]
      }
    }
  },
  computed: {
    totalPrice() {
      return Object.values(this.selectedComponents).reduce((total, component) => {
        return total + (component ? component.price : 0)
      }, 0)
    },
    
    progressPercentage() {
      const completedCount = Object.values(this.selectedComponents).filter(component => component !== null).length
      const totalCategories = this.componentCategories.length
      return (completedCount / totalCategories) * 100
    },
    
    availableProducts() {
      if (!this.selectedCategory) return []
      return this.productDatabase[this.selectedCategory] || []
    },
    
    // Performance Analytics
    performanceMetrics() {
      const metrics = {
        computing: 0,      // General Info (Processor)
        rendering: 0,      // Performance (Graphics Card)
        gaming: 0,         // Benchmarks (Gaming Performance)
        memory: 0,         // Memory (RAM/Storage)
        features: 0,       // Features (Connectivity)
        power: 0          // Power Supply
      }
      
      // Calculate performance based on selected components
      const categoryMap = {
        cpu: ['computing', 'gaming'],        // Processor affects both
        gpu: ['rendering', 'gaming'],        // Graphics Card affects both
        memory: ['memory', 'features'],      // Memory affects both
        storage: ['memory', 'features'],     // Storage affects both
        psu: ['power'],                      // Power Supply
        motherboard: ['features']           // Motherboard affects features
      }
      
      const priceRanges = {
        computing: { low: 3000, high: 25000 },
        rendering: { low: 4000, high: 35000 },
        gaming: { low: 5000, high: 40000 },
        memory: { low: 1000, high: 8000 },
        features: { low: 2000, high: 15000 },
        power: { low: 2000, high: 10000 }
      }
      
      Object.keys(this.selectedComponents).forEach((categoryId) => {
        const component = this.selectedComponents[categoryId]
        if (component && categoryMap[categoryId]) {
          categoryMap[categoryId].forEach(metricCategory => {
            if (priceRanges[metricCategory]) {
              const range = priceRanges[metricCategory]
              const normalizedScore = Math.min((component.price - range.low) / (range.high - range.low), 1) * 100
              metrics[metricCategory] = Math.max(metrics[metricCategory], Math.max(normalizedScore, 0))
            }
          })
        }
      })
      
      return metrics
    },
    
    performancePolygon() {
      const metrics = this.performanceMetrics
      
      // Convert metrics to hexagon points (6 sides like versus.com)
      const scale = (value) => {
        const center = 250
        const maxRadius = 120
        const minRadius = 40
        const radius = minRadius + (maxRadius - minRadius) * (value / 100)
        return radius
      }
      
      // Hexagon points (6 sides)
      const angles = [
        -Math.PI/2,     // Top (GENERAL INFO)
        -Math.PI/6,     // Top Right (PERFORMANCE) 
        Math.PI/6,      // Bottom Right (BENCHMARKS)
        Math.PI/2,      // Bottom (MEMORY)
        5*Math.PI/6,    // Bottom Left (FEATURES)
        7*Math.PI/6     // Top Left (POWER)
      ]
      
      const values = [
        metrics.computing,  // GENERAL INFO
        metrics.rendering,  // PERFORMANCE  
        metrics.gaming,     // BENCHMARKS
        metrics.memory,     // MEMORY
        metrics.features,   // FEATURES
        metrics.power       // POWER
      ]
      
      const points = angles.map((angle, index) => {
        const radius = scale(values[index] || 0)
        const x = 250 + radius * Math.cos(angle)
        const y = 250 + radius * Math.sin(angle)
        return `${x},${y}`
      })
      
      return points.join(' ')
    },
    
    overallPerformance() {
      const metrics = this.performanceMetrics
      const scores = Object.values(metrics)
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
      return Math.round(average)
    },
    
    performanceLabel() {
      const performance = this.overallPerformance
      if (performance < 30) return 'Entry Level'
      if (performance < 60) return 'Mid Range'
      if (performance < 85) return 'High Performance'
      return 'Enthusiast'
    },
    
    isCompatible() {
      return this.compatibilityWarnings.length === 0
    },
    // ...
    
    compatibilityWarnings() {
      const warnings = []
      
      // Check CPU and Motherboard socket compatibility
      if (this.selectedComponents.cpu && this.selectedComponents.motherboard) {
        if (this.selectedComponents.cpu.socket !== this.selectedComponents.motherboard.socket) {
          warnings.push('CPU and Motherboard socket mismatch')
        }
      }
      
      // Check if required components are missing
      const requiredCategories = this.componentCategories.filter(cat => cat.required)
      requiredCategories.forEach(category => {
        if (!this.selectedComponents[category.id]) {
          warnings.push(`${category.name} is required`)
        }
      })
      
      return warnings
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    toggleCategory(categoryId) {
      this.activeCategory = this.activeCategory === categoryId ? null : categoryId
    },
    
    getFilteredComponents(categoryId) {
      const components = this.availableComponents[categoryId] || []
      const filter = this.categoryFilters[categoryId]
      
      if (filter === 'all') {
        return components
      }
      
      return components.filter(component => component.brand === filter)
    },
    
    selectComponent(categoryId, component) {
      this.$set(this.selectedComponents, categoryId, component)
    },
    
    saveBuild() {
      const selectedValues = Object.values(this.selectedComponents).filter(comp => comp !== null)
      if (selectedValues.length === 0) {
        alert('Please select at least one component before saving!')
        return
      }
      
      const build = {
        id: Date.now(),
        components: { ...this.selectedComponents },
        total: this.totalPrice,
        name: 'Custom Build ' + new Date().toLocaleDateString()
      }
      
      // Add all selected components to cart
      Object.values(this.selectedComponents).forEach(component => {
        if (component) {
          this.$store.commit('addToCart', component)
        }
      })
      
      alert('Build saved and components added to cart!')
    },
    
    addBuildToCart() {
      if (!this.isCompatible) {
        alert('Please resolve compatibility issues before adding to cart.')
        return
      }
      
      // Add all selected components to cart
      Object.values(this.selectedComponents).forEach(component => {
        this.$store.commit('addToCart', component)
      })
      
      alert('All components added to cart!')
      this.$router.push('/cart')
    },
    
    clearBuild() {
      if (confirm('Are you sure you want to clear this build?')) {
        this.selectedComponents = {}
        this.activeCategory = null
      }
    }
  }
}
</script>

<style scoped>
.build-pc {
  padding: 2rem 0;
  min-height: 100vh;
}

.page-header {
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
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.page-description {
  font-size: 1.25rem;
  color: var(--gray-600);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 500;
}

.build-progress {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-header h3 {
  margin: 0;
  color: var(--gray-800);
}

.estimated-total {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-blue);
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: var(--gray-200);
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-blue-dark));
  transition: width 0.3s ease;
}

.progress-text {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin: 0;
}

.pc-builder {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.component-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.component-category {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.component-category.completed {
  border-color: var(--success);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.category-header:hover {
  background: var(--gray-50);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.category-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--secondary-blue);
  color: var(--primary-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.category-details {
  flex: 1;
}

.category-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--gray-800);
}

.category-description {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.selected-component {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--secondary-blue);
  border-radius: var(--border-radius);
}

.component-name {
  font-weight: 500;
  color: var(--gray-800);
  font-size: 0.875rem;
}

.component-price {
  font-weight: 600;
  color: var(--primary-blue);
  font-size: 0.875rem;
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-status {
  font-size: 1.5rem;
}

.completed-icon {
  color: var(--success);
}

.pending-icon {
  color: var(--gray-300);
}

.select-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--primary-blue);
  background: transparent;
  color: var(--primary-blue);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.select-btn:hover {
  background: var(--primary-blue);
  color: var(--white);
}

.component-options {
  border-top: 1px solid var(--gray-200);
  padding: 1.5rem;
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.options-header h5 {
  margin: 0;
  color: var(--gray-800);
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.component-option {
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.component-option:hover {
  border-color: var(--primary-blue);
}

.component-option.selected {
  border-color: var(--primary-blue);
  background: var(--secondary-blue);
}

.component-image {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: var(--gray-50);
  flex-shrink: 0;
}

.component-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.component-info {
  flex: 1;
}

.component-info .component-name {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--gray-800);
}

.component-specs {
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
}

.component-info .component-price {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-blue);
}

.component-select {
  font-size: 1.25rem;
  color: var(--primary-blue);
}

.build-summary {
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

.compatibility-check {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: var(--border-radius);
}

.compatibility-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.compatibility-status.compatible {
  color: var(--success);
  background: rgba(40, 167, 69, 0.1);
}

.compatibility-status.incompatible {
  color: var(--danger);
  background: rgba(220, 53, 69, 0.1);
}

.compatibility-warnings {
  margin-top: 0.75rem;
}

.compatibility-warnings ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--danger);
  font-size: 0.875rem;
}

.price-breakdown {
  margin-bottom: 1.5rem;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--gray-600);
}

.total-price {
  display: flex;
  justify-content: space-between;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-top: 0.75rem;
}

.build-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.build-actions .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-weight: 600;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .pc-builder {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .build-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .component-grid {
    grid-template-columns: 1fr;
  }
  
  .category-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .category-actions {
    align-self: stretch;
    justify-content: space-between;
  }
}

@media (max-width: 576px) {
  .build-pc {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .progress-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .component-option {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .component-image {
    width: 50px;
    height: 50px;
  }
  
  .category-header {
    padding: 1rem;
  }
  
  .component-options {
    padding: 1rem;
  }
}

/* iPhone 14 Pro Max (430px width) */
@media (max-width: 430px) {
  .build-pc {
    padding: 0.75rem 0;
  }
  
  .page-header {
    padding: 1.5rem 0.75rem;
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-description {
    font-size: 0.95rem;
    padding: 0 0.25rem;
  }
  
  .build-progress {
    padding: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .progress-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .estimated-total {
    font-size: 1rem;
  }
  
  .pc-builder {
    gap: 1rem;
  }
  
  .build-summary {
    order: -1;
  }
  
  .summary-card {
    padding: 1rem;
  }
  
  .component-category {
    margin-bottom: 0.75rem;
  }
  
  .category-header {
    padding: 1rem 0.75rem;
  }
  
  .category-name {
    font-size: 1rem;
  }
  
  .category-description {
    font-size: 0.8rem;
  }
  
  .component-options {
    padding: 0.75rem;
  }
  
  .component-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .component-option {
    padding: 0.75rem;
    flex-direction: row;
    text-align: left;
    gap: 0.75rem;
  }
  
  .component-image {
    width: 45px;
    height: 45px;
  }
  
  .component-info .component-name {
    font-size: 0.8rem;
  }
  
  .component-specs {
    font-size: 0.7rem;
  }
  
  .component-price {
    font-size: 0.8rem;
  }
  
  .build-actions {
    gap: 0.5rem;
  }
  
  .build-actions .btn {
    padding: 0.625rem;
    font-size: 0.85rem;
  }
}

/* PC Builder Diagram Styles */
.pc-builder-diagram {
  background: linear-gradient(135deg, #f8faff 0%, #e8f0ff 100%);
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(91, 126, 255, 0.1);
  border: 1px solid rgba(91, 126, 255, 0.1);
}

.performance-chart {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(91, 126, 255, 0.1);
}

.performance-header {
  margin-bottom: 2rem;
}

.performance-header h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.performance-subtitle {
  color: var(--gray-600);
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

/* Performance Analytics Styles */
.performance-pentagon {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.pentagon-chart {
  width: 400px;
  height: 400px;
  filter: drop-shadow(0 4px 12px rgba(91, 126, 255, 0.1));
}

.pentagon-bg {
  fill: rgba(240, 242, 247, 0.8);
  stroke: rgba(200, 206, 218, 0.6);
  stroke-width: 2;
}

.performance-overlay {
  fill: url(#performanceGradient);
  stroke: var(--primary-blue);
  stroke-width: 3;
  opacity: 0.9;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(91, 126, 255, 0.3));
}

.grid-lines .grid-line {
  fill: none;
  stroke: rgba(91, 126, 255, 0.2);
  stroke-width: 1;
}

.chart-label {
  fill: var(--gray-700);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-sub {
  fill: var(--gray-500);
  font-size: 9px;
  font-weight: 500;
  text-transform: lowercase;
  letter-spacing: 0.2px;
}

.performance-indicator {
  margin-top: 2rem;
  background: var(--gray-50);
  border-radius: 16px;
  padding: 1.5rem;
}

.performance-bar {
  background: var(--gray-200);
  height: 2.5rem;
  border-radius: 1.25rem;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.performance-level {
  height: 100%;
  background: linear-gradient(90deg, #10B981 0%, #3B82F6 30%, #F59E0B 70%, #EF4444 100%);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 100px;
  box-shadow: 0 2px 8px rgba(91, 126, 255, 0.3);
}

.performance-text {
  color: var(--white);
  font-weight: 600;
  font-size: 0.875rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.performance-range {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--gray-600);
}

.range-label.low {
  color: var(--success);
}

.range-label.mid {
  color: var(--warning);
}

.range-label.high {
  color: var(--danger);
}

@media (max-width: 768px) {
  .pentagon-chart {
    width: 250px;
    height: 250px;
  }
  
  .chart-label {
    font-size: 10px;
  }
}
</style>
