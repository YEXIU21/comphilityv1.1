<template>
  <div class="peripherals-page">
    <div class="container">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <i class="fas fa-chevron-right"></i>
          <span class="breadcrumb-current">Peripherals</span>
        </div>
        <h1 class="page-title">Computer Peripherals</h1>
        <p class="page-description">Gaming mice, keyboards, monitors, and accessories to enhance your setup</p>
      </div>

      <div class="products-section">
        <div class="products-controls">
          <div class="filter-section">
            <div class="filter-group">
              <label>Category:</label>
              <select v-model="selectedCategory" class="filter-select">
                <option value="">All Categories</option>
                <option value="mouse">Mouse</option>
                <option value="keyboard">Keyboard</option>
                <option value="monitor">Monitor</option>
                <option value="headset">Headset</option>
                <option value="speaker">Speaker</option>
                <option value="webcam">Webcam</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Brand:</label>
              <select v-model="selectedBrand" class="filter-select">
                <option value="">All Brands</option>
                <option value="logitech">Logitech</option>
                <option value="razer">Razer</option>
                <option value="corsair">Corsair</option>
                <option value="steelseries">SteelSeries</option>
                <option value="asus">ASUS</option>
                <option value="lg">LG</option>
                <option value="samsung">Samsung</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Price Range:</label>
              <select v-model="selectedPriceRange" class="filter-select">
                <option value="">All Prices</option>
                <option value="under50">Under $50</option>
                <option value="50to100">$50 - $100</option>
                <option value="100to200">$100 - $200</option>
                <option value="over200">Over $200</option>
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
          category="peripherals"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'

export default {
  name: 'Peripherals',
  components: {
    ProductGrid
  },
  data() {
    return {
      loading: false,
      selectedCategory: '',
      selectedBrand: '',
      selectedPriceRange: '',
      sortBy: 'name',
      products: [
        {
          id: 'periph1',
          name: 'Logitech MX Master 3S Wireless Mouse',
          price: 99.99,
          originalPrice: 119.99,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          reviews: 1456,
          brand: 'logitech',
          category: 'mouse',
          inStock: true,
          sale: true
        },
        {
          id: 'periph2',
          name: 'Razer BlackWidow V4 Mechanical Keyboard',
          price: 169.99,
          image: '/api/placeholder/300/300',
          rating: 4.7,
          reviews: 892,
          brand: 'razer',
          category: 'keyboard',
          inStock: true
        },
        {
          id: 'periph3',
          name: 'ASUS TUF Gaming VG27AQ 27" 1440p Monitor',
          price: 299.99,
          originalPrice: 329.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 634,
          brand: 'asus',
          category: 'monitor',
          inStock: true,
          sale: true
        },
        {
          id: 'periph4',
          name: 'Corsair HS80 RGB Wireless Gaming Headset',
          price: 149.99,
          image: '/api/placeholder/300/300',
          rating: 4.6,
          reviews: 423,
          brand: 'corsair',
          category: 'headset',
          inStock: true
        },
        {
          id: 'periph5',
          name: 'Logitech Z623 2.1 Speaker System',
          price: 89.99,
          image: '/api/placeholder/300/300',
          rating: 4.5,
          reviews: 567,
          brand: 'logitech',
          category: 'speaker',
          inStock: true
        },
        {
          id: 'periph6',
          name: 'Razer DeathAdder V3 Pro Gaming Mouse',
          price: 129.99,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          reviews: 756,
          brand: 'razer',
          category: 'mouse',
          inStock: true
        },
        {
          id: 'periph7',
          name: 'LG 27GP950-B 27" 4K Gaming Monitor',
          price: 549.99,
          originalPrice: 599.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 234,
          brand: 'lg',
          category: 'monitor',
          inStock: true,
          sale: true
        },
        {
          id: 'periph8',
          name: 'SteelSeries Arctis 7P Wireless Headset',
          price: 119.99,
          image: '/api/placeholder/300/300',
          rating: 4.7,
          reviews: 345,
          brand: 'steelseries',
          category: 'headset',
          inStock: true
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products]

      if (this.selectedCategory) {
        filtered = filtered.filter(product => product.category === this.selectedCategory)
      }

      if (this.selectedBrand) {
        filtered = filtered.filter(product => product.brand === this.selectedBrand)
      }

      if (this.selectedPriceRange) {
        filtered = filtered.filter(product => {
          const price = product.price
          switch (this.selectedPriceRange) {
            case 'under50': return price < 50
            case '50to100': return price >= 50 && price <= 100
            case '100to200': return price >= 100 && price <= 200
            case 'over200': return price > 200
            default: return true
          }
        })
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
.peripherals-page {
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
