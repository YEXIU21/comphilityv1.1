/**
 * Generate placeholder image as data URI
 * This avoids external dependencies on via.placeholder.com
 */

export function generatePlaceholder(width = 300, height = 200, text = 'No Image', bgColor = 'E5E7EB', textColor = '6B7280') {
  // Create canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  // Draw background
  ctx.fillStyle = `#${bgColor}`
  ctx.fillRect(0, 0, width, height)
  
  // Draw text
  ctx.fillStyle = `#${textColor}`
  ctx.font = `${Math.min(width, height) / 10}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
  
  // Return data URI
  return canvas.toDataURL('image/png')
}

/**
 * Predefined placeholder images for common use cases
 */
export const placeholders = {
  product: generatePlaceholder(300, 200, 'No Image', 'E5E7EB', '6B7280'),
  processor: generatePlaceholder(300, 200, 'Processor', 'E5E7EB', '6B7280'),
  motherboard: generatePlaceholder(300, 200, 'Motherboard', 'E5E7EB', '6B7280'),
  graphics: generatePlaceholder(300, 200, 'Graphics Card', 'E5E7EB', '6B7280'),
  wishlist: generatePlaceholder(200, 150, 'Wishlist Item', 'E5E7EB', '6B7280'),
  cart: generatePlaceholder(80, 80, 'Product', 'E5E7EB', '6B7280'),
  order: generatePlaceholder(60, 60, 'Order', 'E5E7EB', '6B7280'),
  thumbnail: generatePlaceholder(60, 60, 'Item', 'E5E7EB', '6B7280'),
  small: generatePlaceholder(200, 200, 'Image', 'E5E7EB', '6B7280')
}

/**
 * Get placeholder image URL with fallback
 * @param {string} imageUrl - Original image URL
 * @param {string} placeholderType - Type of placeholder (product, processor, etc.)
 * @returns {string} Image URL or placeholder data URI
 */
export function getImageWithFallback(imageUrl, placeholderType = 'product') {
  if (imageUrl && !imageUrl.includes('via.placeholder.com')) {
    return imageUrl
  }
  return placeholders[placeholderType] || placeholders.product
}

export default {
  generatePlaceholder,
  placeholders,
  getImageWithFallback
}
