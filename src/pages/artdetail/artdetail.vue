<template>
  <div class='artdetail'>
   <head-top :username='username'></head-top>
    <div class="content-bg">
        <head-nav @checkcolumn='checknav'></head-nav>
         <div class="artcontent">
              <div class="title">
                  <h2>{{title}}</h2>
              </div>
              <div class="info">
                <span>时间：{{updatatime}}</span>
                <span>作者：{{$store.state.userInfo.username}}</span>
                <span>点击：{{hits}}次</span>
              </div>
              <div class="text" v-html='text'>

              </div>
         </div>
         <my-footer></my-footer>
         <loading v-if='isLoading'></loading>
    </div>
  </div>
</template>
<script>
import marked from 'marked';
import highlight from 'highlight.js';
import '../../style/highlight.sublime.css';
import headTop from '../../components/headTop.vue';
import headNav from '../../components/headNav.vue';
import myFooter from '../../components/myFooter.vue';
import loading from '../../components/loading.vue';

export default {
  data() {
    return {
      isLoading: false,
      username: '',
      title: '',
      updatatime: '',
      text: '',
      hits: '',
    };
  },
  components: { headTop, headNav, myFooter, loading },
  mounted: function () {
    this.isLoading = true;
    this.loaddata();
  },
  methods: {
    loaddata: function () {
      const _this = this;
      this.$http.post('/', { act: 'articledetail', aid: this.$route.query.aid }).then((response) => {
        _this.title = response.data.data.title;
        _this.updatatime = response.data.data.updatatime;
        _this.text = _this.rendermaked(response.data.data.text);
        _this.hits = response.data.data.hits;
        this.isLoading = false;
      }).catch((err) => { console.error(err); });
    },
    checknav: function () {
      this.$router.push('/');
    },
    rendermaked: function (plainText) {
      return marked(plainText, {
        renderer: new marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: true,
        smartLists: true,
        smartypants: true,
        highlight: function (code) {
          return highlight.highlightAuto(code).value;
        },
      });
    },
  },
};
</script>
<style>
.artdetail{background-color: #f4e4c0}
.content-bg{ background: url(../../assets/images/banner.jpg) no-repeat center top; }
.artcontent{margin:0 auto; width:1080px;padding:10px 32px 32px 32px;border-radius: 4px; background-color: #fffbf0; min-height: 1100px;}
.artcontent .title {height: 56px; line-height: 56px;text-align: center; overflow: hidden;padding-top: 10px;}
.artcontent .title h2 {font-size: 24px; color: #2b2b2b;}
.artcontent .info {height: 24px; line-height: 17px;text-align: center; overflow: hidden; color: #666;}
.artcontent .info span{margin-left: 8px;margin-right: 3px;color: #999;font-size: 12px;}
.artcontent .text{overflow: hidden;}
</style>
