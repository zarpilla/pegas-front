<script setup lang="ts">
import AssistanceForm from "../components/AssistanceForm.vue";
import { useActivityStore } from "../stores/activity";
import { ref } from "vue";

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
});

const activityStore = useActivityStore();

const submitted = ref(false);

const activity = ref<any>(null);
const session = ref<any>(null);

activityStore.loadSession(props.sessionId).then((ss: any) => {
  session.value = ss;
  activity.value = session.value.attributes.activity.data;
});

const submit = () => {
  submitted.value = true;
};
</script>

<template>
  <div v-if="session && activity">
    <div v-if="!submitted">
      <!-- <h1 class="mt-5">{{ activity.attributes.name }}</h1>
      <p>{{ activity.attributes.description }}</p> -->
      <h1 class="mt-5">{{ session.attributes.name }}</h1>
      <!-- <p>{{ session.attributes.date }}</p> -->
      <h1 class="mt-5">Inscripció</h1>
      <AssistanceForm @submit="submit" :session-id="session.id" />
    </div>
    <div v-else>
      <div class="ok text-center mt-5 mb-5 section-ok">
        <img class="w-75" src="@/assets/img/bgok.png" />
      </div>
      <div class="ok text-center mt-5 mb-5 section-okz">
        Inscripció feta correctament!
      </div>
      <div class="community text-center">
        Ara que ja ets part de la comunitat segueix-nos a

        <div class="row row-social pt-4">
          <div class="col">
            <a href="https://www.instagram.com/pegasdefoc/" target="_blank">
              <i class="fa fa-instagram"></i>
            </a>
          </div>
          <div class="col">
            <a
              href="https://chat.whatsapp.com/JDTxHr5nbNAK5nahKxWf5e"
              target="_blank"
            >
              <i class="fa fa-whatsapp"></i>
            </a>
          </div>
          <div class="col">
            <a href="https://pegasdefoc.org/" target="_blank">
              <img src="@/assets/img/logo.png" class="logo-100" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ok {
  font-size: 30px;
  font-weight: bold;
}
.fa {
  font-size: 50px;
}
.logo-100 {
  width: 45px;
  margin-top: 2px;
}
.row-social a{
  color: #000;
}
</style>
