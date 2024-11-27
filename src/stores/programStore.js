import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

export const useProgramStore = defineStore('program', () => {
  const loading = ref(false)
  const errors = ref(null)
  const programs = ref([])
  const authStore = useAuthStore()

  const fetchPrograms = async () => {
    try {
      const response = await apiClient.get('/programs')
      programs.value = response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    loading,
    errors,
    programs,
    fetchPrograms
  }
})
