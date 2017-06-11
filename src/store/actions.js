import axios from '../config/ajax_cfg';

export default{
  //  获取用户信息
  getUserData: function ({ commit }) {
    axios.post('/', { act: 'userdetail' }).then((res) => {
      commit('GETUSERINFO', res.data.data);
    }).catch((err) => { console.error(err); });
  },
};
