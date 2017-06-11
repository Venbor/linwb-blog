<template>
  <div class='home'>
   <head-top></head-top>
    <div class="content-bg">
        <head-nav @checkcolumn='checklist'></head-nav>
         <div class="content">
              <left-intro @openroom="alertroom" :username='userInfo.username' :introduce='userInfo.introduce' :imgurl="userInfo.imgurl"></left-intro>
              <article-list ref='artlist'></article-list>
         </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import headTop from '../../components/headTop.vue';
import headNav from '../../components/headNav.vue';
import leftIntro from '../../components/leftIntro.vue';
import articleList from '../../components/articleList.vue';
import myFooter from '../../components/myFooter.vue';

export default {
  data() {
    return {
      room: false,
    };
  },
  components: { headTop, headNav, leftIntro, articleList, myFooter },
  computed: {
    ...mapState(['userInfo', 'column']),
  },
  mounted: function () {
    this.getUserData();
  },
  methods: {
    ...mapActions(['getUserData']),
    checklist: function () {
      this.$refs.artlist.$emit('checklist');
    },
    alertroom: function () {
      if (this.room === true) {
        return;
      }
      this.room = true;
      this.$refs.gotocline.$emit('gotocline');
    },
    closewin: function () {
      this.room = false;
    },
  },
};
</script>
<style>
.home{background-color: #f4e4c0}
.content-bg{ background: url(../../assets/images/banner.jpg) no-repeat center top; }
.content{margin:0 auto; width:1080px;}
</style>
