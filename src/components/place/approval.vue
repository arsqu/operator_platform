<template>
  <div id="comic">
    <div class="queryGroup" v-show="toggleBox.table">
      <!-- 查询框 -->
      <div class="queryBox">
        <el-form :inline="true" :model="formMedia" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formMedia.title" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formMedia.phone" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formMedia.status" placeholder="请选择">
              <el-option :label="'待审核'" :value="0"></el-option>
              <el-option :label="'通过'" :value="1"></el-option>
              <el-option :label="'失败'" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 一级box -->
      <div class="comicBox">
        <div class="comic_table_header">
          <!-- <el-button type="primary" size="medium" @click="addComic()">新增漫画</el-button> -->
        </div>
        <div class="comic_table">
          <cusTable :tableData="tableData" :tableRule="tableRule" :tableBtn="tableBtn" />
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :background="true"
            :current-page="pageOpt.current"
            :page-sizes="pageOpt.pageList"
            :page-size="page.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageOpt.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 场地表单 -->
    <div class="comicForm" v-show="toggleBox.addform">
      <div class="comic_edit">
        <formItem
          :select="itemType.select"
          ref="addForm"
          :rules="rules"
          :formRule="formRule"
          :loading="Loading"
          :syncOpt="itemType.syncOpt"
          :formData="formData"
          :formBtn="formBtn"
          v-on:reBack="reBack('comic')"
        ></formItem>
      </div>
    </div>

    <!-- 二级box -->
    <div class="queryChapter" v-show="toggleBox.chapterTable">
      <div class="comicBox">
        <div class="comic_table_header">
          <el-button
            v-show="addDetlBtn"
            type="primary"
            size="medium"
            icon="el-icon-sell"
            @click="addDetl()"
          >新增{{addDetlTxt}}</el-button>
        </div>
        <div class="comic_table">
          <!-- 二级table -->
          <cusTable :tableData="boxData" :tableBtn="boxBtn" :tableRule="boxRule" />
        </div>
        <div class="chapter_btn">
          <el-button type="primary" @click="reBack('comic','m')">返回场地</el-button>
        </div>
      </div>
    </div>

    <!-- 二级页面 -->
    <div class="comicForm" v-show="toggleBox.addChapter">
      <div class="comic_edit">
        <formItem
          :select="itemType.select"
          ref="addForm"
          :rules="rules"
          :loading="Loading"
          :syncOpt="itemType.syncOpt"
          :formRule="detlFormRule"
          :formBtn="detlFormBtn"
          :formData="detlFormData"
          v-on:reBack="reBack('comic')"
        ></formItem>
      </div>
    </div>
  </div>
</template>

<script>
const cusTable = () => import("../module/cusTable");
const formItem = () => import("./formItem");
import Qs from "qs";
export default {
  components: {
    cusTable,
    formItem
  },
  data() {
    return {
      addDetlTxt: "", //新增文本
      addDetlBtn: false, //新增按钮
      boxRule: [], //二级表格规则
      boxData: [], //二级表格数据
      boxBtn: [], //二级表格按钮
      boxState: "", //表单状态
      //表格规则
      boxTableRule: {
        spaceRule: [
          { label: "id", prop: "id", hide: true },
          { label: "序号", prop: "order_no", hide: true },
          { label: "场地Id", prop: "place_id", hide: true },
          { label: "空间名", prop: "space_name" },
          { label: "场地面积", prop: "area" },
          { label: "描述", prop: "info", width: "250", type: "textarea" },
          { label: "视频地址", prop: "video_url", hide: true }
        ]
      },
      //表格按钮规则
      boxTableBtn: {
        spaceBtn: {
          label: "操作",
          width: "100%",
          btnGroup: [
            {
              txt: "修改空间",
              size: "small",
              // hide: true,
              method: (data, idx) => {
                console.log("修改空间");
                this.$set(this, "boxState", "updateSpace");
                data = Object.assign({}, data);
                this.$set(this, "detlFormData", data);
                this.toggleState("chapter", "chapter"); //二级tab切换
              }
            },
            {
              txt: "删除空间",
              size: "small",
              // hide: true,
              method: (data, idx) => {
                this.$confirm("是否删除该空间?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  this.$api.delDataId("place.space.del", data.id).then(res => {
                    // console.log(res);
                    if (res.code == 1) {
                      this.$message({
                        type: "success",
                        message: "删除成功!"
                      });
                    } else {
                      this.$message({
                        type: "error",
                        message: "删除失败!"
                      });
                    }
                  });
                });
              }
            }
          ]
        }
      },
      //二级表单规则
      detlFormRule: {},
      //二级表单规则
      boxFormRule: {
        spaceForm: {}
      },
      //新增二级表单初始数据
      detlDefData: {
        space: {}
      },
      //二级表单数据
      detlFormData: {},
      //二级表单按钮
      detlFormBtn: [
        {
          type: "primary",
          func: "submitForm",
          inner: "提交",
          key: "post"
        },
        {
          func: "reBack",
          param: ["chapter", "chapter"],
          inner: "返回",
          key: "reback"
        }
      ],
      //不渲染的字段
      boxFormHide: {
        space: ["id", "place_id", "video_url", "ad", "ed"]
      },
      //标签属性
      inputValue: "",
      inputVisible: false, //标签
      //表格表单的显示状态
      toggleBox: {
        table: true,
        addform: false,
        chapterTable: false,
        addChapter: false
      },
      //是否禁用表单编辑
      disabled: null,
      Loading: false,
      //分页插件参数
      pageOpt: {
        pageList: [10, 20, 30, 50, 100],
        total: null,
        current: 1
      },
      //分页
      page: {
        offset: 0,
        limit: 10
      },
      //查询参数
      formMedia: {},
      //表格
      tableRule: [
        { label: "id", prop: "id", hide: true },
        { label: "用户账号", prop: "uid_id", hide: true },
        { label: "联系人", prop: "user_name" },
        { label: "手机号", prop: "user_phone", type: "number" },
        { label: "场地名", prop: "place_name" },
        { label: "场地地址", prop: "place_addr" },
        {
          label: "审核状态",
          prop: "status",
          type: "select",
          render: (h, params) => {
            var status = params.row.status;
            //组件属性
            return h(
              "span",
              status == 0 ? "待审核" : status == 1 ? "通过" : "失败"
            );
          }
        }
      ],
      //表格按钮
      tableBtn: {
        fixed: "right", //固定右侧
        label: "操作",
        key: "post",
        width: "100%",
        btnGroup: [
          {
            txt: "审批通过",
            size: "small",
            // hide: true,
            method: (data, idx) => {
              console.log(data);
              if (data.status == 1) {
                this.$message("审批已通过");
                return;
              }
              //通过
              this.$api
                .getDataId("place.apply.approved", data.id + "?status=1")
                .then(res => {
                  if (res.code == 1) {
                    this.$message("审批成功");
                    location.reload();
                  } else {
                    this.$message("审批失败");
                  }
                });
            }
          },
          {
            txt: "取消审批",
            size: "small",
            type: "danger",
            method: (data, idx) => {
              console.log(data);
              if (data.status == 1) {
                this.$message("审批已通过");
                return;
              }
              this.$api
                .getDataId("place.apply.approved", data.id + "?status=2")
                .then(res => {
                  console.log(res);
                  if (res.code == 1) {
                    this.$message("取消成功");
                  } else {
                    this.$message("取消失败");
                  }
                });
            }
          }
          // {
          //   txt: "场地编辑",
          //   size: "small",
          //   // hide: true,
          //   method: (data, idx) => {
          //     // console.log(data, idx);
          //     var key = "updatePlace";
          //     this.$set(this, "boxState", key); //表单状态
          //     data = Object.assign({}, data); //克隆
          //     if (data.tags != "") {
          //       data.tags = data.tags.split(",");
          //     }
          //     this.formData = data;
          //     this.toggleState("comic");
          //     return;
          //   }
          // }
          // {
          //   txt: "查看空间",
          //   size: "small",
          //   method: (data, idx) => {
          //     // console.log(data, idx);
          //     var key = "space";
          //     this.changeBtn("空间", true);
          //     this.loadDetl(key, data.id); //根据placeId加载
          //     this.$set(this.detlDefData[key], "place_id", data.id); //默认数据
          //     var boxTableRule = this.boxTableRule[key + "Rule"];
          //     this.$set(this, "boxState", key); //表单状态
          //     this.$set(this, "boxRule", boxTableRule); //表格规则
          //     this.$set(this, "boxBtn", this.boxTableBtn[key + "Btn"]); //表格按钮
          //     this.$set(this, "detlFormRule", this.boxFormRule[key + "Form"]); //表单规则
          //     this.toggleState("chapter", "m");
          //     return;
          //   }
          // }
        ]
      },
      //表格数据
      tableData: [],
      formHide: {
        place: ["id", "landlord_id", "ed", "ad"]
      },
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
          inner: "提交",
          key: "post"
        },
        { func: "reBack", inner: "返回", key: "reback" }
      ],
      //表单提交参数
      postParam: null, //要提交的参数
      //表单类型
      itemType: {
        //初始化配置
        state: "", //表单编辑状态
        //下拉框配置
        select: {
          status: [
            { val: 0, txt: "待审核" },
            { val: 1, txt: "通过" },
            { val: 2, txt: "失败" }
          ]
        },
        //异步数据
        syncOpt: {
          contryId: [],
          classId: [],
          group: [],
          tags: []
        }
      }
    };
  },
  //初始化数据
  created() {
    this.loadBread(); //导航
    this.init(); //初始化
    this.createFormRule(); //初始化表单
  },
  //初始化完成,渲染html
  mounted() {},
  methods: {
    //按钮文字
    changeBtn(txt, show) {
      this.addDetlTxt = txt;
      this.addDetlBtn = show;
    },
    //新增数据
    addDetl() {
      // console.log("新增");
      var key = this.boxState;
      key =
        key.indexOf("update") != -1
          ? key.toLowerCase().replace(/update/, "")
          : key;
      var defData = this.detlDefData[key];
      this.$set(this, "detlFormData", defData);
      this.toggleState("chapter", "chapter");
      return;
    },
    /*********** 章节初始化 ***********/
    init() {
      this.postParam = new FormData(); //提交参数初始化
      this.loadData(); //表格数据
    },
    //请求场地数据
    loadData() {
      var page = this.page;
      var query = this.formMedia;
      var param = Object.assign({}, page, query);
      // console.log(param);
      this.$api.getData("place.apply.approval", param).then(res => {
        if (res.code == 1) {
          this.$set(this, "tableData", res.data);
          this.resetPage(res.page);
        }
      });
    },
    //表单查询
    onSubmit() {
      var page = this.page;
      var data = this.formMedia; //查询参数
      data = Object.assign(page, data);
      this.$api.getData("place.apply.approval", data).then(res => {
        if (res.code == 1) {
          this.$set(this, "tableData", res.data);
          this.$set(this.page, "offset", 0);
          this.$set(this.pageOpt, "total", res.page.Total);
          // this.resetPage(res.page);
        }
      });
    },
    //添加验证规则
    addFormRule(res, hide, key) {
      if (!res.type || res.type == "textarea") {
        if (hide.indexOf(res.prop) == -1) {
          this.$set(this[key], res.prop, [
            { required: true, message: "请输入" + res.label, trigger: "blur" }
          ]);
        }
      } else if (res.type == "number") {
        if (hide.indexOf(res.prop) == -1) {
          this.$set(this[key], res.prop, [
            { required: true, message: "请输入" + res.label },
            { type: "number", message: res.label + "必须为数字" }
          ]);
        }
      } else {
      }
    },
    //生成规则
    createRule(rule, hide) {
      return (rule = rule.filter((res, idx) => {
        if (hide.indexOf(res.prop) != -1) {
          return;
        }
        var opt = {
          label: res.label, //标签名
          prop: res.prop //字段
        };
        if (res.async) {
          opt.async = !0;
        }
        if (res.type) {
          opt.type = res.type; //表单类型
        }
        return opt;
      }));
    },
    //表单配置规则
    createFormRule() {
      var rule = this.tableRule, //漫画表格
        boxRule = this.boxTableRule,
        boxHide = this.boxFormHide;
      var placeHide = this.formHide;
      rule = this.createRule(rule, placeHide.place); //场地

      //表单按钮
      var formBtn = this.formBtn;
      formBtn.map(res => {
        res.func = this[res.func];
      });
      //表单按钮组
      var groupBtn = this.detlFormBtn;
      groupBtn.map(res => {
        res.func = this[res.func];
      });
      this.$set(this, "formRule", rule);
    },
    //提交到服务器
    submitForm() {
      var state = this.boxState; //表单状态
      var post;
      var postData; //要提交的参数
      //查看视图
      if (state == "updatePlace") {
        this.$refs.addForm.$refs["formData"].validate(valid => {
          if (valid) {
            console.log("submit!");
          } else {
            this.$message.closeAll();
            this.$message.error("请确认表单填写正确,表单带*为必填...");
            return false;
          }
        });
        //不提交的字段
        var hide = ["ad", "ed"];
        post = new FormData();
        postData = this.formData;
        for (var k in postData) {
          if (hide.indexOf(k) == -1) {
            post.set(k, postData[k]);
          }
        }
        this.Loading = true;
        //修改场地
        this.$api
          .postDataId("place.place.edit", postData.id, post)
          .then(res => {
            if (res.code == 1) {
              this.$router.go(0);
            }
            this.Loading = false;
          });
      } else if (state == "space") {
        //新增空间
        this.$refs.addForm.$refs["formData"].validate(valid => {
          if (valid) {
            console.log("submit!");
          } else {
            this.$message.closeAll();
            this.$message.error("请确认表单填写正确,表单带*为必填...");
            return false;
          }
        });
        post = new FormData();
        postData = this.detlFormData;
        for (var k in postData) {
          post.set(k, postData[k]);
        }
        this.Loading = true;
        //新增空间
        this.$api.postData("place.space.add", post).then(res => {
          // console.log(res);
          if (res.code == 1) {
            this.$router.go(0);
          }
          this.Loading = false;
        });
      }
      return;
    },
    //分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.$set(this.page, "offset", 0);
      this.$set(this.page, "limit", val);
      this.loadData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      var page = this.page;
      this.$set(this.pageOpt, "current", val);
      this.$set(this.page, "offset", (val - 1) * page.limit);
      this.loadData();
    },
    //重置分页参数
    resetPage(nPage) {
      // this.$set(this.page, "limit", nPage.Limit);
      this.$set(this.pageOpt, "total", nPage.Total);
      // this.$set(this.page, "offset", (nPage.current - 1) * nPage.Limit);
      // this.$set(this.pageOpt, "current", 1);
    },
    //删除当前标签
    handleClose(t) {
      var tags = this.formData.tags;
      // console.log(t);
      tags.splice(tags.indexOf(t), 1);
    },
    //输入框
    showInput(tag) {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //聚焦
    handleInputConfirm() {
      if (this.inputValue) {
        var tags = this.formData.tags;
        if (tags == "") {
          tags = [];
        }
        if (tags.indexOf(this.inputValue) == -1) {
          tags.push(this.inputValue);
          this.$set(this.formData, "tags", tags);
          // console.log(this.formData);
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
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
      if ({}.toString.call(key) == "[object Array]") {
        m = key[1];
        key = key[0];
      }
      this.$set(this, "detlFormData", []);
      this.postParam = new FormData();
      this.toggleState(key, m);
    },
    //面包屑导航
    loadBread(arr) {
      var nav = [
        {
          name: "场地管理",
          src: ""
        },
        {
          name: "场地管理",
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
.cusForm .resetImg >>> .imgPreview {
  width: 250px;
  height: 150px;
}

.chapter_btn {
  position: absolute;
  left: 50%;
  bottom: 65px;
}
</style>
