<template>
        
    <v-container fluid class="pa-12">
        <v-row class="mainC ">
            <!-- 지난 가맹점 순위 -->
            <v-col cols="5 ">
                <HeadQuarterRanking/>
            </v-col>
                
            <!-- 지난 3개월 메뉴별 판매 비율 -->
            <v-col cols="7">
                <HeadQuarterMenuChart/>
            </v-col>
        </v-row>
        <v-row class="mainC">
            <!-- 지난 매출 추이 -->
            <v-col cols="6">
                <HeadQuarterSalesChart/>
            </v-col>
            <!-- 전국 가맹점 예상 매출 -->
            <v-col cols="6">
                <HeadQuarterForecastChart/>
            </v-col>
         
        </v-row>

    </v-container>
</template>

<script setup>
import HeadQuarterMenuChart from '@/components/charts/HeadQuarterMenuChart.vue';
import HeadQuarterSalesChart from '@/components/charts/HeadQuarterSalesChart.vue';
import HeadQuarterRanking from '@/components/charts/HeadQuarterRanking.vue';
import HeadQuarterForecastChart from '@/components/charts/HeadQuarterForecastChart.vue';

</script>



<style scoped>


.mainC{
    display: flex;
    justify-content: space-around;

}
.tt{
    height: 500px;
    border-radius: 3%;
}

</style>
