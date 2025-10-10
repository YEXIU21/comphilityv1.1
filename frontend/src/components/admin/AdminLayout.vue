<template>
  <div class="admin-container">
    <!-- Admin Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-logo">
        <router-link to="/admin/dashboard">
          <span class="logo-text">COMPHILITY</span>
        </router-link>
      </div>
      
      <nav class="admin-nav">
        <router-link to="/admin/dashboard" class="nav-item" :class="{ active: $route.path === '/admin/dashboard' }">
          <i class="fas fa-home"></i>
          <span>Dashboard</span>
        </router-link>
        
        <router-link to="/admin/products" class="nav-item" :class="{ active: $route.path.includes('/admin/products') }">
          <i class="fas fa-box"></i>
          <span>Product Management</span>
        </router-link>
        
        <router-link to="/admin/orders" class="nav-item" :class="{ active: $route.path.includes('/admin/orders') }">
          <i class="fas fa-shopping-cart"></i>
          <span>Order Management</span>
        </router-link>
        
        <router-link to="/admin/users" class="nav-item" :class="{ active: $route.path.includes('/admin/users') }">
          <i class="fas fa-users"></i>
          <span>User Management</span>
        </router-link>
        
        <router-link to="/admin/statistics" class="nav-item" :class="{ active: $route.path === '/admin/statistics' }">
          <i class="fas fa-chart-bar"></i>
          <span>Statistics</span>
        </router-link>
      </nav>
      
      <!-- Admin User Info & Logout -->
      <div class="admin-user-section">
        <div class="admin-user-info">
          <div class="user-avatar">
            <i class="fas fa-user-shield"></i>
          </div>
          <div class="user-details">
            <span class="user-name">{{ adminUser.name || 'Admin' }}</span>
            <span class="user-role">Administrator</span>
          </div>
        </div>
        
        <div class="admin-actions">
          <button @click="goToCustomerSite" class="admin-action-btn" title="View Customer Site">
            <i class="fas fa-external-link-alt"></i>
          </button>
          <button @click="logout" class="admin-action-btn logout-btn" title="Logout">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>
    
    <!-- Main Content Area -->
    <div class="admin-main">
      <header class="admin-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        
        <!-- Admin Header Controls -->
        <div class="header-controls">
          <!-- Notifications -->
          <div class="notification-dropdown">
            <button class="header-btn notification-btn" @click="toggleNotifications">
              <i class="fas fa-bell"></i>
              <span class="notification-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
            </button>
            <div v-if="showNotifications" class="dropdown-menu notifications-menu">
              <div class="dropdown-header">
                <h4>Notifications</h4>
                <button class="mark-all-read" @click="markAllRead">Mark all read</button>
              </div>
              <div class="notification-item" v-for="notification in notifications" :key="notification.id">
                <div class="notification-icon" :class="notification.type">
                  <i :class="notification.icon"></i>
                </div>
                <div class="notification-content">
                  <p>{{ notification.message }}</p>
                  <span class="notification-time">{{ notification.time }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Settings -->
          <button class="header-btn" @click="openSettings" title="Settings">
            <i class="fas fa-cog"></i>
          </button>
          
          <!-- Admin Profile -->
          <div class="admin-profile-dropdown">
            <button class="profile-btn" @click="toggleProfile">
              <div class="profile-avatar">
                <img v-if="adminUser.avatar" :src="adminUser.avatar" :alt="adminUser.name" />
                <i v-else class="fas fa-user-shield"></i>
              </div>
              <div class="profile-info">
                <span class="profile-name">{{ adminUser.name || 'Admin' }}</span>
                <span class="profile-role">Administrator</span>
              </div>
              <i class="fas fa-chevron-down profile-arrow"></i>
            </button>
            
            <div v-if="showProfile" class="dropdown-menu profile-menu">
              <router-link to="/admin/profile" class="dropdown-item">
                <i class="fas fa-user"></i>
                My Profile
              </router-link>
              <router-link to="/admin/settings" class="dropdown-item">
                <i class="fas fa-cog"></i>
                Settings
              </router-link>
              <div class="dropdown-divider"></div>
              <button @click="goToCustomerSite" class="dropdown-item">
                <i class="fas fa-external-link-alt"></i>
                View Store
              </button>
              <div class="dropdown-divider"></div>
              <button @click="logout" class="dropdown-item logout-item">
                <i class="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AdminLayout',
  data() {
    return {
      showNotifications: false,
      showProfile: false,
      notifications: [
        {
          id: 1,
          type: 'order',
          icon: 'fas fa-shopping-cart',
          message: 'New order #12345 received',
          time: '2 minutes ago'
        },
        {
          id: 2,
          type: 'warning',
          icon: 'fas fa-exclamation-triangle',
          message: '5 products are low in stock',
          time: '10 minutes ago'
        },
        {
          id: 3,
          type: 'user',
          icon: 'fas fa-user-plus',
          message: 'New user registration: john@example.com',
          time: '1 hour ago'
        }
      ]
    }
  },
  computed: {
    ...mapState(['user']),
    
    adminUser() {
      return this.user || {}
    },
    
    notificationCount() {
      return this.notifications.length
    },
    
    pageTitle() {
      const titles = {
        '/admin/dashboard': 'ADMIN DASHBOARD',
        '/admin/products': 'PRODUCT MANAGEMENT',
        '/admin/orders': 'ORDER MANAGEMENT',
        '/admin/users': 'USER MANAGEMENT',
        '/admin/statistics': 'STATISTICS'
      }
      
      // Check for nested routes
      for (const [path, title] of Object.entries(titles)) {
        if (this.$route.path.startsWith(path)) {
          return title
        }
      }
      return 'ADMIN PANEL'
    }
  },
  methods: {
    ...mapActions(['logout']),
    
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      this.showProfile = false
    },
    
    toggleProfile() {
      this.showProfile = !this.showProfile
      this.showNotifications = false
    },
    
    markAllRead() {
      this.notifications = []
      this.showNotifications = false
    },
    
    openSettings() {
      this.$router.push('/admin/settings')
    },
    
    async logout() {
      try {
        await this.$store.dispatch('logout')
        this.$router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
    
    goToCustomerSite() {
      // Open customer site in new tab/window
      window.open('/', '_blank')
    }
  },
  
  mounted() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notification-dropdown')) {
        this.showNotifications = false
      }
      if (!e.target.closest('.admin-profile-dropdown')) {
        this.showProfile = false
      }
    })
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}

/* Sidebar */
.admin-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
}

.admin-logo {
  padding: 2rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-logo a {
  text-decoration: none;
  color: white;
  font-size: 1.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  letter-spacing: 1px;
}

.logo-text {
  color: white;
}

.admin-nav {
  flex: 1;
  padding: 2rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1.25rem 2rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  margin: 0.25rem 0;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  padding-left: 2.5rem;
}

.nav-item.active {
  background: rgba(52, 152, 219, 0.3);
  color: white;
  border-left-color: #3498db;
  font-weight: 600;
}

.nav-item i {
  width: 24px;
  margin-right: 1rem;
  text-align: center;
  font-size: 1.125rem;
}

.nav-item span {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Admin User Section */
.admin-user-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  margin-top: auto;
}

.admin-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(52, 152, 219, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  font-size: 1.25rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.user-name {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.user-role {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.admin-action-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.admin-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.admin-action-btn.logout-btn:hover {
  background: rgba(231, 76, 60, 0.8);
  color: white;
}

/* Main Content */
.admin-main {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.admin-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e2e8f0;
}

/* Header Controls */
.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  position: relative;
}

.header-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  transform: translateY(-2px);
}

/* Notification System */
.notification-btn {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  min-width: 320px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.notifications-menu {
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.mark-all-read {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.notification-icon.order {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.notification-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.notification-icon.user {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.notification-content {
  flex: 1;
}

.notification-content p {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
}

.notification-time {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Profile Dropdown */
.admin-profile-dropdown {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.profile-btn:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: left;
}

.profile-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.125rem;
}

.profile-role {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-arrow {
  color: #9ca3af;
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

.profile-btn:hover .profile-arrow {
  transform: rotate(180deg);
}

.profile-menu {
  right: 0;
  min-width: 220px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  text-decoration: none;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f9fafb;
  color: #1f2937;
  padding-left: 1.5rem;
}

.dropdown-item i {
  color: #6b7280;
  width: 16px;
  text-align: center;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

.logout-item {
  color: #dc2626;
}

.logout-item:hover {
  background: rgba(220, 38, 38, 0.05);
  color: #dc2626;
}

.logout-item i {
  color: #dc2626;
}

.page-title {
  font-size: 2rem;
  color: #2d3748;
  font-weight: 800;
  margin: 0;
  letter-spacing: 0.5px;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border-radius: 2px;
}

.admin-content {
  flex: 1;
  padding: 2.5rem 3rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}
@media (max-width: 768px) {
  .admin-sidebar {
    width: 80px;
  }
  
  .admin-main {
    margin-left: 80px;
  }
  
  .admin-header {
    padding: 1.5rem 2rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .admin-content {
    padding: 2rem;
  }
  
  .nav-item span,
  .logo-text,
  .user-details {
    display: none;
  }
  
  .nav-item {
    justify-content: center;
    padding: 1.25rem;
  }
  
  .nav-item i {
    margin-right: 0;
    font-size: 1.25rem;
  }
  
  .admin-logo {
    padding: 1.5rem 1rem;
  }
  
  .admin-user-info {
    justify-content: center;
    margin-bottom: 0.75rem;
  }
  
  .admin-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
