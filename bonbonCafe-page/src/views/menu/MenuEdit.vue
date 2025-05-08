<template>
    <div>
        <h3>메뉴 수정</h3>

        <v-form ref="formRef" @submit.prevent="submitUpdate">
            <v-text-field v-model="menu.name" label="메뉴 이름" required />
            <v-text-field v-model="menu.price" label="가격" type="number" required />
            <v-text-field v-model="menu.description" label="설명" />

            <v-select v-model="menu.status" :items="['ACTIVE', 'INACTIVE']" label="상태" required />

            <v-text-field v-model="menu.image" label="이미지 URL" />

            <v-autocomplete v-model="selectedCategories" :items="allCategories" label="카테고리" item-title="categoryName"
                item-value="id" multiple chips />

            <v-btn color="primary" type="submit">수정 완료</v-btn>
            <v-btn color="secondary" @click="goBack">취소</v-btn>
        </v-form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()

const headquarterId = route.params.headquarterId
const menuId = route.params.menuId

const formRef = ref(null)
const menu = ref({
    name: '',
    price: 0,
    description: '',
    status: 'ACTIVE',
    image: ''
})

const selectedCategories = ref([])
const allCategories = ref([])

onMounted(async () => {
    const { data } = await apiClient.get(`/headquarters/${headquarterId}/menus/${menuId}`)
    menu.value = {
        name: data.name,
        price: data.price,
        description: data.description,
        status: data.status,
        image: data.image,
        categories: data.categories,

    }
    selectedCategories.value = data.categories.map(c => c.id)

    const res = await apiClient.get(`/headquarters/${headquarterId}/categories`)
    allCategories.value = res.data
})

const submitUpdate = async () => {
    await apiClient.put(`/headquarters/${headquarterId}/menus/${menuId}`, {
        name: menu.value.name,
        price: menu.value.price,
        description: menu.value.description,
        status: menu.value.status,
        image: menu.value.image,
        categoryIds: selectedCategories.value.map(c => typeof c === 'object' ? c.id : c) // ✅ 여기!
    })
    alert('수정되었습니다.')
    router.push({ name: 'menu-detail', params: { headquarterId, menuId } })
}

const goBack = () => {
    router.back()
}
</script>

<style scoped>
h3 {
    margin-bottom: 16px;
}
</style>