<!-- 信用卡账号 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.user_id" clearable placeholder="请输入用户" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form size="small" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun">添加</el-button>
      </el-form-item>
      <el-form-item v-if="false">
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(command)}">
          <el-button type="primary"> {{ $t('sys_g018') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in batchOption" v-show="item.label" :key="idx" :command="{item,idx}">
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="tableContent">
      <u-table
        ref="serveTable"
        v-loading="loading"
        :data="tableData"
        row-key="id"
        use-virtual
        border
        :height="cliHeight"
        element-loading-spinner="el-icon-loading"
        style="width: 100%;"
        show-body-overflow="title"
        :total="queryData.total"
        :page-sizes="pageOption"
        :page-size="queryData.limit"
        :current-page="queryData.page"
        :pagination-show="true"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
        @handlePageSize="switchPage"
      >
        <!--  <u-table-column type="selection" width="55" :reserve-selection="true" /> -->
        <u-table-column type="index" :label="$t('sys_g020')" width="60" />
        <u-table-column prop="user_id" label="用户" min-width="100" />
        <u-table-column prop="pwd" label="密码" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.pwd ? scope.row.pwd : '-' }}
          </template>
        </u-table-column>
        <u-table-column prop="auth" show-overflow-tooltip label="授权" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.auth ? scope.row.auth : '-' }}
          </template>
        </u-table-column>
        <u-table-column prop="token" show-overflow-tooltip label="用户令牌" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.token ? scope.row.token : '-' }}
          </template>
        </u-table-column>
        <u-table-column prop="new_card_max_count" label="卡位数量" min-width="100" />
        <u-table-column prop="card_count" label="总卡片数量" min-width="100" />
        <u-table-column prop="usd_balance" label="账户美元余额" min-width="100" />
        <u-table-column prop="itime" show-overflow-tooltip label="创建时间" min-width="100">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </u-table-column>
        <u-table-column prop="operation" show-overflow-tooltip label="操作" width="500" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" class="btr" size="small" @click="loginCardFun(scope.row)">登录</el-button>
            <el-button type="primary" class="btr" size="small" @click="syncCardFun(scope.row)">同步卡账户</el-button>
            <el-button type="primary" class="btr" size="small" @click="batchCardFun(scope.row)">批量开卡</el-button>
            <el-button type="primary" class="btr" size="small" @click="syncCardListFun(scope.row)">同步卡列表</el-button>
            <el-button type="primary" size="small" @click="editOpenFun(scope.row)">编辑</el-button>
          </template>
        </u-table-column>
      </u-table>
    </div>
    <!-- 添加 编辑 -->
    <el-dialog
      :title="addModal.type==='add'?'新建':'编辑'"
      center
      :visible.sync="addModal.show"
      :close-on-click-modal="false"
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" size="small" :model="addModal.formData" label-width="120px" :rules="addModal.rules">
        <el-form-item label="用户" prop="name">
          <el-input v-model="addModal.formData.user_id" placeholder="请输入用户" />
        </el-form-item>
        <el-form-item label="密码:" prop="pwd">
          <el-input v-model="addModal.formData.pwd" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="授权:" prop="auth">
          <el-input v-model="addModal.formData.auth" placeholder="请输入授权" />
        </el-form-item>

        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 批量开卡 -->
    <el-dialog
      title="批量开卡"
      center
      :visible.sync="batchCardModal.show"
      :close-on-click-modal="false"
      width="500px"
      @close="closeBatchCardModal"
    >
      <el-form ref="refAddModal" size="small" :model="batchCardModal.formData" label-width="150px" :rules="batchCardModal.rules">
        <el-form-item label="开卡数量:" prop="open_count">
          <el-input v-model="batchCardModal.formData.open_count" placeholder="请输入开卡数量" />
        </el-form-item>
        <el-form-item label="单卡充值金额(美元):" prop="recharge_amount">
          <el-input v-model="batchCardModal.formData.recharge_amount" placeholder="请输入单卡充值金额(美元)" />
        </el-form-item>

        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="closeBatchCardModal">取消</el-button>
          <el-button :loading="batchCardModal.isLoading" type="primary" @click="submitBatchCard">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDataApi, editDataApi, loginCardApi, syncCardApi, batchCardApi, syncCardListApi } from './api';
import { deepClone, resetPage, successTips } from '@/utils';
import { formatTimestamp } from '@/filters'

export default {
  name: 'GroupServer',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 100,
        total: 0,
        user_id: '',
      },
      setBatchData: {
        show: false,
        title: '',
        type: -1,
        formData: {},
        rules: {}
      },
      pageOption: resetPage(),
      formData: {},
      tableData: [],
      cliHeight: 0,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          user_id: '',
          pwd: '',
          auth: '',
        },
        rules: {
          user_id: [{ required: true, message: '请输入用户！', trigger: 'change' }],
          pwd: [{ required: true, message: '请输入密码！', trigger: 'change' }],
          auth: [{ required: true, message: '请输入授权！', trigger: 'change' }],
        }
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      batchOption: [
        {
          icon: 'delete',
          label: '批量删除'
        },
      ],
      loading: false,
      limit: 200,
      total: 0,
      isLoading: false,
      batchCardModal: {
        show: false,
        type: 'add',
        cloneRow: '',
        formData: {
          open_count: '',
          recharge_amount: '',
        },
        rules: {
          open_count: [{ required: true, message: '请输入密码！', trigger: 'change' }],
          recharge_amount: [{ required: true, message: '请输入授权！', trigger: 'change' }],
        }
      }
    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 获取列表
    getDataListFun(num) {
      this.loading = true;
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        user_id: this.queryData.user_id, // //服务器ip - 筛选项
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = res.data.list || [];
        }
      })
    },
    // 新建
    addOpenFun() {
      this.addModal.type = 'add'
      this.addModal.show = true
    },
    editOpenFun(row) {
      console.log('row', row)
      this.addModal.show = true
      this.addModal.type = 'edit'
      this.addModal.formData = deepClone(row)
    },
    // 登录
    loginCardFun(row) {
      this.$confirm(`确认登录吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const params = {
              user_id: row.user_id,
              pwd: row.pwd,
              auth: row.auth,
            }
            loginCardApi(params).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },
    // 同步卡账户
    syncCardFun(row) {
      this.$confirm(`确认同步卡账户吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const params = {
              user_id: row.user_id,
            }
            syncCardApi(params).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },
    // 同步卡列表
    syncCardListFun(row) {
      this.$confirm(`确认同步卡列表吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const params = {
              user_id: row.user_id,
            }
            syncCardListApi(params).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },
    // 批量开卡
    batchCardFun(row) {
      this.batchCardModal.show = true
      this.batchCardModal.cloneRow = deepClone(row)
    },
    // 提交批量开卡
    submitBatchCard() {
      const params = {
        user_id: this.batchCardModal.cloneRow.user_id,
        open_count: this.batchCardModal.formData.open_count,
        recharge_amount: this.batchCardModal.formData.recharge_amount,
      }
      batchCardApi(params).then(res => {
        if (res.msg === 'success') {
          successTips(this)
          this.getDataListFun()
          this.closeBatchCardModal()
        }
      })
    },
    // 关闭批量开卡
    closeBatchCardModal() {
      this.batchCardModal.show = false
      this.batchCardModal.formData.open_count = ''
      this.batchCardModal.formData.recharge_amount = ''
    },
    // 新建保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          const formData = this.addModal.formData
          if (this.addModal.type === 'add') {
            formData.ptype = 1
          } else {
            formData.ptype = 2
          }
          editDataApi(formData).then(res => {
            if (res.msg === 'success') {
              this.closeModal()
              this.getDataListFun()
            }
          })
        }
      })
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      this.addModal.formData = {
        name: '',
        host: '',
        database_name: '',
        port: '',
        database_user: '',
        database_pwd: '',
        api_key: '',
      }
      this.$refs.refAddModal.resetFields();
    },
    // 删除
    delDataFun() {
      this.$confirm(`确认删除吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {
              ptype: 3,
              del_id: this.selectIdData,// 要删除与的id集合
            }
            editDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },
    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.type = command.idx
      if (command.idx === 0) {
        this.delDataFun()
      }
    },
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 260;
    },
    // 单行点击
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection([{ row: row, selected: false }]);
        return;
      }
      tableCell.toggleRowSelection([{ row: row, selected: true }]);
    },
    // 重置
    restQueryBtn() {
      this.selectIdData = [];
      this.queryData.user_id = ''
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
    },
    // 切换页码
    switchPage({ page, size }) {
      this.loading = true;
      if (this.queryData.limit !== size) {
        this.queryData.page = 1;
      } else {
        this.queryData.page = page;
      }
      this.queryData.limit = size;
      this.getDataListFun();
    },
    formatTimestamp

  }
}
</script>

<style scoped lang="scss">
.btr{
  margin-right: 8px
}

</style>
