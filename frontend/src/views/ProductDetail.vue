<template>
  <div class="product-detail">
    <div class="container">
      <!-- Back Button -->
      <div class="back-navigation">
        <button @click="goBack" class="back-btn">
          <i class="fas fa-arrow-left"></i>
          Back
        </button>
      </div>

      <!-- Product Detail Card -->
      <div class="product-card">
        <div class="product-content">
          <div class="product-images">
            <div class="main-image">
              <img :src="selectedImage" :alt="product.name" />
            </div>
            <div class="thumbnail-images">
              <div 
                v-for="(image, index) in product.images" 
                :key="index"
                class="thumbnail"
                :class="{ active: selectedImage === image }"
                @click="selectedImage = image"
              >
                <img :src="image" :alt="`${product.name} ${index + 1}`" />
              </div>
            </div>
          </div>
          
          <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>
            
            <div class="product-rating">
              <div class="stars">
                <i v-for="n in 5" :key="n" :class="getStarClass(n)" class="star"></i>
              </div>
              <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
            </div>
            
            <div class="stock-status" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
              <i :class="product.inStock ? 'fas fa-check' : 'fas fa-times'"></i>
              {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
            </div>
            
            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button @click="decreaseQuantity" class="quantity-btn">-</button>
                <span class="quantity-value">{{ quantity }}</span>
                <button @click="increaseQuantity" class="quantity-btn">+</button>
              </div>
            </div>
            
            <div class="product-price">
              ₱{{ formatPrice(product.price) }}
            </div>
            
            <div class="product-actions">
              <button @click="addToWishlist" class="btn btn-outline wishlist-btn">
                <i :class="isInWishlist ? 'fas fa-heart' : 'far fa-heart'"></i>
                {{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
              </button>
              <button @click="addToCart" class="btn btn-primary add-to-cart-btn">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
              <button @click="buyNow" class="btn btn-primary buy-now-btn">
                Buy Now
              </button>
            </div>
          </div>
          
          <div class="product-sidebar">
            <div class="payment-options">
              <h4>Payment Options</h4>
              <div class="payment-methods">
                <img src="/images/payment-bdo.png" alt="BDO" class="payment-logo" />
                <img src="/images/payment-gcash.png" alt="GCash" class="payment-logo" />
                <img src="/images/payment-maya.png" alt="Maya" class="payment-logo" />
              </div>
            </div>
            
            <div class="warranty-info">
              <h4>Warranty</h4>
              <div class="warranty-item">
                <i class="fas fa-shield-alt"></i>
                <span>{{ product.warranty }} Warranty</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Product Specifications -->
        <div class="product-specifications">
          <h3>Specification :</h3>
          <div class="specs-content">
            <ul class="specs-list">
              <li v-for="spec in product.specifications" :key="spec.label">
                <strong>{{ spec.label }}</strong> - {{ spec.value }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ProductDetail',
  data() {
    return {
      quantity: 1,
      selectedImage: '',
      product: {
        id: 1,
        name: 'AMD Ryzen 5 5600G Socket Am4 3.9GHz with Radeon Vega 7 Processor with Wraith stealth cooler MPK',
        price: 7175.00,
        rating: 5.0,
        inStock: true,
        warranty: '1 Year',
        images: [
          '/images/amd-ryzen-5600g-1.jpg',
          '/images/amd-ryzen-5600g-2.jpg',
          '/images/amd-ryzen-5600g-3.jpg',
          '/images/amd-ryzen-5600g-4.jpg'
        ],
        specifications: [
          { label: 'Brand', value: 'AMD' },
          { label: 'Model', value: 'Ryzen 5 5600G' },
          { label: 'Processor Type', value: 'Box' },
          { label: 'Series', value: 'AMD Ryzen® 5 Processors' },
          { label: 'Model', value: 'Ryzen 5 5600G' },
          { label: 'CPU Socket Type', value: 'AM4' },
          { label: 'Number Of Cores', value: '6' },
          { label: 'Number Of Threads', value: '12' },
          { label: 'Operating Frequency', value: '3.9GHz' },
          { label: 'Max Turbo Frequency', value: '4.4GHz' },
          { label: 'L2 Cache', value: '3MB' },
          { label: 'L3 Cache', value: '16MB' },
          { label: 'Manufacturing Tech', value: '7nm' },
          { label: '64-Bit Support', value: 'Yes' },
          { label: 'Memory Types', value: 'DDR4' },
          { label: 'Memory Channel', value: '2' },
          { label: 'PCI Express Revision', value: '3' },
          { label: 'Thermal Design Power', value: '65W' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['wishlist']),
    ...mapGetters(['isInWishlist']),
    
    isInWishlist() {
      return this.$store.getters.isInWishlist(this.product.id)
    }
  },
  mounted() {
    // Set the first image as selected by default
    if (this.product.images.length > 0) {
      this.selectedImage = this.product.images[0]
    }
    
    // In a real app, you would fetch product data based on route params
    // const productId = this.$route.params.id
    // this.fetchProduct(productId)
  },
  methods: {
    ...mapMutations(['addToCart', 'addToWishlist', 'removeFromWishlist']),
    
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
    
    increaseQuantity() {
      this.quantity++
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    
    addToCart() {
      const cartItem = {
        ...this.product,
        quantity: this.quantity
      }
      this.$store.commit('addToCart', cartItem)
      alert(`Added ${this.quantity} ${this.product.name} to cart!`)
    },
    
    addToWishlist() {
      if (this.isInWishlist) {
        this.$store.commit('removeFromWishlist', this.product.id)
      } else {
        this.$store.commit('addToWishlist', this.product)
      }
    },
    
    buyNow() {
      this.addToCart()
      this.$router.push('/cart')
    },
    
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.product-detail {
  padding: 3rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-50) 0%, #f0f4ff 100%);
}

.back-navigation {
  margin-bottom: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-blue);
  color: var(--white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background: var(--primary-blue-dark);
}

.product-card {
  background: var(--primary-blue);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.product-content {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 2rem;
  padding: 2rem;
  color: var(--white);
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 1rem;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnail-images {
  display: flex;
  gap: 0.5rem;
}

.thumbnail {
  width: 60px;
  height: 60px;
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 0.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.thumbnail.active,
.thumbnail:hover {
  opacity: 1;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  color: var(--warning);
  font-size: 1rem;
}

.rating-value {
  font-weight: 600;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.stock-status.in-stock {
  color: var(--success);
}

.stock-status.out-of-stock {
  color: var(--danger);
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  padding: 0.25rem;
}

.quantity-btn {
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: var(--border-radius);
  color: var(--white);
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.quantity-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.quantity-value {
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
}

.product-price {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wishlist-btn {
  background: transparent;
  color: var(--white);
  border-color: var(--white);
}

.wishlist-btn:hover {
  background: var(--white);
  color: var(--primary-blue);
}

.add-to-cart-btn,
.buy-now-btn {
  background: var(--white);
  color: var(--primary-blue);
  border: none;
}

.add-to-cart-btn:hover,
.buy-now-btn:hover {
  background: var(--gray-100);
}

.product-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.payment-options,
.warranty-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.payment-options h4,
.warranty-info h4 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.payment-logo {
  height: 30px;
  width: auto;
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 0.25rem;
}

.warranty-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-specifications {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
}

.product-specifications h3 {
  color: var(--white);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.specs-content {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.specs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  color: var(--gray-800);
}

.specs-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--gray-200);
  font-size: 0.875rem;
  line-height: 1.4;
}

.specs-list li:last-child {
  border-bottom: none;
}

.specs-list strong {
  color: var(--primary-blue);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .product-images {
    order: 1;
  }
  
  .product-info {
    order: 2;
  }
  
  .product-sidebar {
    order: 3;
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .product-detail {
    padding: 1rem 0;
  }
  
  .product-content {
    padding: 1.5rem;
  }
  
  .product-sidebar {
    flex-direction: column;
  }
  
  .product-name {
    font-size: 1.25rem;
  }
  
  .product-price {
    font-size: 1.75rem;
  }
}

@media (max-width: 576px) {
  .product-content {
    padding: 1rem;
  }
  
  .main-image {
    aspect-ratio: 4/3;
  }
  
  .thumbnail-images {
    justify-content: center;
  }
  
  .product-name {
    font-size: 1.125rem;
  }
  
  .product-price {
    font-size: 1.5rem;
  }
  
  .quantity-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
