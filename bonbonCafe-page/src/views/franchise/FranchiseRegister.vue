<template>
  <div class="ma-15 mt-4 pa-10">
    <h2>가맹점 등록</h2>
    
    <div>
      <FranchiseForm />
    </div>
    <div class="btnBox">
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
    </div>
  </div>    
    


</template>

<script setup>
import FranchiseForm from '@/components/franchise/FranchiseForm.vue';

</script>

<style scoped>
.btnBox{
  display: flex;
}
</style>

