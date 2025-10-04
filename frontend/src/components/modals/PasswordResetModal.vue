<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Reset Password</h3>
        <button @click="closeModal" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="handleReset" class="reset-form">
          <div class="form-group">
            <label for="resetEmail" class="form-label">Email Address</label>
            <input
              id="resetEmail"
              type="email"
              v-model="email"
              class="form-control"
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div class="info-message">
            <i class="fas fa-info-circle"></i>
            <span>We will send you an email to reset your password</span>
          </div>
          
          <button
            type="submit"
            class="btn btn-primary submit-btn"
            :disabled="isLoading || !email"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin"></i>
              Sending...
            </span>
            <span v-else>SUBMIT</span>
          </button>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div v-if="success" class="success-message">
            {{ success }}
          </div>
        </form>
        
        <div class="back-to-login">
          <button @click="backToLogin" class="link-btn">
            <i class="fas fa-arrow-left"></i>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'PasswordResetModal',
  data() {
    return {
      email: '',
      isLoading: false,
      error: '',
      success: ''
    }
  },
  methods: {
    ...mapMutations(['hidePasswordResetModal', 'showLoginModal']),
    ...mapActions(['resetPassword']),
    
    closeModal() {
      this.hidePasswordResetModal()
      this.resetForm()
    },
    
    async handleReset() {
      if (!this.email) {
        this.error = 'Please enter your email address.'
        return
      }
      
      this.isLoading = true
      this.error = ''
      this.success = ''
      
      try {
        const result = await this.resetPassword(this.email)
        if (result.success) {
          this.success = result.message || 'Password reset email sent successfully!'
          // Close modal after 3 seconds
          setTimeout(() => {
            this.closeModal()
          }, 3000)
        } else {
          this.error = result.message || 'Failed to send reset email. Please try again.'
        }
      } catch (error) {
        this.error = 'An error occurred. Please try again.'
      } finally {
        this.isLoading = false
      }
    },
    
    backToLogin() {
      this.hidePasswordResetModal()
      this.showLoginModal()
    },
    
    resetForm() {
      this.email = ''
      this.error = ''
      this.success = ''
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.reset-form {
  margin-bottom: 1.5rem;
}

.info-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--secondary-blue);
  color: var(--primary-blue);
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.info-message i {
  font-size: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.error-message {
  color: var(--danger);
  font-size: 0.875rem;
  text-align: center;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(220, 53, 69, 0.1);
  border-radius: var(--border-radius);
}

.success-message {
  color: var(--success);
  font-size: 0.875rem;
  text-align: center;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(40, 167, 69, 0.1);
  border-radius: var(--border-radius);
}

.back-to-login {
  text-align: center;
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary-blue);
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease;
}

.link-btn:hover {
  background: var(--gray-50);
  color: var(--primary-blue-dark);
}

.link-btn i {
  font-size: 0.75rem;
}
</style>
