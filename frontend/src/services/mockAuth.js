// Mock Authentication Service for Frontend Development
// This simulates backend authentication without actual API calls

const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@comphility.com',
    password: 'admin123',
    role: 'admin',
    phone: '09123456789',
    address: 'Cebu City, Philippines'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'user@comphility.com',
    password: 'user123',
    role: 'user',
    phone: '09987654321',
    address: 'Manila, Philippines'
  },
  {
    id: 3,
    name: 'Ryan Jay Miano',
    email: 'ryan@gmail.com',
    password: 'ryan123',
    role: 'user',
    phone: '09939920841',
    address: 'Gabi, Cordova, Cebu'
  }
]

class MockAuthService {
  // Simulate API delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // Login method
  async login(email, password) {
    await this.delay()
    
    const user = MOCK_USERS.find(u => 
      u.email === email && u.password === password
    )
    
    if (user) {
      // Generate mock token
      const token = 'mock_token_' + Date.now()
      
      // Store in localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }))
      
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    }
    
    return {
      success: false,
      message: 'Invalid email or password'
    }
  }
  
  // Admin login method
  async adminLogin(email, password) {
    await this.delay()
    
    const admin = MOCK_USERS.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === 'admin'
    )
    
    if (admin) {
      // Generate mock admin token
      const token = 'mock_admin_token_' + Date.now()
      
      // Store in localStorage
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminUser', JSON.stringify({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }))
      
      return {
        success: true,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        },
        token
      }
    }
    
    return {
      success: false,
      message: 'Invalid admin credentials'
    }
  }
  
  // Signup method
  async signup(userData) {
    await this.delay()
    
    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email)
    
    if (existingUser) {
      return {
        success: false,
        message: 'Email already exists'
      }
    }
    
    // Create new user
    const newUser = {
      id: MOCK_USERS.length + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
      phone: userData.phone || '',
      address: userData.address || ''
    }
    
    MOCK_USERS.push(newUser)
    
    // Auto login after signup
    const token = 'mock_token_' + Date.now()
    
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }))
    
    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    }
  }
  
  // Logout method
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    
    return { success: true }
  }
  
  // Check authentication
  isAuthenticated() {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    
    return !!(token && user)
  }
  
  // Check admin authentication
  isAdminAuthenticated() {
    const token = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')
    
    if (token && adminUser) {
      const user = JSON.parse(adminUser)
      return user.role === 'admin'
    }
    
    return false
  }
  
  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user') || localStorage.getItem('adminUser')
    
    if (userStr) {
      return JSON.parse(userStr)
    }
    
    return null
  }
  
  // Password reset (mock)
  async resetPassword(email) {
    await this.delay()
    
    const user = MOCK_USERS.find(u => u.email === email)
    
    if (user) {
      return {
        success: true,
        message: `Password reset link sent to ${email} (Mock: New password is "reset123")`
      }
    }
    
    return {
      success: false,
      message: 'Email not found'
    }
  }
}

// Export singleton instance
export default new MockAuthService()
