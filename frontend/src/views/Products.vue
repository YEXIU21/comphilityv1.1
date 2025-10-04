<template>
  <div class="products">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">ALL PRODUCTS</h1>
        <p class="page-description">
          Browse our complete catalog of computer components, peripherals, and accessories.
        </p>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery" class="search-results">
        <h3>Search results for: "{{ searchQuery }}"</h3>
        <p>Found {{ filteredProducts.length }} products</p>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">Category:</label>
            <select v-model="categoryFilter" @change="applyFilters" class="filter-select">
              <option value="all">All Categories</option>
              <option value="components">Components</option>
              <option value="peripherals">Peripherals</option>
              <option value="pc-furniture">PC Furniture</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Price Range:</label>
            <select v-model="priceFilter" @change="applyFilters" class="filter-select">
              <option value="all">All Prices</option>
              <option value="under-1k">Under ₱1,000</option>
              <option value="1k-5k">₱1,000 - ₱5,000</option>
              <option value="5k-10k">₱5,000 - ₱10,000</option>
              <option value="above-10k">Above ₱10,000</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Sort by:</label>
            <select v-model="sortBy" @change="applySorting" class="filter-select">
              <option value="name">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
        
        <div class="search-row">
          <div class="search-group">
            <input 
              v-model="localSearchQuery"
              @input="performSearch"
              type="text" 
              placeholder="Search products..." 
              class="search-input"
            />
            <button @click="clearSearch" v-if="localSearchQuery" class="clear-search-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Product Grid -->
      <ProductGrid 
        :products="paginatedProducts" 
        @add-to-cart="addToCart" 
        @toggle-wishlist="toggleWishlist"
        @add-to-comparison="addToComparison"
      />
        
      <!-- Comparison Button -->
      <div v-if="comparisonProducts.length > 0" class="comparison-bar">
        <div class="comparison-info">
          <i class="fas fa-balance-scale"></i>
          <span>{{ comparisonProducts.length }} items to compare</span>
        </div>
        <button @click="showComparison = true" class="btn btn-primary">
          <i class="fas fa-chart-bar"></i>
          Compare Products
        </button>
        <button @click="clearComparison" class="btn btn-outline">
          <i class="fas fa-trash"></i>
          Clear
        </button>
      </div>

      <!-- No Results -->
      <div v-if="filteredProducts.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
        <button @click="clearAllFilters" class="btn btn-primary">Clear All Filters</button>
      </div>

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
    
    <!-- Product Comparison Modal -->
    <ProductComparison
      :showComparison="showComparison"
      :initialProducts="comparisonProducts"
      @close="closeComparison"
    />
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'
import ProductComparison from '../components/common/ProductComparison.vue'

export default {
  name: 'Products',
  components: {
    ProductGrid,
    ProductComparison
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12,
      sortBy: 'name',
      priceFilter: 'all',
      categoryFilter: 'all',
      localSearchQuery: '',
      searchQuery: '',
      comparisonProducts: [],
      showComparison: false,
      products: [
        // Sample products from different categories
        {
          id: 401,
          name: 'Intel Core i5-12400F',
          price: 8500.00,
          image: '/images/intel-i5-12400f.jpg',
          rating: 4.8,
          category: 'components',
          subcategory: 'processor'
        },
        {
          id: 402,
          name: 'ASUS ROG Strix B550-F',
          price: 12500.00,
          image: '/images/asus-rog-b550f.jpg',
          rating: 4.9,
          category: 'components',
          subcategory: 'motherboard'
        },
        {
          id: 403,
          name: 'Corsair Vengeance LPX 16GB',
          price: 3200.00,
          image: '/images/corsair-vengeance-16gb.jpg',
          rating: 4.7,
          category: 'components',
          subcategory: 'memory'
        },
        {
          id: 404,
          name: 'Logitech MX Master 3',
          price: 4500.00,
          image: '/images/logitech-mx-master-3.jpg',
          rating: 4.9,
          category: 'peripherals',
          subcategory: 'mouse'
        },
        {
          id: 405,
          name: 'SteelSeries Apex Pro',
          price: 8900.00,
          image: '/images/steelseries-apex-pro.jpg',
          rating: 4.8,
          category: 'peripherals',
          subcategory: 'keyboard'
        },
        {
          id: 406,
          name: 'ASUS TUF Gaming VG27AQ',
          price: 18500.00,
          image: '/images/asus-tuf-vg27aq.jpg',
          rating: 4.6,
          category: 'peripherals',
          subcategory: 'monitor'
        },
        {
          id: 407,
          name: 'Secretlab Titan Evo 2022',
          price: 25000.00,
          image: '/images/secretlab-titan-evo.jpg',
          rating: 4.8,
          category: 'pc-furniture',
          subcategory: 'chair'
        },
        {
          id: 408,
          name: 'IKEA BEKANT Desk',
          price: 5500.00,
          image: '/images/ikea-bekant-desk.jpg',
          rating: 4.3,
          category: 'pc-furniture',
          subcategory: 'table'
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products]
      
      // Apply search filter
      if (this.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      // Apply category filter
      if (this.categoryFilter !== 'all') {
        filtered = filtered.filter(product => product.category === this.categoryFilter)
      }
      
      // Apply price filter
      if (this.priceFilter !== 'all') {
        filtered = filtered.filter(product => {
          switch (this.priceFilter) {
            case 'under-1k':
              return product.price < 1000
            case '1k-5k':
              return product.price >= 1000 && product.price <= 5000
            case '5k-10k':
              return product.price >= 5000 && product.price <= 10000
            case 'above-10k':
              return product.price > 10000
            default:
              return true
          }
        })
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'name-desc':
            return b.name.localeCompare(a.name)
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
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
      this.currentPage = 1
    },
    
    '$route.query.search': {
      immediate: true,
      handler(newQuery) {
        this.searchQuery = newQuery || ''
        this.localSearchQuery = newQuery || ''
      }
    }
  },
  methods: {
    performSearch() {
      this.searchQuery = this.localSearchQuery
      this.$router.push({ 
        name: 'Products', 
        query: this.localSearchQuery ? { search: this.localSearchQuery } : {} 
      })
    },
    
    clearSearch() {
      this.localSearchQuery = ''
      this.searchQuery = ''
      this.$router.push({ name: 'Products' })
    },
    
    applyFilters() {
      this.currentPage = 1
    },
    
    applySorting() {
      this.currentPage = 1
    },
    
    clearAllFilters() {
      this.categoryFilter = 'all'
      this.priceFilter = 'all'
      this.sortBy = 'name'
      this.localSearchQuery = ''
      this.searchQuery = ''
      this.$router.push({ name: 'Products' })
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo(0, 0)
      }
    },
    
    addToComparison(product) {
      if (this.comparisonProducts.length >= 3) {
        alert('You can only compare up to 3 products at a time.')
        return
      }
      
      if (this.comparisonProducts.find(p => p.id === product.id)) {
        alert('This product is already in your comparison list.')
        return
      }
      
      this.comparisonProducts.push(product)
    },
    
    clearComparison() {
      this.comparisonProducts = []
    },
    
    closeComparison() {
      this.showComparison = false
    }
  }
}
</script>

<style scoped>
.products {
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

.search-results {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--secondary-blue);
  border-radius: var(--border-radius-lg);
  border-left: 4px solid var(--primary-blue);
}

.search-results h3 {
  color: var(--primary-blue);
  margin-bottom: 0.5rem;
}

.search-results p {
  color: var(--gray-600);
  margin: 0;
}

.filters-section {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-row {
  border-top: 1px solid var(--gray-200);
  padding-top: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-group {
  position: relative;
  max-width: 400px;
  width: 100%;
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

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0.25rem;
}

.clear-search-btn:hover {
  color: var(--gray-600);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gray-500);
}

.no-results i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}

.no-results p {
  margin-bottom: 2rem;
  font-size: 1.125rem;
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

.page-btn.nav-btn:hover:not(:disabled) {
  background: var(--primary-blue);
  color: var(--white);
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
  .filter-row {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .filter-row {
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
  .products {
    padding: 1rem 0;
  }
  
  .page-header {
    margin-bottom: 2rem;
    padding: 0 1rem;
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
  
  .filter-row {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .filter-select {
    min-width: unset;
    width: 100%;
  }
  
  .no-results {
    padding: 3rem 1rem;
  }
  
  .no-results i {
    font-size: 3rem;
  }
  
  .no-results h3 {
    font-size: 1.25rem;
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

/* iPhone 14 Pro Max (430px width) - Enhanced Mobile Sizing */
@media (max-width: 430px) {
  .products {
    padding: 1rem 0;
  }
  
  .page-header {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
  }
  
  .page-description {
    font-size: 1.125rem;
    line-height: 1.6;
  }
  
  .filters-section {
    padding: 1.25rem;
    margin-bottom: 2rem;
  }
  
  .search-input {
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    min-height: 48px;
    border-radius: 12px;
  }
  
  .filter-select {
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    min-height: 48px;
    border-radius: 12px;
  }
  
  .filter-label {
    font-size: 1rem;
    font-weight: 600;
  }
}
</style>
