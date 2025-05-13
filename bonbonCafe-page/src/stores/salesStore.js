import { defineStore } from 'pinia'
import apiClient from '@/api'

export const useSalesStore = defineStore('sales', {
  state: () => ({
    filters: { region: null, store: null, startDate: '', endDate: '' },
    labels: [], values: [], menuRanking: []
  }),
  actions: {
    async setFilters({ region, store, startDate, endDate }) {
      this.filters = { region, store, startDate, endDate }
      await this.fetchSales()
    },
    async fetchSales() {
      const { store, startDate, endDate } = this.filters
      if (!store || !startDate || !endDate) return
      try {
        const res = await apiClient.get(`/franchises/sales/period/${store}`, { params: { startDate, endDate } })
        this.labels = res.data.map(d => d.salesDate)
        this.values = res.data.map(d => d.totalAmount)
      } catch (error) {
        const status = error.response?.status
        const message = error.response?.data?.message
        if (status === 400 || status === 404) alert(message)
        else alert('매출 조회 중 오류가 발생했습니다.')
      }
    },
    async fetchMenuRanking() {
      const { store, startDate, endDate } = this.filters
      if (!store || !startDate || !endDate) return
      try {
        const res = await apiClient.get(`/franchises/menu/ranking/${store}`, { params: { startDate, endDate } })
        this.menuRanking = res.data
      } catch (error) {
        const status = error.response?.status
        const message = error.response?.data?.message
        if (status === 400 || status === 404) alert(message)
        else alert('메뉴 랭킹 조회 중 오류가 발생했습니다.')
      }
    }
  }
})

