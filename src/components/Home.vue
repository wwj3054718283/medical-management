<template>
    <el-container class="home-container">
        <!-- 头部区域 -->

        <el-header>
            <div>
                <img src="../assets/user.jpg" height="50" alt="" />
                <span>社区医疗信息化系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button></el-header
        >
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区 -->
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409eff"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                    :default-active="activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu
                        :index="item.path + ''"
                        v-for="item in menulist"
                        :key="item.id"
                    >
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index="'/' + subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            @click="saveNavState('/' + subItem.path)"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单数据
            menulist: [
                {
                    id: 1,
                    path: "users",
                    authName: "用户管理",
                    children: [{ id: 11, path: "users", authName: "用户列表" }],
                },
                {
                    id: 2,
                    path: "department",
                    authName: "科室管理",
                    children: [
                        { id: 21, path: "department", authName: "科室列表" },
                    ],
                },
                {
                    id: 3,
                    path: "drug",
                    authName: "药品管理",
                    children: [{ id: 31, path: "drug", authName: "药品列表" }],
                },
                {
                    id: 4,
                    path: "Xray",
                    authName: "X-ray检测",
                    children: [{ id: 41, path: "Xray", authName: "X-ray识别" }],
                },
                {
                    id: 5,
                    path: "oneself",
                    authName: "个人中心",
                    children: [
                        { id: 51, path: "oneself", authName: "个人信息" },
                    ],
                },
            ],
            iconsObj: {
                1: "iconfont icon-users",
                2: "iconfont icon-quanxian",
                3: "iconfont icon-shop",
                4: "iconfont icon-dingdan",
                5: "el-icon-s-custom",
            },
            // 是否折叠
            isCollapse: false,
            // 被激活地址
            activePath: "",
            src: "",
        };
    },
    created() {
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem("activePath");
    },
    methods: {
        async logout() {
            window.sessionStorage.clear();
            await this.$http.post("login/logout", {
                header: {
                    "content-type": "application/json",
                    token: window.sessionStorage.token,
                },
            });
            this.$router.push("/login");
        },
        // 获取所有菜单
        async getMenuList() {
            const { data: data } = await this.$http.post("login/getInfo");
            if (data.code !== "200") {
                return this.$message.error("用户信息获取失败！");
            }
            let rolenum = data.info.roleIds[0];
            if (rolenum == 1) {
                this.src = require("../assets/adm.png");
            } else if (rolenum == 2) {
                this.src = require("../assets/doc.png");
            } else {
                this.src = require("../assets/disease.png");
            }
        },
        // 点击按钮，切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        // 保存连接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem("activePath", activePath);
            this.activePath = window.sessionStorage.getItem("activePath");
        },
    },
};
</script>

<style lang='less' scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        > img {
            height: 50px;
            border-radius: 50%;
        }
        > span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
