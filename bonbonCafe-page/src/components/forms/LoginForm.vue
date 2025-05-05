<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-5 login-card" elevation="10">

          <v-card-title class="text-center text-h5 font-weight-bold">Login</v-card-title>

          <v-card-text class="login-fields">
            <v-form @submit.prevent="submitClick">
              <v-text-field
                v-model="formData.email"
                label="Email"
                prepend-inner-icon="mdi-account"
                density="compact"
                class="custom-input"
              ></v-text-field>

              <v-text-field
                v-model="formData.password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                density="compact"
                type="password"
                class="custom-input"
              ></v-text-field>

              <!-- <v-checkbox
                v-model="autoLogin"
                label="자동 로그인"
              ></v-checkbox>

              <v-checkbox
                v-model="saveId"
                label="아이디 저장"
              ></v-checkbox> -->

              <v-btn
                type="submit"
                color="indigo-darken-4"
                class="mt-4"
                block
              >
                Login
              </v-btn>
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

const formData = reactive({
  email: '',
  password: ''
});

const autoLogin = ref(false);
const saveId = ref(false);

const submitClick = () => {
  emit('form-submit', toRaw(formData));
};
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
  height: 340px;
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


</style>
