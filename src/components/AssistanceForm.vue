<script setup lang="ts">
import { useActivityStore } from "../stores/activity";
import { reactive, ref } from "vue";
import service from "@/service/index";

const props = defineProps({  
  sessionId: {
    type: String,
    required: true,
  },
});

const form = reactive({
  name: '',
  lastname: '',
  identification: '',
  birthdate: null,
  municipality: '',
  sex: '',
  gender: '',
})



const emit = defineEmits<{
  (e: 'submit' ): {}
}>()

const submit = async () => {
  const { data } = await service({ requiresAuth: false }).post('registrations', { data: { ...form } })
  if (data && data.data && data.data.id) {
    console.log('data', data)

    emit('submit')

  } else {
    alert("S'ha produït un error, prova-ho més tard")
  }
}

// const activityStore = useActivityStore();

// const activity = ref<any>(null);
// const session = ref<any>(null);

// activityStore.loadSession(props.sessionId).then((ss: any) => {  
//   session.value = ss
//   activity.value = session.value.attributes.activity.data
// });
</script>

<template>
  <form class="mt-3" @submit.prevent="submit">
    <div class="mb-3">
      <label for="name" class="form-label">Nom</label>
      <input required type="text" class="form-control" id="name" v-model="form.name">    
    </div>
    <div class="mb-3">
      <label for="lastname" class="form-label">Cognoms</label>
      <input required type="text" class="form-control" id="lastname" v-model="form.lastname">    
    </div>
    <div class="mb-3">
      <label for="identification" class="form-label">Número de document identificatiu</label>
      <input required type="text" class="form-control" id="identification" v-model="form.identification">    
    </div>
    <div class="mb-3">
      <label for="birthdate" class="form-label">Data de naixement</label>
      <input required type="date" class="form-control" id="birthdate" v-model="form.birthdate">    
    </div>
    <div class="mb-3">
      <label for="municipality" class="form-label">Municipi de residencia</label>
      <input required type="text" class="form-control" id="municipality" v-model="form.municipality">    
    </div>
    <div class="mb-3">
      <label for="sex" class="form-label">Sexe</label>
      <input required type="text" class="form-control" id="sex" v-model="form.sex">    
    </div>
    <div class="mb-3">
      <label for="gender" class="form-label">Gènere</label>
      <select required class="form-select" id="gender" v-model="form.gender">
        <option selected></option>
        <option value="Home">Home</option>
        <option value="Dona">Dona</option>
        <option value="No binari">No binari</option>
      </select>
    </div>
    
    <div class="text-center mt-4 mb-5">
      <button type="submit" class="btn btn-primary">Enviar</button>
    </div>
    

  </form>
  
</template>

<style scoped>
form{

}
label{
  font-style: italic;
  font-size: 18px;
  font-weight: bold;
}
.form-control, .form-select{
  border: 2px solid #0F89A1;
  border-radius: 50px;
  padding: 0.75rem 2rem;
  color: #000;
}
button{
  background: #0F89A1;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  border: 0;
  font-size: 18px;
  font-weight: bold;
}
</style>