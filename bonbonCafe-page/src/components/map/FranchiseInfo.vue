<template>
     <v-container class="pa-0 ma-0">
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


        <h4 class="pa-2 mt-2">매출 (지난 주)</h4>
            <sales-forecast-form v-if="selectedStore.franchiseId" :store-id="selectedStore.franchiseId" />
            <v-card v-else>
                <v-card-title>
                    데이터 없음
                </v-card-title>
            </v-card>

        <h4 class="pa-2 mt-2">메뉴 순위</h4>
        <v-card class="pa-1 mt-1" >
            <v-card-text>
                <br>
                <br>
                <br>
                <br>
            </v-card-text>
        </v-card>

        
        <h4 class="pa-2 mt-2">체크리스트</h4>
        <v-card class="pa-1 mt-1" >
            <!-- <h4>매장 매출</h4> -->
            <v-card-text>
                <br>
                <br>
                <br>
                <br>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import SalesForecastForm from '@/components/forms/salesform/SalesForecastForm.vue'
// import { onMounted, ref } from 'vue';
import { watch, ref, onMounted } from 'vue';
import apiClient from '@/api' ;

const data = ref({});

const props = defineProps({
        selectedStore:{
            type: Object,
            required: true
        }
});
// watch(
//     () =>{
//         return props.selectedStore;
//     }, async () => {
        
//         data.value = await fetchFranchiseInfo(props.selectedStore);
        
//         console.log(data.value);
        
//     }
// )

    // onMounted(async() => {
    //     // data.value = await fetchFranchiseInfo(props.selectedStore);
    //     const franchiseData = await fetchFranchiseInfo(props.selectedStore);
    //     Object.assign(data.value, franchiseData);

    // });
    // const fetchFranchiseInfo = async (store) => {
    //     try {
    //         const response = await apiClient.get(`/franchise/summary/${store.name}`)
    //         data.franchiseTel = response.data.franchiseTel;
    //         data.managerName = response.data.managerName;
    //         data.managerTel = response.data.managerTel;
    //         console.log( data.franchiseId);        
    //         return response.data
    //     } catch (error) {
    //         console.error('프랜차이즈 데이터 불러오기 실패:', error)
    //     }
    // }
    // selectedStore가 바뀔 때마다 fetch
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
}

// onMounted( () => {
//   fetchFranciseInfo(selectedStore);
// })

</script>

