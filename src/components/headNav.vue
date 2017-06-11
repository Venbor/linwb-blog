<template>
  <div class="boxnav">
	 <div class="box">
		<div class="title">
            <h1>{{userInfo.username}}的个人主页</h1>
            <p>{{userInfo.signature}}</p>
        </div>
     </div>
     <div class="nav">
          <ul>
	          <li v-bind:class="{dit:columns==''}" @click="checkhome">网站首页</li>
	          <li v-for="item in userInfo.nav" :key="item.title" v-bind:class="{dit:columns==item.title}" @click='checkcolumn(item.title)'>{{item.title}}</li>
          </ul>
	</div>
</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default{
  data() {
    return {
      username: '',
      signature: '',
      nav: [],
    };
  },
  computed: {
    ...mapState(['userInfo', 'columns']),
  },
  mounted: function () {
       // this.loaddata();
  },
  methods: {
    ...mapMutations(['COLUMN']),
    checkcolumn: function (value) {
      this.COLUMN(value);
      this.$emit('checkcolumn');
    },
    checkhome: function () {
      this.COLUMN('');
      this.$emit('checkcolumn');

    },
  },
};
</script>

<style>
.boxnav{ padding-top: 40px;}
.box{width: 1080px;margin:0 auto;}
.box .title{ padding: 12px; }
.box .title h1{font-size: 18px;line-height: 40px; }
.box .title p{font-size: 13px; }
.nav{
    width: 100%;
    line-height: 34px;
    height: 34px;
    margin: 0 auto 10px;
    background: rgba(245,245,245,0.4);
    position: relative;
    }
.nav ul{list-style: none; margin:0 auto;width: 1050px; overflow: hidden;}
.nav ul li{float: left; padding:0 18px; margin: 0 2px; text-align: center;display: inline-block; color: #222; font-weight: 500;}
.nav ul li.dit{ background: #fffbf0;border-radius:0px 40px; color: #000000;}
.nav ul li:hover{cursor: pointer; background: #fffbf0; border-radius:0px 40px; color: #000000;}
</style>
