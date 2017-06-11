<template>
<div>
  <head-top></head-top>
      <div class="homecontent">
          <div class="homecontent-c">
            <div class="column">
          <div class='add'>
             <el-button icon="plus" type="primary" @click.native='addcolumn'>新增栏目</el-button>
          </div>
          <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="title" label="栏目名称" width="240"></el-table-column>
              <el-table-column prop="num" label="栏目文档数" width="114"></el-table-column>
              <el-table-column prop="weight" label="栏目权重" width="94"></el-table-column>
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
          <!--添加和修改弹窗 -->
             <el-dialog :title="dialogtitle" v-model="dialogFormVisible" size='tiny'>
            <el-form :model="form">
               <el-row>
                  <el-col :span="20" >
                      <el-form-item label="栏目名称" :label-width="formLabelWidth">
                        <el-input v-model="form.title" auto-complete="off" :maxlength="12"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
               <el-row>
                  <el-col :span="12" >
                      <el-form-item label="栏目权重" :label-width="formLabelWidth">
                        <el-input v-model="form.weight" auto-complete="off" :maxlength="2"></el-input>
                      </el-form-item>
                  </el-col>
               </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submit" >确 定</el-button>
            </div>
          </el-dialog>
          </div>
      </div>
</div>



</div>
</template>
<script>
import headTop from '../../../components/headTop.vue';

export default{
  data() {
    return {
      tableData: [],
      dialogtitle: '',
      formLabelWidth: '100px',
      dialogFormVisible: false,
      form: {
        title: '',
        weight: null,
        oldtitle: '',
        num: null,
      },

    };
  },
  components: { headTop },
  mounted: function () {
    this.loaddata();
  },
  methods: {
    loaddata: function () {
      const _this = this;
      this.$http.post('/', { act: 'userdetail' }).then((res) => {
        _this.tableData = res.data.data.nav;
      })
                  .catch((error) => {
                    console.error(error);
                  });
    },
    addcolumn: function () {
      this.reset();
      this.dialogtitle = '新增栏目';
      this.dialogFormVisible = true;
      this.form.act = 'addnav';
    },
    submit: function () {
      const _this = this;
      if (!this.form.title) {
        this.$message({ message: '栏目不能为空', type: 'warning' });
        return;
      }
      if (!this.form.weight) {
        this.$message({ message: '权重不能为空', type: 'warning' });
        return;
      }
      this.$http.post('/', this.form).then((res) => {
        if (res.data.result) {
          _this.dialogFormVisible = false;
          _this.$message({ message: res.data.msg, type: 'success' });
          _this.loaddata();
        } else {
          _this.$message.error(res.data.msg);
        }
      })
                  .catch((error) => {
                    console.error(error);
                  });
    },
    handleEdit: function (index, item) {
      this.reset();
      this.dialogtitle = '编辑栏目';
      this.form.title = item.title;
      this.form.weight = item.weight;
      this.form.oldtitle = item.title;
      this.form.num = item.num;
      this.dialogFormVisible = true;
      this.form.act = 'updatanav';
    },
    handleDelete: function (index, item) {
      const _this = this;
      this.$confirm('此操作将永久删除该栏目及该栏目下的所有文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.post('/', {
          act: 'deletenav',
          title: item.title,
        }).then((res) => {
          if (res.data.result) {
            _this.$message({ message: '栏目及文章删除成功！', type: 'success' });
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
    reset: function () {
      this.form.title = '';
      this.form.weight = '';
      this.dialogtitle = '';
      this.form.oldtitle = '';
    },

  },
};
</script>
<style>
.column .add{ padding:12px; }
.homecontent{width: 1080px;margin: 0 auto;padding-top: 44px;}
.homecontent-c{width:1078px; padding:8px 8px 0 8px;border: 1px solid #dfe6ec; box-sizing: border-box;min-height: 900px;}
</style>
