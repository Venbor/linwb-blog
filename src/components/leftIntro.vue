<template>
	<div class="leftguide">
		<h1>个人资料</h1>
        <div class='top-image'>
             <img :src='imgurl' alt="">
        </div>
           <p>{{username}}</p>
            <div class='work'>
            <img src="../assets/images/icon_l.png" class="work-l">
            <img src="../assets/images/icon_r.png" class="work-r">
              <div class="expert_c_b">{{introduce}}</div>
            </div>

      <div class="about">
          <div class="about-top">
            <router-link to="/profile">
              <el-badge class="item">
      			     <el-button size="small">&ensp;个人信息&ensp;</el-button>
      			 </el-badge>
            </router-link>
             <router-link to="/articlecolumn">
      			 <el-badge class="item" style='margin-left:20px;'>
      			     <el-button size="small">&ensp;栏目管理&ensp;</el-button>
      		  	</el-badge>
               </router-link>
    			</div>
    			<div class="about-top">
            <router-link to="/articlelist">
      			<el-badge class="item" >
      			      <el-button size="small">&ensp;文章管理&ensp;</el-button>
      			</el-badge>
            </router-link>
             <router-link to="/articleadd">
      			<el-badge class="item" style='margin-left:20px;'>
      			     <el-button size="small">&ensp;发布文章&ensp;</el-button>
      			</el-badge>
             </router-link>
      </div>
        </div>
	</div>
</template>
<script>
   export default{
     props: {
       username: String,
       introduce: String,
       imgurl: String,
     },
  data() {
       return {
       };
  },
  methods: {
  },
};
</script>

<style>
.work{position: relative;padding: 4px 20px;margin:10px; text-align: center;}
.work-l{position: absolute;left: 0;top: 0;}
.work-r{position: absolute;right: 0;bottom: 0;}
.leftguide{float: left;font-size: 14px;display: inline-block;
width: 230px;height: 872px;background-color:#fff;border-radius: 2px;overflow: hidden;}
.leftguide>h1{font-weight: normal;line-height: 32px;font-weight: bold; font-size: 14px; background-color:#ededed; padding-left:12px; }
.top-image{padding:20px;text-align: center; }
.top-image img{ display: inline-block;width: 170px;height: 170px;border: 1px solid #999;border-radius: 50%;overflow: hidden; }
.leftguide>p{text-align: center;font-size: 16px;margin-bottom: 12px}
.about{text-align: center; border-top: 1px dotted #dedede;border-bottom: 1px dotted #dedede;padding: 14px 0; margin:0 12px;}
.about-top{margin-bottom: 12px;}
.guide{margin-top: 18px; padding: 10px;}
</style>
