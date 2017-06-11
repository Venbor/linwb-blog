<template>
<div class='bg'>
    <div class='signin-bg'></div>
	<div class="register">
       <div class="hd-bg">
      		 <div class="register-head">
      		     <img src="../../assets/images/head.jpg" alt="" class="img-circle">
      		 </div>
       </div>
		<div class="form-register">
		     <el-input v-model.trim="form.username" placeholder="请输入用户名" :maxlength="8"></el-input>
         <el-input v-model.trim="form.email" placeholder="请输入邮箱地址" style='margin:16px 0;' :maxlength="20"></el-input>
	       <el-input type="password" v-model.trim="form.password" placeholder="请输入密码" :maxlength="20"></el-input>
         <el-input type="password" v-model.trim="form.repassword" placeholder="请再次确认密码" style='margin:16px 0;' :maxlength="20"></el-input>
		   	 <el-button type="info" style='width:100%;margin-top:14px;' @click.native='formsubmit' :loading="load.status">{{load.msg}}</el-button>
	    </div>
	</div>
</div>
</template>
<script>
  export default{
    data() {
      return {
        form: {
          username: '',
          email: '',
          password: '',
          repassword: '',
          act: 'register',
        },
        load: {
          status: false,
          msg: '注册',
        },
      };
    },
    methods: {
      formsubmit: function () {
        const _this = this;
        const reg = /^[a-z0-9](\w|\.|-)*@([a-z0-9]+-?[a-z0-9]+\.){1,3}[a-z]{2,4}$/i;
        if (!this.form.username) {
          this.$message({ message: '用户名不能为空!', type: 'warning' });
          return;
        }
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
        if (!this.form.password || this.form.password !== this.form.repassword) {
          this.$message({ message: '您两次输入的密码不相同，请重新输入!', type: 'warning' });
          return;
        }
        this.load.status = true;
        this.load.msg = '注册中...';
          // 表单提交
        this.$http.post('/', this.form)
                  .then((response) => {
                    if (response.data.result) {
                      _this.$message({ message: response.data.msg, type: 'success' });
                      _this.$router.push({ path: '/login' });
                    } else {
                      _this.$message.error(response.data.msg);
                    }
                    _this.load.status = false;
                    _this.load.msg = '注册';
                  }).catch((err) => { console.error(err); });
      },
    },
  };
</script>
<style>
.hd-bg{ background: url(../../assets/images/hd-bg.png)no-repeat right 35px; }
.bg{position:absolute;top:0;left:0;right:0;bottom:0;overflow: hidden;}
.signin-bg{position:absolute;top:0;left:0;right:0;bottom:0;background: url(../../assets/images/signin-bg.jpg) no-repeat;background-size: cover; opacity: 0.3; animation: myfirst 50s linear infinite alternate;
-webkit-animation: myfirst 50s linear infinite alternate;width: 100%;}
.register{border-radius:3px; overflow: hidden; width: 477px;height: 506px;background:#6bcbca;margin: 0 auto;position: absolute;top: 50%;left: 50%;margin-top: -253px;margin-left: -238px;}
.register-head{margin: 0 auto;padding:30px 0;width: 120px;}
.register-head img{border-radius: 50%;-ms-border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%; height: 120px;width: 120px;}
.form-register{background-color: #ededed; padding: 36px 65px 32px 65px;margin: 0 auto;}
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
