// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/apiService'

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false)
  const errors = ref(null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)

  const register = async (userData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post('/auth/register', userData)
      user.value = response.data.user
      token.value = response.data.token

      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)

      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data
      } else {
        console.error(error)
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const login = async (userData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post('/auth/login', userData)
      user.value = response.data.user
      token.value = response.data.token

      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)

      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data
      } else {
        console.error(error)
      }
      throw error.response.data
    } finally {
      loading.value = false
    }
  }

  const currentUser = async () => {
    try {
      const response = await apiClient.get('/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      user.value = response.data.user
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const response = await apiClient.post(
        '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }
      )
      user.value = null
      token.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post('/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      user.value = response.data.user
      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data
      } else {
        console.error(error)
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errors,
    user,
    token,
    register,
    login,
    logout,
    currentUser,
    updateProfile
  }
})
