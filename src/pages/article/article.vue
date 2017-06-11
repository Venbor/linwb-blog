<template>
<div>
  <head-top :username='username' ></head-top>
      <div class="homecontent">
          <left-guide @change='changeview'></left-guide>
          <div class="homecontent-r">
            <component :is="currentView"></component>
          </div>
      </div>
</div>
</template>
<script>
import headTop from '../../components/headTop.vue';
import leftGuide from './children/leftGuide.vue';
import artColumn from './children/artColumn.vue';
import artList from './children/artList.vue';
import artAdd from './children/artAdd.vue';

export default{
  data() {
    return {
      username: 'aaaa',
      currentView: 'artColumn',
    };
  },
  components: { headTop, leftGuide, artColumn, artList, artAdd },
  mounted: function () {

  },
  methods: {
    changeview: function (view) {
      this.currentView = view;
    },
  },
};
</script>
<style>
.homecontent{width: 1080px;margin: 0 auto;padding-top: 44px;}
.homecontent-r{width:932px; padding:8px 8px 0 8px;border: 1px solid #dfe6ec; margin-left: 146px; box-sizing: border-box;min-height: 900px;}
</style>
