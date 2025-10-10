<template>
  <div class="admin-settings">
    <!-- Settings Navigation -->
    <div class="settings-nav">
      <button 
        v-for="tab in settingsTabs" 
        :key="tab.key"
        class="nav-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'" class="settings-content">
      <div class="settings-section">
        <h2>General Settings</h2>
        
        <div class="settings-form">
          <div class="form-group">
            <label>Site Name</label>
            <input v-model="settings.general.siteName" type="text" class="form-input" />
            <small>The name of your e-commerce store</small>
          </div>
          
          <div class="form-group">
            <label>Site Description</label>
            <textarea v-model="settings.general.siteDescription" class="form-input" rows="3"></textarea>
            <small>Brief description of your store</small>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Default Currency</label>
              <select v-model="settings.general.currency" class="form-input">
                <option value="PHP">Philippine Peso (₱)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Timezone</label>
              <select v-model="settings.general.timezone" class="form-input">
                <option value="Asia/Manila">Asia/Manila</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Admin Email</label>
            <input v-model="settings.general.adminEmail" type="email" class="form-input" />
            <small>Email address for system notifications</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div v-if="activeTab === 'notifications'" class="settings-content">
      <div class="settings-section">
        <h2>Notification Settings</h2>
        
        <div class="notification-settings">
          <div class="notification-group">
            <h3>Order Notifications</h3>
            <div class="notification-item">
              <div class="notification-info">
                <label>New Order Alerts</label>
                <p>Get notified when new orders are placed</p>
              </div>
              <label class="toggle-switch">
                <input v-model="settings.notifications.newOrders" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="notification-item">
              <div class="notification-info">
                <label>Low Stock Alerts</label>
                <p>Get notified when products are running low</p>
              </div>
              <label class="toggle-switch">
                <input v-model="settings.notifications.lowStock" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="notification-group">
            <h3>User Notifications</h3>
            <div class="notification-item">
              <div class="notification-info">
                <label>New User Registrations</label>
                <p>Get notified when new users register</p>
              </div>
              <label class="toggle-switch">
                <input v-model="settings.notifications.newUsers" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="notification-item">
              <div class="notification-info">
                <label>Email Notifications</label>
                <p>Send email notifications for important events</p>
              </div>
              <label class="toggle-switch">
                <input v-model="settings.notifications.emailNotifications" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div v-if="activeTab === 'security'" class="settings-content">
      <div class="settings-section">
        <h2>Security Settings</h2>
        
        <div class="security-settings">
          <div class="security-group">
            <h3>Authentication</h3>
            <div class="security-item">
              <div class="security-info">
                <label>Require Two-Factor Authentication</label>
                <p>Force all admin users to use 2FA</p>
              </div>
              <label class="toggle-switch">
                <input v-model="settings.security.require2FA" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="form-group">
              <label>Session Timeout (minutes)</label>
              <input v-model="settings.security.sessionTimeout" type="number" class="form-input" min="5" max="1440" />
              <small>Admin sessions will expire after this time</small>
            </div>
          </div>
          
          <div class="security-group">
            <h3>Password Policy</h3>
            <div class="form-group">
              <label>Minimum Password Length</label>
              <input v-model="settings.security.minPasswordLength" type="number" class="form-input" min="6" max="50" />
            </div>
            
            <div class="security-item">
              <div class="security-info">
                <label>Require Special Characters</label>
                <p>Passwords must contain special characters</p>
              </div>
              <label class="toggle-switch">
                <input v-model="settings.security.requireSpecialChars" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Settings -->
    <div v-if="activeTab === 'system'" class="settings-content">
      <div class="settings-section">
        <h2>System Settings</h2>
        
        <div class="system-settings">
          <div class="system-group">
            <h3>Performance</h3>
            <div class="form-group">
              <label>Cache Duration (hours)</label>
              <input v-model="settings.system.cacheDuration" type="number" class="form-input" min="1" max="168" />
              <small>How long to cache product and page data</small>
            </div>
            
            <div class="system-item">
              <div class="system-info">
                <label>Enable Image Compression</label>
                <p>Automatically compress uploaded images</p>
              </div>
              <label class="toggle-switch">
                <input v-model="settings.system.imageCompression" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="system-group">
            <h3>Maintenance</h3>
            <div class="system-item">
              <div class="system-info">
                <label>Maintenance Mode</label>
                <p>Put the site in maintenance mode</p>
              </div>
              <label class="toggle-switch">
                <input v-model="settings.system.maintenanceMode" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="form-group">
              <label>Maintenance Message</label>
              <textarea v-model="settings.system.maintenanceMessage" class="form-input" rows="3"></textarea>
            </div>
          </div>
          
          <div class="system-group">
            <h3>Backup</h3>
            <div class="system-item">
              <div class="system-info">
                <label>Automatic Backups</label>
                <p>Create daily database backups</p>
              </div>
              <label class="toggle-switch">
                <input v-model="settings.system.autoBackup" type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="backup-actions">
              <button class="backup-btn" @click="createBackup">
                <i class="fas fa-download"></i>
                Create Backup Now
              </button>
              <button class="backup-btn secondary" @click="viewBackups">
                <i class="fas fa-history"></i>
                View Backup History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Settings Button -->
    <div class="settings-actions">
      <button class="save-settings-btn" @click="saveSettings" :disabled="isSaving">
        <i class="fas fa-save"></i>
        {{ isSaving ? 'Saving...' : 'Save All Settings' }}
      </button>
      <button class="reset-btn" @click="resetSettings">
        <i class="fas fa-undo"></i>
        Reset to Defaults
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSettings',
  data() {
    return {
      activeTab: 'general',
      isSaving: false,
      settingsTabs: [
        { key: 'general', label: 'General', icon: 'fas fa-cog' },
        { key: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
        { key: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
        { key: 'system', label: 'System', icon: 'fas fa-server' }
      ],
      settings: {
        general: {
          siteName: 'COMPHILITY',
          siteDescription: 'Your trusted computer hardware and electronics store',
          currency: 'PHP',
          timezone: 'Asia/Manila',
          adminEmail: 'admin@comphility.com'
        },
        notifications: {
          newOrders: true,
          lowStock: true,
          newUsers: true,
          emailNotifications: true
        },
        security: {
          require2FA: false,
          sessionTimeout: 120,
          minPasswordLength: 8,
          requireSpecialChars: true
        },
        system: {
          cacheDuration: 24,
          imageCompression: true,
          maintenanceMode: false,
          maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
          autoBackup: true
        }
      }
    }
  },
  methods: {
    saveSettings() {
      this.isSaving = true
      // Simulate API call
      setTimeout(() => {
        this.isSaving = false
        console.log('Settings saved:', this.settings)
        // Show success notification
        alert('Settings saved successfully!')
      }, 1500)
    },
    
    resetSettings() {
      if (confirm('Are you sure you want to reset all settings to default values?')) {
        // Reset to default values
        this.settings = {
          general: {
            siteName: 'COMPHILITY',
            siteDescription: 'Your trusted computer hardware and electronics store',
            currency: 'PHP',
            timezone: 'Asia/Manila',
            adminEmail: 'admin@comphility.com'
          },
          notifications: {
            newOrders: true,
            lowStock: true,
            newUsers: true,
            emailNotifications: true
          },
          security: {
            require2FA: false,
            sessionTimeout: 120,
            minPasswordLength: 8,
            requireSpecialChars: true
          },
          system: {
            cacheDuration: 24,
            imageCompression: true,
            maintenanceMode: false,
            maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
            autoBackup: true
          }
        }
      }
    },
    
    createBackup() {
      console.log('Creating backup...')
      alert('Backup created successfully!')
    },
    
    viewBackups() {
      console.log('Viewing backup history...')
      alert('Backup history feature coming soon!')
    }
  }
}
</script>

<style scoped>
.admin-settings {
  max-width: 1200px;
  margin: 0 auto;
}

.settings-nav {
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-tab:hover {
  background: #f3f4f6;
  color: #374151;
}

.nav-tab.active {
  background: #3b82f6;
  color: white;
}

.settings-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.settings-section {
  padding: 2rem;
}

.settings-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group small {
  color: #6b7280;
  font-size: 0.75rem;
}

/* Notification Settings */
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.notification-group, .security-group, .system-group {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.notification-group h3, .security-group h3, .system-group h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.notification-item, .security-item, .system-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.notification-item:last-child, .security-item:last-child, .system-item:last-child {
  margin-bottom: 0;
}

.notification-info, .security-info, .system-info {
  flex: 1;
}

.notification-info label, .security-info label, .system-info label {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  display: block;
}

.notification-info p, .security-info p, .system-info p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Backup Actions */
.backup-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.backup-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.backup-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.backup-btn.secondary {
  background: #6b7280;
}

.backup-btn.secondary:hover {
  background: #4b5563;
}

/* Settings Actions */
.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.save-settings-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.save-settings-btn:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-2px);
}

.save-settings-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.reset-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .settings-nav {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .nav-tab {
    padding: 0.75rem 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .notification-item, .security-item, .system-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .backup-actions, .settings-actions {
    flex-direction: column;
  }
}
</style>
