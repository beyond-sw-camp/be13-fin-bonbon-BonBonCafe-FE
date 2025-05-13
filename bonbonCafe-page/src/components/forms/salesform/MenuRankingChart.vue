<template>
  <div class="w-full">
    <h3 class="text-lg font-bold mb-2">메뉴별 판매 비율</h3>
    <Doughnut :data="chartData" :options="chartOptions" class="mb-4" />

    <table class="table-auto w-full text-sm">
      <thead>
        <tr>
          <th class="text-left px-2 py-1">메뉴</th>
          <th class="text-right px-2 py-1">수량</th>
          <th class="text-right px-2 py-1">판매액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in ranking" :key="idx">
          <td class="px-2 py-1">{{ item.menuName }}</td>
          <td class="text-right px-2 py-1">{{ item.totalQuantity }}</td>
          <td class="text-right px-2 py-1">{{ item.totalAmount.toLocaleString() }}</td>
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
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
  }]
}))

const chartOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' } }
}
</script>