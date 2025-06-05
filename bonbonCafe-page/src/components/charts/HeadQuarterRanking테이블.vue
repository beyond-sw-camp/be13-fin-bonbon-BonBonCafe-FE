<template>
  <v-card class="pa-6 elevation-2 chart-card">
    <v-card-title class="subtitle-1 font-weight-bold">지난 가맹점 순위</v-card-title>
    <v-card-text>
      <v-table dense class="ranking-table">
        <thead>
          <tr>
            <th class="text-center font-weight-bold">순위</th>
            <th class="text-center font-weight-bold">가맹점명</th>
            <th class="text-center font-weight-bold">매출 (원)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in rankings" :key="item.franchiseName">
            <td class="text-center">{{ idx + 1 }}</td>
            <td class="text-center">{{ item.franchiseName }}</td>
            <td class="text-center">{{ item.totalSales.toLocaleString() }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import apiClient from '@/api'

const rankings = ref([])

onMounted(async () => {

  const endDate   = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const startDate = dayjs().subtract(3, 'month').format('YYYY-MM-DD')

  try {
    const res = await apiClient.get('/franchises/all/ranking', {
      params: { startDate, endDate, limit: 10}
    })

    rankings.value = res.data
  } catch (e) {
    console.error('가맹점 순위 조회 실패', e)
  }
})
</script>

<style scoped>
.chart-card {
  background-color: #ffff;
  border-radius: 40px;
}
/* 표 내부 패딩/폰트 조절 */
.ranking-table th,
.ranking-table td {
  padding: 12px 8px;
  font-size: 14px;
   white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 헤더 진하게 */
.ranking-table thead th {
  font-weight: 700;
  background: #f2f5f8;
}
/* 홀짝 배경 */
/* .ranking-table tbody tr:nth-child(even) td {
  background: #FAFAFA;
} */
</style>
