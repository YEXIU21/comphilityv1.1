// Admin Store Module
const state = {
  // Admin user state
  adminUser: null,
  isAdminAuthenticated: false,
  
  // Dashboard statistics
  dashboardStats: {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenueToday: 0,
    bestSellers: []
  },
  
  // Products management
  products: [],
  productCategories: [
    { value: 'processor', label: 'Processor' },
    { value: 'motherboard', label: 'Motherboard' },
    { value: 'memory', label: 'Memory' },
    { value: 'graphics-card', label: 'Graphics Card' },
    { value: 'storage', label: 'Storage' },
    { value: 'power-supply', label: 'Power Supply' },
    { value: 'case', label: 'PC Case' },
    { value: 'monitor', label: 'Monitor' },
    { value: 'mouse', label: 'Mouse' },
    { value: 'keyboard', label: 'Keyboard' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'pc-set', label: 'PC Set' }
  ],
  currentProduct: null,
  
  // Orders management
  orders: [],
  orderFilters: {
    status: '',
    search: '',
    dateRange: null
  },
  currentOrder: null,
  
  // Users management
  users: [],
  userFilters: {
    role: '',
    search: '',
    status: ''
  },
  currentUser: null,
  
  // Statistics
  statistics: {
    salesData: [],
    categoryData: [],
    topProducts: [],
    recentActivity: []
  }
}

const mutations = {
  // Admin authentication
  SET_ADMIN_USER(state, user) {
    state.adminUser = user
    state.isAdminAuthenticated = true
  },
  
  LOGOUT_ADMIN(state) {
    state.adminUser = null
    state.isAdminAuthenticated = false
  },
  
  // Dashboard
  SET_DASHBOARD_STATS(state, stats) {
    state.dashboardStats = stats
  },
  
  UPDATE_DASHBOARD_STAT(state, { key, value }) {
    if (Object.prototype.hasOwnProperty.call(state.dashboardStats, key)) {
      state.dashboardStats[key] = value
    }
  },
  
  // Products
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  
  ADD_PRODUCT(state, product) {
    state.products.unshift(product)
  },
  
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
  },
  
  DELETE_PRODUCT(state, productId) {
    state.products = state.products.filter(p => p.id !== productId)
  },
  
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
  },
  
  // Orders
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  
  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    const order = state.orders.find(o => o.id === orderId)
    if (order) {
      order.status = status
    }
  },
  
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },
  
  SET_ORDER_FILTERS(state, filters) {
    state.orderFilters = { ...state.orderFilters, ...filters }
  },
  
  // Users
  SET_USERS(state, users) {
    state.users = users
  },
  
  ADD_USER(state, user) {
    state.users.push(user)
  },
  
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(u => u.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  
  SET_USER_FILTERS(state, filters) {
    state.userFilters = { ...state.userFilters, ...filters }
  },
  
  // Statistics
  SET_STATISTICS(state, stats) {
    state.statistics = stats
  },
  
  UPDATE_STATISTICS(state, { key, data }) {
    if (Object.prototype.hasOwnProperty.call(state.statistics, key)) {
      state.statistics[key] = data
    }
  }
}

const actions = {
  // Admin Authentication
  async loginAdmin({ commit }, credentials) {
    try {
      // API call to authenticate admin
      // const response = await api.adminLogin(credentials)
      
      // Simulated response
      const adminUser = {
        id: 1,
        name: 'Admin User',
        email: credentials.email,
        role: 'admin'
      }
      
      commit('SET_ADMIN_USER', adminUser)
      
      // Store in localStorage
      localStorage.setItem('adminToken', 'admin_token_here')
      localStorage.setItem('adminUser', JSON.stringify(adminUser))
      
      return { success: true }
    } catch (error) {
      console.error('Admin login error:', error)
      return { success: false, message: 'Invalid admin credentials' }
    }
  },
  
  logoutAdmin({ commit }) {
    commit('LOGOUT_ADMIN')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
  },
  
  checkAdminAuth({ commit }) {
    const adminUser = localStorage.getItem('adminUser')
    const adminToken = localStorage.getItem('adminToken')
    
    if (adminUser && adminToken) {
      commit('SET_ADMIN_USER', JSON.parse(adminUser))
      return true
    }
    return false
  },
  
  // Dashboard
  async fetchDashboardStats({ commit }) {
    try {
      // API call to fetch dashboard statistics
      // const response = await api.getDashboardStats()
      
      // Simulated data
      const stats = {
        totalProducts: 1100,
        totalOrders: 300,
        totalUsers: 100,
        revenueToday: 12500,
        bestSellers: [
          { id: 1, name: 'AMD Ryzen 5 5600X', sold: 100 },
          { id: 2, name: 'GeForce RTX 3060', sold: 80 },
          { id: 3, name: 'Samsung 980 Pro', sold: 60 },
          { id: 4, name: 'MSI B550 Pro', sold: 50 },
          { id: 5, name: 'Corsair Vengeance', sold: 40 }
        ]
      }
      
      commit('SET_DASHBOARD_STATS', stats)
      return stats
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return null
    }
  },
  
  // Products
  async fetchProducts({ commit }, filters = {}) {
    try {
      // API call with filters
      // const response = await api.getProducts(filters)
      
      // Simulated data
      const products = []
      
      commit('SET_PRODUCTS', products)
      return products
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },
  
  async createProduct({ commit }, productData) {
    try {
      // API call to create product
      // const response = await api.createProduct(productData)
      
      const newProduct = {
        ...productData,
        id: Date.now()
      }
      
      commit('ADD_PRODUCT', newProduct)
      return { success: true, product: newProduct }
    } catch (error) {
      console.error('Error creating product:', error)
      return { success: false, message: error.message }
    }
  },
  
  async updateProduct({ commit }, productData) {
    try {
      // API call to update product
      // const response = await api.updateProduct(productData.id, productData)
      
      commit('UPDATE_PRODUCT', productData)
      return { success: true }
    } catch (error) {
      console.error('Error updating product:', error)
      return { success: false, message: error.message }
    }
  },
  
  async deleteProduct({ commit }, productId) {
    try {
      // API call to delete product
      // const response = await api.deleteProduct(productId)
      
      commit('DELETE_PRODUCT', productId)
      return { success: true }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { success: false, message: error.message }
    }
  },
  
  // Orders
  async fetchOrders({ commit }, filters = {}) {
    try {
      // API call with filters
      // const response = await api.getOrders(filters)
      
      // Simulated data
      const orders = []
      
      commit('SET_ORDERS', orders)
      return orders
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  },
  
  async updateOrderStatus({ commit }, { orderId, status }) {
    try {
      // API call to update order status
      // const response = await api.updateOrderStatus(orderId, status)
      
      commit('UPDATE_ORDER_STATUS', { orderId, status })
      return { success: true }
    } catch (error) {
      console.error('Error updating order status:', error)
      return { success: false, message: error.message }
    }
  },
  
  // Users
  async fetchUsers({ commit }, filters = {}) {
    try {
      // API call with filters
      // const response = await api.getUsers(filters)
      
      // Simulated data
      const users = []
      
      commit('SET_USERS', users)
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  },
  
  async updateUser({ commit }, userData) {
    try {
      // API call to update user
      // const response = await api.updateUser(userData.id, userData)
      
      commit('UPDATE_USER', userData)
      return { success: true }
    } catch (error) {
      console.error('Error updating user:', error)
      return { success: false, message: error.message }
    }
  },
  
  // Statistics
  async fetchStatistics({ commit }, dateRange) {
    try {
      // API call to fetch statistics
      // const response = await api.getStatistics(dateRange)
      
      // Simulated data
      const statistics = {
        salesData: [],
        categoryData: [],
        topProducts: [],
        recentActivity: []
      }
      
      commit('SET_STATISTICS', statistics)
      return statistics
    } catch (error) {
      console.error('Error fetching statistics:', error)
      return null
    }
  }
}

const getters = {
  isAdminAuthenticated: state => state.isAdminAuthenticated,
  adminUser: state => state.adminUser,
  dashboardStats: state => state.dashboardStats,
  
  // Products getters
  allProducts: state => state.products,
  productById: state => id => state.products.find(p => p.id === id),
  productsByCategory: state => category => 
    state.products.filter(p => p.category === category),
  productCategories: state => state.productCategories,
  
  // Orders getters
  allOrders: state => state.orders,
  orderById: state => id => state.orders.find(o => o.id === id),
  ordersByStatus: state => status => 
    state.orders.filter(o => o.status === status),
  pendingOrdersCount: state => 
    state.orders.filter(o => o.status === 'pending').length,
  
  // Users getters
  allUsers: state => state.users,
  userById: state => id => state.users.find(u => u.id === id),
  usersByRole: state => role => 
    state.users.filter(u => u.role === role),
  activeUsersCount: state => 
    state.users.filter(u => u.status === 'active').length,
  
  // Statistics getters
  statistics: state => state.statistics
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
