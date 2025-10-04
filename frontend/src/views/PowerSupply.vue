<template>
  <div class="power-supply-page">
    <div class="container">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <i class="fas fa-chevron-right"></i>
          <span class="breadcrumb-current">Power Supplies</span>
        </div>
        <h1 class="page-title">Power Supplies</h1>
        <p class="page-description">Reliable and efficient power supplies for stable system performance</p>
      </div>

      <div class="products-section">
        <div class="products-controls">
          <div class="filter-section">
            <div class="filter-group">
              <label>Wattage:</label>
              <select v-model="selectedWattage" class="filter-select">
                <option value="">All Wattages</option>
                <option value="500w">500W</option>
                <option value="650w">650W</option>
                <option value="750w">750W</option>
                <option value="850w">850W</option>
                <option value="1000w">1000W+</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Brand:</label>
              <select v-model="selectedBrand" class="filter-select">
                <option value="">All Brands</option>
                <option value="corsair">Corsair</option>
                <option value="evga">EVGA</option>
                <option value="seasonic">Seasonic</option>
                <option value="coolermaster">Cooler Master</option>
                <option value="thermaltake">Thermaltake</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Efficiency:</label>
              <select v-model="selectedEfficiency" class="filter-select">
                <option value="">All Ratings</option>
                <option value="80plus">80 PLUS</option>
                <option value="bronze">80 PLUS Bronze</option>
                <option value="gold">80 PLUS Gold</option>
                <option value="platinum">80 PLUS Platinum</option>
                <option value="titanium">80 PLUS Titanium</option>
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
          category="power-supply"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'

export default {
  name: 'PowerSupply',
  components: {
    ProductGrid
  },
  data() {
    return {
      loading: false,
      selectedWattage: '',
      selectedBrand: '',
      selectedEfficiency: '',
      sortBy: 'name',
      products: [
        {
          id: 'psu1',
          name: 'Corsair RM750x 750W 80 PLUS Gold',
          price: 119.99,
          originalPrice: 139.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 567,
          brand: 'corsair',
          wattage: '750w',
          efficiency: 'gold',
          inStock: true,
          sale: true
        },
        {
          id: 'psu2',
          name: 'EVGA SuperNOVA 850 G5 850W Gold',
          price: 159.99,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          reviews: 423,
          brand: 'evga',
          wattage: '850w',
          efficiency: 'gold',
          inStock: true
        },
        {
          id: 'psu3',
          name: 'Seasonic Focus GX-650 650W Gold',
          price: 99.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 789,
          brand: 'seasonic',
          wattage: '650w',
          efficiency: 'gold',
          inStock: true
        },
        {
          id: 'psu4',
          name: 'Cooler Master MWE Gold 750W',
          price: 89.99,
          originalPrice: 109.99,
          image: '/api/placeholder/300/300',
          rating: 4.6,
          reviews: 234,
          brand: 'coolermaster',
          wattage: '750w',
          efficiency: 'gold',
          inStock: true,
          sale: true
        },
        {
          id: 'psu5',
          name: 'Thermaltake Toughpower GF1 1000W Gold',
          price: 189.99,
          image: '/api/placeholder/300/300',
          rating: 4.7,
          reviews: 156,
          brand: 'thermaltake',
          wattage: '1000w',
          efficiency: 'gold',
          inStock: true
        },
        {
          id: 'psu6',
          name: 'Corsair AX1000 1000W 80 PLUS Titanium',
          price: 299.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 98,
          brand: 'corsair',
          wattage: '1000w',
          efficiency: 'titanium',
          inStock: true
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products]

      if (this.selectedWattage) {
        filtered = filtered.filter(product => product.wattage === this.selectedWattage)
      }

      if (this.selectedBrand) {
        filtered = filtered.filter(product => product.brand === this.selectedBrand)
      }

      if (this.selectedEfficiency) {
        filtered = filtered.filter(product => product.efficiency === this.selectedEfficiency)
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
.power-supply-page {
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
