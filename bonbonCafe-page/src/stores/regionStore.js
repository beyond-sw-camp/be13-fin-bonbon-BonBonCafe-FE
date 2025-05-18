import { defineStore } from 'pinia'
import apiClient from '@/api'

export const useRegionStore = defineStore('region', {
  state: () => ({
    majors: [], subs: [], franchises: [],
    selectedMajor: null, selectedSub: null, selectedFranchise: null
  }),
  actions: {
    async fetchMajors() {
      const res = await apiClient.get('/regions/majors')
      this.majors = res.data
    },
    async fetchSubs(major) {
      const res = await apiClient.get('/regions/sub', { params: { major } })
      this.subs = res.data
    },
    async fetchFranchises(regionCode) {
      const res = await apiClient.get('/regions/franchises', { params: { regionCode } })
      this.franchises = res.data
    }
  }
})