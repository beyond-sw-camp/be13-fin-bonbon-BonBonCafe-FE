<template>
    <div class = "shrink-wrapper">
        
    <v-container>
        <div>
            <h2>Project BonBon1 ver.1</h2>
        </div>
        <v-row class="mainC ma-4">
            <v-col cols="6">
                <HeadQuarterSalesChart/>
            </v-col>
            <v-col cols="6">
                <HeadQuarterForecastChart/>
            </v-col>
        </v-row>
        <v-row class="mainC ma-4">
            <v-col cols="4">
                <HeadQuarterRanking/>
            </v-col>
            <v-col cols="4">
                <HeadQuarterMenuChart/>
            </v-col>
            <v-col cols="4">
                <v-card  class="tt"></v-card>
            </v-col>
        </v-row>

    </v-container>
    </div>
</template>

<script setup>
import HeadQuarterMenuChart from '@/components/charts/HeadQuarterMenuChart.vue';
import HeadQuarterSalesChart from '@/components/charts/HeadQuarterSalesChart.vue';
import HeadQuarterRanking from '@/components/charts/HeadQuarterRanking.vue';
import HeadQuarterForecastChart from '@/components/charts/HeadQuarterForecastChart.vue';

</script>



<style scoped>

/* .shrink-wrapper {
  margin-left: -150px;
  width: calc(100% + 192px);
} */

.mainC{
    display: flex;
    justify-content: space-around;

}
.tt{
    height: 500px;
    border-radius: 3%;
}

</style>