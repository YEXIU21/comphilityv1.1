<template>
  <div class="storage-page">
    <div class="container">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <i class="fas fa-chevron-right"></i>
          <span class="breadcrumb-current">Storage (SSD & HDD)</span>
        </div>
        <h1 class="page-title">Storage Solutions</h1>
        <p class="page-description">High-speed SSDs and reliable HDDs for all your storage needs</p>
      </div>

      <div class="products-section">
        <div class="products-controls">
          <div class="filter-section">
            <div class="filter-group">
              <label>Type:</label>
              <select v-model="selectedType" class="filter-select">
                <option value="">All Types</option>
                <option value="ssd">SSD</option>
                <option value="hdd">HDD</option>
                <option value="nvme">NVMe M.2</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Brand:</label>
              <select v-model="selectedBrand" class="filter-select">
                <option value="">All Brands</option>
                <option value="samsung">Samsung</option>
                <option value="western-digital">Western Digital</option>
                <option value="seagate">Seagate</option>
                <option value="crucial">Crucial</option>
                <option value="kingston">Kingston</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Capacity:</label>
              <select v-model="selectedCapacity" class="filter-select">
                <option value="">All Capacities</option>
                <option value="256gb">256GB</option>
                <option value="500gb">500GB</option>
                <option value="1tb">1TB</option>
                <option value="2tb">2TB</option>
                <option value="4tb">4TB</option>
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
          category="storage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'

export default {
  name: 'Storage',
  components: {
    ProductGrid
  },
  data() {
    return {
      loading: false,
      selectedType: '',
      selectedBrand: '',
      selectedCapacity: '',
      sortBy: 'name',
      products: [
        {
          id: 'storage1',
          name: 'Samsung 980 PRO 1TB NVMe M.2 SSD',
          price: 129.99,
          originalPrice: 149.99,
          image: '/api/placeholder/300/300',
          rating: 4.9,
          reviews: 892,
          brand: 'samsung',
          type: 'nvme',
          capacity: '1tb',
          inStock: true,
          sale: true
        },
        {
          id: 'storage2',
          name: 'Western Digital Black SN850 2TB NVMe',
          price: 249.99,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          reviews: 456,
          brand: 'western-digital',
          type: 'nvme',
          capacity: '2tb',
          inStock: true
        },
        {
          id: 'storage3',
          name: 'Crucial MX500 1TB SATA SSD',
          price: 89.99,
          image: '/api/placeholder/300/300',
          rating: 4.7,
          reviews: 1234,
          brand: 'crucial',
          type: 'ssd',
          capacity: '1tb',
          inStock: true
        },
        {
          id: 'storage4',
          name: 'Seagate Barracuda 2TB 7200RPM HDD',
          price: 54.99,
          image: '/api/placeholder/300/300',
          rating: 4.5,
          reviews: 678,
          brand: 'seagate',
          type: 'hdd',
          capacity: '2tb',
          inStock: true
        },
        {
          id: 'storage5',
          name: 'Kingston NV2 500GB NVMe M.2',
          price: 39.99,
          originalPrice: 49.99,
          image: '/api/placeholder/300/300',
          rating: 4.6,
          reviews: 324,
          brand: 'kingston',
          type: 'nvme',
          capacity: '500gb',
          inStock: true,
          sale: true
        },
        {
          id: 'storage6',
          name: 'Western Digital Blue 4TB 5400RPM HDD',
          price: 79.99,
          image: '/api/placeholder/300/300',
          rating: 4.4,
          reviews: 567,
          brand: 'western-digital',
          type: 'hdd',
          capacity: '4tb',
          inStock: true
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products]

      if (this.selectedType) {
        filtered = filtered.filter(product => product.type === this.selectedType)
      }

      if (this.selectedBrand) {
        filtered = filtered.filter(product => product.brand === this.selectedBrand)
      }

      if (this.selectedCapacity) {
        filtered = filtered.filter(product => product.capacity === this.selectedCapacity)
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
.storage-page {
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
