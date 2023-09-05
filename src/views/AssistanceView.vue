<script setup lang="ts">
import Assistance from '../components/Assistance.vue'
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
    <Assistance v-if="sessionId" :session-id="sessionId"></Assistance>
  </main>
</template>
