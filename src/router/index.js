import Vue from 'vue';
import VueRouter from 'vue-router';
import Router from './path';
import store from '../store';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: Router,
});

// 全局路由钩子
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state.token) { // 通过vuex state获取当前的token
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  } else {
    next();
  }
});
export default router;
