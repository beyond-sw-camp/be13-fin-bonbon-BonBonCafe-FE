<template>
  <v-card class=" franchise-card ">
    <SalesRankingForm />

    <div class="table-wrapper">
      <v-data-table
        :headers="headers"
        :items="rankingList"
        :items-length="totalItems"
        :items-per-page="pageSize"
        :page="currentPage"
        hide-default-footer
        class="ranking-table rounded-b rounded-t"
        @update:page="onPageChange"
        @update:items-per-page="onPageSizeChange"
      >
        <!-- 행 커스텀 렌더링 -->
        <template #item="{ item, index }">
          <tr>
            <td class="text-center">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td class="text-center">{{ item.franchiseName }}</td>
            <td class="text-center">{{ item.totalSales.toLocaleString() }}</td>
          </tr>
        </template>

      </v-data-table>

      <!-- 페이지네이션 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @update:model-value="onPageChange"
        class="pagination-bar"
      />
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SalesRankingForm from '@/components/forms/salesform/SalesRankingForm.vue'
import { useRankingStore } from '@/stores/rankingStore'

const rankingStore = useRankingStore()

const currentPage = ref(1)
const pageSize = ref(10)

const rankingList = computed(() => rankingStore.rankingPage?.content || [])
const totalPages = computed(() => rankingStore.rankingPage?.totalPages ?? 0)
const totalItems = computed(() => rankingStore.rankingPage?.totalElements ?? 0)

const headers = [
  { title: '순위', key: 'rank', align: 'center' },
  { title: '가맹점명', key: 'franchiseName', align: 'center' },
  { title: '총 매출', key: 'totalSales', align: 'center' }
]

function onPageChange(page) {
  currentPage.value = page
  fetchData()
}

function onPageSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

function fetchData() {
  rankingStore.fetchRanking({
    page: currentPage.value - 1,
    size: pageSize.value
  })
}

watch(() => rankingStore.rankingPage, p => {
  if (p) currentPage.value = p.number + 1
})

fetchData()
</script>

<style scoped>
.franchise-card {
    margin: 40px auto;
    padding: 40px;
    max-width: 1300px;
    background-color: #fff;
    border-radius: 16px;
    height: 800px; /* 고정 높이 */
    overflow-y: auto; /* 내용 많을 경우 스크롤 */

}
.table-wrapper {
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1200px;
}

.pagination-bar {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}

::v-deep(.v-data-table__th) {
  background-color: #f2f5f8 !important;
}

::v-deep(.v-data-table tbody tr:hover) {
  background-color: #f4faff;
  cursor: pointer;
}

</style>
