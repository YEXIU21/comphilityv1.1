<template>
  <div class="product-card fade-in" @mouseenter="handleHover" @mouseleave="handleLeave">
    <div class="product-image">
      <img :src="getImageUrl(product.image)" :alt="product.name" @error="handleImageError" />
      <div class="product-badge" v-if="product.badge">
        {{ product.badge }}
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-title">{{ product.name }}</h3>
      
      <div v-if="product.rating" class="product-rating">
        <div class="stars">
          <i v-for="n in 5" :key="n" :class="getStarClass(n)" class="star"></i>
        </div>
        <span class="rating-text">{{ product.rating.toFixed(1) }}</span>
      </div>
      
      <div class="product-price">
        <span v-if="product.originalPrice" class="original-price">₱{{ formatPrice(product.originalPrice) }}</span>
        <span class="current-price">₱{{ formatPrice(product.price) }}</span>
      </div>
      
      <div class="product-actions">
        <button @click="addToCart" class="btn btn-primary buy-btn">
          BUY NOW
        </button>
        <div class="action-icons">
          <button 
            @click.stop="addToCart" 
            class="action-btn cart-btn" 
            title="Add to Cart"
            style="cursor: pointer; z-index: 10;"
          >
            <i class="fas fa-shopping-cart"></i>
          </button>
          <button @click.stop="quickView" class="action-btn view-btn" title="Quick View">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['isInWishlist']),
    
    productImage() {
      return this.product.image || '/images/placeholder-product.png'
    },
    
    isInWishlist() {
      return this.$store.getters.isInWishlist(this.product.id)
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    getStarClass(starNumber) {
      if (this.product.rating >= starNumber) {
        return 'fas fa-star'
      } else if (this.product.rating >= starNumber - 0.5) {
        return 'fas fa-star-half-alt'
      } else {
        return 'far fa-star'
      }
    },
    
    addToCart() {
      console.log('🛒 [ProductCard] Add to cart clicked for:', this.product.name)
      console.log('📦 [ProductCard] Product data:', this.product)
      console.log('📦 [ProductCard] Product ID:', this.product.id)
      console.log('📦 [ProductCard] Emitting add-to-cart event...')
      this.$emit('add-to-cart', this.product)
      console.log('✅ [ProductCard] Event emitted successfully')
    },
    
    toggleWishlist() {
      console.log('❤️ [ProductCard] Toggle wishlist clicked for:', this.product.name)
      this.$emit('toggle-wishlist', this.product)
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23E5E7EB" width="300" height="200"/%3E%3Ctext fill="%236B7280" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
      }
      
      if (imagePath.startsWith('http')) {
        return imagePath
      }
      
      // Get base URL without /api suffix for images
      const apiBaseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api'
      const baseURL = apiBaseURL.replace('/api', '')
      return `${baseURL}${imagePath}`
    },
    
    handleImageError(event) {
      console.warn('⚠️ [ProductCard] Image failed to load:', event.target.src)
      event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23E5E7EB" width="300" height="200"/%3E%3Ctext fill="%236B7280" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Not Found%3C/text%3E%3C/svg%3E'
      event.target.onerror = null
    },
    
    addToComparison() {
      this.$emit('add-to-comparison', this.product)
    },
    
    quickView() {
      this.$emit('quick-view', this.product)
    }
  }
}
</script>

<style scoped>
.product-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--gray-100);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(91, 126, 255, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.product-card:hover {
  box-shadow: 0 12px 40px rgba(91, 126, 255, 0.15);
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(91, 126, 255, 0.2);
}

.product-card:hover::before {
  opacity: 1;
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
  top: 0.75rem;
  right: 0.75rem;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--gray-400);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  z-index: 2;
}

.wishlist-btn:hover {
  background: var(--white);
  color: var(--danger);
  transform: scale(1.1);
}

.wishlist-btn.active {
  color: var(--danger);
  background: var(--white);
}

.product-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--danger);
  color: var(--white);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  font-weight: 600;
}

.product-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  line-height: 1.4;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
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

.product-price {
  margin-bottom: 1rem;
}

.original-price {
  font-size: 0.875rem;
  color: var(--gray-500);
  text-decoration: line-through;
  margin-right: 0.5rem;
}

.current-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary-blue);
}

.product-actions {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.buy-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.buy-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 126, 255, 0.3);
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

/* Responsive Design */
@media (max-width: 768px) {
  .product-info {
    padding: 0.75rem;
  }
  
  .product-title {
    font-size: 0.8rem;
  }
  
  .buy-btn {
    font-size: 0.7rem;
    padding: 0.625rem;
  }
  
  .action-btn {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  .product-card {
    max-width: 300px;
    margin: 0 auto;
  }
  
  .product-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .buy-btn {
    width: 100%;
  }
  
  .action-icons {
    justify-content: center;
  }
}

/* iPhone 14 Pro Max (430px width) - Enhanced Mobile Sizing */
@media (max-width: 430px) {
  .product-card {
    max-width: 100%;
    border-radius: 16px;
  }
  
  .product-info {
    padding: 1.25rem;
  }
  
  .product-title {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
    font-weight: 600;
  }
  
  .product-price {
    margin-bottom: 1rem;
  }
  
  .current-price {
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .buy-btn {
    padding: 0.875rem 1.25rem;
    font-size: 1rem;
    font-weight: 700;
    min-height: 48px;
  }
  
  .action-btn {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
    border-radius: 8px;
  }
  
  .wishlist-btn {
    width: 2.75rem;
    height: 2.75rem;
    top: 0.75rem;
    right: 0.75rem;
    font-size: 1.1rem;
  }
  
  .product-badge {
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 8px;
  }
  
  .product-rating {
    margin-bottom: 1rem;
  }
  
  .star {
    font-size: 1rem;
  }
  
  .rating-text {
    font-size: 0.875rem;
  }
}
</style>
