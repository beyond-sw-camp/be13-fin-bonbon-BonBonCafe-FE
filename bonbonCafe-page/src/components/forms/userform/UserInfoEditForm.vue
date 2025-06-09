<template>
<v-container class="d-flex justify-center align-center fill-height" fluid>
    <!-- 상단 타이틀 -->
    

    <!-- 두 카드 나란히 배치 -->
      <!-- 회원 정보 카드 -->
      <v-col cols="12" md="6" class="mt-0">
        <v-card class="pa-6 ma-0" elevation="2">
 
            <v-typography class="list"  align="center">
            개인정보 / 
            </v-typography>
            <v-typography class="title"  align="center">
            내 정보 조회
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

            <v-row dense>
            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">이메일</div>
              <div class="info-value">{{ editedInfo.email }}</div>
            </v-col>
            <!-- <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">비밀번호</div>
              <div class="d-flex align-center gap-2">
                <div class="info-value">************</div>
                <v-btn size="small" variant="outlined" color="primary">비밀번호 확인</v-btn>
              </div>
            </v-col> -->

            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">본사 정보</div>
              <div class="info-value">{{ editedInfo.headquarterName }}</div>
            </v-col>

            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">회원 권한</div>
              <v-chip :color="getRoleColor(editedInfo.role)" text-color="white" variant="elevated" size="small">{{ editedInfo.role }}</v-chip>
              <!-- <div class="info-value">{{ userInfo.role }}</div> -->
            </v-col>
            </v-row>


             <v-form @submit.prevent="submitEdit">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field 
                  variant="underlined"
                  v-model="editedInfo.name"
                  label="가맹점주 이름" 
                  @input="isDirty = true"/>
                </v-col>
                <v-col cols="12">
                    <v-row dense>
                        <v-col cols="3">
                        <v-select
                            v-model="phoneFirst"
                            variant="underlined"
                            :items="['010', '011', '016', '017', '018', '019', '02']"
                            label="번호"
                            dense
                            outlined
                        />
                        </v-col>
                        <!-- Dash separator -->
                        <v-col cols="1.5" class="d-flex align-center justify-center">
                          <span>-</span>
                        </v-col>
                        <v-col cols="3">
                        <v-text-field
                            v-model="phoneSecond"
                            variant="underlined"
                            label="중간번호"
                            maxlength="4"
                            counter
                            dense
                            outlined
                            @input="onlyNumber('phoneSecond')"
                        />
                        </v-col>
                        <!-- Dash separator -->
                        <v-col cols="1.5" class="d-flex align-center justify-center">
                          <span>-</span>
                        </v-col>
                        <v-col cols="3">
                        <v-text-field
                            v-model="phoneThird"
                            variant="underlined"
                            label="끝번호"
                            maxlength="4"
                            counter
                            dense
                            outlined
                            @input="onlyNumber('phoneThird')"
                        />
                        </v-col>
                    </v-row>
                    </v-col>
                  
                  
              <v-divider></v-divider>

                <v-col cols="12" class="d-flex justify-center mt-4" style="gap: 10px;">
                  <v-btn
                    color="grey"
                    class="mr-2"
                    @click="handleGoBack"
                  >
                    돌아가기
                  </v-btn>
                  <v-btn color="primary" type="submit">수정하기</v-btn>
                </v-col>
  
              </v-row>
            </v-form>

        </v-card>

      </v-col>
  </v-container>
</template>

<script setup>

import { ref, watch, nextTick, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';

const isDirty = ref(false);
const deletedImageFilename = ref(null);
  
const editedInfo = ref({});
const profileFile = ref(null);
const previewImage = ref(null);
const defaultImage = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg';
  
const router = useRouter();

const phoneFirst = ref('');
const phoneSecond = ref('');
const phoneThird = ref('');

  const onlyNumber = (field) => {
    if (field === 'phoneSecond') {
      phoneSecond.value = phoneSecond.value.replace(/[^0-9]/g, '');
    } else if (field === 'phoneThird') {
      phoneThird.value = phoneThird.value.replace(/[^0-9]/g, '');
    }
  };

  watch([phoneFirst, phoneSecond, phoneThird], ([first, second, third]) => {
    if (first && second && third) {
      editedInfo.value.phone = `${first}-${second}-${third}`;
    } else {
      editedInfo.value.phone = '';
    }
  });

onMounted(async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    // console.log('userId:', userId); // userId 확인
    console.log('accessToken:', accessToken); // 토큰 확인

    // 본인 계정 정보 조회
    const response = await apiClient.get(`/bonbon/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('API 응답:', response);
    editedInfo.value = response.data;

    if (editedInfo.value.phone) {
      const parts = editedInfo.value.phone.split('-');
      phoneFirst.value = parts[0] || '';
      phoneSecond.value = parts[1] || '';
      phoneThird.value = parts[2] || '';
    }
    console.log(editedInfo.value);

  } catch (error) {
    console.error('사용자 정보 로드 실패:', error);

    if (error.response) {
      console.error('응답 데이터:', error.response.data);
      console.error('응답 상태:', error.response.status);

    } else {
      console.error('요청 실패:', error.message);
    }
  }
});

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

      // 최종 정보 수정
      await apiClient.post(
        `/bonbon/user`,
        editedInfo.value,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      alert('가맹점주 정보가 성공적으로 수정되었습니다.');
      router.push(`user-account`);
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


const getRoleColor = (role) => {
  switch (role) {
    case 'HEADQUARTER':
      return 'blue';
    case 'FRANCHISEE':
      return 'green';
    case 'MANAGER':
      return 'orange';
    default:
      return 'grey';
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


</script>

<style lang="scss" scoped>

.info-label {
  font-size: 14px;
  color: #888;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

.gap-2 {
  gap: 8px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #3f51b5;
}

.title2 {
  font-size: 16px;
  font-weight: 500;
  color: black;
}

.list {
  font-size: 16px;
  font-weight: 600;
  color: gray;
}


</style>