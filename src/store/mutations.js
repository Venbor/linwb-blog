export default{
  // 多次登录token保存
  LOGIN: (state, data) => {
    localStorage.token = data;
    state.token = data;
  },
  // 一次登录token保存
  LOGINONCE: (state, data) => {
    sessionStorage.token = data;
    state.token = data;
  },
  // 写入用户信息
  GETUSERINFO: (state, data) => {
    localStorage.userInfo = JSON.stringify(data);
    state.userInfo = data;
  },
  // 退出后token删除
  EXIT: (state) => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    state.token = null;
    state.userInfo = {};
    state.column = '';
  },
  // 选择的栏目状态
  COLUMN: (state, data) => {
    state.columns = data;
  },
};
