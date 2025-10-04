<template>
  <div class="image-placeholder" :style="{ width: width, height: height }">
    <div class="placeholder-content">
      <i class="fas fa-image"></i>
      <span v-if="showText">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImagePlaceholder',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    text: {
      type: String,
      default: 'Product Image'
    },
    showText: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.image-placeholder {
  background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  color: var(--gray-400);
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  padding: 1rem;
}

.placeholder-content i {
  font-size: 2rem;
}

.placeholder-content span {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
