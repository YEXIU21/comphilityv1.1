<template>
  <div class="product-management">
    <!-- Header Controls -->
    <div class="controls-header">
      <button class="create-btn" @click="navigateToCreate">
        <i class="fas fa-plus-circle"></i>
        Create New
      </button>
      
      <div class="filter-controls">
        <div class="filter-dropdown">
          <button class="filter-btn" @click="toggleSort">
            {{ sortLabel }}
            <i class="fas fa-chevron-down"></i>
          </button>
          <div v-if="showSortMenu" class="dropdown-menu">
            <a @click="setSortBy('lastAdded')">Last Added</a>
            <a @click="setSortBy('name')">Name</a>
            <a @click="setSortBy('price')">Price</a>
          </div>
        </div>
        
        <div class="filter-dropdown">
          <button class="filter-btn" @click="toggleCategory">
            {{ categoryLabel }}
            <i class="fas fa-chevron-down"></i>
          </button>
          <div v-if="showCategoryMenu" class="dropdown-menu">
            <a @click="setCategory('all')">All Categories</a>
            <a @click="setCategory('processor')">Processor</a>
            <a @click="setCategory('motherboard')">Motherboard</a>
            <a @click="setCategory('memory')">Memory</a>
            <a @click="setCategory('graphics')">Graphics Card</a>
            <a @click="setCategory('storage')">Storage</a>
            <a @click="setCategory('monitor')">Monitor</a>
            <a @click="setCategory('mouse')">Mouse</a>
            <a @click="setCategory('keyboard')">Keyboard</a>
            <a @click="setCategory('laptops')">Laptops</a>
            <a @click="setCategory('pc-sets')">PC Sets</a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Category Title -->
    <h2 v-if="selectedCategory !== 'all'" class="category-title">
      {{ selectedCategory.toUpperCase() }}
    </h2>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading products...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="loadProducts" class="retry-btn">Retry</button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="empty-state">
      <i class="fas fa-box-open"></i>
      <p>No products found</p>
      <button @click="navigateToCreate" class="create-btn">Create First Product</button>
    </div>
    
    <!-- Products Grid -->
    <div v-else class="products-grid">
      <div class="product-card" v-for="product in filteredProducts" :key="product.id">
        <div class="product-image">
          <img 
            :src="getImageUrl(product.image)" 
            :alt="product.name"
            @error="handleImageError"
          />
        </div>
        
        <div class="product-details">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-price">₱{{ formatPrice(product.price) }}</p>
          <p class="product-stock">Stock: {{ product.stock }}</p>
          <p class="product-category">{{ product.category }}</p>
          
          <div class="product-actions">
            <button class="action-btn edit" @click="editProduct(product)">
              <i class="fas fa-edit"></i>
              Edit
            </button>
            <button class="action-btn delete" @click="confirmDelete(product)">
              <i class="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="pagination">
      <button class="page-btn" @click="previousPage" :disabled="currentPage === 1">
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <button 
        v-for="page in visiblePages" 
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      
      <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal delete-modal" @click.stop>
        <h2>Are You Sure?</h2>
        <p>You Want to Delete this Product?</p>
        
        <div class="modal-actions">
          <button class="btn-confirm" @click="deleteProduct">YES</button>
          <button class="btn-cancel" @click="cancelDelete">NO</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productService } from '@/services/productService'

export default {
  name: 'ProductManagement',
  data() {
    return {
      products: [],
      currentPage: 1,
      itemsPerPage: 9,
      totalProducts: 0,
      selectedCategory: 'all',
      sortBy: 'lastAdded',
      showSortMenu: false,
      showCategoryMenu: false,
      showDeleteModal: false,
      showCreateModal: false,
      productToDelete: null,
      loading: false,
      error: null
    }
  },
  mounted() {
    console.log('📦 [ProductManagement] Component mounted')
    this.loadProducts()
  },
  computed: {
    filteredProducts() {
      let filtered = this.products
      
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === this.selectedCategory)
      }
      
      // Sort products
      if (this.sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      } else if (this.sortBy === 'price') {
        filtered.sort((a, b) => a.price - b.price)
      }
      
      // Paginate
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      
      return filtered.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage)
    },
    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - 2)
      let end = Math.min(this.totalPages, start + maxVisible - 1)
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    },
    sortLabel() {
      const labels = {
        'lastAdded': 'Last Added',
        'name': 'Name',
        'price': 'Price'
      }
      return labels[this.sortBy] || 'Last Added'
    },
    categoryLabel() {
      return this.selectedCategory === 'all' ? 'Category' : this.selectedCategory
    }
  },
  methods: {
    // Load products from API
    async loadProducts() {
      console.log('🔄 [ProductManagement] Loading products...')
      console.log('📊 [ProductManagement] Filters:', {
        category: this.selectedCategory,
        page: this.currentPage,
        limit: this.itemsPerPage
      })
      
      this.loading = true
      this.error = null
      
      try {
        const params = {
          page: this.currentPage,
          limit: this.itemsPerPage
        }
        
        if (this.selectedCategory !== 'all') {
          params.category = this.selectedCategory
        }
        
        const result = await productService.getProducts(params)
        
        if (result.success) {
          this.products = result.data.products || []
          this.totalProducts = result.data.pagination?.total || 0
          
          console.log('✅ [ProductManagement] Products loaded successfully')
          console.log('📦 [ProductManagement] Total products:', this.totalProducts)
          console.log('📦 [ProductManagement] Products on this page:', this.products.length)
          console.log('📦 [ProductManagement] Products data:', this.products)
        } else {
          this.error = result.message
          console.error('❌ [ProductManagement] Failed to load products:', result.message)
        }
      } catch (error) {
        this.error = 'Failed to load products'
        console.error('❌ [ProductManagement] Error loading products:', error)
      } finally {
        this.loading = false
        console.log('🏁 [ProductManagement] Loading finished')
      }
    },
    
    toggleSort() {
      this.showSortMenu = !this.showSortMenu
      this.showCategoryMenu = false
    },
    toggleCategory() {
      this.showCategoryMenu = !this.showCategoryMenu
      this.showSortMenu = false
    },
    setSortBy(sort) {
      console.log('🔀 [ProductManagement] Sort changed to:', sort)
      this.sortBy = sort
      this.showSortMenu = false
    },
    setCategory(category) {
      console.log('📁 [ProductManagement] Category changed to:', category)
      this.selectedCategory = category
      this.showCategoryMenu = false
      this.currentPage = 1
      this.loadProducts()
    },
    navigateToCreate() {
      console.log('➕ [ProductManagement] Navigating to create product page')
      this.$router.push('/admin/products/create')
    },
    editProduct(product) {
      console.log('✏️ [ProductManagement] Editing product:', product.id, product.name)
      this.$router.push(`/admin/products/edit/${product.id}`)
    },
    confirmDelete(product) {
      console.log('⚠️ [ProductManagement] Delete confirmation for:', product.id, product.name)
      this.productToDelete = product
      this.showDeleteModal = true
    },
    async deleteProduct() {
      if (!this.productToDelete) return
      
      console.log('🗑️ [ProductManagement] Deleting product:', this.productToDelete.id, this.productToDelete.name)
      
      try {
        const result = await productService.deleteProduct(this.productToDelete.id)
        
        if (result.success) {
          console.log('✅ [ProductManagement] Product deleted successfully')
          
          // Remove from local array
          const index = this.products.findIndex(p => p.id === this.productToDelete.id)
          if (index > -1) {
            this.products.splice(index, 1)
            console.log('✅ [ProductManagement] Product removed from list')
          }
          
          // Reload products to get updated list
          await this.loadProducts()
        } else {
          console.error('❌ [ProductManagement] Failed to delete product:', result.message)
          alert('Error: ' + result.message)
        }
      } catch (error) {
        console.error('❌ [ProductManagement] Error deleting product:', error)
        alert('Error deleting product')
      } finally {
        this.showDeleteModal = false
        this.productToDelete = null
      }
    },
    cancelDelete() {
      console.log('❌ [ProductManagement] Delete cancelled')
      this.showDeleteModal = false
      this.productToDelete = null
    },
    goToPage(page) {
      console.log('📄 [ProductManagement] Going to page:', page)
      this.currentPage = page
      this.loadProducts()
    },
    previousPage() {
      if (this.currentPage > 1) {
        console.log('⬅️ [ProductManagement] Previous page')
        this.currentPage--
        this.loadProducts()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        console.log('➡️ [ProductManagement] Next page')
        this.currentPage++
        this.loadProducts()
      }
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    getImageUrl(imagePath) {
      console.log('🔍 [ProductManagement] getImageUrl called with:', imagePath)
      
      if (!imagePath) {
        console.warn('⚠️ [ProductManagement] No image path provided')
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
      }
      
      // If it's already a full URL, return it
      if (imagePath.startsWith('http')) {
        console.log('🔗 [ProductManagement] Image is full URL:', imagePath)
        return imagePath
      }
      
      // Get base URL without /api suffix for images
      // Images are served at root level, not under /api
      const apiBaseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api'
      const baseURL = apiBaseURL.replace('/api', '')
      const fullUrl = `${baseURL}${imagePath}`
      console.log('🖼️ [ProductManagement] Constructed image URL:', fullUrl)
      console.log('   - API Base URL:', apiBaseURL)
      console.log('   - Image Base URL:', baseURL)
      console.log('   - Image Path:', imagePath)
      console.log('   - Full URL:', fullUrl)
      return fullUrl
    },
    handleImageError(event) {
      console.error('❌ [ProductManagement] Image failed to load:', event.target.src)
      console.error('   - Current src:', event.target.src)
      console.error('   - Image element:', event.target)
      // Use SVG data URI as fallback
      event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Not Found%3C/text%3E%3C/svg%3E'
      event.target.onerror = null // Prevent infinite loop
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  created() {
    this.handleClickOutside = (e) => {
      if (!e.target.closest('.filter-dropdown')) {
        this.showSortMenu = false
        this.showCategoryMenu = false
      }
    }
    document.addEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.product-management {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Controls */
.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #5b7eff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background: #4a6eef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 126, 255, 0.3);
}

.filter-controls {
  display: flex;
  gap: 15px;
}

.filter-dropdown {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid #5b7eff;
  color: #5b7eff;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #5b7eff;
  color: white;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-menu a {
  display: block;
  padding: 10px 16px;
  color: #333;
  cursor: pointer;
  transition: background 0.3s ease;
}

.dropdown-menu a:hover {
  background: #f5f5f5;
}

/* Category Title */
.category-title {
  font-size: 1.5rem;
  color: #5b7eff;
  margin-bottom: 20px;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

/* Loading, Error, Empty States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-state i,
.error-state i,
.empty-state i {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #5b7eff;
}

.loading-state i {
  color: #5b7eff;
}

.error-state i {
  color: #ff5b5b;
}

.empty-state i {
  color: #999;
}

.loading-state p,
.error-state p,
.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 10px 24px;
  background: #5b7eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.retry-btn:hover {
  background: #4a6eef;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  padding: 20px;
}

.product-name {
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
  line-height: 1.4;
}

.product-price {
  font-size: 1.3rem;
  color: #5b7eff;
  font-weight: bold;
  margin-bottom: 15px;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn.edit {
  background: #e3f2fd;
  color: #2196f3;
}

.action-btn.edit:hover {
  background: #2196f3;
  color: white;
}

.action-btn.delete {
  background: #ffebee;
  color: #f44336;
}

.action-btn.delete:hover {
  background: #f44336;
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #5b7eff;
  background: white;
  color: #5b7eff;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background: #5b7eff;
  color: white;
}

.page-btn.active {
  background: #5b7eff;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Delete Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.delete-modal {
  background: #5b7eff;
  color: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  min-width: 400px;
}

.delete-modal h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.delete-modal p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.modal-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-confirm,
.btn-cancel {
  padding: 12px 50px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm {
  background: white;
  color: #5b7eff;
}

.btn-confirm:hover {
  transform: scale(1.05);
}

.btn-cancel {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-cancel:hover {
  background: white;
  color: #5b7eff;
}

/* Responsive */
@media (max-width: 768px) {
  .controls-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
