<template>
    <v-card class=" Tdiv ">
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
                :page="currentPage"
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
                            <!-- 이미지 컬럼 처리 -->
                            <v-avatar
                                v-if="column.key === 'franchiseeImage'"
                                size="64"
                                class="my-2"
                            >
                                <v-img
                                :src="item.franchiseeImage || defaultImage"
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

                            <!-- 그 외는 일반 텍스트로 렌더링 -->
                            <span v-else>
                            {{ item[column.key] }}
                            </span>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <v-pagination
            v-model="currentPage"
            :length="totalPages"
            @update:modelValue="onPageChange"
            class="mt-4"
            />
        </div>

    </v-card>

</template>



<script setup>

    import apiClient from '@/api';
    import { ref, onMounted, computed } from 'vue'
    // import Table from '@/components/franchise/Table.vue'
    import SelectBox from '@/components/franchise/Select.vue'
    import { useRouter } from 'vue-router'

    
    // 데이터 및 상태 변수
    const item = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalCount = ref(0);
    const totalPages = computed(() => {
        return Math.ceil(totalCount.value / pageSize.value);
    });



    // 선택된 지역/구
    const selectedRegion = ref(null);
    const selectedDistrict = ref(null);

    const header = [
        { title: '', align: 'start', key: 'franchiseeImage', class: 'header'},
        { title: '가맹점 이름', align: 'start', key: 'name', class: 'header' },
        { title: '가맹점 주소', align: 'start', key: 'roadAddress', class: 'header' },
        { title: '점주 이름', align: 'start', key: 'franchiseeName', class: 'header' },
        { title: '가맹점 연락처', align: 'start', key: 'franchiseTel', class: 'header' },
        { title: '상태', align: 'center', key: 'status', class: 'header' },
        { title: '등록일', align: 'center', key: 'openDate', class: 'header' }
    ]


    const fetchFranchise = async (page, size) => {
        try {
        const response = await apiClient.get(`/franchise?page=${page - 1}&size=${size}`);
            item.value = response.data.franchises;
            totalCount.value = response.data.totalElements;
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




</script>

<style scoped>
    .Tdiv{
        background-color: #ffffff;
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
    .v-data-table-server tbody tr:hover {
    background-color: #f0f8ff; /* 연한 파란색 예시 */
    cursor: pointer; /* 마우스 커서 포인터로 변경 */
    }
    
    ::v-deep(.v-data-table__th) {
    background-color: #f2f5f8 !important;
    }

</style>