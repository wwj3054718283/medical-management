<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片列表 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true"
                        >添加角色</el-button
                    >
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot:default="slotProps">
                        <el-row
                            :class="[
                                'bdbottom',
                                i1 === 0 ? 'bdtop' : '',
                                'vcenter',
                            ]"
                            v-for="(item1, i1) in slotProps.row.children"
                            :key="item1.id"
                        >
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag
                                    @close="
                                        removeRightById(slotProps.row, item1.id)
                                    "
                                    closable
                                >
                                    {{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for嵌套渲染二级权限 -->
                                <el-row
                                    :class="[
                                        i2 === 0 ? '' : 'bdtop',
                                        'vcenter',
                                    ]"
                                    v-for="(item2, i2) in item1.children"
                                    :key="item2.id"
                                >
                                    <el-col :span="6">
                                        <el-tag
                                            @close="
                                                removeRightById(
                                                    slotProps.row,
                                                    item2.id
                                                )
                                            "
                                            closable
                                            type="success"
                                        >
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                            closable
                                            type="warning"
                                            :class="[i3 === 0 ? '' : 'bdtop']"
                                            v-for="(
                                                item3, i3
                                            ) in item2.children"
                                            :key="item3.id"
                                            @close="
                                                removeRightById(
                                                    slotProps.row,
                                                    item3.id
                                                )
                                            "
                                        >
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName">
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc">
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template v-slot:default="slotProps">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="编辑角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                size="mini"
                                type="primary"
                                icon="el-icon-edit"
                                @click="showEditDialog(slotProps.row.id)"
                                >编辑</el-button
                            >
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="修改角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="removeRoleById(slotProps.row.id)"
                                >删除</el-button
                            >
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="修改角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                size="mini"
                                type="warning"
                                icon="el-icon-setting"
                                @click="showSetRightDialog(slotProps.row)"
                                >分配权限</el-button
                            >
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加角色区域 -->
            <el-dialog
                title="添加用户"
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
                    <el-form-item label="角色">
                        <el-input v-model="addForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model="addForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="addRole">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 角色编辑区域 -->
            <el-dialog
                title="角色编辑"
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
                    <el-form-item label="角色">
                        <el-input
                            v-model="editForm.roleName"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="roleDesc">
                        <el-input v-model="editForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="editRoleInfo"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>

            <!-- 分配权限区域 -->
            <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
                @close="setRightDialogClosed"
            >
                <!-- 树形控件 -->
                <el-tree
                    :data="rightslist"
                    :props="treeProps"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :default-checked-keys="defKeys"
                    ref="treeRef"
                ></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisible = true"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="allotRights"
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
        return {
            // 所有角色列表数据
            rolelist: [],
            // 角色编辑界面的展示与隐藏
            // 控制添加用户框的显示和隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                roleName: "",
                roleDesc: "",
            },
            // 添加表单验证规则对象
            addFormRules: {},
            editDialogVisible: false,
            // 角色编辑列表信息
            editForm: {},
            // 角色编辑验证规则
            editFormRules: {
                roleDesc: [
                    {
                        required: true,
                        message: "请输入角色描述",
                        trigger: "blur",
                    },
                ],
            },
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,
            // 所有权限数据
            rightslist: [],
            // 树形控件属性绑定
            treeProps: {
                label: "authName",
                children: "children",
            },
            // 默认选中的节点id值数组
            defKeys: [],
            // 当前即将分配权限的角色id
            roleId: "",
        };
    },
    created() {
        this.getRolesList();
    },
    methods: {
        // 获取所有角色的列表
        async getRolesList() {
            const { data: res } = await this.$http.get("roles");
            if (res.meta.status !== 200) {
                return this.$message.error("获取角色列表失败");
            }
            this.rolelist = res.data;
            // console.log(this.rolelist);
        },
        // 角色添加信息重置
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        async addRole() {
            const { data: res } = await this.$http.post("roles", this.addForm);
            if (res.meta.status !== 201) {
                this.$message.error("添加角色失败！");
            }
            this.$message.success("添加角色成功！");
            this.addDialogVisible = false;
            this.getRolesList();
        },
        // 角色编辑信息重置
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 角色编辑请求
        async editRoleInfo() {
            const { data: res } = await this.$http.put(
                `roles/${this.editForm.roleId}`,
                {
                    roleName: this.editForm.roleName,
                    roleDesc: this.editForm.roleDesc,
                }
            );
            if (res.meta.status !== 200) {
                return this.$message.error("编辑角色失败");
            }
            this.editDialogVisible = false;
            this.getRolesList();
            this.$message.success("编辑角色信息成功！");
        },
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(`roles/${id}`);
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error("查询数据失败");
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
            console.log(this.editForm);
        },
        async removeRoleById(id) {
            const confirmResult = await this.$confirm(
                "是否删除该角色?",
                "删除角色",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (confirmResult !== "confirm") {
                return this.$message.info("已取消删除");
            }
            const { data: res } = await this.$http.delete(`roles/${id}`);
            if (res.meta.status !== 200) {
                return this.$message.error("删除角色失败！");
            }
            this.$message.success("角色已删除");
            this.getRolesList();
        },
        // 根据ID删除对应权限
        async removeRightById(role, rightId) {
            // 提示
            const confirmResult = await this.$confirm(
                "此操作将永久删除该文件, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (confirmResult !== "confirm") {
                return this.$message.info("删除已取消！");
            }

            const { data: res } = await this.$http.delete(
                `roles/${role.id}/rights/${rightId}`
            );
            if (res.meta.status !== 200) {
                return this.$message.error("删除权限失败！");
            }
            role.children = res.data;
        },
        // 展示分配权限对话框
        async showSetRightDialog(role) {
            this.roleId = role.id;
            // 获取权限数据
            const { data: res } = await this.$http.get("rights/tree");
            if (res.meta.status !== 200) {
                return this.$message.error("所有权限数据获取失败！");
            }
            this.rightslist = res.data;
            // console.log(this.rightslist);

            // 递归获取三级权限id
            // this.defKeys = []
            // 下方监听方法setRightDialogClosed()

            this.getLeafKeys(role, this.defKeys);
            console.log(this.defKeys);
            this.setRightDialogVisible = true;
        },
        // 递归获取角色的三级权限id
        getLeafKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id);
            }
            node.children.forEach((item) => {
                this.getLeafKeys(item, arr);
            });
        },
        // 监听关闭对话框时清空defKeys
        setRightDialogClosed() {
            this.defKeys = [];
        },
        // 点击为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ];
            const idStr = keys.join(",");
            const { data: res } = await this.$http.post(
                `roles/${this.roleId}/rights`,
                { rids: idStr }
            );
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.message);
            }
            this.$message.success("权限分配成功!");
            this.getRolesList();
            this.setRightDialogVisible = false;
        },
    },
};
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-top: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
