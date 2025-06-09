<template>
    <v-container class="py-4 hei" fluid>
      <v-row dense>
        <!-- 등록 카드 -->
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2" style="width: 100%; height: 870px;">

            <v-typography class="list"  align="center">
            계정 관리 / 
            </v-typography>
            <v-typography class="title"  align="center">
            가맹점주 수정
            </v-typography>
            
            <br>
            <br>

            <div class="d-flex justify-center mb-4">
              <v-avatar size="120">
                <v-img :src="previewImage || defaultImage" cover />
              </v-avatar>
            </div>
  
            <div class="d-flex justify-center align-center mb-6">
              <v-btn color="grey" size="small" class="mr-1" outlined @click="$refs.fileInput.click()">
                이미지 업로드
              </v-btn>
              <v-btn
                color="error"
                size="small"
                @click="deleteImage"
              >
                이미지 삭제
              </v-btn>
              <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="onFileChange($event.target.files)" />
            </div>
            
  
            <v-form @submit.prevent="submitRegister">
              <v-row dense>
                <v-col cols="8">
                <v-text-field 
                    v-model="editedInfo.email" 
                    label="이메일" 
                    :error="isEmailDuplicated"
                    :error-messages="isEmailDuplicated ? emailCheckMessage : ''"
                    :hint="!isEmailDuplicated && emailCheckMessage ? emailCheckMessage : ''"
                    persistent-hint
                />
                </v-col>
                <v-col cols="4" class="d-flex align-center">
                    <v-btn color="primary" @click="checkEmailDuplication">이메일 중복 확인</v-btn>
                </v-col>

                <!-- 비밀번호 필드 -->
                <v-col cols="12">
                    <v-text-field
                    v-model="editedInfo.password"
                    label="비밀번호"
                    type="password"
                    autocomplete="new-password"
                    />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedInfo.name" label="가맹점주 이름" />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedInfo.franchiseTel" label="전화번호" />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedInfo.franchiseName" label="가맹점" readonly/>
                  <v-btn
                    v-if="editedInfo.franchiseName"
                    color="error"
                    size="small"
                    @click="deleteFranchise"
                  >
                    가맹점 삭제
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="editedInfo.status"
                    label="계정 상태"
                    :items="statusOptions"
                    item-title="text"
                    item-value="value"
                  >
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-icon :color="item.raw.color" size="12">mdi-circle</v-icon>
                        </template>
                      </v-list-item>
                    </template>
                    <template #selection="{ item }">
                      <v-icon :color="item.raw.color" size="12" class="mr-4">mdi-circle</v-icon>
                      <span>{{ item.raw.text }}</span>
                    </template>
                  </v-select>
                </v-col>
                <v-divider></v-divider>
                <br>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="grey" class="mr-2" @click="cancelEdit">취소</v-btn>
                  <v-btn color="primary" type="submit">등록하기</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2" style="width: 100%; height: 870px;">
            <v-typography class="list"  align="center">
            등록 가능 가맹점 목록
            </v-typography>
            <v-card-text>
            <!-- 검색창 -->
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                placeholder="가맹점명으로 검색"
                clearable
                density="compact"
                variant="outlined"
            />

            <!-- 목록 -->
            <v-data-table-server
                :headers="headers"
                :items="items"
                :items-length="totalItems"
                :items-per-page="pageSize"
                :page="currentPage"
                @click:row="(event, item) => selectFranchise(item)"
                @update:options="onOptionsChange"
                class="elevation-1"
                hide-default-footer
            />

            <!-- 페이지네이션 -->
            <v-row class="mt-4" align="center" justify="center">
                <v-col cols="auto" class="text-center">
                <v-pagination
                    v-model="currentPage"
                    :length="totalPages"
                    :total-visible="3"
                    @input="onPageChange"
                />
                </v-col>
            </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, watch, nextTick, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import apiClient from '@/api';
  
  const router = useRouter();
  const defaultImage = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg';
  
  const editedInfo = ref({});
  const profileFile = ref(null);
  const previewImage = ref(null);
  
  const statusOptions = [
    { text: 'ACTIVE', value: 'ACTIVE', color: 'green' },
    { text: 'INACTIVE', value: 'INACTIVE', color: 'red' },
    { text: 'PENDING', value: 'PENDING', color: 'orange' },
    { text: 'EXPIRED', value: 'EXPIRED', color: 'blue' },
    { text: 'DELETED', value: 'DELETED', color: 'grey' }
  ];

  const emailCheckMessage = ref('');
  const isEmailDuplicated = ref(false);
  
  // 이미지 업로드
  const onFileChange = (files) => {
    if (!files || files.length === 0) return;
    const selectedFile = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
    profileFile.value = selectedFile;
  };
  
  // 등록 제출
  const submitRegister = async () => {

    console.log(emailCheckMessage);
    console.log(isEmailDuplicated);

    if (!emailCheckMessage.value || isEmailDuplicated.value) {
        alert('이메일 중복 확인은 필수입니다.');
        return;
    } else if (!editedInfo.value.password) {
        alert('비밀번호 입력은 필수입니다.');
        return;
    } else if (!editedInfo.value.name) {
        alert('가맹점주 이름 입력은 필수입니다.');
        return;
    } else if (!editedInfo.value.franchiseTel) {
        alert('가맹점주 전화번호 입력은 필수입니다.');
        return;
    } 


    try {
      const accessToken = localStorage.getItem('accessToken');
  
      // 이미지 업로드
      if (profileFile.value) {
        const formData = new FormData();
        formData.append('file', profileFile.value);
  
        const uploadRes = await apiClient.post('/files/upload', formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        });
  
        editedInfo.value.userImage = uploadRes.data;
      }
  
      // 등록 요청
      await apiClient.post('/bonbon/user/franchisee', editedInfo.value, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      alert('가맹점주가 등록되었습니다.');
      router.push('/franchisee-accounts');
    } catch (error) {
      console.error('등록 실패:', error);
      alert('등록 중 오류가 발생했습니다.');
    }
  };
  
  // --- 이하 가맹점 선택용 dialog (기존 Dialog 코드 재사용) ---
  const headers = ref([
    { title: '가맹점명', key: 'name', align: 'center' },
    { title: '전화번호', key: 'franchiseTel', align: 'center' },
    { title: '도로명주소', key: 'roadAddress', align: 'center' }
  ]);

  
  const visible = ref(false);
  const items = ref([]);
  const search = ref('');
  const currentPage = ref(1);
  const pageSize = ref(11);
  const totalItems = ref(0);
  const totalPages = ref(0);
  
  const fetchFranchiseList = async (page, size, search = '') => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await apiClient.get('/bonbon/user/franchisee/without-owner', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          page: page - 1,
          size,
          keyword: search
        }
      });
  
      items.value = res.data.content;
      totalItems.value = res.data.totalElements;
      totalPages.value = res.data.totalPages;
      console.log(items);
    } catch (error) {
      console.error('가맹점 목록 조회 실패:', error);
    }
  };

  // 초기 로딩  
  onMounted(() => {
    fetchFranchiseList(currentPage.value, pageSize.value, search.value);
  });
  
  const selectFranchise = (item) => {
    editedInfo.value.franchiseName = item.item.name;
    editedInfo.value.franchiseId = item.item.franchiseId;
    visible.value = false;
    alert(`"${item.item.name}" 가맹점을 선택했습니다.`);
  };
  
  watch(visible, async (visible) => {
    if (visible) {
      await nextTick();
      fetchFranchiseList(currentPage.value, pageSize.value, search.value);
    }
  });
  
  watch(search, () => {
    currentPage.value = 1;
    fetchFranchiseList(1, pageSize.value, search.value);
  });
  
  const onPageChange = (page) => {
    currentPage.value = page;
    fetchFranchiseList(page, pageSize.value, search.value);
  };
  
  const onPageSizeChange = (size) => {
    pageSize.value = size;
    currentPage.value = 1;
    fetchFranchiseList(1, size, search.value);
    };

  const onOptionsChange = (options) => {
    currentPage.value = options.page;
    pageSize.value = options.itemsPerPage;
    fetchFranchiseList(options.page, options.itemsPerPage, search.value);
  };

  const checkEmailDuplication = async () => {
    if (!editedInfo.value.email) {
        alert('이메일을 입력해주세요.');
        return;
    }

    try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await apiClient.get('/bonbon/user/email-check', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            email: editedInfo.value.email
        }
        });

        console.log(res);

        if (res.data) {
            isEmailDuplicated.value = true;
            emailCheckMessage.value = '이미 등록된 이메일입니다.';
        } else {
            isEmailDuplicated.value = false;
            emailCheckMessage.value = '사용 가능한 이메일입니다.';
        }

        console.log(isEmailDuplicated);
        console.log(emailCheckMessage);

    } catch (error) {
        console.error('이메일 중복 확인 오류:', error);
        alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
    };

    const deleteImage = () => {
    editedInfo.value.userImage = null;
    previewImage.value = null;
    profileFile.value = null;
    };


    const cancelEdit = () => {
        const info = editedInfo.value;

        // 조금이라도 입력된 필드가 있는 경우
        const isTouched =
            info.email ||
            info.password ||
            info.name ||
            info.franchiseTel ||
            info.franchiseId ||
            profileFile.value;

        if (isTouched) {
            const confirmLeave = confirm('작업한 내용을 모두 잃을 수 있습니다.');
            if (!confirmLeave) return;
        }

        router.back();
    };

  const deleteFranchise = () => {
    if (!editedInfo.value.franchiseId) return;

    const confirmed = confirm('현재 등록된 가맹점을 삭제하시겠습니까?');
    if (!confirmed) return;

    editedInfo.value.franchiseId = null;
    editedInfo.value.franchiseName = '';
    isDirty.value = true;

    alert('가맹점이 삭제되었습니다.');
  };


  </script>
  
  <style scoped>
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #3f51b5;
  }

  .list {
    font-size: 16px;
    font-weight: 600;
    color: gray;
  }
  .hei {
  min-height: 900px;
}
/* 헤더 가운데 정렬 */
::v-deep(.v-data-table .v-data-table-header__content) {
   font-size: 14px;
   font-weight: 500;
   justify-content: center;
   text-align: center;
}

 </style>  