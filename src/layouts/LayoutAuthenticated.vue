<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Api } from "@/service/api";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const loading = ref(true);

const props = defineProps({
  css: {
    type: String,
    required: false,
    default: "bg-balkar",
  },
});

onMounted(async () => {
  try {
    const meResponse = await Api.auth.get();
    
    if (meResponse && meResponse.data && meResponse.data.id) {
      authStore.setUser({
        id: meResponse.data.id,
        username: meResponse.data.username,
        email: meResponse.data.email,
        name: meResponse.data.name,
        lastname: meResponse.data.lastname,
        createdAt: meResponse.data.createdAt,
        updatedAt: meResponse.data.updatedAt,
      });
      loading.value = false;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    authStore.logout();
    router.push("/login");
  }
});

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="layout-wrapper">
    <header>
      <div class="container">
        <div class="logo-outter mt-3">
          <div class="row w-100 align-items-center">
            <div class="col-12 col-md-10 text-end">
              <nav class="d-inline-flex gap-3">
                <RouterLink to="/activities" class="btn btn-tertiary">
                  Activitats
                </RouterLink>
                <button @click="logout" class="btn btn-secondary">
                  Tancar sessió
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="slot-inner mt-5">
      <slot v-if="!loading" />
      <div v-else class="text-center p-5">
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.flex-grow-1 {
  flex: 1 1 auto;
}
.content {
  min-height: calc(100vh - 353px);
}

.place-items-center .slot {
  place-items: center;
}

.slot-inner {
  text-align: left;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  width: 100%;
}

.logo-outter {
  color: #000000;

  /* Headings/h6 */
  font-size: 18px;
  font-family: Inter;
  font-weight: 700;
  line-height: 24px;
}
.logo-outter img {
  height: 80px;
}
.auth-wrapper {
  border-radius: 0px;
  border: 0px solid var(--gray-0220, #f7f7f7);
  background: var(--gray-0210, #fff);
  padding: 4px;
  height: auto;
  width: fit-content;
}
.w-100 {
  width: 100%;
}
</style>
