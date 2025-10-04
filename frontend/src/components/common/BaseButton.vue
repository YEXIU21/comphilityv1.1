<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="htmlType"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner">
      <i class="fas fa-spinner fa-spin"></i>
    </span>
    <span v-if="iconLeft && !loading" class="btn-icon btn-icon-left">
      <i :class="iconLeft"></i>
    </span>
    <span class="btn-content">
      <slot />
    </span>
    <span v-if="iconRight && !loading" class="btn-icon btn-icon-right">
      <i :class="iconRight"></i>
    </span>
  </component>
</template>

<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    // Appearance
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    
    // Behavior
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    
    // Navigation (for router-link or external links)
    to: {
      type: [String, Object],
      default: null
    },
    href: {
      type: String,
      default: null
    },
    
    // HTML attributes
    htmlType: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    },
    
    // Icons
    iconLeft: {
      type: String,
      default: null
    },
    iconRight: {
      type: String,
      default: null
    }
  },
  emits: ['click'],
  computed: {
    tag() {
      if (this.to) return 'router-link'
      if (this.href) return 'a'
      return 'button'
    },
    
    buttonClasses() {
      return [
        'btn',
        `btn-${this.variant}`,
        `btn-${this.size}`,
        {
          'btn-block': this.block,
          'btn-loading': this.loading,
          'btn-disabled': this.disabled
        }
      ]
    }
  },
  methods: {
    handleClick(event) {
      if (this.disabled || this.loading) {
        event.preventDefault()
        return
      }
      this.$emit('click', event)
    }
  }
}
</script>

<style scoped>
/* Base Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-family-primary);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  text-align: center;
  text-decoration: none;
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn:disabled,
.btn.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn.btn-loading {
  cursor: not-allowed;
}

.btn.btn-block {
  width: 100%;
}

/* Button Sizes */
.btn-xs {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-xs);
}

.btn-sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-sm);
}

.btn-md {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--text-base);
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--text-lg);
}

.btn-xl {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--text-xl);
}

/* Button Variants */
.btn-primary {
  background: var(--primary-blue);
  color: var(--white);
  border-color: var(--primary-blue);
}

.btn-primary:hover:not(:disabled):not(.btn-loading) {
  background: var(--primary-blue-dark);
  border-color: var(--primary-blue-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-800);
  border-color: var(--gray-200);
}

.btn-secondary:hover:not(:disabled):not(.btn-loading) {
  background: var(--gray-200);
  border-color: var(--gray-300);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--primary-blue);
  border-color: var(--primary-blue);
}

.btn-outline:hover:not(:disabled):not(.btn-loading) {
  background: var(--primary-blue);
  color: var(--white);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: var(--gray-700);
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled):not(.btn-loading) {
  background: var(--gray-100);
  color: var(--gray-800);
}

.btn-danger {
  background: var(--error);
  color: var(--white);
  border-color: var(--error);
}

.btn-danger:hover:not(:disabled):not(.btn-loading) {
  background: #dc2626;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-success {
  background: var(--success);
  color: var(--white);
  border-color: var(--success);
}

.btn-success:hover:not(:disabled):not(.btn-loading) {
  background: #059669;
  border-color: #059669;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-warning {
  background: var(--warning);
  color: var(--white);
  border-color: var(--warning);
}

.btn-warning:hover:not(:disabled):not(.btn-loading) {
  background: #d97706;
  border-color: #d97706;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Button Icons */
.btn-icon {
  display: flex;
  align-items: center;
}

.btn-spinner {
  display: flex;
  align-items: center;
}

.btn-content {
  display: flex;
  align-items: center;
}

/* Loading State */
.btn-loading .btn-content {
  opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .btn-lg {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--text-base);
  }
  
  .btn-xl {
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--text-lg);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
  
  .btn:hover:not(:disabled):not(.btn-loading) {
    transform: none;
  }
}

/* Focus visible for keyboard navigation */
.btn:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
  box-shadow: none;
}
</style>
