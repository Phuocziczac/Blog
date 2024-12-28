

import { createApp } from 'vue'
import { createRouter,createMemoryHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './router';
const router = createRouter({
    history : createMemoryHistory(),
    routes
})
const app =createApp(App);
app.use(router)
app.mount('#app')
