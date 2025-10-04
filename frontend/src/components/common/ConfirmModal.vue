<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <div class="modal-icon" :class="type">
            <i v-if="type === 'danger'" class="fas fa-exclamation-triangle"></i>
            <i v-else-if="type === 'warning'" class="fas fa-exclamation-circle"></i>
            <i v-else-if="type === 'info'" class="fas fa-info-circle"></i>
            <i v-else class="fas fa-question-circle"></i>
          </div>
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" @click="cancel">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="cancel">
            {{ cancelText }}
          </button>
          <button class="btn btn-confirm" :class="type" @click="confirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Are you sure?'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    type: {
      type: String,
      default: 'danger',
      validator: (value) => ['danger', 'warning', 'info', 'default'].includes(value)
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    },
    handleOverlayClick() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  padding: 24px 24px 16px;
  text-align: center;
  position: relative;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 28px;
}

.modal-icon.danger {
  background: #fee2e2;
  color: #dc2626;
}

.modal-icon.warning {
  background: #fef3c7;
  color: #f59e0b;
}

.modal-icon.info {
  background: #dbeafe;
  color: #3b82f6;
}

.modal-icon.default {
  background: #f3f4f6;
  color: #6b7280;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 0 24px 24px;
  text-align: center;
}

.modal-message {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  min-width: 120px;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-confirm {
  color: white;
}

.btn-confirm.danger {
  background: #dc2626;
}

.btn-confirm.danger:hover {
  background: #b91c1c;
}

.btn-confirm.warning {
  background: #f59e0b;
}

.btn-confirm.warning:hover {
  background: #d97706;
}

.btn-confirm.info {
  background: #3b82f6;
}

.btn-confirm.info:hover {
  background: #2563eb;
}

.btn-confirm.default {
  background: #6b7280;
}

.btn-confirm.default:hover {
  background: #4b5563;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modalSlideIn 0.3s ease-out;
}

.modal-fade-leave-active .modal-container {
  animation: modalSlideOut 0.3s ease-in;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes modalSlideOut {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(-50px) scale(0.9);
    opacity: 0;
  }
}
</style>
