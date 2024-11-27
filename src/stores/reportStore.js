// src/stores/reportStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

export const useReportStore = defineStore('report', () => {
  const loading = ref(false)
  const errors = ref(null)
  const reports = ref([])
  const adminReports = ref([])
  const report = ref(null)
  const authStore = useAuthStore()

  const fetchReports = async () => {
    try {
      const response = await apiClient.get('reports', {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      reports.value = response.data
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  const fetchAdminReports = async () => {
    try {
      const response = await apiClient.get('admin/reports', {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      adminReports.value = response.data
      return response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const fetchReportById = async (id) => {
    try {
      const response = await apiClient.get(`reports/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      report.value = response.data
      console.log(response.data)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const addReport = async (reportData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post('reports', reportData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      reports.value.push(response.data.data)
      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data.errors
      } else {
        console.error(error)
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const approveReport = async (id) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post(`admin/reports/${id}/approve`, null, {
        params: {
          _method: 'PUT'
        },
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })

      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data.errors
      } else {
        console.error(error)
      }
      throw error
    } finally {
      loading.value = false
    }
  }
  const rejectReport = async (id, alasan_penolakan) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post(
        `admin/reports/${id}/reject`,
        { alasan_penolakan },
        {
          params: {
            _method: 'PUT'
          },
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        }
      )

      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data.errors
      } else {
        console.error(error)
      }
      throw error
    } finally {
      loading.value = false
    }
  }
  const updateReport = async (id, reportData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post(`/reports/${id}`, reportData, {
        params: {
          _method: 'PUT'
        },
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      const index = reports.value.findIndex((report) => report.id === id)
      if (index !== -1) {
        reports.value[index] = response.data.data
      }
      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data.errors
      } else {
        console.error(error)
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteReport = async (id) => {
    try {
      const response = await apiClient.delete(`reports/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      reports.value = reports.value.filter((report) => report.id !== id)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    loading,
    errors,
    reports,
    report,
    adminReports,
    fetchReports,
    fetchReportById,
    addReport,
    updateReport,
    deleteReport,
    fetchAdminReports,
    rejectReport,
    approveReport
  }
})
