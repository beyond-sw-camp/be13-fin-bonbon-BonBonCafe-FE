<template>
    <v-card class=" franchise-card ">
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
                <v-btn
                    variant="outlined"
                    @click="goToRegister"
                >
                    <v-icon start>mdi-plus</v-icon>
                    ADD
                </v-btn>
            </div>
        </div>
        <div>
            <!-- <Table :header="header" :item="item"/> -->

            <v-data-table
                :headers="header"
                :items="item"
                class="rounded-b rounded-t"
                :items-length="totalItems"
                :items-per-page="pageSize"
                @update:page="onPageChange"
                @update:items-per-page="onPageSizeChange"
                hide-default-footer
            >
                <!-- <template #item.status="{ item }">
                    <v-chip variant="tonal" :color="getStatusColor(item.status)">
                        {{ getStatusText(item.status) }}
                    </v-chip>
                </template> -->

                <template #item="{ item, columns }">
                    <tr @click="goToDetail(item)" style="cursor: pointer">
                        <td v-for="column in columns" :key="column.key">
                            <!-- 이미지 컬럼 렌더링 -->
                            <v-avatar
                                v-if="column.key === 'franchiseImage'"
                                size="30"
                                class="my-2"
                            >
                                <v-img
                                    :src="isValidImageUrl(item.franchiseImage) ? item.franchiseImage : defaultImage"
                                    cover
                                />
                            </v-avatar>

                            <!-- 상태 칩인 경우만 따로 처리 -->
                            <v-chip
                            v-if="column.key === 'status'"
                            variant="tonal"
                            :color="getStatusColor(item.status)"
                            >
                            {{ getStatusText(item.status) }}
                            </v-chip>

                             <!-- 일반 텍스트는 항상 출력 -->
                            <span v-if="column.key !== 'franchiseImage' && column.key !== 'status'">
                                {{ item[column.key] }}
                            </span>
                        </td>
                    </tr>
                </template>
            </v-data-table>
                <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="10"
                @update:model-value="onPageChange"
                class="mt-4  custom-pagination"
                />
                <v-select
                v-model="pageSize"
                :items="[5, 10, 20]"
                density="compact"
                variant="outlined"
                hide-details
                @update:model-value="onPageSizeChange"
                class="custom-rows-per-page"
                />
        </div>

    </v-card>

</template>



<script setup>

    import apiClient from '@/api';
    import { ref, onMounted, watch } from 'vue'
    // import Table from '@/components/franchise/Table.vue'
    import SelectBox from '@/components/franchise/Select.vue'
    import { useRouter } from 'vue-router'

    
    // 데이터 및 상태 변수
    const item = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalItems = ref(0);
    const totalPages = ref(0);
    const defaultImage = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'

const isValidImageUrl = (url) => {
  return typeof url === 'string' && url.startsWith('http');
}



    // 선택된 지역/구
    const selectedRegion = ref(null);
    const selectedDistrict = ref(null);

    const header = [
        { title: '', align: 'start', key: 'franchiseImage', class: 'header'},
        { title: '가맹점 이름', align: 'start', key: 'name', class: 'header' },
        { title: '가맹점 주소', align: 'start', key: 'roadAddress', class: 'header' },
        { title: '점주 이름', align: 'start', key: 'franchiseeName', class: 'header' },
        { title: '가맹점 연락처', align: 'start', key: 'franchiseTel', class: 'header' },
        { title: '상태', align: 'center', key: 'status', class: 'header' },
        { title: '개점 일자', align: 'center', key: 'openDate', class: 'header' }
    ]


    const fetchFranchise = async (page, size) => {
        try {
            const response = await apiClient.get(`/franchise?page=${page - 1}&size=${size}`);

            console.log(response.data.content);
            
            item.value = response.data.content;
            totalItems.value = response.data.totalElements;
            totalPages.value = response.data.totalPages;
        } catch (error) {
            console.error("Error fetching boards:", error);
        } 
    };


    const onPageChange = (page) => {
        currentPage.value = page;
        fetchFranchise(page, pageSize.value);
    };

    const onPageSizeChange = (size) => {
        pageSize.value = size;
        currentPage.value = 1;
        fetchFranchise(1, size);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPERATING':
                return 'green';
            case 'CLOSED_TEMP':
                return 'primary';
            case 'CLOSED_PERM':
                return 'error';
            default:
                return 'grey';
        }
    };

    // 한글 상태명 매핑 함수
    const getStatusText = (status) => {
        switch (status) {
            case 'OPERATING':
            return '운영중'
            case 'CLOSED_TEMP':
            return '임시 휴업'
            case 'CLOSED_PERM':
            return '폐점'
            default:
            return '알 수 없음'
        }
    }

    const router = useRouter()
    
    const goToRegister = () => {
        router.push('/franchise-register');
    };

    const goToDetail = (item) => {
      router.push(`/franchise/${item.franchiseId}`);
    };


    
    // 컴포넌트가 mount 될 때 실행
    onMounted(() => {
        fetchFranchise(currentPage.value, pageSize.value); 
    });

    // watch(currentPage, (newPage) => {
    //     fetchFranchise(newPage, pageSize.value);
    // });




</script>

<style scoped>
    /* .Tdiv{
        background-color: #ffffff;
        margin: 16px 64px 64px;
        padding: 70px;

    } */
     .v-data-table {
        min-height: 400px; /* 원하는 높이로 조절 */
    }
    .franchise-card {
        margin: 40px auto;
        padding: 40px;
        max-width: 1300px;
        background-color: #fff;
        border-radius: 16px;
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
    
    ::v-deep(.v-data-table__th) {
    background-color: #f2f5f8 !important;
    }

    ::v-deep(.v-data-table tbody tr:hover) {
        background-color: #f4faff;
        cursor: pointer;
    }

   
    .custom-rows-per-page {
    position: absolute;
    bottom: 34px;  /* 하단에서 20px 위치 */
    left: 24px;   /* 오른쪽에서 20px 위치 */
    }
    :deep(.custom-pagination .v-pagination__item.v-pagination__item--is-active) {
  background-color: #caddf0 !important;
  color: white !important;
  font-weight: bold;
  border-radius: 8px;
}

</style>