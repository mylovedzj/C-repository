import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
//import store from './store' //引入状态管理 store
//vant样式
import 'vant/lib/index.css'

// 这个库会在桌面端自动将mouse事件转换成对应的touch事件，使得组件能够在桌面端使用。
import '@vant/touch-emulator'
import { Toast } from 'vant'
import 'lib-flexible'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';

createApp(App)
    .use(router)
    .use(Toast)
    .use(ElementPlus,{ size: 'small', zIndex: 3000 })
    .mount('#app');
    
    