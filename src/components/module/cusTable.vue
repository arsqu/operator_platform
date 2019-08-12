<template>
  <el-table :data="tableData" min-height="250px;">
    <template v-for="(item,idx) in tableRule">
      <!-- 表头规则 -->
      <el-table-column
        v-if="item.hide != !0"
        :key="idx"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
      >
        <!-- 自定义内容 -->
        <template slot-scope="scope">
          <expand
            v-if="item&&item.render"
            :row="scope.row"
            :render="item.render"
            :key="idx"
            :idx="idx"
            :item="item"
          />
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </template>
    <!-- 单元格操作 -->
    <el-table-column
      v-if="tableBtn.btnGroup&&tableBtn.btnGroup.length>0"
      :label="tableBtn.label"
      :fixed="tableBtn.fixed"
      :width="tableBtn.width"
    >
      <!-- 自定义按钮 -->
      <template slot-scope="scope">
        <template v-for="(item,idx) in tableBtn.btnGroup">
          <el-button
            v-if="item.hide != !0"
            :key="idx"
            :type="item.type"
            :size="item.size"
            @click.native.prevent="item.method(scope.row,idx)"
          >{{item.txt}}</el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    tableBtn: {
      type: Object,
      dafault() {
        return {};
      }
    },
    tableRule: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    expand: {
      //子组件
      functional: true,
      props: {
        row: {
          type: Object,
          default() {
            return {};
          }
        },
        render: Function,
        idx: Number,
        item: {
          type: Object,
          default() {
            return {};
          }
        }
      },
      render: (h, ctx) => {
        var params = {
          row: ctx.props.row,
          idx: ctx.props.idx
        };
        if (ctx.props.item) params.item = ctx.props.item;
        return ctx.props.render(h, params);
      }
    }
  },
  mounted() {
    // console.log(this);
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>


<style scoped>
.el-table {
  width: auto;
  max-width: none;
}

.bannerView {
  max-width: 270px;
  height: 170px;
}
</style>
