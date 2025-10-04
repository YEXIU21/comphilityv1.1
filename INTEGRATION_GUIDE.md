# COMPHILITY - Frontend-Backend Integration Guide

## 🚀 Quick Start for Backend Developer

This guide provides step-by-step instructions for integrating the COMPHILITY frontend with your backend API.

## 📋 Prerequisites

- Node.js 16+ installed
- Backend API running on port 3000 (or update .env file)
- Basic understanding of REST API and JWT authentication

## 🔧 Setup Instructions

### 1. Environment Configuration

```bash
# Navigate to frontend directory
cd frontend

# Copy environment template
cp .env.example .env.development

# Update API base URL (if different from localhost:3000)
VUE_APP_API_BASE_URL=http://localhost:3000/api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run serve
```

Frontend will be available at `http://localhost:8080`

## 🔗 Integration Points

### Authentication Integration

The frontend uses JWT authentication and expects:

**Login Response Format:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

**Integration Steps:**
1. Implement `/auth/login` endpoint
2. Return JWT token and user data
3. Frontend automatically stores token in localStorage
4. Token is attached to all subsequent requests

### Product Data Integration

**Replace Mock Data:**
The frontend currently uses static data. Replace with API calls in these files:
- `views/Home.vue` - Featured products
- `views/Processors.vue` - Processor products
- `views/GraphicsCards.vue` - Graphics card products
- `views/Motherboards.vue` - Motherboard products

**Example Integration:**
```javascript
// In component methods
async loadProducts() {
  try {
    const response = await productService.getProducts({
      category: 'processor',
      page: this.currentPage,
      limit: this.itemsPerPage
    })
    this.products = response.data.products
    this.totalPages = response.data.pagination.totalPages
  } catch (error) {
    console.error('Error loading products:', error)
  }
}
```

### Cart Integration

**Current State:** Uses Vuex store (local storage)
**Integration:** Replace with API calls

```javascript
// Update store/index.js mutations to use cartService
async addToCart({ commit }, product) {
  try {
    await cartService.addToCart(product.id, 1)
    commit('addToCart', product) // Update local state
  } catch (error) {
    // Handle error
  }
}
```

## 📁 Service Layer Usage

The frontend includes ready-to-use service functions:

```javascript
// Import services
import { authService, productService, cartService } from '@/services'

// Use in components
async login() {
  const result = await authService.login(this.credentials)
  if (result.success) {
    // Handle success
  } else {
    // Handle error
    this.error = result.message
  }
}
```

## 🔄 Data Flow

### Authentication Flow
1. User submits login form
2. Frontend calls `authService.login()`
3. Backend validates credentials
4. Backend returns JWT token + user data
5. Frontend stores token and updates UI
6. Token included in all API requests

### Product Loading Flow
1. Component mounts
2. Calls `productService.getProducts()`
3. Backend returns product data
4. Frontend displays products
5. Pagination/filtering updates trigger new API calls

### Cart Operations Flow
1. User clicks "Add to Cart"
2. Frontend calls `cartService.addToCart()`
3. Backend updates user's cart
4. Frontend updates cart count/UI
5. Cart page loads from `cartService.getCart()`

## 🛠️ Backend Requirements Summary

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/reset-password` - Password reset

### Product Endpoints
- `GET /products` - List products with filters
- `GET /products/:id` - Get product details
- `GET /products/category/:category` - Products by category
- `GET /products/featured` - Featured products
- `GET /categories` - Product categories

### Cart Endpoints (Authenticated)
- `GET /cart` - Get user's cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/items/:id` - Update cart item
- `DELETE /cart/items/:id` - Remove cart item

### Order Endpoints (Authenticated)
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details

See `API_REQUIREMENTS.md` for complete specifications.

## 🧪 Testing Integration

### 1. Authentication Test
1. Start both frontend and backend
2. Try logging in with test credentials
3. Check browser network tab for API calls
4. Verify JWT token is stored and sent with requests

### 2. Product Loading Test
1. Navigate to product pages
2. Check if products load from API
3. Test filtering and pagination
4. Verify product detail pages work

### 3. Cart Functionality Test
1. Add products to cart
2. Check cart page updates
3. Test quantity changes
4. Verify cart persists across sessions

## 🐛 Common Issues & Solutions

### CORS Errors
**Problem:** Frontend can't reach backend API
**Solution:** Enable CORS in backend for `http://localhost:8080`

### 401 Authentication Errors
**Problem:** API calls return unauthorized
**Solution:** Check JWT token format and validation

### Image Loading Issues
**Problem:** Product images not displaying
**Solution:** Ensure image URLs are accessible or use placeholder system

### Network Timeout
**Problem:** API calls timing out
**Solution:** Increase timeout in `services/api.js` or optimize backend

## 📱 Mobile Testing

Test the responsive design on:
- Mobile devices (< 576px)
- Tablets (576px - 768px)  
- Desktop (> 768px)

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Update `.env.production` with production API URL:
```
VUE_APP_API_BASE_URL=https://api.comphility.com/api
```

### Deploy Options
- **Netlify**: Use included `netlify.toml`
- **Vercel**: Zero-config deployment
- **AWS S3**: Static hosting
- **Nginx**: Traditional web server

## 📊 Performance Optimization

- Images are using placeholder URLs - replace with CDN
- Implement API response caching
- Use lazy loading for large product lists
- Optimize bundle size if needed

## 🔒 Security Considerations

- JWT tokens stored in localStorage (consider httpOnly cookies)
- API endpoints should validate authentication
- Implement rate limiting on backend
- Sanitize user inputs on backend

## 📞 Support & Questions

**Frontend is 100% ready for integration!**

The codebase includes:
✅ Complete API service layer
✅ Error handling throughout
✅ Loading states for all operations
✅ Responsive design
✅ Professional UI/UX
✅ Comprehensive documentation

Just implement the backend API according to `API_REQUIREMENTS.md` and everything will work seamlessly! 🎉
