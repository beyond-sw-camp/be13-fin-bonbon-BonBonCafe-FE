<template>
    <v-container>
        <FranchiseeDetailForm />
    </v-container>
</template>

<script setup>
import FranchiseeDetailForm from '@/components/forms/userform/FranchiseeDetailForm.vue';
import { reactive } from 'vue';
import apiClient from '@/api';
import { useRouter } from 'vue-router';

const router = useRouter();

import { defineProps } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

</script>

<style lang="scss" scoped>

</style>