<template>
  <div class="laptops">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">LAPTOPS</h1>
        <p class="page-description">
          Discover our extensive collection of gaming laptops, ultrabooks, and professional workstations from top brands.
        </p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Brand:</label>
          <select v-model="brandFilter" @change="applyFilters" class="filter-select">
            <option value="all">All Brands</option>
            <option value="msi">MSI</option>
            <option value="acer">Acer</option>
            <option value="asus">ASUS</option>
            <option value="lenovo">Lenovo</option>
            <option value="hp">HP</option>
            <option value="gigabyte">Gigabyte</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Price Range:</label>
          <select v-model="priceFilter" @change="applyFilters" class="filter-select">
            <option value="all">All Prices</option>
            <option value="under-40k">Under ₱40,000</option>
            <option value="40k-70k">₱40,000 - ₱70,000</option>
            <option value="70k-100k">₱70,000 - ₱100,000</option>
            <option value="above-100k">Above ₱100,000</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Sort by:</label>
          <select v-model="sortBy" @change="applySorting" class="filter-select">
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="brand">Brand</option>
          </select>
        </div>
      </div>

      <!-- Product Grid -->
      <ProductGrid :products="filteredProducts" />

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="changePage(1)" 
          :disabled="currentPage === 1"
          class="page-btn nav-btn"
        >
          <i class="fas fa-angle-double-left"></i>
        </button>
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="page-btn nav-btn"
        >
          <i class="fas fa-angle-left"></i>
        </button>
        
        <button 
          @click="changePage(page)" 
          v-for="page in visiblePages" 
          :key="page"
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
        
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="page-btn nav-btn"
        >
          <i class="fas fa-angle-right"></i>
        </button>
        <button 
          @click="changePage(totalPages)" 
          :disabled="currentPage === totalPages"
          class="page-btn nav-btn"
        >
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'

export default {
  name: 'Laptops',
  components: {
    ProductGrid
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 9,
      sortBy: 'name',
      priceFilter: 'all',
      brandFilter: 'all',
      products: [
        {
          id: 201,
          name: 'MSI Thin A15',
          price: 36995.00,
          image: '/images/msi-thin-a15.jpg',
          rating: 5.0,
          brand: 'msi',
          category: 'Gaming Laptop'
        },
        {
          id: 202,
          name: 'GIGABYTE G5 MF',
          price: 50995.00,
          image: '/images/gigabyte-g5-mf.jpg',
          rating: 5.0,
          brand: 'gigabyte',
          category: 'Gaming Laptop'
        },
        {
          id: 203,
          name: 'MSI CYBORG 15 A12',
          price: 36995.00,
          image: '/images/msi-cyborg-15.jpg',
          rating: 5.0,
          brand: 'msi',
          category: 'Gaming Laptop'
        },
        {
          id: 204,
          name: 'Gigabyte G5 KF5',
          price: 65995.00,
          image: '/images/gigabyte-g5-kf5.jpg',
          rating: 5.0,
          brand: 'gigabyte',
          category: 'Gaming Laptop'
        },
        {
          id: 205,
          name: 'Lenovo V15 G4',
          price: 24995.00,
          image: '/images/lenovo-v15-g4.jpg',
          rating: 5.0,
          brand: 'lenovo',
          category: 'Business Laptop'
        },
        {
          id: 206,
          name: 'Gigabyte G6X',
          price: 69995.00,
          image: '/images/gigabyte-g6x.jpg',
          rating: 5.0,
          brand: 'gigabyte',
          category: 'Gaming Laptop'
        },
        {
          id: 207,
          name: 'Asus Vivobook 15',
          price: 39496.00,
          image: '/images/asus-vivobook-15.jpg',
          rating: 5.0,
          brand: 'asus',
          category: 'Ultrabook'
        },
        {
          id: 208,
          name: 'HP 14',
          price: 29995.00,
          image: '/images/hp-14.jpg',
          rating: 5.0,
          brand: 'hp',
          category: 'Business Laptop'
        },
        {
          id: 209,
          name: 'MSI Cyborg 15 A13VF',
          price: 62995.00,
          image: '/images/msi-cyborg-15-a13vf.jpg',
          rating: 5.0,
          brand: 'msi',
          category: 'Gaming Laptop'
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products]
      
      // Apply brand filter
      if (this.brandFilter !== 'all') {
        filtered = filtered.filter(product => product.brand === this.brandFilter)
      }
      
      // Apply price filter
      if (this.priceFilter !== 'all') {
        filtered = filtered.filter(product => {
          switch (this.priceFilter) {
            case 'under-40k':
              return product.price < 40000
            case '40k-70k':
              return product.price >= 40000 && product.price <= 70000
            case '70k-100k':
              return product.price >= 70000 && product.price <= 100000
            case 'above-100k':
              return product.price > 100000
            default:
              return true
          }
        })
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'brand':
            return a.brand.localeCompare(b.brand)
          case 'name':
          default:
            return a.name.localeCompare(b.name)
        }
      })
      
      return filtered
    },
    
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredProducts.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },
    
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }
  },
  watch: {
    filteredProducts() {
      // Reset to first page when filters change
      this.currentPage = 1
    }
  },
  methods: {
    applySorting() {
      this.currentPage = 1
    },
    
    applyFilters() {
      this.currentPage = 1
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo(0, 0)
      }
    }
  }
}
</script>

<style scoped>
.laptops {
  padding: 3rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-50) 0%, #f0f4ff 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 1rem;
  letter-spacing: 0.025em;
}

.page-description {
  font-size: 1.125rem;
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  font-weight: 600;
  color: var(--gray-700);
  white-space: nowrap;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  background: var(--white);
  color: var(--gray-700);
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
}

.page-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid var(--gray-200);
  background: var(--white);
  color: var(--gray-600);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  color: var(--white);
}

.nav-btn {
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .filters-section {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .filter-select {
    flex: 1;
    min-width: auto;
  }
}

@media (max-width: 576px) {
  .laptops {
    padding: 1rem 0;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .filters-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .page-btn {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.875rem;
  }
}

/* iPhone 14 Pro Max Mobile Responsive */
@media (max-width: 430px) {
  .laptops {
    padding: 0.75rem 0;
  }
  
  .page-header {
    padding: 1.5rem 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-description {
    font-size: 0.9rem;
  }
  
  .filters-section {
    padding: 0.75rem;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .filter-group {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
