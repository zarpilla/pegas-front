<script setup lang="ts">
import { useActivityStore } from "../stores/activity";
import { reactive, ref } from "vue";
import service from "@/service/index";
// import VueSignaturePad from 'vue-signature-pad';

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
});

const form = reactive({
  name: "",
  lastname: "",
  identification: "",
  birthdate: null,
  municipality: "",
  sex: "",
  gender: null,
  session: "",
  drets: false,
  phone: "",
  email: "",
});

const emit = defineEmits<{
  (e: "submit"): {};
}>();

const submit = async () => {
  if (signaturePad.value) {
    const { isEmpty, data: signature } = signaturePad.value.saveSignature();

    if (isEmpty) {
      alert("Has d'emplenar la signatura");
      return;
    }
    if (!checkEmailIsValid(form.email)) {
      alert("Has d'emplenar un email vàlid");
      return;
    }

    form.session = props.sessionId;

    try {
      const { data } = await service({ requiresAuth: false }).post(
        "registrations",
        { data: { ...form } }
      );

      if (data && data.data && data.data.id) {
        saveImage(data.data.id, signature);

        emit("submit");
      } else {
        alert("S'ha produït un error, prova-ho més tard");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        alert(error.response.data.error.message);
      } else {
        alert("S'ha produït un error, prova-ho més tard");
      }
    }
  }
};

const signaturePad = ref(null);

const undo = () => {
  if (signaturePad.value) {
    signaturePad.value.undoSignature();
  }
};

const b64toBlob = (b64Data: any, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data.replace("data:image/png;base64,", ""));
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

const saveImage = (id: number, signature: string) => {
  const formData = new FormData();

  // append the files to FormData
  // Array.from(Array(fileList.length).keys()).map((x) => {
  formData.append(
    "files",
    b64toBlob(signature),
    `signature-${id.toString()}.png`
  );
  // });

  formData.append("ref", "api::registration.registration");
  formData.append("refId", id.toString());
  formData.append("field", "signature");

  service({ requiresAuth: false, multipart: true })
    .post("upload", formData)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const save = () => {
  if (signaturePad.value) {
    const { isEmpty, data } = signaturePad.value.saveSignature();
    console.log(isEmpty);
    console.log(data);
  }
};

const checkEmailIsValid = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// const activityStore = useActivityStore();

// const activity = ref<any>(null);
// const session = ref<any>(null);

// activityStore.loadSession(props.sessionId).then((ss: any) => {
//   session.value = ss
//   activity.value = session.value.attributes.activity.data
// });

const personChoosed = ref<"already" | "new" | "">("");

const newPerson = () => {};
</script>

<template>
  <button
    v-if="personChoosed"
    class="btn btn-white me-2 mt-4 mb-4"
    @click="personChoosed = ''"
  >
    Enrere
  </button>

  <div v-if="!personChoosed">
    <button
      class="btn btn-w-100 btn-secondary me-4 mt-4 mb-4"
      @click="personChoosed = 'new'"
    >
      És la primera vegada que m'inscric
    </button>
    <button
      class="btn btn-w-100 btn-secondary mt-4 mb-4"
      @click="personChoosed = 'already'"
    >
      Ja m'he inscrit a alguna altra activitat
    </button>
  </div>

  <form
    v-else-if="personChoosed === 'new'"
    class="mt-3"
    @submit.prevent="submit"
  >
    <div class="mb-3">
      <label for="name" class="form-label">Nom</label>
      <input
        required
        type="text"
        class="form-control"
        id="name"
        v-model="form.name"
      />
    </div>
    <div class="mb-3">
      <label for="lastname" class="form-label">Cognoms</label>
      <input
        required
        type="text"
        class="form-control"
        id="lastname"
        v-model="form.lastname"
      />
    </div>
    <div class="mb-3">
      <label for="identification" class="form-label"
        >Número de document identificatiu (DNI/NIE/Passaport)</label
      >
      <input
        required
        type="text"
        class="form-control"
        id="identification"
        v-model="form.identification"
      />
    </div>
    <div class="mb-3">
      <label for="birthdate" class="form-label">Data de naixement</label>
      <input
        required
        type="date"
        class="form-control"
        id="birthdate"
        v-model="form.birthdate"
      />
    </div>
    <div class="mb-3">
      <label for="municipality" class="form-label"
        >Municipi de residencia</label
      >
      <input
        required
        type="text"
        class="form-control"
        id="municipality"
        v-model="form.municipality"
      />
    </div>
    <div class="mb-3">
      <label for="sex" class="form-label">Sexe</label>
      <input
        required
        type="text"
        class="form-control"
        id="sex"
        v-model="form.sex"
      />
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

    <div class="mb-3">
      <label for="email" class="form-label">Email de contacte</label>
      <input
        required
        type="text"
        class="form-control"
        id="sex"
        v-model="form.email"
      />
    </div>
    <div class="mb-3">
      <label for="gender" class="form-label">Signatura</label>
      <VueSignaturePad
        class="signature-pad"
        width="350px"
        height="250px"
        ref="signaturePad"
      />
      <div class="d-flex">
        <button class="ms-auto mt-3 btn btn-white" @click.prevent="undo">
          Desfer signatura
        </button>
      </div>
    </div>

    <div class="mb-3">
      <label for="gender" class="form-label">Drets d'imatge</label>
      <br />
      <input type="checkbox" v-model="form.drets" />
      D’acord amb la llei orgànica 1/1982, autoritzes i atorgues el dret i
      permís per a captar, enregistrar, usar, publicar i distribuir la teva
      imatge obtinguda durant la mateixa sessió? (En cas de no autoritzar, avisa
      a una de les organitzadores de l'esdeveniment)
      <br />
      <br />
    </div>

    <div class="mb-3">
      <label for="phone" class="form-label"
        >Telèfon de contacte (opcional)</label
      >
      <input type="text" class="form-control" id="sex" v-model="form.phone" />
      <br />

      Compartint el mail o el telèfon, mostres el teu interès a rebre informació
      per correu electrònic o a través de la comunitat de whatsapp,
      respectivament.
      <br /><br />
      D’acord amb el Reglament (UE) 2016/679 del Parlament Europeu i del Consell
      de 27 d’abril de 2016 (RGPD), poden fer ús de les teves dades personals
      Resilience.Earth SCCL, amb la finalitat d’informar-te sobre activitats
      relacionades amb els seus àmbits respectius.
    </div>

    <div class="text-center mt-5 mb-5">
      <div class="d-flex">
        <button type="submit" class="ms-auto btn btn-primary">
          Enviar dades
        </button>
      </div>
    </div>
  </form>

  <form v-else class="mt-3" @submit.prevent="submit">
    <div class="mb-3">
      <label for="email" class="form-label">Email de contacte</label>
      <input
        required
        type="text"
        class="form-control"
        id="sex"
        v-model="form.email"
      />
    </div>
    <div class="mb-3">
      <label for="gender" class="form-label">Signatura</label>
      <VueSignaturePad
        class="signature-pad"
        width="350px"
        height="250px"
        ref="signaturePad"
      />
      <div class="d-flex">
        <button class="ms-auto mt-3 btn btn-white" @click.prevent="undo">
          Desfer signatura
        </button>
      </div>
    </div>

    <div class="text-center mt-5 mb-5">
      <div class="d-flex">
        <button type="submit" class="ms-auto btn btn-primary">
          Enviar dades
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
form {
}
label {
  font-style: italic;
  font-size: 18px;
  font-weight: bold;
}
.form-control,
.form-select {
  border: 2px solid #0f89a1;
  border-radius: 50px;
  padding: 0.75rem 2rem;
  color: #000;
}
button {
  background: #0f89a1;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  border: 0;
  font-size: 18px;
  font-weight: bold;
}
.signature-pad {
  border: 2px solid #0f89a1;
  border-radius: 50px;
}
.btn-white {
  background: transparent;
  border: 2px solid #0f89a1;
  border-radius: 50px;
  color: #0f89a1;
}
@media screen and (max-width: 768px) {
  .btn-w-100 {
    width: 100%;
  }
}
</style>
