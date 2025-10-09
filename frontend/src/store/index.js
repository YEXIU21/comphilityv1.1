import { createStore } from 'vuex'
import { authService } from '@/services'

// Initialize user from localStorage
const initializeUser = () => {
  const token = localStorage.getItem('auth_token')
  const userStr = localStorage.getItem('user')
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      console.log('🔄 [Vuex Init] User found in localStorage:', user)
      return { user, isAuthenticated: true }
    } catch (error) {
      console.error('❌ [Vuex Init] Error parsing user from localStorage:', error)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }
  
  console.log('🔄 [Vuex Init] No user in localStorage')
  return { user: null, isAuthenticated: false }
}

const { user: initialUser, isAuthenticated: initialAuth } = initializeUser()

export default createStore({
  state: {
    // Modal states
    showLoginModal: false,
    showSignupModal: false,
    showPasswordResetModal: false,
    showUserDropdown: false,
    
    // User state
    user: initialUser,
    isAuthenticated: initialAuth,
    
    // Cart and Wishlist
    cart: [],
    wishlist: [],
    
    // Products
    products: [],
    categories: [
      {
        id: 1,
        name: 'Components',
        subcategories: [
          'Processor', 'Motherboard', 'Memory', 'SSD', 'HDD', 
          'Graphics Card', 'CPU Fan', 'Chassis Fan', 'Power Supply', 'PC Case'
        ]
      },
      {
        id: 2,
        name: 'Peripherals',
        subcategories: [
          'Mouse', 'Keyboard', 'Monitor', 'Printer', 'Speaker', 
          'Headset', 'Web Cam', 'AVR', 'Microphone'
        ]
      },
      {
        id: 3,
        name: 'PC Furnitures',
        subcategories: ['Chairs', 'Tables']
      }
    ]
  },
  
  mutations: {
    // Modal mutations
    showLoginModal(state) {
      console.log('🔑 [Vuex] showLoginModal mutation called')
      console.log('🔍 [Vuex] Before:', state.showLoginModal)
      state.showLoginModal = true
      console.log('🔍 [Vuex] After:', state.showLoginModal)
    },
    hideLoginModal(state) {
      state.showLoginModal = false
    },
    showSignupModal(state) {
      state.showSignupModal = true
    },
    hideSignupModal(state) {
      state.showSignupModal = false
    },
    showPasswordResetModal(state) {
      state.showPasswordResetModal = true
    },
    hidePasswordResetModal(state) {
      state.showPasswordResetModal = false
    },
    toggleUserDropdown(state) {
      state.showUserDropdown = !state.showUserDropdown
    },
    hideUserDropdown(state) {
      state.showUserDropdown = false
    },
    
    // User mutations
    setUser(state, user) {
      console.log('🔄 [Vuex Mutation] Setting user:', user)
      state.user = user
      state.isAuthenticated = true
      console.log('🔄 [Vuex Mutation] Authentication state:', state.isAuthenticated)
    },
    
    logout(state) {
      console.log('🔄 [Vuex Mutation] Logging out user')
      state.user = null
      state.isAuthenticated = false
      console.log('🔄 [Vuex Mutation] Authentication state:', state.isAuthenticated)
    },
    
    // Cart mutations
    addToCart(state, product) {
      console.log('🛒 [Vuex] Adding to cart (local):', product)
      const existingItem = state.cart.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += 1
        console.log('✅ [Vuex] Increased quantity:', existingItem)
      } else {
        state.cart.push({ ...product, quantity: 1 })
        console.log('✅ [Vuex] Added new item to cart')
      }
      console.log('🛒 [Vuex] Cart now has', state.cart.length, 'items')
    },
    setCart(state, cartItems) {
      console.log('🛒 [Vuex] Setting cart from server:', cartItems)
      state.cart = cartItems
    },
    removeFromCart(state, productId) {
      console.log('🗑️ [Vuex] Removing from cart:', productId)
      state.cart = state.cart.filter(item => item.id !== productId)
      console.log('🛒 [Vuex] Cart now has', state.cart.length, 'items')
    },
    
    clearCart(state) {
      console.log('🗑️ [Vuex] Clearing cart')
      state.cart = []
    },
    updateCartQuantity(state, { productId, quantity }) {
      console.log('🔄 [Vuex] Updating quantity for product:', productId, 'to', quantity)
      const item = state.cart.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
        console.log('✅ [Vuex] Quantity updated')
      }
    },
    
    // Wishlist mutations
    addToWishlist(state, product) {
      const exists = state.wishlist.find(item => item.id === product.id)
      if (!exists) {
        state.wishlist.push(product)
      }
    },
    removeFromWishlist(state, productId) {
      state.wishlist = state.wishlist.filter(item => item.id !== productId)
    },
    
    // Product mutations
    setProducts(state, products) {
      state.products = products
    }
  },
  
  actions: {
    // Auth actions
    async login({ commit, dispatch }, credentials) {
      try {
        console.log('🏪 [Vuex Store] Login action called with credentials:', { email: credentials.email, password: '***' })
        const result = await authService.login(credentials)
        console.log('🏪 [Vuex Store] AuthService login result:', result)
        
        if (result.success) {
          console.log('🏪 [Vuex Store] Login successful, setting user:', result.user)
          commit('setUser', result.user)
          commit('hideLoginModal')
          
          // Fetch cart from database after login
          await dispatch('fetchCart')
          
          return { success: true }
        } else {
          console.log('🏪 [Vuex Store] Login failed from auth service:', result.message)
          return { success: false, message: result.message || 'Login failed' }
        }
      } catch (error) {
        console.log('🏪 [Vuex Store] Login error:', error)
        return { success: false, message: error.response?.data?.message || 'Login failed' }
      }
    },
    
    async signup({ commit }, userData) {
      try {
        const result = await authService.register(userData)
        if (result.success) {
          commit('setUser', result.user)
          commit('hideSignupModal')
          return { success: true }
        } else {
          return { success: false, message: result.message || 'Signup failed' }
        }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Signup failed' }
      }
    },
    
    async logout({ commit }) {
      try {
        authService.logout()
        commit('logout')
        commit('clearCart')
        return { success: true }
      } catch (error) {
        return { success: false, message: 'Logout failed' }
      }
    },
    
    // Cart actions
    async addToCartDB({ commit, state }, product) {
      console.log('🛒 [Vuex Action] Adding to cart (with DB sync):', product)
      
      // Add to local cart immediately for instant UI feedback
      commit('addToCart', product)
      
      // If user is authenticated, sync with database
      if (state.isAuthenticated) {
        try {
          const api = require('@/services/api').default
          const response = await api.post('/cart', {
            product_id: product.id,
            quantity: 1
          })
          console.log('✅ [Vuex Action] Cart synced with database')
          // Update cart with server response
          commit('setCart', response.cart)
        } catch (error) {
          console.error('❌ [Vuex Action] Failed to sync cart with database:', error)
          // Keep local cart even if API fails
        }
      } else {
        console.log('⚠️ [Vuex Action] User not authenticated, cart only stored locally')
      }
    },
    
    async fetchCart({ commit, state }) {
      if (!state.isAuthenticated) {
        console.log('⚠️ [Vuex Action] User not authenticated, skipping cart fetch')
        return
      }
      
      try {
        console.log('🔄 [Vuex Action] Fetching cart from database...')
        const api = require('@/services/api').default
        const response = await api.get('/cart')
        console.log('✅ [Vuex Action] Cart fetched from database:', response.cart)
        commit('setCart', response.cart)
      } catch (error) {
        console.error('❌ [Vuex Action] Failed to fetch cart:', error)
      }
    },

    async resetPassword({ commit }, email) {
      // Simulate API call
      try {
        // Password reset logic will be handled by authService
        // For now, just simulate success
        commit('hidePasswordResetModal')
        return { success: true, message: 'Password reset email sent' }
      } catch (error) {
        return { success: false, message: 'Reset failed' }
      }
    },

    // Initialize authentication state on app startup
    initializeAuth({ commit }) {
      const authState = authService.initializeAuth()
      if (authState.isAuthenticated && authState.user) {
        commit('setUser', authState.user)
      } else {
        commit('logout')
      }
      return authState
    },

    // Fetch fresh user profile
    async fetchUserProfile({ commit }) {
      try {
        const result = await authService.getCurrentUserProfile()
        if (result.success) {
          commit('setUser', result.user)
          return { success: true, user: result.user }
        } else {
          return { success: false, message: result.message }
        }
      } catch (error) {
        return { success: false, message: 'Failed to fetch user profile' }
      }
    },

    // Update user profile
    async updateProfile({ commit }, profileData) {
      try {
        console.log('🏪 [Vuex Store] Update profile action called with:', profileData)
        const result = await authService.updateProfile(profileData)
        console.log('🏪 [Vuex Store] Update profile result:', result)
        
        if (result.success) {
          console.log('🏪 [Vuex Store] Profile update successful, updating user state')
          commit('setUser', result.user)
          return { success: true, message: result.message }
        } else {
          console.log('🏪 [Vuex Store] Profile update failed:', result.message)
          return { success: false, message: result.message }
        }
      } catch (error) {
        console.log('🏪 [Vuex Store] Profile update error:', error)
        return { success: false, message: 'Profile update failed' }
      }
    },

    // Change password
    async changePassword({ commit }, passwordData) {
      try {
        console.log('🏪 [Vuex Store] Change password action called')
        const result = await authService.changePassword(passwordData)
        console.log('🏪 [Vuex Store] Change password result:', result)
        
        return result
      } catch (error) {
        console.log('🏪 [Vuex Store] Change password error:', error)
        return { success: false, message: 'Password change failed' }
      }
    }
  },
  
  getters: {
    cartTotal: state => {
      return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    cartItemCount: state => {
      // Count unique products, not total quantity
      return state.cart.length
    },
    wishlistCount: state => {
      return state.wishlist.length
    },
    isInWishlist: state => productId => {
      return state.wishlist.some(item => item.id === productId)
    }
  }
})
