import { createApp } from 'vue'
import App from './App.vue'
import './index.less'

// 2. 引入组件样式
import 'vant/lib/index.css'

const vm = createApp(App)
vm.mount('#app')
