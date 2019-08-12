<template>
  <div class="hello">
    <div>当前登陆账号:{{user}}</div>
    <div>当前时间:{{time}}</div>
  </div>
</template>

<style>
</style>

<script>
export default {
  data() {
    return {
      user: "",
      time: "",
      timer: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // this.user = this.$util.getCookie('uname') || '测试账号';
      var info = localStorage.getItem("loginInfo");
      this.user = info ? JSON.parse(info).uname : "测试账号";
      this.timer = setInterval(this.loopTime, 1000);
      this.loadBread();
    },
    loopTime() {
      var d = new Date(),
        y = d.getFullYear(),
        M = d.getMonth(),
        day = d.getDate(),
        h = d.getHours(),
        m = d.getMinutes(),
        s = d.getSeconds();
      this.time =
        y + "年" + M + "月" + day + "日" + h + "时" + m + "分" + s + "秒";
    },
    loadBread() {
      var arr = [];
      // console.log(this.$route);
      this.$store.commit("breadcrumb", arr);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
};
</script>

<style scoped>
.hello {
  padding: 15px 20px;
}

.hello > div {
  padding: 5px 0;
}
</style>
