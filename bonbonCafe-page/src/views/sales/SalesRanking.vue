<template>
  <v-container fluid>
    <SalesRankingForm />

    <div class="table-wrapper">
      <v-table class="ranking-table" width=1000px>

        <thead>
          <tr>
            <th class="th-rank">순위</th>
            <th class="th-name">가맹점명</th>
            <th class="th-sales">총 매출</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in rankingList" :key="idx">
            <td class="td-rank">
              {{ (currentPage-1)*pageSize + idx + 1 }}
            </td>
            <td class="td-name">{{ item.franchiseName }}</td>
            <td class="td-sales">
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
  /* width: 100%;          ★ 화면 가득 폭 사용 */
  /* padding: 0 16px/;      모바일 여백만 살짝 */
}

.ranking-table {
  width: 1000px;          /* 테이블도 100% 폭 */
  table-layout: fixed;  /* colgroup 비율 준수 */
  border-collapse: separate;
  border-spacing: 0 6px;
  margin: 0;            /* 중앙 정렬 X, 가득 채움 */
}

/* 헤더/바디 동일 패딩 */
/* .ranking-table thead th,
.ranking-table tbody td {
  padding: 12px 8px !important;
  font-size: 14px;
  border: none;
} */

/* 배경색 */
.ranking-table thead th {
  background: #E0E8D0;
  font-weight: 600;
}
.ranking-table tbody td {
  background: #FFF;
  vertical-align: middle;
}
.ranking-table tbody tr:nth-child(even) td {
  background: #FAFAFA;
}

/* 열별 정렬 */
.th-rank, .td-rank   { text-align: center; }
.th-name, .td-name   { text-align: left;   }
.th-sales, .td-sales { text-align: right;  }

/* 페이징 */
.pagination-bar {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}
</style>
