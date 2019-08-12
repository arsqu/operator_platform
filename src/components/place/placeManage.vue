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
        >
          <!-- logo图片 -->
          <template v-slot:form-logo>
            <div class="upload_box">
              <div class="upload_group resetImg">
                <img
                  :src="formData.logoPreview? formData.logoPreview: formData.logo?'http://static.seeknery.com/' +formData.logo:''"
                  class="imgPreview"
                  v-show="formData.logo?true:formData.logoPreview?true:false"
                />
                <el-upload
                  class="upload-demo"
                  list-type="picture-card"
                  name="file-name"
                  action="/api/v1/upload/logo/file-name"
                  :with-credentials="true"
                  :on-success="logoPreview"
                  :show-file-list="false"
                >
                  <!-- action="/api/api/v1/upload/logo/file-name" -->
                  <!-- :auto-upload="false" -->
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </div>
          </template>
          <!-- 场地图 -->
          <template v-slot:form-img_url>
            <div class="upload_box">
              <div class="upload_group resetImg">
                <img
                  :src="formData.imgUrlPreview? formData.imgUrlPreview: formData.img_url? 'http://static.seeknery.com/'+formData.img_url:''"
                  class="imgPreview"
                  v-show="formData.img_url?true:formData.imgUrlPreview?true:false"
                />
                <el-upload
                  class="upload-demo"
                  ref="reviewImg"
                  name="file-name"
                  list-type="picture-card"
                  action="/api/v1/upload/logo/file-name"
                  :with-credentials="true"
                  :on-success="imgUrlPreview"
                  :show-file-list="false"
                >
                  <!-- action="/api/api/v1/upload/logo/file-name" -->
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </div>
          </template>
          <!-- 标签 -->
          <template v-slot:form-tags>
            <el-tag
              class="el-tag--light"
              v-for="(t,i) in formData.tags"
              :key="i"
              :type="!disabled?'':'info'"
              :closable="!disabled"
              @close="handleClose(t)"
            >{{t}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              @keyup.enter.native="handleInputConfirm()"
              @blur="handleInputConfirm()"
              v-model="inputValue"
              size="small"
              ref="saveTagInput"
            ></el-input>
            <el-button
              v-else-if="!disabled"
              class="button-new-tag"
              size="small"
              @click="showInput()"
            >+ New Tag</el-button>
          </template>
        </formItem>
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
    <!-- {{toggleBox.chapterTable}} -->
    <!-- {{toggleBox.addChapter}} -->
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
        >
          <template v-slot:form-img_url>
            <div class="upload_box">
              <!-- <span v-show="itemType.state=='update'">修改上传的地址需要重新上传图片</span> -->
              <div class="upload_group resetImg">
                <img
                  :src="detlFormData.imgUrlPreview? detlFormData.imgUrlPreview: 
                    detlFormData.img_url? 'http://static.seeknery.com/'+detlFormData.img_url:''"
                  class="imgPreview"
                  v-show="detlFormData.img_url?true:detlFormData.imgUrlPreview?true:false"
                />
                <el-upload
                  class="upload-demo"
                  ref="detlImg"
                  name="file-name"
                  list-type="picture-card"
                  action="/api/v1/upload/logo/file-name"
                  :with-credentials="true"
                  :on-success="detlImgPreview"
                  :show-file-list="false"
                >
                  <!--  action="/api/api/v1/upload/logo/file-name" -->
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </div>
          </template>
          <!-- 空间图 -->
          <template v-slot:form-space_img_list>
            <div class="upload_box">
              <div class="upload_group resetImg">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  name="file-name"
                  action="/api/v1/upload/imgs/file-name"
                  :with-credentials="true"
                  :before-upload="beforeUpload"
                  :on-success="showSpaceImg"
                  :multiple="false"
                  drag
                >
                  <!-- action="/api/api/v1/upload/imgs/file-name" -->
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">可选择或拖拽上传</div>
                  <div class="el-upload__tip" slot="tip">只能上传zip文件</div>
                </el-upload>
              </div>
              <div class="previewList">
                <div class="cover_img">
                  <template v-if="detlFormData.showSpaceImg&&detlFormData.showSpaceImg.length>0">
                    <template v-for="(item,idx) in detlFormData.showSpaceImg">
                      <img :src="'http://static.seeknery.com/'+item" :key="idx" />
                    </template>
                  </template>
                  <template
                    v-else-if="detlFormData.space_img_list&&detlFormData.space_img_list.length>0"
                  >
                    <template v-for="(item,idx) in detlFormData.space_img_list">
                      <img :src="'http://static.seeknery.com/'+item" :key="idx" />
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </template>
          <!-- 效果图 -->
          <template v-slot:form-model_img_list>
            <div class="upload_box">
              <div class="upload_group resetImg">
                <el-upload
                  class="upload-demo"
                  name="file-name"
                  ref="upload"
                  action="/api/v1/upload/imgs/file-name"
                  :before-upload="beforeUpload"
                  :with-credentials="true"
                  :on-success="showModelImg"
                  :multiple="false"
                  drag
                >
                  <!--  action="/api/api/v1/upload/imgs/file-name" -->
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">可选择或拖拽上传</div>
                  <div class="el-upload__tip" slot="tip">只能上传zip文件</div>
                </el-upload>
              </div>
              <div class="previewList">
                <div class="cover_img">
                  <template v-if="detlFormData.showModelImg&&detlFormData.showModelImg.length>0">
                    <template v-for="(item,idx) in detlFormData.showModelImg">
                      <img :src="'http://static.seeknery.com/'+item" :key="idx" />
                    </template>
                  </template>
                  <template
                    v-else-if="detlFormData.model_img_list&&detlFormData.model_img_list.length>0"
                  >
                    <template v-for="(item,idx) in detlFormData.model_img_list">
                      <img :src="'http://static.seeknery.com/'+item" :key="idx" />
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </formItem>
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
          {
            label: "封面图",
            width: "180",
            type: "slot",
            prop: "img_url",
            render: (h, params) => {
              var showImg = params.row.img_url;
              return h(
                "div",
                {
                  class: {
                    coverImg: true
                  }
                },
                [
                  h("img", {
                    //样式
                    class: {
                      imgView: true
                    },
                    attrs: {
                      src: "http://static.seeknery.com/" + showImg
                    }
                  })
                ]
              );
            }
          },
          { label: "空间名", prop: "space_name" },
          { label: "场地面积", prop: "area" },
          { label: "描述", prop: "info", width: "250", type: "textarea" },
          { label: "空间图", prop: "space_img_list", type: "slot", hide: true },
          {
            label: "空间效果图",
            prop: "model_img_list",
            type: "slot",
            hide: true
          },
          { label: "视频地址", prop: "video_url", hide: true }
        ],
        planRule: [
          { label: "id", prop: "id", hide: true },
          { label: "场地Id", prop: "place_id", hide: true },
          { label: "禁止日期", prop: "off_time_list", type: "datesPicker" },
          {
            label: "开始日期",
            prop: "start_date",
            type: "datePicker",
            render: (h, params) => {
              var s = params.row.start_date;
              s = this.exDate(String(s));
              return h("span", s);
            }
          },
          {
            label: "结束日期",
            prop: "end_date",
            type: "datePicker",
            render: (h, params) => {
              var e = params.row.end_date;
              e = this.exDate(String(e));
              return h("span", e);
            }
          },
          {
            label: "出租类型",
            prop: "typ",
            type: "select",
            render: (h, params) => {
              var typ = params.row.typ;
              return h("span", typ == 0 ? "不限" : typ == 1 ? "整租" : "拼租");
            }
          }
        ],
        setRule: [
          { label: "id", prop: "id", hide: true },
          { label: "场地Id", prop: "place_id", hide: true },
          { label: "整租总费用(分)", prop: "place_money" },
          { label: "付款比例(%)", prop: "pay_rete" },
          { label: "整租进场人数", prop: "place_user_num" },
          { label: "拼单上限", prop: "max_num" },
          { label: "拼单下限", prop: "min_num" },
          { label: "拼单金额(分)", prop: "perorder_money" },
          { label: "拼单人数限制", prop: "perorder_user_num" },
          { label: "提前退款时限", prop: "refund_num" },
          { label: "开始时间", prop: "start_time", type: "timePicker" },
          { label: "结束时间", prop: "end_time", type: "timePicker" }
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
                data.space_img_list = data.space_img_list
                  ? data.space_img_list.split(",")
                  : "";
                data.model_img_list = data.model_img_list
                  ? data.model_img_list.split(",")
                  : "";
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
        },
        planBtn: {
          label: "操作",
          width: "100%",
          btnGroup: [
            {
              txt: "修改计划",
              size: "small",
              // hide: true,
              method: (data, idx) => {
                console.log("修改计划");
                this.$set(this, "boxState", "updatePlan");
                data = Object.assign({}, data);
                data.start_date = String(data.start_date);
                data.end_date = String(data.end_date);
                data.off_time_list = data.off_time_list.split(",");
                this.$set(this, "detlFormData", data);
                this.toggleState("chapter", "chapter"); //二级tab切换
              }
            },
            {
              txt: "删除计划",
              size: "small",
              method: (data, idx) => {
                this.$confirm("是否删除该计划?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  this.$api.delDataId("place.plan.del", data.id).then(res => {
                    // console.log(res);
                    if (res.code == 1) {
                      this.$message({
                        type: "success",
                        message: "删除成功!"
                      });
                      setTimeout(() => {
                        this.$router.go(0);
                      }, 1000);
                    }
                  });
                });
              }
            }
          ]
        },
        setBtn: {
          label: "操作",
          width: "100%",
          btnGroup: [
            {
              txt: "修改设置",
              size: "small",
              // hide: true,
              method: (data, idx) => {
                console.log("场地设置");
                this.$set(this, "boxState", "updateSet");
                data = Object.assign({}, data);
                this.$set(this, "detlFormData", data);
                this.toggleState("chapter", "chapter"); //二级tab切换
              }
            }
          ]
        }
      },
      //二级表单规则
      detlFormRule: {},
      //二级表单规则
      boxFormRule: {
        spaceForm: {},
        planForm: {},
        setForm: {}
      },
      //新增二级表单初始数据
      detlDefData: {
        space: {
          // is_del: 1 //1为删除
        },
        plan: {},
        set: {}
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
        space: ["id", "place_id", "video_url", "ad", "ed"],
        plan: ["id", "place_id", "ad", "ed"],
        set: ["id", "place_id", "ad", "ed"]
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
        {
          label: "logo图",
          prop: "logo",
          hide: true,
          width: "200",
          type: "slot",
          render: (h, params) => {
            var showImg = params.row.img_url;
            return h(
              "div",
              {
                class: {
                  //图片无法显示的遮罩
                  coverImg: true
                }
              },
              [
                h("img", {
                  //样式
                  class: {
                    imgView: true
                  },
                  attrs: {
                    src: "http://static.seeknery.com/" + showImg
                  }
                })
              ]
            );
          }
        },
        {
          label: "封面图",
          prop: "img_url",
          width: "200",
          type: "slot",
          render: (h, params) => {
            var showImg = params.row.img_url;
            return h(
              "div",
              {
                class: {
                  //图片无法显示的遮罩
                  coverImg: true
                }
              },
              [
                h("img", {
                  //样式
                  class: {
                    imgView: true
                  },
                  attrs: {
                    src: "http://static.seeknery.com/" + showImg
                  }
                })
              ]
            );
          }
        },
        { label: "场地名", prop: "title", width: "180" },
        { label: "坐标", prop: "map_xy", hide: true },
        { label: "地址", prop: "addr" },
        { label: "国家", prop: "contry", hide: true },
        { label: "省份", prop: "province" },
        { label: "城市", prop: "city" },
        {
          label: "场地介绍",
          prop: "info",
          type: "textarea",
          hide: true
        },
        {
          label: "注意事项",
          prop: "attention",
          type: "textarea",
          hide: true
        },
        {
          label: "便利设施",
          prop: "convenience",
          type: "textarea",
          hide: true
        },
        {
          label: "标签",
          prop: "tags",
          type: "slot",
          render: (h, params) => {
            //组件属性
            var tags = params.row.tags,
              newArr = [];
            tags = tags.split(",");
            if (tags.toString() != "") {
              tags.map(res => {
                newArr.push(
                  h("el-tag", { props: { type: "info" } }, res.split(",")[0])
                );
              });
              return h("div", newArr);
            }
            return "";
          }
        },
        { label: "星级", prop: "star_num", type: "number", hide: true },
        { label: "喜欢数", prop: "feel_num", type: "number", hide: true },
        { label: "收藏数", prop: "collect_num", type: "number", hide: true },
        { label: "总面积", prop: "total_area", type: "number" },
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
        },
        {
          label: "是否上线",
          prop: "is_online",
          type: "select",
          render: (h, params) => {
            //组件属性
            return h("span", params.row.is_online == 0 ? "下线" : "上线");
          }
        }
      ],
      //表格按钮
      tableBtn: {
        fixed: "right", //固定右侧
        label: "操作",
        key: "post",
        width: "100%",
        /*
          txt: "修改漫画",
            size: "small",
            method: (data, idx) => {
              console.log("update");
              this.disabled = false;
              this.$set(this.itemType, "state", "updateComic");
              var tags = [],
                group = [];
              data = Object.assign({}, data); //克隆
              data.tags.map(res => {
                tags.push(res.tag);
              });
              //转化字段
              data.group.map(res => {
                group.push(res.id);
              });
              data.tags = tags;
              data.group = group;
              var type = data.showImg;
              type =
                type.indexOf("aliyuncs") != -1
                  ? "a"
                  : type.indexOf("amazonaws") != -1
                  ? "y"
                  : "";
              this.formData = Object.assign({ type }, data);
              this.toggleState("comic");
            }
         */
        btnGroup: [
          {
            txt: "场地编辑",
            size: "small",
            // hide: true,
            method: (data, idx) => {
              // console.log(data, idx);
              var key = "updatePlace";
              this.$set(this, "boxState", key); //表单状态
              data = Object.assign({}, data); //克隆
              if (data.tags != "") {
                data.tags = data.tags.split(",");
              }
              this.formData = data;
              this.toggleState("comic");
              return;
            }
          },
          {
            txt: "查看空间",
            size: "small",
            method: (data, idx) => {
              // console.log(data, idx);
              var key = "space";
              this.changeBtn("空间", true);
              this.$set(this.detlDefData[key], "place_id", data.id); //默认数据
              this.detlFunc(key, data);
              return;
            }
          },
          {
            txt: "出租计划",
            size: "small",
            method: (data, idx) => {
              // console.log(data, idx);
              var key = "plan";
              this.changeBtn("计划", true);
              this.$set(this.detlDefData[key], "place_id", data.id); //默认数据
              this.detlFunc(key, data);
              return;
            }
          },
          {
            txt: "场地设置",
            size: "small",
            method: (data, idx) => {
              // console.log(data, idx);
              var key = "set";
              this.changeBtn("设置", true);
              this.$set(this.detlDefData[key], "place_id", data.id); //默认数据
              this.detlFunc(key, data);
              return;
            }
          }
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
          typ: [
            { val: 0, txt: "不限" },
            { val: 1, txt: "整租" },
            { val: 2, txt: "拼租" }
          ],
          is_online: [{ val: 1, txt: "上线" }, { val: 0, txt: "下线" }],
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
        },
        //时间选择
        datePicker: []
      }
      /************ 漫画配置 ************/
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
    //表单
    detlFunc(key, data) {
      var boxTableRule = this.boxTableRule[key + "Rule"]; //表格规则
      this.loadDetl(key, data.id); //placeId
      this.$set(this, "boxState", key); //表单状态
      this.$set(this, "boxRule", boxTableRule);
      this.$set(this, "boxBtn", this.boxTableBtn[key + "Btn"]);
      this.$set(this, "detlFormRule", this.boxFormRule[key + "Form"]); //表单规则
      this.toggleState("chapter", "m");
    },
    //转化日期
    exDate(str) {
      var reg = /(\d{4})(\d{2})(\d{2})/,
        res = str.match(reg);
      if (res && res.length > 0) {
        return res.slice(1).join("/");
      }
      return false;
    },
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
    //二级页面数据
    loadDetl(str, placeId) {
      var query = {
        space: "place.space.query",
        plan: "place.plan.query",
        set: "place.set.query"
      };
      if (!query[str] || !placeId) {
        console.log("地址或场地Id不存在");
        return;
      }
      this.$api.getData(query[str], { placeId }).then(res => {
        // console.log(res);
        if (res.code == 1) {
          var arr = [];
          if (Object.prototype.toString.call(res.data) == "[object Object]") {
            arr.push(res.data);
            res.data = arr;
          }
          this.$set(this, "boxData", res.data);
        } else {
          this.$set(this, "boxData", []);
        }
      });
    },
    /*********** 章节初始化 ***********/
    init() {
      this.postParam = new FormData(); //提交参数初始化
      this.loadData(); //表格数据
    },
    //上传图片
    uploadImg(file, idx) {
      console.log(file, idx);
      var formData = new FormData();
      formData.append("file-name", file.raw);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/imgs/file-name");
      // console.log(xhr);
      xhr.withCredentials = true;
      // console.log(xhr);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.readyState === 200) {
          console.log(xhr.response);
        }
      };
      // xhr.setRequestHeader('Content-Type', "multipart/form-data");
      xhr.send(formData);
    },
    /********* 图片上传 *********/
    //logo上传
    logoPreview(res, file, fileList) {
      if (res.code == 1) {
        this.$set(this.formData, "logoPreview", URL.createObjectURL(file.raw));
        this.$set(this.formData, "logo", res.data[0]);
      }
    },
    //场地图上传
    imgUrlPreview(res, file, fileList) {
      if (res.code == 1) {
        this.$set(
          this.formData,
          "imgUrlPreview",
          URL.createObjectURL(file.raw)
        );
        this.$set(this.formData, "img_url", res.data[0]);
      }
    },
    /********* 二级box图片上传 *********/
    //空间图
    detlImgPreview(res, file, fileList) {
      if (res.code == 1) {
        this.$set(
          this.detlFormData,
          "imgUrlPreview",
          URL.createObjectURL(file.raw)
        );
        this.$set(this.detlFormData, "img_url", res.data[0]);
      }
    },
    //空间图
    showSpaceImg(res, file, fileList) {
      if (res.code == 1) {
        this.$set(this.detlFormData, "showSpaceImg", res.data);
        this.$set(this.detlFormData, "space_img_list", res.data);
      }
    },
    //效果图
    showModelImg(res, file, fileList) {
      if (res.code == 1) {
        this.$set(this.detlFormData, "showModelImg", res.data);
        this.$set(this.detlFormData, "model_img_list", res.data);
      }
    },
    //上传前拦截
    beforeUpload(file) {
      var isZip = file.type === "application/x-zip-compressed";
      var isLt2M = file.size / 1024 / 1024 < 8;
      if (!isZip) {
        this.$message.error("上传只能为zip格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传大小不能超过 8MB!");
      }
      return isZip && isLt2M;
    },
    //请求场地数据
    loadData() {
      var page = this.page;
      var query = this.formMedia;
      var param = Object.assign({}, page, query);
      // console.log(param);
      this.$api.getData("place.place.query", param).then(res => {
        if (res.code == 1) {
          this.$set(this, "tableData", res.data);
          this.resetPage(res.page);
        }
      });
    },
    //新增漫画
    addComic() {
      this.disabled = false;
      var type = this.itemType,
        opt = type.syncOpt;
      this.$set(type, "state", "add");
      var contryId = opt.contryId[0] ? opt.contryId[0].val : "",
        classId = opt.classId[0] ? opt.classId[0].val : "",
        tags = opt.tags;
      //转换数据类型
      var tag_arr = [];
      tags.map(res => {
        tag_arr.push(res.txt);
      });
      // console.log(this.rules);
      //必填项
      this.formData = {
        isShow: 1,
        typ: 1,
        type: "a",
        contryId: contryId,
        classId: classId,
        // group: group,
        tags: tag_arr,
        isOver: 0,
        payTyp: 1,
        weekNo: new Date().getDay() + ""
      };
      // this.formItemShow();
      this.toggleState("comic");
    },
    //表单查询
    onSubmit() {
      var page = this.page;
      var data = this.formMedia; //查询参数
      data = Object.assign(page, data);
      this.$api.getData("place.placeQuery", data).then(res => {
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
        space = boxRule.spaceRule,
        plan = boxRule.planRule,
        set = boxRule.setRule,
        boxHide = this.boxFormHide;
      var placeHide = this.formHide;
      rule = this.createRule(rule, placeHide.place); //场地
      space = this.createRule(space, boxHide.space); //空间
      plan = this.createRule(plan, boxHide.plan); //计划
      set = this.createRule(set, boxHide.set); //设置
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
      this.$set(this.boxFormRule, "spaceForm", space);
      this.$set(this.boxFormRule, "planForm", plan);
      this.$set(this.boxFormRule, "setForm", set);
      // this.formRule = this.formRule.concat(newArr);
      // console.log(this.detlFormBtn);
      // console.log(this.formRule);
    },
    //提交到服务器
    submitForm() {
      var state = this.boxState; //表单状态
      var post;
      var postData; //要提交的参数
      //查看视图
      if (state == "view") {
      }
      this.$message("正在提交中...");
      // console.log(state);
      // return;
      if (state == "add") {
        postData = this.formData;
        if (!postData.image) {
          this.$message.closeAll();
          this.$message.error("添加封面图不为空");
          return false;
        }
        this.$refs.addForm.$refs["formData"].validate(valid => {
          if (valid) {
            console.log("submit!");
          } else {
            this.$message.closeAll();
            this.$message.error("请确认表单填写正确,表单带*为必填...");
            return false;
          }
        });
        //新增漫画
        post = new FormData();
        for (var k in postData) {
          post.set(k, postData[k]);
        }
        this.Loading = true;
        this.$api.addMedia(post).then(res => {
          if (res == 200) {
            this.$router.go(0);
          }
          this.Loading = false;
        });
      } else if (state == "updatePlace") {
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
      } else if (state == "updateSpace") {
        //修改空间
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
        postData = this.detlFormData;
        for (var k in postData) {
          if (hide.indexOf(k) == -1) {
            post.set(k, postData[k]);
          }
        }
        this.Loading = true;
        console.log(postData);
        //修改空间
        this.$api
          .postDataId("place.space.edit", postData.id, post)
          .then(res => {
            if (res.code == 1) {
              this.$router.go(0);
            }
            this.Loading = false;
          });
      } else if (state == "plan") {
        //新增计划
        console.log(state);
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
        // console.log(postData);
        //新增计划
        this.$api.postData("place.plan.add", post).then(res => {
          // console.log(res);
          if (res.code == 1) {
            this.$router.go(0);
          }
          this.Loading = false;
        });
      } else if (state == "updatePlan") {
        //修改计划
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
        postData = this.detlFormData;
        for (var k in postData) {
          if (hide.indexOf(k) == -1) {
            post.set(k, postData[k]);
          }
        }
        this.Loading = true;
        console.log(postData);
        //修改计划
        this.$api.postDataId("place.plan.edit", postData.id, post).then(res => {
          if (res.code == 1) {
            this.$router.go(0);
          }
          this.Loading = false;
        });
      } else if (state == "set") {
        //新增设置
        console.log(state);
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
        // console.log(postData);
        //新增设置
        this.$api.postData("place.set.add", post).then(res => {
          console.log(res);
          if (res.code == 1) {
            this.$router.go(0);
          }
          this.Loading = false;
        });
      } else if (state == "updateSet") {
        //修改设置
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
        postData = this.detlFormData;
        for (var k in postData) {
          if (hide.indexOf(k) == -1) {
            post.set(k, postData[k]);
          }
        }
        this.Loading = true;
        console.log(postData);
        //修改设置
        this.$api.postDataId("place.set.edit", postData.id, post).then(res => {
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

.previewList {
  overflow-y: auto;
}

.previewList .cover_img {
  /* width: 10000px;
  overflow: hidden; */
  max-height: 190px;
}

.previewList .cover_img img {
  width: 300px;
  height: 180px;
}

.chapter_btn {
  position: absolute;
  left: 50%;
  bottom: 65px;
}

.uploadFrame {
  height: 0;
  width: 0;
  font-size: 0;
  border: 0 none;
}
</style>

