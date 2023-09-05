<script setup lang="ts">
import Session from '../components/Session.vue'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()

const sessionId = ref('')
sessionId.value = route.params.sessionId as string

watch(() => route.params.activityId, (newValue) => {
  if (newValue) {
    // load()
  }
})

</script>

<template>
  <main>
    <Session v-if="sessionId" :session-id="sessionId"></Session>
  </main>
</template>
