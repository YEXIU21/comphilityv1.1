<template>
  <div class="admin-profile">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-avatar-large">
        <img v-if="adminUser.avatar" :src="adminUser.avatar" :alt="adminUser.name" />
        <i v-else class="fas fa-user-shield"></i>
      </div>
      <div class="profile-info">
        <h1>{{ adminUser.name || 'Administrator' }}</h1>
        <p class="profile-role">System Administrator</p>
        <p class="profile-email">{{ adminUser.email || 'admin@comphility.com' }}</p>
      </div>
      <button class="edit-profile-btn" @click="toggleEditMode">
        <i class="fas fa-edit"></i>
        {{ isEditing ? 'Cancel' : 'Edit Profile' }}
      </button>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <!-- Personal Information -->
      <div class="profile-section">
        <h2>Personal Information</h2>
        <div class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input 
                v-model="profileData.name" 
                :disabled="!isEditing"
                type="text" 
                class="form-input"
                placeholder="Enter full name"
              />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input 
                v-model="profileData.email" 
                :disabled="!isEditing"
                type="email" 
                class="form-input"
                placeholder="Enter email address"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Phone Number</label>
              <input 
                v-model="profileData.phone" 
                :disabled="!isEditing"
                type="tel" 
                class="form-input"
                placeholder="Enter phone number"
              />
            </div>
            <div class="form-group">
              <label>Department</label>
              <select v-model="profileData.department" :disabled="!isEditing" class="form-input">
                <option value="IT">IT Department</option>
                <option value="Management">Management</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="profile-section">
        <h2>Security Settings</h2>
        <div class="security-options">
          <div class="security-item">
            <div class="security-info">
              <h3>Change Password</h3>
              <p>Update your password to keep your account secure</p>
            </div>
            <button class="security-btn" @click="openPasswordModal">
              <i class="fas fa-key"></i>
              Change Password
            </button>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
            </div>
            <button class="security-btn" :class="{ active: twoFactorEnabled }" @click="toggle2FA">
              <i class="fas fa-shield-alt"></i>
              {{ twoFactorEnabled ? 'Enabled' : 'Enable 2FA' }}
            </button>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <h3>Login Sessions</h3>
              <p>View and manage your active login sessions</p>
            </div>
            <button class="security-btn" @click="viewSessions">
              <i class="fas fa-laptop"></i>
              View Sessions
            </button>
          </div>
        </div>
      </div>

      <!-- Activity Log -->
      <div class="profile-section">
        <h2>Recent Activity</h2>
        <div class="activity-log">
          <div class="activity-item" v-for="activity in recentActivity" :key="activity.id">
            <div class="activity-icon" :class="activity.type">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <p>{{ activity.description }}</p>
              <span class="activity-time">{{ activity.timestamp }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Changes Button -->
    <div v-if="isEditing" class="profile-actions">
      <button class="save-btn" @click="saveProfile" :disabled="isSaving">
        <i class="fas fa-save"></i>
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
      <button class="cancel-btn" @click="cancelEdit">
        Cancel
      </button>
    </div>

    <!-- Password Change Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Change Password</h3>
          <button @click="closePasswordModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Current Password</label>
            <input v-model="passwordData.current" type="password" class="form-input" />
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input v-model="passwordData.new" type="password" class="form-input" />
          </div>
          <div class="form-group">
            <label>Confirm New Password</label>
            <input v-model="passwordData.confirm" type="password" class="form-input" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="save-btn" @click="updatePassword">Update Password</button>
          <button class="cancel-btn" @click="closePasswordModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AdminProfile',
  data() {
    return {
      isEditing: false,
      isSaving: false,
      showPasswordModal: false,
      twoFactorEnabled: false,
      profileData: {
        name: 'System Administrator',
        email: 'admin@comphility.com',
        phone: '+63 912 345 6789',
        department: 'IT'
      },
      passwordData: {
        current: '',
        new: '',
        confirm: ''
      },
      recentActivity: [
        {
          id: 1,
          type: 'login',
          icon: 'fas fa-sign-in-alt',
          description: 'Logged in to admin dashboard',
          timestamp: '2 hours ago'
        },
        {
          id: 2,
          type: 'edit',
          icon: 'fas fa-edit',
          description: 'Updated product: Gaming PC Intel i7',
          timestamp: '5 hours ago'
        },
        {
          id: 3,
          type: 'create',
          icon: 'fas fa-plus',
          description: 'Created new product category',
          timestamp: '1 day ago'
        },
        {
          id: 4,
          type: 'settings',
          icon: 'fas fa-cog',
          description: 'Updated system settings',
          timestamp: '2 days ago'
        }
      ]
    }
  },
  computed: {
    ...mapState(['user']),
    
    adminUser() {
      return this.user || {}
    }
  },
  methods: {
    toggleEditMode() {
      this.isEditing = !this.isEditing
      if (!this.isEditing) {
        this.resetProfileData()
      }
    },
    
    saveProfile() {
      this.isSaving = true
      // Simulate API call
      setTimeout(() => {
        this.isSaving = false
        this.isEditing = false
        // Here you would typically update the Vuex store and make API call
        console.log('Profile saved:', this.profileData)
      }, 1500)
    },
    
    cancelEdit() {
      this.isEditing = false
      this.resetProfileData()
    },
    
    resetProfileData() {
      this.profileData = {
        name: 'System Administrator',
        email: 'admin@comphility.com',
        phone: '+63 912 345 6789',
        department: 'IT'
      }
    },
    
    openPasswordModal() {
      this.showPasswordModal = true
    },
    
    closePasswordModal() {
      this.showPasswordModal = false
      this.passwordData = { current: '', new: '', confirm: '' }
    },
    
    updatePassword() {
      if (this.passwordData.new !== this.passwordData.confirm) {
        alert('New passwords do not match')
        return
      }
      // Here you would typically make API call to update password
      console.log('Password updated')
      this.closePasswordModal()
    },
    
    toggle2FA() {
      this.twoFactorEnabled = !this.twoFactorEnabled
      console.log('2FA toggled:', this.twoFactorEnabled)
    },
    
    viewSessions() {
      console.log('View active sessions')
      // Navigate to sessions page or open modal
    }
  }
}
</script>

<style scoped>
.admin-profile {
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.profile-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  overflow: hidden;
}

.profile-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.profile-role {
  color: #3b82f6;
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.profile-email {
  color: #6b7280;
  font-size: 1rem;
}

.edit-profile-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-profile-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.profile-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background: #f9fafb;
  color: #6b7280;
}

.security-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.security-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.security-info p {
  color: #6b7280;
  font-size: 0.875rem;
}

.security-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.security-btn:hover {
  background: #e5e7eb;
}

.security-btn.active {
  background: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}

.activity-log {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.activity-icon.login {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.activity-icon.edit {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.activity-icon.create {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.activity-icon.settings {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
  color: #1f2937;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.save-btn {
  background: #22c55e;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.save-btn:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .security-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .profile-actions {
    flex-direction: column;
  }
}
</style>
