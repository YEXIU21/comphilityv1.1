<template>
  <div class="user-management">
    <!-- Header Controls -->
    <div class="controls-header">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search users..." 
          class="search-input"
        />
      </div>
      
      <button class="filter-btn">
        <i class="fas fa-filter"></i>
        Filters
      </button>
    </div>
    
    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: filter === 'active' }"
        @click="filter = 'active'"
      >
        Last Active
      </button>
      <button 
        class="tab-btn"
        :class="{ active: filter === 'added' }"
        @click="filter = 'added'"
      >
        Last Added
      </button>
    </div>
    
    <!-- Users List -->
    <div class="users-list">
      <div class="user-card" v-for="user in filteredUsers" :key="user.id">
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        
        <div class="user-info">
          <h3 class="user-name">{{ user.name }}</h3>
          <p class="user-email">{{ user.email }}</p>
        </div>
        
        <div class="user-role">
          <span class="role-badge" :class="getRoleClass(user.role)">
            {{ user.role }}
          </span>
        </div>
        
        <div class="user-dates">
          <p class="date-label">Last Updated:</p>
          <p class="date-value">{{ formatDate(user.updated_at) }}</p>
        </div>
        
        <div class="user-dates">
          <p class="date-label">Date Added:</p>
          <p class="date-value">{{ formatDate(user.created_at) }}</p>
        </div>
        
        <div class="user-actions">
          <button class="action-btn" @click="showUserMenu(user)">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          
          <div v-if="activeMenu === user.id" class="action-menu">
            <a @click="editUser(user)">Edit User</a>
            <a @click="changeRole(user)">Change Role</a>
            <a @click="deactivateUser(user)" class="danger">Deactivate</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'UserManagement',
  data() {
    return {
      users: [],
      searchQuery: '',
      filter: 'added',
      activeMenu: null,
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1
    }
  },
  mounted() {
    console.log('👥 [UserManagement] Component mounted')
    this.loadUsers()
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-actions')) {
        this.activeMenu = null
      }
    })
  },
  computed: {
    filteredUsers() {
      let filtered = [...this.users]
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        )
      }
      
      // Sort by filter
      if (this.filter === 'active') {
        filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      } else if (this.filter === 'added') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
      
      return filtered
    }
  },
  methods: {
    async loadUsers() {
      console.log('🔄 [UserManagement] Loading users from API...')
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get('/users', {
          params: {
            page: this.currentPage,
            limit: 100 // Get all users
          }
        })
        
        this.users = response.users || []
        this.totalPages = response.pagination?.pages || 1
        
        console.log('✅ [UserManagement] Users loaded successfully')
        console.log('👥 [UserManagement] Total users:', this.users.length)
        console.log('📦 [UserManagement] Users data:', this.users)
      } catch (error) {
        this.error = 'Failed to load users'
        console.error('❌ [UserManagement] Error loading users:', error)
        console.error('   - Error details:', error.response?.data)
      } finally {
        this.loading = false
      }
    },
    getRoleClass(role) {
      return role.toLowerCase()
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      const options = { month: 'long', day: 'numeric', year: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    },
    showUserMenu(user) {
      this.activeMenu = this.activeMenu === user.id ? null : user.id
    },
    editUser(user) {
      this.$router.push(`/admin/users/edit/${user.id}`)
      this.activeMenu = null
    },
    changeRole(user) {
      // Implement role change logic
      console.log('Change role for:', user.name)
      this.activeMenu = null
    },
    deactivateUser(user) {
      if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
        // Implement deactivation logic
        console.log('Deactivate:', user.name)
      }
      this.activeMenu = null
    }
  }
}
</script>

<style scoped>
.user-management {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Controls */
.controls-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.search-bar {
  flex: 1;
  position: relative;
  max-width: 500px;
}

.search-bar i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #5b7eff;
  box-shadow: 0 0 0 3px rgba(91, 126, 255, 0.1);
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  border: 2px solid #5b7eff;
  color: #5b7eff;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #5b7eff;
  color: white;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.tab-btn {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  color: #666;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  border-color: #5b7eff;
  color: #5b7eff;
}

.tab-btn.active {
  background: #5b7eff;
  border-color: #5b7eff;
  color: white;
}

/* Users List */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  font-size: 3rem;
  color: #5b7eff;
}

.user-info {
  flex: 1;
  min-width: 200px;
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.user-email {
  color: #666;
  font-size: 0.95rem;
}

.user-role {
  min-width: 100px;
}

.role-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.role-badge.admin {
  background: #4caf50;
  color: white;
}

.role-badge.user {
  background: #2196f3;
  color: white;
}

.user-dates {
  min-width: 150px;
}

.date-label {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 5px;
}

.date-value {
  font-weight: 600;
  color: #333;
}

.user-actions {
  position: relative;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #5b7eff;
  color: white;
}

.action-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 100;
  overflow: hidden;
}

.action-menu a {
  display: block;
  padding: 10px 16px;
  color: #333;
  cursor: pointer;
  transition: background 0.3s ease;
}

.action-menu a:hover {
  background: #f5f5f5;
}

.action-menu a.danger {
  color: #f44336;
}

/* Responsive */
@media (max-width: 1024px) {
  .user-card {
    flex-wrap: wrap;
  }
  
  .user-dates {
    min-width: auto;
    flex: 1;
  }
}

@media (max-width: 768px) {
  .user-avatar {
    font-size: 2.5rem;
  }
  
  .user-info {
    min-width: auto;
    flex: auto;
  }
  
  .user-role,
  .user-dates {
    width: 100%;
  }
}
</style>
