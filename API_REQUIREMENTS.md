# COMPHILITY - Backend API Requirements

## Overview
This document outlines the API endpoints required by the COMPHILITY frontend application. The frontend is built with Vue.js 3 and expects REST API responses in JSON format.

## Base Configuration
- **Base URL**: `http://localhost:3000/api` (development)
- **Content-Type**: `application/json`
- **Authentication**: Bearer token (JWT recommended)

## Authentication Endpoints

### POST /auth/login
**Purpose**: User login
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

### POST /auth/register
**Purpose**: User registration
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
**Response**: Same as login

### POST /auth/reset-password
**Purpose**: Password reset request
**Request Body**:
```json
{
  "email": "user@example.com"
}
```
**Response**:
```json
{
  "message": "Password reset email sent successfully"
}
```

### PUT /auth/change-password
**Purpose**: Change user password (requires authentication)
**Request Body**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Product Endpoints

### GET /products
**Purpose**: Get all products with filtering
**Query Parameters**:
- `category`: Filter by category
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `search`: Search term
- `page`: Page number for pagination
- `limit`: Items per page
- `sortBy`: Sort field (price, name, rating)
- `sortOrder`: asc or desc

**Response**:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Intel Core i5-12400F",
      "description": "High-performance processor...",
      "price": 12999.00,
      "originalPrice": 14999.00,
      "image": "https://example.com/image.jpg",
      "category": "Processor",
      "brand": "Intel",
      "inStock": true,
      "stockQuantity": 15,
      "rating": 4.5,
      "reviewCount": 125,
      "specifications": {
        "cores": 6,
        "threads": 12,
        "baseClock": "2.5 GHz",
        "boostClock": "4.4 GHz"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10
  }
}
```

### GET /products/:id
**Purpose**: Get single product details
**Response**: Single product object (same structure as above)

### GET /products/category/:category
**Purpose**: Get products by category
**Response**: Same as GET /products

### GET /products/search
**Purpose**: Search products
**Query Parameters**: `q` (search query)
**Response**: Same as GET /products

### GET /products/featured
**Purpose**: Get featured products
**Response**: Array of product objects

### GET /products/best-sellers
**Purpose**: Get best-selling products
**Response**: Array of product objects

## Category Endpoints

### GET /categories
**Purpose**: Get all product categories
**Response**:
```json
[
  {
    "id": 1,
    "name": "Components",
    "slug": "components",
    "subcategories": [
      {
        "id": 1,
        "name": "Processor",
        "slug": "processor",
        "count": 25
      }
    ]
  }
]
```

## Cart Endpoints (Requires Authentication)

### GET /cart
**Purpose**: Get user's cart
**Response**:
```json
{
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Intel Core i5-12400F",
        "price": 12999.00,
        "image": "https://example.com/image.jpg"
      },
      "quantity": 2,
      "subtotal": 25998.00
    }
  ],
  "total": 25998.00,
  "itemCount": 2
}
```

### POST /cart/add
**Purpose**: Add item to cart
**Request Body**:
```json
{
  "productId": 1,
  "quantity": 2
}
```

### PUT /cart/items/:itemId
**Purpose**: Update cart item quantity
**Request Body**:
```json
{
  "quantity": 3
}
```

### DELETE /cart/items/:itemId
**Purpose**: Remove item from cart

### DELETE /cart
**Purpose**: Clear entire cart

### POST /cart/coupon
**Purpose**: Apply coupon code
**Request Body**:
```json
{
  "code": "SAVE10"
}
```

### DELETE /cart/coupon
**Purpose**: Remove applied coupon

## Wishlist Endpoints (Requires Authentication)

### GET /wishlist
**Purpose**: Get user's wishlist
**Response**: Array of product objects

### POST /wishlist/add
**Purpose**: Add item to wishlist
**Request Body**:
```json
{
  "productId": 1
}
```

### DELETE /wishlist/items/:productId
**Purpose**: Remove item from wishlist

### DELETE /wishlist
**Purpose**: Clear entire wishlist

### POST /wishlist/move-to-cart
**Purpose**: Move item from wishlist to cart
**Request Body**:
```json
{
  "productId": 1,
  "quantity": 1
}
```

## Order Endpoints (Requires Authentication)

### POST /orders
**Purpose**: Create new order
**Request Body**:
```json
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Manila",
    "state": "NCR",
    "zipCode": "1234",
    "phone": "+63123456789"
  },
  "billingAddress": {
    // Same structure as shipping address
  },
  "paymentMethod": "credit_card",
  "paymentDetails": {
    // Payment-specific details
  }
}
```

### GET /orders
**Purpose**: Get user's orders
**Response**:
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-2024-001",
    "status": "processing",
    "total": 25998.00,
    "createdAt": "2024-01-15T10:30:00Z",
    "items": [
      {
        "product": {
          "id": 1,
          "name": "Intel Core i5-12400F",
          "image": "https://example.com/image.jpg"
        },
        "quantity": 2,
        "price": 12999.00
      }
    ]
  }
]
```

### GET /orders/:id
**Purpose**: Get order details
**Response**: Single order object (expanded)

### PUT /orders/:id/cancel
**Purpose**: Cancel order

### GET /orders/:id/tracking
**Purpose**: Get order tracking information

## Product Review Endpoints

### GET /products/:id/reviews
**Purpose**: Get product reviews
**Response**:
```json
[
  {
    "id": 1,
    "user": {
      "name": "John D.",
      "avatar": "https://example.com/avatar.jpg"
    },
    "rating": 5,
    "title": "Excellent processor!",
    "comment": "Great performance for the price...",
    "createdAt": "2024-01-10T15:30:00Z",
    "helpful": 15
  }
]
```

### POST /products/:id/reviews (Requires Authentication)
**Purpose**: Add product review
**Request Body**:
```json
{
  "rating": 5,
  "title": "Great product!",
  "comment": "Really satisfied with this purchase..."
}
```

## Error Responses

All endpoints should return appropriate HTTP status codes and error messages:

```json
{
  "error": true,
  "message": "Product not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error

## Additional Notes

1. **Authentication**: Use JWT tokens with Bearer authentication
2. **Pagination**: Use page and limit parameters for large datasets
3. **Validation**: Validate all input data and return detailed error messages
4. **CORS**: Enable CORS for frontend domain
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Image Upload**: Consider implementing image upload endpoints for future admin features
7. **Search**: Implement full-text search for products
8. **Caching**: Implement caching for frequently accessed data

## Database Schema Suggestions

### Users Table
- id, name, email, password_hash, role, created_at, updated_at

### Products Table
- id, name, description, price, original_price, category_id, brand, image_url, stock_quantity, rating, review_count, specifications (JSON), created_at, updated_at

### Categories Table
- id, name, slug, parent_id, description, created_at, updated_at

### Cart Items Table
- id, user_id, product_id, quantity, created_at, updated_at

### Orders Table
- id, user_id, order_number, status, total, shipping_address (JSON), billing_address (JSON), created_at, updated_at

### Order Items Table
- id, order_id, product_id, quantity, price, created_at, updated_at

### Reviews Table
- id, user_id, product_id, rating, title, comment, helpful_count, created_at, updated_at

### Wishlist Table
- id, user_id, product_id, created_at, updated_at
