import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap";
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueSignaturePad from 'vue-signature-pad';

const app = createApp(App)

app.use(VueSignaturePad);
app.use(createPinia())
app.use(router)

app.mount('#app')
