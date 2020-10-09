import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(IconsPlugin)
Vue.use(BootstrapVue, BootstrapVueIcons)

new Vue({
    store,
    render: h => h(App)
}).$mount('#app')