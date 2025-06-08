<template>
    <v-container class="py-4" fluid>
  
      <v-row dense>
        <!-- 수정 카드 -->
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2" style="width: 100%; height: 900px;">

            <v-typography class="list"  align="center">
            계정 관리 / 
            </v-typography>
            <v-typography class="title"  align="center">
            담당자 정보 수정
            </v-typography>
            
            <br>
            <br>

            <div class="d-flex justify-center mb-4">
              <v-avatar size="120">
                <v-img :src="previewImage || editedInfo.userImage || defaultImage" cover />
              </v-avatar>
            </div>

            <div class="d-flex justify-center align-center mb-6">
              <v-btn
                color="grey"
                size="small"
                class="mr-1"
                outlined
                @click="$refs.fileInput.click()"
              >
                이미지 업로드
              </v-btn>

              <v-btn
                v-if="editedInfo.userImage || profileFile"
                color="error"
                size="small"
                @click="deleteImage"
              >
                이미지 삭제
              </v-btn>

              <!-- 숨겨진 파일 입력 -->
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onFileChange($event.target.files)"
              />
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

                <v-col cols="12">
                    <v-text-field
                    v-model="editedInfo.password"
                    label="비밀번호"
                    type="password"
                    autocomplete="new-password"
                    />
                </v-col>

                <v-col cols="12">
                  <v-text-field v-model="editedInfo.name" label="담당자 이름" @input="isDirty = true"/>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedInfo.phone" label="전화번호" @input="isDirty = true"/>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedInfo.region" label="담당 지역구" readOnly @click="dialogVisible = true"/>
                  <v-btn
                    v-if="editedInfo.region"
                    color="error"
                    size="small"
                    @click="deleteFranchise"
                  >
                    지역구 삭제
                  </v-btn>


                  <v-dialog v-model="dialogVisible" max-width="600px" eager>
                    <v-card>
                      <v-card-title class="text-h6">지역구 선택</v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="dialogSearch"
                          prepend-inner-icon="mdi-magnify"
                          placeholder="지역명으로 검색"
                          clearable
                          density="compact"
                          variant="outlined"
                        />

                        <v-data-table-server
                          v-if="dialogVisible"
                          :headers="dialogHeaders"
                          :items="dialogItems"
                          :items-length="dialogTotalItems"
                          :items-per-page="dialogPageSize"
                          :page="dialogCurrentPage"
                          @click:row="(event, item) => selectRegion(item)"
                          @update:options="onDialogOptionsChange"
                          class="elevation-1"
                          hide-default-footer
                        />
                        <!-- 페이지네이션 -->
                        <v-row class="mt-4" align="center" justify="center">
                          <v-col cols="auto" class="text-center">
                            <v-pagination
                              v-model="dialogCurrentPage"
                              :length="dialogTotalPages"
                              :total-visible="3"
                              @input="onDialogPageChange"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn text @click="dialogVisible = false">닫기</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>


                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="editedInfo.status"
                    label="계정상태"
                    :items="statusOptions"
                    item-title="text"
                    item-value="value"
                    @input="isDirty = true"
                  >
                  <!-- 드롭다운 안의 항목 표시 -->
                  <template #item="{ item, props }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon :color="item.raw.color" size="12">mdi-circle</v-icon>
                      </template>
                    </v-list-item>
                  </template>

                    <!-- 선택된 항목 표시 -->
                <template #selection="{ item }">
                  <v-icon :color="item.raw.color" size="10" class="mr-6">mdi-circle</v-icon>
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
          <v-card class="pa-6" elevation="2" style="width: 100%; height: 800px;">
            <div class="text-subtitle-2 font-weight-bold mb-2">가맹점 위치 확인</div>
            <div>
            <v-typography class="title2"  align="center">
              {{ editedInfo.region }} 가맹점 목록
            </v-typography>
            </div>
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
                    @click:row="(event, item) => selectRegion(item)"
                    @update:options="onOptionsChange"
                    class="elevation-1"
                    hide-default-footer
                >

                <template #no-data>
                <div class="text-center py-6">
                    해당 지역구에 가맹점 데이터가 없습니다.
                </div>
                </template>
                </v-data-table-server>
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
  import { ref, watch, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiClient from '@/api';
  
  const route = useRoute();
  const router = useRouter();
  const userId = route.params.userId;

  // 수정중인지 판단 -> 입력 값 변경 시 true로 변경됨
  const isDirty = ref(false);
  const deletedImageFilename = ref(null);

  const emailCheckMessage = ref('');
  const isEmailDuplicated = ref(false);

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
  
  const visible = ref(false);
  const items = ref([]);
  const search = ref('');
  const currentPage = ref(1);
  const pageSize = ref(8);
  const totalItems = ref(0);
  const totalPages = ref(0);

  const managerInfo = ref({});
  const editedInfo = ref({});
  const profileFile = ref(null);
  const previewImage = ref(null);
  const defaultImage = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg';
  
  const statusOptions = [
    { text: 'ACTIVE', value: 'ACTIVE', color: 'green' },
    { text: 'INACTIVE', value: 'INACTIVE', color: 'red' },
    { text: 'PENDING', value: 'PENDING', color: 'orange' },
    { text: 'EXPIRED', value: 'EXPIRED', color: 'blue' },
    { text: 'DELETED', value: 'DELETED', color: 'grey' }
  ];

  // 이미지 삭제 로직
  const deleteImage = async () => {

    if (profileFile.value) {
        profileFile.value = null;
        previewImage.value = null;
        alert('업로드할 이미지 선택이 취소되었습니다.');
        return;
    }
        
    if (!editedInfo.value.userImage) return;

    try {
      const accessToken = localStorage.getItem('accessToken');

      // S3 -> 파일 이름만 추출, deletedImageFilename에 삭제할 이미지 이름만 미리 넣어두기
      const url = new URL(editedInfo.value.userImage);
      const filename = url.pathname.split('/').pop();
      deletedImageFilename.value = filename;

      editedInfo.value.userImage = null;
      previewImage.value = null;
      profileFile.value = null;

      alert('이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  
// 이미지 업로드 로직
// 이벤트 객체에서 직접 파일 추출
const onFileChange = (files) => {

  if (!files || files.length === 0) {
    console.warn('파일이 선택되지 않았습니다.');
    return;
  }

  const selectedFile = files[0];
  console.log('선택된 파일:', selectedFile);

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(selectedFile);
  profileFile.value = selectedFile;
  console.log(profileFile);
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
    } else if (!editedInfo.value.phone) {
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
    await apiClient.post('/bonbon/user/manager', editedInfo.value, {
        headers: {
        Authorization: `Bearer ${accessToken}`
        }
    });

    alert('가맹점주가 등록되었습니다.');
    router.push('/manager-accounts');
    } catch (error) {
    console.error('등록 실패:', error);
    alert('등록 중 오류가 발생했습니다.');
    }
    };

  const handleGoBack = () => {
    if (isDirty.value) {
      alert('이전에 변경한 내용은 저장되지 않습니다.');
    }
    router.back();
  };

  const dialogHeaders = [
    { text: '지역코드', align: 'center',value: 'regionCode' },
    { text: '지역명', align: 'center', value: 'regionName' },
  ];

  const headers = ref([
    { title: '가맹점명', key: 'name', align: 'center' },
    { title: '전화번호', key: 'franchiseTel', align: 'center' },
    { title: '도로명주소', key: 'roadAddress', align: 'center' }
  ]);

const dialogVisible = ref(false);
const dialogItems = ref([]);    
const dialogSearch = ref('');
const dialogCurrentPage = ref(1);
const dialogPageSize = ref(10);
const dialogTotalItems = ref(0);
const dialogTotalPages = ref(0);


// 가맹점 목록 조회 (서버에 페이지 요청)
const fetchDialogFranchiseList = async (page, size, search = '') => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    // 지역 목록 조회 
    const res = await apiClient.get(`/bonbon/user/region`, {
      params: {
        page: page - 1,
        size,
        keyword: search
      }
    });

    console.log(res);

    dialogItems.value = res.data.content;
    console.log('dialogItems:', dialogItems.value);
    dialogTotalItems.value = res.data.totalElements;
    dialogTotalPages.value = res.data.totalPages;
  } catch (error) {
    console.error('가맹점 목록 조회 실패:', error);
  }
};

// 가맹점 선택 시 -> 수정 대상 정보 반영
const selectRegion = (item) => {
  console.log("선택된 지역구:", item);

  editedInfo.value.region = item.item.regionName;
  editedInfo.value.regionCode = item.item.regionCode;

  isDirty.value = true;
  dialogVisible.value = false;

  alert(`"${item.item.regionName}" 지역구를 선택했습니다.`);

  fetchFranchiseList(1, pageSize.value, search.value);
};


// 페이지 or 검색어 변경 감지 -> dialog가 열릴 때마다 최신 데이터 불러오는 트리거
watch(dialogVisible, async (visible) => {
  if (visible) {
    await nextTick(); // DOM 완전히 그린 후
    fetchDialogFranchiseList(dialogCurrentPage.value, dialogPageSize.value, dialogSearch.value);
  }
});

// 검색어 입력 시 첫 페이지부터 다시 검색된 목록 보여줌
watch(dialogSearch, () => {
  dialogCurrentPage.value = 1;
  fetchDialogFranchiseList(1, dialogPageSize.value, dialogSearch.value);
});

// 페이지네이션에서 페이지 변경 시 필요
const onDialogPageChange = (page) => {
  dialogCurrentPage.value = page;
  fetchDialogFranchiseList(page, dialogPageSize.value, dialogSearch.value);
};

// 페이지 당 표시 개수 바꿀 때 -> 1페이지부터 다시 불러오기
const onDialogPageSizeChange = (size) => {
  dialogPageSize.value = size;
  dialogCurrentPage.value = 1;
  fetchDialogFranchiseList(1, size, dialogSearch.value);
};

// Vuetify 서버 페이지네이션 이벤트 핸들러 (옵션 객체 전체)
const onDialogOptionsChange = (options) => {
  dialogCurrentPage.value = options.page;
  dialogPageSize.value = options.itemsPerPage;
  fetchDialogFranchiseList(options.page, options.itemsPerPage, dialogSearch.value);
};


const deleteFranchise = () => {

  const confirmed = confirm('현재 등록된 담당 지역구를 삭제하시겠습니까?');
  if (!confirmed) return;

  editedInfo.value.region = null;
  editedInfo.value.regionCode = null; 
  isDirty.value = true;

  items.value = [];
  totalItems.value = 0;
  totalPages.value = 0;

  console.log("editedInfo.value : ", editedInfo.value);
  console.log("editedInfo : ", editedInfo);

  alert('지역이 삭제되었습니다.');
};


const fetchFranchiseList = async (page, size, search = '') => {
    try {
      console.log("editedInfo : ", editedInfo);
      console.log("editedInfo : ", editedInfo.value.regionCode);

      const accessToken = localStorage.getItem('accessToken');
      const res = await apiClient.get('/bonbon/user/manager/franchises', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          regionCode: editedInfo.value.regionCode,
          page: page - 1,
          size,
          keyword: search
        }
      });

      console.log(res);
  
      items.value = res.data.content;
      totalItems.value = res.data.totalElements;
      totalPages.value = res.data.totalPages;
      console.log(items);
    } catch (error) {
      console.error('가맹점 목록 조회 실패:', error);
    }
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

  const onOptionsChange = (options) => {
    currentPage.value = options.page;
    pageSize.value = options.itemsPerPage;
    fetchFranchiseList(options.page, options.itemsPerPage, search.value);
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


  </script>
  
  <style scoped>
  .kakao-map {
    height: 100% !important;
    width: 100% !important;
  }

  .v-data-table-server {
  min-height: 200px; /* 필요시 강제 높이 */
}

  .v-data-table-header th {
    color: black !important;
  }

  /* 헤더 텍스트 컬러 강제 지정 */
  .v-data-table-header th {
    color: black !important;
    white-space: nowrap;
  }

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
  </style>
  