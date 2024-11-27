import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

export const useDashboardStore = defineStore('dashboard', () => {
  const loading = ref(false)
  const errors = ref(null)
  const dashboards = ref([])
  const authStore = useAuthStore()

  const fetchDashboards = async () => {
    try {
      const response = await apiClient.get('/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      dashboards.value = response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    loading,
    errors,
    dashboards,
    fetchDashboards
  }
})
