<template>
    <v-table class=" rounded-t-xl">
        <thead class="theadColor">
            <tr>
                <th id="tt"></th>
                <th>가맹점 이름</th>
                <th>가맹점 주소</th>
                <th>담당자 </th>
                <th>가맹점 연락처</th>
                <th>상태</th>
                <th>등록일</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in item" :key="item.name" @click="goToDetail(item)" style="cursor: pointer;">
                <td>
                    <v-avatar size="32">
                        <v-img :src="item.franchiseImage"></v-img>
                    </v-avatar>
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.roadAddress }}</td>
                <td>{{ item.managerName }}</td>
                <td>{{ item.franchiseTel }}</td>
                <th>
                     <v-chip
                        variant="tonal"
                        :color="getStatusColor(item.status)"
                    >
                        {{ item.status }}
                    </v-chip>
                </th>
                <td>{{ item.openDate }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>
    import { useRouter } from 'vue-router'

    const props = defineProps({
        item:{
            type: Array,
            required: true
        },
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPERATING':
                return 'green';
            case 'CLOSED_TEMP':
                return 'primary';
            case 'CLOSED_PERM':
                return 'error';
            default:
                return 'default';
        }
    };
    const router = useRouter()

    const goToDetail = (item) => {
    router.push({
        name: 'franchise-detail',
        params: { franchiseId: item.franchiseId }
    });
    };

</script>

<style scoped>
.theadColor{
    background-color: #D8DBBD;
}
</style>