import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PcSets from '../views/PcSets.vue'
import Laptops from '../views/Laptops.vue'
import BestSellers from '../views/BestSellers.vue'
import Products from '../views/Products.vue'
import Cart from '../views/Cart.vue'
import Wishlist from '../views/Wishlist.vue'
import BuildPc from '../views/BuildPc.vue'
import Profile from '../views/Profile.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Processors from '../views/Processors.vue'
import Motherboards from '../views/Motherboards.vue'
import GraphicsCards from '../views/GraphicsCards.vue'
import Checkout from '../views/Checkout.vue'
import Memory from '../views/Memory.vue'
import Storage from '../views/Storage.vue'
import PowerSupply from '../views/PowerSupply.vue'
import Peripherals from '../views/Peripherals.vue'
import PcCases from '../views/PcCases.vue'

// Admin Components
import AdminLayout from '../components/admin/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import ProductManagement from '../views/admin/ProductManagement.vue'
import OrderManagement from '../views/admin/OrderManagement.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import CreateProduct from '../views/admin/CreateProduct.vue'
import EditProduct from '../views/admin/EditProduct.vue'
import OrderDetails from '../views/admin/OrderDetails.vue'
import Statistics from '../views/admin/Statistics.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/pc-sets',
    name: 'PcSets',
    component: PcSets
  },
  {
    path: '/laptops',
    name: 'Laptops',
    component: Laptops
  },
  {
    path: '/best-sellers',
    name: 'BestSellers',
    component: BestSellers
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/processors',
    name: 'Processors',
    component: Processors
  },
  {
    path: '/motherboards',
    name: 'Motherboards',
    component: Motherboards
  },
  {
    path: '/graphics-cards',
    name: 'GraphicsCards',
    component: GraphicsCards
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist
  },
  {
    path: '/build-pc',
    name: 'BuildPc',
    component: BuildPc
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/memory',
    name: 'Memory',
    component: Memory
  },
  {
    path: '/storage',
    name: 'Storage',
    component: Storage
  },
  {
    path: '/power-supply',
    name: 'PowerSupply',
    component: PowerSupply
  },
  {
    path: '/peripherals',
    name: 'Peripherals',
    component: Peripherals
  },
  {
    path: '/pc-cases',
    name: 'PcCases',
    component: PcCases
  },
  
  // Admin Routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'products',
        name: 'ProductManagement',
        component: ProductManagement
      },
      {
        path: 'products/create',
        name: 'CreateProduct',
        component: CreateProduct
      },
      {
        path: 'products/edit/:id',
        name: 'EditProduct',
        component: EditProduct
      },
      {
        path: 'orders',
        name: 'OrderManagement',
        component: OrderManagement
      },
      {
        path: 'orders/:id',
        name: 'OrderDetails',
        component: OrderDetails
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: Statistics
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('../views/admin/AdminProfile.vue')
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('../views/admin/AdminSettings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards for admin routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  if (requiresAuth) {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) {
      // Redirect to login or home
      alert('Please login as admin to access this page')
      next('/')
    } else if (requiresAdmin) {
      // Check if user has admin role
      const user = JSON.parse(userStr)
      if (user.role !== 'admin') {
        alert('You do not have permission to access this page')
        next('/')
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
