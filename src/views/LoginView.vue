<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/LoginForm.vue'

const authStore = useAuthStore()
const loading = ref(true)
const router = useRouter()

onMounted(() => {
  // If user is already authenticated, redirect to activities
  if (authStore.isAuthenticated()) {
    router.push('/activities')
  } else {
    loading.value = false
  }
})
</script>

<template>
  <LayoutGuest>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-5">
          <div v-if="loading" class="text-center">
            <p>Loading...</p>
          </div>
          <div v-else>
            <LoginForm buttonText="Entrar" />
          </div>
        </div>
      </div>
    </div>
  </LayoutGuest>
</template>

<style scoped>
.container {
  padding: 2rem 0;
}
</style>
