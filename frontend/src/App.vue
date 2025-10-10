<template>
  <div id="app">
    <!-- Customer Layout: Only show for non-admin routes -->
    <template v-if="!isAdminRoute">
      <AppHeader />
      <div class="main-content">
        <router-view />
      </div>
      <AppFooter />
      
      <!-- Global Chat Widget (Customer only) -->
      <ChatWidget />
    </template>
    
    <!-- Admin Layout: Only show for admin routes -->
    <template v-else>
      <router-view />
    </template>
    
    <!-- Modals (Available for both customer and admin) -->
    <LoginModal v-if="showLoginModal" @close="hideLoginModal" />
    <SignupModal v-if="showSignupModal" @close="hideSignupModal" />
    <PasswordResetModal v-if="showPasswordResetModal" @close="hidePasswordResetModal" />
  </div>
</template>
<script>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import ChatWidget from './components/chat/ChatWidget.vue'
import LoginModal from './components/modals/LoginModal.vue'
import SignupModal from './components/modals/SignupModal.vue'
import PasswordResetModal from './components/modals/PasswordResetModal.vue'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    ChatWidget,
    LoginModal,
    SignupModal,
    PasswordResetModal
  },
  computed: {
    ...mapState(['showLoginModal', 'showSignupModal', 'showPasswordResetModal']),
    
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    }
  },
  methods: {
    ...mapMutations(['hideLoginModal', 'hideSignupModal', 'hidePasswordResetModal']),
    ...mapActions(['initializeAuth'])
  },
  created() {
    // Initialize authentication state when app starts
    this.initializeAuth()
  }
}
</script>

<style>
@import './assets/styles/variables.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: var(--font-family-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--gray-800);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

body {
  margin: 0;
  background-color: var(--gray-50);
}

/* Global utility classes */
.container {
  max-width: var(--container-xl);
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (min-width: 640px) {
  .container {
    padding: 0 var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--spacing-xl);
  }
}

/* Button base styles (for backward compatibility) */
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
  padding: var(--spacing-sm) var(--spacing-lg);
}

.btn-primary {
  background: var(--primary-blue);
  color: var(--white);
  border-color: var(--primary-blue);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-blue-dark);
  border-color: var(--primary-blue-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: transparent;
  color: var(--primary-blue);
  border-color: var(--primary-blue);
}

.btn-outline:hover:not(:disabled) {
  background: var(--primary-blue);
  color: var(--white);
}

/* Form styles */
.form-input {
  width: 100%;
  padding: var(--form-input-padding);
  border: var(--form-input-border);
  border-radius: var(--border-radius);
  font-size: var(--text-base);
  font-family: var(--font-family-primary);
  transition: border-color var(--duration-fast) var(--ease-out);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: var(--error);
}

/* Animation utilities */
.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus visible for better keyboard navigation */
.btn:focus-visible,
.form-input:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Enhanced Mobile Responsiveness */
@media (max-width: 768px) {
  .btn {
    min-height: 48px;
    padding: 0.875rem 1.25rem;
    font-size: 1rem;
    border-radius: 10px;
  }
  
  .form-input {
    min-height: 48px;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
  }
}

/* iPhone 14 Pro Max (430px width) - Enhanced Mobile Sizing */
@media (max-width: 430px) {
  .container {
    padding: 0 1.25rem;
  }
  
  .btn {
    min-height: var(--btn-mobile-height);
    padding: var(--btn-mobile-padding);
    font-size: var(--btn-mobile-font-size);
    border-radius: var(--btn-mobile-border-radius);
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);
  }
  
  .form-input {
    min-height: 56px;
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    border-radius: 12px;
    border-width: 2px;
  }
  
  .form-input:focus {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn:hover {
    transform: none;
  }
  
  .btn:active {
    transform: scale(0.98);
  }
}

/* Utility classes for mobile */
.mobile-only {
  display: none;
}

.desktop-only {
  display: block;
}

@media (max-width: 768px) {
  .mobile-only {
    display: block;
  }
  
  .desktop-only {
    display: none;
  }
}
</style>
