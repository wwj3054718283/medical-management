<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- card视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog"
                        >添加分类</el-button
                    >
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table
                class="treeTable"
                :data="catelist"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
                border
                :show-row-hover="false"
            >
                <!-- 是否有效 -->
                <template slot="isok" scope="scope">
                    <i
                        class="el-icon-success"
                        v-if="scope.row.cat_deleted === false"
                        style="color: lightgreen"
                    ></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0"
                        >一级</el-tag
                    >
                    <el-tag
                        size="mini"
                        type="success"
                        v-if="scope.row.cat_level === 1"
                        >二级</el-tag
                    >
                    <el-tag
                        size="mini"
                        type="warning"
                        v-if="scope.row.cat_level === 2"
                        >三级</el-tag
                    >
                </template>
                <!-- 操作 -->
                <template slot="opt" scope="scope">
                    <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        @click="showUpdateCateDialog(scope)"
                        >编辑</el-button
                    >
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope)"
                        >删除</el-button
                    >
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>

        <!-- 添加分类对话空 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed"
        >
            <!-- 添加分类表单 -->
            <el-form
                :model="addCateForm"
                :rules="addCateFormRules"
                ref="addCateFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：" prop="">
                    <el-cascader
                        v-model="selectKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCareChanged"
                        clearable
                        change-on-select="true"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog
            title="编辑分类"
            :visible.sync="updateCateDialogVisible"
            width="50%"
        >
            <!-- 添加分类表单 -->
            <el-form
                :model="updateCateForm"
                ref="updateCateFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称：">
                    <el-input v-model="updateCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateCateDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="updateCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询条件
            querInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            // 商品数据列表
            catelist: [],
            // 总数据条数
            total: 0,
            // 表格列定义
            columns: [
                {
                    label: "分类名称",
                    prop: "cat_name",
                },
                {
                    label: "是否有效",
                    type: "template",
                    template: "isok",
                },
                {
                    label: "排序",
                    type: "template",
                    template: "order",
                },
                {
                    label: "操作",
                    type: "template",
                    template: "opt",
                },
            ],
            // 控制添加分类对话空显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单对象
            addCateForm: {
                // 将要添加的分类名称
                cat_name: "",
                // 父级分类的id
                cat_pid: "0",
                // 分类的等级。默认要添加的等级为1
                cat_level: "0",
            },
            // 添加分类表单验证规则
            addCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: "请输入分类名称",
                        trigger: "blur",
                    },
                ],
            },
            // 父级分类列表
            parentCateList: [],
            // 级联选择器的配置属性
            cascaderProps: {
                value: "cat_id",
                label: "cat_name",
                children: "children",
                expandTrigger: "hover",
            },
            selectKeys: [],
            // 编辑分类对话空显示与隐藏
            updateCateDialogVisible: false,
            // 编辑类型对象
            updateCateForm: {
                cat_name: "",
                cat_id: 40,
            },
        };
    },
    created() {
        this.getCateList();
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get("categories", {
                params: this.querInfo,
            });
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败！");
            }
            this.catelist = res.data.result;
            this.total = res.data.total;
        },
        // 监听pagesize改变事件
        handleSizeChange(newSize) {
            this.querInfo.pagesize = newSize;
            this.getCateList();
        },
        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.querInfo.pagenum = newPage;
            this.getCateList();
        },
        // 点击按钮展示添加分类框
        showAddCateDialog() {
            this.getParentCateList();
            this.addCateDialogVisible = true;
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get("categories", {
                params: { type: 2 },
            });
            if (res.meta.status !== 200) {
                return this.$message.error("获取父级分类数据失败！");
            }
            this.parentCateList = res.data;
        },
        // 选择项触发
        parentCareChanged() {
            // 是否选中父级分类
            if (this.selectKeys.length > 0) {
                this.addCateForm.cat_pid =
                    this.selectKeys[this.selectKeys.length - 1];
                this.addCateForm.cat_level = this.selectKeys.length;
            } else {
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            }
        },
        // 点击按钮添加新分类
        addCate() {
            this.$refs.addCateFormRef.validate(async (vaild) => {
                if (!vaild) {
                    return this.$message.error("数据信息不符合规则");
                }
                const { data: res } = await this.$http.post(
                    "categories",
                    this.addCateForm
                );
                if (res.meta.status !== 201) {
                    this.$message.error("添加分类失败！");
                }
                this.$message.success("添加分类成功！");
                this.getCateList();
                this.addCateDialogVisible = false;
            });
        },
        // 监听对话框关闭事件，重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields();
            this.selectKeys = [];
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        },
        // 点击按钮，展示编辑对话框
        showUpdateCateDialog(value) {
            this.updateCateForm = value.row;
            this.updateCateDialogVisible = true;
        },
        async updateCate() {
            const { data: res } = await this.$http.put(
                `categories/${this.updateCateForm.cat_id}`,
                { cat_name: this.updateCateForm.cat_name }
            );
            if (res.meta.status !== 200) {
                this.$message.error("编辑分类失败！");
            }
            this.$message.success("编辑分类成功！");
            this.getCateList();
            this.updateCateDialogVisible = false
        },
        async deleteCate(value){
            const {data:res} = await this.$http.delete(`categories/${value.row.cat_id}`)
            if (res.meta.status !== 200) {
                this.$message.error("删除类失败！");
            }
            this.$message.success("删除分类成功！");
            this.getCateList();
        }
    },
};
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>
