<template>

    <v-layout>
        <v-app-bar
        flat
        class="transparent-app-bar"
        >
        
        <v-btn icon="mdi-ribbon" variant="text" color="white"></v-btn>
        <v-toolbar-title>BonBon-Cafe</v-toolbar-title>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>

          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>

        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>


    </v-layout>

</template>

<script setup>

</script>

<style scoped>

.transparent-app-bar {
  background-color: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  z-index: 2000 !important; /* Vuetify 기준 상위 우선순위 */
  position: relative; /* z-index가 적용되려면 position 필요 */
}


.v-toolbar-title {
  color: white !important; /* 강제로 색 지정 */
}
</style>