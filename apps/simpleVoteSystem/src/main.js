import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import './index.less'

// 2. 引入组件样式
import 'vant/lib/index.css'

const vm = createApp(App)
vm.use(router).mount('#app')

