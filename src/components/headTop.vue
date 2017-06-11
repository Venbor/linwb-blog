<template>
    <div class="header">
       <div class="hd">
            <div class="hd-left">
              <el-input  size="small" placeholder="请输入要搜索的内容" icon="search" v-model="searchtxt" :on-icon-click="search"></el-input>
            </div>
             <div class="hd-right">
                  <span class="hd-username">欢迎你,{{username}}</span>
                  <span class="hd-exit" @click="exit">退出</span>
            </div>
        </div>
    </div>
</template>
<script>
   export default{
     data() {
       return {
         searchtxt: '',
       };
     },
     computed: {
       username: function () { return this.$store.state.userInfo.username; },
     },
     methods: {
       search: function () {
       },
       exit: function () {
         this.$store.commit('EXIT');
         this.$router.push('/login');
       },
     },
};
</script>
<style>
.header{height: 40px; background-color: rgba(64,64,64,0.6); position: fixed; top: 0;width: 100%; z-index: 10}
.hd{width: 1080px; margin: 0 auto;}
.hd .hd-left{float: left; padding-top: 5px;width: 280px;}
.hd .hd-right{line-height: 40px;float:right; color: #fff;font-size: 14px;}
.hd-username{color:#fff; margin-right:10px;cursor: pointer;}
.hd-exit{color:#ff5722; cursor:pointer}
</style>
