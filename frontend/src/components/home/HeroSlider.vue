<template>
  <div class="hero-slider">
    <div class="slider-container">
      <div class="slides-wrapper" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(slide, index) in slides" :key="index" class="slide">
          <div class="slide-content">
            <div class="category-card" v-for="category in slide.categories" :key="category.id">
              <div class="category-image">
                <img :src="category.image" :alt="category.name" />
              </div>
              <h3 class="category-name">{{ category.name }}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navigation Arrows -->
      <button @click="prevSlide" class="nav-arrow prev-arrow" :disabled="currentSlide === 0">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button @click="nextSlide" class="nav-arrow next-arrow" :disabled="currentSlide === slides.length - 1">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    
    <!-- Slide Indicators -->
    <div class="slide-indicators">
      <button 
        v-for="(slide, index) in slides" 
        :key="index"
        @click="goToSlide(index)"
        :class="['indicator', { active: currentSlide === index }]"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSlider',
  data() {
    return {
      currentSlide: 0,
      autoPlayInterval: null,
      slides: [
        {
          id: 1,
          categories: [
            {
              id: 1,
              name: 'PROCESSOR',
              image: '/images/processor.png'
            },
            {
              id: 2,
              name: 'MOTHERBOARD',
              image: '/images/motherboard.png'
            },
            {
              id: 3,
              name: 'GRAPHICS CARD',
              image: '/images/graphics-card.png'
            },
            {
              id: 4,
              name: 'MEMORY',
              image: '/images/memory.png'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.startAutoPlay()
  },
  beforeUnmount() {
    this.stopAutoPlay()
  },
  methods: {
    nextSlide() {
      if (this.currentSlide < this.slides.length - 1) {
        this.currentSlide++
      } else {
        this.currentSlide = 0
      }
    },
    
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--
      } else {
        this.currentSlide = this.slides.length - 1
      }
    },
    
    goToSlide(index) {
      this.currentSlide = index
    },
    
    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide()
      }, 5000) // Change slide every 5 seconds
    },
    
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval)
      }
    }
  }
}
</script>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.slider-container {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.slides-wrapper {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  padding: 2rem;
}

.slide-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.category-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-blue);
}

.category-image {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
  border-radius: 50%;
  overflow: hidden;
}

.category-image img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.category-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  letter-spacing: 0.025em;
}

/* Navigation Arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--primary-blue);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.nav-arrow:hover:not(:disabled) {
  background: var(--white);
  transform: translateY(-50%) scale(1.1);
  box-shadow: var(--shadow-lg);
}

.nav-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-arrow {
  left: 1rem;
}

.next-arrow {
  right: 1rem;
}

/* Slide Indicators */
.slide-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.indicator {
  width: 0.75rem;
  height: 0.75rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: var(--white);
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .slide-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .slide {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .slide-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .slide {
    padding: 1rem;
  }
  
  .category-card {
    padding: 1rem;
  }
  
  .category-image {
    width: 60px;
    height: 60px;
  }
  
  .category-image img {
    width: 40px;
    height: 40px;
  }
  
  .category-name {
    font-size: 0.75rem;
  }
  
  .nav-arrow {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 0.875rem;
  }
  
  .prev-arrow {
    left: 0.5rem;
  }
  
  .next-arrow {
    right: 0.5rem;
  }
}

@media (max-width: 576px) {
  .slide-content {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  .category-card {
    padding: 0.75rem;
  }
  
  .category-image {
    width: 50px;
    height: 50px;
    margin-bottom: 0.75rem;
  }
  
  .category-image img {
    width: 35px;
    height: 35px;
  }
}
</style>
