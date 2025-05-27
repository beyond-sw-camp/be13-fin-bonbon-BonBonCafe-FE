<template>
    <div class=" Tdiv ">
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
        <div>
            <Table :header="header" :item="item"/>
        </div>
    </div>

</template>



<script setup>

    import apiClient from '@/api';
    import { ref, onMounted } from 'vue'
    import Table from '@/components/franchise/Table.vue'
    import SelectBox from '@/components/franchise/Select.vue'
    
    const item = ref([])
    const page = ref(1)
    const totalCount = ref(1)    

    const selectedRegion = ref(null);
    const selectedDistrict = ref(null);


    // const header = [
    //     { title: 'No.', align: 'start', key: 'franchiseId', class: 'header'},
    //     { title: '가맹점 이름', align: 'start', key: 'name', class: 'header' },
    //     { title: '가맹점 주소', align: 'start', key: 'roadAddress', class: 'header' },
    //     { title: '담당자', align: 'start', key: 'managerName', class: 'header' },
    //     { title: '가맹점 연락처', align: 'start', key: 'franchiseTel', class: 'header' },
    //     { title: '등록일', align: 'start', key: 'openDate', class: 'header' }
    // ]

    const fetchFrancise = async(page)=>{
        try {
            const response = await apiClient.get(`/franchise?page=${page.value-1}&size=10`);
            item.value = response.data.franchises;
            totalCount.value = response.data.totalElements
            console.log(response.data.franchises);
            
            console.log(item.value);
            
        } catch (error) {
            console.error("Error fetching boards:", error);
        }
    }

    
    // 컴포넌트가 mount 될 때 실행
    onMounted(() => {
        fetchFrancise(page)
    })




</script>

<style scoped>
    .Tdiv{
        background-color: #f5f5f5;
        margin: 16px 64px 64px;
        padding: 70px;

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
        /* margin-left: 750px; */
        height: 48px; 
        background-color: white;
    }
</style>