<template>
<div>
  <head-top></head-top>
      <div class="homecontent">
          <div class="homecontent-c">
            <div class="artadd">
         <el-form ref="form" :model="form" label-width="80px">
                 <el-row style="height:36px;">
                    <el-col :span="16" >
                        <el-form-item label="标题">
                          <el-input v-model="form.title" :maxlength="40"></el-input>
                        </el-form-item>
                    </el-col>
                  </el-row>
                 <el-row style="height:90px;">
                    <el-col :span="16" >
    <el-form-item label="内容摘要"><el-input type="textarea" v-model="form.digest" :maxlength="120"></el-input></el-form-item>
                    </el-col>
                </el-row>
                 <el-row style="height:52px;">
                     <el-col :span="10" >
                      <el-form-item label="选择栏目">
                        <el-dropdown >
                                <el-button>
                                  {{form.columns}}<i class="el-icon-caret-bottom el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown" style="width:140px;">
                                  <el-dropdown-item v-for="item in columnlist" :key="item.title" @click.native="selectnav(item)">{{item.title}}</el-dropdown-item>
                                </el-dropdown-menu>
                           </el-dropdown>
                         </el-form-item>
                      </el-col>
                       <el-col :span="2" >
                            <span style="line-height: 36px;font-size: 14px;color: #666;cursor: pointer;" @click='help'>语法帮助</span>
                       </el-col>
                      <el-col :span="4" :offset='6'>
                        <el-button  type="info" @click="submit">立即发布</el-button>
                      </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                     <textarea id='editor'></textarea>
                    </el-col>
                </el-row>


         </el-form>

      <!-- 帮助窗口 -->
       <el-dialog title="Markdown语法帮助" v-model="dialogFormVisible">
           <div class="helpcode">
               <h1>强调</h1>
                     <p>**bold**  加粗  &emsp;  *italics*  斜体  &emsp;  ~strikethrough~~  加删除线</p>
              <h1>标题头</h1>
                    <p># Big header 大标题 &emsp;&emsp; ## Medium header 中等标题</p>
                    <p>### Small header  小标题 &emsp;&emsp; #### Tiny header  微小标题</p>
              <h1>列表</h1>
                    <p>* Generic list item &emsp;&emsp; 1. Numbered list item</p>
                    <p>* Generic list item &emsp;&emsp; 2. Numbered list item</p>
                    <p>* Generic list item &emsp;&emsp; 3. Numbered list item</p>
              <h1>链接</h1>
                    <p>[Text to display](http://www.example.com)</p>
              <h1>报价</h1>
                    <p>> This is a quote.</p>
              <h1>图片</h1>
                    <p>![](http://www.example.com/image.jpg)</p>
              <h1>表格</h1>
                  <p>| Column 1 | Column 2 | Column 3 |</p>
                  <p>| -------- | -------- | -------- |</p>
                  <p>| John     | Doe      | Male     |</p>
                  <p>| Mary     | Smith    | Female   |</p>
              <h1>其他表格</h1>
                  <p>| Column 1 | Column 2 | Column 3 |</p>
                  <p>| -------- | -------- | -------- |</p>
                  <p>| John | Doe | Male |</p>
                  <p>| Mary | Smith | Female |</p>
             <h1>代码高亮</h1>
                  <p>```</p>
                  <p>var example = "hello!";</p>
                  <p>alert(example);</p>
                  <p> ```</p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
      </el-dialog>
</div>
          </div>
      </div>
</div>


</template>
<script>
import marked from 'marked';
import highlight from 'highlight.js';
import SimpleMDE from 'simplemde';
import headTop from '../../../components/headTop.vue';
import '../../../style/simplemde.min.css';
import '../../../style/highlight.sublime.css';

export default{
  data() {
    return {
      form: {
        act: 'addarticle',
        title: '',
        digest: '',
        columns: '选择栏目',
        contents: '',
      },
      columnlist: [],
      dialogFormVisible: false,
    };
  },
  components: { headTop },
  mounted: function () {
    this.loadcolumn();
    const _this = this;
    // simplemde参数配置
    const smde = new SimpleMDE({
      element: document.getElementById('editor'),
      autofocus: true, // 自动获取焦点
      blockStyles: {  // markdown表现形式
                 // bold: "__",   //默认**
                 // italic: "_",  //默认*
                 // code:``       //默认``
      },
      hideIcons: ['fullscreen', 'side-by-side'],
      indentWithTabs: false, // 缩进使用空格非制表符
      placeholder: '开启你的成长之路...(注意随时查看预览效果)....',
      parsingConfig: {
        allowAtxHeaderWithoutSpace: true,
        strikethrough: true,
        underscoresBreakWords: true,
      },
      previewRender: function (plainText) { // 解析纯文本markdown和html的自定义函数,预览时调用
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
    });
    // 通过捕获changes事件获取内容
    smde.codemirror.on('change', () => {
      const text = smde.value();
      _this.form.contents = text;
    });
  },
  methods: {
    loadcolumn: function () {
      const _this = this;
      this.$http.post('/', { act: 'userdetail' }).then((res) => {
        _this.columnlist = res.data.data.nav;
      })
                  .catch((err) => {
                    console.error(err);
                  });
    },
    selectnav: function (item) {
      this.form.columns = item.title;
    },
    help: function () {
      this.dialogFormVisible = true;
    },
    submit: function () {
      const _this = this;
      if (!this.form.title || this.form.title.length > 40) {
        this.$message({ message: '标题不能为空且长度小于40', type: 'warning' });
        return;
      }
      if (!this.form.digest || this.form.digest.length > 120) {
        this.$message({ message: '摘要不能为空且长度小于120', type: 'warning' });
        return;
      }
      if (!this.form.columns || this.form.columns === '选择栏目') {
        this.$message({ message: '栏目不能为空', type: 'warning' });
        return;
      }
      if (!this.form.contents) {
        this.$message({ message: '内容不能为空', type: 'warning' });
        return;
      }
      this.$http.post('/', this.form).then((res) => {
        if (res.data.result) {
          _this.dialogFormVisible = false;
          _this.$message({ message: res.data.msg, type: 'success' });
          _this.$router.push('/');
        } else {
          _this.$message.error(res.data.msg);
        }
      })
                  .catch((err) => {
                    console.error(err);
                  });
    },
  },
};
</script>
<style>
.homecontent{width: 1080px;margin: 0 auto;padding-top: 44px;}
.homecontent-c{width:1078px; padding:8px 8px 0 8px;border: 1px solid #dfe6ec;box-sizing: border-box;min-height: 900px;}
.artadd .el-row{ width: 100%;}
.artadd{padding-top: 20px;}
.CodeMirror, .CodeMirror-scroll {
    min-height: 570px !important;
}
.helpcode h1{font-size: 15px;}
.helpcode p{text-indent: 24px;}
</style>
