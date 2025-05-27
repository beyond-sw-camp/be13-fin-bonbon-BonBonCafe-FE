<template>
    <v-container>
        <FranchiseeEditForm />
    </v-container>
</template>

<script setup>
import { reactive } from 'vue';
import apiClient from '@/api';
import { useRouter } from 'vue-router';

const router = useRouter();

import { defineProps } from 'vue';
import FranchiseeEditForm from '@/components/forms/userform/FranchiseeEditForm.vue';

</script>

<style lang="scss" scoped>

</style>