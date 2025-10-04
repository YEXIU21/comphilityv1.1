<template>
  <div class="maya-form">
    <div class="payment-header">
      <img src="/images/maya-logo.png" alt="Maya" class="payment-logo" />
      <div>
        <h4>Maya Payment</h4>
        <p>Enter your Maya mobile number</p>
      </div>
    </div>
    
    <form @submit.prevent="submitPayment" class="payment-form">
      <div class="form-group">
        <label for="maya-phone">Maya Mobile Number</label>
        <div class="phone-input-wrapper">
          <span class="country-code">+63</span>
          <input
            id="maya-phone"
            v-model="phoneNumber"
            type="tel"
            placeholder="9XX XXX XXXX"
            class="form-input phone-input"
            @input="formatPhoneNumber"
            @blur="validatePhoneNumber"
            :class="{ 'error': phoneError }"
            maxlength="10"
          />
        </div>
        <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
      </div>
      
      <div class="payment-summary">
        <div class="summary-row">
          <span>Amount to Pay:</span>
          <span class="amount">{{ formatAmount(amount) }}</span>
        </div>
        <div class="summary-note">
          <i class="fas fa-info-circle"></i>
          You will receive a payment request on your Maya app
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          type="submit" 
          class="btn btn-primary pay-button"
          :disabled="!isFormValid || isProcessing"
        >
          <i v-if="isProcessing" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-mobile-alt"></i>
          {{ isProcessing ? 'Processing...' : 'Pay with Maya' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MayaForm',
  props: {
    amount: {
      type: Number,
      required: true
    }
  },
  emits: ['payment-data', 'validation'],
  data() {
    return {
      phoneNumber: '',
      phoneError: '',
      isProcessing: false
    }
  },
  computed: {
    isFormValid() {
      return this.phoneNumber.length === 10 && !this.phoneError
    }
  },
  watch: {
    isFormValid: {
      handler(isValid) {
        this.$emit('validation', isValid)
        if (isValid) {
          this.$emit('payment-data', {
            mayaPhone: '+63' + this.phoneNumber
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    formatPhoneNumber() {
      // Remove non-digits and limit to 10 digits
      this.phoneNumber = this.phoneNumber.replace(/\D/g, '').substring(0, 10)
      this.phoneError = ''
    },
    
    validatePhoneNumber() {
      if (!this.phoneNumber) {
        this.phoneError = 'Mobile number is required'
        return
      }
      
      if (this.phoneNumber.length !== 10) {
        this.phoneError = 'Please enter a valid 10-digit mobile number'
        return
      }
      
      if (!this.phoneNumber.startsWith('9')) {
        this.phoneError = 'Mobile number should start with 9'
        return
      }
      
      this.phoneError = ''
    },
    
    formatAmount(amount) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
      }).format(amount)
    },
    
    async submitPayment() {
      if (!this.isFormValid) return
      
      this.isProcessing = true
      try {
        // Emit payment data for parent component to handle
        this.$emit('payment-data', {
          mayaPhone: '+63' + this.phoneNumber,
          validated: true
        })
      } finally {
        this.isProcessing = false
      }
    }
  }
}
</script>

<style scoped>
.maya-form {
  max-width: 500px;
}

.payment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.payment-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.payment-header h4 {
  margin: 0;
  color: #1f2937;
  font-weight: 600;
}

.payment-header p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.phone-input-wrapper {
  display: flex;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.phone-input-wrapper:focus-within {
  border-color: #3b82f6;
}

.country-code {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  border-right: 1px solid #d1d5db;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
}

.phone-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.phone-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.payment-summary {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.amount {
  font-weight: 700;
  color: #059669;
}

.summary-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.summary-note i {
  color: #3b82f6;
}

.pay-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  background: #00c853;
  border: none;
  border-radius: 8px;
  color: white;
  transition: all 0.2s ease;
}

.pay-button:hover:not(:disabled) {
  background: #00a844;
  transform: translateY(-1px);
}

.pay-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}
</style>
