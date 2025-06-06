<!-- 投放任务 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.task_name" clearable placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn(1)">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun('add')">新建任务</el-button>
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
        :current-page="queryData.page"
        :data="tableData"
        :height="cliHeight"
        :page-size="queryData.limit"
        :total="queryData.total"
        border
        element-loading-spinner="el-icon-loading"
        row-key="id"
        show-body-overflow="title"
        style="width: 100%;"
        use-virtual
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >

        <u-table-column :selectable="selectable" type="selection" width="55" />
        <u-table-column label="序号" type="index" width="60" />
        <u-table-column label="任务名称" min-width="120" prop="task_name">
          <template slot-scope="scope">
            {{ scope.row.task_name ? scope.row.task_name : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="投放金额" min-width="80" prop="amount" />
        <u-table-column label="素材分组" min-width="120" prop="material_group_name">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="投放链接" min-width="120" prop="link" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="消耗量" min-width="120" prop="consumption_num" />
        <u-table-column label="曝光量" min-width="120" prop="exposure_num" />
        <u-table-column label="点击量" min-width="120" prop="click_num" />
        <u-table-column label="状态" min-width="100" prop="status">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'status','table')">
              <span :class="[Number(queryData.status) >-1?'dropdown_title':'']" style="color:#909399">
                状态  <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in statusList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.status}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <el-tag :type="getLabelByVal(scope.row.status, statusList,{label:'type',value:'value'})" size="small">
              {{ getLabelByVal(scope.row.status, statusList) || '-' }}
            </el-tag>
          </template>
        </u-table-column>
        <u-table-column label="原因" min-width="100" prop="reason">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="所属用户" min-width="120" prop="faccount">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </u-table-column>
        <u-table-column label="操作" prop="operation" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="openDetailListFun(scope.row)">任务详情</el-button>
          </template>
        </u-table-column>
      </u-table>

      <div class="layui_page">
        <el-pagination
          :current-page.sync="queryData.page"
          :page-size="queryData.limit"
          :page-sizes="pageOption"
          :total="queryData.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="changePageSize($event,'table')"
          @current-change="changePageCurrent($event,'table')"
        />
      </div>

    </div>

    <!-- 添加 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="addModal.title"
      :visible.sync="addModal.show"
      center
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="addModal.formData.task_name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="投放金额" prop="amount">
          <el-input v-model="addModal.formData.amount" placeholder="请输入投放金额" />
        </el-form-item>
        <el-form-item label="素材分组:" prop="material_group_id">
          <el-select v-model="addModal.formData.material_group_id" clearable filterable placeholder="请选择素材分组">
            <el-option v-for="item in materialGroupList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="投放链接:" prop="link">
          <el-input v-model="addModal.formData.link" placeholder="请输入投放链接" />
        </el-form-item>
        <!--
        <el-form-item label="年龄:" prop="age">
          <el-checkbox-group v-model="addModal.formData.age">
            <el-checkbox label="1" name="age">13-17</el-checkbox>
            <el-checkbox label="2" name="age">18-24</el-checkbox>
            <el-checkbox label="3" name="age">25-34</el-checkbox>
            <el-checkbox label="4" name="age">35-44</el-checkbox>
            <el-checkbox label="5" name="age">45-54</el-checkbox>
            <el-checkbox label="6" name="age">55+</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <el-radio-group v-model="addModal.formData.gender">
            <el-radio label="1">全部</el-radio>
            <el-radio label="2">男</el-radio>
            <el-radio label="3">女</el-radio>
          </el-radio-group>
        </el-form-item>
        -->
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 详情列表 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="detailModal.show"
      center
      title="任务详情"
      width="85%"
      @close="closeDetailModal"
    >
      <!-- 筛选条件 -->
      <el-form :inline="true" size="small" style="margin-top: 10px;">
        <el-form-item>
          <el-input v-model="detailModal.queryData.tk_account" clearable placeholder="请输入TK账号" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="detailModal.queryData.credit_card_number" clearable placeholder="请输入信用卡" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="detailModal.queryData.do_main_url" clearable placeholder="请输入域名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="detailModal.queryData.order_id" clearable placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getDetailListFun(1)">{{ $t('sys_c002') }}</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQueryBtn(2)">{{ $t('sys_c049') }}</el-button>
        </el-form-item>
      </el-form>
      <u-table
        ref="detailTable"
        v-loading="detailModal.loading"
        :current-page="detailModal.queryData.page"
        :data="detailModal.data"
        :height="600"
        :page-size="detailModal.queryData.limit"
        :total="detailModal.queryData.total"
        border
        element-loading-spinner="el-icon-loading"
        row-key="id"
        show-body-overflow="title"
        style="width: 100%;"
        use-virtual
        @handlePageSize="switchPageDetail"
      >
        <u-table-column :selectable="selectable" type="selection" width="55" />
        <u-table-column label="序号" type="index" width="60" />
        <u-table-column label="TK账号" min-width="120" prop="tk_account" show-overflow-tooltip />
        <u-table-column label="素材" min-width="100" prop="material_url" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.material_url">
              <i class="el-icon-video-camera-solid file_content" @click.stop="openFileFun(scope.row)" />
            </span>
            <span v-else>-</span>
            <!-- {{ scope.row.material_url ? scope.row.material_url : '-' }} -->
          </template>
        </u-table-column>
        <u-table-column label="信用卡" min-width="150" prop="credit_card_number" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="视频ID" min-width="150" prop="video_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="域名" min-width="120" prop="do_main_url" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="活码链接" min-width="120" prop="live_link" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="订单号" min-width="120" prop="order_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="消耗量" min-width="120" prop="consumption_num" />
        <u-table-column label="曝光量" min-width="120" prop="exposure_num" />
        <u-table-column label="点击量" min-width="120" prop="click_num" />
        <u-table-column label="状态" min-width="100" prop="status">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'status','modal')">
              <span :class="[Number(detailModal.queryData.status) >0?'dropdown_title':'']" style="color:#909399">
                状态  <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in detailModal.statusList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===detailModal.queryData.status}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row.status, detailModal.statusList) || '-' }}
          </template>
        </u-table-column>
        <u-table-column label="原因" min-width="100" prop="reason">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </u-table-column>
      </u-table>
      <div class="layui_page">
        <el-pagination
          :current-page.sync="detailModal.queryData.page"
          :page-size="detailModal.queryData.limit"
          :page-sizes="pageOption"
          :total="detailModal.queryData.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="changePageSize($event,'modal')"
          @current-change="changePageCurrent($event,'modal')"
        />
      </div>

    </el-dialog>

    <!-- 视频弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="videoModal.title"
      :visible.sync="videoModal.show"
      center
      style="border-radius: 20px"
      width="25%"
      @close="closeVideoModal"
    >
      <div class="video_content">
        <VideoPlayer
          :autoplay="false"
          :src="videoModal.url"
        />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDetailListApi, getDataApi, addEditDataApi } from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp, getFileExtension } from '@/filters'
import { getMaterialListApi } from '@/views/content/materialApi';
import VideoPlayer from '@/components/VideoPlayer'

export default {
  name: 'GroupServer',
  components: {
    VideoPlayer,
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 100,
        total: 0,
        task_name: '',
        status: '-1'
      },
      pageOption: resetPage(),
      formData: {},
      tableData: [],
      cliHeight: 0,
      addModal: {
        show: false,
        title: '',
        type: 'add',
        formData: {
          amount: 19,
          material_group_id: '',
          material_group_name: '',
          link: '',
          /*
          age: [],
          gender: '1',
          */
        },
        cloneRow: {},
        rules: {
          task_name: [{ required: true, message: '请输入任务名称！', trigger: 'change' }],
          amount: [
            { required: true, message: '请输入投放金额！', trigger: 'change' },
            {
              required: true,
              validator: (rule, value, callback) => {
                const regNum = /^[0-9]\d*/;
                if (!regNum.test(value)) {
                  callback(new Error('请输入正整数'));
                } else if (value < 19) {
                  callback(new Error('投放金额必须大于等于19'));
                } else {
                  callback();
                }
              }
            }
          ],
          material_group_id: [{ required: true, message: '请选择素材分组！', trigger: 'change' }],
          link: [{ required: true, message: '请输入投放链接！', trigger: 'change' }],
          /*
          age: [{ type: 'array', required: true, message: '请至少选择一个年龄段', trigger: 'change' }],
          gender: [{ required: true, message: '请选择性别！', trigger: 'change' }],
           */
        }
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      loading: false,
      limit: 200,
      total: 0,
      isLoading: false,
      statusList: [
        {
          label: '全部',
          value: '0',
          type: '',
        },
        {
          label: '初始化',
          value: '1',
          type: '',
        },
        {
          label: '执行中',
          value: '2',
          type: '',
        },
        {
          label: '投放中',
          value: '3',
          type: '',
        },
        {
          label: '已结束',
          value: '4',
          type: 'success',
        },
      ],
      materialGroupList: [],
      detailModal: {
        show: false,
        loading: false,
        cloneRow: {},
        queryData: {
          page: 1,
          limit: 100,
          total: 0,
          tk_account: '',
          status: '0',
          credit_card_number: '',
          do_main_url: '',
          order_id: '',
        },
        data: [],
        statusList: [
          {
            label: '全部',
            value: '0',
          },
          {
            label: '待绑卡',
            value: '1',
          },
          {
            label: '绑卡中',
            value: '2',
          },
          {
            label: '待上传视频',
            value: '3',
          },
          {
            label: '视频上传中',
            value: '4',
          },
          {
            label: '待检查视频',
            value: '5',
          },
          {
            label: '视频检查中',
            value: '6',
          },
          {
            label: '待充值',
            value: '7',
          },
          {
            label: '充值中',
            value: '8',
          },
          {
            label: '待下单',
            value: '9',
          },
          {
            label: '下单中',
            value: '10',
          },
          {
            label: '任务关闭',
            value: '11',
          },
          {
            label: '下单成功',
            value: '12',
          },
          {
            label: '投放中',
            value: '13',
          },
          {
            label: '投放完成',
            value: '14',
          },
        ],
      },
      setBatchData: {
        show: false,
        title: '',
        type: -1,
      },
      batchOption: [
        {
          icon: 'delete',
          label: '批量删除'
        },
      ],
      videoModal: {
        title: '',
        show: false,
        url: ''
      },
    }
  },
  mounted() {
    this.getDataListFun(1); // 获取列表
    this.getGroupListFun(); // 分组列表
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
      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        task_name: this.queryData.task_name,
        status: Number(this.queryData.status) || -1,
      }

      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total
          this.tableData = res.data.list.map(item => {
            item.status = item.status ? String(item.status) : ''
            item.gender = item.gender ? String(item.gender) : ''
            return item
          });
          this.selectData = []
          this.selectIdData = []
        }
      })
    },
    // 对数据 禁用选择
    selectable(row, index) {
      return true// row.status === '4'
    },
    // 新建
    addOpenFun(type) {
      this.addModal.title = '新建任务'
      this.addModal.type = type
      this.addModal.show = true
    },
    // 详情
    openDetailListFun(row) {
      this.detailModal.show = true
      this.detailModal.cloneRow = deepClone(row)
      this.getDetailListFun(1)
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      setTimeout(() => {
        this.addModal.formData = {
          amount: 19,
          material_group_id: '',
          material_group_name: '',
          link: '',
          // age: [],
          // gender: '1',
        }
        this.$refs.refAddModal.resetFields();
      }, 500);
    },
    // 新建保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          const formData = deepClone(this.addModal.formData)
          formData.amount = Number(this.addModal.formData.amount)
          // formData.gender = Number(this.addModal.formData.gender)
          if (this.addModal.type === 'add') {
            formData.ptype = 1
          } else {
            formData.ptype = 2
          }
          addEditDataApi(formData).then(res => {
            if (res.msg === 'success') {
              successTips(this)
              this.closeModal()
              this.getDataListFun()
            }
          })
        }
      })
    },
    // 详情列表
    getDetailListFun(num) {
      this.detailModal.loading = true
      const params = {
        task_id: this.detailModal.cloneRow.id,
        page: num || this.detailModal.queryData.page,
        limit: this.detailModal.queryData.limit,
        status: Number(this.detailModal.queryData.status) || -1,
        tk_account: this.detailModal.queryData.tk_account,
        credit_card_number: this.detailModal.queryData.credit_card_number,
        do_main_url: this.detailModal.queryData.do_main_url,
        order_id: this.detailModal.queryData.order_id,
      }
      getDetailListApi(params).then(res => {
        if (res.msg === 'success') {
          this.detailModal.loading = false

          this.detailModal.data = res.data.list.map(item => {
            item.status = item.status ? String(item.status) : ''
            return item
          })
          this.detailModal.queryData.total = res.data.total
        }
      });
    },
    // 关闭详情列表
    closeDetailModal() {
      this.detailModal.show = false
      this.detailModal.queryData.tk_account = ''
    },
    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.type = command.idx
      if (command.item.label === '批量删除') {
        this.delDataFun()
      }
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
            addEditDataApi(formData).then(res => {
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
    // 预览视频
    openFileFun(row) {
      const suffixArr = ['mp4']
      const suffix = getFileExtension(row.material_url)
      if (suffixArr.includes(suffix)) {
        this.videoModal.show = true
        this.videoModal.title = row.material_name
        this.videoModal.url = row.material_url
      } else {
        successTips(this, 'error', '仅支持查看 .mp4 格式的视频')
      }
    },
    // 关闭视频弹窗
    closeVideoModal() {
      this.videoModal.show = false
      this.videoModal.title = ''
      this.videoModal.url = ''
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
      this.cliHeight = document.documentElement.clientHeight - 280;
    },
    // 单行点击
    rowSelectChange(row) {
      // const tableCell = this.$refs.serveTable;
      // if (this.selectIdData.includes(row.id)) {
      //   tableCell.toggleRowSelection([{ row: row, selected: false }]);
      //   return;
      // }
      // tableCell.toggleRowSelection([{ row: row, selected: true }]);
    },
    // 行内筛选项
    handleRowQuery(val, key, type) {
      if (type === 'table') {
        this.queryData[key] = val
        this.getDataListFun()
      } else if (type === 'modal') {
        this.detailModal.queryData[key] = val
        this.getDetailListFun();
      }
    },
    // 重置
    restQueryBtn(type) {
      switch (type) {
        case 1:
          this.queryData.task_name = ''
          this.queryData.status = -1
          this.getDataListFun(1)
          break;
        case 2:
          this.detailModal.queryData.tk_account = ''
          this.detailModal.queryData.credit_card_number = ''
          this.detailModal.queryData.do_main_url = ''
          this.detailModal.queryData.order_id = ''
          this.getDetailListFun(1)
          break;
      }
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getDataListFun();
      } else if (type === 'modal') {
        this.detailModal.queryData.limit = val;
        this.getDetailListFun();
      }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getDataListFun();
      } else if (type === 'modal') {
        this.detailModal.queryData.page = val;
        this.getDetailListFun();
      }
    },

    switchPageDetail({ page, size }) {
      this.loading = true;
      if (this.detailModal.queryData.limit !== size) {
        this.detailModal.queryData.page = 1;
      } else {
        this.detailModal.queryData.page = page;
      }
      this.detailModal.queryData.limit = size;
      this.getDetailListFun();
    },
    // 获取分组列表
    getGroupListFun() {
      const params = {
        page: 1,
        limit: 10000,
      }
      getMaterialListApi(params).then(res => {
        if (res.msg === 'success') {
          this.materialGroupList = []
          res.data.list.forEach(item => {
            const val = {
              id: item.id,
              name: item.name + '(' + item.count + ')'
            }
            if (item.count) {
              this.materialGroupList.push(val)
            }
          });
        }
      })
    },
    formatTimestamp,
    getLabelByVal

  }
}
</script>

<style lang="scss" scoped>
.addModalName {
  ::v-deep .el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

  }

  ::v-deep .el-form-item {
    width: 48%;
  }
}

.file_content {
  cursor: pointer;
  color: #0a76a4;
  text-decoration: underline;
  font-size: 25px;
}
</style>
