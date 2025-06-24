import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { Toast } from '@/components';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import '@/assets/styles/scss/bootstrap.scss';
import '@/assets/styles/sort.css';

const app = createApp(App);
app.component('Toast', Toast);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app');