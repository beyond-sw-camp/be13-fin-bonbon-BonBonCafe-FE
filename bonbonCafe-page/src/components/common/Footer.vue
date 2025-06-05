<template>
  <v-card flat class="headquarter-info pa-3">
    <v-row no-gutters class="mb-2" align="center">
      <v-col cols="4" class="info-label">
        <v-icon size="18" class="mr-1">mdi-domain</v-icon>
        이름
      </v-col>
      <v-col cols="8" class="info-value text-truncate">{{ info.name }}</v-col>
    </v-row>

    <v-row no-gutters class="mb-2" align="center">
      <v-col cols="4" class="info-label">
        <v-icon size="18" class="mr-1">mdi-phone</v-icon>
        전화
      </v-col>
      <v-col cols="8" class="info-value text-truncate">{{ info.headquarterTel }}</v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="4" class="info-label">
        <v-icon size="18" class="mr-1">mdi-map-marker</v-icon>
        주소
      </v-col>
      <v-col cols="8" class="info-value text-truncate">
        {{ info.roadAddress }} {{ info.detailAddress }}
      </v-col>
    </v-row>
  </v-card>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import apiClient from '@/api'

const info = ref({})

onMounted(async () => {
  const { data } = await apiClient.get('/headquarters')
  info.value = data
})
</script>

<style scoped>
.headquarter-info {
  font-size: 13px;
  background-color: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgb(165, 165, 165);
}

.info-label {
  font-weight: 500;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.info-value {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>