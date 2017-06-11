import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from './config/ajax_cfg';

Vue.prototype.$http = axios;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  ...App,
}).$mount('#app');
