<template>
  <v-container class="containerF">
      <v-col>
        <h2>가맹점 등록</h2>
      </v-col>
      <v-col>
        <FranchiseForm />
      </v-col>
      <v-col class="btnBox">
        <v-btn  
          rounded="xl" 
          color="#D8DBBD"
          size="small" 
          width="100px"
          class="mt-8"
        >
          등록
        </v-btn>
        <v-btn  
          rounded="xl" 
          color="#efefef"
          size="small" 
          width="100px"
          class="mt-8"
        >
          뒤로가기
        </v-btn>
      </v-col>
  </v-container>    
    


</template>

<script setup>
import FranchiseForm from '@/components/franchise/FranchiseForm.vue';

</script>

<style scoped>

.btnBox{
  display: flex;
}
</style>

