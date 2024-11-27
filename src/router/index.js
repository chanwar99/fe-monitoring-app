import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Home from '@/views/user/Home.vue'
import ReportUser from '@/views/user/Report.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminReport from '@/views/admin/AdminReport.vue'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'laporan-user', name: 'ReportUser', component: ReportUser }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'Dashboard', component: AdminDashboard },
      { path: 'verifikasi-laporan', name: 'AdminReport', component: AdminReport }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token // Cek apakah token ada
  const userRole = authStore.user ? authStore.user.role : null // Ambil role pengguna

  if (!isAuthenticated) {
    // Jika belum autentikasi, arahkan ke Login
    if (to.name !== 'Login' && to.name !== 'Register') {
      return next({ name: 'Login' })
    }
  } else {
    // Jika sudah autentikasi, arahkan berdasarkan role
    if (userRole === 'admin') {
      if (to.name === 'Login' || to.name === 'Register' || to.name === 'Home') {
        return next({ name: 'Dashboard' })
      }
    } else if (userRole === 'user') {
      if (to.name === 'Login' || to.name === 'Register' || to.name === 'Dashboard') {
        return next({ name: 'Home' })
      }
    }
  }

  next() // Izinkan navigasi jika tidak ada kondisi di atas
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
