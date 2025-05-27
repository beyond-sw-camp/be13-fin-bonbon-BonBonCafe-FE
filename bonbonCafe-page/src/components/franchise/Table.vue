<template>
    <!-- <v-data-table-virtual
        class="rounded-t-lg border-opacity-30 border-surface-variant"
        :headers="header"
        :items="item"
        height="600"
        item-value="name"
        fixed-header
    >
    </v-data-table-virtual> -->

    <v-table class=" rounded-t-xl">
        <thead class="theadColor">
            <tr>
                <th id="tt">NO.</th>
                <th>가맹점 이름</th>
                <th>가맹점 주소</th>
                <th>담당자 </th>
                <th>가맹점 연락처</th>
                <th>등록일</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in item" :key="item.name">
                <td>{{ item.franchiseId }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.roadAddress }}</td>
                <td>{{ item.managerName }}</td>
                <td>{{ item.franchiseTel }}</td>
                <td>{{ item.openDate }}</td>
            </tr>
        </tbody>
    </v-table>
    <Pagination class="mt-10"/>
</template>

<script setup>
    import Pagination from '@/components/franchise/Pagination.vue'

    const props = defineProps({
        item:{
            type: Array,
        },
    })

</script>

<style scoped>
.theadColor{
    background-color: #D8DBBD;
}
</style>