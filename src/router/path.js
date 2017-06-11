 const home = r => require.ensure([], () => r(require('../pages/home/home.vue')), 'home');
 const profile = r => require.ensure([], () => r(require('../pages/profile/profile.vue')), 'profile');
 const login = r => require.ensure([], () => r(require('../pages/login/login.vue')), 'login');
 const register = r => require.ensure([], () => r(require('../pages/register/register.vue')), 'register');
 const article = r => require.ensure([], () => r(require('../pages/article/article.vue')), 'article');
 const articleadd = r => require.ensure([], () => r(require('../pages/article/children/artAdd.vue')), 'articleadd');
 const articlelist = r => require.ensure([], () => r(require('../pages/article/children/artList.vue')), 'articlelist');
 const articlecolumn = r => require.ensure([], () => r(require('../pages/article/children/artColumn.vue')), 'articlecolumn');
 const artdetail = r => require.ensure([], () => r(require('../pages/artdetail/artdetail.vue')), 'artdetail');
 const notfound = r => require.ensure([], () => r(require('../pages/notfound/notfound.vue')), 'notfound');

 export default[
  { path: '/', component: home, meta: { requireAuth: false } },
  { path: '/profile', component: profile, meta: { requireAuth: true } },
  { path: '/login', component: login },
  { path: '/register', component: register },
  { path: '/article', component: article },
  { path: '/artdetail', component: artdetail },
  { path: '/articleadd', component: articleadd },
  { path: '/articlelist', component: articlelist },
  { path: '/articlecolumn', component: articlecolumn },
  { path: '*', component: notfound },
 ];
