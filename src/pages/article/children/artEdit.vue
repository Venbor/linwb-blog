<template>
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
                                  <el-dropdown-item v-for="item in $store.state.userInfo.nav" :key="item.title" @click.native="selectnav(item)">{{item.title}}</el-dropdown-item>
                                </el-dropdown-menu>
                           </el-dropdown>
                         </el-form-item>
                      </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                     <textarea id='editor'></textarea>
                    </el-col>
                </el-row>
         </el-form>
</div>
</template>
<script>
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import '../../../style/highlight.sublime.css';
import '../../../style/simplemde.min.css';

export default{
  data() {
    return {
      form: {
        act: 'updataarticle',
        aid: '',
        title: '',
        digest: '',
        columns: '选择栏目',
        contents: '',
      },
    };
  },
  mounted: function () {
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
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: true,
          smartLists: true,
          smartypants: false,
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
    this.$on('editarticle', (data) => {
      _this.form.title = data.title;
      _this.form.digest = data.digest;
      _this.form.columns = data.columns;
      _this.form.contents = data.text;
      _this.form.aid = data.aid;
      smde.value(_this.form.contents);
    });

    this.$on('submitedit', function () {
      _this.$http.post('/', this.form).then((res) => {
        _this.$emit('resdata', res.data);
      }).catch((err) => { console.error(err); });
    });
  },
  methods: {
    selectnav: function (item) {
      this.form.columns = item.title;
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
.artadd .el-row{ width: 100%;}
.artadd{padding-top: 20px;}
.CodeMirror, .CodeMirror-scroll {
    min-height: 570px !important;
}
.helpcode h1{font-size: 15px;}
.helpcode p{text-indent: 24px;}
</style>
