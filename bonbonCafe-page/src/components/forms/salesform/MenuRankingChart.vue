  <template>
    <div class="menu-ranking-container">

      <div class="chart-wrapper mb-6">
        <canvas ref="menuChartRef"></canvas>
      </div>

      <v-simple-table dense class="my-menu-table">
        <thead v-if="ranking.length">
          <tr>
            <th class="text-center font-weight-bold">메뉴</th>
            <th class="text-center font-weight-bold">매출 (원)</th>
            <th class="text-center font-weight-bold">비율 (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in ranking"
            :key="idx"
            class="table-row"
          >
            <td
              class="text-center d-flex align-center justify-center"
              style="gap: 8px;"
            >
              <v-chip
                :style="{
                  backgroundColor: chartColors[idx],
                  width: '12px',
                  height: '12px'
                }"
                class="ma-0 pa-0"
                rounded
              />
              {{ item.menuName }}
            </td>
            <td class="text-center">
              {{ item.totalAmount.toLocaleString() }}
            </td>
            <td class="text-center">
              {{ menuPercentages[idx] }}%
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, nextTick, computed } from 'vue'
  import Chart from 'chart.js/auto'

  const menuChartRef = ref(null)
  let menuChart = null

  const props = defineProps({
    ranking: {
      type: Array,
      default: () => []
    }
  })

  // 차트에 사용할 데이터
  const chartColors = [
      'rgba(255, 99, 132, 0.6)',    // 부드러운 살구색
      'rgba(255, 159, 64, 0.6)',    // 부드러운 주황
      'rgba(255, 205, 86, 0.6)',    // 레몬옐로우
      'rgba(75, 192, 192, 0.6)',    // 민트 그린
      'rgba(54, 162, 235, 0.6)',    // 하늘색
      'rgba(153, 102, 255, 0.6)',   // 라벤더 퍼플
      'rgba(201, 203, 207, 0.6)'    // 연회색
  ]

  // 전체 매출 합계 계산
  const totalSales = computed(() =>
    props.ranking.reduce((sum, r) => sum + r.totalAmount, 0)
  )

  // 각 메뉴의 매출 비율 계산
  const menuPercentages = computed(() =>
    props.ranking.map(r =>
      ((r.totalAmount / totalSales.value) * 100).toFixed(1)
    )
  )

  onMounted(async () => {

    // ranking이 비어 있으면 차트 x
    if (!props.ranking.length) return

    await nextTick()
    if (menuChart) menuChart.destroy()

    const labels = props.ranking.map(i => i.menuName)
    const values = props.ranking.map(i => i.totalAmount)
    const ctx = menuChartRef.value.getContext('2d')

    menuChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: chartColors,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          r: {
            ticks: {
              callback: (value) => Number(value).toLocaleString() + '원',
              font: { size: 12 },
              color: '#444'
            },
            grid: { color: '#eee' }
          }
        }
      }
    })
  })
  </script>

  <style scoped>

  .chart-wrapper {
    position: relative;
    width: 100%;
    height: 500px; /* 필요에 따라 높이 조정하세요 */
  }
  .chart-wrapper canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }

  /* 테이블 기본 스타일 */
  .my-menu-table th,
  .my-menu-table td {
    font-size: 13px;
    padding: 16px 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* v-simple-table 전체를 block으로 너비 fit-content */
  ::v-deep(.my-menu-table) {
    display: block;
    width: fit-content;
    margin: 1%;
  }
  ::v-deep(.my-menu-table) th {
    font-weight: 700 !important;
  }
  ::v-deep(.my-menu-table) td:nth-child(1) {
    font-weight: 500 !important;
  }
  ::v-deep(.my-menu-table) td:nth-child(2) {
    font-weight: 400 !important;
  }
  ::v-deep(.my-menu-table) td:nth-child(3) {
    font-weight: 500 !important;
  }

  /* 칩(컬러 원) 스타일 */
  ::v-deep(.v-chip) {
    border-radius: 50% !important;
    min-width: 12px !important;
    height: 12px !important;
  }

  ::v-deep(.my-menu-table) {
  display: block;
  width: fit-content;
  margin-left: 16%;
}
  </style>
