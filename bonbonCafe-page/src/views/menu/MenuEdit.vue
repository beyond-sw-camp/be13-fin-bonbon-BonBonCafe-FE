<template>
    <div>
        <h3>메뉴 수정</h3>

        <v-form ref="formRef" @submit.prevent="submitUpdate">
            <v-text-field v-model="menu.name" label="메뉴 이름" required />
            <v-text-field v-model="menu.price" label="가격" type="number" required />
            <v-text-field v-model="menu.description" label="설명" />
            <v-select v-model="menu.status" :items="['ACTIVE', 'INACTIVE']" label="상태" required />
            <v-text-field v-model="menu.image" label="이미지 URL" />

            <!-- ✅ 카테고리 선택 -->
            <v-select v-model="selectedCategories" :items="allCategories" label="카테고리" item-title="categoryName"
                item-value="id" multiple chips return-object />
                <div class="d-flex justify-end mt-4">
  <v-btn color="primary" type="submit" class="me-2">수정 완료</v-btn>
  <v-btn color="secondary" @click="goBack">취소</v-btn>
</div>
            <div class="mt-4">
                <p><strong>재료 선택 및 수량 입력</strong></p>
                <v-row>
                    <v-col v-for="(item, index) in ingredientInputs" :key="item.ingredientId" cols="12" sm="2">
                        <v-card class="pa-3" elevation="1">
                            <div class="mb-2">{{ item.ingredientName }}</div>
                            <v-text-field v-model="item.quantity" type="number" label="수량" :suffix="item.unit" dense
                                hide-details />
                        </v-card>
                    </v-col>
                </v-row>
            </div>


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
    image: '',
    menuDetails: []
})

const selectedCategories = ref([])
const allCategories = ref([])
const ingredientInputs = ref([])

onMounted(async () => {
    const { data } = await apiClient.get(`/headquarters/${headquarterId}/menus/${menuId}`)
    menu.value = {
        name: data.name,
        price: data.price,
        description: data.description,
        status: data.status,
        image: data.image,
        menuDetails: data.menuDetails
    }

    const categoryRes = await apiClient.get('/categories')
    allCategories.value = categoryRes.data
    selectedCategories.value = categoryRes.data.filter(cat =>
        data.categories.some(sel => sel.id === cat.id)
    )

    const ingredientRes = await apiClient.get('/ingredients')
    ingredientInputs.value = ingredientRes.data.map(ing => {
        const matched = data.menuDetails.find(d => d.ingredientName === ing.ingredientName)
        return {
            ingredientId: ing.ingredientId,
            ingredientName: ing.ingredientName,
            unit: ing.unit,
            quantity: matched ? matched.quantity : 0
        }
    })
})

const submitUpdate = async () => {
    await apiClient.put(`/headquarters/${headquarterId}/menus/${menuId}`, {
        name: menu.value.name,
        price: menu.value.price,
        description: menu.value.description,
        status: menu.value.status,
        image: menu.value.image,
        categoryIds: selectedCategories.value.map(cat => cat.id),
        menuDetails: ingredientInputs.value
            .filter(item => item.quantity > 0)
            .map(item => ({ ingredientId: item.ingredientId, quantity: item.quantity }))
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