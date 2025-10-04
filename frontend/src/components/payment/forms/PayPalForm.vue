<template>
  <div class="paypal-form">
    <div class="payment-header">
      <img src="/images/paypal-logo.png" alt="PayPal" class="payment-logo" />
      <div>
        <h4>PayPal</h4>
        <p>Pay securely with your PayPal account</p>
      </div>
    </div>
    
    <div class="coming-soon-notice">
      <div class="notice-icon">
        <i class="fas fa-tools"></i>
      </div>
      <div class="notice-content">
        <h5>Coming Soon</h5>
        <p>PayPal payments are currently under development. This feature will be available in the next update.</p>
        <p class="notice-suggestion">For now, please use Cash on Delivery, GCash, or Maya for your payments.</p>
      </div>
    </div>
    
    <!-- Placeholder PayPal integration area -->
    <div class="placeholder-paypal" style="opacity: 0.5; pointer-events: none;">
      <div class="paypal-button-placeholder">
        <div class="paypal-button-mock">
          <i class="fab fa-paypal"></i>
          PayPal
        </div>
      </div>
      
      <div class="payment-summary">
        <div class="summary-row">
          <span>Amount to Pay:</span>
          <span class="amount">{{ formatAmount(amount) }}</span>
        </div>
        <div class="summary-note">
          <i class="fas fa-info-circle"></i>
          You will be redirected to PayPal to complete your payment
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayPalForm',
  props: {
    amount: {
      type: Number,
      required: true
    }
  },
  emits: ['payment-data', 'validation'],
  mounted() {
    // Always invalid since it's not implemented yet
    this.$emit('validation', false)
  },
  methods: {
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
.paypal-form {
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

.coming-soon-notice {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.notice-icon {
  width: 40px;
  height: 40px;
  background: #f59e0b;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notice-icon i {
  font-size: 1.125rem;
  color: white;
}

.notice-content h5 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
  font-weight: 600;
}

.notice-content p {
  margin: 0 0 0.5rem 0;
  color: #92400e;
  font-size: 0.875rem;
  line-height: 1.4;
}

.notice-suggestion {
  font-weight: 600;
}

.placeholder-paypal {
  margin-top: 2rem;
}

.paypal-button-placeholder {
  margin-bottom: 2rem;
}

.paypal-button-mock {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #ffc439;
  color: #003087;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: not-allowed;
}

.paypal-button-mock i {
  font-size: 1.5rem;
}

.payment-summary {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
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

@media (max-width: 768px) {
  .coming-soon-notice {
    flex-direction: column;
    text-align: center;
  }
  
  .notice-icon {
    align-self: center;
  }
  
  .summary-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
