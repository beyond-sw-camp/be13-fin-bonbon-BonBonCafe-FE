<template>
    <div class="pagination-wrapper">
        <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="props.pageInfo.pageLimit"
        color="success"
        @update:modelValue="changePage"
        ></v-pagination>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

    // 부모 컴포넌트로부터 pageInfo를 받음
    const props = defineProps({
        pageInfo: {
            type: Object,
            required: true
        }
    });

    // 전체 페이지 수 = 전체 항목수 / 한 페이지당 항목 수
    const totalPages = computed(
        () => Math.ceil(props.pageInfo.totalElements / props.pageInfo.listLimit)
    );

    // 현재 페이지 (양방향 바인딩)
    const currentPage = ref(props.pageInfo.currentPage);

    // props로 currentPage가 변경될 때 local 상태도 반영
    watch(
    () => props.pageInfo.currentPage,
    (newVal) => {
        currentPage.value = newVal;
    }
    );

    // 현재 페이지 그룹 시작
    const startPage = computed(
        () => (props.pageInfo.pageLimit * Math.floor((props.pageInfo.currentPage - 1) / props.pageInfo.pageLimit)) + 1
    );

    // 현재 페이지 그룹 끝 계산
    const endPage = computed(
        () => {
            let end = startPage.value + props.pageInfo.pageLimit - 1;

            return end > totalPages.value ? totalPages.value : end;
        }
    );

    // 페이지 배열 생성
    const generateSequence = computed(
        () => {
            const sequence = [];

            for (let i = startPage.value; i <= endPage.value; i++) {
                sequence.push(i);
            }

            return sequence;
        }
    );

    // 부모 컴포넌트에 change-page 이벤트를 전달
    const emit = defineEmits(['change-page']);

    const changePage = (page) => {
        emit('change-page', { page, totalPages: totalPages.value });
    };
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
