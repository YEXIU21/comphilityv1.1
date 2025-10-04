<template>
  <div class="best-sellers">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">BEST SELLER</h1>
        <p class="page-description">
          Our most popular products loved by customers. These top-rated items offer the best value and performance.
        </p>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="activeCategory = category.id"
          :class="['category-tab', { active: activeCategory === category.id }]"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Product Grid -->
      <ProductGrid :products="filteredProducts" />

      <!-- Load More Button -->
      <div v-if="hasMoreProducts" class="load-more-section">
        <button @click="loadMoreProducts" class="btn btn-outline load-more-btn">
          <i class="fas fa-plus"></i>
          Load More Products
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'

export default {
  name: 'BestSellers',
  components: {
    ProductGrid
  },
  data() {
    return {
      activeCategory: 'all',
      itemsToShow: 9,
      categories: [
        { id: 'all', name: 'All Categories' },
        { id: 'components', name: 'Components' },
        { id: 'peripherals', name: 'Peripherals' },
        { id: 'monitors', name: 'Monitors' },
        { id: 'storage', name: 'Storage' }
      ],
      products: [
        {
          id: 301,
          name: 'AMD Ryzen 5 5600X',
          price: 5715.00,
          image: '/images/amd-ryzen-5600x.jpg',
          rating: 5.0,
          category: 'components',
          type: 'Processor'
        },
        {
          id: 302,
          name: 'Rakit AHI EV/ROCY Mouse',
          price: 300.00,
          image: '/images/rakit-mouse.jpg',
          rating: 5.0,
          category: 'peripherals',
          type: 'Mouse'
        },
        {
          id: 303,
          name: 'MSI A520M-A Pro',
          price: 3250.00,
          image: '/images/msi-a520m-pro.jpg',
          rating: 5.0,
          category: 'components',
          type: 'Motherboard'
        },
        {
          id: 304,
          name: 'Team Elite Vulcan TUF 16gb',
          price: 1905.00,
          image: '/images/team-elite-vulcan.jpg',
          rating: 5.0,
          category: 'components',
          type: 'Memory'
        },
        {
          id: 305,
          name: 'Nvision EC2451 PRO 180HZ',
          price: 5230.00,
          image: '/images/nvision-ec2451.jpg',
          rating: 5.0,
          category: 'monitors',
          type: 'Monitor'
        },
        {
          id: 306,
          name: 'MSI Pro MP223 21.5" 100Hz',
          price: 3620.00,
          image: '/images/msi-pro-mp223.jpg',
          rating: 5.0,
          category: 'monitors',
          type: 'Monitor'
        },
        {
          id: 307,
          name: 'Acer AC-550 550w 80plus',
          price: 1435.00,
          image: '/images/acer-ac550.jpg',
          rating: 5.0,
          category: 'components',
          type: 'Power Supply'
        },
        {
          id: 308,
          name: 'RAKK ILIS Type-C 96 Keys',
          price: 1295.00,
          image: '/images/rakk-ilis-keyboard.jpg',
          rating: 5.0,
          category: 'peripherals',
          type: 'Keyboard'
        },
        {
          id: 309,
          name: 'Team Elite GX2 128GB Sata',
          price: 795.00,
          image: '/images/team-elite-gx2.jpg',
          rating: 5.0,
          category: 'storage',
          type: 'SSD'
        },
        {
          id: 310,
          name: 'Corsair Vengeance LPX 16GB',
          price: 2450.00,
          image: '/images/corsair-vengeance.jpg',
          rating: 5.0,
          category: 'components',
          type: 'Memory'
        },
        {
          id: 311,
          name: 'Logitech G502 Hero',
          price: 3250.00,
          image: '/images/logitech-g502.jpg',
          rating: 5.0,
          category: 'peripherals',
          type: 'Mouse'
        },
        {
          id: 312,
          name: 'Samsung 970 EVO Plus 1TB',
          price: 4850.00,
          image: '/images/samsung-970-evo.jpg',
          rating: 5.0,
          category: 'storage',
          type: 'NVMe SSD'
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = this.products
      
      if (this.activeCategory !== 'all') {
        filtered = this.products.filter(product => product.category === this.activeCategory)
      }
      
      // Sort by rating and price (best sellers logic)
      filtered.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating
        }
        return a.price - b.price
      })
      
      return filtered.slice(0, this.itemsToShow)
    },
    
    hasMoreProducts() {
      const totalAvailable = this.activeCategory === 'all' 
        ? this.products.length 
        : this.products.filter(product => product.category === this.activeCategory).length
      
      return this.itemsToShow < totalAvailable
    }
  },
  watch: {
    activeCategory() {
      // Reset items to show when category changes
      this.itemsToShow = 9
    }
  },
  methods: {
    loadMoreProducts() {
      this.itemsToShow += 6
    }
  }
}
</script>

<style scoped>
.best-sellers {
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

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.category-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--gray-200);
  background: var(--white);
  color: var(--gray-600);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-tab:hover {
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

.category-tab.active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  color: var(--white);
  box-shadow: var(--shadow-md);
}

.load-more-section {
  text-align: center;
  margin-top: 3rem;
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive Design */
@media (max-width: 768px) {
  .best-sellers {
    padding: 1rem 0;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .category-tabs {
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
  
  .category-tab {
    padding: 0.625rem 1.25rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .category-tabs {
    gap: 0.25rem;
  }
  
  .category-tab {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
  
  .load-more-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
}
</style>
