import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import { initializeConfig } from './config';

// Initialize app configuration (theme, SEO, fonts, etc.)
initializeConfig();

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#app');
