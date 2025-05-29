<template>
    <v-container class="py-4" fluid>
  
      <v-row dense>
        <!-- 수정 카드 -->
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2" style="width: 100%; height: 760px;">

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
                v-if="editedInfo.userImage"
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


  
            <v-form @submit.prevent="submitEdit">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field v-model="editedInfo.email" label="이메일" readOnly @input="isDirty = true"/>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedInfo.name" label="가맹점주 이름" @input="isDirty = true"/>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedInfo.phone" label="전화번호" @input="isDirty = true"/>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedInfo.franchiseName" label="가맹점" readOnly @click="dialogVisible = true"/>
                  <v-btn
                    v-if="editedInfo.franchiseName"
                    color="error"
                    size="small"
                    @click="deleteFranchise"
                  >
                    가맹점 삭제
                  </v-btn>


                  <v-dialog v-model="dialogVisible" max-width="600px" eager>
                    <v-card>
                      <v-card-title class="text-h6">가맹점 선택</v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="dialogSearch"
                          prepend-inner-icon="mdi-magnify"
                          placeholder="가맹점명으로 검색"
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
                          @click:row="(event, item) => selectFranchise(item)"
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
                              :total-visible="4"
                              @input="onDialogPageChange"
                            />
                          </v-col>
                        </v-row>

                        <!-- 페이지 사이즈 선택 -->
                        <v-select
                          v-model="dialogPageSize"
                          :items="[5, 10, 20]"
                          label="Rows per page"
                          density="compact"
                          variant="outlined"
                          class="mt-2"
                          hide-details
                          @update:model-value="onDialogPageSizeChange"
                        />
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
                  <v-icon :color="item.raw.color" size="12" class="mr-6">mdi-circle</v-icon>
                  <span>{{ item.raw.text }}</span>
                </template>
              </v-select>

              <v-divider></v-divider>

                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    color="grey"
                    class="mr-2"
                    @click="handleGoBack"
                  >
                    돌아가기
                  </v-btn>
                  <v-btn color="primary" type="submit">수정하기</v-btn>
                </v-col>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
  
        <!-- 지도 -->
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2" style="width: 100%; height: 530px;">
            <div class="text-subtitle-2 font-weight-bold mb-2">가맹점 위치 확인</div>
            <KakaoMap class="kakao-map" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    
  </template>
  
  <script setup>
  import KakaoMap from '@/components/map/KakaoMap.vue';
  import { ref, onMounted, watch, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiClient from '@/api';
  
  const route = useRoute();
  const router = useRouter();
  const userId = route.params.userId;

  // 수정중인지 판단 -> 입력 값 변경 시 true로 변경됨
  const isDirty = ref(false);
  const deletedImageFilename = ref(null);
  
  const franchiseeInfo = ref({});
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

  const franchiseList = ref([]); 

  // watch(editedInfo, () => {
  //   isDirty.value = true;
  // }, { deep: true });

  // 컴포넌트 마운트 시 -> API 호출, 사용자 정보 조회
  onMounted(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      // 해당 id의 사용자 정보 가져오기
      const response = await apiClient.get(`/bonbon/user/franchisee/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      franchiseeInfo.value = response.data;
      editedInfo.value = { ...response.data };
  
      const mapEl = document.querySelector('.kakao-map');
      if (mapEl && mapEl.parentElement) {
        mapEl.style.height = `${mapEl.parentElement.clientHeight}px`;
        mapEl.style.width = '100%';
      }

    } catch (error) {
      console.error('정보 불러오기 실패:', error);
    }
  });

  // 이미지 삭제 로직
  const deleteImage = async () => {
    
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


  // 최종 수정 요청
  const submitEdit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      // 프로필 파일이 있을 경우 업로드
      if (profileFile.value) {
        const formData = new FormData();
        formData.append('file', profileFile.value);
        console.log(formData);
  
        const uploadRes = await apiClient.post(`/files/upload`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        editedInfo.value.userImage = uploadRes.data;

      }

      // 만약 이미지 삭제만인 경우
      if (deletedImageFilename.value) {
        await apiClient.post('/files/delete', null, {
          params: { filename: deletedImageFilename.value },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
  
      console.log(editedInfo.value);
      console.log("editedInfo : ", editedInfo.value);
      console.log("franchiseeInfo : ", franchiseeInfo.value);
      console.log("franchiseeInfo.franchiseeId : ", franchiseeInfo.value.franchiseeId);

      // 최종 정보 수정
      await apiClient.post(
        `/bonbon/user/franchisee-accounts/${franchiseeInfo.value.franchiseeId}`,
        editedInfo.value,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      alert('가맹점주 정보가 성공적으로 수정되었습니다.');
      router.push(`/franchisee-accounts/${userId}`);
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleGoBack = () => {
    if (isDirty.value) {
      alert('이전에 변경한 내용은 저장되지 않습니다.');
    }
    router.back();
  };

  const dialogHeaders = [
    { text: '가맹점명', align: 'center',value: 'name' },
    { text: '전화번호', align: 'center', value: 'franchiseTel' },
    { text: '도로명주소', align: 'center', value: 'roadAddress' },
  ];

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

    // 가맹점주가 지정되지 않은 가맹점 목록 출력
    const res = await apiClient.get(`/bonbon/user/franchisee/without-owner`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        page: page - 1,
        size,
        keyword: search
      }
    });

    dialogItems.value = res.data.content;
    console.log('dialogItems:', dialogItems.value);
    dialogTotalItems.value = res.data.totalElements;
    dialogTotalPages.value = res.data.totalPages;
  } catch (error) {
    console.error('가맹점 목록 조회 실패:', error);
  }
};

// 가맹점 선택 시 -> 수정 대상 정보 반영
const selectFranchise = (item) => {

  console.log("item: ", item.item.name);

  editedInfo.value.franchiseName = item.item.name;
  editedInfo.value.franchiseId = item.item.franchiseId;
  console.log("selected Franchise : ", editedInfo.value);
  isDirty.value = true;
  dialogVisible.value = false;

  alert(`"${item.item.name}" 가맹점을 선택했습니다.`);
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
  