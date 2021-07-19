import Vue from 'vue'
import App from './App.vue'

// 启用v-transition
import directive from '@/directive'
directive(Vue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
