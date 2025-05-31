<template>
  <div class="pa-6">
    <h3 class="mb-4 text-h5 font-weight-bold">📋 메뉴 등록</h3>

    <v-form ref="formRef" @submit.prevent="submitMenu">
      <v-row>
        <!-- 왼쪽 입력 -->
        <v-col cols="12" md="8">
          <v-text-field v-model="menu.name" label="메뉴 이름" required />
          <v-text-field v-model="menu.price" label="가격" type="number" required />
          <v-text-field v-model="menu.description" label="설명" />
          <v-row>
            <v-col cols="12" md="6">
              <v-select v-model="menu.status" :items="['ACTIVE', 'INACTIVE']" label="상태" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="selectedCategories" :items="allCategories" label="카테고리" item-title="categoryName"
                item-value="id" multiple chips return-object />
            </v-col>
          </v-row>
        </v-col>

        <!-- 오른쪽 이미지 -->
        <v-col cols="12" md="4">
          <input type="file" ref="fileInput" accept="image/*" class="d-none" @change="onFileChange" />
          <div class="upload-box" @click="triggerFileInput">
            <v-img v-if="menu.image" :src="menu.image" aspect-ratio="1" cover class="rounded" />
            <div class="upload-label">
              <v-icon size="32" class="mb-1">mdi-camera</v-icon>
              <div class="text-caption">이미지</div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- 재료 검색 및 테이블 -->
      <div class="mt-4">
        <p><strong>재료 선택 및 수량 입력</strong></p>

        <!-- ✅ 검색창 -->
        <v-text-field
          v-model="search"
          label="재료명 검색"
          append-inner-icon="mdi-magnify"
          class="mb-2"
        />

        <v-data-table :headers="headers" :items="currentIngredients" item-key="ingredientId" class="elevation-1"
          density="compact" :items-per-page="itemsPerPage" hide-default-footer>
          <template v-slot:item.quantity="{ item }">
            {{ item.quantity }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="primary" icon="mdi-pencil" size="small" @click="openEditDialog(item)" />
          </template>
        </v-data-table>

        <v-pagination v-model="page" :length="totalPages" class="mt-2" />
      </div>

      <!-- 버튼 -->
      <div class="d-flex justify-end mt-4" style="gap: 8px;">
        <v-btn color="primary" type="submit">등록</v-btn>
        <v-btn color="secondary" @click="goBack">취소</v-btn>
      </div>
    </v-form>

    <!-- 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card title="재료 수량 입력">
        <v-card-text>
          <v-text-field v-model="editingItem.quantity" label="수량" type="number" :suffix="`단위: ${editingItem.unit}`" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">취소</v-btn>
          <v-btn color="primary" @click="saveQuantity">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'

const router = useRouter()
const formRef = ref(null)

const menu = ref({
  name: '',
  price: 0,
  description: '',
  status: 'ACTIVE',
  image: '',
  menuDetails: []
})

const page = ref(1)
const itemsPerPage = 10
const search = ref('') // ✅ 검색어

const selectedCategories = ref([])
const allCategories = ref([])
const ingredientInputs = ref([])

const imageFile = ref(null)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data: imageUrl } = await apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    menu.value.image = imageUrl
  } catch (e) {
    alert('이미지 업로드 실패')
    console.error(e)
  }
}

const headers = [
  { title: '재료명', key: 'ingredientName' },
  { title: '수량', key: 'quantity' },
  { title: '단위', key: 'unit' },
  { title: '', key: 'actions', sortable: false }
]

const dialog = ref(false)
const editingItem = ref({})

const openEditDialog = (item) => {
  editingItem.value = { ...item }
  dialog.value = true
}

const saveQuantity = () => {
  const index = ingredientInputs.value.findIndex(
    (i) => i.ingredientId === editingItem.value.ingredientId
  )
  if (index !== -1) {
    ingredientInputs.value[index].quantity = editingItem.value.quantity
  }
  dialog.value = false
}

const filteredIngredients = computed(() =>
  ingredientInputs.value.filter(item =>
    item.ingredientName.toLowerCase().includes(search.value.toLowerCase())
  )
)

const currentIngredients = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredIngredients.value.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(filteredIngredients.value.length / itemsPerPage)
)

onMounted(async () => {
  const categoryRes = await apiClient.get('/categories')
  allCategories.value = categoryRes.data

  const ingredientRes = await apiClient.get('/ingredients')
  ingredientInputs.value = ingredientRes.data.map(ing => ({
    ingredientId: ing.ingredientId,
    ingredientName: ing.ingredientName,
    unit: ing.unit,
    quantity: 0
  }))
})

const submitMenu = async () => {
  try {
    await apiClient.post(`/headquarters/menus`, {
      name: menu.value.name,
      price: menu.value.price,
      description: menu.value.description,
      status: menu.value.status,
      image: menu.value.image,
      categoryIds: selectedCategories.value.map(cat => cat.id),
      menuDetails: ingredientInputs.value
        .filter(item => item.quantity > 0)
        .map(item => ({
          ingredientId: item.ingredientId,
          quantity: item.quantity
        }))
    })

    alert('메뉴가 등록되었습니다.')
    router.push({ name: 'menu-list' })
  } catch (e) {
    const message = e.response?.data?.message || '메뉴 등록에 실패했습니다.'
    alert(message)
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.upload-placeholder {
  height: 250px;
  background-color: #f0f0f0;
  border: 1px dashed #bbb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #888;
}

.upload-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background-color: #f5f5f5;
  border: 1px dashed #bbb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.upload-label {
  position: absolute;
  z-index: 2;
  text-align: center;
  color: #666;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 8px 12px;
  border-radius: 6px;
}
</style>