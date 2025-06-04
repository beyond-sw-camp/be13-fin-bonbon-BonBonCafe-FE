<template>
  <v-container fluid>
    <SalesRankingForm />

    <div class="table-wrapper">
      <v-table
        class="rounded-t-xl"
        style="min-width: 1200px; width: 1200px;"
      >

        <thead class="theadColor">
          <tr>
            <th class="text-center font-weight-bold">순위</th>
            <th class="text-center font-weight-bold">가맹점명</th>
            <th class="text-center font-weight-bold">총 매출</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in rankingList" :key="idx">
            <td class="text-center">
              {{ (currentPage-1)*pageSize + idx + 1 }}
            </td>
            <td class="text-center">{{ item.franchiseName }}</td>
            <td class="text-center">
              {{ item.totalSales.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-pagination
        v-if="pageCount > 1"
        v-model="currentPage"
        :length="pageCount"
        @update:modelValue="onPageChange"
        class="pagination-bar"
      />
    </div>
  </v-container>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import SalesRankingForm  from '@/components/forms/salesform/SalesRankingForm.vue'
import { useRankingStore } from '@/stores/rankingStore'

const rankingStore = useRankingStore()
const currentPage  = ref(1)
const pageSize     = 10

const rankingList = computed(() =>
  rankingStore.rankingPage?.content || []
)
const pageCount = computed(() =>
  rankingStore.rankingPage?.totalPages ?? 0
)

watch(() => rankingStore.rankingPage, p => {
  if (p) currentPage.value = p.number + 1
})

function onPageChange(page) {
  rankingStore.fetchRanking({ page: page-1, size: pageSize })
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  /* 가운데 정렬을 원하시면 이렇게 */
  display: flex;
  justify-content: center;
}
/* 헤더 스타일 */
.ranking-table thead th {
  background: #E0E8D0;
  font-weight: 600;
  padding: 12px 8px;
  font-size: 16px;
  min-width: 1500px;
  width: 150%;
}

/* 바디 스타일 */
.ranking-table tbody td {
  background: #FFF;
  vertical-align: middle;
  padding: 12px 8px;
  font-size: 13px;
  font-weight: 500;
}

/* 짝수 행 배경 */
.ranking-table tbody tr:nth-child(even) td {
  background: #FAFAFA;
}

/* 페이징 */
.pagination-bar {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}

.theadColor{
    background-color: #D8DBBD;
}
</style>