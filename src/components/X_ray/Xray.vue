<template>
    <div class="xray">
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>X-ray检测</el-breadcrumb-item>
            <el-breadcrumb-item>X-ray识别</el-breadcrumb-item>
        </el-breadcrumb>
        <iframe
            src="http://106.12.142.24:8085/"
            height="95%"
            width="100%"
            frameborder="0"
        ></iframe>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
.xray{
    width: 100%;
    height: 100%;
}
</style>
