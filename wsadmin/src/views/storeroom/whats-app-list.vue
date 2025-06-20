<!-- 账号列表 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="model1.account" clearable placeholder="请输入账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="model1.device_id" clearable placeholder="请输入设备ID" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="model1.do_main_url" clearable placeholder="请输入域名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="model1.credit_card_number" clearable placeholder="请输入信用卡" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="model1.limit_err" multiple clearable filterable placeholder="请选择功能限制">
          <el-option v-for="item in limitErrList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="model1.faccount" clearable placeholder="请输入所属用户" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="initNumberList(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
      <div v-if="screenSelect.length>0" class="level_01_01">
        <div
          v-for="(item,idx) in screenSelect"
          v-if="item.label"
          :key="idx"
          class="level_01_02"
          @click="delScreen(idx)"
        >
          <span v-if="item.label">【{{ screenOptions[item.label].name }}】</span>
          <template v-if="!item.item">
            <span v-if="termOptions[item.blong]">{{ termOptions[item.blong] }}</span>
            <span v-if="item.reason">【{{ item.reason }}】</span>
          </template>
          <template v-else>
            【{{ $baseFun.resetTime(item.item[0]) }} ~ {{ $baseFun.resetTime(item.item[1]) }}】
          </template>
          <i class="el-icon-error" />
        </div>
      </div>
    </el-form>
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-dropdown trigger="click" @command="onlineHandle">
          <el-button type="primary"> 批量上线
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, idx) in onlineOption"
              :id="idx"
              :key="idx"
              :command="{item,idx}"
              :disabled="idx==0||checkIdArry.length==0"
            >
              {{ item }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(1,command)}">
          <el-button type="primary">全局配置项
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, idx) in baseConfigOption"
              v-show="item.label"
              :key="idx"
              :command="{item,idx}"
            >
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(2,command)}">
          <el-button type="primary">批量操作
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in betchOption" v-show="item.label" :key="idx" :command="{item,idx}">
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- 分组管理 -->
    <div class="continer_main">
      <div :class="[!showGroup?'group_mian_hide':'']">
        <div class="group_head_warp">
          <div class="group_head" @click="changeGroup(0, 'clear')">
            <i class="el-icon-d-arrow-left" @click="showGroup=false" />
            {{ $t('sys_g049') }} ({{ numGroupTotal }})
          </div>
          <div class="group_icon">
            <el-popover v-model="search_icon" placement="top" width="230">
              <p>
                <el-select
                  v-model="model1.group_name"
                  :placeholder="$t('sys_c053')"
                  clearable
                  filterable
                  size="small"
                  style="width:100%;"
                >
                  <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="search_icon=false">{{ $t('sys_c023') }}</el-button>
                <el-button size="mini" type="primary" @click="initNumberGroup">{{ $t('sys_c024') }}</el-button>
              </div>
              <i slot="reference" class="el-icon-search" style="margin-right: 10px;" />
            </el-popover>
            <el-popover v-model="addVisible" placement="top" width="230">
              <p>
                <el-input
                  v-model="group_name"
                  :placeholder="$t('sys_c112')"
                  maxlength="10"
                  show-word-limit
                  size="small"
                />
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="addVisible=false">{{ $t('sys_c023') }}</el-button>
                <el-button
                  :disabled="!group_name.trim()"
                  :loading="ipLoading"
                  size="mini"
                  type="primary"
                  @click="addGroup(0, 0)"
                >{{ $t('sys_c024') }}
                </el-button>
              </div>
              <i slot="reference" class="el-icon-plus" @click.stop="editGroup(0, 1)" />
            </el-popover>
          </div>
        </div>
        <el-button v-if="loadingGroup" :loading="true" class="loading_icon" type="primary" />
        <template v-else>
          <div :style="{height:(cliHeight-40)+'px'}" class="group_warp">
            <template v-if="numberGroupList.length>0">
              <transition-group name="fade">
                <div
                  v-for="(item, idx) in numberGroupList"
                  :key="idx"
                  :class="['group_item', model1.group_id === item.id ? 'group_active' : '']"
                  :draggable="true"
                  @click="changeGroup(item, idx)"
                  @dragstart="dragStart(idx)"
                  @drop="handleMoveSort(idx)"
                  @dragover.prevent
                >
                  <div class="group_name">
                    <i
                      :class="['left_icon', model1.group_id === item.id ? 'el-icon-folder-opened' : 'el-icon-folder']"
                      class="left_icon"
                    />
                    <span class="group_text">{{ item.name }}</span>
                    <span>({{ item.count }})</span>
                  </div>
                  <div class="group_icon">
                    <el-popover :key="idx" v-model="item.visible" placement="top" width="230">
                      <p>
                        <el-input
                          v-model="group_name"
                          :placeholder="$t('sys_c112')"
                          clearable
                          maxlength="10"
                          show-word-limit
                          size="small"
                        />
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.visible = false">{{
                          $t('sys_c023')
                        }}
                        </el-button>
                        <el-button
                          :disabled="!group_name.trim()"
                          :loading="ipLoading"
                          size="mini"
                          type="primary"
                          @click="addGroup(item, 2)"
                        >确定
                        </el-button>
                      </div>
                      <i slot="reference" class="el-icon-edit" @click.stop="editGroup(item, 2)" />
                    </el-popover>
                    <el-popconfirm
                      :cancel-button-text="$t('sys_c023')"
                      :confirm-button-text="$t('sys_c024')"
                      :title="$t('sys_c128')"
                      icon="el-icon-info"
                      @confirm="delGroup(item, idx)"
                    >
                      <i slot="reference" class="el-icon-delete" @click.stop />
                    </el-popconfirm>
                  </div>
                </div>
              </transition-group>
            </template>
            <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
          </div>
        </template>
      </div>
      <div class="group_continer" style="margin-left: 20px;">
        <div class="tab_check_warp">
          <span v-if="!showGroup" style="margin-right: 8px;cursor: pointer; color:#409eff;" @click="showGroup=true">
            <el-tooltip content="展开分组" effect="dark" placement="top">
              <i class="el-icon-d-arrow-right" />
            </el-tooltip>
          </span>
          <i class="el-icon-info" />
          <div v-html="$t('sys_mat007',{value:checkIdArry.length})" />
        </div>
        <u-table
          ref="serveTable"
          v-loading="loading"
          :data="accountDataList"
          :height="cliHeight"
          border
          element-loading-spinner="el-icon-loading"
          row-key="id"
          show-body-overflow="title"
          style="width: 100%;"
          use-virtual
          @selection-change="handleSelectionChange"
          @row-click="rowSelectChange"
          @sort-change="handleSortChange"
        >
          <!-- <u-table-column type="index" :label="$t('sys_g020')" width="60" /> -->
          <u-table-column :reserve-selection="true" type="selection" width="55" />
          <u-table-column label="头像" prop="head" width="80">
            <template slot-scope="scope">
              <el-avatar v-if="scope.row.head" :src="scope.row.head" />
              <el-avatar v-else icon="el-icon-user-solid" />
            </template>
          </u-table-column>
          <u-table-column label="账号" prop="account" width="100" />
          <u-table-column label="设备ID" prop="device_id" show-overflow-tooltip width="120">
            <template slot-scope="scope">
              {{ scope.row.device_id ? scope.row.device_id : '-' }}
            </template>
          </u-table-column>
          <u-table-column label="信用卡" min-width="100" prop="credit_card_number" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.credit_card_number ? scope.row.credit_card_number : '-' }}
            </template>
          </u-table-column>
          <u-table-column label="域名" min-width="100" prop="do_main_url">
            <template slot-scope="scope">
              {{ scope.row.do_main_url ? scope.row.do_main_url : '-' }}
            </template>
          </u-table-column>
          <u-table-column label="余额（u）" min-width="130" prop="balance" sortable="custom" />
          <u-table-column label="账号状态" min-width="100" prop="status">
            <template slot="header">
              <el-dropdown trigger="click" @command="(command) => handleNewwork(command,1)">
                <span :class="[model1.status ?'dropdown_title':'']" style="color:#909399"> {{ $t('sys_c022') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in accountOptions"
                    :key="idx"
                    :class="{'dropdown_selected':idx==model1.status}"
                    :command="idx"
                  >{{ item == '' ? $t('sys_l053') : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag :type="handleTag(scope.row.status)" size="small"> {{ accountOptions[scope.row.status] }}</el-tag>
            </template>
          </u-table-column>
          <u-table-column label="使用状态" min-width="100" prop="use_status">
            <template slot="header">
              <el-dropdown trigger="click" @command="(command) => handleNewwork(command,2)">
                <span :class="[model1.use_status >-1?'dropdown_title':'']" style="color:#909399"> 使用状态
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in statusList"
                    :key="index"
                    :class="{'dropdown_selected':item.value==model1.use_status}"
                    :command="item.value"
                  >{{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag :type="getLabelByVal(scope.row.use_status, statusList,{label:'type',value:'value'})" size="small">
                {{ getLabelByVal(scope.row.use_status, statusList) }}
              </el-tag>
            </template>
          </u-table-column>
          <u-table-column label="功能限制" min-width="180" prop="limit_err" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag size="small" type="danger">
                {{ getLabelArrByVal(scope.row.limit_err, limitErrList) || '-' }}
              </el-tag>
            </template>
          </u-table-column>
          <u-table-column label="原因" min-width="80" prop="reason">
            <template slot-scope="scope">
              {{ scope.row.reason ? scope.row.reason : '-' }}
            </template>
          </u-table-column>
          <u-table-column label="备注" prop="remark" show-overflow-tooltip width="100">
            <template slot-scope="scope">
              <div class="remark_ext">{{ scope.row.remark }}</div>
              <div @click.stop="editRemark(scope.row)">
                <i class="el-icon-edit" style="color: rgb(103, 194, 58); cursor: pointer;" />
              </div>
            </template>
          </u-table-column>
          <u-table-column label="所属用户" min-width="100" prop="faccount" />
          <u-table-column label="入库时间" prop="itime" show-overflow-tooltip width="150">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : '-' }}
            </template>
          </u-table-column>
          <u-table-column label="冻结时间" prop="freeze_time" show-overflow-tooltip width="150">
            <template slot-scope="scope">
              {{ scope.row.freeze_time > 0 ? $baseFun.resetTime(scope.row.freeze_time * 1000) : '-' }}
            </template>
          </u-table-column>
        </u-table>

        <div class="layui_page">
          <el-pagination
            :current-page.sync="model1.page"
            :page-size="model1.limit"
            :page-sizes="pageOption"
            :total="model1.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="homelHandleSize"
            @current-change="homeHandleCurrent"
          />
        </div>

      </div>
    </div>
    <!-- 设置IP -->
    <el-dialog
      :close-on-click-modal="false"
      :title="setIpName"
      :visible.sync="setIpModel"
      :width="'550px'"
      center
    >
      <el-form v-if="setIpModel" ref="refForm" :model="ipForm" :rules="ipRules" label-width="100px" size="small">
        <!-- 移动至其他分组 -->
        <template v-if="setIpType == 1">
          <el-form-item :label="$t('sys_c053') + ':'" label-width="140px" prop="group_id">
            <el-select
              v-model="ipForm.group_id"
              :placeholder="$t('sys_c053')"
              clearable
              filterable
              size="small"
              style="width:100%;"
            >
              <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="group_tips">一个账号只能存在于一个分组中！</div>
          </el-form-item>
        </template>

        <!-- 批量修改备注 -->
        <template v-if="setIpType == 5 ">
          <el-form-item label-width="0" prop="remock_text">
            <el-input
              v-model="ipForm.remock_text"
              :placeholder="$t('sys_mat021')"
              :rows="6"
              maxlength="50"
              show-word-limit
              size="small"
              type="textarea"
            />
          </el-form-item>
        </template>

        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;margin-top: 40px;">
          <el-button @click="setIpModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button
            :disabled="setIpType==99&&countryList.length==0"
            :loading="isLoading"
            type="primary"
            @click="submitSetBtn('refForm')"
          >确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 设置IP -->
    <el-dialog :close-on-click-modal="false" :title="blockTitle" :visible.sync="closeModel" center width="1000px">
      <el-form label-width="100px" size="small">
        <div class="add_inherit">
          <div class="table_group">
            <div class="group_head_warp">
              <div class="group_head" @click="changeCloseGroup(0,0)">
                {{ $t('sys_g049') }} ({{ numGroupTotal }})
              </div>
              <div class="group_icon">
                <el-popover v-model="close_icon" placement="top" width="230">
                  <p>
                    <el-select
                      v-model="close_group_name"
                      :placeholder="$t('sys_c053')"
                      clearable
                      filterable
                      size="small"
                      style="width:100%;"
                    >
                      <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.name" />
                    </el-select>
                  </p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="close_icon=false">{{ $t('sys_c023') }}</el-button>
                    <el-button size="mini" type="primary" @click="initNumberGroup">{{ $t('sys_c024') }}</el-button>
                  </div>
                  <i slot="reference" class="el-icon-search" />
                </el-popover>
              </div>
            </div>
            <el-button
              v-if="blockGroupLoading"
              :loading="true"
              class="loading_icon"
              style="margin-top: 10px;"
              type="primary"
            />
            <template v-else>
              <div class="group_warp">
                <template v-if="blockGroupList.length>0">
                  <div
                    v-for="(item, idx) in blockGroupList"
                    :key="idx"
                    :class="['group_item', titleGroupIdx == item.id ? 'group_active' : '']"
                    @click="changeCloseGroup(item, idx)"
                  >
                    <div class="group_name">
                      <i
                        :class="['left_icon', titleGroupIdx == item.id ? 'el-icon-folder-opened' : 'el-icon-folder']"
                        class="left_icon"
                      />
                      <span class="group_text">{{ item.name }}</span>
                      <span>({{ item.count }})</span>
                    </div>
                    <div class="group_icon" @click.stop>
                      <el-dropdown placement="top-start" size="small" trigger="click">
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item size="small">
                            <i class=" el-icon-user-solid" />
                            {{ $t('sys_c124') }}：{{ item.id }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </template>
                <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
              </div>
            </template>
          </div>
          <div class="table_ele">
            <div class="tab_check_warp">
              <i slot="reference" class="el-icon-info" />
              <div v-html="$t('sys_mat007',{value:blockCheckList.length})" />
            </div>
            <u-table
              ref="blockTable"
              v-loading="isBlockLoading"
              :data="blockAccountList"
              border
              element-loading-background="rgba(255, 255, 255,1)"
              element-loading-spinner="el-icon-loading"
              height="420"
              row-key="id"
              style="width:100%;"
              @selection-change="handleCloseChange"
              @row-click="rowCloseChange"
            >
              <u-table-column :reserve-selection="true" type="selection" width="40" />
              <u-table-column :label="$t('sys_g109')" min-width="140" prop="account" />
              <u-table-column :label="$t('sys_l057')" min-width="100" prop="account_type">
                <template slot="header">
                  <span style="color:#909399"> {{ blockType == 1 ? $t('sys_mat062') : $t('sys_l057') }}</span>
                </template>
                <template slot-scope="scope">
                  <span>{{ blockType == 1 ? scope.row.staff_no : accountType[scope.row.account_type] }}</span>
                </template>
              </u-table-column>
            </u-table>
            <div class="layui_page">
              <el-pagination
                :current-page.sync="blockPramse.page"
                :page-size="blockPramse.limit"
                :page-sizes="pageOption"
                :total="blockPramse.total"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="blockPageSize"
                @current-change="blockSwitchPage"
              />
            </div>
          </div>
        </div>
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;margin-top: 40px;">
          <el-button @click="closeModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button type="primary" @click="addBlockBtn">{{ $t('sys_c090') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { successTips, resetPage, getLabelByVal, getLabelArrByVal } from '@/utils/index'
import {
  getaccountinfolist,
  getaccountgrouplist,
  doaccountgroup,
  doupgroup,
  dofreedip,
  dooutputaccount,
  dobatchdelaccount,
  doupremark,
  dobatchfastlogin,
  dobatchlogout,
  getinheritaccountlist,
  sortgroup, dobatchaccountrefundApi, doaccountApi
} from '@/api/storeroom'

export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 100,
        total: 0,
        ipCtime: '',
        account: '',
        staff_no: '',
        group_id: '',
        work_status: '',
        custom_popover: '960px',
        select_sort: 'account',
        status: '',
        use_status: -1,
        staff_status: '',
        account_type: '',
        group_name: '',
        ip_category: '',
        expire_status: '',
        disable_status: '',
        credit_card_number: '',
        do_main_url: '',
        device_id: '',
        faccount: '',
        limit_err: [],
        sort: ''
      },
      cliHeight: 0,
      screenSelect: [],
      countryList: [],
      numGroupTotal: 0,
      accountDataList: [],
      numberGroupList: [],
      loading: false,
      closeModel: false,
      ipLoading: false,
      showGroup: true,
      setIpModel: false,
      checkIdArry: [],
      checkAccount: [],
      search_icon: false,
      loadingGroup: false,
      blockGroupLoading: false,
      isBlockLoading: false,
      setIpType: '',
      setIpName: '',
      ipForm: {
        id: '',
        ip_id: '',
        iptype: '',
        group_id: '',
        staff_name: '',
        use_status: 1,
        remock_text: '',
        allocat_role: 1,
        seat_type: 1,
        staffCheck: []
      },
      pageOption: resetPage(),
      offest: 1,
      limit: 200,
      total: 0,
      groupIdx: '',
      checkedNum: 0,
      isLoading: false,
      visible: false,
      addVisible: false,
      cardAcyive: '1',
      type: '',
      group_id: '',
      group_name: '',
      close_icon: '',
      close_group_name: '',
      titleGroupIdx: '',
      batchArry: [],
      staffCheck: [],
      blockType: null,
      blockAccount: [],
      inheritAccount: [],
      blockAccountList: [],
      groupForm: {
        id: '',
        account: '',
        group_id: '',
        title: '',
        content: ''
      },
      blockTitle: '',
      blockGroupList: [],
      blockCheckList: [],
      blockPramse: {
        group_id: '',
        offest: 1,
        limit: 10,
        total: 0
      },
      draggedItemIndex: 0,
      statusList: [
        {
          label: '全部',
          value: '-1',
          type: '',
        },
        {
          label: '未使用',
          value: '0',
          type: '',
        },
        {
          label: '使用中',
          value: '1',
          type: 'success',
        },
        {
          label: '不可用',
          value: '2',
          type: 'danger',
        },
      ],
      limitErrList: [
        {
          label: '小火苗',
          value: '1',
          type: '',
        },
        {
          label: '私发',
          value: '2',
          type: '',
        },
        {
          label: '上传视频',
          value: '3',
          type: 'success',
        },
        {
          label: '信用卡支付',
          value: '4',
          type: 'danger',
        },
        {
          label: '绑卡',
          value: '5',
          type: 'danger',
        },
      ]
    }
  },
  computed: {
    tableHrad() {
      return [
        this.$t('sys_g021'), this.$t('sys_g021'), this.$t('sys_g021'),
        this.$t('sys_g021'), this.$t('sys_g021'), this.$t('sys_g021'), this.$t('sys_g021'),
        this.$t('sys_g021'), this.$t('sys_g021'), this.$t('sys_g021'), this.$t('sys_g021'),
        this.$t('sys_g021'), this.$t('sys_g021'), this.$t('sys_g021'), this.$t('sys_g021'),
        this.$t('sys_g021'), this.$t('sys_g021'), this.$t('sys_g021'), this.$t('sys_g021')
      ]
    },
    ipRules() {
      return {
        use_status: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        expire_time: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        remock_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' }],
        iptype: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        ip_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        allocat_role: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        seat_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        staffCheck: [{ type: 'array', required: true, message: this.$t('sys_c052'), trigger: 'change' }],
      }
    },
    ipOptions() {
      return [
        {
          value: 1,
          label: '静态ip',
          children: [{
            value: 4,
            label: 'Ipv4'
          }, {
            value: 5,
            label: 'Ipv6'
          }]
        },
        {
          value: 2,
          label: '动态ip',
          children: [{
            value: 6,
            label: '动态住宅IP'
          }]
        }
      ]
    },
    blockOptions() {
      return ['', this.$t('sys_g111'), this.$t('sys_g112')]
    },
    isUseOptions() {
      return ['', this.$t('sys_g037'), this.$t('sys_g038')]
    },
    setOptions() {
      return ['', this.$t('sys_c064'), this.$t('sys_g039')]
    },
    accountType() {
      return ['', this.$t('sys_l067'), this.$t('sys_l068')]
    },
    accountOptions() {
      return ['', this.$t('sys_g032'), this.$t('sys_g033'), this.$t('sys_g034'), this.$t('sys_g035'), this.$t('sys_g036')]
    },
    screenOptions() {
      return [
        {}, { name: this.$t('sys_g022'), value: 1, check: false }, {
          name: this.$t('sys_g025'),
          value: 2,
          check: false
        },
        { name: this.$t('sys_l062'), value: 3, check: false }, { name: this.$t('sys_g015'), value: 4, check: false },
        { name: this.$t('sys_g014'), value: 5, check: false }, { name: this.$t('sys_g013'), value: 6, check: false }
      ]
    },
    termOptions() {
      return ['', this.$t('sys_g050'), this.$t('sys_g051'), this.$t('sys_g052'), this.$t('sys_g053')]
    },
    allPortList() {
      return [{ name: this.$t('sys_mat056'), num: 0 }, {
        name: this.$t('sys_mat057'),
        num: 0
      }, { name: this.$t('sys_mat058'), num: 0 }, { name: this.$t('sys_mat059'), num: 0 }]
    },
    selecSort() {
      return [
        {
          label: this.$t('sys_g011'),
          value: 'account'
        },
        {
          label: this.$t('sys_g013'),
          value: 'offline_time'
        },
        {
          label: this.$t('sys_g014'),
          value: 'first_login_time'
        },
        {
          label: this.$t('sys_g015'),
          value: 'item'
        }
      ]
    },
    onlineOption() {
      return [this.$t('sys_g028'), this.$t('sys_g029'), this.$t('sys_g030')]
    },
    betchOption() {
      return [
        {
          icon: 'bottom',
          label: '批量下线'
        },
        {
          icon: 'rank',
          label: '移至其他分组'
        },
        {
          icon: 'refresh',
          label: '释放ip'
        },
        {
          icon: 'download',
          label: '批量导出'
        },
        {
          icon: 'delete',
          label: '批量删除'
        },
        {
          icon: 'edit',
          label: '批量修改备注'
        },
        {
          icon: 'edit',
          label: '批量退款'
        },
        {
          icon: 'unlock',
          label: '解绑信用卡'
        },
        {
          icon: 'unlock',
          label: '解绑域名'
        }
      ]
    },
    baseConfigOption() {
      return [
        {}, {}, {}, {}, {}, {}, {}, {}, {},
        {
          icon: 'help',
          label: this.$t('sys_g055')
        }
      ]
    },
    moveRules() {
      return {
        checked_group: [{ required: true, message: this.$t('sys_c051'), trigger: 'change' }],
      }
    },
    groupRules() {
      return {
        title: [{ required: true, message: this.$t('sys_mat018'), trigger: 'blur' }],
        content: [{ required: true, message: this.$t('sys_mat020'), trigger: 'blur' }],
      }
    },
  },
  watch: {
    closeModel(val) {
      if (val == false) {
        this.blockPramse.offest = 1;
        if (this.$refs.blockTable) {
          this.$refs.blockTable.clearSelection();
        }
      }
    },
    setIpModel(val) {
      if (val == false) {
        this.$refs.refForm.resetFields();
        this.ipForm.iptype = '';
        this.ipForm.staffCheck = [];
        this.ipForm.group_id = '';
        this.ipForm.use_status = 1;
        this.ipForm.remock_text = '';
      }
    }
  },
  created() {
    //   this.syncInitApi();
    this.initNumberGroup();
    this.initNumberList();
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 设置页面高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 280;
    },
    // 修改备注
    editRemark(row) {
      this.setIpType = 5;
      this.setIpModel = true;
      this.ipForm.account = row.account;
      this.ipForm.remock_text = row.remark || '';
      this.setIpName = '修改备注';
    },
    // 获取分组列表数据
    async initNumberGroup() {
      this.loadingGroup = true;
      const { data } = await getaccountgrouplist({ name: this.model1.group_name, page: 1, limit: 100 });
      this.search_icon = false;
      this.loadingGroup = false;
      this.numGroupTotal = data.total;
      this.numberGroupList = data.list || []
    },
    // 主数据
    initNumberList(num) {
      this.loading = true;
      this.model1.page = num || this.model1.page;
      const limitErr = this.model1.limit_err.map(item => {
        return item * 1
      })
      const params = {
        page: this.model1.page,
        limit: this.model1.limit,
        account: this.model1.account, // 账号
        group_id: this.model1.group_id, // 分组
        sort: this.model1.sort, // 排序
        nick_name: '',
        reason: '',
        remark: '',
        reason_type: -1,
        remark_type: -1,
        nick_name_type: -1,
        itime_start_time: -1,
        itime_end_time: -1,
        first_login_start_time: -1,
        first_login_end_time: -1,
        offline_start_time: -1,
        offline_end_time: -1,
        status: this.model1.status || -1,
        use_status: this.model1.use_status === 0 ? 0 : this.model1.use_status || -1,
        staff_status: this.model1.staff_status || -1,
        work_status: this.model1.work_status || -1,
        account_type: this.model1.account_type || -1,
        credit_card_number: this.model1.credit_card_number,
        do_main_url: this.model1.do_main_url,
        device_id: this.model1.device_id,
        faccount: this.model1.faccount,
        limit_err: limitErr,
      }
      for (let k = 0; k < this.screenSelect.length; k++) {
        if (this.screenSelect[k].label == 1) {
          params.nick_name = this.screenSelect[k].reason;
          params.nick_name_type = this.screenSelect[k].blong
        }
        if (this.screenSelect[k].label == 2) {
          params.reason = this.screenSelect[k].reason;
          params.reason_type = this.screenSelect[k].blong
        }
        if (this.screenSelect[k].label == 3) {
          params.remark = this.screenSelect[k].reason;
          params.remark_type = this.screenSelect[k].blong
        }
        if (this.screenSelect[k].label == 4 && this.screenSelect[k].item) {
          const time1 = this.screenSelect[k].item;
          params.itime_start_time = this.$baseFun.resetTime(time1[0], 3)
          params.itime_end_time = this.$baseFun.resetTime(time1[1], 3)
        }
        if (this.screenSelect[k].label == 5 && this.screenSelect[k].item) {
          const time1 = this.screenSelect[k].item;
          params.first_login_start_time = this.$baseFun.resetTime(time1[0], 3)
          params.first_login_end_time = this.$baseFun.resetTime(time1[1], 3)
        }
        if (this.screenSelect[k].label == 6 && this.screenSelect[k].item) {
          const time1 = this.screenSelect[k].item;
          params.offline_start_time = this.$baseFun.resetTime(time1[0], 3)
          params.offline_end_time = this.$baseFun.resetTime(time1[1], 3)
        }
      }
      getaccountinfolist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.accountDataList = res.data.list.map(item => {
          item.use_status = item.use_status ? String(item.use_status) : '0'
          const limitArr = []
          if (item.limit_err) {
            item.limit_err.forEach(one => {
              limitArr.push(one.toString())
            })
          }
          item.limit_err = limitArr
          return item
        });
      })
    },
    // 重置 列表
    restQueryBtn() {
      this.model1.seat_id = 1;
      this.model1.account = '';
      this.model1.credit_card_number = '';
      this.model1.do_main_url = '';
      this.model1.device_id = '';
      this.model1.group_id = '';
      this.checkIdArry = [];
      this.checkAccount = [];
      this.screenSelect = [];
      this.model1.select_sort = 'account';
      this.model1.faccount = ''
      this.model1.sort = ''
      this.model1.limit_err = []
      this.initNumberList(1)
      this.$refs.serveTable.clearSelection();
      this.$refs.serveTable.clearSort()
    },
    // 批量操作
    handleCommand(num, command) {
      this.ipForm.account = '';
      this.blockAccount = [];
      this.inheritAccount = [];
      if (this.checkIdArry.length === 0 && command.idx !== 7 && command.idx !== 9) {
        return successTips(this, 'error', this.$t('sys_c126'));
      }
      this.setIpType = command.idx;
      this.setIpName = command.item.label;
      if (this.setIpType === 1 || this.setIpType === 5) {
        this.setIpModel = true;
        this.$nextTick(() => {
          this.$refs.refForm.resetFields();
        })
      } else {
        this.popConfirm();
      }
    },
    // 批量操作确认框
    popConfirm() {
      const that = this;
      that.$confirm(`确认${that.setIpName}吗？`, that.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            let reqApi;
            let params = {}
            if (that.setIpType === 100) {
              reqApi = dobatchfastlogin;
            } else {
              const allPost = [dobatchlogout, doupgroup, dofreedip, dooutputaccount, dobatchdelaccount, doupremark,dobatchaccountrefundApi, doaccountApi, doaccountApi]
              reqApi = allPost[that.setIpType]
            }
            console.log('reqApi', reqApi)
            params.accounts = that.checkAccount
            instance.confirmButtonLoading = true;
            if (that.setIpType === 6) { // 批量退款
              params = { accounts: this.checkIdArry, }
            }
            if (that.setIpType === 7 || that.setIpType === 8) { // 解绑信用卡1 // 解绑域名2
              params = {
                ptype: that.setIpType === 7 ? 1 : 2,
                ids: this.checkIdArry,
              }
            }
            reqApi(params).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code !== 0) return;
              that.initNumberList();
              that.$refs.serveTable.clearSelection();
              if (that.setIpType === 3) {
                window.location.href = res.data.url
              }
              if (that.setIpType === 4) {
                that.initNumberGroup();
              }

              successTips(that)
              done();
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        that.$message({ type: 'info', message: that.$t('sys_c048') });
      })
    },
    // 批量操作 弹窗确认
    submitSetBtn(formName) {
      this.$refs.refForm.validate((valid) => {
        if (valid) {
          const params = {}
          this.ipForm.account ? params.accounts = [this.ipForm.account] : params.accounts = this.checkAccount;
          if (this.setIpType === 0) {
            params.expire_time = Date.parse(this.$baseFun.resetTime(this.ipForm.expire_time)) / 1000;
          } else if (this.setIpType === 1) {
            params.group_id = this.ipForm.group_id // 移动分组
          } else if (this.setIpType === 5) {
            params.remark = this.ipForm.remock_text // 修改备注
          }
          let reqApi;
          this.isLoading = true;
          const allPost = [dobatchlogout, doupgroup, dofreedip, dooutputaccount, dobatchdelaccount, doupremark]
          // eslint-disable-next-line prefer-const
          reqApi = allPost[this.setIpType]
          reqApi(params).then(res => {
            this.isLoading = false;
            if (res.code != 0) return;
            this.setIpModel = false;
            if (this.setIpType == 1) {
              this.initNumberGroup();
            }
            this.initNumberList();
            this.$refs.serveTable.clearSelection();
            successTips(this)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 分页 切换
    homelHandleSize(val) {
      this.model1.limit = val;
      this.initNumberList();
    },
    // 页码
    homeHandleCurrent(val) {
      this.model1.page = val;
      this.initNumberList();
    },
    // 排序
    // 筛选项
    handleSortChange({ column, prop, order }) {
      if (order === 'descending') { // 下降 倒序
        switch (prop) {
          case 'balance': // 消耗量
            this.model1.sort = '-' + prop
            break;
        }
      } else if (order === 'ascending') { // 上升 = 正序
        switch (prop) {
          case 'balance': // 消耗量
            this.model1.sort = prop
            break;
        }
      } else {
        this.model1.sort = ''
      }
      this.initNumberList();
    },

    handleSelectionChange(arr) {
      this.checkIdArry = arr.map(item => {
        return item.id
      })
      this.checkAccount = arr.map(item => {
        return item.account
      })
    },
    rowCloseChange(row) {
      const refsElTable = this.$refs.blockTable;
      // let blockArry = this.blockType==1?this.blockAccount:this.inheritAccount;
      const findRow = this.blockCheckList.find(item => item.id == row.id);
      if (findRow) {
        refsElTable.toggleRowSelection([{ row: row, selected: false }]);
        return;
      }
      refsElTable.toggleRowSelection([{ row: row, selected: true }]);
    },
    rowSelectChange(row) {
      // const tableCell = this.$refs.serveTable;
      // if (this.checkIdArry.includes(row.id)) {
      //   tableCell.toggleRowSelection([{ row: row, selected: false }]);
      //   return;
      // }
      // tableCell.toggleRowSelection([{ row: row, selected: true }]);
    },
    handleNewwork(row, idx) {
      console.log('row', row)
      if (idx == 1) {
        this.model1.status = row;
      } else if (idx == 2) {
        this.model1.use_status = Number(row);
      } else if (idx == 3) {
        this.model1.account_type = row;
      } else if (idx == 4) {
        this.model1.staff_status = row;
      } else if (idx == 5) {
        this.model1.work_status = row;
      }
      this.initNumberList();
    },

    addScreen(type) {
      if (type == 1) {
        for (let x = 0; x < this.screenOptions.length; x++) {
          this.screenOptions[x].check = false;
        }
        this.screenSelect = [];
        this.initNumberList();
        return;
      }
      const newObj = { label: '', blong: 1, reason: '', item: '' }
      this.screenSelect.push(newObj)
      for (let x = 0; x < this.screenOptions.length; x++) {
        for (let l = 0; l < this.screenSelect.length; l++) {
          if (this.screenOptions[x].value == this.screenSelect[l].label) {
            this.screenOptions[x].check = true;
          }
        }
      }
    },
    delScreen(idx) {
      for (let k = 0; k < this.screenSelect.length; k++) {
        if (k === idx) {
          this.screenSelect.splice(k, 1);
          this.initNumberList();
        }
      }
    },
    editGroup(row, idx) {
      this.type = idx;
      this.group_name = '';
      if (idx == 1) return;
      this.groupForm.id = row.id;
      this.group_name = row.name;
    },
    addGroup(title) {
      const params = {
        ptype: this.type,
        name: this.group_name,
        type: Number(this.cardAcyive),
      }
      this.ipLoading = true;
      this.type == 2 ? params.id = this.groupForm.id : '';
        doaccountgroup(params).then(res => {
        if (res.code !== 0) {
          this.visible = false;
          this.ipLoading = false;
          this.addVisible = false;
        } else {
          this.visible = false;
          this.ipLoading = false;
          this.addVisible = false;
          this.initNumberGroup();
          successTips(this)
        }
      })
      // if (newBank.code !== 0) return;
      // this.visible = false;
      // this.ipLoading = false;
      // this.addVisible = false;
      // this.initNumberGroup();
      // successTips(this)
    },
    async delGroup(row) {
      const res = await doaccountgroup({ ptype: 3, del_id: [row.id] });
      if (res.code !== 0) return;
      this.groupIdx = 0;
      this.groupForm.group_id = '';
      successTips(this)
      for (let k = 0; k < this.numberGroupList.length; k++) {
        if (this.numberGroupList[k].id == row.id) {
          this.numberGroupList.splice(k, 1)
        }
      }
    },
    changeGroup(row, idx) {
      this.batchArry = [];
      this.checkedNum = 0;
      this.groupIdx = idx;
      this.model1.group_id = idx == 'clear' ? '' : row.id;
      if (idx == 'clear') {
        this.initNumberGroup()
      }
      this.initNumberList(1);
      this.$refs.serveTable.clearSelection();
    },
    onlineHandle(row) {
      this.ipForm.ip_id = '';
      for (let k = 0; k < this.onlineOption.length; k++) {
        if (k == row.idx) {
          this.setIpName = this.onlineOption[k];
          if (k == 1) {
            this.setIpType = 99;
          } else {
            this.setIpType = 100;
          }
        }
      }
      if (this.setIpType == 100) {
        this.popConfirm();
        return;
      }
      this.setIpModel = true;
      this.$nextTick(() => {
        this.$refs.refForm.resetFields();
        const _cascader = this.$refs.myCascader;
        _cascader.$refs.panel.activePath = [];
        _cascader.$refs.panel.checkedValue = [];
        _cascader.$refs.panel.syncActivePath()
      })
      this.countryList = [];
    },
    changeCloseGroup(row, idx) {
      this.titleGroupIdx = row ? row.id : '';
      this.blockPramse.group_id = row ? row.id : '';
      this.getBlockAccount();
    },
    async getBlockAccount(num) {
      this.isBlockLoading = true;
      this.blockPramse.offest = num || this.blockPramse.offest;
      const params = {
        ptype: this.blockType,
        page: this.blockPramse.offest,
        limit: this.blockPramse.limit,
        group_id: this.blockPramse.group_id
      }
      const { data } = await getinheritaccountlist(params);
      this.isBlockLoading = false;
      this.blockPramse.total = data.total;
      this.blockAccountList = data.list || [];
      const checkAccount = this.blockType == 1 ? this.blockAccount : this.inheritAccount;
      if (checkAccount.length == 0) return;
      const accountArry = checkAccount.map(item => {
        return item.account
      });
      for (let i = 0; i < this.blockAccountList.length; i++) {
        if (accountArry.indexOf(this.blockAccountList[i].account) > -1) {
          this.$nextTick(() => {
            this.$refs.blockTable.toggleRowSelection(this.blockAccountList[i], true);
          })
        } else {
          this.$nextTick(() => {
            this.$refs.blockTable.toggleRowSelection(this.blockAccountList[i], false);
          })
        }
      }
    },
    blockSwitchPage(page) {
      this.blockPramse.offest = page;
      this.getBlockAccount()
    },
    blockPageSize(limit) {
      this.blockPramse.limit = limit;
      this.getBlockAccount()
    },
    handleCloseChange(row) {
      this.blockCheckList = row.map(item => ({
        id: item.id,
        account: item.account,
        staff_no: item.staff_no,
        group_name: item.group_name
      }));
    },
    addBlockBtn() {
      if (this.blockCheckList.length > 0 && this.blockType == 1) {
        this.blockAccount = [];
        this.blockAccount = this.blockCheckList;
      }
      if (this.blockCheckList.length > 0 && this.blockType == 2) {
        this.inheritAccount = [];
        this.inheritAccount = this.blockCheckList;
      }
      this.closeModel = false;
    },
    handleTag(type) {
      let color;
      switch (type) {
        case 1:
          color = 'danger';
          break;
        case 2:
          color = 'success';
          break;
        case 3:
          color = 'warning';
          break;
        case 4:
          color = 'danger';
          break;
        case 5:
          color = 'warning';
          break;
        default:
          break;
      }
      return color;
    },
    dragStart(index) {
      this.draggedItemIndex = index;
    },
    async handleMoveSort(index) {
      const draggedItem = this.numberGroupList[this.draggedItemIndex];
      this.numberGroupList.splice(this.draggedItemIndex, 1);
      this.numberGroupList.splice(index, 0, draggedItem);
      this.draggedItemIndex = -1;
      const sortMap = this.numberGroupList.map(item => {
        return item.id
      });
      const res = await sortgroup({ list: sortMap });
      if (res.code != 0) return;
    },
    getLabelByVal,
    getLabelArrByVal
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  width: 100%;
  height: 118px;
  display: flex;
  flex-shrink: 0;
  position: relative;
  align-items: center;
  justify-content: space-between;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  & > div {
    flex: 1;
  }

  .refsh_icon {
    cursor: pointer;
    color: #409eff;
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .box_card_item {
    display: flex;
    cursor: pointer;
    padding: 6px;
    align-items: center;
    flex-direction: column;

    span {
      font-size: 16px;
    }

    .port_title {
      color: #409eff;
      font-size: 18px;
      margin-bottom: 20px;
    }
  }
}

.level_01 {
  display: flex;
  color: #C0C4CC;
  align-items: center;
  width: max-content;
  padding: 0 15px;
  cursor: pointer;
  position: relative;
  border-radius: 4px;
  border: 1px solid #DCDFE6;

  .level_01_1 {
    color: #606266;
    font-size: 13px;
    margin-left: 10px;
  }

  .screen_t_02 {
    width: 20px;
    height: 20px;
    color: #fff;
    display: flex;
    font-size: 12px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-left: 5px;
    background-color: #409eff;
  }

  .down_01 {
    width: 500px;
    height: 40px;
    position: absolute;
    top: 40px;
    left: 0;
    border-radius: 4px;
    border: solid 1px #dfe4ed;
    background-color: #FFFFFF;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .down_01_01 {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      top: -12px;
      left: 20%;
      transform: translateX(-50%);
      margin-right: 3px;
      border-bottom-width: 0;
      border-bottom-color: #e6ebf5;
      border-width: 6px;
      -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    }

    .down_01_01::after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
    }
  }
}

.level_01:hover {
  border-color: #C0C4CC;
}

.custom_popover {
  .screen_01 {
    color: #209cdf;
    display: flex;

    .screen_t_01 {
      display: flex;
      opacity: .7;
      align-items: center;
      cursor: pointer;

      i {
        margin-right: 5px;
      }
    }

    .screen_t_01:nth-child(1) {
      margin-right: 20px;
    }

    .screen_t_01:hover {
      opacity: 1;
    }
  }

  .select_02 {
    .el-icon-close {
      font-size: 14px;
      color: #f56c6c;
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.level_01_01 {
  width: 100%;
  display: flex;
  font-size: 12px;
  margin-bottom: 10px;

  .level_01_02 {
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 4px;
    width: max-content;
    margin-right: 10px;
    background-color: #ecf5ff;

    .el-icon-error {
      color: #409eff;
      font-size: 17px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}

::v-deep .el-form-item {
  margin-bottom: 10px;
}

::v-deep .el-radio-group {
  margin-top: -2px;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
}

.remark_ext {
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select_body {
  .select_ele {
    width: 130px;

    ::v-deep .el-input__inner {
      border-right: transparent;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .input_ele {
    width: 202px;

    ::v-deep .el-input__inner {
      border-left: transparent;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 1px solid #DCDFE6;
    }
  }
}

.continer_main {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .group_mian_hide {
    display: none;
  }

  .group_continer {
    width: 100%;
    overflow-x: auto;
  }
}

.group_tips {
  display: flex;
  color: #f56c6c;
  font-size: 12px;
  align-items: center;
  justify-content: center;
}

.group_head_warp {
  display: flex;
  width: 220px;
  height: 40px;
  flex-shrink: 0;
  position: relative;
  font-size: 14px;
  color: #606266;
  align-items: center;
  padding: 0 8px 0 15px;
  box-sizing: border-box;
  justify-content: space-between;
  background: #f5f7fa;

  .group_head {
    cursor: pointer;
    display: flex;
    align-items: center;

    .el-icon-d-arrow-left {
      color: #409eff;
      font-size: 18px;
      margin-right: 10px;
    }
  }

  .custom_popover {
    position: absolute;
    top: 280px;
    // position: absolute;
    // top: -80px;
  }

  .el-icon-setting {
    margin-left: 10px;
  }

  .group_icon {
    display: flex;

    i {
      cursor: pointer;
    }
  }
}

.group_warp {
  width: 220px;
  // max-height: 550px;
  overflow-y: auto;
  flex-shrink: 0;
  flex-wrap: wrap;

  .group_item {
    display: flex;
    width: 100%;
    flex-shrink: 0;
    height: 36px;
    margin-top: 8px;
    cursor: pointer;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 12px;

    .group_name {
      width: 80%;
      display: flex;
      align-items: center;

      .left_icon {
        margin-right: 6px;
      }

      .group_text {
        max-width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-icon-more,
    .el-icon-delete {
      margin-left: 10px;
      position: relative;

      .del_alert {
        //opacity: 0;
        width: 60px;
        padding: 10px;
        display: flex;
        position: absolute;
        top: 15px;
        left: -22px;
        z-index: 99999;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
        // background-color: darkgreen;
        border: 1px solid #ebeef5;;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        .del_arrow {
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          margin-right: 3px;
          border-bottom-width: 0;
          border-bottom-color: #ebeef5;
          border-width: 6px;
          filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
        }
      }
    }
  }

  .group_item:hover {
    background-color: #F5F8FA;
  }

  .group_active {
    background-color: #ebeef5;
  }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
  color: #67c23a;
  background-color: #f0f9eb;
}

.close_inherit, .add_inherit {
  display: flex;
  width: 100%;
  justify-content: center;

  .close_desc {
    display: flex;
    height: max-content;
    color: #606266;
    line-height: 1.4;
    font-size: 14px;
    padding: 10px;
    margin: 0 10px;
    border-radius: 10px;
    flex-direction: column;
    border: 1px solid #dcdcdc;
  }

  .footer_btn {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
}

.add_inherit {
  justify-content: space-between;

  .table_group {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .table_ele {
    width: 100%;
    height: 100%;
    // display: flex;
    flex-grow: 2;
    flex-direction: column;

    .tab_check_warp {
      margin: 12px 0 20px 10px;
    }
  }
}

.seat_class {
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 10px;

  .seat_item {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 5px;
    color: #409eff;
    background: #ecf5ff;
    border-radius: 4px;
    border: 1px solid #b3d8ff;
  }
}

.loading_icon {
  margin-top: 10px;
}
</style>
<style lang="scss">
.group_continer {
  .el-pagination {
    text-align: left !important;
  }
}

</style>
