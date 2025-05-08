<template>
    <div>
        <h3>{{ menu.name }}</h3>

        <v-img :src="menu.image" height="200" class="mb-4" cover />

        <v-card>
            <v-card-text>
                <p><strong>가격:</strong> {{ menu.price }}원</p>
                <p><strong>설명:</strong> {{ menu.description }}</p>
                <p><strong>상태:</strong> {{ menu.status }}</p>

                <div v-if="menu.categories?.length">
                    <p><strong>카테고리:</strong></p>
                    <div class="category-chip-container">
                        <v-chip v-for="cat in menu.categories" :key="cat.id" class="ma-1" color="indigo"
                            text-color="white" label small>
                            {{ cat.categoryName }}
                        </v-chip>
                    </div>
                </div>

                <div v-if="menu.menuDetails?.length">
                    <p><strong>재료:</strong></p>
                    <ul class="ingredient-list">
                        <li v-for="detail in menu.menuDetails" :key="detail.ingredientName">
                            {{ detail.ingredientName }} - {{ detail.quantity }}g
                        </li>
                    </ul>
                </div>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn color="primary" @click="goToEdit">수정</v-btn>
                <v-btn color="error" @click="deleteMenu">삭제</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()
const menu = ref({})

const headquarterId = route.params.headquarterId
const menuId = route.params.menuId

const goToEdit = () => {
    router.push(`/headquarters/${headquarterId}/menus/${menuId}/edit`)
}

const deleteMenu = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
        await apiClient.delete(`/headquarters/${headquarterId}/menus/${menuId}`)
        alert('삭제되었습니다.')
        router.push({ name: 'menu-list', params: { headquarterId } })
    }
}

onMounted(async () => {
    const { data } = await apiClient.get(`/headquarters/${headquarterId}/menus/${menuId}`)
    menu.value = data
})
</script>

<style scoped>
h3 {
  margin-bottom: 16px;
}

.category-chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

ul.ingredient-list {
  padding-left: 1.2rem;
  margin-top: 8px;
  border-left: 3px solid #ccc;
}

.ingredient-list li {
  margin-bottom: 6px;
  padding-left: 4px;
  list-style: '🌿 ';
}
</style>