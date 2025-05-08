<template>
    <div>
        <div id="searchBar">
            <div id="seachSel">
                <v-select
                density="compact"
                placeholder="지역"
                width="100"
                variant="solo"
                />
                <v-select
                density="compact"
                placeholder="구"
                width="100"
                variant="solo"
                />
            </div>
            <div>
                <v-text-field
                    density="compact"
                    placeholder="Search here"
                    prepend-inner-icon="mdi-magnify"
                    variant="solo"
                    width="200"
                    flat
                    single-line
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
    
    const item = ref([])
    const page = ref(1)
    const totalCount = ref(1)    


    const header = [
        { title: 'No.', align: 'start', key: 'franchiseId', class: 'header'},
        { title: '가맹점 이름', align: 'start', key: 'name', class: 'header' },
        { title: '가맹점 주소', align: 'start', key: 'roadAddress', class: 'header' },
        { title: '담당자', align: 'start', key: 'regionCode', class: 'header' },
        { title: '등록일', align: 'start', key: 'openDate', class: 'header' }
    ]

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
#searchBar{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
#seachSel{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>