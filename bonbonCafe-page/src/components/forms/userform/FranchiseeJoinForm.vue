<template>

    <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-5 join-card" elevation="10" width="600">
            
            <div class="logo-container">
                <v-img
                src="https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/bonbon-logo(white-black).png"
                alt="bonbon logo"
                contain
                height="60"
                width="120"
                />
            </div>
            
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
                
                <v-col cols="7" offset-md="1">
                <v-text-field 
                    v-model="editedInfo.email" 
                    color="primary"
                    label="Email" 
                    variant="underlined"
                    :error="isEmailDuplicated"
                    :error-messages="isEmailDuplicated ? emailCheckMessage : ''"
                    :hint="!isEmailDuplicated && emailCheckMessage ? emailCheckMessage : ''"
                    persistent-hint
                />
                </v-col>

                <v-col cols="4" >
                    <v-btn color="primary" @click="checkEmailDuplication">이메일 인증</v-btn>
                </v-col>

                <!-- 인증번호 입력 필드 (이메일 중복 아니면 나타남) -->
                <v-col cols="7" offset-md="1" v-if="showVerificationField">
                  <v-text-field
                    v-model="emailVerificationCode"
                    label="Email 인증번호"
                    variant="underlined"
                    :error="emailError"
                    :error-messages= "emailError ? emailErrorMsg : ''"  
                    :hint="emailVerificationSent ? emailSuccessMsg : ''"
                    :readonly="emailVerified" 
                    persistent-hint
                    :persistent-hint="emailVerificationSent"
                  />
                </v-col>

                <v-col cols="3" v-if="showVerificationField && !emailVerified">
                  <v-btn color="primary" @click="verifyEmailCode">인증번호 확인</v-btn>
                </v-col>
                <v-col cols="3" v-if="emailVerified" >
                  <v-btn color="green" type="success" @click="verifyEmailCode" disabled>이메일 인증 완료!</v-btn>
                </v-col>

                <!-- 비밀번호 필드 -->
                <v-col cols="9" offset-md="1">
                    <v-text-field
                    v-model="editedInfo.password"
                    label="비밀번호"
                    type="password"
                    variant="underlined"
                    autocomplete="new-password"
                    :rules="[validatePassword]"
                    />
                </v-col>

                <v-col cols="9" offset-md="1">
                    <v-text-field
                    v-model="editedInfo.passwordConfirm"
                    label="비밀번호 확인"
                    type="password"
                    variant="underlined"
                    autocomplete="new-password"
                    :rules="[validatePasswordConfirm]"
                    :error="!passwordsMatch && editedInfo.passwordConfirm"
                    :error-messages="!passwordsMatch && editedInfo.passwordConfirm ? '비밀번호가 일치하지 않습니다.' : ''"
                    :hint="passwordsMatch ? '비밀번호가 일치합니다!' : ''"
                    :persistent-hint="passwordsMatch"
                    />
                </v-col>

                <v-col cols="9" offset-md="1">
                  <v-text-field 
                  variant="underlined"
                  v-model="editedInfo.name" 
                  label="가맹점주 이름" />
                </v-col>

                <v-col cols="11" offset-md="1">
                    <v-row dense>
                        <v-col cols="3">
                        <v-select
                            v-model="phoneFirst"
                            variant="underlined"
                            :items="['010', '011', '016', '017', '018', '019']"
                            label="번호"
                            dense
                            outlined
                        />
                        </v-col>
                        <!-- Dash separator -->
                        <v-col cols="1" class="d-flex align-center justify-center">
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
                        <v-col cols="1" class="d-flex align-center justify-center">
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

                <v-col cols="10" offset-md="1">
                  <v-autocomplete 
                    v-model="selectedHeadquarter"
                    :items="headquarters"
                    item-title="name"
                    item-value="headquarterId"
                    label="본사 선택"
                    variant="underlined"
                    return-object
                    clearable
                    solo
                  >
                  </v-autocomplete>
                </v-col>


                <v-col cols="10" offset-md="1">
                  <v-text-field 
                  v-model="editedInfo.franchiseName" 
                  variant="underlined"
                  label="가맹점" 
                  readOnly 
                  @click="dialogVisible = true"/>
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
                
                <v-col cols="12" class="d-flex justify-center">
                  <v-btn color="grey" class="mr-2" @click="cancelEdit">취소</v-btn>
                  <v-btn color="primary" type="submit">등록하기</v-btn>
                </v-col>
              </v-row>
              <br>
            </v-form>

        </v-card>
      </v-col>
    </v-row>
  </v-container>

  </template>
  
  <script setup>
  import { ref, watch, nextTick, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import apiClient from '@/api';
  
  const router = useRouter();
  const defaultImage = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg';
  
  const editedInfo = ref({});
  const profileFile = ref(null);
  const previewImage = ref(null);

  const emailCheckMessage = ref('');
  const isEmailDuplicated = ref(false);

  const phoneFirst = ref('');
  const phoneSecond = ref('');
  const phoneThird = ref('');

  // 인증번호 입력 필드 표시를 위한 변수
  const showVerificationField = ref(false);

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


  const emailVerificationCode = ref('');
  const verificationSent = ref(false);
  const emailVerified = ref(false);
  const emailVerificationSent = ref(false);
  const emailError = ref('');
  const emailErrorMsg = ref('');
  const emailSuccessMsg = ref('');


  const sendEmailVerificationCode = async () => {
    if (!editedInfo.value.email) {
      emailError.value = true;
      emailErrorMsg.value = '이메일을 입력해주세요.';
      return;
    }

    try {

      const res = await apiClient.post('/bonbon/email/send', {
        email: editedInfo.value.email,
        emailCode: 0
      },  {
          timeout: 5000  // 10초로 타임아웃 시간을 늘림
      });

      console.log(res);

      verificationSent.value = true;
      emailError.value = false;
      // 오류 메시지 초기화
      emailErrorMsg.value = '';
      emailVerificationSent.value = true;
      emailSuccessMsg.value = '인증번호가 이메일로 전송되었습니다.';
      
    } catch (err) {
      console.log(err);
      console.log(err.response);
      emailError.value = true;
      emailErrorMsg.value = '이메일 전송 중 오류가 발생했습니다. 이메일을 확인해주세요.';
      emailSuccessMsg.value = '';
    }
  };


// 이메일 인증 코드 검증 함수 (기존 verifyEmailCode 사용)
const verifyEmailCode = async () => {
  try {
    console.log(emailVerificationCode.value);
    console.log(editedInfo.value.email);
    const res = await apiClient.post('/bonbon/email/verify', {
      email: editedInfo.value.email,
      emailCode: emailVerificationCode.value
    });

    console.log(res);

    if (res.data) {
      emailVerified.value = true;
      emailError.value = false;
      emailErrorMsg.value = '이메일 인증 완료!';
      
    } else {
      emailError.value = true;
      emailErrorMsg.value = '인증번호가 일치하지 않습니다.';
    }
  } catch (err) {
    emailError.value = true;
    emailErrorMsg.value = '인증 확인 중 오류가 발생했습니다.';
  }
};
    
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


  const confirmPasswordMatchMsg = ref(''); 

  watch(
  () => [editedInfo.value.password, editedInfo.value.passwordConfirm],
  ([newPass, newConfirm]) => {
    if (newPass && newConfirm) {
      if (newPass === newConfirm) {
        confirmPasswordMatchMsg.value = '비밀번호가 일치합니다!';
      } else {
        confirmPasswordMatchMsg.value = '비밀번호가 일치하지 않습니다.';
      }
    } else {
      confirmPasswordMatchMsg.value = '';
    }
  }
);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (value) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!value) return '비밀번호를 입력해주세요.';
    if (!passwordPattern.test(value)) {
      return '비밀번호는 영문, 숫자, 특수기호를 포함한 8자리 이상이어야 합니다.';
    }
    return true;
  };

  // 비밀번호 확인 유효성 검사 함수
  const validatePasswordConfirm = (value) => {
    if (value !== editedInfo.value.password) {
        confirmPasswordMatchMsg.value = '비밀번호가 일치하지 않습니다.'; // 일치하지 않으면 메시지 비우기
        return '비밀번호가 일치하지 않습니다.';
      } else {
        confirmPasswordMatchMsg.value = '비밀번호가 일치합니다!';
        return true;
      }
  };

  const passwordsMatch = computed(() => {
    return (
      editedInfo.value.password &&
      editedInfo.value.passwordConfirm &&
      editedInfo.value.password === editedInfo.value.passwordConfirm
    );
  });


  const headquarters = ref([]);
  const selectedHeadquarter = ref('');


  const fetchHeadquarters = async () => {
    try {
      const res = await apiClient.get('/bonbon/user/headquarters');
      console.log(res);
      headquarters.value = res.data;
    } catch (error) {
      console.error('헤드쿼터 리스트 로딩 실패:', error);
    }
  };

  watch(selectedHeadquarter, (newVal) => {
    if (newVal && newVal.headquarterId) {
      editedInfo.value.headquarterId = newVal.headquarterId;
    } else {
      editedInfo.value.headquarterId = null;
    }
  });
    
  
  // 등록 제출
  const submitRegister = async () => {

    console.log(emailCheckMessage);
    console.log(isEmailDuplicated);

    if (!emailCheckMessage.value || isEmailDuplicated.value || !emailVerified.value) {
        alert('이메일 인증을 완료해주세요');
        return;
    } 
    
    if (!editedInfo.value.password) {
        alert('비밀번호 입력은 필수입니다.');
        return;
    }
    
    if (!validatePassword(editedInfo.value.password) === true) {
      alert('비밀번호 양식이 맞지 않습니다.');
      return;
    }
    
    if (editedInfo.value.password !== editedInfo.value.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    } 
    
    if (!editedInfo.value.name) {
        alert('가맹점주 이름 입력은 필수입니다.');
        return;
    } 
    
    if (!editedInfo.value.phone) {
        alert('가맹점주 전화번호 입력은 필수입니다.');
        return;
    } 
    
    if (!editedInfo.value.headquarterId) {
        alert('본사 선택은 필수입니다.');
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
  
      // 회원 가입 등록 요청
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
const isDirty = ref(false);
  
  const fetchFranchiseList = async (page, size, search = '', headquarterId = null) => {
    try {
      const params = {
        page: page - 1,
        size,
        keyword: search
      };
      if (headquarterId) {
        params.headquarterId = headquarterId;
      }

      const res = await apiClient.get('/bonbon/user/franchisee/without-owner', {
        params
      });
  
      dialogItems.value = res.data.content;
      dialogTotalItems.value = res.data.totalElements;
      dialogTotalPages.value = res.data.totalPages;
      console.log(items);

    } catch (error) {
      console.error('가맹점 목록 조회 실패:', error);
    }
  };

  watch(selectedHeadquarter, (newVal) => {
    if (newVal && newVal.headquarterId) {
      editedInfo.value.headquarterId = newVal.headquarterId;
      // 페이지 1로 초기화 하고 새로운 가맹점 리스트 요청
      dialogCurrentPage.value = 1;
      fetchFranchiseList(dialogCurrentPage.value, dialogPageSize.value, dialogSearch.value, newVal.headquarterId);
    } else {
      editedInfo.value.headquarterId = null;
      // 헤드쿼터 선택 해제 시 전체 리스트 불러오기
      dialogCurrentPage.value = 1;
      fetchFranchiseList(dialogCurrentPage.value, dialogPageSize.value, dialogSearch.value, null);
    }
  });

  const selectFranchise = (item) => {

    console.log("item: ", item.item.name);

    editedInfo.value.franchiseName = item.item.name;
    editedInfo.value.franchiseId = item.item.franchiseId;
    console.log("selected Franchise : ", editedInfo.value);
    isDirty.value = true;
    dialogVisible.value = false;

    alert(`"${item.item.name}" 가맹점을 선택했습니다.`);
  };

  watch(dialogVisible, async (visible) => {
    if (visible) {
      await nextTick(); // DOM 완전히 그린 후
      fetchFranchiseList(dialogCurrentPage.value, dialogPageSize.value, dialogSearch.value, editedInfo.value.headquarterId);
    }
  });

// 검색어 입력 시 첫 페이지부터 다시 검색된 목록 보여줌
  watch(dialogSearch, () => {
    dialogCurrentPage.value = 1;
    fetchFranchiseList(1, dialogPageSize.value, dialogSearch.value, editedInfo.value.headquarterId);
  });

  // 페이지네이션에서 페이지 변경 시 필요
  const onDialogPageChange = (page) => {
    dialogCurrentPage.value = page;
    fetchFranchiseList(page, dialogPageSize.value, dialogSearch.value, editedInfo.value.headquarterId);
  };

  // 페이지 당 표시 개수 바꿀 때 -> 1페이지부터 다시 불러오기
  const onDialogPageSizeChange = (size) => {
    dialogPageSize.value = size;
    dialogCurrentPage.value = 1;
    fetchFranchiseList(1, size, dialogSearch.value, editedInfo.value.headquarterId);
  };

  // Vuetify 서버 페이지네이션 이벤트 핸들러 (옵션 객체 전체)
  const onDialogOptionsChange = (options) => {
    dialogCurrentPage.value = options.page;
    dialogPageSize.value = options.itemsPerPage;
    fetchFranchiseList(options.page, options.itemsPerPage, dialogSearch.value, editedInfo.value.headquarterId);
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



  // 초기 로딩  
  onMounted(() => {
    fetchHeadquarters();
    fetchFranchiseList(currentPage.value, pageSize.value, search.value, null);
  });

  const checkEmailDuplication = async () => {
    if (!editedInfo.value.email) {
        alert('이메일을 입력해주세요.');
        return;
    }

    try {
        // 해당 이메일을 사용할 수 있는지 먼저 확인
        console.log(editedInfo.value.email);
        const res = await apiClient.get('/bonbon/user/email-check', {
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

            showVerificationField.value = true;

            await sendEmailVerificationCode();
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
/* 헤더 가운데 정렬 */
::v-deep(.v-data-table .v-data-table-header__content) {
   font-size: 14px;
   font-weight: 500;
   justify-content: center;
   text-align: center;
}

.join-card {
  position: relative; /* 기준이 되는 컨테이너 */
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
}

.fill-height {
  min-height: 100vh;
  background-color: #FFFEF8;
}


 </style>  