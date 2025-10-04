import api from './api'

// Helper function to decode JWT without verification (client-side only for display)
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

export const authService = {
  // Login user
  async login(credentials) {
    try {
      console.log('🌐 [AuthService] Making login API call to /auth/login with:', { email: credentials.email, password: '***' })
      const response = await api.post('/auth/login', credentials)
      console.log('🌐 [AuthService] API response received:', response)
      console.log('🌐 [AuthService] Response type:', typeof response)
      console.log('🌐 [AuthService] Response keys:', Object.keys(response))
      
      const { token, user } = response
      console.log('🌐 [AuthService] Extracted token:', token ? 'present' : 'missing')
      console.log('🌐 [AuthService] Extracted user:', user)
      console.log('🌐 [AuthService] User role:', user?.role)
      
      if (!token || !user) {
        console.error('❌ [AuthService] Missing token or user in response!')
        return { success: false, message: 'Invalid response from server' }
      }
      
      // Store token and user data
      console.log('💾 [AuthService] Storing in localStorage...')
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Verify storage
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')
      console.log('✅ [AuthService] Verification - Token stored:', storedToken ? 'YES' : 'NO')
      console.log('✅ [AuthService] Verification - User stored:', storedUser ? 'YES' : 'NO')
      console.log('✅ [AuthService] Stored user data:', storedUser)
      
      return { success: true, user, token }
    } catch (error) {
      console.log('🌐 [AuthService] Login API error:', error)
      console.log('🌐 [AuthService] Error response:', error.response?.data)
      console.log('🌐 [AuthService] Error code:', error.code)
      console.log('🌐 [AuthService] Error message:', error.message)
      
      // Handle different error types
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please ensure the backend is running on http://localhost:3000' 
        }
      }
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
        return { 
          success: false, 
          message: 'Server connection refused. Please start the backend server.' 
        }
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed. Please check if the backend server is running.' 
      }
    }
  },

  // Register new user
  async register(userData) {
    try {
      console.log('🌐 [AuthService] Making register API call to /auth/register')
      const response = await api.post('/auth/register', userData)
      console.log('🌐 [AuthService] Register response received:', response)
      
      const { token, user } = response
      
      // Store token and user data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      console.log('🌐 [AuthService] User registered and stored in localStorage')
      
      return { success: true, user, token }
    } catch (error) {
      console.log('🌐 [AuthService] Register API error:', error)
      console.log('🌐 [AuthService] Error response:', error.response?.data)
      console.log('🌐 [AuthService] Error code:', error.code)
      
      // Handle different error types
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please ensure the backend is running on http://localhost:3000' 
        }
      }
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
        return { 
          success: false, 
          message: 'Server connection refused. Please start the backend server.' 
        }
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration failed. Please check if the backend server is running.' 
      }
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      await api.post('/auth/reset-password', { email })
      return { 
        success: true, 
        message: 'Password reset email sent successfully' 
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password reset failed' 
      }
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      console.log('👤 [AuthService] Updating profile with:', profileData)
      const response = await api.put('/auth/profile', profileData)
      console.log('👤 [AuthService] Profile update response:', response)
      
      // Update localStorage with new user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        console.log('👤 [AuthService] Updated user data in localStorage')
      }
      
      return { 
        success: true, 
        user: response.user,
        message: 'Profile updated successfully' 
      }
    } catch (error) {
      console.log('👤 [AuthService] Profile update error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      }
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      console.log('🔑 [AuthService] Changing password...')
      await api.put('/auth/password', passwordData)
      console.log('🔑 [AuthService] Password changed successfully')
      return { 
        success: true, 
        message: 'Password changed successfully' 
      }
    } catch (error) {
      console.log('🔑 [AuthService] Password change error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password change failed' 
      }
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('auth_token')
    if (!token) return false
    
    // Check if token is expired
    const decoded = decodeJWT(token)
    if (!decoded) return false
    
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp > currentTime
  },

  // Get user data from JWT token
  getUserFromToken() {
    const token = localStorage.getItem('auth_token')
    if (!token) return null
    
    const decoded = decodeJWT(token)
    if (!decoded) return null
    
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    }
  },

  // Fetch current user profile from API
  async getCurrentUserProfile() {
    try {
      const response = await api.get('/auth/me')
      return { success: true, user: response.user }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch user profile' 
      }
    }
  },

  // Initialize auth state (for app startup)
  initializeAuth() {
    if (this.isAuthenticated()) {
      const user = this.getUserFromToken() || this.getCurrentUser()
      return { isAuthenticated: true, user }
    }
    
    // Clean up if token is expired or invalid
    this.logout()
    return { isAuthenticated: false, user: null }
  }
}
