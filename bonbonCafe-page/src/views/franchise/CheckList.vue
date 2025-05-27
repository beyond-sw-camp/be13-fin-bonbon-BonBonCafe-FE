<template>
    <v-row class="mb-4" align="center" justify="space-between">
        <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="search" label="항목명 검색" clearable />
        </v-col>
        <v-col cols="12" sm="6" md="4">
            <v-select
            v-model="selectedCategory"
            :items="categoryOptions"
            label="카테고리"
            clearable
            />
        </v-col>
        <v-btn color="primary" @click="openAddDialog">
            + 체크리스트 추가
        </v-btn>
    </v-row>

    <v-data-table
  :headers="headers"
  :items="filteredChecklist"
  :search="search"
  class="elevation-1"
>
  <!-- 활성화 상태 표시 칩 -->
  <template #item.active="{ item }">
    <v-chip :color="item.active ? 'green' : 'grey'" dark>
      {{ item.active ? '활성' : '비활성' }}
    </v-chip>
  </template>

  <!-- 액션 버튼 -->
  <template #item.actions="{ item }">
    <v-btn icon @click="editItem(item)">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn icon color="error" @click="deleteItem(item)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </template>
</v-data-table>

    
    <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ isEdit ? '수정' : '추가' }} 체크리스트 항목</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="form.name" label="항목명" />
        <v-textarea v-model="form.description" label="설명" />
        <v-select v-model="form.category" :items="categoryOptions" label="카테고리" />
        <v-select v-model="form.target" :items="['가맹점', '본사', '직원']" label="적용 대상" />
        <v-switch v-model="form.active" label="활성화 여부" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">취소</v-btn>
        <v-btn color="primary" @click="saveItem">저장</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


</template>

<script setup>

import { ref, computed } from 'vue'

const search = ref('')
const selectedCategory = ref(null)
const dialog = ref(false)
const isEdit = ref(false)
const editingId = ref(null)

const categoryOptions = ['청결', '서비스', '재고관리', '안전관리']

// 체크리스트 데이터 (예시)
const checklistItems = ref([
  {
    id: 1,
    name: '주방 위생 점검',
    description: '주방 청소 및 소독 상태 확인',
    category: '청결',
    target: '가맹점',
    active: true,
  },
  {
    id: 2,
    name: '직원 서비스 교육 여부',
    description: '신입 직원 서비스 교육 완료 여부',
    category: '서비스',
    target: '직원',
    active: false,
  },
])

// 필터링된 체크리스트 목록
const filteredChecklist = computed(() => {
  return checklistItems.value.filter((item) => {
    const matchesSearch = item.name.includes(search.value)
    const matchesCategory = !selectedCategory.value || item.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// 테이블 헤더
const headers = [
  { text: '카테고리', value: 'category' },
  { text: '항목명', value: 'name' },
  { text: '설명', value: 'description' },
  { text: '적용 대상', value: 'target' },
  { text: '상태', value: 'active' },
  { text: '액션', value: 'actions', sortable: false },
]

// 폼 상태
const form = ref({
  name: '',
  description: '',
  category: '',
  target: '',
  active: true,
})

// 항목 추가 다이얼로그 열기
const openAddDialog = () => {
  isEdit.value = false
  resetForm()
  dialog.value = true
}

// 항목 수정
const editItem = (item) => {
  isEdit.value = true
  editingId.value = item.id
  form.value = { ...item }
  dialog.value = true
}

// 항목 저장 (추가 또는 수정)
const saveItem = () => {
  if (isEdit.value) {
    const index = checklistItems.value.findIndex(i => i.id === editingId.value)
    if (index !== -1) checklistItems.value[index] = { id: editingId.value, ...form.value }
  } else {
    checklistItems.value.push({
      id: Date.now(), // 임시 ID
      ...form.value,
    })
  }
  dialog.value = false
  resetForm()
}

// 항목 삭제
const deleteItem = (item) => {
  checklistItems.value = checklistItems.value.filter(i => i.id !== item.id)
}

// 폼 초기화
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    category: '',
    target: '',
    active: true,
  }
}
</script>

