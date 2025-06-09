<template>
     <v-container class="pa-0 ma-0">
        <v-text-field
            v-model="search"
            label="가맹점 이름 검색"
            append-inner-icon="mdi-magnify"
            @click:append-inner="handleSearch"
            @keydown.enter="handleSearch"
            density="compact"
            variant="outlined"
            rounded="xl"
            class="mt-4 mb-4"
        />

        <h3>{{ selectedStore.name }}</h3>


        <h4 class="pa-2 mt-2">매장 정보</h4>
        <v-card class="pa-2 mt-1 " >
            <v-table class="pa-2" style="text-align: start;">
                <tr>
                    <td>연락처</td>
                    <td>{{ data.franchiseTel }}</td>
                </tr>
                <tr>
                    <td>담당자</td>
                    <td>{{data.managerName || '담당자 미지정'}}</td>
                </tr>
                <tr>
                    <td>담당자 연락처</td>
                    <td>{{data.managerTel || '담당자 미지정'}}</td>
                </tr>
            </v-table>
        </v-card>


        <h4 class="pa-2 mt-2">매출</h4>
            <sales-forecast-form  :store-id="selectedStore.franchiseId" />

        <h4 class="pa-2 mt-2">메뉴 순위</h4>
            <MenuRanking :franchiseId="selectedStore.franchiseId || null" />
        
        
        
    </v-container>
</template>

<script setup>
import SalesForecastForm from '@/components/forms/salesform/SalesForecastForm.vue'
import MenuRanking from '@/components/franchise/MenuRanking.vue'
// import { onMounted, ref } from 'vue';
import { watch, ref, onMounted } from 'vue';
import apiClient from '@/api' ;

const emit = defineEmits(['focus-marker']);

const search = ref('');
const data = ref({});

const props = defineProps({
        selectedStore:{
            type: Object,
            required: true
        }
});


const fetchFranciseInfo = async (store) => {
  try {
    console.log(store);
    
    const response = await apiClient.get(`/franchise/summary/${store.franchiseId}`);

    return data.value = response.data;
    
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data.status === 'MANAGER_NOT_FOUND') {
      console.warn('담당 매니저 없음: 기본값 반환');
      
    }
  }
};


watch(
  () => props.selectedStore, async (newStore) => {
    console.log(newStore);
    
    if (newStore && newStore.franchiseId) {
      const franchiseData = await fetchFranciseInfo(newStore);
      Object.assign(data.value, franchiseData); // 내부 데이터 갱신
    }
  },
  { immediate: true } // 컴포넌트 마운트 시에도 실행되게 함
);


const handleSearch = async () => {
  if (!search.value.trim()) return;

  try {
    const response = await apiClient.get('/franchise/locations', {
        params: {
            keyword: search.value.trim()
        }
    });

    console.log(response);
    
    const allStores = response.data;
    const foundStore = allStores.find((store) =>
      store.name.trim().includes(search.value.trim())
    );
    if (foundStore) {
      emit('focus-marker', foundStore.franchiseId);
    } else {
      alert('해당 가맹점을 찾을 수 없습니다.');
    }
  } catch (err) {
    console.error('검색 실패:', err);
  }
};

</script>

<style scoped>

</style>

