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
            비밀번호 수정
            </v-typography>
            
            <br>
            <br>
            <v-card-text>
              <v-text-field
                v-model="passwordForm.oldPassword"
                label="현재 비밀번호"
                type="password"
                variant="underlined"
              />
              <v-text-field
                    v-model="passwordForm.newPassword"
                    label="새 비밀번호"
                    type="password"
                    variant="underlined"
                    autocomplete="new-password"
                    :rules="[validatePassword]"
                    />
              <v-text-field
                    v-model="passwordForm.newPasswordConfirm"
                    label="새 비밀번호 확인"
                    type="password"
                    variant="underlined"
                    autocomplete="new-password"
                    :rules="[validatePasswordConfirm]"
                    :error="!passwordsMatch && editedInfo.passwordConfirm"
                    :error-messages="!passwordsMatch && editedInfo.passwordConfirm ? '비밀번호가 일치하지 않습니다.' : ''"
                    :hint="passwordsMatch ? '비밀번호가 일치합니다!' : ''"
                    :persistent-hint="passwordsMatch"
                    />
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn text color="grey" @click="cancelPasswordChange">취소</v-btn>
              <v-btn color="primary" @click="submitPasswordChange">비밀번호 변경</v-btn>
            </v-card-actions>
          </v-card>

      </v-col>
  </v-container>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import apiClient from '@/api';
import { useRouter } from 'vue-router';

const router = useRouter();

const showPasswordDialog = ref(false);


const editedInfo = ref({});

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

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: ''
});

const cancelPasswordChange = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  };
  showPasswordDialog.value = false;
};

const submitPasswordChange = async () => {

  const { oldPassword, newPassword, newPasswordConfirm } = passwordForm.value;
  console.log(oldPassword);
  console.log(newPassword);
  console.log(newPasswordConfirm);

  if (!oldPassword || !newPassword || !newPasswordConfirm) {
    alert('모든 비밀번호 항목을 입력해주세요.');
    return;
  }

  if (passwordForm.value.newPassword !== passwordForm.value.newPasswordConfirm) {
    alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  try {
    const accessToken = localStorage.getItem('accessToken');
    await apiClient.post(
      '/bonbon/user/password',
      {
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword,
        newPasswordConfirm: passwordForm.value.newPasswordConfirm
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    alert('비밀번호가 성공적으로 변경되었습니다.');
    router.push(`user-account`);
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    console.error(error.response);

    alert(error.response.data.message);
  }
};

const confirmPasswordMatchMsg = ref('');

  const validatePassword = (value) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!value) return '비밀번호를 입력해주세요.';
    if (!passwordPattern.test(value)) {
      return '비밀번호는 영문, 숫자, 특수기호를 포함한 8자리 이상이어야 합니다.';
    }
    return true;
  };

  const validatePasswordConfirm = (value) => {
    if (!value) {
      confirmPasswordMatchMsg.value = '비밀번호 확인을 입력해주세요.';
      return '비밀번호 확인을 입력해주세요.';
    }

    if (value !== passwordForm.value.newPassword) {
      confirmPasswordMatchMsg.value = '새 비밀번호가 일치하지 않습니다.';
      return '새 비밀번호가 일치하지 않습니다.';
    } else {
      confirmPasswordMatchMsg.value = '비밀번호가 일치합니다!';
      return true;
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