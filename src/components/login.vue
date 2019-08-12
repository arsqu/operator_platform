<template>
  <!-- login -->
  <div class="login_box" @keyup.13="login">
    <div class="login_head">登录</div>
    <div class="login_body">
      <form id="login">
        <div class="label-item">
          <el-input type="text" v-model="formData.uname" placeholder="用户名"></el-input>
        </div>
        <div class="label-item">
          <el-input v-model="formData.upwd" show-password placeholder="密码"></el-input>
        </div>
        <div class="btn_contrl">
          <span class="submit" @click="login">登录</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Qs from "qs";

export default {
  data() {
    return {
      formData: {}
    };
  },
  created() {},
  mounted() {},
  methods: {
    login() {
      var param = this.formData;
      if (!param.uname || !param.upwd) {
        this.$message({
          message: "请填写用户名密码",
          duration: 1500
        });
        return;
      }
      this.$message({
        message: "登录中...请稍候",
        duration: 10000
      });
      // var flag = true;
      // setTimeout(() => {
      //   this.$message.closeAll();
      //   if (flag) {
      //     this.$message({
      //       message: "请求超时登陆失败",
      //       duration: 10000
      //     });
      //   }
      // }, 10000);
      //登陆
      this.$api
        .login(Qs.stringify(param))
        .then(res => {
          if (res.code == 1) {
            var local = localStorage;
            local.setItem("isLogin", "1");
            // local.setItem("isLoginTime", new Date().getTime() + 60 * 60 * 1000);
            local.removeItem("menuList");
            // local.setItem(
            //   "loginInfo",
            //   JSON.stringify({ uname: res.userName, roleId: res.roleId })
            // );
            this.$message.closeAll();
            this.$message({
              message: "登录成功",
              duration: 1500
            });
            this.$router.push({ path: "/" });
          } else {
            // flag = false;
            this.$message.closeAll();
            this.$message({
              message: res.msg,
              duration: 1500
            });
          }
        })
        .catch(err => {
          // flag = false;
          this.$message({
            message: "登陆失败",
            duration: 10000
          });
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.login_box {
  position: absolute;
  left: 50%;
  margin-left: -13%;
  top: 20%;
  width: 26%;
  height: 350px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.33);
}

@media (max-width: 1280px) {
  .login_box {
    width: 33%;
    margin-left: -16.5%;
  }
}

@media (max-width: 1024px) {
  .login_box {
    width: 47%;
    margin-left: -23.5%;
  }
}

@media (max-width: 480px) {
  .login_box {
    width: 90%;
    margin-left: -45%;
  }
}

.login_head {
  font-size: 25px;
  color: #fff;
  padding: 10px 20px;
}

.login_body {
  background: #fff;
  height: 65%;
  border-radius: 5px;
  padding: 0 25px;
  padding-top: 30px;
}

.label-item {
  width: 100%;
  margin-bottom: 15px;
  height: 40px;
}

.label-item input {
  height: 100%;
  width: 100%;
  outline: 0 none;
  margin: 0px 0px;
  border-radius: 5px;
  padding-left: 10px;
  box-sizing: border-box;
  transition: all 0.6s linear;
  border: 2px solid #ddd;
}

.label-item input:focus {
  border-color: #6eb0d4;
}

.login_body .btn_contrl {
  padding-top: 30px;
  text-align: center;
}

.btn_contrl .submit {
  color: #fff;
  background: #de8b8b;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  padding: 8px 15px;
  width: 100%;
  display: block;
  box-sizing: border-box;
}

.btn_contrl .submit:hover {
  background: #e5a2a2;
}
</style>


