<template>
        <v-data-table-virtual
        :headers="header"
        height="400"
        item-value="name"
        fixed-header
    ></v-data-table-virtual>
</template>

<script setup>

    const props = defineProps({
        // item:{
        //     type: Array,
        //     required: true
        // },
        header: {
            type: Array,
            required: true
        }
    })

</script>

<style lang="scss" scoped>

</style>