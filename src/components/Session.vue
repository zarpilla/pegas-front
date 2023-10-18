<script setup lang="ts">
import { useActivityStore } from "../stores/activity";
import { ref } from "vue";
import QRCodeVue3 from "qrcode-vue3";

const props = defineProps({  
  sessionId: {
    type: String,
    required: true,
  },
});

const activityStore = useActivityStore();

const activity = ref<any>(null);
const session = ref<any>(null);

activityStore.loadSession(props.sessionId).then((ss: any) => {  
  session.value = ss
  activity.value = session.value.attributes.activity.data
});
</script>

<template>
  <div v-if="session && activity">
    <!-- <h2>{{ activity.attributes.name }}</h2>
    <p>{{ activity.attributes.description }}</p> -->
    <h4 class="mb-5">{{ session.attributes.name }}</h4>
    <!-- <p>{{ session.attributes.date }}</p> -->

    <QRCodeVue3
          :value="`https://app.pegasdefoc.org/assistance/${session.attributes.uuid}`"
        />
  </div>
</template>
