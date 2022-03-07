<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon
                :closable="false"
            >
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                        v-model="selectedCateKeys"
                        :options="cateList"
                        :props="cateProps"
                        @change="handleChange"
                    ></el-cascader>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Params",
    data() {
        return {
            // 商品数据
            cateList: [],
            // 级联选择器配置
            cateProps: {
                value: "cat_id",
                label: "cat_name",
                children: "children",
                expandTrigger: "hover",
            },
            // 级联选择器绑定数据
            selectedCateKeys:[]
        };
    },
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get("categories");
            if (res.meta.status !== 200) {
                return this.$message.error("获取分类数据失败！");
            }
            this.cateList = res.data;
        },
        // 级联选择对象事件
        handleChange() {
            console.log(this.selectedCateKeys);
        },
    },
};
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
</style>
