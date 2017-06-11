import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  token: sessionStorage.getItem('token') || localStorage.getItem('token') || null,
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
  columns: '',
};

const gentters = {
};

export default new Vuex.Store({
  state, gentters, actions, mutations,
});

