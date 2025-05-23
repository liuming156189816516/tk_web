<!-- 域名列表 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.host" clearable placeholder="请输入域名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
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
        <u-table-column type="index" :label="$t('sys_g020')" width="60" />
        <!--        <u-table-column type="selection" width="55" :reserve-selection="true"/>-->
        <u-table-column prop="do_main_url" label="域名" min-width="120" />
        <!--
        <u-table-column prop="expiration_time" show-overflow-tooltip label="到期时间" min-width="120">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.expiration_time) }}
          </template>
        </u-table-column>
        -->
        <u-table-column prop="ssl" label="Ssl证书" min-width="120" />
        <u-table-column prop="status" label="状态" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? '有效' : scope.row.status === 2 ? '即将失效' : '已失效' }}
          </template>
        </u-table-column>
        <u-table-column prop="itime" show-overflow-tooltip label="创建时间" min-width="120">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </u-table-column>
        <u-table-column prop="use_status" label="使用状态" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.use_status === 0 ? '未使用' : scope.row.use_status === 1 ? '使用中' : '已使用' }}
          </template>
        </u-table-column>
        <u-table-column prop="server_id" label="服务器" min-width="120" />
        <u-table-column prop="tk_account" label="Tk账号" min-width="120" />
        <u-table-column prop="reason" label="失效原因" min-width="120" />
        <u-table-column prop="ps" label="备注" min-width="120" />

      </u-table>
    </div>
  </div>
</template>

<script>
import { getDataApi } from './api';
import { resetPage } from '@/utils';
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
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 180;
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
