<template>
    <v-data-table
        :headers="header"
        :items="item"
        height="600"
        item-value="name"
        fixed-header
        class="rounded-t-lg border-opacity-30 border-surface-variant"
        
    ></v-data-table>
</template>

<script setup>

    const props = defineProps({
        item:{
            type: Array,
        },
        header: {
            type: Array,
            required: true
        }
    })

</script>

<style scoped>

</style>