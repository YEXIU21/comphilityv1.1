<template>
  <div class="pc-cases-page">
    <div class="container">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <i class="fas fa-chevron-right"></i>
          <span class="breadcrumb-current">PC Cases</span>
        </div>
        <h1 class="page-title">PC Cases & Chassis</h1>
        <p class="page-description">Premium PC cases with excellent airflow and build quality</p>
      </div>

      <div class="products-section">
        <div class="products-controls">
          <div class="filter-section">
            <div class="filter-group">
              <label>Form Factor:</label>
              <select v-model="selectedFormFactor" class="filter-select">
                <option value="">All Sizes</option>
                <option value="full-tower">Full Tower</option>
                <option value="mid-tower">Mid Tower</option>
                <option value="mini-itx">Mini-ITX</option>
                <option value="micro-atx">Micro-ATX</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Brand:</label>
              <select v-model="selectedBrand" class="filter-select">
                <option value="">All Brands</option>
                <option value="corsair">Corsair</option>
                <option value="nzxt">NZXT</option>
                <option value="fractal">Fractal Design</option>
                <option value="coolermaster">Cooler Master</option>
                <option value="lianli">Lian Li</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Features:</label>
              <select v-model="selectedFeature" class="filter-select">
                <option value="">All Features</option>
                <option value="rgb">RGB Lighting</option>
                <option value="tempered-glass">Tempered Glass</option>
                <option value="usb-c">USB-C Port</option>
                <option value="vertical-gpu">Vertical GPU Support</option>
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
          category="pc-cases"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'

export default {
  name: 'PcCases',
  components: {
    ProductGrid
  },
  data() {
    return {
      loading: false,
      selectedFormFactor: '',
      selectedBrand: '',
      selectedFeature: '',
      sortBy: 'name',
      products: [
        {
          id: 'case1',
          name: 'Corsair 4000D Airflow Mid Tower',
          price: 109.99,
          originalPrice: 129.99,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          reviews: 1234,
          brand: 'corsair',
          formFactor: 'mid-tower',
          features: ['tempered-glass', 'usb-c'],
          inStock: true,
          sale: true
        },
        {
          id: 'case2',
          name: 'NZXT H710 Mid Tower RGB',
          price: 159.99,
          image: '/api/placeholder/300/300',
          rating: 4.7,
          reviews: 567,
          brand: 'nzxt',
          formFactor: 'mid-tower',
          features: ['rgb', 'tempered-glass'],
          inStock: true
        },
        {
          id: 'case3',
          name: 'Fractal Design Define 7 Full Tower',
          price: 179.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 423,
          brand: 'fractal',
          formFactor: 'full-tower',
          features: ['tempered-glass'],
          inStock: true
        },
        {
          id: 'case4',
          name: 'Lian Li PC-O11 Dynamic Mini',
          price: 119.99,
          originalPrice: 139.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 789,
          brand: 'lianli',
          formFactor: 'mini-itx',
          features: ['tempered-glass', 'vertical-gpu'],
          inStock: true,
          sale: true
        },
        {
          id: 'case5',
          name: 'Cooler Master MasterBox TD500 Mesh',
          price: 89.99,
          image: '/api/placeholder/300/300',
          rating: 4.6,
          reviews: 345,
          brand: 'coolermaster',
          formFactor: 'mid-tower',
          features: ['rgb', 'tempered-glass'],
          inStock: true
        },
        {
          id: 'case6',
          name: 'NZXT H1 Elite Mini-ITX',
          price: 299.99,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          reviews: 234,
          brand: 'nzxt',
          formFactor: 'mini-itx',
          features: ['tempered-glass', 'usb-c'],
          inStock: true
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products]

      if (this.selectedFormFactor) {
        filtered = filtered.filter(product => product.formFactor === this.selectedFormFactor)
      }

      if (this.selectedBrand) {
        filtered = filtered.filter(product => product.brand === this.selectedBrand)
      }

      if (this.selectedFeature) {
        filtered = filtered.filter(product => product.features.includes(this.selectedFeature))
      }

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
.pc-cases-page {
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
