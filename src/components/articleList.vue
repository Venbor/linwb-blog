<template>
<div class="bloglist">
    <img src="../assets/images/news_head_right.png">
    <div class="blog-guide">最新文章</div>
    <div class="blogs" v-for='item in datalist' >
          <router-link :to="{path:'/artdetail',query:{aid:item.aid}}">
                <h3><a href="javascript:void(0)"><span>[{{item.columns}}]</span> {{item.title}}</a></h3>
                <p class="digest">{{item.digest}}</p>
                <p class="autor">
                    <span class="f_l"><a href="javascript:void(0)">作者:{{$store.state.userInfo.username}}</a></span>
                   <!--  <span class="f_l"> 浏览({{item.hits}})</span> -->
                    <span class="f_r"><i class="el-icon-date"></i> {{item.updatatime}}</span>
                </p>
          </router-link>
   </div>
    <div class="page">
          <el-pagination layout="prev, pager, next" :page-size='12' :total="total" @current-change='currentpage'></el-pagination>
    </div>
     <loading v-if='isLoading'></loading>
</div>
</template>
<script>
import loading from './loading.vue';

export default{
  data() {
    return {
      datalist: [],
      total: 0,
      page: 1,
      isLoading: false,
    };
  },
  components: { loading },
  created: function () {
    const _this = this;
    this.$on('checklist', function () {
      this.isLoading = true;
      this.total = 0;
      this.page = 1;
      _this.loaddata();
    });
  },
  mounted: function () {
    this.isLoading = true;
    this.loaddata();
  },
  methods: {
   // 文章列表加载
    loaddata: function () {
      const _this = this;
      this.$http.post('/', { act: 'articlelist', columns: this.$store.state.columns, page: this.page }).then((response) => {
        _this.datalist = response.data.data;
        _this.total = response.data.total;
        _this.isLoading = false;
      }).catch((err) => { console.error(err); });
    },
    // 切换分页
    currentpage: function (value) {
      this.page = value;
      this.loaddata();
    },
  },
};
</script>

<style>
.blog-guide{border-bottom: 1px dotted;height: 32px;line-height: 32px;margin:0  0 16px 4px;display: inline-block;font-size: 15px; font-weight: bold;width: 100%;}
.blogs{padding:8px 22px;position:relative; border-bottom: #BFAB86 1px solid;line-height: 20px;color: #756F71; overflow: hidden;}
.blogs:hover{background-color: #fff;}
.blogs h3 {font-size: 15px; font-weight: bold;}
.blogs h3 a {color: #474645; }
.blogs .digest{font-size: 13px;text-indent: 20px; color: #777777;}
.blogs a{display: block;color: #838383;}
.autor {clear: both;display:block; color: #838383; margin-top: 6px;}
.autor span {margin: 0 26px 0 0;}
.autor span.f_r{float: right;}
.autor span.f_l{float: left;}
.page{text-align: center;padding-top: 20px;}
.bloglist{
  border-radius: 2px;
	font-size: 14px;
	display: inline-block;
	width: 840px;
	margin-left:10px;
	color:#666;
	background-color: #fff;
	padding:12px;
   background-color: #fffbf0;
	color:#666;
	position: relative;
  min-height: 872px;
}
.news ul li{height: 34px;border-bottom: 1px dotted #ccc;line-height: 34px;text-indent: 22px;font-size: 12px;
}
.news ul li a{    color: #666;
    display: block;
    width: 304;
    height: 34px;
    background: url(http://www.linwb.cn/images/qq/inlist01.gif) no-repeat;
    position: relative;}
 .news ul li h1{
 	    line-height: 34px;
    text-indent: 22px;
    font-size: 13px;
    color: #666;
    font-weight: 300;
}
.bloglist>img{position:absolute;top: -11px; right: -8px; }
.bloglist .blogs h3 span{color: #ff5722}
.news ul li span{
     position: absolute;
    right: 0;
    top: 0;
    }
.news ul li a:hover{background:url(http://www.linwb.cn/images/qq/inlist02.gif) no-repeat;}
.news ul li:hover a h1{color: blue;}

</style>
