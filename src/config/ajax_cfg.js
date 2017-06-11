import axios from 'axios';
import store from '../store';
import router from '../router';
// axios全局配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = '/proxy_api';
// 请求拦截器
axios.interceptors.request.use(
    (req) => {
      if (store.state.token) {
        req.data.token = store.state.token;
      }
      return req;
    },
    err => Promise.reject(err));
// 响应拦截器
axios.interceptors.response.use(
    res => res,
    (error) => {
      if (error.response.status === 401) {
       // 401 清除token信息并跳转到登录页面
        store.commit('EXIT');
        router.replace({
          path: '/login',
       // query: {redirect: router.currentRoute.fullPath}
        });
      }
      return Promise.reject(error.response.data);
    });
export default axios;
