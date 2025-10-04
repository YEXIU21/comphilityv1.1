<template>
  <div class="cod-form">
    <div class="payment-header">
      <div class="payment-icon">
        <i class="fas fa-money-bill-wave"></i>
      </div>
      <div>
        <h4>Cash on Delivery</h4>
        <p>Pay when your order is delivered</p>
      </div>
    </div>
    
    <div class="cod-info">
      <div class="info-card">
        <div class="info-icon">
          <i class="fas fa-truck"></i>
        </div>
        <div class="info-content">
          <h5>Delivery Information</h5>
          <p>Your order will be delivered to your address. Payment is due upon delivery.</p>
        </div>
      </div>
      
      <div class="info-card">
        <div class="info-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="info-content">
          <h5>Security</h5>
          <p>Only pay when you receive your order in good condition.</p>
        </div>
      </div>
      
      <div class="info-card">
        <div class="info-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="info-content">
          <h5>Delivery Time</h5>
          <p>Standard delivery: 5-7 business days. Express delivery: 2-3 business days.</p>
        </div>
      </div>
    </div>
    
    <div class="payment-summary">
      <div class="summary-row">
        <span>Amount to Pay on Delivery:</span>
        <span class="amount">{{ formatAmount(amount) }}</span>
      </div>
      <div class="summary-note">
        <i class="fas fa-info-circle"></i>
        Please have the exact amount ready for the delivery rider
      </div>
    </div>
    
    <div class="cod-terms">
      <label class="checkbox-container">
        <input 
          type="checkbox" 
          v-model="agreeToTerms"
          @change="updateValidation"
        />
        <span class="checkmark"></span>
        <span class="checkbox-label">
          I agree to pay the full amount upon delivery and understand that orders are non-refundable once delivered.
        </span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CODForm',
  props: {
    amount: {
      type: Number,
      required: true
    }
  },
  emits: ['payment-data', 'validation'],
  data() {
    return {
      agreeToTerms: false
    }
  },
  computed: {
    isFormValid() {
      return this.agreeToTerms
    }
  },
  mounted() {
    this.updateValidation()
  },
  methods: {
    updateValidation() {
      this.$emit('validation', this.isFormValid)
      if (this.isFormValid) {
        this.$emit('payment-data', {
          method: 'cod',
          termsAccepted: this.agreeToTerms,
          validated: true
        })
      }
    },
    
    formatAmount(amount) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
      }).format(amount)
    }
  }
}
</script>

<style scoped>
.cod-form {
  max-width: 600px;
}

.payment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.payment-icon {
  width: 48px;
  height: 48px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-icon i {
  font-size: 1.5rem;
  color: #059669;
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

.cod-info {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.info-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon i {
  font-size: 1.125rem;
  color: #3b82f6;
}

.info-content h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-weight: 600;
  font-size: 0.875rem;
}

.info-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
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
  color: #f59e0b;
}

.cod-terms {
  padding: 1rem;
  background: #fef3c7;
  border-radius: 8px;
  border: 1px solid #fbbf24;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.checkbox-container:hover .checkmark {
  border-color: #3b82f6;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  color: #92400e;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .summary-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .info-card {
    flex-direction: column;
    text-align: center;
  }
  
  .info-icon {
    align-self: center;
  }
}
</style>
