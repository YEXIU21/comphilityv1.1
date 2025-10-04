<template>
  <div class="wishlist">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">My Wishlist</h1>
        <p v-if="wishlistItems.length > 0" class="wishlist-count">{{ wishlistCount }} items saved for later</p>
      </div>

      <!-- Empty Wishlist -->
      <div v-if="wishlistItems.length === 0" class="empty-wishlist">
        <i class="fas fa-heart"></i>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love to review them later</p>
        <router-link to="/" class="btn btn-primary">Start Shopping</router-link>
      </div>

      <!-- Wishlist Content -->
      <div v-else class="wishlist-content">
        <div class="wishlist-actions">
          <div class="actions-left">
            <button @click="selectAll" class="btn btn-outline">
              {{ allSelected ? 'Deselect All' : 'Select All' }}
            </button>
            <button 
              v-if="selectedItems.length > 0" 
              @click="addSelectedToCart" 
              class="btn btn-primary"
            >
              Add Selected to Cart ({{ selectedItems.length }})
            </button>
          </div>
          <div class="actions-right">
            <button @click="clearWishlist" class="btn btn-secondary">
              Clear Wishlist
            </button>
          </div>
        </div>

        <!-- Wishlist Grid -->
        <div class="wishlist-grid">
          <div 
            v-for="item in wishlistItems" 
            :key="item.id" 
            class="wishlist-item"
            :class="{ selected: selectedItems.includes(item.id) }"
          >
            <div class="item-checkbox">
              <input 
                type="checkbox" 
                :value="item.id"
                v-model="selectedItems"
                class="checkbox"
              />
            </div>
            
            <div class="item-image">
              <img 
                :src="getSafeImageUrl(item.image, 'wishlist')" 
                :alt="item.name"
                @error="handleImageError($event, 'wishlist')"
              />
            </div>
            
            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-price">₱{{ formatPrice(item.price) }}</p>
              <div v-if="item.rating" class="item-rating">
                <div class="stars">
                  <i v-for="n in 5" :key="n" :class="getStarClass(n, item.rating)" class="star"></i>
                </div>
                <span class="rating-text">{{ item.rating.toFixed(1) }}</span>
              </div>
              <p v-if="item.category" class="item-category">{{ item.category }}</p>
            </div>
            
            <div class="item-actions">
              <button @click="addToCart(item)" class="btn btn-primary add-to-cart-btn">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
              <button @click="removeFromWishlist(item.id)" class="btn btn-outline remove-btn">
                <i class="fas fa-trash"></i>
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination for large wishlists -->
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import imageFallback from '@/mixins/imageFallback'

export default {
  name: 'Wishlist',
  mixins: [imageFallback],
  data() {
    return {
      selectedItems: [],
      currentPage: 1,
      itemsPerPage: 12
    }
  },
  computed: {
    ...mapState(['wishlist']),
    ...mapGetters(['wishlistCount']),
    
    wishlistItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.wishlist.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.wishlist.length / this.itemsPerPage)
    },
    
    allSelected() {
      return this.wishlistItems.length > 0 && 
             this.selectedItems.length === this.wishlistItems.length
    }
  },
  methods: {
    ...mapMutations(['removeFromWishlist', 'addToCart']),
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    getStarClass(starNumber, rating) {
      if (rating >= starNumber) {
        return 'fas fa-star'
      } else if (rating >= starNumber - 0.5) {
        return 'fas fa-star-half-alt'
      } else {
        return 'far fa-star'
      }
    },
    
    selectAll() {
      if (this.allSelected) {
        this.selectedItems = []
      } else {
        this.selectedItems = this.wishlistItems.map(item => item.id)
      }
    },
    
    addSelectedToCart() {
      const selectedProducts = this.wishlistItems.filter(item => 
        this.selectedItems.includes(item.id)
      )
      
      selectedProducts.forEach(product => {
        this.addToCart(product)
      })
      
      // Remove selected items from wishlist
      this.selectedItems.forEach(itemId => {
        this.removeFromWishlist(itemId)
      })
      
      this.selectedItems = []
      
      // Show success message
      alert(`Added ${selectedProducts.length} items to cart!`)
    },
    
    clearWishlist() {
      if (confirm('Are you sure you want to clear your entire wishlist?')) {
        this.wishlist.forEach(item => {
          this.removeFromWishlist(item.id)
        })
        this.selectedItems = []
      }
    },
    
    changePage(page) {
      this.currentPage = page
      this.selectedItems = []
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style scoped>
.wishlist {
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
  margin-bottom: 0.5rem;
}

.wishlist-count {
  color: var(--gray-600);
  font-size: 1.125rem;
  margin: 0;
}

.empty-wishlist {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gray-500);
}

.empty-wishlist i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
  color: var(--danger);
}

.empty-wishlist h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}

.empty-wishlist p {
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

.wishlist-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.actions-left {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.wishlist-item {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.wishlist-item:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.wishlist-item.selected {
  border-color: var(--primary-blue);
  box-shadow: var(--shadow-lg);
}

.item-checkbox {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.item-image {
  position: relative;
  aspect-ratio: 1;
  background: var(--gray-50);
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  padding: 1rem;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-800);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 0.5rem;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  color: var(--warning);
  font-size: 0.75rem;
}

.rating-text {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-left: 0.25rem;
}

.item-category {
  font-size: 0.875rem;
  color: var(--gray-500);
  margin: 0;
}

.item-actions {
  padding: 1rem;
  border-top: 1px solid var(--gray-100);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-weight: 600;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  color: var(--danger);
  border-color: var(--danger);
}

.remove-btn:hover {
  background: var(--danger);
  color: var(--white);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
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
  
  .wishlist-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .actions-left {
    justify-content: space-between;
  }
  
  .wishlist-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 576px) {
  .wishlist {
    padding: 1rem 0;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .actions-left {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .empty-wishlist {
    padding: 3rem 1rem;
  }
  
  .empty-wishlist i {
    font-size: 3rem;
  }
  
  .empty-wishlist h3 {
    font-size: 1.25rem;
  }
}
</style>
