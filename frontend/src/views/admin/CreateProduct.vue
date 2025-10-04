<template>
  <div class="create-product">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        Back
      </button>
      <h1 class="page-title">CREATE PRODUCT</h1>
    </div>
    
    <div class="product-form-card">
      <form @submit.prevent="saveProduct" class="product-form">
        <!-- Product Name -->
        <div class="form-group">
          <label for="productName">Product Name :</label>
          <input
            id="productName"
            v-model="product.name"
            type="text"
            class="form-control"
            placeholder="Enter product name"
            required
          />
        </div>
        
        <!-- Price and Stock Row -->
        <div class="form-row">
          <div class="form-group">
            <label for="price">Price :</label>
            <div class="input-prefix">
              <span>₱</span>
              <input
                id="price"
                v-model.number="product.price"
                type="number"
                step="0.01"
                class="form-control"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="stock">Stocks :</label>
            <input
              id="stock"
              v-model.number="product.stock"
              type="number"
              class="form-control"
              placeholder="0"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="category">Category</label>
            <select
              id="category"
              v-model="product.category"
              class="form-control"
              required
            >
              <option value="">Select Category</option>
              <option value="processor">Processor</option>
              <option value="motherboard">Motherboard</option>
              <option value="memory">Memory</option>
              <option value="graphics-card">Graphics Card</option>
              <option value="storage">Storage</option>
              <option value="power-supply">Power Supply</option>
              <option value="case">PC Case</option>
              <option value="monitor">Monitor</option>
              <option value="mouse">Mouse</option>
              <option value="keyboard">Keyboard</option>
              <option value="laptop">Laptop</option>
              <option value="pc-set">PC Set</option>
            </select>
          </div>
        </div>
        
        <!-- Image Upload -->
        <div class="form-group">
          <label>Images</label>
          <div class="image-upload-container">
            <div class="image-preview-grid">
              <div 
                v-for="(image, index) in product.images" 
                :key="index"
                class="image-preview"
              >
                <img :src="image.url" :alt="`Product image ${index + 1}`" />
                <button 
                  type="button"
                  class="remove-image"
                  @click="removeImage(index)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div 
                v-if="product.images.length < 4"
                class="image-upload"
                @click="triggerFileInput"
              >
                <i class="fas fa-image"></i>
                <i class="fas fa-plus"></i>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              @change="handleImageUpload"
              style="display: none"
            />
          </div>
        </div>
        
        <!-- Description -->
        <div class="form-group">
          <label for="description">Description :</label>
          <textarea
            id="description"
            v-model="product.description"
            class="form-control"
            rows="4"
            placeholder="Enter product description..."
            required
          ></textarea>
        </div>
        
        <!-- Specifications -->
        <div class="form-group">
          <label for="specifications">Specification :</label>
          <textarea
            id="specifications"
            v-model="product.specifications"
            class="form-control"
            rows="8"
            placeholder="Enter specifications (one per line)..."
            required
          ></textarea>
        </div>
        
        <!-- Save Button -->
        <div class="form-actions">
          <button type="submit" class="btn-save" :disabled="saving">
            <i v-if="saving" class="fas fa-spinner fa-spin"></i>
            <span v-if="saving">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { productService } from '@/services/productService'

export default {
  name: 'CreateProduct',
  data() {
    return {
      product: {
        name: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
        images: [],
        description: '',
        specifications: ''
      },
      saving: false
    }
  },
  methods: {
    goBack() {
      console.log('⬅️ [CreateProduct] Going back to product management')
      this.$router.back()
    },
    triggerFileInput() {
      console.log('📁 [CreateProduct] Opening file picker')
      this.$refs.fileInput.click()
    },
    handleImageUpload(event) {
      const files = event.target.files
      console.log('🖼️ [CreateProduct] Files selected:', files.length)
      
      for (let i = 0; i < files.length; i++) {
        if (this.product.images.length >= 4) {
          console.warn('⚠️ [CreateProduct] Maximum 4 images allowed')
          break
        }
        
        const file = files[i]
        console.log('📷 [CreateProduct] Processing image:', file.name, file.size, 'bytes')
        
        const reader = new FileReader()
        
        reader.onload = (e) => {
          this.product.images.push({
            file: file,
            url: e.target.result
          })
          console.log('✅ [CreateProduct] Image added to preview')
        }
        
        reader.readAsDataURL(file)
      }
      
      // Reset input
      event.target.value = ''
    },
    removeImage(index) {
      console.log('🗑️ [CreateProduct] Removing image at index:', index)
      this.product.images.splice(index, 1)
    },
    async saveProduct() {
      console.log('💾 [CreateProduct] Save product initiated')
      console.log('📋 [CreateProduct] Product data:', {
        name: this.product.name,
        price: this.product.price,
        stock: this.product.stock,
        category: this.product.category,
        brand: this.product.brand,
        images: this.product.images.length,
        hasDescription: !!this.product.description,
        hasSpecifications: !!this.product.specifications
      })
      
      // Validate form
      if (!this.product.name || !this.product.price || !this.product.stock || !this.product.category) {
        console.error('❌ [CreateProduct] Validation failed - missing required fields')
        alert('Please fill all required fields')
        return
      }
      
      if (this.product.images.length === 0) {
        console.warn('⚠️ [CreateProduct] No image selected')
        alert('Please upload at least one product image')
        return
      }
      
      this.saving = true
      console.log('🔄 [CreateProduct] Calling API to create product...')
      
      try {
        // Prepare product data
        const productData = {
          name: this.product.name,
          description: this.product.description,
          price: parseFloat(this.product.price),
          stock: parseInt(this.product.stock),
          category: this.product.category,
          brand: this.product.brand || '',
          image: this.product.images[0]?.file, // Use first image
          specifications: this.product.specifications ? {
            details: this.product.specifications
          } : null
        }
        
        console.log('📤 [CreateProduct] Sending product data to API')
        const result = await productService.createProduct(productData)
        
        if (result.success) {
          console.log('✅ [CreateProduct] Product created successfully!')
          console.log('📦 [CreateProduct] Created product:', result.data)
          
          // Show success message
          alert('Product created successfully!')
          
          // Navigate back to product management
          console.log('🔙 [CreateProduct] Navigating back to product management')
          this.$router.push('/admin/products')
        } else {
          console.error('❌ [CreateProduct] Failed to create product:', result.message)
          alert('Error: ' + result.message)
        }
      } catch (error) {
        console.error('❌ [CreateProduct] Error creating product:', error)
        alert('Error creating product. Please try again.')
      } finally {
        this.saving = false
        console.log('🏁 [CreateProduct] Save process finished')
      }
    }
  },
  mounted() {
    console.log('📦 [CreateProduct] Component mounted')
  }
}
</script>

<style scoped>
.create-product {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
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

.back-btn:hover {
  background: #5b7eff;
  color: white;
}

.page-title {
  font-size: 1.8rem;
  color: #5b7eff;
  font-weight: bold;
  margin: 0;
}

.product-form-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.form-control {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9f9f9;
}

.form-control:focus {
  outline: none;
  border-color: #5b7eff;
  background: white;
  box-shadow: 0 0 0 3px rgba(91, 126, 255, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.input-prefix {
  display: flex;
  align-items: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
  transition: all 0.3s ease;
}

.input-prefix:focus-within {
  border-color: #5b7eff;
  background: white;
  box-shadow: 0 0 0 3px rgba(91, 126, 255, 0.1);
}

.input-prefix span {
  padding: 0 15px;
  font-weight: 600;
  color: #666;
  font-size: 1.1rem;
}

.input-prefix input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 16px 12px 0;
}

.input-prefix input:focus {
  outline: none;
  box-shadow: none;
}

textarea.form-control {
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

/* Image Upload */
.image-upload-container {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.image-preview,
.image-upload {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: white;
  border: 2px solid #e0e0e0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: #f44336;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  border: 2px dashed #5b7eff;
  transition: all 0.3s ease;
  background: rgba(91, 126, 255, 0.05);
}

.image-upload:hover {
  background: rgba(91, 126, 255, 0.1);
  border-style: solid;
}

.image-upload i:first-child {
  font-size: 2.5rem;
  color: #5b7eff;
  opacity: 0.5;
}

.image-upload i:last-child {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #5b7eff;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

/* Save Button */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn-save {
  padding: 14px 60px;
  background: #5b7eff;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(91, 126, 255, 0.3);
}

.btn-save:hover {
  background: #4a6eef;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(91, 126, 255, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .product-form-card {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .image-preview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
