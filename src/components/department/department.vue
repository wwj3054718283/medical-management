<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>科室管理</el-breadcrumb-item>
            <el-breadcrumb-item>科室列表</el-breadcrumb-item>
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
                        >添加科室</el-button
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
            <!-- 科室列表区域 -->
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
                <el-table-column label="科室名" prop="departmentName">
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                </el-table-column>
                <el-table-column label="更改时间" prop="updateTime">
                </el-table-column>
                <el-table-column label="操作" width="180px" v-if="rolerank">
                    <template v-slot:default="slotProps">
                        <!-- 查看 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="查看科室"
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
                            content="更改科室"
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
                            content="删除科室"
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

            <!-- 添加科室对话框 -->
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
                    <el-form-item label="科室名" prop="departmentName">
                        <el-input v-model="addForm.departmentName"></el-input>
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

            <!-- 查看科室对话框 -->
            <el-dialog
                title="查看科室"
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
                    <el-form-item label="科室名" prop="departmentName">
                        <el-input
                            v-model="showForm.departmentName"
                            disabled
                        ></el-input>
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

            <!-- 修改科室对话框 -->
            <el-dialog
                title="更改科室"
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
                    <el-form-item label="科室id">
                        <el-input
                            v-model="editForm.departmentId"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="科室名">
                        <el-input v-model="editForm.departmentName"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="editDepartment"
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
            // 获取科室列表参数对象
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
            // 控制添加科室框的显示和隐藏
            addDialogVisible: false,
            // 添加科室的表单数据
            addForm: {
                username: "",
                password: "",
                nickname: "",
                sex: "",
                age: "",
                tel: "",
                address: "",
                roleIds: "",
            },
            // 添加表单验证规则对象
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: "请输入科室名",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 10,
                        message: "长度在 3 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur",
                    },
                    {
                        min: 6,
                        max: 15,
                        message: "长度在 6 到 15 个字符",
                        trigger: "blur",
                    },
                ],
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
            // 控制批量删除选择框得显示与隐藏
            deleteDialogVisible: false,
            deletecheckedUsers: [],
            // 控制查询对话框的显示与隐藏
            showDialogVisible: false,
            // 查询到的科室信息列表
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
            // 查询到的科室信息列表
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
            console.log(this.rolerank);
            const { data: data } = await this.$http.get("department/list", {
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
                return this.$message.error("科室信息获取失败！");
            }
        },
        async seekUserList() {
            const { data: data } = await this.$http.get(
                "department/listByDepartmentName",
                {
                    params: {
                        departmentName: this.seekvalue,
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
            // console.log(this.queryInfo);
            this.getUserList();
        },
        //监听页码值改变
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.queryInfo.pagenum = newPage;
            // console.log(this.queryInfo);
            this.getUserList();
        },
        //监听switch开关状态
        async userStateChanged(userinfo) {
            console.log(userinfo);
            // const { data: res } = await this.$http.put(
            //     `users/${userinfo.id}/state/${userinfo.mg_state}`
            // );
            // if (res.meta.status !== 200) {
            //     userinfo.mg_state = !userinfo.mg_state;
            //     return this.$message.error("更新科室状态失败");
            // }
            // this.$message.success("更新科室状态成功");
        },
        // 监听科室框关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        // 点击按钮，添加科室
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                // console.log(valid);
                // console.log(this.$refs.addFormRef.model);

                if (!valid)
                    return this.$message.error("科室信息错误，添加科室失败");
                // 发起添加科室的网络请求
                const { data: data } = await this.$http.post(
                    "department/addDepartment",
                    this.addForm
                );
                console.log(data);
                if (data.code == "200") {
                    this.$message.success("添加科室成功！");
                    this.addDialogVisible = false;
                    this.getUserList();
                    delete this.addForm.roleIds;
                    this.addForm.roleIds = "";
                    return 1;
                }
                this.$message.error("添加科室失败！");
            });
        },
        //展示查看科室对话框
        showEditDialog(data) {
            console.log(data);
            this.showForm = data;
            this.showDialogVisible = true;
        },
        // 监听查看科室对话框的关闭事件
        showDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        //展示查看科室对话框
        editEditDialog(departmentdata) {
            console.log(departmentdata);
            this.editForm = departmentdata;
            this.editDialogVisible = true;
        },
        async editDepartment() {
            const { data: data } = await this.$http.post(
                "department/updateDepartment",
                {
                    departmentName: this.editForm.departmentName,
                    deleteStatus: "1",
                    departmentId: this.editForm.departmentId,
                }
            );
            this.editDialogVisible = false;
            this.getUserList();
            this.$message.success("修改科室信息成功！");
        },
        // 监听修改科室对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 修改科室信息并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid)
                    return this.$message.error("科室信息错误，修改科室失败");
                // 发起修改科室信息请求
                // console.log(this.editForm);
                const { data: data } = await this.$http.post(
                    "department/updateDepartment",
                    {
                        departmentName: this.editForm.departmentName,
                        deleteStatus: "1",
                        departmentId: this.editForm.departmentId,
                    }
                );
                this.editDialogVisible = false;
                this.getUserList();
                this.$message.success("修改科室信息成功！");
            });
        },
        // 批量删除科室多选框
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
        // 批量删除科室
        async deleteUser() {
            console.log(this.deletecheckedUsers);
            const { data: data } = await this.$http.post(
                "department/batchDeleteDepartment",
                {
                    departmentId: this.deletecheckedUsers,
                    deleteStatus: "2",
                }
            );
            console.log(data);
            this.getUserList();
            this.deleteDialogVisible = false;
        },
        // 重置删除科室表
        redeleteUser() {
            this.deletecheckedUsers = [];
            this.deleteDialogVisible = false;
        },
        //根据id删除对应科室信息
        async removeUserById(id) {
            const confirmResult = await this.$confirm(
                "是否删除该科室?",
                "删除科室",
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
                return this.$message.error("删除科室失败！");
            }
            this.$message.success("科室已删除");
            this.getUserList();
        },
        // 删除单项
        async setRole(item) {
            console.log(item);
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const { data: data } = await this.$http.post(
                        "department/updateDepartment",
                        {
                            departmentName: item.departmentName,
                            departmentId: item.departmentId,
                            deleteStatus: "2",
                        }
                    );
                    console.log(data);
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
