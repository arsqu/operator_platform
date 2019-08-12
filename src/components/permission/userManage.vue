<template>
  <div id="comic">
    <div class="queryGroup" v-show="toggleBox.table">
      <!-- 所有漫画 -->
      <div class="comicBox">
        <div class="comic_table_header">
          <el-button type="primary" size="medium" @click="addUser()">新增用户</el-button>
        </div>
        <div class="comic_table">
          <cusTable :tableData="tableData" :tableRule="tableRule" :tableBtn="tableBtn" />
        </div>
      </div>
    </div>
    <!-- 新增表单 -->
    <div class="comicForm" v-show="toggleBox.addform">
      <div class="comic_edit">
        <userForm
          :syncOpt="itemType.syncOpt"
          :formRule="formRule"
          :formData="formData"
          :formBtn="formBtn"
          v-on:reBack="reBack('comic')"
        />
      </div>
    </div>
    <!-- 所有章节 -->
    <div class="queryChapter" v-show="toggleBox.chapterTable">
      <div class="comicBox">
        <div class="comic_table_header">
          <el-button type="primary" size="medium" icon="el-icon-sell
" @click="addChapter()">新增章节</el-button>
        </div>
        <div class="comic_table">
          <!-- 章节列表 -->
          <cusTable
            :tableData="chapterTableData"
            :tableBtn="chapterTableBtn"
            :tableRule="chapterTableRule"
          />
        </div>
        <div class="chapter_btn">
          <el-button type="primary" @click="reBack('comic','m')">返回用户页</el-button>
        </div>
      </div>
    </div>

    <!--  -->
    <div class="comicForm" v-show="toggleBox.addChapter">
      <div class="comic_edit">
        <!-- <chapter
          :formData="chapterForm"
          :syncOpt="itemType.syncOpt"
          :formBtn="chapterFormBtn"
          v-on:reBack="reBack('chapter','chapter')"
        />-->
      </div>
    </div>
  </div>
</template>

<script>
const cusTable = () => import("../module/cusTable");
const userForm = () => import("./userForm");
import Qs from "qs";

export default {
  components: {
    cusTable,
    userForm
  },
  data() {
    return {
      //表格表单的显示状态
      toggleBox: {
        table: true,
        addform: false,
        chapterTable: false,
        addChapter: false
      },
      /************ 章节配置 ************/
      chapterId: null,
      chapterDis: false,
      //表格规则
      chapterTableRule: [
        { label: "id", prop: "id", hide: true },
        { label: "章节id", prop: "mediaId", hide: true },
        { label: "章节名", prop: "title" },
        { label: "章节序号", prop: "orderNo" },
        // { label: "章节描述", prop: "content" },
        { label: "点击数", prop: "clickNum" },
        {
          label: "是否免费",
          prop: "isFree",
          type: "select",
          render: (h, params) => {
            return h("span", params.row.isFree == 0 ? "付费" : "免费");
          }
        }
      ],
      //表格按钮
      chapterTableBtn: {
        label: "操作",
        width: "100%",
        btnGroup: [
          // {
          //   txt: "查看详情", //章节
          //   size: "small",
          //   // hide: true,
          //   method: (data, idx) => {
          //     console.log("查看详情");
          //     // this.formData = Object.assign({}, data);
          //   }
          // },
          // {
          //   txt: "修改章节",
          //   size: "small",
          //   // hide: true,
          //   method: (data, idx) => {
          //     console.log("查看章节");
          //     // console.log(data, idx);
          //   }
          // }
        ]
      },
      //表格数据
      chapterTableData: [],
      chapterForm: {},
      chapterFormBtn: [
        {
          type: "primary",
          func: "submitForm",
          inner: "提交章节"
        },
        { func: "reBack", inner: "返回" }
      ],
      /************ 章节配置 ************/

      /************ 漫画配置 ************/
      //是否禁用表单编辑
      //表格
      tableRule: [
        { label: "id", prop: "id", width: "150", hide: true },
        { label: "用户名", prop: "userName", width: "180" },
        {
          label: "密码",
          prop: "passWord",
          render: (h, param) => {
            return h("span", param.row.passWord.replace(/./g, "*"));
          }
        },
        {
          label: "角色",
          prop: "roleId",
          render: (h, param) => {
            var sel = this.itemType.select;
            return h("span", sel.roleId[param.row.roleId]);
          }
        }
      ],
      //表格按钮
      tableBtn: {
        fixed: "right", //固定右侧
        label: "操作",
        width: "100%",
        btnGroup: [
          {
            txt: "修改用户",
            size: "small",
            method: (data, idx) => {
              // console.log("update");
              var type = this.itemType;
              this.$set(type, "state", "updateUser");
              data = Object.assign({}, data); //克隆
              // console.log(data);
              this.formData = Object.assign({}, data);
              this.toggleState("comic");
            }
          }
          // {
          //   txt: "查看详情",
          //   size: "small",
          //   // hide: true,
          //   method: (data, idx) => {
          //     //查看漫画详情
          //     var tags = [],
          //       group = [];
          //     data = Object.assign({}, data); //克隆
          //     // console.log(tags);
          //     //转化字段
          //     // console.log(this.itemType.syncOpt);
          //     data.tags.map(res => {
          //       tags.push(res.tag);
          //     });
          //     //转化字段
          //     data.group.map(res => {
          //       group.push(res.id);
          //     });
          //     data.tags = tags;
          //     data.group = group;
          //     this.formData = Object.assign({}, data);
          //     this.toggleState("comic");
          //   }
          // },
          // {
          //   txt: "查看章节",
          //   size: "small",
          //   // hide: true,
          //   method: (data, idx) => {
          //     // console.log(data, idx);
          //     this.chapterDis = false;
          //     this.toggleState("chapter", "m");
          //     this.loadChapter(data.id);
          //     //必填项
          //     return;
          //     // this.formItemShow();
          //     // this.toggleState();
          //   }
          // }
        ]
      },
      //表格数据
      tableData: [],
      //表单数据
      formData: {},
      //表单规则
      formRule: [],
      //表单校验
      rules: {},
      //表单按钮
      formBtn: [
        {
          //共用同一个方法,通过 state 状态区分
          type: "primary",
          func: "submitForm",
          inner: "提交"
        },
        { func: "reBack", inner: "返回" }
      ],
      //表单提交参数
      postParam: null, //要提交的参数
      //表单类型
      itemType: {
        //初始化配置
        state: "", //表单编辑状态
        //下拉框配置
        select: {
          roleId: []
        },
        //异步数据
        syncOpt: {
          roleId: []
        }
      }
      /************ 漫画配置 ************/
    };
  },
  created() {},
  mounted() {
    this.init(); //初始化
    this.createFormRule(); //初始化表单
  },
  methods: {
    /*********** 章节初始化 ***********/
    //新增章节
    addChapter() {
      // addChapter
      this.chapterDis = false;
      var type = this.itemType;
      this.$set(type, "state", "addChapter");
      this.chapterForm = {
        mediaId: this.chapterId,
        clickNum: 0,
        isFree: 0
      };
      // console.log("新增章节");
      this.toggleState("chapter", "chapter");
    },
    //查询章节
    loadChapter(mediaId) {
      if (!mediaId) return;
      // id = 1; //测试数据
      this.chapterId = mediaId;
      this.$api.chapterQuery(Qs.stringify({ mediaId })).then(res => {
        // console.log(res);
        // if (res.length > 0) {
        this.chapterTableData = res;
        // }
      });
    },
    /*********** 漫画初始化 ***********/
    init() {
      this.postParam = new FormData(); //提交参数初始化
      //下拉框
      this.loadBread(); //导航
      // this.createFormRule();
      this.loadRole("roleId"); //角色
      this.loadData(); //表格数据
    },
    //加载角色
    loadRole(key) {
      this.$api.roleQuery().then(res => {
        if (res && res.length > 0) {
          var type = this.itemType,
            arr = [],
            sel = {};
          res.map(data => {
            sel[data.id] = data.roleName;
            arr.push({ val: data.id, txt: data.roleName });
          });
          //更新表单
          this.$set(type.select, key, sel);
          this.$set(type.syncOpt, key, arr);
        }
      });
    },
    //请求漫画数据
    loadData() {
      this.$api.userQuery().then(res => {
        if (res) {
          this.tableData = res;
          // this.resetPage(res.page);
        }
        // console.log(res);
      });
    },
    //新增漫画
    addUser() {
      var type = this.itemType,
        opt = type.syncOpt;
      this.$set(type, "state", "add");
      this.formData = {};
      // this.formItemShow();
      this.toggleState("comic");
    },
    //表单查询
    onSubmit() {
      var page = this.page;
      var opt = {
        page: 1,
        count: 10
      };
      var data = this.formMedia; //查询参数
      data = Object.assign(opt, data);
      // console.log(data);
      this.$api.mediaQuery(Qs.stringify(data)).then(res => {
        if (res) {
          this.tableData = res.listMedia;
          this.resetPage(res.page);
        }
        // console.log(res);
      });
      // console.log("submit!");
    },
    //表单配置规则
    createFormRule() {
      var rule = this.tableRule, //表格规则
        newArr = []; //表单规则
      rule.forEach((res, idx) => {
        //初始参数
        var opt = {
          label: res.label, //标签名
          idx: idx, //下标
          prop: res.prop, //字段
          type: res.type, //表单类型
          postKey: res.postKey //提交的字段
        };
        newArr.push(opt);
      });
      //表单功能按钮
      var formBtn = this.formBtn;
      var chapterFormBtn = this.chapterFormBtn;
      formBtn.map(res => {
        res.func = this[res.func];
      });
      chapterFormBtn.map(res => {
        res.func = this[res.func];
      });
      this.formRule = this.formRule.concat(newArr); //更新视图
      // console.log(this.formRule);
    },
    //提交到服务器
    submitForm(formName) {
      var state = this.itemType.state; //表单状态
      var post;
      var postData;
      //查看视图
      this.$message({
        message: "提交中",
        type: ""
      });
      if (state == "view") {
        // console.log(postData);
        // form.append("xlsMedia", this.formData);
        //新增漫画
      } else if (state == "add") {
        post = new FormData();
        postData = this.formData; //要提交的参数
        for (var k in postData) {
          post.set(k, postData[k]);
        }
        //添加用户
        this.$api.addUser(post).then(res => {
          if (res == 200) {
            this.$router.go(0);
          }
        });
      } else if (state == "updateUser") {
        post = new FormData();
        var postData = this.formData;
        for (var k in postData) {
          post.set(k, postData[k]);
          // post.set("xlsMedia[" + k + "]", postData[k]);
        }
        //修改漫画
        this.$api.updateUser(post).then(res => {
          if (res == 200) {
            this.$router.go(0);
          }
        });
      } else if (state == "addChapter") {
        //新增章节
        post = new FormData();
        var postData = this.chapterForm; //要提交的参数
        for (var k in postData) {
          // console.log(k);
          post.set(k, postData[k]);
          // post.set("xlsMedia[" + k + "]", postData[k]);
        }
        this.$api.addChapter(post).then(res => {
          if (res == 200) {
            this.$router.go(0);
          }
          // console.log(res);
        });
      } else {
      }
      return;
    },
    //切换table和form
    toggleState(k, s) {
      var box = this.toggleBox,
        t = box.table,
        f = box.addform,
        cT = box.chapterTable,
        cF = box.addChapter;
      // console.log(k, s);
      if (k == "chapter") {
        this.$set(box, "table", false);
        this.$set(box, "addform", false);
        if (s == "m") {
          this.$set(box, "chapterTable", true);
        }
      } else if (k == "comic") {
        this.$set(box, "chapterTable", false);
        this.$set(box, "addChapter", false);
        if (s == "m") {
          this.$set(box, "table", true);
        }
      }
      if (s == void 0 || s == null) {
        this.$set(box, "table", !t);
        this.$set(box, "addform", !f);
      } else if (s == "chapter") {
        this.$set(box, "chapterTable", !cT);
        this.$set(box, "addChapter", !cF);
      }
    },
    //返回
    reBack(key, m) {
      // console.log("返回");
      this.postParam = new FormData();
      this.toggleState(key, m);
    },
    //面包屑导航
    loadBread(arr) {
      var nav = [
        {
          name: "用户管理",
          src: ""
        },
        {
          name: "用户管理",
          src: ""
        }
      ];
      if (arr) {
        nav.push(arr);
      }
      //vuex通信
      this.$store.commit("breadcrumb", nav);
    }
  }
};
</script>

<style scoped>
.chapter_btn {
  position: absolute;
  left: 50%;
  bottom: 65px;
}
</style>

