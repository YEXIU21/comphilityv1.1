<template>
  <div class="stripe-form">
    <div class="payment-header">
      <div class="payment-icon">
        <i class="fas fa-credit-card"></i>
      </div>
      <div>
        <h4>Credit/Debit Card</h4>
        <p>Secure payment powered by Stripe</p>
      </div>
    </div>
    
    <div class="coming-soon-notice">
      <div class="notice-icon">
        <i class="fas fa-tools"></i>
      </div>
      <div class="notice-content">
        <h5>Coming Soon</h5>
        <p>Credit card payments are currently under development. This feature will be available in the next update.</p>
        <p class="notice-suggestion">For now, please use Cash on Delivery, GCash, or Maya for your payments.</p>
      </div>
    </div>
    
    <!-- Placeholder form structure -->
    <div class="placeholder-form" style="opacity: 0.5; pointer-events: none;">
      <div class="form-group">
        <label>Card Number</label>
        <input type="text" placeholder="1234 5678 9012 3456" class="form-input" disabled />
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Expiry Date</label>
          <input type="text" placeholder="MM/YY" class="form-input" disabled />
        </div>
        <div class="form-group">
          <label>CVC</label>
          <input type="text" placeholder="123" class="form-input" disabled />
        </div>
      </div>
      
      <div class="form-group">
        <label>Cardholder Name</label>
        <input type="text" placeholder="John Doe" class="form-input" disabled />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StripeForm',
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
  }
}
</script>

<style scoped>
.stripe-form {
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
  color: #6366f1;
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

.placeholder-form {
  margin-top: 2rem;
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

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .coming-soon-notice {
    flex-direction: column;
    text-align: center;
  }
  
  .notice-icon {
    align-self: center;
  }
}
</style>
