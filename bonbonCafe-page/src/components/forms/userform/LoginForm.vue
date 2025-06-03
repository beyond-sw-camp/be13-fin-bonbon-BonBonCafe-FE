<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-5 login-card" elevation="10">

          <!-- 로고 이미지 -->
          

          <!-- 로그인 타이틀 -->
          <!-- <v-card-title class="text-center text-h5 font-weight-bold mb-4">Login</v-card-title> -->

          <!-- 로그인 입력 필드 -->
          <v-card-text>
            
            <v-img
              src="https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/bonbon-logo(white-black).png"
              alt="logo"
              contain
              height="160"
              class="mx-auto"
              style="max-width: 200px;"
            ></v-img>

            <v-form @submit.prevent="submitClick">
              <v-text-field
                v-model="formData.email"
                label="e-mail"
                prepend-inner-icon="mdi-account"
                density="compact"
              ></v-text-field>
              <v-text-field
                v-model="formData.password"
                label="password"
                prepend-inner-icon="mdi-lock"
                density="compact"
                type="password"
              ></v-text-field>  

              <v-btn
                type="submit"
                color="indigo-darken-4"
                block
              >
                Login
              </v-btn>

              <!-- 아이디/비밀번호 찾기 -->
              <div class="find-info">
                <div class="find-links">
                  <v-btn variant="text" class="text-caption px-1" @click="goToJoinFranchise">
                    가맹점주 회원가입
                  </v-btn>
                  <span class="divider">|</span>
                  <v-btn variant="text" class="text-caption px-1" @click="goToJoinManager">
                    매니저 회원가입
                  </v-btn>
                </div>
              </div>


            </v-form>
          </v-card-text>


        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { reactive, ref, toRaw } from 'vue';
const emit = defineEmits(['form-submit']);
import { useRouter } from 'vue-router';

const router = useRouter()

const formData = reactive({
  email: '',
  password: ''
});

const autoLogin = ref(false);
const saveId = ref(false);

const submitClick = () => {
  emit('form-submit', toRaw(formData));
};

const goToJoinFranchise = () => {
  router.push({ name: 'franchisee-join' })  // 또는 path: '/join-franchise'
}

const goToJoinManager = () => {
  router.push({ name: 'manager-join' })  // 또는 path: '/join-franchise'
}

</script>

<style scoped>
.login-input .v-input__control {
  border-radius: 12px;
  min-height: 48px;
  font-size: 16px;
}

.login-input input {
  padding: 10px;
  
}

.fill-height {
  min-height: 100vh;
  background-color: #FFFEF8;
}


.login-card {
  width: 400px;
  height: 440px;
  position: relative; /* 기준이 되는 컨테이너 */
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
}

.login-fields {
  position: absolute;
  top: 110px; /* 카드 위쪽에서부터의 거리 */
  left: 0;
  right: 0;
  padding: 0 20px;
}

.email-field {
  margin-bottom: 10px;
}

.password-field {
  margin-bottom: 20px;
}

.login-btn {
  margin-top: 20px;
}

.slogan-title {
  font-size: 10px;
  font-weight: bold;
  color: gray;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.text-caption {
  font-size: 13px;
  color: #888;
  text-decoration: underline;
  cursor: pointer;
}

.find-info {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}

.find-links {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #888;
}

</style>
