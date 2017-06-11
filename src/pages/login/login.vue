<template>
<div class='bg'>
    <div class='signin-bg'></div>
	<div class="signin">
       <div class="hd-bg">
      		<div class="signin-head">
      		     <img src="../../assets/images/head.jpg" class="img-circle">
      		</div>
        </div>
  		  <div class="form-signin">
  		      <el-input v-model="form.email" placeholder="请输入注册邮箱" :maxlength="20"></el-input>
  	        <el-input type="password" v-model="form.password" placeholder="请输入密码" style='margin:16px 0;' :maxlength="20"></el-input>
  	        <el-checkbox v-model="form.checked">7天免登录</el-checkbox>
            <router-link to="/register" class='link'>立即注册</router-link>
  		   	 <el-button type="info" style='width:100%;margin-top:14px;' @click.native='signin' :loading="load.status">{{load.msg}}</el-button>
  	    </div>
	</div>
</div>
</template>
<script>
  export default{
    data() {
      return {
        form: {
          email: '',
          password: '',
          checked: '',
          act: 'signin',
        },
        load: {
          status: false,
          msg: '登录',
        },
      };
    },
    methods: {
      signin: function () {
        const _this = this;
        const reg = /^[a-z0-9](\w|\.|-)*@([a-z0-9]+-?[a-z0-9]+\.){1,3}[a-z]{2,4}$/i;
        if (!this.form.email) {
          this.$message({ message: '邮箱不能为空!', type: 'warning' });
          return;
        }
        if (this.form.email.match(reg) == null) {
          this.$message({ message: '邮箱格式不正确!', type: 'warning' });
          return;
        }
        if (!this.form.password) {
          this.$message({ message: '密码不能为空!', type: 'warning' });
          return;
        }
        this.load.status = true;
        this.load.msg = '登录中...';
          // 表单提交
        this.$http.post('/', this.form)
                  .then((response) => {
                    if (response.data.result) {
                      if (response.data.checked) {
                        _this.$store.commit('LOGIN', response.data.token);
                      } else {
                        _this.$store.commit('LOGINONCE', response.data.token);
                      }
                      _this.$message({ message: '恭喜你，登录成功！', type: 'success' });
                      _this.$router.push({ path: '/' });
                    } else {
                      _this.$message.error(response.data.msg);
                    }
                    _this.load.status = false;
                    _this.load.msg = '登录';
                  }).catch((error) => { console.error(error); });
      },
    },
  };
</script>
<style>
.hd-bg{background: url(../../assets/images/hd-bg.png)no-repeat right 35px;}
.bg{position:absolute;top:0;left:0;right:0;bottom:0;overflow: hidden;}
.signin-bg{position:absolute;top:0;left:0;right:0;bottom:0;background: url(../../assets/images/signin-bg.jpg) no-repeat;background-size: cover; opacity: 0.3; animation: myfirst 50s linear infinite alternate;
-webkit-animation: myfirst 50s linear infinite alternate;width: 100%;}
.signin{border-radius:3px; overflow: hidden; width: 477px;height: 406px;background:#6bcbca; margin: 0 auto;position: absolute;top: 50%;left: 50%;margin-top: -203px;margin-left: -238px;}
.signin-head{margin: 0 auto;padding:30px 0;width: 120px;}
.signin-head img{border-radius: 50%;-ms-border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%; height: 120px;width: 120px;}
.form-signin{background-color: #ededed;padding: 32px 65px 20px 65px;margin: 0 auto;}
.form-signin .link{float: right;font-size: 14px;margin-right: 10px;}
@-webkit-keyframes myfirst {
  from { -webkit-transform: scale(1) translate(0px);
-moz-transform: scale(1) translate(0px);
-ms-transform: scale(1) translate(0px);
-o-transform: scale(1) translate(0px);
transform: scale(1) translate(0px); }
  to { -webkit-transform: scale(1.5) translate(50px);
-moz-transform: scale(1.5) translate(50px);
-ms-transform: scale(1.5) translate(50px);
-o-transform: scale(1.5) translate(50px);
transform: scale(1.5) translate(50px); }
}
@keyframes myfirst {
  from { -webkit-transform: scale(1) translate(0px);
-moz-transform: scale(1) translate(0px);
-ms-transform: scale(1) translate(0px);
-o-transform: scale(1) translate(0px);
transform: scale(1) translate(0px); }
  to { -webkit-transform: scale(1.5) translate(50px);
-moz-transform: scale(1.5) translate(50px);
-ms-transform: scale(1.5) translate(50px);
-o-transform: scale(1.5) translate(50px);
transform: scale(1.5) translate(50px); }
}
</style>
