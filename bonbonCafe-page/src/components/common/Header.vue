<template>

    <v-app-bar flat class="transparent-app-bar" > 

      <!-- <v-btn icon="mdi-table-chair" variant="text" color="black" /> -->

      <!-- <v-toolbar-title color="black"black>BonBon-Cafe</v-toolbar-title> -->

      <template v-if="$vuetify.display.mdAndUp">
        <v-spacer />

        <v-btn icon="mdi-magnify" variant="text" />
        <v-btn icon="mdi-filter" variant="text" />

        <v-btn color="black" variant="text" @click="logout">Logout</v-btn>
      </template>
      
      <v-btn
        icon
        class="ma-2"
        size="48"
        variant="text"
      >
        <v-avatar size="36">
          <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="User" />
        </v-avatar>
      </v-btn>
      <v-btn icon="mdi-dots-vertical" variant="text" />
    </v-app-bar>

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


</style>