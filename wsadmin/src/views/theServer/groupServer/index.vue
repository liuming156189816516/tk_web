<!-- 站群服务器 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.host" clearable placeholder="请输入服务器ip" />
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
      <el-form-item>
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
        <u-table-column type="selection" width="55" :reserve-selection="true" />
        <u-table-column type="index" :label="$t('sys_g020')" width="60" />
        <u-table-column prop="name" label="名称" min-width="100" />
        <u-table-column prop="host" label="服务器ip" min-width="150" />
        <u-table-column prop="database_name" label="数据库名称" min-width="100" />
        <u-table-column prop="port" label="数据库端口" min-width="120" />
        <u-table-column prop="database_user" show-overflow-tooltip label="数据库用户" min-width="100" />
        <u-table-column prop="database_pwd" show-overflow-tooltip label="数据库密码" min-width="100" />
        <u-table-column prop="api_key" show-overflow-tooltip label="ApiKey" min-width="100" />
        <u-table-column prop="itime" show-overflow-tooltip label="创建时间" min-width="100">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </u-table-column>
        <u-table-column prop="operation" show-overflow-tooltip label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="primary" style="margin-right: 15px" size="small" @click="domainNameFun(scope.row)">同步域名</el-button>
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
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addModal.formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="服务器ip:" prop="host">
          <el-input v-model="addModal.formData.host" placeholder="请输入服务器ip" />
        </el-form-item>
        <el-form-item label="数据库名称:" prop="database_name">
          <el-input v-model="addModal.formData.database_name" placeholder="请输入数据库名称" />
        </el-form-item>
        <el-form-item label="数据库端口:" prop="port">
          <el-input v-model="addModal.formData.port" placeholder="请输入数据库端口" />
        </el-form-item>
        <el-form-item label="数据库用户:" prop="database_user">
          <el-input v-model="addModal.formData.database_user" placeholder="请输入数据库用户" />
        </el-form-item>
        <el-form-item label="数据库密码:" prop="database_pwd">
          <el-input v-model="addModal.formData.database_pwd" placeholder="请输入数据库密码" />
        </el-form-item>
        <el-form-item label="ApiKey:" prop="api_key">
          <el-input v-model="addModal.formData.api_key" placeholder="请输入ApiKey" />
        </el-form-item>

        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDataApi, editDataApi, syncDoMainApi } from './api';
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
        host: '',
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
          name: '',
          host: '',
          database_name: '',
          port: '',
          database_user: '',
          database_pwd: '',
          api_key: '',
        },
        rules: {
          name: [{ required: true, message: '请输入标题！', trigger: 'change' }],
          host: [{ required: true, message: '请输入服务器ip！', trigger: 'change' }],
          database_name: [{ required: true, message: '请输入数据库名称！', trigger: 'change' }],
          port: [{ required: true, message: '请输入数据库端口！', trigger: 'change' }],
          database_user: [{ required: true, message: '请输入数据库用户！', trigger: 'change' }],
          database_pwd: [{ required: true, message: '请输入数据库密码！', trigger: 'change' }],
          api_key: [{ required: false, message: '请输入ApiKey！', trigger: 'change' }],
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
        host: this.queryData.host, // //服务器ip - 筛选项
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
    // 域名同步
    domainNameFun(row) {
      this.$confirm(`确认域名同步吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const params = {
              host: row.host,
              api_key: row.api_key,
            }
            syncDoMainApi(params).then(res => {
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
      this.queryData.host = ''
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

<style scoped>

</style>
