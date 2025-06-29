import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import '@/assets/styles/scss/bootstrap.scss';
import '@/assets/styles/font.css';
import '@/assets/styles/sort.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app');