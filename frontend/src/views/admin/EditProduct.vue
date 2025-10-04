<template>
  <div class="edit-product">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        Back
      </button>
      <h1 class="page-title">EDIT PRODUCT</h1>
    </div>
    
    <div class="product-form-card">
      <form @submit.prevent="updateProduct" class="product-form">
        <!-- Product Name -->
        <div class="form-group">
          <label for="productName">Product Name :</label>
          <input
            id="productName"
            v-model="product.name"
            type="text"
            class="form-control editable"
            placeholder="Enter product name"
            required
          />
          <button type="button" class="edit-btn" @click="toggleEdit('name')">
            <i class="fas fa-edit"></i>
          </button>
        </div>
        
        <!-- Price and Stock Row -->
        <div class="form-row">
          <div class="form-group">
            <label for="price">Price :</label>
            <div class="input-prefix editable">
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
              <button type="button" class="edit-btn inline" @click="toggleEdit('price')">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="stock">Stocks :</label>
            <div class="input-wrapper">
              <input
                id="stock"
                v-model.number="product.stock"
                type="number"
                class="form-control editable"
                placeholder="0"
                required
              />
              <button type="button" class="edit-btn inline" @click="toggleEdit('stock')">
                <i class="fas fa-edit"></i>
              </button>
            </div>
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
                <img 
                  :src="image.url" 
                  :alt="`Product image ${index + 1}`"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
                <button 
                  type="button"
                  class="remove-image"
                  @click="removeImage(index)"
                >
                  <i class="fas fa-times"></i>
                </button>
                <div class="image-overlay">
                  <button type="button" class="view-btn" @click="viewImage(image)">
                    <i class="fas fa-expand"></i>
                  </button>
                </div>
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
          <div class="textarea-wrapper">
            <textarea
              id="description"
              v-model="product.description"
              class="form-control editable"
              rows="4"
              placeholder="Enter product description..."
              required
            ></textarea>
            <button type="button" class="edit-btn" @click="toggleEdit('description')">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </div>
        
        <!-- Specifications -->
        <div class="form-group">
          <label for="specifications">Specification :</label>
          <div class="textarea-wrapper">
            <textarea
              id="specifications"
              v-model="product.specifications"
              class="form-control editable"
              rows="8"
              placeholder="Enter specifications (one per line)..."
              required
            ></textarea>
            <button type="button" class="edit-btn" @click="toggleEdit('specifications')">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </div>
        
        <!-- Save Button -->
        <div class="form-actions">
          <button type="submit" class="btn-save">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { productService } from '@/services/productService'

export default {
  name: 'EditProduct',
  data() {
    return {
      product: {
        id: null,
        name: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
        images: [],
        description: '',
        specifications: '',
        currentImage: null
      },
      editableFields: {},
      originalProduct: {},
      loading: false,
      saving: false,
      newImageFile: null
    }
  },
  mounted() {
    console.log('✏️ [EditProduct] Component mounted')
    this.loadProduct()
  },
  methods: {
    async loadProduct() {
      const productId = this.$route.params.id
      console.log('🔄 [EditProduct] Loading product:', productId)
      
      this.loading = true
      
      try {
        const result = await productService.getProductById(productId)
        
        if (result.success) {
          const productData = result.data
          console.log('✅ [EditProduct] Product loaded successfully:', productData)
          
          const imageUrl = productData.image ? this.getImageUrl(productData.image) : null
          console.log('🖼️ [EditProduct] Image path from DB:', productData.image)
          console.log('🖼️ [EditProduct] Constructed image URL:', imageUrl)
          
          this.product = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            stock: productData.stock,
            category: productData.category,
            brand: productData.brand || '',
            description: productData.description || '',
            specifications: productData.specifications || '',
            currentImage: productData.image,
            images: imageUrl ? [{
              url: imageUrl,
              isExisting: true
            }] : []
          }
          
          console.log('📦 [EditProduct] Product images array:', this.product.images)
          
          // Store original for comparison
          this.originalProduct = JSON.parse(JSON.stringify(this.product))
          console.log('📋 [EditProduct] Product data loaded into form')
        } else {
          console.error('❌ [EditProduct] Failed to load product:', result.message)
          alert('Error: ' + result.message)
          this.$router.back()
        }
      } catch (error) {
        console.error('❌ [EditProduct] Error loading product:', error)
        alert('Error loading product')
        this.$router.back()
      } finally {
        this.loading = false
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath) return ''
      if (imagePath.startsWith('http')) return imagePath
      const baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
      return `${baseURL}${imagePath}`
    },
    goBack() {
      console.log('⬅️ [EditProduct] Going back')
      this.$router.back()
    },
    toggleEdit(field) {
      // Toggle edit mode for specific field
      this.$set(this.editableFields, field, !this.editableFields[field])
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleImageUpload(event) {
      const files = event.target.files
      console.log('🖼️ [EditProduct] New image selected:', files.length)
      
      if (files.length > 0) {
        const file = files[0]
        console.log('📷 [EditProduct] Processing new image:', file.name, file.size, 'bytes')
        
        this.newImageFile = file
        
        const reader = new FileReader()
        reader.onload = (e) => {
          // Replace existing image with new one
          this.product.images = [{
            file: file,
            url: e.target.result,
            isNew: true
          }]
          console.log('✅ [EditProduct] New image preview loaded')
        }
        reader.readAsDataURL(file)
      }
      
      // Reset input
      event.target.value = ''
    },
    removeImage(index) {
      console.log('🗑️ [EditProduct] Removing image at index:', index)
      this.product.images.splice(index, 1)
      this.newImageFile = null
    },
    viewImage(image) {
      console.log('👁️ [EditProduct] Viewing image:', image.url)
      window.open(image.url, '_blank')
    },
    handleImageError(event) {
      console.error('❌ [EditProduct] Image failed to load')
      console.error('   - Image src:', event.target.src)
      console.error('   - Image element:', event.target)
      event.target.style.border = '2px solid red'
    },
    handleImageLoad(event) {
      console.log('✅ [EditProduct] Image loaded successfully:', event.target.src)
    },
    async updateProduct() {
      console.log('💾 [EditProduct] Update product initiated')
      console.log('📋 [EditProduct] Product data:', {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        stock: this.product.stock,
        category: this.product.category,
        hasNewImage: !!this.newImageFile
      })
      
      // Validate form
      if (!this.product.name || !this.product.price || !this.product.stock || !this.product.category) {
        console.error('❌ [EditProduct] Validation failed - missing required fields')
        alert('Please fill all required fields')
        return
      }
      
      this.saving = true
      console.log('🔄 [EditProduct] Calling API to update product...')
      
      try {
        // Prepare product data
        const productData = {
          name: this.product.name,
          description: this.product.description,
          price: parseFloat(this.product.price),
          stock: parseInt(this.product.stock),
          category: this.product.category,
          brand: this.product.brand || '',
          specifications: this.product.specifications ? {
            details: this.product.specifications
          } : null
        }
        
        // Add new image if selected
        if (this.newImageFile) {
          productData.image = this.newImageFile
          console.log('🖼️ [EditProduct] Including new image in update')
        }
        
        console.log('📤 [EditProduct] Sending update to API')
        const result = await productService.updateProduct(this.product.id, productData)
        
        if (result.success) {
          console.log('✅ [EditProduct] Product updated successfully!')
          console.log('📦 [EditProduct] Updated product:', result.data)
          
          // Show success message
          alert('Product updated successfully!')
          
          // Navigate back to product management
          console.log('🔙 [EditProduct] Navigating back to product management')
          this.$router.push('/admin/products')
        } else {
          console.error('❌ [EditProduct] Failed to update product:', result.message)
          alert('Error: ' + result.message)
        }
      } catch (error) {
        console.error('❌ [EditProduct] Error updating product:', error)
        alert('Error updating product. Please try again.')
      } finally {
        this.saving = false
        console.log('🏁 [EditProduct] Update process finished')
      }
    }
  }
}
</script>

<style scoped>
.edit-product {
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
  position: relative;
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

.form-control.editable {
  padding-right: 45px;
}

.form-control:focus {
  outline: none;
  border-color: #5b7eff;
  background: white;
  box-shadow: 0 0 0 3px rgba(91, 126, 255, 0.1);
}

.edit-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 30px;
  height: 30px;
  background: #5b7eff;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #4a6eef;
  transform: scale(1.1);
}

.edit-btn.inline {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  bottom: auto;
}

.input-wrapper {
  position: relative;
}

.textarea-wrapper {
  position: relative;
}

.textarea-wrapper .edit-btn {
  bottom: 10px;
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
  position: relative;
  padding-right: 40px;
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

.image-preview:hover .image-overlay {
  opacity: 1;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.view-btn {
  width: 40px;
  height: 40px;
  background: white;
  color: #333;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.view-btn:hover {
  transform: scale(1.1);
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
  z-index: 10;
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
