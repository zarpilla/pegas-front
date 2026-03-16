<script setup lang="ts">
import { useActivityStore } from "../stores/activity";
import { useAuthStore } from "../stores/auth";
import { ref } from "vue";
import QRCodeVue3 from "qrcode-vue3";
import { Api } from '../service/api';

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
});

const activityStore = useActivityStore();
const authStore = useAuthStore();

const activity = ref<any>(null);
const session = ref<any>(null);

activityStore.loadSession(props.sessionId).then((ss: any) => {
  session.value = ss;
  activity.value = session.value.attributes.activity.data;
});

const downloadSessionRegistrations = async () => {
  if (!session.value) return;
  
  try {
    const response = await Api.registrations.downloadBySession(session.value.id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registrations-session-${session.value.attributes.name}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading session registrations:', error);
    alert('Error descarregant les inscripcions');
  }
};
</script>

<template>
  <div v-if="session && activity">
    <h2 v-if="session.attributes.showActivity">
      {{ activity.attributes.name }}
    </h2>
    <p v-if="session.attributes.showActivity">
      {{ activity.attributes.description }}
    </p>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>{{ session.attributes.name }}</h4>
    </div>
    <p v-if="session.attributes.showDate">{{ session.attributes.date }}</p>
    <p v-if="session.attributes.description" v-html="session.attributes.description"></p>
    <div class="mt-5">
      <QRCodeVue3
        :value="`https://app.pegasdefoc.org/assistance/${session.attributes.uuid}`"
      />
    </div>
  </div>
</template>
