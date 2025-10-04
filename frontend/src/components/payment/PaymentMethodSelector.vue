<template>
  <div class="payment-method-selector">
    <h3 class="section-title">
      <i class="fas fa-credit-card"></i>
      Payment Methods
    </h3>
    
    <div class="payment-methods-grid">
      <div 
        v-for="method in availablePaymentMethods" 
        :key="method.id"
        class="payment-method-card"
        :class="{ 
          'active': selectedMethod === method.id,
          'disabled': !method.available 
        }"
        @click="selectPaymentMethod(method.id)"
      >
        <!-- Method Icon/Logo -->
        <div class="payment-icon">
          <img v-if="method.logo" :src="method.logo" :alt="method.name" />
          <i v-else :class="method.icon"></i>
        </div>
        
        <!-- Method Info -->
        <div class="payment-info">
          <div class="method-name">{{ method.name }}</div>
          <div class="method-description">{{ method.description }}</div>
          <div v-if="method.fee > 0" class="method-fee">
            Processing fee: {{ formatPercentage(method.fee) }}
          </div>
        </div>
        
        <!-- Selection Indicator -->
        <div class="selection-indicator">
          <i v-if="selectedMethod === method.id" class="fas fa-check-circle selected"></i>
          <i v-else class="far fa-circle"></i>
        </div>
        
        <!-- Unavailable Overlay -->
        <div v-if="!method.available" class="unavailable-overlay">
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
    
    <!-- Method-specific Forms -->
    <transition name="fade">
      <div v-if="selectedMethod && showPaymentForm" class="payment-form-container">
        <component 
          :is="getPaymentFormComponent(selectedMethod)"
          :payment-method="selectedMethod"
          :amount="amount"
          @payment-data="handlePaymentData"
          @validation="handleValidation"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { paymentService } from '@/services/paymentService'
import GCashForm from './forms/GCashForm.vue'
import MayaForm from './forms/MayaForm.vue'
import StripeForm from './forms/StripeForm.vue'
import PayPalForm from './forms/PayPalForm.vue'
import CODForm from './forms/CODForm.vue'

export default {
  name: 'PaymentMethodSelector',
  components: {
    GCashForm,
    MayaForm,
    StripeForm,
    PayPalForm,
    CODForm
  },
  props: {
    amount: {
      type: Number,
      required: true
    },
    selectedMethod: {
      type: String,
      default: 'cod'
    },
    showPaymentForm: {
      type: Boolean,
      default: true
    }
  },
  emits: ['method-selected', 'payment-data', 'validation-change'],
  data() {
    return {
      paymentMethods: paymentService.getPaymentMethods(),
      paymentData: {}
    }
  },
  computed: {
    availablePaymentMethods() {
      return this.paymentMethods.map(method => ({
        ...method,
        available: this.isMethodAvailable(method.id)
      }))
    }
  },
  methods: {
    selectPaymentMethod(methodId) {
      if (!this.isMethodAvailable(methodId)) return
      
      this.$emit('method-selected', methodId)
    },
    
    isMethodAvailable(methodId) {
      // For now, COD and online methods are available
      // Backend integration will determine actual availability
      const availableMethods = ['cod', 'gcash', 'maya']
      return availableMethods.includes(methodId)
    },
    
    getPaymentFormComponent(methodId) {
      const componentMap = {
        gcash: 'GCashForm',
        maya: 'MayaForm',
        stripe: 'StripeForm',
        paypal: 'PayPalForm',
        cod: 'CODForm'
      }
      return componentMap[methodId] || 'CODForm'
    },
    
    handlePaymentData(data) {
      this.paymentData = data
      this.$emit('payment-data', {
        method: this.selectedMethod,
        ...data
      })
    },
    
    handleValidation(isValid) {
      this.$emit('validation-change', isValid)
    },
    
    formatPercentage(decimal) {
      return (decimal * 100).toFixed(1) + '%'
    }
  }
}
</script>

<style scoped>
.payment-method-selector {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.section-title i {
  color: #3b82f6;
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.payment-method-card {
  position: relative;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
}

.payment-method-card:hover:not(.disabled) {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.payment-method-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.payment-method-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.payment-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
  flex-shrink: 0;
}

.payment-icon img {
  max-width: 40px;
  max-height: 40px;
  object-fit: contain;
}

.payment-icon i {
  font-size: 1.5rem;
  color: #3b82f6;
}

.payment-info {
  flex: 1;
}

.method-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.method-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.method-fee {
  font-size: 0.75rem;
  color: #f59e0b;
  font-weight: 500;
}

.selection-indicator {
  font-size: 1.25rem;
  color: #9ca3af;
}

.selection-indicator .selected {
  color: #3b82f6;
}

.unavailable-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  color: #6b7280;
}

.payment-form-container {
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .payment-methods-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-method-card {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.125rem;
  }
}
</style>
