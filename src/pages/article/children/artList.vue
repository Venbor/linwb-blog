<template>
<div>
  <head-top></head-top>
      <div class="homecontent">
          <left-guide></left-guide>
          <div class="homecontent-r">
           <div class="column">
          <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="title" label="文章标题" width="380"></el-table-column>
              <el-table-column prop="columns" label="栏目" width="120"></el-table-column>
              <el-table-column prop="limits" label="权限" width="80"></el-table-column>
              <el-table-column prop="updatatime" label="更新时间" width="186"></el-table-column>
              <el-table-column label="操作">
                    <template scope="scope">
                      <el-button
                        size="small"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                      <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
              </el-table-column>
           </el-table>
           <div class="artpage">
              <el-pagination layout="prev, pager, next" :page-size='20' :total="total" @current-change='currentpage'></el-pagination>
           </div>
       <!-- 文章修改弹窗 -->
         <el-dialog title="文章修改" v-model="dialogart" size='large'>
            <art-edit ref="artdetail" @resdata='rescall'></art-edit>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogart = false">取 消</el-button>
              <el-button type="primary" @click="submitedit">确 定</el-button>
            </div>
        </el-dialog>

</div>
      </div>
</div>

</div>
</template>
<script>
import artEdit from './artEdit.vue';
import headTop from '../../../components/headTop.vue';
import leftGuide from './leftGuide.vue';

export default{
  data() {
    return {
      tableData: [],
      total: null,
      page: 1,
      dialogart: false,
      data: '',
    };
  },
  components: { artEdit, headTop, leftGuide },
  mounted: function () {
    this.loaddata();
  },
  methods: {
    loaddata: function () {
      const _this = this;
      this.$http.post('/', { act: 'articlelist', pagesize: 20, page: this.page }).then((res) => {
        _this.tableData = res.data.data;
        _this.total = res.data.total;
      })
                  .catch((error) => {
                    console.error(error);
                  });
    },
    currentpage: function (value) {
      this.page = value;
      this.loaddata();
    },
    submitedit: function () {
      this.$refs.artdetail.$emit('submitedit');
    },
    rescall: function (data) {
      if (data.result) {
        this.$message({ message: '文章更新成功！', type: 'success' });
        this.dialogart = false;
        this.loaddata();
      }
    },
    handleEdit: function (index, item) {
      const _this = this;
      this.dialogart = true;
      this.$http.post('/', {
        act: 'articledetail',
        aid: item.aid,
      }).then((res) => {
        const data = res.data.data;
        data.aid = item.aid;
        _this.$refs.artdetail.$emit('editarticle', data);
      }).catch((err) => { console.error(err); });
    },
    handleDelete: function (index, item) {
      const _this = this;
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.post('/', {
          act: 'articledelete',
          aid: item.aid,
          columns: item.columns,
        }).then((res) => {
          if (res.data.result) {
            _this.$message({ message: '文章删除成功！', type: 'success' });
            _this.loaddata();
          } else {
            _this.$message.error(res.data.msg);
          }
        }).catch((error) => {
          console.error(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },

  },
};
</script>
<style>
.artpage{text-align: center;padding-top: 10px;height: 40px;}
.homecontent{width: 1080px;margin: 0 auto;padding-top: 44px;}
.homecontent-r{width:932px; padding:8px 8px 0 8px;border: 1px solid #dfe6ec; margin-left: 146px; box-sizing: border-box;min-height: 900px;}
</style>
