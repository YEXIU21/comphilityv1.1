<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-background">
        <div class="hero-gradient"></div>
        <div class="hero-particles"></div>
      </div>
      <div class="container">
        <div class="hero-slider">
          <div class="hero-slide active fade-in">
            <div class="hero-content slide-up">
              <div class="hero-badge">🚀 Custom PC Builder</div>
              <h1 class="hero-title">Create Your Perfect Gaming Rig</h1>
              <p class="hero-subtitle">
                Design and build your ultimate gaming PC with our intuitive PC Builder tool. Choose from premium components, get compatibility checks, and create a system that matches your exact needs and budget.
              </p>
              <div class="hero-actions">
                <router-link to="/build-pc" class="btn btn-primary hero-cta">
                  <i class="fas fa-wrench"></i>
                  Start Building
                </router-link>
                <router-link to="/products" class="btn btn-outline">
                  <i class="fas fa-th-large"></i>
                  Browse Components
                </router-link>
              </div>
              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-number">1000+</span>
                  <span class="stat-label">Components</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">500+</span>
                  <span class="stat-label">Happy Customers</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">24/7</span>
                  <span class="stat-label">Support</span>
                </div>
              </div>
            </div>
            <div class="hero-image scale-in">
              <div class="custom-pc-visual">
                <div class="pc-case">
                  <div class="pc-case-body">
                    <div class="pc-components">
                      <div class="component cpu">
                        <i class="fas fa-microchip"></i>
                        <span>CPU</span>
                      </div>
                      <div class="component gpu">
                        <i class="fas fa-memory"></i>
                        <span>GPU</span>
                      </div>
                      <div class="component ram">
                        <i class="fas fa-hdd"></i>
                        <span>RAM</span>
                      </div>
                    </div>
                    <div class="pc-lights">
                      <div class="light light-1"></div>
                      <div class="light light-2"></div>
                      <div class="light light-3"></div>
                    </div>
                  </div>
                  <div class="pc-screen">
                    <div class="screen-content">
                      <i class="fas fa-desktop"></i>
                      <div class="build-text">Custom PC Build</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- PC Sets Section -->
    <section class="products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">PC SETS</h2>
          <router-link to="/pc-sets" class="see-more-link">
            SEE MORE
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <ProductGrid :products="pcSets" />
      </div>
    </section>

    <!-- Laptops Section -->
    <section class="products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">LAPTOPS</h2>
          <router-link to="/laptops" class="see-more-link">
            SEE MORE
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <ProductGrid :products="laptops" />
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section class="products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">BEST SELLER</h2>
          <router-link to="/best-sellers" class="see-more-link">
            SEE MORE
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <ProductGrid :products="bestSellers" />
      </div>
    </section>
  </div>
</template>

<script>
import ProductGrid from '../components/common/ProductGrid.vue'
import imageFallback from '@/mixins/imageFallback'
import { generatePlaceholder } from '@/utils/placeholder'

export default {
  name: 'Home',
  mixins: [imageFallback],
  components: {
    ProductGrid
  },
  data() {
    return {
      pcSets: [
        {
          id: 1,
          name: 'INTEL I5 BUNDLE',
          price: 25195.00,
          image: generatePlaceholder(300, 200, 'Intel i5 Bundle', '4169E1', 'ffffff'),
          rating: 5.0,
          category: 'PC Sets'
        },
        {
          id: 2,
          name: 'RYZEN 5 BUNDLE',
          price: 16295.00,
          image: generatePlaceholder(300, 200, 'Ryzen 5 Bundle', 'FF6B35', 'ffffff'),
          rating: 5.0,
          category: 'PC Sets'
        },
        {
          id: 3,
          name: 'INTEL I7 BUNDLE',
          price: 46139.00,
          image: generatePlaceholder(300, 200, 'Intel i7 Bundle', '4169E1', 'ffffff'),
          rating: 5.0,
          category: 'PC Sets'
        },
        {
          id: 4,
          name: 'RYZEN 7 BUNDLE',
          price: 21250.00,
          image: generatePlaceholder(300, 200, 'Ryzen 7 Bundle', 'FF6B35', 'ffffff'),
          rating: 5.0,
          category: 'PC Sets'
        }
      ],
      laptops: [
        {
          id: 5,
          name: 'MSI THIN 15',
          price: 51999.00,
          image: generatePlaceholder(300, 200, 'MSI Thin 15', '000000', 'ffffff'),
          rating: 5.0,
          category: 'Laptops'
        },
        {
          id: 6,
          name: 'ACER NITRO 5',
          price: 45999.00,
          image: generatePlaceholder(300, 200, 'Acer Nitro 5', 'FF6B00', 'ffffff'),
          rating: 5.0,
          category: 'Laptops'
        },
        {
          id: 7,
          name: 'PREDATOR HELIOS NEO 16',
          price: 98999.00,
          image: generatePlaceholder(300, 200, 'Predator Helios', '00D4AA', 'ffffff'),
          rating: 5.0,
          category: 'Laptops'
        },
        {
          id: 8,
          name: 'LENOVO LEGION 5 PRO',
          price: 118999.00,
          image: generatePlaceholder(300, 200, 'Lenovo Legion', 'E60012', 'ffffff'),
          rating: 5.0,
          category: 'Laptops'
        }
      ],
      bestSellers: [
        {
          id: 9,
          name: 'MSI Pro MP223 21.5" 100Hz',
          price: 3620.00,
          image: generatePlaceholder(300, 200, 'MSI Monitor', 'FF0000', 'ffffff'),
          rating: 5.0,
          category: 'Monitor'
        },
        {
          id: 10,
          name: 'Nvision EC2451 PRO 180HZ',
          price: 5230.00,
          image: generatePlaceholder(300, 200, 'Nvision Monitor', '2E8B57', 'ffffff'),
          rating: 5.0,
          category: 'Monitor'
        },
        {
          id: 11,
          name: 'Nvision S2515 24.5" 100HZ',
          price: 98999.00,
          image: generatePlaceholder(300, 200, 'Nvision S2515', '2E8B57', 'ffffff'),
          rating: 5.0,
          category: 'Monitor'
        },
        {
          id: 12,
          name: 'Nvision N2455PRO 100Hz',
          price: 3950.00,
          image: generatePlaceholder(300, 200, 'Nvision N2455', '2E8B57', 'ffffff'),
          rating: 5.0,
          category: 'Monitor'
        }
      ]
    }
  },
  mounted() {
    // Load products from API or store
    this.loadProducts()
  },
  methods: {
    async loadProducts() {
      // Products will be loaded from API when backend is integrated
      // For now, using static data defined in component
      try {
        // Future: Use productService.getFeaturedProducts()
        // const response = await productService.getFeaturedProducts()
        // this.pcSets = response.data.pcSets
        // this.laptops = response.data.laptops
        // this.bestSellers = response.data.bestSellers
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 4rem 0;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding-top: 2rem;
  width: 100%;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary-blue) 0%, #3B82F6 50%, var(--primary-blue-dark) 100%);
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 2px, transparent 2px),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 2px, transparent 2px),
    radial-gradient(circle at 40% 40%, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 100px 100px, 150px 150px, 200px 200px;
  animation: float 20s infinite linear;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(120deg); }
  66% { transform: translateY(-20px) rotate(240deg); }
  100% { transform: translateY(0px) rotate(360deg); }
}

.hero-slide {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 600px;
  color: var(--white);
  transform: translateY(-30px);
}

.hero-badge {
  display: inline-block;
  background: rgba(255,255,255,0.15);
  color: var(--white);
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.375rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.7;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.hero-cta {
  font-size: 1.125rem;
  padding: 1.25rem 2.5rem;
  background: var(--white);
  color: var(--primary-blue);
  border: none;
  font-weight: 700;
}

.hero-cta:hover {
  background: var(--gray-100);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

/* Fix Browse Components button visibility on blue background */
.hero-actions .btn-outline {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--white);
  color: var(--white);
  backdrop-filter: blur(10px);
}

.hero-actions .btn-outline:hover {
  background: var(--white);
  color: var(--primary-blue);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.hero-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--white);
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 0.5rem;
  font-weight: 500;
}

.hero-image-wrapper {
  position: relative;
}

.hero-image-wrapper img {
  width: 100%;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.image-glow {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  border-radius: 36px;
  filter: blur(20px);
  z-index: -1;
}

.products-section {
  padding: 4rem 0;
  background: var(--white);
  border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  margin-top: -2rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-blue-light));
  border-radius: 2px;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  position: relative;
}

.see-more-link {
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--primary-blue);
  border-radius: var(--border-radius-lg);
  transition: all 0.3s ease;
  background: rgba(91, 126, 255, 0.05);
}

.see-more-link:hover {
  color: var(--white);
  background: var(--primary-blue);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(91, 126, 255, 0.3);
}

.see-more-link i {
  transition: transform 0.3s ease;
}

.see-more-link:hover i {
  transform: translateX(4px);
}

.see-more-link i {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.see-more-link:hover i {
  transform: translateX(2px);
}

/* Mid-range responsive adjustments for proper width utilization */
@media (max-width: 1288px) {
  .hero-slide {
    gap: 3rem;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
}

@media (max-width: 1024px) {
  .hero-slide {
    gap: 2.5rem;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-actions {
    gap: 1.25rem;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0 1rem;
    min-height: 70vh;
  }
  
  .hero-slide {
    grid-template-columns: 1fr;
    gap: 2rem;
    min-height: auto;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }
  
  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .hero-stats {
    justify-content: center;
    gap: 1.5rem;
  }
  
  .products-section {
    padding: 3rem 0;
    margin-top: -1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .see-more-link {
    align-self: flex-end;
  }
}

/* Custom PC Visual Styles */
.custom-pc-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  padding: 2rem;
}

.pc-case {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.pc-case-body {
  position: relative;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border: 2px solid #333;
  border-radius: 12px;
  padding: 2rem;
  min-width: 280px;
  min-height: 200px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.pc-components {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(145deg, #333, #2a2a2a);
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  transition: all 0.3s ease;
}

.component:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(91, 126, 255, 0.3);
}

.component i {
  font-size: 1.5rem;
  color: var(--primary-blue);
}

.component span {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cpu i { color: #ff6b35; }
.gpu i { color: #00d4aa; }
.ram i { color: #ffd700; }

.pc-lights {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.light {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.light-1 {
  background: #ff6b35;
  animation-delay: 0s;
}

.light-2 {
  background: #00d4aa;
  animation-delay: 0.7s;
}

.light-3 {
  background: var(--primary-blue);
  animation-delay: 1.4s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.pc-screen {
  background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
  border: 2px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
  min-width: 200px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.screen-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #fff;
}

.screen-content i {
  font-size: 2.5rem;
  color: var(--primary-blue);
  animation: screenGlow 3s ease-in-out infinite;
}

.build-text {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(45deg, var(--primary-blue), #00d4aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

@keyframes screenGlow {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px var(--primary-blue));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 20px var(--primary-blue));
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding: 1.5rem 0 0.5rem;
    min-height: 60vh;
  }
  
  .hero-title {
    font-size: 2rem;
    line-height: 1.1;
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
    padding: 0 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 300px;
    min-height: 48px;
    font-size: 0.95rem;
    font-weight: 600;
  }
  
  .hero-stats {
    gap: 1.25rem;
    padding: 0 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .custom-pc-visual {
    height: 300px;
    padding: 1rem;
  }
  
  .pc-case-body {
    min-width: 200px;
    min-height: 150px;
    padding: 1rem;
  }
  
  .pc-components {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .component {
    padding: 0.5rem;
  }
  
  .component i {
    font-size: 1.2rem;
  }
  
  .pc-screen {
    padding: 1rem;
    min-width: 150px;
  }
  
  .screen-content i {
    font-size: 2rem;
  }
  
  .build-text {
    font-size: 1rem;
  }
}

/* iPhone 14 Pro Max and similar devices (430px width) - Enhanced Mobile Sizing */
@media (max-width: 430px) {
  .hero-section {
    padding: 3rem 0 2rem;
    min-height: 70vh;
  }
  
  .container {
    padding: 0 1.5rem;
  }
  
  .hero-badge {
    font-size: 0.9rem;
    padding: 0.75rem 1.25rem;
    border-radius: 25px;
    margin-bottom: 1.5rem;
  }
  
  .hero-title {
    font-size: 2.75rem;
    line-height: 1.05;
    margin-bottom: 1.5rem;
    font-weight: 900;
    letter-spacing: -1px;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    padding: 0;
    line-height: 1.5;
    margin-bottom: 2.5rem;
    color: var(--gray-600);
    font-weight: 400;
  }
  
  .hero-actions {
    flex-direction: column;
    padding: 0;
    gap: 1.25rem;
    align-items: center;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 350px;
    font-size: 1.25rem;
    padding: 1.25rem 2rem;
    min-height: 64px;
    font-weight: 700;
    border-radius: 16px;
    letter-spacing: 0.5px;
  }
  
  .hero-actions .btn i {
    font-size: 1.125rem;
    margin-right: 0.75rem;
  }
  
  .hero-stats {
    padding: 0;
    gap: 2rem;
    margin-top: 3rem;
    justify-content: space-around;
  }
  
  .stat-item {
    text-align: center;
    flex: 1;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: 900;
    color: var(--primary-blue);
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 1.125rem;
    margin-top: 0;
    color: var(--gray-600);
    font-weight: 500;
  }
  
  .products-section {
    padding: 3rem 0;
  }
  
  .section-header {
    padding: 0 1.5rem;
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }
  
  .see-more-link {
    font-size: 1.125rem;
    font-weight: 600;
  }
}

/* iPhone 12 Pro and similar devices (390px width) */
@media (max-width: 390px) {
  .hero-title {
    font-size: 1.75rem;
    line-height: 1.1;
  }
  
  .hero-subtitle {
    font-size: 0.9rem;
    padding: 0 0.5rem;
  }
  
  .hero-actions {
    padding: 0 0.5rem;
  }
  
  .hero-actions .btn {
    max-width: 280px;
    font-size: 0.9rem;
  }
  
  .hero-stats {
    padding: 0 0.5rem;
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .pc-case-body {
    min-width: 180px;
    min-height: 130px;
    padding: 0.75rem;
  }
  
  .pc-components {
    grid-template-columns: 1fr 1fr;
    gap: 0.375rem;
  }
}
</style>
