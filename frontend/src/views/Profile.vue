<template>
  <div class="profile">
    <div class="container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-card">
          <div class="profile-sidebar">
            <div class="profile-avatar">
              <div class="avatar-circle">
                <i class="fas fa-user"></i>
              </div>
            </div>
            
            <div class="account-details">
              <h3>Account Details</h3>
              <div class="detail-item">
                <i class="fas fa-user"></i>
                <span>{{ currentUser?.name || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-envelope"></i>
                <span>{{ currentUser?.email || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-shield-alt"></i>
                <span class="user-role">{{ (currentUser?.role || 'customer').toUpperCase() }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ formatJoinDate(currentUser?.createdAt) }}</span>
              </div>
              
              <div class="verification-status">
                <div class="status-item verified">
                  <i class="fas fa-check"></i>
                  <span>Email Confirmed</span>
                </div>
                <div class="status-item verified">
                  <i class="fas fa-check"></i>
                  <span>Mobile Confirmed</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="profile-main">
            <div class="profile-info">
              <h1>Hello, {{ currentUser?.name || 'User' }}</h1>
              <p class="join-date">{{ formatJoinDate(currentUser?.createdAt) }}</p>
              
              <div class="profile-actions">
                <button @click="showEditProfile = true" class="btn btn-primary">
                  Edit Profile
                </button>
                <button @click="showEditPassword = true" class="btn btn-outline">
                  Edit Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Orders Section -->
      <div class="my-orders-section">
        <div class="orders-header">
          <h2>My Orders</h2>
          <button @click="showOrderTracking = true" class="btn btn-outline">
            Track Order
          </button>
        </div>
        
        <div v-if="orders.length === 0" class="no-orders">
          <i class="fas fa-receipt"></i>
          <h3>No orders yet</h3>
          <p>Your orders will appear here once you make a purchase.</p>
          <router-link to="/" class="btn btn-primary">Start Shopping</router-link>
        </div>
        
        <div v-else class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <div class="order-info">
                <span class="order-id">ORDER ID: {{ order.id }}</span>
                <span class="order-total">TOTAL: ₱{{ formatPrice(order.total) }}</span>
                <span class="order-status" :class="order.status.toLowerCase()">{{ order.status }}</span>
              </div>
              <button @click="toggleOrderDetails(order.id)" class="toggle-details">
                <i :class="expandedOrders.includes(order.id) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </button>
            </div>
            
            <div v-if="expandedOrders.includes(order.id)" class="order-details">
              <div class="order-items">
                <table class="details-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.items" :key="item.id">
                      <td>
                        <div class="item-info">
                          <img 
                            :src="getSafeImageUrl(item.image, 'order')" 
                            :alt="item.name" 
                            class="item-image"
                            @error="handleImageError($event, 'order')"
                          >
                          <span>{{ item.name }}</span>
                        </div>
                      </td>
                      <td>{{ item.quantity }}</td>
                      <td>₱{{ formatPrice(item.price) }}</td>
                      <td>₱{{ formatPrice(item.price * item.quantity) }}</td>
                    </tr>
                  </tbody>
                </table>
                
                <div class="order-summary">
                  <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>₱{{ formatPrice(order.subtotal) }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Shipping Fee:</span>
                    <span>₱{{ formatPrice(order.shipping) }}</span>
                  </div>
                  <div class="summary-row total">
                    <span>TOTAL:</span>
                    <span>₱{{ formatPrice(order.total) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Tracking Modal -->
    <div v-if="showOrderTracking" class="modal-overlay" @click="closeOrderTracking">
      <div class="modal order-tracking-modal" @click.stop>
        <div class="modal-header">
          <h3>Track your Order</h3>
          <button @click="closeOrderTracking" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Order ID</label>
            <input v-model="trackingForm.orderId" type="text" class="form-input" placeholder="Enter Order ID">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="trackingForm.email" type="email" class="form-input" placeholder="Enter Email">
          </div>
          <button @click="trackOrder" class="btn btn-primary track-btn">
            TRACK
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfile" class="modal-overlay" @click="closeModal">
      <div class="modal edit-profile-modal" @click.stop>
        <div class="modal-header">
          <h3>EDIT ACCOUNT</h3>
          <button @click="showEditProfile = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-section">
            <h4>Information</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Name</label>
                <input v-model="editForm.name" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input v-model="editForm.lastName" type="text" class="form-input" />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input v-model="editForm.email" type="email" class="form-input" />
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input v-model="editForm.phone" type="tel" class="form-input" />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Gender</label>
                <select v-model="editForm.gender" class="form-select">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Birthday</label>
                <input v-model="editForm.birthday" type="date" class="form-input" />
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h4>Address</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Province</label>
                <select v-model="editForm.province" class="form-select">
                  <option value="cebu">Cebu</option>
                  <option value="manila">Manila</option>
                  <option value="davao">Davao</option>
                </select>
              </div>
              <div class="form-group">
                <label>Barangay</label>
                <select v-model="editForm.barangay" class="form-select">
                  <option value="lahug">Lahug</option>
                  <option value="capitol">Capitol</option>
                  <option value="banilad">Banilad</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <select v-model="editForm.city" class="form-select">
                  <option value="cebu-city">Cebu City</option>
                  <option value="mandaue">Mandaue</option>
                  <option value="lapu-lapu">Lapu-Lapu</option>
                </select>
              </div>
              <div class="form-group">
                <label>Street Name</label>
                <input v-model="editForm.street" type="text" class="form-input" />
              </div>
            </div>
            
            <div class="form-group">
              <label>Zip / Postal Code</label>
              <input v-model="editForm.zipCode" type="text" class="form-input" />
            </div>
          </div>
          
          <button @click="saveProfile" class="btn btn-primary save-btn">
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Password Modal -->
    <div v-if="showEditPassword" class="modal-overlay" @click="closeModal">
      <div class="modal edit-password-modal" @click.stop>
        <div class="modal-header">
          <h3>Edit Password</h3>
          <button @click="showEditPassword = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Current Password</label>
            <input v-model="passwordForm.current" type="password" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>New Password</label>
            <input v-model="passwordForm.new" type="password" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>Re-Enter New Password</label>
            <input v-model="passwordForm.confirm" type="password" class="form-input" />
          </div>
          
          <button @click="savePassword" class="btn btn-primary save-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import imageFallback from '@/mixins/imageFallback'

export default {
  name: 'Profile',
  mixins: [imageFallback],
  data() {
    return {
      showEditProfile: false,
      showEditPassword: false,
      showOrderTracking: false,
      expandedOrders: [],
      editForm: {
        name: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        birthday: '',
        province: '',
        barangay: '',
        city: '',
        street: '',
        zipCode: ''
      },
      passwordForm: {
        current: '',
        new: '',
        confirm: ''
      },
      trackingForm: {
        orderId: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapState(['user', 'isAuthenticated']),
    currentUser() {
      return this.user
    },
    orders() {
      // Get orders from localStorage (simulate backend)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      return orders.map(order => ({
        ...order,
        status: order.status || 'Pending',
        subtotal: order.total - (order.shipping || 200),
        shipping: order.shipping || 200
      }))
    }
  },
  methods: {
    ...mapActions(['fetchUserProfile', 'updateProfile', 'changePassword']),
    
    formatJoinDate(dateString) {
      if (!dateString) return 'Recently joined'
      try {
        const date = new Date(dateString)
        return `Joined in ${date.getFullYear()}`
      } catch {
        return 'Recently joined'
      }
    },

    initializeEditForm() {
      if (this.currentUser) {
        const [firstName = '', ...lastNameParts] = (this.currentUser.name || '').split(' ')
        this.editForm = {
          name: firstName,
          lastName: lastNameParts.join(' '),
          email: this.currentUser.email || '',
          phone: '',
          gender: '',
          birthday: '',
          province: '',
          barangay: '',
          city: '',
          street: '',
          zipCode: ''
        }
      }
    },
    closeModal(event) {
      if (event.target === event.currentTarget) {
        this.showEditProfile = false
        this.showEditPassword = false
      }
    },
    
    async saveProfile() {
      console.log('👤 [Profile] Saving profile...')
      
      if (!this.editForm.name.trim() || !this.editForm.lastName.trim() || !this.editForm.email.trim()) {
        alert('Please fill in all required fields (Name, Last Name, Email)')
        return
      }

      try {
        const profileData = {
          name: `${this.editForm.name.trim()} ${this.editForm.lastName.trim()}`,
          email: this.editForm.email.trim()
        }

        console.log('👤 [Profile] Updating profile with:', profileData)
        const result = await this.updateProfile(profileData)
        
        if (result.success) {
          console.log('👤 [Profile] Profile updated successfully')
          this.showEditProfile = false
          alert('Profile updated successfully!')
        } else {
          console.log('👤 [Profile] Profile update failed:', result.message)
          alert(result.message || 'Profile update failed')
        }
      } catch (error) {
        console.log('👤 [Profile] Profile update error:', error)
        alert('An error occurred while updating profile')
      }
    },
    
    async savePassword() {
      console.log('🔑 [Profile] Saving password...')
      
      if (!this.passwordForm.current.trim()) {
        alert('Please enter your current password')
        return
      }
      
      if (this.passwordForm.new !== this.passwordForm.confirm) {
        alert('New passwords do not match!')
        return
      }
      
      if (this.passwordForm.new.length < 6) {
        alert('Password must be at least 6 characters long!')
        return
      }

      try {
        const passwordData = {
          currentPassword: this.passwordForm.current,
          newPassword: this.passwordForm.new,
          confirmPassword: this.passwordForm.confirm
        }

        console.log('🔑 [Profile] Changing password...')
        const result = await this.changePassword(passwordData)
        
        if (result.success) {
          console.log('🔑 [Profile] Password changed successfully')
          this.showEditPassword = false
          this.passwordForm = { current: '', new: '', confirm: '' }
          alert('Password updated successfully!')
        } else {
          console.log('🔑 [Profile] Password change failed:', result.message)
          alert(result.message || 'Password change failed')
        }
      } catch (error) {
        console.log('🔑 [Profile] Password change error:', error)
        alert('An error occurred while changing password')
      }
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    toggleOrderDetails(orderId) {
      const index = this.expandedOrders.indexOf(orderId)
      if (index > -1) {
        this.expandedOrders.splice(index, 1)
      } else {
        this.expandedOrders.push(orderId)
      }
    },
    
    closeOrderTracking() {
      this.showOrderTracking = false
      this.trackingForm = { orderId: '', email: '' }
    },
    
    trackOrder() {
      if (!this.trackingForm.orderId || !this.trackingForm.email) {
        alert('Please fill in all fields')
        return
      }
      
      alert(`Tracking order ${this.trackingForm.orderId}...`)
      this.closeOrderTracking()
    }
  },

  async mounted() {
    // Redirect to home if not authenticated
    if (!this.isAuthenticated) {
      this.$router.push('/')
      return
    }

    // Fetch fresh user profile data
    try {
      await this.fetchUserProfile()
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }

    // Initialize edit form with current user data
    this.initializeEditForm()
  },

  watch: {
    currentUser: {
      handler() {
        this.initializeEditForm()
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.profile {
  padding: 3rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-50) 0%, #f0f4ff 100%);
}

.profile-header {
  margin-bottom: 3rem;
  text-align: center;
}

.profile-card {
  display: grid;
  grid-template-columns: 320px 1fr;
  background: var(--white);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 8px 32px rgba(91, 126, 255, 0.1);
  overflow: hidden;
  min-height: 600px;
  border: 1px solid rgba(91, 126, 255, 0.1);
}

.profile-sidebar {
  background: #E8EFFF;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar {
  margin-bottom: 2rem;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--primary-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 3rem;
}

.account-details {
  width: 100%;
}

.account-details h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--gray-800);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--gray-600);
}

.detail-item i {
  width: 16px;
  color: var(--primary-blue);
}

.user-role {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-blue);
  color: var(--white);
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.verification-status {
  margin-top: 2rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.status-item.verified {
  color: var(--success);
}

.status-item.verified i {
  color: var(--success);
}

.profile-main {
  padding: 2rem;
  display: flex;
  align-items: center;
}

.profile-info h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
}

.join-date {
  color: var(--gray-600);
  margin-bottom: 2rem;
}

.profile-actions {
  display: flex;
  gap: 1rem;
}

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
  background: var(--white);
  border-radius: var(--border-radius-lg);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.edit-profile-modal {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
  background: #E8EFFF;
}

.modal-header h3 {
  margin: 0;
  color: var(--primary-blue);
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--gray-600);
  cursor: pointer;
  padding: 0.25rem;
}

.close-btn:hover {
  color: var(--gray-800);
}

.modal-body {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--gray-800);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 0.5rem;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.save-btn {
  width: 100%;
  padding: 1rem;
  font-weight: 600;
  margin-top: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-card {
    grid-template-columns: 1fr;
  }
  
  .profile-sidebar {
    padding: 1.5rem;
  }
  
  .avatar-circle {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  .profile-main {
    padding: 1.5rem;
  }
  
  .profile-info h1 {
    font-size: 1.75rem;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: 95%;
  }
}

@media (max-width: 576px) {
  .profile {
    padding: 1rem 0;
  }
  
  .profile-sidebar,
  .profile-main {
    padding: 1rem;
  }
  
  .avatar-circle {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .profile-info h1 {
    font-size: 1.5rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
}

/* My Orders Styles */
.my-orders-section {
  margin-top: 2rem;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.orders-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-800);
}

.no-orders {
  text-align: center;
  padding: 3rem;
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.no-orders i {
  font-size: 3rem;
  color: var(--gray-400);
  margin-bottom: 1rem;
}

.no-orders h3 {
  color: var(--gray-800);
  margin-bottom: 0.5rem;
}

.no-orders p {
  color: var(--gray-600);
  margin-bottom: 2rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--primary-blue);
  color: var(--white);
}

.order-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.order-id {
  font-weight: 600;
}

.order-total {
  font-weight: 700;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--white);
  color: var(--primary-blue);
}

.order-status.pending {
  background: var(--warning);
  color: var(--white);
}

.order-status.shipped {
  background: var(--info);
  color: var(--white);
}

.order-status.delivered {
  background: var(--success);
  color: var(--white);
}

.toggle-details {
  background: none;
  border: none;
  color: var(--white);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s ease;
}

.toggle-details:hover {
  transform: scale(1.1);
}

.order-details {
  padding: 2rem;
  border-top: 1px solid var(--gray-200);
}

.details-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.details-table th,
.details-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
}

.details-table th {
  background: var(--gray-50);
  font-weight: 600;
  color: var(--primary-blue);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-image {
  width: 2rem;
  height: 2rem;
  border-radius: var(--border-radius);
  object-fit: cover;
}

.order-summary {
  border-top: 2px solid var(--gray-200);
  padding-top: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--primary-blue);
  border-top: 1px solid var(--gray-200);
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.order-tracking-modal {
  max-width: 400px;
}

.track-btn {
  width: 100%;
  padding: 1rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .orders-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .order-info {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .details-table {
    font-size: 0.875rem;
  }
  
  .details-table th,
  .details-table td {
    padding: 0.5rem;
  }
}
</style>
