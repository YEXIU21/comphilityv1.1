# Placeholder Image Error Fix

## Problem
The application was trying to load placeholder images from `via.placeholder.com` which resulted in `ERR_NAME_NOT_RESOLVED` errors. This happened because:
- The external service was unavailable or blocked
- Network/DNS issues preventing access to the domain
- Multiple components were using these external placeholders

## Solution
Implemented a **local placeholder image generator** that creates images on-the-fly using HTML5 Canvas, eliminating the dependency on external services.

## What Was Changed

### 1. Created Placeholder Utility (`/frontend/src/utils/placeholder.js`)
- Generates placeholder images as data URIs using Canvas API
- No external dependencies required
- Customizable colors, sizes, and text
- Pre-generated common placeholders for performance

### 2. Created Image Fallback Mixin (`/frontend/src/mixins/imageFallback.js`)
- Reusable mixin for handling image errors
- Provides `getSafeImageUrl()` method to replace via.placeholder URLs
- Provides `handleImageError()` method for @error events
- Easy to add to any component

### 3. Updated Components
All components now use the local placeholder system:

**Product Views:**
- ✅ `Processors.vue`
- ✅ `Motherboards.vue`
- ✅ `GraphicsCards.vue`

**Shopping Views:**
- ✅ `Cart.vue`
- ✅ `Wishlist.vue`
- ✅ `Checkout.vue`

**User Views:**
- ✅ `Profile.vue`
- ✅ `Home.vue`

## How It Works

### Before (External Dependency):
```vue
<img :src="product.image || 'https://via.placeholder.com/300x200/E5E7EB/6B7280?text=No+Image'" />
```
❌ Fails if via.placeholder.com is unreachable

### After (Local Generation):
```vue
<img 
  :src="getSafeImageUrl(product.image, 'processor')" 
  @error="handleImageError($event, 'processor')"
/>
```
✅ Always works, no external dependencies

## Usage in New Components

### Step 1: Import the Mixin
```javascript
import imageFallback from '@/mixins/imageFallback'

export default {
  name: 'YourComponent',
  mixins: [imageFallback],
  // ...
}
```

### Step 2: Use in Template
```vue
<img 
  :src="getSafeImageUrl(item.image, 'product')" 
  :alt="item.name"
  @error="handleImageError($event, 'product')"
/>
```

### Available Placeholder Types:
- `product` - Generic product (300x200)
- `processor` - Processor placeholder
- `motherboard` - Motherboard placeholder
- `graphics` - Graphics card placeholder
- `wishlist` - Wishlist item (200x150)
- `cart` - Cart item (80x80)
- `order` - Order item (60x60)
- `thumbnail` - Small thumbnail (60x60)
- `small` - Small image (200x200)

## Custom Placeholders

You can also generate custom placeholders:

```javascript
import { generatePlaceholder } from '@/utils/placeholder'

// Generate a custom placeholder
const customImage = generatePlaceholder(
  400,           // width
  300,           // height
  'Custom Text', // text
  'FF6B35',      // background color (hex without #)
  'FFFFFF'       // text color (hex without #)
)
```

## Benefits

✅ **No External Dependencies** - Works offline  
✅ **No Network Errors** - No DNS resolution needed  
✅ **Fast Loading** - Data URIs load instantly  
✅ **Customizable** - Easy to change colors and text  
✅ **Consistent** - Same placeholder style across the app  
✅ **Error Handling** - Automatic fallback on image load failures  

## Testing

1. **Clear browser cache** to remove any cached via.placeholder images
2. **Refresh the application**
3. **Check browser console** - No more `ERR_NAME_NOT_RESOLVED` errors
4. **View product pages** - Placeholders should display correctly
5. **Test offline** - Placeholders still work without internet

## Performance

- Placeholders are generated once and cached in memory
- Data URIs are small (typically 2-5KB)
- No HTTP requests needed
- Instant rendering

## Maintenance

To add new placeholder types, edit `/frontend/src/utils/placeholder.js`:

```javascript
export const placeholders = {
  // ... existing placeholders
  newType: generatePlaceholder(300, 200, 'New Type', 'E5E7EB', '6B7280')
}
```

Then use it in components:
```vue
<img :src="getSafeImageUrl(item.image, 'newType')" />
```
