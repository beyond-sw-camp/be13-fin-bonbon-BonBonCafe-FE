<template>
    <v-data-table-virtual
        class="rounded-t-lg border-opacity-30 border-surface-variant"
        :headers="header"
        :items="item"
        height="600"
        item-value="name"
        fixed-header
    >
    </v-data-table-virtual>
</template>

<script setup>

    const props = defineProps({
        item:{
            type: Array,
        },
        header: {
            type: Array,
            required: true
        },
        loading: Boolean
    })

</script>

<style scoped>

</style>