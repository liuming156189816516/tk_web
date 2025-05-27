<!-- 域名列表 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.do_main_url" clearable placeholder="请输入域名" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="tableContent">
      <u-table
        ref="serveTable"
        v-loading="loading"
        :current-page="queryData.page"
        :data="tableData"
        :height="cliHeight"
        :page-size="queryData.limit"
        :page-sizes="pageOption"
        :pagination-show="true"
        :total="queryData.total"
        border
        element-loading-spinner="el-icon-loading"
        row-key="id"
        show-body-overflow="title"
        style="width: 100%;"
        use-virtual
        @handlePageSize="switchPage"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <u-table-column :label="$t('sys_g020')" type="index" width="60" />
        <!--        <u-table-column type="selection" width="55" :reserve-selection="true"/>-->
        <u-table-column label="域名" min-width="120" prop="do_main_url" />
        <!--
        <u-table-column prop="expiration_time" show-overflow-tooltip label="到期时间" min-width="120">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.expiration_time) }}
          </template>
        </u-table-column>
        -->
        <u-table-column label="Ssl证书" min-width="120" prop="ssl" />
        <u-table-column label="状态" min-width="100" prop="status">
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? '有效' : scope.row.status === 2 ? '即将失效' : '已失效' }}
          </template>
        </u-table-column>
        <u-table-column label="使用状态" min-width="100" prop="use_status">
          <template slot-scope="scope">
            {{ scope.row.use_status ? '使用中' : scope.row.use_status === 2 ? '已使用' : '未使用' }}
          </template>
        </u-table-column>
        <u-table-column label="服务器" min-width="120" prop="server_id">
          <template slot-scope="scope">
            {{ scope.row.server_id ? scope.row.server_id : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="Tk账号" min-width="120" prop="tk_account">
          <template slot-scope="scope">
            {{ scope.row.tk_account ? scope.row.tk_account : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="失效原因" min-width="120" prop="reason">
          <template slot-scope="scope">
            {{ scope.row.reason ? scope.row.reason : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="所属用户" min-width="100" prop="faccount" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.faccount ? scope.row.faccount : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="备注" min-width="120" prop="ps">
          <template slot-scope="scope">
            {{ scope.row.ps ? scope.row.ps : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </u-table-column>

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
        do_main_url: '',
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
        do_main_url: this.queryData.do_main_url, // 域名 - 筛选项
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
      this.queryData.do_main_url = ''
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
