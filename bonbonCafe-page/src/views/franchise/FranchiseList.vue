<template>
    <div>
        <Table :header="header"/>
    </div>
</template>

<script setup>

    // import apiClient from '@/api';
    // import { ref } from 'vue'
    import Table from '@/components/franchise/Table.vue'
    
    // const item = ref([])
    // const pageInfo = reactive({
    //     // 값을 정수로 변환하고 실패하면 1을 기본값으로 사용
    //     currentPage: parseInt(currentRoute.query.page) || 1,
    //     totalCount: 0, // 전체 데이터 수
    //     pageLimit: 5, // 페이지네이션에 보이는 페이지의 수
    //     listLimit: 0 // 한 페이지의 표시될 리스트의 수 
    // });

    const header = [
        { title: 'No.', align: 'start', key: 'id' },
        { title: '가맹점 이름', align: 'start', key: 'name' },
        { title: '가맹점 주소', align: 'start', key: 'address' },
        { title: '담당자', align: 'start', key: 'managerName' },
        { title: '등록일', align: 'start', key: 'createdDate' }
    ]

    // const fetchFrancise = async(page)=>{
    //     try {
    //         const response = await apiClient.get(`/franchise?page=${page-1}&size=10`);
    //         item.value = response.data.content;
    //         pageInfo.totalCount = response.data.totalElements
    //     } catch (error) {
    //         console.error("Error fetching boards:", error);
    //     }
    // }

    
    // // 컴포넌트가 mount 될 때 실행
    // onMounted(() => {
    //     fetchFrancise(pageInfo.currentPage)
    // })




</script>

<style lang="scss" scoped>

</style>