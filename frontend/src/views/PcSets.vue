<template>
  <div class="pc-sets">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">PC SETS</h1>
        <p class="page-description">
          Complete PC bundles ready to use. Choose from our carefully curated selection of gaming and professional workstation setups.
        </p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Sort by:</label>
          <select v-model="sortBy" @change="applySorting" class="filter-select">
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Price Range:</label>
          <select v-model="priceFilter" @change="applyFilters" class="filter-select">
            <option value="all">All Prices</option>
            <option value="under-20k">Under ₱20,000</option>
            <option value="20k-50k">₱20,000 - ₱50,000</option>
            <option value="above-50k">Above ₱50,000</option>
          </select>
        </div>
      </div>

      <!-- Product Grid -->
      <ProductGrid 
        :products="filteredProducts" 
        @product-added="handleProductAdded"
      />

      <!-- Toast Notifications -->
      <Toast
        v-for="(toast, index) in toasts"
        :key="index"
        :title="toast.title"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="removeToast(index)"
        :style="{ top: `${20 + index * 90}px` }"
      />

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="changePage(page)" 
          v-for="page in totalPages" 
          :key="page"
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'
import Toast from '../components/common/Toast.vue'
import { productService } from '@/services/productService'

export default {
  name: 'PcSets',
  components: {
    ProductGrid,
    Toast
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 9,
      sortBy: 'name',
      priceFilter: 'all',
      products: [],
      loading: false,
      error: null,
      toasts: []
    }
  },
  mounted() {
    console.log('📦 [PcSets] Component mounted')
    this.loadProducts()
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products]
      
      // Apply price filter
      if (this.priceFilter !== 'all') {
        filtered = filtered.filter(product => {
          switch (this.priceFilter) {
            case 'under-20k':
              return product.price < 20000
            case '20k-50k':
              return product.price >= 20000 && product.price <= 50000
            case 'above-50k':
              return product.price > 50000
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
          case 'rating':
            return (b.rating || 0) - (a.rating || 0)
          case 'name':
          default:
            return a.name.localeCompare(b.name)
        }
      })
      
      // Apply pagination
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return filtered.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage)
    }
  },
  methods: {
    async loadProducts() {
      console.log('🔄 [PcSets] Loading PC Set products from API...')
      this.loading = true
      this.error = null
      
      try {
        const result = await productService.getProducts({
          category: 'pc-set',
          limit: 100 // Get all pc-set products
        })
        
        if (result.success) {
          this.products = result.data.products || []
          console.log('✅ [PcSets] Products loaded:', this.products.length)
          console.log('📦 [PcSets] Products:', this.products)
        } else {
          this.error = result.message
          console.error('❌ [PcSets] Failed to load products:', result.message)
        }
      } catch (error) {
        this.error = 'Failed to load products'
        console.error('❌ [PcSets] Error loading products:', error)
      } finally {
        this.loading = false
      }
    },
    
    applySorting() {
      console.log('🔀 [PcSets] Sorting changed to:', this.sortBy)
      this.currentPage = 1
    },
    
    applyFilters() {
      console.log('🔍 [PcSets] Filter changed to:', this.priceFilter)
      this.currentPage = 1
    },
    
    changePage(page) {
      console.log('📄 [PcSets] Changing to page:', page)
      this.currentPage = page
      window.scrollTo(0, 0)
    },
    
    handleProductAdded(event) {
      console.log('✅ [PcSets] Product added event received:', event)
      if (event.type === 'cart') {
        console.log('🛒 [PcSets] Product added to cart:', event.product.name)
        this.showToast({
          title: 'Added to Cart!',
          message: `${event.product.name} has been added to your cart.`,
          type: 'success',
          duration: 3000
        })
      } else if (event.type === 'wishlist') {
        console.log('❤️ [PcSets] Product added to wishlist:', event.product.name)
        this.showToast({
          title: 'Added to Wishlist!',
          message: `${event.product.name} has been added to your wishlist.`,
          type: 'success',
          duration: 3000
        })
      }
    },
    
    showToast(toast) {
      this.toasts.push(toast)
    },
    
    removeToast(index) {
      this.toasts.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.pc-sets {
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
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.pagination {
  display: flex;
  justify-content: center;
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
}

.page-btn:hover {
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

.page-btn.active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  color: var(--white);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .filters-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .filter-select {
    flex: 1;
    max-width: 200px;
  }
}

@media (max-width: 576px) {
  .pc-sets {
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
}

/* iPhone 14 Pro Max Mobile Responsive */
@media (max-width: 430px) {
  .pc-sets {
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
  
  .category-section {
    margin-bottom: 2rem;
  }
  
  .section-header {
    padding: 0 0.75rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
}
</style>
