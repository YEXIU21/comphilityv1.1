import { placeholders } from '@/utils/placeholder'

/**
 * Mixin to handle image loading errors with fallback placeholders
 */
export default {
  methods: {
    /**
     * Handle image error by replacing with placeholder
     * Usage: @error="handleImageError($event, 'product')"
     */
    handleImageError(event, placeholderType = 'product') {
      if (event.target && placeholders[placeholderType]) {
        event.target.src = placeholders[placeholderType]
        event.target.onerror = null // Prevent infinite loop
      }
    },
    
    /**
     * Get safe image URL with fallback
     * Usage: :src="getSafeImageUrl(product.image, 'processor')"
     */
    getSafeImageUrl(imageUrl, placeholderType = 'product') {
      // If no image or it's a via.placeholder.com URL, use local placeholder
      if (!imageUrl || imageUrl.includes('via.placeholder.com')) {
        return placeholders[placeholderType] || placeholders.product
      }
      return imageUrl
    }
  }
}
