import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { loadFonts } from './plugins/webfontloader'

loadFonts()
ChartJS.register(ArcElement, Tooltip, Legend)



const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app');


