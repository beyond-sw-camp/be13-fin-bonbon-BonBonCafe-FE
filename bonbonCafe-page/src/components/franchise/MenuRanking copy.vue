<template>
  <div class="w-full">

    <v-card v-if="error" class="pa-2 mt-1">{{ error }}</v-card>

    <Doughnut 
      v-if="ranking && ranking.length && !error"
      :data="chartData" 
      :options="chartOptions" 
      class="mb-4" 
    />

    <table
      v-if="ranking && ranking.length && !error" 
      class="table-fixed w-full text-sm border-collapse"
    >
      <thead>
        <tr class="bg-gray-100">
          <th class="text-center px-5 py-2">순위</th>
          <th class="text-left px-8 py-2">메뉴</th>
          <th class="text-center px-12 py-2">수량</th>
          <th class="text-right px-11 py-2">판매액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in ranking" :key="idx" class="border-b">
          <td class="text-center px-1 py-2">{{ idx + 1 }}</td>
          <td class="text-left px-4 py-2">{{ item.menuName }}</td>
          <td class="text-center px-8 py-2">{{ item.totalQuantity }}</td>
          <td class="text-right px-8 py-2">{{ item.totalAmount.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>



<script setup>
import { ref, watch, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import apiClient from '@/api'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  franchiseId: {
    type: Number,
    required: true,
  }
})

const ranking = ref([])
const error = ref(null)

const fetchRanking = async (franchiseId) => {
//   const today = new Date()
//   const yesterday = new Date(today)
//   yesterday.setDate(today.getDate() - 1)

//   const formatDate = (date) => date.toISOString().split('T')[0] // yyyy-MM-dd

//   const startDate = formatDate(yesterday)
//   const endDate = formatDate(yesterday)
    const startDate = '2025-05-19';
    const endDate = '2025-05-24';

  try {
    error.value = null
    const response = await apiClient.get(`/franchise/menu/ranking/${franchiseId}`, {
      params: { startDate, endDate }
    })
    console.log("가맹점 메뉴 랭킹 조회",response);
    
    ranking.value = response.data
  } catch (err) {
    console.error('메뉴 랭킹 불러오기 실패', err)
    error.value = '메뉴 랭킹을 불러오는 중 오류가 발생했습니다.'
    ranking.value = []
  }
}

watch(
  () => props.franchiseId,
  (newId) => {
    if (newId) fetchRanking(newId)
  },
  { immediate: true }
)

const chartData = computed(() => ({
  labels: ranking.value.map(item => item.menuName),
  datasets: [{
    data: ranking.value.map(item => item.totalAmount),
    backgroundColor: [
      '#F98084', '#F7CAC9', '#92A8D1',
      '#BFD7B5', '#F6E2B3', '#FFE5D9', '#D3C0EB'
    ]
  }]
}))

const chartOptions = {
  responsive: true,
  cutout: '60%',
  plugins: { legend: { position: 'bottom' } }
}
</script>
