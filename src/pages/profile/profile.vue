<template>
<div>
  <head-top :username='username'></head-top>
   <div class="profile">

   <div class="profile-t">
      <h1>个人简介</h1>
   </div>
   <div class="profile-c">
	   <div class="profile-l">
	   	 <el-form ref="form" label-position="top" :model="form" style="padding: 10px 80px 0 0;">
			  <el-form-item label="昵称">
			    <el-input v-model="form.username" :maxlength="8"></el-input>
			  </el-form-item>
			  <el-form-item label="注册邮箱">
			    <el-input v-model="email" :disabled="true" :maxlength="20"></el-input>
			  </el-form-item>
			  <el-form-item label="个性签名">
			    <el-input type="textarea" v-model="form.signature" :maxlength="30"></el-input>
			  </el-form-item>
			  <el-form-item label="个人介绍">
			    <el-input type="textarea" v-model="form.introduce" :maxlength="22"></el-input>
			  </el-form-item>
			  <el-form-item label="城市地址">
			    <el-input v-model="form.address" :maxlength="18"></el-input>
			  </el-form-item>
		</el-form>
         <div class="submit">
          <el-button type="primary" @click.native='submit'>保存修改</el-button>
         </div>
         <div class="picture">
         	<h1>用户头像</h1>
            <el-upload
			  class="avatar-uploader"
			  action="http://www.venbor.cn/api"
			  :data='{act:"updataimg"}'
			  :show-file-list="false"
			  :on-success="handleAvatarSuccess"
			  :before-upload="beforeAvatarUpload">
			  <img v-if="imageUrl" :src="imageUrl" class="avatar">
			  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
         </div>
	   </div>
	   <div class="profile-r">

	   </div>
   </div>
 </div>
</div>
</template>
<script>
import headTop from '../../components/headTop.vue';

export default{
  data() {
    return {
      email: '',
      username: '',
      form: {
        act: 'updatauserdetail',
        username: '',
        signature: '',
        introduce: '',
        imgurl: '',
        address: '',
      },
      imageUrl: '',
    };
  },
  components: { headTop },
  mounted: function () {
    this.loaddata();
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.form.imgurl = res.path;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    loaddata: function () {
      const _this = this;
      this.$http.post('/', { act: 'userdetail' })
                  .then((response) => {
                    if (response.data.result) {
                      _this.form.username = response.data.data.username;
                      _this.form.signature = response.data.data.signature;
                      _this.form.introduce = response.data.data.introduce;
                      _this.form.address = response.data.data.address;
                      _this.email = response.data.data.email;
                      _this.username = response.data.data.username;
                      _this.imageUrl = response.data.data.imgurl;
                    } else {
                      _this.$message.error(response.data.msg);
                    }
                  }).catch(() => {
                    _this.$message.error('请求有误');
                  });
    },
    submit: function () {
      const _this = this;
      this.$http.post('/', this.form)
                  .then((response) => {
                    if (response.data.result) {
                      _this.$message({
                        message: response.data.msg,
                        type: 'success',
                      });
                      _this.$router.push('/');
                    } else {
                      _this.$message.error(response.data.msg);
                    }
                  }).catch(() => {
                    _this.$message.error('请求有误');
                  });
    },
  },
};
</script>
<style>
.profile{width: 1080px; margin:0 auto;padding-top: 40px; }
.profile-t{ padding-bottom: 8px; border-bottom: 1px #e1e4e8 solid;height: 50px;}
.profile-t h1{font-size: 20px;line-height:56px;color: #24292e; font-weight: bold;}
.profile-c{position: relative;}
.profile-c .el-form-item{margin-bottom: 16px;}
.profile-c .submit{position: absolute;bottom: 0; left: 40%;}
.profile-c .picture{position: absolute; top: 0;right: 90px; width: 200px;height: 500px;}
.profile-c .picture h1{font-weight: normal;font-size: 16px;line-height:50px;color: #24292e;}
.profile-l{width: 1080px;padding:16px 400px 80px 2px; position: relative; }
.profile-r{display: none; width: 280px;height: 1200px;position: absolute;top: 0; right: 0;}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
