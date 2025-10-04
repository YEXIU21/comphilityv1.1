<template>
  <header class="app-header">
    <div class="container">
      <div class="navbar-content">
        
        <!-- Left Section: Logo -->
        <div class="navbar-left">
          <router-link to="/" class="logo-brand">
            <span class="logo-text">COMPHILITY</span>
          </router-link>
        </div>

        <!-- Center Section: Navigation -->
        <div class="navbar-center">
          <nav class="navigation-menu">
            <router-link to="/" class="nav-item">HOME</router-link>
            <div class="nav-dropdown" @mouseenter="showProductsDropdown" @mouseleave="hideProductsDropdown">
              <span class="nav-item dropdown-trigger">
                PRODUCTS
                <i class="fas fa-chevron-down"></i>
              </span>
              <div v-show="productsDropdownOpen" class="dropdown-menu">
                <div class="dropdown-content">
                  <div v-for="category in categories" :key="category.id" class="category-section">
                    <h4 class="category-title">{{ category.name }}</h4>
                    <ul class="subcategory-list">
                      <li v-for="subcategory in category.subcategories" :key="subcategory">
                        <a href="#" class="subcategory-link">{{ subcategory }}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <router-link to="/build-pc" class="nav-item">BUILD PC</router-link>
            <router-link to="/laptops" class="nav-item">LAPTOPS</router-link>
            <router-link to="/pc-sets" class="nav-item">PC SETS</router-link>
          </nav>
        </div>

        <!-- Right Section: Search & Icons -->
        <div class="navbar-right">
          <!-- Enhanced Search Box -->
          <div class="search-container">
            <div class="search-box">
              <div class="search-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  v-model="searchQuery"
                  @keyup.enter="performSearch"
                  @focus="onSearchFocus"
                  @blur="onSearchBlur"
                  class="search-field"
                />
              </div>
              <button @click="performSearch" class="search-button" :disabled="!searchQuery.trim()">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>

          <!-- Action Icons -->
          <div class="action-bar">
            <button class="action-icon delivery-icon" title="Track Delivery">
              <i class="fas fa-truck"></i>
            </button>
            
            <router-link to="/wishlist" class="action-icon wishlist-icon" title="Wishlist">
              <i class="fas fa-heart"></i>
              <span v-if="wishlistCount > 0" class="notification-badge">{{ wishlistCount }}</span>
            </router-link>
            
            <router-link to="/cart" class="action-icon cart-icon" title="Shopping Cart">
              <i class="fas fa-shopping-cart"></i>
              <span v-if="cartItemCount > 0" class="notification-badge">{{ cartItemCount }}</span>
            </router-link>

            <!-- Admin Button (only for admin users) -->
            <div v-if="isAdmin" class="admin-button-container" @click="toggleUserDropdown" v-click-outside="hideUserDropdown">
              <button class="admin-btn">
                <i class="fas fa-user-shield"></i>
                <span>Admin</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <div v-show="showUserDropdown" class="user-dropdown admin-dropdown-nav">
                <router-link to="/admin/dashboard" class="dropdown-item">
                  <i class="fas fa-tachometer-alt"></i>
                  Dashboard
                </router-link>
                <router-link to="/profile" class="dropdown-item">
                  <i class="fas fa-cog"></i>
                  Settings
                </router-link>
                <hr class="dropdown-divider">
                <button @click="logout" class="dropdown-item">
                  <i class="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>

            <!-- Regular User Icon (only for non-admin users) -->
            <div v-else class="user-dropdown-container" @click="toggleUserDropdown" v-click-outside="hideUserDropdown">
              <button class="action-icon user-icon">
                <i class="fas fa-user"></i>
              </button>
              <div v-show="showUserDropdown" class="user-dropdown">
                <div v-if="!isAuthenticated" class="auth-options">
                  <button @click="openSignupModal" class="dropdown-item">Sign Up</button>
                  <button @click="openLoginModal" class="dropdown-item">Login</button>
                </div>
                <div v-else class="user-options">
                  <router-link to="/profile" class="dropdown-item">My Profile</router-link>
                  <router-link to="/wishlist" class="dropdown-item">My Wishlist</router-link>
                  <router-link to="/cart" class="dropdown-item">My Cart</router-link>
                  <hr class="dropdown-divider">
                  <button @click="logout" class="dropdown-item">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" @click="toggleMobileMenu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="mobileMenuOpen" class="mobile-menu">
      <div class="mobile-nav">
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">HOME</router-link>
        <router-link to="/products" class="mobile-nav-link" @click="closeMobileMenu">PRODUCTS</router-link>
        <router-link to="/build-pc" class="mobile-nav-link" @click="closeMobileMenu">BUILD PC</router-link>
        <router-link to="/laptops" class="mobile-nav-link" @click="closeMobileMenu">LAPTOPS</router-link>
        <router-link to="/pc-sets" class="mobile-nav-link" @click="closeMobileMenu">PC SETS</router-link>
      </div>
      <div class="mobile-auth">
        <button v-if="!isAuthenticated" @click="openLoginModal" class="btn btn-primary">Login</button>
        <button v-if="!isAuthenticated" @click="openSignupModal" class="btn btn-outline">Sign Up</button>
        <button v-if="isAuthenticated" @click="logout" class="btn btn-secondary">Logout</button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'AppHeader',
  data() {
    return {
      searchQuery: '',
      productsDropdownOpen: false,
      mobileMenuOpen: false
    }
  },
  computed: {
    ...mapState(['categories', 'user', 'isAuthenticated', 'showUserDropdown']),
    ...mapGetters(['cartItemCount', 'wishlistCount']),
    isAdmin() {
      return this.isAuthenticated && this.user && this.user.role === 'admin'
    }
  },
  methods: {
    ...mapMutations(['showLoginModal', 'showSignupModal', 'toggleUserDropdown', 'hideUserDropdown']),
    ...mapActions(['logout']),
    
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ 
          name: 'Products', 
          query: { search: this.searchQuery.trim() } 
        })
      }
    },
    
    showProductsDropdown() {
      this.productsDropdownOpen = true
    },
    
    hideProductsDropdown() {
      this.productsDropdownOpen = false
    },
    
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    
    closeMobileMenu() {
      this.mobileMenuOpen = false
    },
    
    openLoginModal() {
      this.hideUserDropdown()
      this.showLoginModal()
      this.closeMobileMenu()
    },
    
    openPasswordResetModal() {
      this.$store.commit('showPasswordResetModal')
      this.hideUserDropdown()
    },
    
    async logout() {
      await this.$store.dispatch('logout')
      this.hideUserDropdown()
      this.$router.push('/')
      this.closeMobileMenu()
    },
    
    openSignupModal() {
      this.hideUserDropdown()
      this.showSignupModal()
      this.closeMobileMenu()
    }
  },
  
  // Custom directive for click outside
  directives: {
    'click-outside': {
      beforeMount(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event, el)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
.app-header {
  background: var(--white);
  box-shadow: 0 2px 20px rgba(91, 126, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 10001;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(91, 126, 255, 0.1);
  width: 100%;
}

/* ===== COMPLETE NAVBAR OVERHAUL ===== */

/* Main Navbar Container */
.navbar-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  align-content: center;
  gap: 2rem;
  padding: 0.75rem 2rem;
  height: 70px;
  line-height: 1.4;
}

/* Left Section - Logo */
.navbar-left {
  display: flex;
  align-items: center;
}

.logo-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo-brand:hover {
  transform: scale(1.02);
}

.logo-text {
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--primary-blue);
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(91, 126, 255, 0.1);
}

/* Center Section - Navigation */
.navbar-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.navigation-menu {
  display: flex;
  align-items: center;
  align-content: center;
  gap: 2rem;
  line-height: 1.4;
}

.nav-item {
  position: relative;
  text-decoration: none;
  color: var(--gray-700);
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
  border-radius: 6px;
  text-align: center;
  line-height: 1.4;
}

.nav-item:hover {
  color: var(--primary-blue);
  background-color: rgba(91, 126, 255, 0.08);
}

.nav-item.router-link-active {
  color: var(--primary-blue);
  background-color: rgba(91, 126, 255, 0.12);
}

.nav-dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  text-align: center;
  line-height: 1.4;
}

.dropdown-trigger i {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
  line-height: 1;
  vertical-align: middle;
}

.nav-dropdown:hover .dropdown-trigger i {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--gray-200);
  padding: 1.5rem;
  min-width: 600px;
  z-index: 200;
}

.dropdown-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.category-title {
  color: var(--primary-blue);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--secondary-blue);
}

.subcategory-list {
  list-style: none;
}

.subcategory-list li {
  margin-bottom: 0.5rem;
}

.subcategory-link {
  color: var(--gray-600);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.subcategory-link:hover {
  color: var(--primary-blue);
}

/* Right Section - Search & Icons */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* ===== SYSTEM COLOR SCHEMA SEARCH BOX ===== */

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: stretch;
  background: var(--white);
  border: 2px solid var(--gray-300);
  border-radius: 50px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 44px;
}

.search-box:hover {
  border-color: var(--primary-blue-light);
  box-shadow: 0 4px 16px rgba(91, 126, 255, 0.25);
  transform: translateY(-1px);
  background: var(--white);
}

.search-box:focus-within {
  border-color: var(--primary-blue);
  background: var(--white);
  box-shadow: 0 0 0 4px rgba(91, 126, 255, 0.15), 0 4px 20px rgba(91, 126, 255, 0.2);
  transform: translateY(-1px);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
  background: var(--white);
}

.search-field {
  width: 280px;
  padding: 0 20px;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 400;
  color: var(--gray-700);
  outline: none;
  height: 100%;
  transition: all 0.3s ease;
}

.search-field::placeholder {
  color: var(--gray-500);
  font-weight: 400;
  transition: opacity 0.3s ease;
}

.search-field:focus {
  color: var(--gray-800);
  font-weight: 500;
}

.search-field:focus::placeholder {
  opacity: 0.6;
  color: var(--gray-400);
}

.search-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
  border: none;
  color: var(--white);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  min-width: 50px;
  box-shadow: 0 2px 8px rgba(91, 126, 255, 0.3);
}

.search-button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-blue-dark) 0%, var(--primary-blue) 100%);
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(91, 126, 255, 0.4);
}

.search-button:active:not(:disabled) {
  transform: scale(0.98);
}

.search-button:disabled {
  background: var(--gray-400);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.search-button i {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.search-button:hover:not(:disabled) i {
  transform: scale(1.1);
}

/* Action Bar */
.action-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Action Icons Styling */
.action-icon {
  position: relative;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: var(--gray-600);
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 1.1rem;
}

.action-icon:hover {
  background: var(--gray-100);
  color: var(--primary-blue);
  transform: translateY(-1px);
}

.action-icon i {
  font-size: 1.1rem;
  line-height: 1;
}

/* User Dropdown Container */
.user-dropdown-container,
.admin-button-container {
  position: relative;
  display: inline-block;
}

/* Admin Button in Navbar */
.admin-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #5b7eff 0%, #4a6eef 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(91, 126, 255, 0.3);
}

.admin-btn:hover {
  background: linear-gradient(135deg, #4a6eef 0%, #3a5edf 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 126, 255, 0.4);
}

.admin-btn i:first-child {
  font-size: 1rem;
}

.admin-btn i:last-child {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

.admin-button-container:hover .admin-btn i:last-child {
  transform: rotate(180deg);
}

/* Admin Dropdown in Navbar */
.admin-dropdown-nav {
  min-width: 200px;
}

.admin-dropdown-nav .dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-dropdown-nav .dropdown-item i {
  width: 16px;
  font-size: 14px;
  color: #666;
}

.admin-dropdown-nav .dropdown-item:hover i {
  color: #5b7eff;
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--danger);
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid var(--white);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--gray-200);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 110000;
}

.auth-options, .user-options {
  display: flex;
  flex-direction: column;
}

.user-info {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-700);
  font-weight: 500;
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: 0.25rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  color: var(--gray-700);
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background: var(--gray-50);
}

.dropdown-divider {
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: 0.5rem 0;
}

/* Mobile Menu */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--gray-600);
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
}

.mobile-menu-toggle:hover {
  background: var(--gray-100);
  color: var(--primary-blue);
}

.mobile-menu {
  display: none;
  background: var(--white);
  border-top: 1px solid var(--gray-200);
  padding: 0.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.mobile-nav-link {
  padding: 1.25rem 2rem;
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid var(--gray-100);
  transition: all 0.2s ease;
  min-height: 56px;
  display: flex;
  align-items: center;
  font-size: 1.125rem;
}

.mobile-nav-link:hover {
  color: var(--primary-blue);
  background: var(--gray-50);
  padding-left: 2.5rem;
}

.mobile-nav-link.router-link-active {
  color: var(--primary-blue);
  background: rgba(91, 126, 255, 0.05);
  font-weight: 600;
}

.mobile-auth {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 2rem;
  flex-direction: column;
}

.mobile-auth .btn {
  width: 100%;
  justify-content: center;
  min-height: 48px;
}

/* Responsive */
@media (max-width: 1288px) {
  .navbar-content {
    gap: 2rem;
    padding: 0.75rem 1.5rem;
  }
  
  .search-field {
    width: 220px;
  }
}

@media (max-width: 1024px) {
  .navbar-content {
    gap: 1.5rem;
    padding: 0.75rem 1.25rem;
  }
  
  .navigation-menu {
    gap: 1.5rem;
  }
  
  .search-field {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .navbar-content {
    grid-template-columns: auto 1fr auto auto;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    align-items: center;
  }
  
  .navbar-center {
    display: none;
  }
  
  .navbar-right {
    gap: 0.5rem;
    order: 2;
  }
  
  .search-field {
    width: 160px;
  }
  
  .action-bar {
    gap: 0.25rem;
    display: flex;
    align-items: center;
  }
  
  .action-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .mobile-menu-toggle {
    display: flex;
    order: 3;
  }
  
  .mobile-menu {
    display: block;
  }
}

@media (max-width: 480px) {
  .navbar-content {
    grid-template-columns: 1fr auto auto;
    padding: 0.75rem;
    gap: 0.5rem;
    align-items: center;
  }
  
  .navbar-left {
    justify-self: start;
  }
  
  .navbar-right {
    gap: 0.375rem;
    order: 1;
    justify-self: end;
  }
  
  .search-field {
    width: 120px;
  }
  
  .search-box {
    height: 38px;
  }
  
  .action-icon {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
  }
  
  .action-bar {
    gap: 0.125rem;
  }
  
  .logo-text {
    font-size: 1.6rem;
  }
  
  .mobile-menu-toggle {
    order: 2;
  }
}

/* iPhone 14 Pro Max and similar devices (430px width) - Enhanced Mobile Sizing */
@media (max-width: 430px) {
  .navbar-content {
    grid-template-columns: 1fr auto auto;
    gap: 1rem;
    padding: 1rem;
    height: auto;
    min-height: 70px;
  }
  
  .navbar-left {
    justify-self: start;
  }
  
  .navbar-right {
    gap: 0.75rem;
    order: 1;
  }
  
  .search-container {
    display: none;
  }
  
  .action-icon {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
    border-radius: 8px;
  }
  
  .logo-text {
    font-size: 2rem;
    font-weight: 800;
  }
  
  .mobile-menu-toggle {
    display: flex;
    order: 2;
    padding: 0.75rem;
    min-width: 48px;
    min-height: 48px;
    font-size: 1.25rem;
  }
}
</style>
