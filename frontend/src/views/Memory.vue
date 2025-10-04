<template>
  <div class="memory-page">
    <div class="container">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <i class="fas fa-chevron-right"></i>
          <span class="breadcrumb-current">Memory & RAM</span>
        </div>
        <h1 class="page-title">Memory & RAM</h1>
        <p class="page-description">High-performance memory modules for gaming, workstations, and everyday computing</p>
      </div>

      <div class="products-section">
        <div class="products-controls">
          <div class="filter-section">
            <div class="filter-group">
              <label>Brand:</label>
              <select v-model="selectedBrand" class="filter-select">
                <option value="">All Brands</option>
                <option value="corsair">Corsair</option>
                <option value="gskill">G.Skill</option>
                <option value="kingston">Kingston</option>
                <option value="crucial">Crucial</option>
                <option value="teamgroup">Team Group</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Capacity:</label>
              <select v-model="selectedCapacity" class="filter-select">
                <option value="">All Capacities</option>
                <option value="8gb">8GB</option>
                <option value="16gb">16GB</option>
                <option value="32gb">32GB</option>
                <option value="64gb">64GB</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Speed:</label>
              <select v-model="selectedSpeed" class="filter-select">
                <option value="">All Speeds</option>
                <option value="2400">DDR4-2400</option>
                <option value="2666">DDR4-2666</option>
                <option value="3200">DDR4-3200</option>
                <option value="3600">DDR4-3600</option>
                <option value="4000">DDR4-4000</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Sort by:</label>
              <select v-model="sortBy" class="filter-select">
                <option value="name">Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        <ProductGrid 
          :products="filteredProducts" 
          :loading="loading"
          category="memory"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'

export default {
  name: 'Memory',
  components: {
    ProductGrid
  },
  data() {
    return {
      loading: false,
      selectedBrand: '',
      selectedCapacity: '',
      selectedSpeed: '',
      sortBy: 'name',
      products: [
        {
          id: 'mem1',
          name: 'Corsair Vengeance LPX 16GB DDR4-3200',
          price: 75.99,
          originalPrice: 89.99,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          reviews: 324,
          brand: 'corsair',
          capacity: '16gb',
          speed: '3200',
          inStock: true,
          sale: true
        },
        {
          id: 'mem2',
          name: 'G.Skill Ripjaws V 32GB DDR4-3600',
          price: 149.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 198,
          brand: 'gskill',
          capacity: '32gb',
          speed: '3600',
          inStock: true
        },
        {
          id: 'mem3',
          name: 'Kingston Fury Beast 16GB DDR4-3200',
          price: 68.99,
          image: '/api/placeholder/300/300',
          rating: 4.7,
          reviews: 256,
          brand: 'kingston',
          capacity: '16gb',
          speed: '3200',
          inStock: true
        },
        {
          id: 'mem4',
          name: 'Crucial Ballistix 32GB DDR4-3600',
          price: 139.99,
          originalPrice: 159.99,
          image: '/api/placeholder/300/300',
          rating: 4.6,
          reviews: 142,
          brand: 'crucial',
          capacity: '32gb',
          speed: '3600',
          inStock: true,
          sale: true
        },
        {
          id: 'mem5',
          name: 'Team T-Force Vulcan Z 16GB DDR4-3200',
          price: 59.99,
          image: '/api/placeholder/300/300',
          rating: 4.5,
          reviews: 189,
          brand: 'teamgroup',
          capacity: '16gb',
          speed: '3200',
          inStock: true
        },
        {
          id: 'mem6',
          name: 'Corsair Dominator Platinum RGB 32GB DDR4-4000',
          price: 299.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 87,
          brand: 'corsair',
          capacity: '32gb',
          speed: '4000',
          inStock: true
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products]

      // Filter by brand
      if (this.selectedBrand) {
        filtered = filtered.filter(product => product.brand === this.selectedBrand)
      }

      // Filter by capacity
      if (this.selectedCapacity) {
        filtered = filtered.filter(product => product.capacity === this.selectedCapacity)
      }

      // Filter by speed
      if (this.selectedSpeed) {
        filtered = filtered.filter(product => product.speed === this.selectedSpeed)
      }

      // Sort products
      if (this.sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price)
      } else if (this.sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price)
      } else if (this.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating)
      } else {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      }

      return filtered
    }
  }
}
</script>

<style scoped>
.memory-page {
  min-height: 100vh;
  background: var(--gray-50);
  padding: 2rem 0;
}

.page-header {
  background: var(--white);
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--gray-600);
}

.breadcrumb-link {
  color: var(--primary-blue);
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: 1.125rem;
  color: var(--gray-600);
  max-width: 600px;
}

.products-section {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.products-controls {
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.875rem;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  background: var(--white);
  font-size: 0.875rem;
  min-width: 140px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(91, 126, 255, 0.1);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
    min-width: unset;
  }
}
</style>
