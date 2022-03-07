<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>药品管理</el-breadcrumb-item>
            <el-breadcrumb-item>药品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="7"
                    ><el-input
                        placeholder="请输入内容"
                        v-model="seekvalue"
                        clearable
                        @clear="closeUserList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="seekUserList"
                        ></el-button> </el-input
                ></el-col>
                <el-col :span="4" v-if="rolerank">
                    <el-button type="primary" @click="addDialogVisible = true"
                        >添加药品</el-button
                    >
                </el-col>
                <el-col :span="4" v-if="rolerank">
                    <el-button
                        type="primary"
                        @click="deleteDialogVisible = true"
                        >批量删除</el-button
                    >
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="deleteDialogVisible" class="deletecla">
                <el-col :span="4">
                    <el-button type="danger" @click="deleteUser"
                        >确认删除</el-button
                    >
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="redeleteUser"
                        >取消</el-button
                    >
                </el-col>
            </el-row>
            <!-- 药品列表区域 -->
            <el-table
                :data="userlist"
                border
                stripe
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="index"> </el-table-column>
                <el-table-column
                    label="删除"
                    type="selection"
                    v-if="deleteDialogVisible"
                    :selectable="handleCheckedUser"
                >
                </el-table-column>
                <el-table-column label="药品名" prop="drugName">
                </el-table-column>
                <el-table-column label="价格" prop="price"> </el-table-column>
                <el-table-column label="总量" prop="num"> </el-table-column>
                <el-table-column label="入库时间" prop="createTime">
                </el-table-column>
                <el-table-column label="最新更改" prop="createTime">
                </el-table-column>
                <el-table-column label="操作" width="180px" v-if="rolerank">
                    <template v-slot:default="slotProps">
                        <!-- 查看 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="查看药品"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="primary"
                                icon="el-icon-user"
                                size="mini"
                                @click="showEditDialog(slotProps.row)"
                            ></el-button>
                        </el-tooltip>
                        <!--更改 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="更改药品"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="danger"
                                icon="el-icon-edit"
                                size="mini"
                                @click="editEditDialog(slotProps.row)"
                            ></el-button>
                        </el-tooltip>
                        <!-- 删除 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="删除药品"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="setRole(slotProps.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>

            <!-- 添加药品对话框 -->
            <el-dialog
                title="添加"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
            >
                <!-- 内容主体区域 -->
                <el-form
                    :model="addForm"
                    :rules="addFormRules"
                    ref="addFormRef"
                    label-width="70px"
                >
                    <el-form-item label="药品名" prop="drugName">
                        <el-input v-model="addForm.drugName"></el-input>
                    </el-form-item>
                    <el-form-item label="数量" prop="num">
                        <el-input v-model="addForm.num"></el-input>
                    </el-form-item>
                    <el-form-item label="单价" prop="price">
                        <el-input v-model="addForm.price"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 查看药品对话框 -->
            <el-dialog
                title="查看药品"
                :visible.sync="showDialogVisible"
                width="50%"
                @close="showDialogClosed"
            >
                <el-form
                    :model="showForm"
                    :rules="showFormRules"
                    ref="editFormRef"
                    label-width="70px"
                >
                    <el-form-item label="药品名" prop="drugName">
                        <el-input
                            v-model="showForm.drugName"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="数量" prop="num">
                        <el-input v-model="showForm.num" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model="showForm.price" disabled></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="showDialogVisible = false"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>

            <!-- 修改药品对话框 -->
            <el-dialog
                title="更改药品"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed"
            >
                <el-form
                    :model="editForm"
                    :rules="editFormRules"
                    ref="editFormRef"
                    label-width="70px"
                >
                    <el-form-item label="药品id">
                        <el-input v-model="editForm.drugId" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="药品名">
                        <el-input v-model="editForm.drugName"></el-input>
                    </el-form-item>
                    <el-form-item label="数量">
                        <el-input v-model="editForm.num"></el-input>
                    </el-form-item>
                    <el-form-item label="单价">
                        <el-input v-model="editForm.price"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="editUserInfo"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱规则
        let checkEmail = (rule, value, cb) => {
            const regEmail =
                /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (regEmail.test(value)) {
                // 合法邮箱
                return cb();
            }
            cb(new Error("邮箱格式错误"));
        };
        // 验证电话号码规则
        let checkMobile = (rule, value, cb) => {
            const regMobile = /^1[3456789]\d{9}$/;
            if (regMobile.test(value)) {
                // 合法手机号
                return cb();
            }
            cb(new Error("手机号格式错误"));
        };
        return {
            // 权限级别
            rolerank: false,
            // 获取药品列表参数对象
            queryInfo: {
                query: "",
                //当前页数
                pagenum: 1,
                //当前每页显示数据条数
                pagesize: 5,
            },
            seekvalue: "",
            userlist: [],
            total: 0,
            // 控制添加药品框的显示和隐藏
            addDialogVisible: false,
            // 添加药品的表单数据
            addForm: {},
            // 添加表单验证规则对象
            addFormRules: {},
            // 控制批量删除选择框得显示与隐藏
            deleteDialogVisible: false,
            deletecheckedUsers: [],
            // 控制查询对话框的显示与隐藏
            showDialogVisible: false,
            // 查询到的药品信息列表
            showForm: {},
            // 查询表单验证规则对象
            showFormRules: {
                email: [
                    {
                        required: true,
                        message: "请输入邮箱",
                        trigger: "blur",
                    },
                    { validator: checkEmail, trigger: "blur" },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机",
                        trigger: "blur",
                    },
                    { validator: checkMobile, trigger: "blur" },
                ],
            },
            // 控制修改对话框的显示与隐藏
            editDialogVisible: false,
            // 查询到的药品信息列表
            editForm: {},
            // 修改表单验证规则对象
            editFormRules: {
                email: [
                    {
                        required: true,
                        message: "请输入邮箱",
                        trigger: "blur",
                    },
                    { validator: checkEmail, trigger: "blur" },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机",
                        trigger: "blur",
                    },
                    { validator: checkMobile, trigger: "blur" },
                ],
            },
            // 需要被分配角色信息
            userinfo: {},
            // 所有角色数据列表
            rolesList: [],
            // 已选中角色id值
            selectedRoleId: "",
        };
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            let rank = window.sessionStorage.getItem("rolerank");
            if (rank == 1) {
                this.rolerank = true;
            }
            const { data: data } = await this.$http.get("drug/list", {
                params: {
                    pageNum: this.queryInfo.pagenum,
                    pageRow: this.queryInfo.pagesize,
                },
            });
            if (data.code == "200") {
                this.userlist = data.info.list;
                this.total = data.info.totalCount;
                return 1;
            } else {
                return this.$message.error("药品信息获取失败！");
            }
        },
        async seekUserList() {
            const { data: data } = await this.$http.get(
                "drug/listByDrugName",
                {
                    params: {
                        drugName: this.seekvalue,
                        pageNum: this.queryInfo.pagenum,
                        pageRow: this.queryInfo.pagesize,
                    },
                }
            );
            if (data.code == "200") {
                this.userlist = data.info.list;
                this.total = data.info.totalCount;
                return 1;
            } else {
                return this.$message.error("科室信息获取失败！");
            }
        },
        closeUserList() {
            this.getUserList()
        },
        //监听pagesize改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        //监听页码值改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        },
        //监听switch开关状态
        async userStateChanged(userinfo) {
            // const { data: res } = await this.$http.put(
            //     `users/${userinfo.id}/state/${userinfo.mg_state}`
            // );
            // if (res.meta.status !== 200) {
            //     userinfo.mg_state = !userinfo.mg_state;
            //     return this.$message.error("更新药品状态失败");
            // }
            // this.$message.success("更新药品状态成功");
        },
        // 监听药品框关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        // 点击按钮，添加药品
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid)
                    return this.$message.error("药品信息错误，添加药品失败");
                // 发起添加药品的网络请求
                const { data: data } = await this.$http.post(
                    "drug/addDrug",
                    this.addForm
                );
                if (data.code == "200") {
                    this.addDialogVisible = false;
                    this.getUserList();
                    return this.$message.success("添加药品成功！");
                }
                this.$message.error("添加药品失败！");
            });
        },
        //展示查看药品对话框
        showEditDialog(data) {
            this.showForm = data;
            this.showDialogVisible = true;
        },
        // 监听查看药品对话框的关闭事件
        showDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        //展示查看药品对话框
        editEditDialog(data) {
            this.editForm = data;
            this.editDialogVisible = true;
        },
        // 监听修改药品对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 修改药品信息并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid)
                    return this.$message.error("药品信息错误，修改药品失败");
                // 发起修改药品信息请求
                const { data: data } = await this.$http.post(
                    "drug/updateDrug",
                    {
                        drugId: this.editForm.drugId,
                        deleteStatus: "1",
                        drugName: this.editForm.drugName,
                        num: this.editForm.num,
                        price: this.editForm.price,
                    }
                );
                this.editDialogVisible = false;
                this.getUserList();
                this.$message.success("修改药品信息成功！");
            });
        },
        // 批量删除药品多选框
        handleCheckedUser(row, index) {
            return true;
        },
        handleSelectionChange(selection) {
            let dataarr = [];
            selection.filter((item) => {
                dataarr.push(item.departmentId);
                return item.departmentId;
            });
            this.deletecheckedUsers = dataarr;
        },
        // 批量删除药品
        async deleteUser() {
            const { data: data } = await this.$http.post(
                "drug/batchDeleteDrug",
                {
                    drugId: this.deletecheckedUsers,
                    deleteStatus: "2",
                }
            );
            this.getUserList();
            this.deleteDialogVisible = false;
        },
        // 重置删除药品表
        redeleteUser() {
            this.deletecheckedUsers = [];
            this.deleteDialogVisible = false;
        },
        //根据id删除对应药品信息
        async removeUserById(id) {
            const confirmResult = await this.$confirm(
                "是否删除该药品?",
                "删除药品",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            // 确定结果confirm 取消结果cancel
            if (confirmResult !== "confirm") {
                return this.$message.info("已取消删除");
            }
            const { data: res } = await this.$http.delete(`users/${id}`);
            if (res.meta.status !== 200) {
                return this.$message.error("删除药品失败！");
            }
            this.$message.success("药品已删除");
            this.getUserList();
        },
        // 单个删除
        async setRole(item) {
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const { data: data } = await this.$http.post(
                        "drug/updateDrug",
                        {
                            drugId: item.drugId,
                            deleteStatus: "2",
                            drugName: item.drugName,
                        }
                    );
                    if (data.code == "200") {
                        this.getUserList();
                        return 1;
                    }
                    this.$message.error("获取科室列表失败！");
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
    },
};
</script>

<style lang='less' scoped>
.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-select {
    width: 200px;
}
.deletecla {
    margin: 15px 0;
}
</style>
