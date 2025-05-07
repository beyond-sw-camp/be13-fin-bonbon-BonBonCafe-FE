<template>
    <v-data-table-virtual
        :headers="headers"
        :items="franchiseList"
        height="400"
        item-value="name"
        fixed-header
    ></v-data-table-virtual>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router';
    

    const franchiseList = ref([])

    const headers = [
        { title: 'No.', align: 'start', key: 'id' },
        { title: '가맹점 이름', align: 'start', key: 'name' },
        { title: '가맹점 주소', align: 'start', key: 'address' },
        { title: '담당자', align: 'start', key: 'managerName' },
        { title: '등록일', align: 'start', key: 'createdDate' },
    ]


</script>

<style lang="scss" scoped>

</style>