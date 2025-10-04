# Product Management System - Setup Guide

## Overview

The product management system allows admins to:
- ✅ Create products with image upload
- ✅ Update products (including replacing images)
- ✅ Delete products (automatically deletes images)
- ✅ View all products with pagination
- ✅ Search and filter products
- ✅ Images stored locally in `backend/images` folder

## Installation Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install the new `multer` package for file uploads.

### 2. Restart Backend Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

The server will:
- Create the `products` table in MySQL
- Create the `backend/images` directory
- Start serving images from `http://localhost:3000/images/`

### 3. Verify Setup

Check the console output:
```
[DB] MySQL database initialized successfully
[Server] Serving images from: C:\...\backend\images
COMPHILITY API listening on http://localhost:3000
```

## API Endpoints

### Public Endpoints

**GET /api/products**
- Get all products with pagination
- Query params: `category`, `search`, `page`, `limit`
- Example: `/api/products?category=processor&page=1&limit=10`

**GET /api/products/:id**
- Get single product by ID
- Example: `/api/products/1`

### Admin Endpoints (Requires Authentication)

**POST /api/products**
- Create new product with image
- Headers: `Authorization: Bearer <token>`
- Body: `multipart/form-data`
- Fields:
  - `name` (required)
  - `description`
  - `price` (required)
  - `stock` (required)
  - `category` (required)
  - `brand`
  - `image` (file)
  - `specifications` (JSON string)

**PUT /api/products/:id**
- Update product
- Headers: `Authorization: Bearer <token>`
- Body: `multipart/form-data` (same fields as POST)
- If new image uploaded, old image is automatically deleted

**DELETE /api/products/:id**
- Delete product and its image
- Headers: `Authorization: Bearer <token>`

## Frontend Usage

### Import the Service

```javascript
import { productService } from '@/services/productService'
```

### Create Product

```javascript
const productData = {
  name: 'AMD Ryzen 5 5600X',
  description: '6-Core, 12-Thread Processor',
  price: 5715.00,
  stock: 50,
  category: 'processor',
  brand: 'AMD',
  image: fileObject, // File from <input type="file">
  specifications: {
    cores: 6,
    threads: 12,
    baseClock: '3.7 GHz',
    boostClock: '4.6 GHz'
  }
}

const result = await productService.createProduct(productData)
if (result.success) {
  console.log('Product created:', result.data)
}
```

### Update Product

```javascript
const result = await productService.updateProduct(productId, {
  name: 'Updated Name',
  price: 6000.00,
  stock: 30,
  // ... other fields
  image: newFileObject // Optional: only if changing image
})
```

### Delete Product

```javascript
const result = await productService.deleteProduct(productId)
if (result.success) {
  console.log('Product deleted')
}
```

### Get Products

```javascript
// Get all products
const result = await productService.getProducts({
  category: 'processor',
  search: 'ryzen',
  page: 1,
  limit: 10
})

if (result.success) {
  console.log('Products:', result.data.products)
  console.log('Pagination:', result.data.pagination)
}
```

## Image Upload Component Example

```vue
<template>
  <div class="product-form">
    <input
      type="text"
      v-model="product.name"
      placeholder="Product Name"
    />
    
    <input
      type="number"
      v-model="product.price"
      placeholder="Price"
    />
    
    <input
      type="number"
      v-model="product.stock"
      placeholder="Stock"
    />
    
    <select v-model="product.category">
      <option value="processor">Processor</option>
      <option value="motherboard">Motherboard</option>
      <option value="graphics-card">Graphics Card</option>
      <!-- Add more categories -->
    </select>
    
    <!-- Image Upload -->
    <div class="image-upload">
      <input
        type="file"
        @change="handleImageSelect"
        accept="image/*"
        ref="imageInput"
      />
      
      <!-- Preview -->
      <div v-if="imagePreview" class="image-preview">
        <img :src="imagePreview" alt="Preview" />
        <button @click="removeImage">Remove</button>
      </div>
    </div>
    
    <button @click="submitProduct">Create Product</button>
  </div>
</template>

<script>
import { productService } from '@/services/productService'

export default {
  data() {
    return {
      product: {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'processor',
        brand: '',
        image: null
      },
      imagePreview: null
    }
  },
  methods: {
    handleImageSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.product.image = file
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    removeImage() {
      this.product.image = null
      this.imagePreview = null
      this.$refs.imageInput.value = ''
    },
    
    async submitProduct() {
      const result = await productService.createProduct(this.product)
      
      if (result.success) {
        alert('Product created successfully!')
        this.resetForm()
      } else {
        alert('Error: ' + result.message)
      }
    },
    
    resetForm() {
      this.product = {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'processor',
        brand: '',
        image: null
      }
      this.imagePreview = null
    }
  }
}
</script>
```

## Database Schema

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  image VARCHAR(255),
  specifications JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_name (name)
)
```

## Image Storage

### Location
- **Backend:** `backend/images/`
- **URL:** `http://localhost:3000/images/filename.jpg`

### File Naming
- Format: `product-{timestamp}-{random}.{ext}`
- Example: `product-1696420800000-123456789.jpg`

### Supported Formats
- JPEG/JPG
- PNG
- GIF
- WebP

### File Size Limit
- Maximum: 5MB per image

### Automatic Cleanup
- When product is updated with new image → old image deleted
- When product is deleted → image deleted

## Security

### Authentication Required
All admin endpoints require:
```javascript
headers: {
  'Authorization': 'Bearer <jwt_token>'
}
```

### Role-Based Access
- Only users with `role: 'admin'` can create/update/delete products
- Regular users can only view products

### File Validation
- Only image files allowed
- File size limited to 5MB
- File type validation on both frontend and backend

## Testing

### 1. Test Product Creation

```bash
# Using curl (replace <token> with actual JWT)
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer <token>" \
  -F "name=Test Product" \
  -F "price=100.00" \
  -F "stock=10" \
  -F "category=processor" \
  -F "image=@/path/to/image.jpg"
```

### 2. Test Image Access

```
http://localhost:3000/images/product-1696420800000-123456789.jpg
```

### 3. Test Product Listing

```
http://localhost:3000/api/products
http://localhost:3000/api/products?category=processor
http://localhost:3000/api/products?search=ryzen
```

## Troubleshooting

### Images Not Uploading
1. Check `backend/images` directory exists
2. Check file permissions
3. Check file size (max 5MB)
4. Check file type (must be image)

### Images Not Displaying
1. Verify image URL: `http://localhost:3000/images/filename.jpg`
2. Check backend console for static file serving
3. Check CORS settings

### Database Errors
1. Ensure MySQL is running
2. Check `products` table exists
3. Run backend to auto-create table

### Authentication Errors
1. Ensure user is logged in as admin
2. Check JWT token in localStorage
3. Verify `Authorization` header is sent

## Next Steps

1. **Install dependencies:** `cd backend && npm install`
2. **Restart backend:** `npm run dev`
3. **Test API:** Use Postman or curl
4. **Update frontend:** Integrate with ProductManagement.vue
5. **Add validation:** Form validation on frontend
6. **Add loading states:** Show upload progress
7. **Add error handling:** Display user-friendly errors

## Files Created/Modified

### Backend
- ✅ `backend/src/routes/products.js` - Product API routes
- ✅ `backend/src/middleware/auth.js` - Authentication middleware
- ✅ `backend/src/db.js` - Added products table schema
- ✅ `backend/src/server.js` - Added products routes and static file serving
- ✅ `backend/package.json` - Added multer dependency

### Frontend
- ✅ `frontend/src/services/productService.js` - Added admin methods

### Documentation
- ✅ `PRODUCT_MANAGEMENT_SETUP.md` - This file

## Support

For issues or questions:
1. Check console logs (backend and frontend)
2. Verify all dependencies installed
3. Ensure MySQL is running
4. Check file permissions on `backend/images`
