<template>
    <v-card class=" franchise-card ">
        <v-row class="mb-6 align-center" dense>
        <!-- 지역 선택 -->
        <v-col cols="auto" class="mr-4">
            <SelectBox
            class="select-region"
            v-model="selectedRegion"
            :placeholder="'지역 선택'"
            :items="regionList"
            />
        </v-col>

        <!-- 구 선택 -->
        <v-col cols="auto" class="mr-4">
            <SelectBox
            class="select-district"
            v-model="selectedDistrict"
            :placeholder="'구 선택'"
            :items="districtList"
            />
        </v-col>

        <!-- 검색 -->
        <v-col cols="auto" class="mr-4">
            <v-text-field
            v-model="searchKeyword"
            class="search-input"
            density="comfortable"
            variant="outlined"
            placeholder="Search here"
            append-inner-icon="mdi-magnify"
            @keydown.enter="onSearch"
            @click:append-inner="onSearch"
            style="width: 300px;"  
            />
        </v-col>

        <!-- 초기화 버튼 -->
        <v-col cols="auto" class="mr-2">
            <v-btn  color="primary" @click="resetFilters" class="search-btn" >
            <v-icon center>mdi-cached</v-icon>
            </v-btn>
        </v-col>

         <!-- ADD 버튼 (오른쪽 끝) -->
        <v-col class="ml-auto" cols="auto">
        <v-btn  color="primary" @click="goToRegister" class="search-btn">
            <v-icon start>mdi-plus</v-icon>
            등록
        </v-btn>
        </v-col>
    </v-row>


        <!-- 이하 기존 테이블/페이지네이션 등 그대로 유지 -->

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
                color="#2A3663"
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

    // 임시 더미 데이터
    const regionList = ref([
        { title: '서울특별시', value: '서울특별시' },
        { title: '부산광역시', value: '부산광역시' },
        { title: '대구광역시', value: '대구광역시' },
    ])

    const districtList = ref([
        { title: '강동구', value: '강동구' },
        { title: '광진구', value: '광진구' },
        { title: '송파구', value: '송파구' },
        { title: '종로구', value: '종로구' },
        { title: '관악구', value: '관악구' },
    ])


    // 선택된 지역/구
    const selectedRegion = ref(null);
    const selectedDistrict = ref(null);

    const searchKeyword = ref('');

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
            const params = new URLSearchParams();
            params.append('page', page - 1); // 서버는 0부터 시작
            params.append('size', size);
            if (selectedRegion.value) params.append('region', selectedRegion.value.value);
            if (selectedDistrict.value) params.append('district', selectedDistrict.value.value);
            if (searchKeyword.value) params.append('name', searchKeyword.value);

            const response = await apiClient.get(`/franchise?${params.toString()}`);

            item.value = response.data.content;
            totalItems.value = response.data.totalElements;
            totalPages.value = response.data.totalPages;
        } catch (error) {
            console.error("Error fetching franchise list:", error);
        }
    };

    const onSearch = () => {
        currentPage.value = 1;
        fetchFranchise(1, pageSize.value);
    };

    const resetFilters = () => {
        selectedRegion.value = null;
        selectedDistrict.value = null;
        searchKeyword.value = '';
        currentPage.value = 1;
        fetchFranchise(1, pageSize.value);
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


    
    onMounted(() => {
        fetchFranchise(currentPage.value, pageSize.value); 
    });

    watch([selectedRegion, selectedDistrict], () => {
        currentPage.value = 1;
        fetchFranchise(1, pageSize.value);
    });




</script>

<style scoped>
    .v-data-table {
        min-height: 400px; /* 원하는 높이로 조절 */
    }
    .franchise-card {
        margin: 40px auto;
        padding: 40px;
        max-width: 1300px;
        background-color: #fff;
        /* border-radius: 16px; */
    }

    .select-region {
        width: 200px;
    }

    .select-district {
        width: 150px;
    }

    .search-input {
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
        bottom: 46px; 
        right: 200px;  
    }
    .custom-pagination >>> .v-pagination__item.v-pagination__item--is-active {
        background-color: #caddf0 !important;
        color: white !important;
        font-weight: bold;
        border-radius: 8px;
    }
.search-btn {
  height: 48px;
  font-weight: bold;
}
</style>