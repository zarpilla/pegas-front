<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { useAuthStore } from '@/stores/auth'
import { checkEmpty, checkIsEmail } from '@/utils/helper'
import { Api } from '@/service/api'

const props = defineProps({
  buttonText: {
    type: String,
    required: false,
    default: 'Entrar'
  }
})

const authStore = useAuthStore()
const accountNotConfirmed = ref(false)
const accountNotConfirmedCountDown = ref(0)

const form = reactive({
  login: '',
  password: ''
})

const status = reactive({
  message: '',
  messagePwd: '',
  error: false,
  errorPwd: false
})

const router = useRouter()

const removeError = () => {
  status.error = false
  status.errorPwd = false
}

const submit = async () => {
  try {
    status.error = false
    status.message = ''
    status.errorPwd = false
    status.messagePwd = ''
    
    if (checkEmpty(form.login)) {
      status.error = true
      status.message = 'L\'email és obligatori'
      return
    }

    if (!checkIsEmail(form.login)) {
      status.error = true
      status.message = 'L\'email no és vàlid'
      return
    }

    if (checkEmpty(form.password)) {
      status.errorPwd = true
      status.messagePwd = 'La contrasenya és obligatòria'
      return
    }

    const response: any = (await Api.auth.login(form.login, form.password)).data

    if (response && response.jwt) {
      authStore.setUser({
        jwt: response.jwt
      })

      const meResponse: any = await Api.auth.get()

      if (meResponse && meResponse.data.id) {
        authStore.setUser({
          id: meResponse.data.id,
          username: meResponse.data.username,
          email: meResponse.data.email,
          jwt: response.jwt,
          name: meResponse.data.name,
          lastname: meResponse.data.lastname,
          createdAt: meResponse.data.createdAt,
          updatedAt: meResponse.data.updatedAt
        })

        router.push('/activities')
      }
    }
  } catch (err: any) {
    status.errorPwd = true
    if (err.response && err.response.data && err.response.data.error) {
      const errorMessage = err.response.data.error.message
      if (errorMessage === 'Your account email is not confirmed') {
        accountNotConfirmed.value = true
        status.messagePwd = 'El teu compte no està confirmat. Revisa el teu email.'
      } else if (errorMessage === 'Invalid identifier or password') {
        status.messagePwd = 'Email o contrasenya incorrectes'
      } else {
        status.messagePwd = errorMessage
      }
    } else {
      status.messagePwd = 'Error al iniciar sessió. Torna-ho a provar.'
    }
  }
}

const interval = ref<any>(null)

const resend = async () => {
  try {
    if (!form.login) {
      status.error = true
      status.message = 'L\'email és obligatori'
      return
    }
    await Api.auth.emailConfirmation(form.login)
    accountNotConfirmedCountDown.value = 60

    interval.value = setInterval(() => {
      accountNotConfirmedCountDown.value = accountNotConfirmedCountDown.value - 1
      if (accountNotConfirmedCountDown.value === 0) {
        clearInterval(interval.value)
      }
    }, 1000)
  } catch (err: any) {
    console.error('Error resending confirmation:', err)
  }
}
</script>

<template>
  <h1 class="mb-4">Accedeix al teu compte</h1>

  <form @submit.prevent="submit">
    <FormField :help="status.message" label="Email" class="mb-2">
      <FormControl
        @click="removeError"
        :placeholderEffect="false"
        :validationError="status.error"
        placeholder="Introdueix el teu email"
        v-model="form.login"
        name="login"
        autocomplete="username"
        maxlength="200"
      />
    </FormField>

    <FormField class="position-relative" :help="status.messagePwd" label="Contrasenya">
      <FormControl
        @click="removeError"
        :placeholderEffect="false"
        :validationError="status.errorPwd"
        placeholder="Introdueix la teva contrasenya"
        v-model="form.password"
        type="password"
        name="password"
        autocomplete="current-password"
        maxlength="200"
      />
    </FormField>

    <div v-if="accountNotConfirmed" class="alert alert-warning mt-3">
      <p>El teu compte no està confirmat. Si us plau, revisa el teu email.</p>
      <button 
        type="button" 
        @click="resend" 
        class="btn btn-secondary btn-sm"
        :disabled="accountNotConfirmedCountDown > 0"
      >
        <span v-if="accountNotConfirmedCountDown > 0">
          Reenviar email ({{ accountNotConfirmedCountDown }}s)
        </span>
        <span v-else>Reenviar email de confirmació</span>
      </button>
    </div>

    <div class="d-flex mt-4">
      <button
        class="mt-4 btn btn-primary ms-auto me-auto"
        type="submit"
        v-if="!accountNotConfirmed"
      >
        {{ props.buttonText }}

        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="ms-2"
        >
          <mask
            id="mask0_64_2203"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="25"
          >
            <rect y="0.312622" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_64_2203)">
            <path
              d="M12 21.3126C10.75 21.3126 9.57917 21.0751 8.4875 20.6001C7.39583 20.1251 6.44583 19.4835 5.6375 18.6751C4.82917 17.8668 4.1875 16.9168 3.7125 15.8251C3.2375 14.7335 3 13.5626 3 12.3126C3 11.0626 3.2375 9.89179 3.7125 8.80012C4.1875 7.70846 4.82917 6.75846 5.6375 5.95012C6.44583 5.14179 7.39583 4.50012 8.4875 4.02512C9.57917 3.55012 10.75 3.31262 12 3.31262V5.31262C10.05 5.31262 8.39583 5.99179 7.0375 7.35012C5.67917 8.70846 5 10.3626 5 12.3126C5 14.2626 5.67917 15.9168 7.0375 17.2751C8.39583 18.6335 10.05 19.3126 12 19.3126V21.3126ZM16 17.3126L14.6 15.8876L17.175 13.3126H9V11.3126H17.175L14.6 8.71262L16 7.31262L21 12.3126L16 17.3126Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </button>
    </div>
  </form>
</template>
<style scoped>
form {
  font-size: 16px;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
}

.alert {
  padding: 1rem;
  border-radius: 0.25rem;
}

.alert-warning {
  background-color: #fff3cd;
  border: 1px solid #ffecb5;
  color: #664d03;
}

.btn {
  padding: 0.5rem 1.5rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #0d6efd;
  color: white;
}

.btn-primary:hover {
  background-color: #0b5ed7;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5c636a;
}

.btn-secondary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}
</style>
