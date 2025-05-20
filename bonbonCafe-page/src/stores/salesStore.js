import { defineStore } from 'pinia'
import apiClient from '@/api'
import dayjs from 'dayjs'
export const useSalesStore = defineStore('sales', {
  // 저장할 상태 값 정의
  state: () => ({
    filters: { region: null, store: null, startDate: '', endDate: '' },
    labels: [], // 바 차트 x축(날짜)
    values: [], // 바 차트 y축(매출액)
    menuRanking: [], // 도넛 차트 데이터(메뉴별 판매 순위)
    forecast: [], forecastLabels: [], forecastYhat: [], forecastLower: [], forecastUpper: []
  }),
  actions: {
    // 외부에서 필터를 받아 filter에 저장
    async setFilters({ region, store, startDate, endDate }) {
      this.filters = { region, store, startDate, endDate }
      // fetchSales 호출하여 차트에 쓸 데이터 갱신
      await this.fetchSales()
      await this.fetchMenuRanking()
    },

    // 기간별 매출 조회 로직
    async fetchSales() {
      const { store, startDate, endDate } = this.filters
      if (!store || !startDate || !endDate) return
      try {
        const res = await apiClient.get(`/franchises/sales/period/${store}`, 
          { params: { startDate, endDate }
        })

        this.labels = res.data.map(d => dayjs(d.salesDate).format('MM-DD'))
        this.values = res.data.map(d => d.totalAmount)
      
      } catch (error) {
        const status = error.response?.status
        const message = error.response?.data?.message
        if (status === 400 || status === 404) alert(message)
        else alert('매출 조회 중 오류가 발생했습니다.')
      }
    },

    // 메뉴 랭킹 조회 로직
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
    },
    async fetchWeeklyForecast({ expectationStartDate, periods = 7 }) {
      const { store } = this.filters
      if (!store || !expectationStartDate) return

      try {
        const res = await apiClient.get(
          `/franchises/forecast/weekly/${store}`,
          { params: { expectationStartDate, periods } }
        )
        this.forecast        = res.data
        this.forecastLabels  = res.data.map(d => dayjs(d.salesDate).format('MM-DD'))
        this.forecastYhat    = res.data.map(d => Math.round(d.yhat))
        this.forecastLower   = res.data.map(d => Math.round(d.yhat_lower))
        this.forecastUpper   = res.data.map(d => Math.round(d.yhat_upper))

      } catch (error) {
        const status  = error.response?.status
        const message = error.response?.data?.message
        if (status === 400 || status === 404) alert(message)
        else alert('예측 조회 중 오류가 발생했습니다.')
      }
    }
  }
})
