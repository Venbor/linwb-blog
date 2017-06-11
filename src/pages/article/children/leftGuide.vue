<template>
<div class="left-guide">
      <dl>
        <dt>文章管理</dt>
        <!--  <dd :class="{dit:current=='artColumn'}" @click='column'>栏目管理</dd>
         <dd :class="{dit:current=='artList'}" @click='list'>文章列表</dd>
         <dd :class="{dit:current=='artAdd'}" @click='add'>添加文章</dd> -->
      </dl>
</div>
</template>
<script>
export default{
  data() {
    return {
      username: 'aaaa',
      current: 'artColumn',
    };
  },
  mounted: function () {

  },
  methods: {
    column: function () {
      this.current = 'artColumn';
      this.changeview();
    },
    list: function () {
      this.current = 'artList';
      this.changeview();
    },
    add: function () {
      this.current = 'artAdd';
      this.changeview();
    },
    changeview: function () {
      const view = this.current;
      this.$emit('change', view);
    },


  },
};
</script>
<style>
.left-guide{height: 900px;background-color: #f2f2f2;margin-bottom: 2px; float: left; width: 140px;border: 1px solid #dfe6ec; font-size: 16px; font-family: 'Microsoft YaHei';}
.left-guide dl dt{ font-weight: bold;
   background-color: #eef1f6; text-align: center;line-height: 40px; height: 40px; border-bottom: 1px solid #dfe6ec;

 }
.left-guide dl dd{ font-size: 15px;
      background-color: #fff;cursor: pointer;text-align: center;line-height: 40px;border-bottom: 1px solid #dfe6ec;
 }
.left-guide dl dd.dit{ color:#20a0ff;border-right: 5px solid #ffcc00;border-left: 5px solid #fbfdff; border-top: 0; border-bottom: 1px solid #dfe6ec;box-sizing: border-box;
 }

</style>
