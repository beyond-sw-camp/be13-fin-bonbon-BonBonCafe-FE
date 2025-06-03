<template>
  <!-- <div class="pa-6 container">
    <h3 class="mb-4 text-h5 font-weight-bold">
      🍽️ 선택한 가맹점의 메뉴 (총 {{ menus.length }}개)
    </h3> -->
    <v-container>
      <v-card elevation="2" class="pa-6 rounded-lg" style="border: 1px solid #ccc;">
         <h3 class="mb-4 text-h5 font-weight-bold">
          🍽️ 선택한 가맹점의 메뉴 (총 {{ menus.length }}개)
        </h3>
      <v-data-table
      :headers="headers"
      :items="menus"
      class="custom-table"
      density="comfortable"
      hide-default-footer
    >
      <template #item.price="{ item }">
        {{ formatPrice(item.price) }}
      </template>

      <template #item.status="{ item }">
        <v-chip
          :color="item.status === 'ACTIVE' ? 'green' : 'red'"
          text-color="white"
          small
          class="ma-1"
        >
          {{ item.status === 'ACTIVE' ? '활성화' : '비활성화' }}
        </v-chip>
      </template>
    </v-data-table>
    </v-card>
  </v-container>
  <!-- </div> -->
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const menus = ref([])

const headers = [
  { title: '메뉴명', key: 'name', align: 'start' },
  { title: '가격', key: 'price', align: 'end' },
  { title: '활성화 여부', key: 'status', align: 'center' } ,
]

const formatPrice = (price) => {
  if (price == null) return '-'
  return Number(price).toLocaleString() + '원'
}

onMounted(async () => {
  const franchiseId = route.params.franchiseId
  const { data } = await apiClient.get(`/franchise-menus/franchise/${franchiseId}`)
  menus.value = data.content || data
})
</script>

<style scoped>
.container {
  max-width: 600px; /* ⬅ 가로 너비 줄이기 (절반 정도) */
  margin: 0 auto;   /* ⬅ 가운데 정렬 */
}

.custom-table {
  border: 1px solid #ddd;
  border-radius: 8px 8px 0 0; /* 상단만 둥글게 */
  overflow: hidden;
}

.custom-table .v-data-table__th {
  background-color: #D8DBBD;
  font-weight: bold;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.custom-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.custom-table tbody tr:hover {
  background-color: #f0f8ff;
  transition: background-color 0.2s;
}
</style>