import { defineStore } from 'pinia'
import apiClient from '@/api'

export const useRankingStore = defineStore('ranking', {
  state: () => ({
    // 백엔드 Page<SalesRankingDto> 전체
    rankingPage: null,
    // 마지막 요청에 썼던 파라미터
    params: {
      regionCode: null,
      year:       null,
      month:      null,
      page:       0,
      size:       10
    }
  }),
  getters: {
    // v-simple-table 에 바인딩할 배열
    rankingList: state => state.rankingPage?.content || []
  },
  actions: {
    async fetchRanking(newParams) {
      this.params = { ...this.params, ...newParams }
      try {
        const res = await apiClient.get('/franchises/ranking', {
          params: this.params
        })
        this.rankingPage = res.data
      } catch (e) {
        const status = e.response?.status
        const msg    = e.response?.data?.message
        if (status === 400 || status === 404) alert(msg)
        else alert('랭킹 조회 중 오류가 발생했습니다.')
        this.rankingPage = null
      }
    }
  }
})
