<template>
  <div class="processors">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">PROCESSORS</h1>
        <p class="page-description">
          High-performance processors from AMD and Intel for gaming, productivity, and professional workloads.
        </p>
      </div>

      <!-- Product Grid -->
      <div class="products-grid">
        <div 
          v-for="product in paginatedProducts" 
          :key="product.id"
          class="product-card"
          @click="viewProduct(product.id)"
        >
          <div class="product-image">
            <img 
              :src="getSafeImageUrl(product.image, 'processor')" 
              :alt="product.name"
              @error="handleImageError($event, 'processor')"
            />
            <button @click.stop="toggleWishlist(product)" class="wishlist-btn">
              <i :class="isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
            </button>
          </div>
          
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">₱{{ formatPrice(product.price) }}</div>
            
            <div class="product-actions">
              <button @click.stop="buyNow(product)" class="btn btn-primary buy-btn">
                BUY NOW
              </button>
              <div class="action-icons">
                <button @click.stop="addToCart(product)" class="action-btn cart-btn" title="Add to Cart">
                  <i class="fas fa-shopping-cart"></i>
                </button>
                <button @click.stop="viewProduct(product.id)" class="action-btn view-btn" title="Quick View">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
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
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import imageFallback from '@/mixins/imageFallback'

export default {
  name: 'Processors',
  mixins: [imageFallback],
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 9,
      products: [
        {
          id: 'proc1',
          name: 'AMD Ryzen 5 5600X',
          price: 5715.00,
          image: '/images/amd-ryzen-5600x.jpg',
          brand: 'amd',
          category: 'processor'
        },
        {
          id: 'proc2',
          name: 'AMD Ryzen 5 5600G',
          price: 7175.00,
          image: '/images/amd-ryzen-5600g.jpg',
          brand: 'amd',
          category: 'processor'
        },
        {
          id: 'proc3',
          name: 'AMD Ryzen 7 5700X',
          price: 7295.00,
          image: '/images/amd-ryzen-7-5700x.jpg',
          brand: 'amd',
          category: 'processor'
        },
        {
          id: 'proc4',
          name: 'AMD Ryzen 7 5700G',
          price: 8095.00,
          image: '/images/amd-ryzen-7-5700g.jpg',
          brand: 'amd',
          category: 'processor'
        },
        {
          id: 'proc5',
          name: 'Intel Core i3-10100',
          price: 5495.00,
          image: '/images/intel-i3-10100.jpg',
          brand: 'intel',
          category: 'processor'
        },
        {
          id: 'proc6',
          name: 'Intel Core i3-12100',
          price: 6095.00,
          image: '/images/intel-i3-12100.jpg',
          brand: 'intel',
          category: 'processor'
        },
        {
          id: 'proc7',
          name: 'AMD Ryzen 9 5900XT',
          price: 22750.00,
          image: '/images/amd-ryzen-9-5900xt.jpg',
          brand: 'amd',
          category: 'processor'
        },
        {
          id: 'proc8',
          name: 'AMD Ryzen 5 2400g',
          price: 3650.00,
          image: '/images/amd-ryzen-5-2400g.jpg',
          brand: 'amd',
          category: 'processor'
        },
        {
          id: 'proc9',
          name: 'AMD Ryzen 3 3200g',
          price: 3950.00,
          image: '/images/amd-ryzen-3-3200g.jpg',
          brand: 'amd',
          category: 'processor'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isInWishlist']),
    
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.products.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage)
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
  methods: {
    ...mapMutations(['addToCart', 'addToWishlist', 'removeFromWishlist']),
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },
    
    addToCart(product) {
      this.$store.commit('addToCart', { ...product, quantity: 1 })
      alert(`Added ${product.name} to cart!`)
    },
    
    buyNow(product) {
      this.addToCart(product)
      this.$router.push('/cart')
    },
    
    toggleWishlist(product) {
      if (this.isInWishlist(product.id)) {
        this.$store.commit('removeFromWishlist', product.id)
      } else {
        this.$store.commit('addToWishlist', product)
      }
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
.processors {
  padding: 2rem 0;
  min-height: 100vh;
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  background: var(--gray-50);
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.wishlist-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--white);
  border: none;
  border-radius: 50%;
  color: var(--gray-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  z-index: 2;
}

.wishlist-btn:hover {
  color: var(--danger);
  transform: scale(1.1);
}

.wishlist-btn .fas.fa-heart {
  color: var(--danger);
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.75rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 1.5rem;
}

.product-actions {
  display: flex;
  gap: 0.75rem;
}

.buy-btn {
  flex: 1;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.action-icons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--gray-300);
  background: var(--white);
  color: var(--gray-500);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: var(--primary-blue);
  color: var(--white);
  border-color: var(--primary-blue);
  transform: translateY(-1px);
}

.action-btn.cart-btn:hover {
  background: var(--success);
  border-color: var(--success);
}

.action-btn.view-btn:hover {
  background: var(--info);
  border-color: var(--info);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
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
@media (max-width: 768px) {
  .processors {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 576px) {
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .action-icons {
    justify-content: center;
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
</style>
