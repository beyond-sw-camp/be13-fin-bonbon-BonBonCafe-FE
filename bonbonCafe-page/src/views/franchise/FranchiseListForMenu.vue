<template>
  <div class="ma-16 mt-4 pa-10 Tdiv">
    <!-- 🔍 상단 필터 영역 -->
    <div class="mb-16" id="div0">
      <div id="div1">
        <SelectBox
          class="select-region"
          v-model="selectedRegion"
          :placeholder="'지역 선택'"
          :items="regionList"
        />
        <SelectBox
          class="select-district"
          v-model="selectedDistrict"
          :placeholder="'구 선택'"
          :items="districtList"
        />
        <v-text-field
          class="search-input"
          density="comfortable"
          variant="outlined"
          flat="false"
          placeholder="Search here"
          prepend-inner-icon="mdi-magnify"
          width="300px"
        />
      </div>
    </div>

    <!-- 📋 가맹점 목록 테이블 -->
    <v-table class="elevation-1 theadColor custom-rounded-table">
      <thead>
        <tr>
          <th>NO.</th>
          <th>가맹점 이름</th>
          <th>가맹점 주소</th>
          <!-- <th>담당자</th> -->
          <th>가맹점 연락처</th>
          <th>등록일</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(franchise, index) in item"
          :key="franchise.franchiseId"
          @click="handleRowClick(franchise)"
          style="cursor: pointer"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ franchise.name }}</td>
          <td>{{ franchise.roadAddress }}</td>
          <!-- <td>{{ franchise.managerName }}</td> -->
          <td>{{ franchise.franchiseTel }}</td>
          <td>{{ franchise.openDate }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
import apiClient from '@/api';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SelectBox from '@/components/franchise/Select.vue';

const router = useRouter();
const item = ref([]);
const page = ref(1);
const totalCount = ref(1);
const selectedRegion = ref(null);
const selectedDistrict = ref(null);
const regionList = ref([]); // 지역 리스트
const districtList = ref([]); // 구 리스트

const handleRowClick = (franchise) => {
  if (!franchise?.franchiseId) {
    alert('franchiseId 없음!');
    return;
  }
  router.push(`/headquarters/franchise-menu-list/${franchise.franchiseId}`);
};

const fetchFranchise = async (page) => {
  try {
    const response = await apiClient.get(`/franchise?page=${page.value - 1}&size=10`);
    item.value = response.data.franchises;
    totalCount.value = response.data.totalElements;
  } catch (error) {
    console.error('Error fetching franchise:', error);
  }
};

onMounted(() => {
  fetchFranchise(page);
});
</script>

<style scoped>
.Tdiv {
  background-color: #f5f5f5;
}
#div0 {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}
#div1 {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}
.select-region {
  width: 200px;
}
.select-district {
  width: 150px;
}
.search-input {
  margin-left: 750px;
  height: 48px;
  background-color: white;
}
.theadColor thead {
  background-color: #D8DBBD;
}
.custom-rounded-table {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}
</style>