<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/user.jpg" alt="" />
            </div>
            <!-- 登录表单区域 -->
            <el-form
                ref="loginFormRef"
                :model="loginFrom"
                :rules="loginFromRules"
                label-width="0px"
                class="login_form"
            >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                        v-model="loginFrom.username"
                        prefix-icon="iconfont icon-user"
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input
                        v-model="loginFrom.password"
                        prefix-icon="iconfont icon-suo"
                        show-password
                    ></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            //登录表单数据绑定对象
            loginFrom: {
                username: "admin",
                password: "123456",
            },
            //表单验证规则对象
            loginFromRules: {
                // 用户名验证
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    {
                        min: 0,
                        max: 25,
                        message: "长度在 0 到 25个字符",
                        trigger: "blur",
                    },
                ],
                // 密码验证
                password: [
                    {
                        required: true,
                        message: "请输入登录密码",
                        trigger: "blur",
                    },
                    {
                        min: 4,
                        max: 25,
                        message: "长度在 4 到 25 个字符",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },
        login() {
            this.$refs.loginFormRef.validate(async (valid, object) => {
                if (!valid) return;
                // 登录测试
                const { data: data } = await this.$http.post(
                    "login/auth",
                    {
                        username: this.loginFrom.username,
                        password: this.loginFrom.password,
                    },
                    {
                        header: {
                            "content-type": "application/json",
                        },
                    }
                );
                if (data.code !== "200") return this.$message.error("登录失败");
                else {
                    window.sessionStorage.setItem("token", data.info.token);
                    window.sessionStorage.setItem("rolerank", data.info.roleIds[0]);
                    this.$message.success("登录成功");
                    this.$router.push("/home");
                }
                

                // 注册测试
                // const data = await this.$http.post(
                //     "insertUserInfo",
                //     {
                //         email: this.loginFrom.useremail,
                //         password: this.loginFrom.password,
                //     },
                //     {
                //         header: {
                //             "content-type": "application/json",
                //         },
                //     }
                // );
                // console.log(data);

                // if (data.data[0].password !== this.loginFrom.password)
                //     return this.$message.error("登录失败");
                // else{
                //    this.$message.success("登录成功");
                //    this.$router.push("/home");
                // }
            });
        },
    },
};
</script>
// scoped代表只渲染当前组件
<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
