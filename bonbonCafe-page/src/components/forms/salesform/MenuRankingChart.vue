<template>
  <div class="w-full">
    <h3 class="text-lg font-bold mb-2"></h3>
    <Doughnut 
      v-if="ranking.length"
      :data="chartData" 
      :options="chartOptions" 
      class="mb-4" />

    <table
      v-if="ranking.length" 
      class="table-fixed w-full text-sm border-collapse"
    >
      <colgroup>
        <col class="w-1/12" />   <!-- 순위 -->
        <col class="w-6/12" />   <!-- 메뉴 -->
        <col class="w-2/12" />   <!-- 수량 -->
        <col class="w-3/12" />   <!-- 판매액 -->
      </colgroup>

      <thead>
        <tr class="bg-gray-100">
          <th class="text-center px-5 py-2">순위</th>
          <th class="text-left  px-8 py-2">메뉴</th>
          <th class="text-center px-12 py-2">수량</th>
          <th class="text-right px-11 py-2">판매액</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, idx) in ranking" :key="idx" class="border-b">
          <td class="text-center px-1 py-2">{{ idx + 1 }}</td>
          <td class="text-left   px-4 py-2">{{ item.menuName }}</td>
          <td class="text-center px-8 py-2">{{ item.totalQuantity }}</td>
          <td class="text-right  px-8 py">{{ item.totalAmount.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  ranking: Array
})

const chartData = computed(() => ({
  labels: props.ranking.map(item => item.menuName),
  datasets: [{
    data: props.ranking.map(item => item.totalAmount),
    backgroundColor: [
    '#F98084', //
      '#F7CAC9', // 파스텔 핑크
      '#92A8D1', // 파스텔 블루
      '#BFD7B5', // 파스텔 민트
      '#F6E2B3', // 파스텔 옐로우
      '#FFE5D9', // 파스텔 피치
      '#D3C0EB'  // 파스텔 라벤더
    ]
  }]
}))

const chartOptions = {
  responsive: true,
  cutout: '60%',
  plugins: { legend: { position: 'bottom' } }
}
</script>