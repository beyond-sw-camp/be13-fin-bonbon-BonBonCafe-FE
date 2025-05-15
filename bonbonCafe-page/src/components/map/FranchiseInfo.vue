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
                    <td>{{data.managerName}}</td>
                </tr>
                <tr>
                    <td>담당자 연락처</td>
                    <td>{{data.managerTel}}</td>
                </tr>
            </v-table>
        </v-card>
        <h4 class="pa-2 mt-2">매장 매출</h4>
        <v-card class="pa-1 mt-1" >
            <v-card-text>
                <br>
                <br>
                <br>
                <br>
            </v-card-text>
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
import { onMounted, ref } from 'vue';
import apiClient from '@/api' ;

const data = ref({
    // franchiseTel: '',
    // managerName: '',
    // managerTel: '',
});

const props = defineProps({
        selectedStore:{
            type: Array,
        }
    })
// watch(
//     () =>{
//         return props.selectedStore;
//     }, async () => {
        
//         data.value = await fetchFranciseInfo(props.selectedStore);
        
//         console.log(data.value);
        
//     }
// )
    onMounted(async() => {
        // data.value = await fetchFranciseInfo(props.selectedStore);
        const franchiseData = await fetchFranciseInfo(props.selectedStore);
        Object.assign(data.value, franchiseData);

    });
    const fetchFranciseInfo = async (store) => {
        try {
            const response = await apiClient.get(`/franchise/summary/${store.name}`)
            data.franchiseTel = response.data.franchiseTel;
            data.managerName = response.data.managerName;
            data.managerTel = response.data.managerTel;
            console.log( data.franchiseId);        
            return response.data
        } catch (error) {
            console.error('프랜차이즈 데이터 불러오기 실패:', error)
        }
    }
</script>

<style scoped>

</style>