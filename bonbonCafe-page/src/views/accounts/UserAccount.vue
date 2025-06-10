<template>
    <v-container class="tt">
        <UserInfoDetailForm />
    </v-container>
</template>

<script setup>
import UserInfoDetailForm from '@/components/forms/userform/UserInfoDetailForm.vue';

</script>

<style scoped>
.tt{
    margin: 40px auto;
    padding: 30px;
    max-width: 1300px;
    min-height: 700px;
}
</style>