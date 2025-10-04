<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Signup</h3>
        <button @click="closeModal" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="name-row">
            <div class="form-group">
              <label for="firstName" class="form-label">Name :</label>
              <input
                id="firstName"
                type="text"
                v-model="signupData.firstName"
                class="form-control"
                placeholder="First Name"
                required
              />
            </div>
            <div class="form-group">
              <label for="lastName" class="form-label">LastName :</label>
              <input
                id="lastName"
                type="text"
                v-model="signupData.lastName"
                class="form-control"
                placeholder="Last Name"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="signupPassword" class="form-label">Password :</label>
            <input
              id="signupPassword"
              type="password"
              v-model="signupData.password"
              class="form-control"
              placeholder="Create a password"
              required
              minlength="6"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Re-Enter Password :</label>
            <input
              id="confirmPassword"
              type="password"
              v-model="signupData.confirmPassword"
              class="form-control"
              placeholder="Confirm your password"
              required
              minlength="6"
            />
          </div>
          
          <div class="form-group">
            <label for="signupEmail" class="form-label">Email Address :</label>
            <input
              id="signupEmail"
              type="email"
              v-model="signupData.email"
              class="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button
            type="submit"
            class="btn btn-primary signup-btn"
            :disabled="isLoading || !isFormValid"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin"></i>
              Creating Account...
            </span>
            <span v-else>Continue</span>
          </button>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
        
        <div class="divider">
          <span>Or Continue With</span>
        </div>
        
        <div class="social-signup">
          <button @click="signupWithFacebook" class="btn social-btn facebook-btn">
            <i class="fab fa-facebook-f"></i>
            Facebook
          </button>
          <button @click="signupWithGoogle" class="btn social-btn google-btn">
            <i class="fab fa-google"></i>
            Google
          </button>
        </div>
        
        <div class="login-link">
          <p>Already have an account? 
            <button @click="switchToLogin" class="link-btn">Login here</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'SignupModal',
  data() {
    return {
      signupData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      isLoading: false,
      error: ''
    }
  },
  computed: {
    isFormValid() {
      return (
        this.signupData.firstName &&
        this.signupData.lastName &&
        this.signupData.email &&
        this.signupData.password &&
        this.signupData.confirmPassword &&
        this.signupData.password === this.signupData.confirmPassword &&
        this.signupData.password.length >= 6
      )
    }
  },
  methods: {
    ...mapMutations(['hideSignupModal', 'showLoginModal']),
    ...mapActions(['signup']),
    
    closeModal() {
      this.hideSignupModal()
      this.resetForm()
    },
    
    async handleSignup() {
      if (!this.isFormValid) {
        this.error = 'Please fill in all fields correctly.'
        return
      }
      
      if (this.signupData.password !== this.signupData.confirmPassword) {
        this.error = 'Passwords do not match.'
        return
      }
      
      this.isLoading = true
      this.error = ''
      
      try {
        const userData = {
          name: `${this.signupData.firstName} ${this.signupData.lastName}`,
          email: this.signupData.email,
          password: this.signupData.password,
          confirmPassword: this.signupData.confirmPassword
        }
        
        const result = await this.signup(userData)
        if (result.success) {
          this.closeModal()
          
          // Check if user is admin and redirect to admin dashboard
          const userStr = localStorage.getItem('user')
          if (userStr) {
            const user = JSON.parse(userStr)
            if (user.role === 'admin') {
              console.log('👑 [SignupModal] Admin user detected, redirecting to admin dashboard')
              this.$router.push('/admin/dashboard')
            }
          }
        } else {
          this.error = result.message || 'Signup failed. Please try again.'
        }
      } catch (error) {
        this.error = 'An error occurred. Please try again.'
      } finally {
        this.isLoading = false
      }
    },
    
    switchToLogin() {
      this.hideSignupModal()
      this.showLoginModal()
    },
    
    signupWithFacebook() {
      // Facebook OAuth integration - to be implemented
      alert('Facebook signup will be available after backend integration')
    },
    
    signupWithGoogle() {
      // Google OAuth integration - to be implemented
      alert('Google signup will be available after backend integration')
    },
    
    resetForm() {
      this.signupData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
      this.error = ''
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.signup-form {
  margin-bottom: 1.5rem;
}

.name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.signup-btn {
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

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
  color: var(--gray-500);
  font-size: 0.875rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gray-200);
  z-index: 1;
}

.divider span {
  background: var(--white);
  padding: 0 1rem;
  position: relative;
  z-index: 2;
}

.social-signup {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-weight: 500;
  border: 2px solid var(--gray-200);
}

.facebook-btn {
  background: #1877F2;
  border-color: #1877F2;
  color: var(--white);
}

.facebook-btn:hover {
  background: #166FE5;
  border-color: #166FE5;
}

.google-btn {
  background: #DB4437;
  border-color: #DB4437;
  color: var(--white);
}

.google-btn:hover {
  background: #C23321;
  border-color: #C23321;
}

.login-link {
  text-align: center;
  color: var(--gray-600);
  font-size: 0.875rem;
}

.login-link p {
  margin: 0;
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary-blue);
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  padding: 0;
}

.link-btn:hover {
  color: var(--primary-blue-dark);
}

/* Responsive */
@media (max-width: 576px) {
  .name-row {
    grid-template-columns: 1fr;
  }
  
  .social-signup {
    flex-direction: column;
  }
}
</style>
