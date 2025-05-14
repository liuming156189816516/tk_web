<template>
  <div class="">
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item class="select_body">
        <div style="display: flex;">
          <el-select class="select_ele" v-model="link_type" :placeholder="$t('sys_c052')" @change="link_url=''">
            <el-option v-for="(item, idx) in seatOption" :key="idx" :label="item" :value="idx" v-show="item != ''" />
          </el-select>
          <el-input clearable class="input_ele" :placeholder="$t('sys_mat021')" v-model="link_url" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getCounterList(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQuery">{{ $t('sys_c049') }}</el-button>
      </el-form-item>

      <el-form-item class="el-item-right">
        <el-button type="success" @click="creatOrder(99)">{{ $t('sys_rai042') }}</el-button>
        <el-button type="text" @click.stop>
          <el-dropdown @command="(command) => { handleWorkCommand(command) }" trigger="click">
            <el-button type="warning" :disabled="checkIdArry.length==0">{{ $t('sys_c129') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, idx) in batchOption" :key="idx" :command="{ item, idx }">
                {{ item }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button>
        <!-- <el-button type="warning" @click="exportText">批量操作功能</el-button> -->
        <el-button type="primary" @click="creatOrder(1)">{{ $t('sys_c130') }}</el-button>
      </el-form-item>
    </el-form>
    <div class="tab_check_warp">
        <i slot="reference" class="el-icon-info"></i>
        <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
    </div>
    <el-table :data="detailDataList" border height="660" ref="serveTable" v-loading="loading" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange" @row-click="rowSelectChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" :label="$t('sys_g020')" width="60" />
      <!-- <el-table-column prop="id" :label="$t('sys_g074')" minWidth="230" /> -->
      <el-table-column prop="id" :label="$t('sys_g074')" minWidth="230">
        <template slot-scope="scope">
          <span class="jump_un_link" @click.stop="jumpPower(scope.row,1)">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('sys_rai025')" minWidth="120" />
      <el-table-column prop="read_rate" :label="$t('sys_rai026')" minWidth="120">
        <template slot-scope="scope">
          {{ workOption[scope.row.work_type] }}
        </template>
      </el-table-column>
      <el-table-column prop="pwd_str" :label="$t('sys_rai027')+'/'+$t('sys_mat058')" minWidth="140">
          <template slot-scope="scope">
            {{ scope.row.online_num }}/{{ scope.row.account_num }}
          </template>
      </el-table-column>
      <el-table-column prop="distribute_num" :label="$t('sys_c063')" minWidth="160" />
      <el-table-column prop="fan_new_num" :label="$t('sys_rai028')" minWidth="160">
          <template slot-scope="scope">
            <span class="jump_un_link" @click.stop="jumpPower(scope.row,2)">{{ scope.row.fan_new_num }}</span>
          </template>
      </el-table-column>
      <el-table-column prop="to_day_fan_new_num" :label="$t('sys_rai029')" minWidth="160" />
      <el-table-column prop="remove_fan_num" :label="$t('sys_rai030')" minWidth="160" />
      <el-table-column prop="to_day_remove_fan_num" :label="$t('sys_rai031')" minWidth="160" />
      <el-table-column prop="repeat_num" :label="$t('sys_rai032')" minWidth="100" />
      <el-table-column prop="zeroing_time" :label="$t('sys_rai033')" minWidth="140" />
      <el-table-column prop="reset_time" :label="$t('sys_rai034')" minWidth="160">
        <template slot-scope="scope">
          {{scope.row.reset_time>0?$baseFun.resetTime(scope.row.reset_time*1000):"-" }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('sys_c010')" width="310">
        <template slot-scope="scope">
          <el-button :disabled="checkIdArry.length > 0" type="success" size="mini" @click.stop="copayHandle(scope.row,1)">{{ $t('sys_rai018') }}</el-button>
          <el-button :disabled="checkIdArry.length > 0" type="success" size="mini" @click.stop="copayHandle(scope.row,2)">{{ $t('sys_rai019') }}</el-button>
          <el-button type="text" size="mini" @click.stop>
            <el-dropdown @command="(command) => { handleCommand(scope.row, command) }" trigger="click">
              <el-button size="mini" type="warning" :disabled="checkIdArry.length > 0"> {{ $t('sys_c083') }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item size="mini" :disabled="checkIdArry.length > 0" v-for="(item, idx) in moreOption"
                  :key="idx" :command="{ item, idx }">
                  {{ item }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="layui_page">
      <el-pagination background @size-change="sizeHandle" @current-change="pageHandle" :page-sizes="pageOption"
        :current-page.sync="page" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="workTitle" center :visible.sync="workModel" :close-on-click-modal="false" :width="workWidth">
      <template v-if="workIdx==99">
        <div class="desc_list">
          <div class="desc_item" v-for="(item,idx) in descList" :key="idx">
            <h4>{{ item.title }}</h4>
            <p class="desc_t" v-for="(desc,key) in item.content" :key="key">{{ desc }}</p>
          </div>
        </div>
      </template>
      <template v-else>
        <el-form :model="workForm" :rules="workRules" ref="workForm" size="small" label-width="120px">
          <template v-if="workIdx == 1">
            <el-form-item :label="$t('sys_c131')" prop="work_name">
              <el-input v-model="workForm.work_name" maxlength="20" show-word-limit :placeholder="$t('sys_mat021')" />
            </el-form-item>
            <!-- <el-form-item label="单号单日目标：" prop="sleep1_num">
              <div class="number_01">
                <span class="number_03">
                  <el-input-number v-model="workForm.sleep1_num" type="number" :min="1" style="width: 120px;" />
                </span>
              </div>
              <div>表示每个号的单日目标且每天准时根据所选时间点将单日目标已完成数置零</div>
            </el-form-item>
            <el-form-item label="单号总目标：" prop="sleep2_num">
              <div class="number_01">
                <span class="number_03">
                  <el-input-number v-model="workForm.sleep2_num" type="number" :min="1" style="width: 120px;" />
                </span>
              </div>
              <div>表示每个号的总目标,不能小于单日目标</div>
            </el-form-item> -->
          </template>
          <template v-if="workIdx == 1||workIdx == 3">
            <el-form-item :label="$t('sys_mat067')+'：'" prop="restTimer" v-if="workModel">
              <el-time-select :placeholder="$t('sys_g117')" v-model="workForm.restTimer" :picker-options="pickerOption" />
              <div style="line-height: 1.2;margin-top: 5px;">{{ $t('sys_c132') }}</div>
            </el-form-item>
          </template>
          <template v-if="workIdx == 1||workIdx == 2">
            <el-form-item :label="$t('sys_rai026')+'：'" prop="work_type">
              <el-radio-group :disabled="workForm.work_id!=''" v-model="workForm.work_type" @change=clearAllSeat>
                <!-- <el-radio :label="2">{{ workOption[2] }}</el-radio> -->
                <el-radio v-for="(item, idx) in workOption" :key="idx" :label="idx" v-if="item!=''">
                  {{ item }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="账号类型：" prop="num_type">
              <el-radio-group v-model="workForm.num_type" @change="changeWorkType">
                <el-radio v-for="(item, idx) in bottonOption" :key="idx" :label="idx" v-if="item!=''">
                  {{ item }}
                </el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item :label="labelOption[workForm.work_type]+'：'" prop="staffCheck">
              <el-button type="primary" @click="showStaffModel">{{ bottonOption[workForm.work_type] }}</el-button>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;">
              <div class="seat_class">
                <div style="display: flex;justify-content: space-between;">
                  <div>
                    {{ $t('sys_g066') }}:<span style="color:#409eff;">{{ workForm.staffCheck.length }}</span>
                  </div>
                  <div style="color:#409eff;cursor: pointer;" @click="clearAllSeat">{{ $t('sys_g063') }}</div>
                </div>
                <div class="add_warp">
                  <el-button v-if="isWorkLoading" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true" />
                  <template v-else>
                    <div class="add_item" v-for="(item,idx) in workForm.staffCheck" :key="idx">
                      <span v-if="workForm.work_type==1">{{ item.account }}({{ item.name||'-' }},{{ $t('sys_mat077') }}:{{ item.account_num }})</span>
                      <span v-else>{{ item.account }}({{ item.staff_no||'-' }})</span>
                      <i class="el-icon-close" style="cursor: pointer;margin-left: 5px;" @click.stop="clearStaff(item)"></i>
                    </div>
                  </template>
                </div>
              </div>
            </el-form-item>
          </template>
          <template v-if="workIdx == 4">
            <el-form-item :label="$t('sys_g118')+'：'" label-width="180px" prop="link_time">
              <div class="number_01">
                <span class="number_03">
                  <el-input-number v-model="workForm.link_time" clearable type="number" :min="1" style="width: 120px;" />
                </span>
              </div>
            </el-form-item>
            <el-form-item :label="$t('sys_g120')+'：'" prop="work_pass">
              <el-input v-model="workForm.work_pass" clearable maxlength="6" show-word-limit />
              <div>{{ $t('sys_g119') }}</div>
            </el-form-item>
          </template>
          <template v-if="workIdx == 5">
            <el-form-item :label="$t('sys_g121')+'：'">
              <el-radio-group v-model="workForm.shunt_plant">
                <el-radio v-for="(item, idx) in shuntOption" :key="idx" :label="idx" v-show="idx!=0&&idx!=1">{{ item}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('sys_g122')+'：'">
              <el-select v-model="workForm.share_mode" :placeholder="$t('sys_c052')">
                <el-option :value="1" :label="modeOption[1]" />
                <!-- <el-option v-for="(item,idx) in modeOption" :key="idx" :value="idx" :label="item" v-if="item!=''" /> -->
              </el-select>
              <div style="line-height: 1.2;margin-top: 5px;">{{ $t('sys_c133') }}</div>
            </el-form-item>
            <!-- <el-form-item label="文本消息：" v-if="workForm.shunt_plant==2">
              <el-input type="textarea" :placeholder="$t('sys_rai049')" v-model="workForm.text" rows="5" maxlength="200" show-word-limit />
            </el-form-item> -->
          </template>
          <el-form-item label-width="0" style="text-align: center;">
            <el-button @click="workModel = false" id="taskConfig">{{ $t('sys_c023') }}</el-button>
            <el-button :loading="isLoading" type="primary" @click="submitWork('workForm')">{{ $t('sys_c024') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>

    <!-- 设置IP -->
    <el-dialog :title="setIpName" center :visible.sync="changeModel" :close-on-click-modal="false" width="860px">
      <el-form ref="ipForm" size="small" :model="ipForm" label-width="100px" :rules="ipRules">
        <div style="display: flex;justify-content: space-between;">
          <div>
            <div class="group_head_warp" @click="changeStaffGroup(1, 0)">
              <div class="group_head">
                {{ $t('sys_g049') }} ({{ staffGroupList.length }})
              </div>
            </div>
            <el-button v-if="loadingGroup" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true" />
            <template v-else>
              <div class="group_warp">
                <div v-for="(item, idx) in staffGroupList" :key="idx"
                  :class="['group_item', stsff_group_id === item.id ? 'group_active' : '']" @click="changeStaffGroup(item, idx)">
                  <div class="group_name">
                    <i class="left_icon"
                      :class="['left_icon', stsff_idx === idx ? 'el-icon-folder-opened' : 'el-icon-folder']" />
                    <span class="group_text">{{ item.name }}</span>
                    <span>({{ item.count }})</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div style="width: 100%;margin-left: 10px;">
            <div style="display: flex;">
              <el-input size="small" v-model="ipForm.staff_no" clearable @input="filterHandle($event)" :placeholder="$t('sys_c127',{value:$t('sys_mat062')})">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-input style="margin-left: 10px;" size="small" v-model="ipForm.account" clearable @input="filterHandle($event)" :placeholder="$t('sys_l006')">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <el-table ref="multipleTable" v-if="changeModel" :data="staffData" border height="460" row-key="account" @selection-change="handleStaffChange"
              style="width: 100;margin-top: 10px;" v-loading="bindLoading" element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255,1)" @row-click="rowWorkChange">
              <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="checkSelectable" />
              <el-table-column prop="date" :label="$t('sys_c134')">
                <template slot="header">
                  <span style="color:#909399">{{ $t('sys_l053') }} {{ $t('sys_c127',{value:currentNum}) }}</span>
                </template>
                <template slot-scope="scope">
                  <span v-if="workForm.work_type==1">
                    {{ scope.row.name }}({{ scope.row.account }},{{ $t('sys_mat077') }}:{{ scope.row.account_num }}){{ scope.row.desc }}
                  </span>
                  <span v-if="workForm.work_type==2">
                    {{ scope.row.account }}({{ scope.row.staff_no||"-" }}) {{ scope.row.desc }}
                  </span>
                </template>
                <!-- <template slot-scope="scope" v-if="workForm.work_type==2">
                  {{ scope.row.account }}({{ scope.row.staff_no }},描述:{{ scope.row.nick_name }})
                </template> -->
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px;">
              <el-pagination v-if="seatTotal>0" :current-page.sync="currentPage" :page-size="seatLimit" :page-sizes="pageOption"
              layout="total,sizes, prev, pager, next" :total="seatTotal" @size-change="seatSizeChange"  @current-change="seatChangePage" />
            </div>
          </div>
        </div>
        <el-form-item label-width="0" style="text-align:center;margin-top: 40px;" class="el-item-bottom">
          <el-button @click="changeModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button type="primary" @click="saveWorkBtn">{{ $t('sys_c024') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from 'clipboard';
import { getadmingrouplist } from '@/api/staff'
import { getaccountgrouplist } from '@/api/storeroom'
import { successTips, resetPage } from '@/utils/index'
import { getsendmsginfolist, doouttaskrecordexcel } from '@/api/task'
import { getworktasklist,getaccountlist,docreateworktask,doworkshunt,createShare,dobatchdelworktask,dobatchsetworktask,dobatchsetzeroingtime,doupworktask,cancelshare,setwordshare,setworkdiversion,getworkconf,getworkcustomerlist } from '@/api/counter'
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      workIdx:0,
      seatPage:1,
      seatLimit:10,
      seatTotal:0,
      currentPage:1,
      currentNum:0,
      account_status: "",
      status: "",
      sort: "",
      link_type: 1,
      link_url: "",
      setIpName: "",
      stsff_idx: "",
      workTitle:"",
      workWidth:"650px",
      numGroupTotal: "",
      loading: false,
      bindLoading: false,
      changeModel: false,
      isLoading: false,
      workModel: false,
      loadingGroup: false,
      isWorkLoading: false,
      stsff_group_id: "",
      detailDataList: [{ account: "22222" }, { account: "22222" }],
      checkIdArry: [],
      staffCheck: [],
      staffData: [],
      checkItem: [],
      checkAccount: [],
      statisticsList: [],
      staffGroupList: [],
      workCheckList: [],
      pageOption: resetPage(),
      task_name: "",
      task_id: "",
      task_config: "",
      copayConent: "",
      pickerOption: {
        start: '00:00',
        step: '00:15',
        end: '23:30'
      },
      workForm: {
        work_id: "",
        work_name: "",
        work_num: "",
        sleep1_num: "",
        sleep2_num: "",
        restTimer: "",
        work_type: 1,
        link_time:"",
        bind_seat: "",
        work_pass: "",
        staffCheck: [],
        share_mode: 1,
        shunt_plant: 3,
        text: "",
        num_type: 1
      },
      ipForm: {
        id: "",
        account: "",
        staff_no: "",
        staffCheck: []
      }
    }
  },
  computed: {
    seatOption() {
      return ["", this.$t('sys_rai025'), this.$t('sys_g074')]
    },
    modeOption() {
      return ["", this.$t('sys_rai047'), this.$t('sys_rai048')]
    },
    batchOption() {
      return ["",this.$t('sys_rai039',{value:this.$t('sys_rai038')}),this.$t('sys_rai045',{value:this.$t('sys_rai038')}),this.$t('sys_rai040',{value:this.$t('sys_mat067')})]
    },
    labelOption() {
      return ["", this.$t('sys_rai037'), this.$t('sys_mat015',{value:this.$t('sys_g027')})]
    },
    bottonOption() {
      return ["", this.$t('sys_mat015',{value:this.$t('sys_l017')}), this.$t('sys_mat015',{value:this.$t('sys_g027')})]
    },
    moreOption() {
      return ["", this.$t('sys_rai024'), this.$t('sys_rai020'), this.$t('sys_rai021'), this.$t('sys_rai022'), this.$t('sys_rai023')]
    },
    workOption() {
      return ["", this.$t('sys_rai035'), this.$t('sys_rai036')]
    },
    ipRules() {
      return {
        staffCheck: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
      }
    },
    shuntOption() {
      return ["", this.$t('sys_g088'), this.$t('sys_g089'), this.$t('sys_g090')]
    },
    workRules() {
      return {
        work_name: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_rai025')}), trigger: 'blur' }],
        sleep1_num: [{ required: true, message: this.$t('sys_c052'), trigger: 'blur' }],
        sleep2_num: [{ required: true, message: this.$t('sys_c052'), trigger: 'blur' }],
        restTimer: [{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_mat067')}), trigger: 'change' }],
        work_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        staffCheck: [{type: 'array',required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        link_time: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_rai075')}), trigger: 'blur' }],
        work_pass: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_c016')}), trigger: 'blur' }],
        num_type: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_c016')}), trigger: 'blur' }]
      }
    },
    descList(){
      return [
        {
          title:"一、新粉总数：",
          content:[
            "1、统计移入该工单后所有席位进粉总数。（工单重粉不计入，移入工单前已添加粉丝不计入）",
            "2、席位从工单移出后该席位进粉数量从总进粉数扣除（席位移出工单的粉丝计入移除席位总进粉数中）",
            "3、重置工单后总进粉数清零",
          ]
        },
        {
          title:"二、今日新粉数：",
          content:[
            "1、统计移入该工单后所有席位在上一次置零时间至当前时间段的进粉数量。（席位重粉不计入，移入工单前已添加粉丝不计入）",
            "2、席位从工单移出后该席位上一次置零时间至当前时间段内进粉数量从当日进粉数中扣除（该部分粉丝计入移除席位当日进粉数中）",
            "3、重置工单后当日进粉数清零",
            "4、每日到达【当日置零时间】时重置清零，重新统计。"
          ]
        },
        {
          title:"三、移除主号新粉总数：",
          content:[
            "1、工单上一次重置时间（如无则工单创建时间）~当前时间段内所有移除席位在工单内的进粉总数。（席位重粉不计入，移入工单前已添加粉丝不计入）",
            "2、重置工单后移除席位总进粉数清零"
          ]
        },
        {
          title:"四、移除主号今日新粉数：",
          content:[
            "1、被移除的主号在上一次【当日置零时间】~当前时间段内本工单统计的进粉数量。",
            "2、重置工单后当日进粉数清零",
            "3、每日到达【当日置零时间】时重置清零，重新统计。",
            "4、席位移除出工单与主号移除出席位都视为移除主号",
          ]
        },
        {
          title:"五、当日置零时间",
          content:[
            "1、当日置零时间影响【今日新粉数】、【移除主号今日新粉数】统计数量"
          ]
        },
        {
          title:"六、计数器工单重置：",
          content:[
            "1、计数器工单重置后，所有统计数据清零并且重新开始计算！"
          ]
        },
        {
          title:"七、账号如不在席位内，无法统计进粉，不在席位内账号分流链接不会分流",
          content:[]
        }
      ]
    }
  },
  created() {
    if (JSON.stringify(this.$route.query) != "{}") {
      this.link_type = 2;
      this.link_url = this.$route.query.workId;
    }
    this.getCounterList()
  },
  methods: {
    restQuery() {
      this.page = 1;
      this.link_type = 1;
      this.link_url = "";
      this.getCounterList(1);
    },
    checkSelectable(row){
      if (row.is_select == 2) {
        return false;
      }else{
        return true;
      }
    },
    getCounterList(num){
      let params = {
        page: this.page,
        limit: this.limit,
      }
      this.detailDataList=[];
      this.page = num?num:this.page;
      if (this.link_url&&this.link_type==1) {
        params.name=this.link_url;
      }else if (this.link_url&&this.link_type==2){
        params.id=this.link_url;
      }
      this.loading=true;
      getworktasklist(params).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.detailDataList = res.data.list || [];
      })
    },
    creatOrder(idx) {
      this.workIdx = idx;
      this.workModel = true;
      this.workWidth="650px";
      this.stsff_group_id="";
      this.workTitle=idx==1?this.$t('sys_rai041'):this.$t('sys_rai042');
      if (idx != 1) return;
      this.$nextTick(() => {
        this.$refs.workForm.resetFields();
        this.workForm.work_id="";
        this.workForm.work_name="";
        this.workForm.restTimer="";
        this.workForm.work_type=1;
        this.workForm.workCheckList="";
      })
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => { return item.id })
    },
    rowSelectChange(row, column, event) {
      let refsElTable = this.$refs.serveTable;
      let findRow = this.checkIdArry.find(item => item == row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row,true);
    },
    rowWorkChange(row, column, event) {
      let findRow;
      let refsElTable = this.$refs.multipleTable;
      if (this.workForm.work_type==1) {
        findRow = this.checkItem.filter(item => item.customer_uid == row.uid);
      }else{
        findRow = this.checkItem.filter(item => item.account == row.account);
      }
      if (findRow.length>0) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row,true);
    },
    changeWorkType(){
      this.clearAllSeat();
    },
    changeStaffGroup(row, idx) {
      this.workIdx = 0;
      this.seatPage = 1;
      this.currentPage = 1;
      this.stsff_idx = idx;
      this.stsff_group_id = row.id;
      this.getStaffList();
    },
    async showStaffModel() {
      this.staffData = [];
      this.seatLimit = 10;
      this.stsff_group_id="";
      this.staffGroupList = [];
      this.changeModel = true;
      await this.getStaffGroup();
      if (this.workForm.staffCheck.length == 0) return;
      let accountArry = this.workForm.staffCheck.map(item=>{return item.account});
      for (let i = 0; i < this.staffData.length; i++) {
        if (accountArry.indexOf(this.staffData[i].account) > -1) {
          this.$nextTick(()=>{
            this.$refs.multipleTable.toggleRowSelection(this.staffData[i], true);
          })
        } else {
          this.$nextTick(()=>{
            this.$refs.multipleTable.toggleRowSelection(this.staffData[i], false);
          })
        }
      }
    },
    async getStaffGroup() {
      this.loadingGroup = true;
      const httpGroup = ["",getadmingrouplist,getaccountgrouplist];
      const {data} = await httpGroup[this.workForm.work_type]({ page: 1, limit: 100 });
      this.loadingGroup = false;
      this.staffGroupList = data.list || [];
      await this.getStaffList();
    },
    async getStaffList() {
      this.bindLoading=true;
      const httpGroup = ["",getworkcustomerlist,getaccountlist];
      let params = {
        page:this.seatPage,
        limit:this.seatLimit,
        group_id:this.stsff_group_id,
        staff_no:this.ipForm.staff_no,
        account:this.ipForm.account 
      }
      const res = await httpGroup[this.workForm.work_type](params);
      let data = res.data;
      this.bindLoading=false;
      this.seatTotal = data.total;
      this.staffData = data.list || [];
    },
    handleStaffChange(row) {
      this.currentNum = 0;
      this.checkItem = [];
      let shortItem = [];
      if (this.workForm.work_type==1) {
        shortItem = row.map(item => ({account:item.account,name:item.name,customer_uid:item.uid,account_num:item.account_num}));
      }else{
        shortItem = row.map(item => ({account:item.account,staff_no:item.staff_no}));
      }
      let recordList = this.workForm.staffCheck.map(item=>{return item.account});
      for (let k = 0; k < shortItem.length; k++) {
        if (recordList.indexOf(shortItem[k].account) == -1) {
          this.checkItem.push(shortItem[k])
          this.currentNum++;
        }
      }
      let currentCheck = row.map(item=>{return item.account});
      if (currentCheck.length == this.workForm.staffCheck) {
        for (let k = 0; k < this.workForm.staffCheck.length; k++) {
          if (currentCheck.indexOf(this.workForm.staffCheck[k].account) == -1) {
            this.workForm.staffCheck.splice(k,1);
          }
        }
      }
      this.$refs.workForm.clearValidate('staffCheck');
    },
    saveWorkBtn(){
      this.workForm.staffCheck = [...this.workForm.staffCheck,...this.checkItem];
      this.changeModel = false;
    },
    filterHandle(keyword){
      this.seatPage = 1;
      this.currentPage = 1;
      this.getStaffList();
    },
    async seatSizeChange(val){
      this.seatLimit = val;
      await this.getStaffList();
    },
    async seatChangePage(val){
      this.seatPage = val;
      await this.getStaffList();
      // await this.showStaffModel();
    },
    clearStaff(row) {
      for (let k = 0; k < this.workForm.staffCheck.length; k++) {
        if (this.workForm.staffCheck[k].account == row.account) {
          this.workForm.staffCheck.splice(k, 1)
        }
      }
      if (this.workForm.staffCheck.length == 0) {
        this.clearAllSeat();
      }
    },
    clearAllSeat() {
      this.workForm.staffCheck = [];
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    getDetailList(num) {
      this.loading = true;
      this.page = num ? num : this.page;
      let params = {
        page: this.page,
        limit: this.limit,
        account: this.task_name,
        task_id: this.task_id,
        account_status: this.account_status || -1,
        status: this.status || -1,
        sort: this.sort
      }
      getsendmsginfolist(params).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.detailDataList = res.data.list || [];
      })
    },
    handleWorkCommand(row){
      if (row.idx == 1 || row.idx == 2) {
        this.dialogHandle(row,0,row.idx);
      }
      if (row.idx == 3) {
        this.workWidth="450px";
        this.workIdx = row.idx;
        this.workTitle = row.item;
        this.workModel = true;
      }
    },
    async handleCommand(row,command) {
      this.workIdx = command.idx+1;
      this.workForm.work_id=row.id;
      this.workForm.work_type=row.work_type;
      if (command.idx == 1) {
        this.workWidth="650px";
        this.workIdx = command.idx;
        this.workForm.work_name=row.name;
        this.workTitle = this.$t('sys_rai050');
        this.workForm.restTimer=row.zeroing_time;
        this.workForm.workCheckList=row.work_type;
        this.getRecordList(row.id);
        this.workModel = true;
      }else if(command.idx == 2){
        this.dialogHandle(row,1,command.idx);
      }else if(command.idx == 3||command.idx == 4){
        this.workWidth="500px";
        this.workTitle = row.item;
        this.getWorkConfig();
        this.workModel = true;
      }else if(command.idx == 5){
        this.$router.push({path:'/counter-account-allocation',query:{workId:row.id}});
      }
    },
    async getRecordList(id){
      let reqApi = ["",getworkcustomerlist,getaccountlist];
      this.isWorkLoading = true;
      const { data } = await reqApi[this.workForm.work_type]({work_id:id});
      this.isWorkLoading = false;
      if (this.workForm.work_type == 1) {
        this.workForm.staffCheck = data.list.map(item => ({ account:item.account,name:item.name,customer_uid:item.uid,account_num:item.account_num }));
      }else{
        this.workForm.staffCheck = data.list.map(item => ({ account:item.account,staff_no:item.staff_no }));
      }
    },
    async getWorkConfig(){
      const {data} = await getworkconf({id:this.workForm.work_id});
      this.workForm.link_time = data.effective_duration;
      this.workForm.work_pass = data.password||"";
      this.workForm.shunt_plant = data.short_type||3;
      this.workForm.share_mode = data.distribute_type||1;
    },
    dialogHandle(row,type,idx){
      let that = this;
      let shareTips;
      if (type == 0) {
        let tipsText = ["",that.$t('sys_rai043',{value:that.$t('sys_rai038')}),that.$t('sys_rai044',{value:that.$t('sys_rai038')})]
        shareTips = that.$t('sys_rai046',{value:tipsText[row.idx]});
      }else{
        shareTips = that.$t('sys_rai046',{value:that.$t('sys_rai020')});
      }
      that.$confirm(shareTips,that.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function (action, instance, done) {
            if (action === 'confirm') {
                let httpApi;
                let params={};
                if (type == 0) {
                  httpApi = ["",dobatchdelworktask,dobatchsetworktask,dobatchsetzeroingtime]
                }else{
                  httpApi = ["","",cancelshare]
                }
                instance.confirmButtonLoading = true;
                if (that.checkIdArry.length==0) {
                  params.id = that.workForm.work_id;
                }else{
                  params.ids = that.checkIdArry;
                }
                httpApi[idx](params).then(res=>{
                  instance.confirmButtonLoading = false;
                  if (res.code != 0) return;
                  that.getCounterList()
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
    async copayHandle(row,type){
      let httpApi = ["",doworkshunt,createShare];
      const res = await httpApi[type]({short_type:row.short_type,id:row.id});
      if (res.code != 0) return;
      const shareLink = res.data.url;
      let clipboard = navigator.clipboard || { writeText: (shareLink) => {
          let copyInput = document.createElement('input');
          copyInput.value = shareLink;
          document.body.appendChild(copyInput);
          copyInput.select();
          document.execCommand('copy');
          document.body.removeChild(copyInput);
        }
      }
      if (clipboard) {
        await clipboard.writeText(shareLink);
        successTips(this, "",this.$t('sys_rai121'))
      }
    },
    sizeHandle(val) {
      this.limit = val;
      this.getDetailList();
    },
    pageHandle(val) {
      this.page = val;
      this.getDetailList();
    },
    // copayTask() {
    //   const clipboard = new Clipboard('#taskConfig');
    //   clipboard.on('success', (e) => {
    //     successTips(this, "",this.$t('sys_rai121'))
    //     // e.clearSelection(); // 清除选中文本
    //   })
    // },
    exportText(row) {
      doouttaskrecordexcel({id: this.task_id }).then(res => {
        if (res.code != 0) return;
        // this.getDetailList();
        window.location.href = res.data.url
      })
    },
    submitWork(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params;
          if (this.workIdx == 1) {
            params = {
              id:this.workForm.work_id,
              name:this.workForm.work_name,
              zeroing_time:this.workForm.restTimer,
              work_type:this.workForm.work_type,
              work_accounts:this.workForm.staffCheck,
              customer_accounts:this.workForm.staffCheck,
            }
            this.workForm.work_id==""?delete params.id:"";
            this.workForm.work_type==1?delete params.work_accounts:delete params.customer_accounts
          }else if(this.workIdx == 3) {
            params = {
              ids:this.checkIdArry,
              zeroing_time:this.workForm.restTimer
            }
          }else if (this.workIdx == 4) {
            params = {
              id:this.workForm.work_id,
              effective_duration:Number(this.workForm.link_time),
              password:this.workForm.work_pass
            }
          }else if (this.workIdx == 5) {
            params = {
              id:this.workForm.work_id,
              short_type:this.workForm.shunt_plant,
              distribute_type:this.workForm.share_mode
            }
          }
          let curIdx =this.workIdx==1&&!this.workForm.work_id?0:this.workIdx;
          let httpApi = [docreateworktask,doupworktask,"",dobatchsetzeroingtime,setwordshare,setworkdiversion]
          this.isLoading=true;
          httpApi[curIdx](params).then(res => {
            this.isLoading = false;
            if (res.code != 0) return;
            this.workModel = false;
            this.getCounterList();
            successTips(this)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    jumpPower(row,type){
      // if (!row.id)return;
      let path = type==1?'/ticket-details':'/fanDetails';
      this.$router.push({path:path,query:{workId:row.id}});
    }
  },
  watch:{
    workModel(val){
      if (val==false&&this.$refs.workForm) {
        this.$refs.workForm.resetFields();
        this.stsff_group_id="";
        this.staffCheck = [];
        this.workCheckList = [];
        this.workForm.work_id="";
        this.workForm.work_name="";
        this.workForm.restTimer="";
        this.workForm.work_type = 1;
        this.workForm.share_mode = 1;
        this.workForm.workCheckList="";
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
      }
    },
    changeModel(val){
      if (val == false) {
        this.workIdx = 1;
        this.seatPage = 1;
        this.currentPage = 1;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title_01 {
  display: flex;
  font-size: 14px;
  margin: 0 0 10px 10px;
}
.desc_list{
  width: 100%;
  display: flex;
  flex-direction: column;
  .desc_item{
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    h4, p{
      margin: 0 0;
    }
    h4{
      margin-bottom: 10px;
    }
    .desc_t{
      display: flex;
      line-height: 1.4;
      margin-left: 10px;
    }
  }
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
        border: 1px solid #ebeef5;
        ;
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

.select_body {
  .select_ele {
    width: 120px;

    ::v-deep .el-input__inner {
      border-right: transparent;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    // ::v-deep .el-input__inner:focus{
    //     border-right: 1px solid #1890ff;
    // }
  }

  .input_ele {
    width: 202px;

    ::v-deep .el-input__inner {
      border-left: transparent;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 1px solid #DCDFE6;
    }

    ::v-deep .el-input__inner:focus {
      border-left: 1px solid #1890ff;
    }
  }
}
.seat_class{
  width: 100%;
  height: auto;
  padding: 10px;
  border-radius: 10px;
  border:1px solid #e0e0e0;
  .add_warp{
    gap: 10px;
    display: flex;
    width: 100%;
    max-height: 360px;
    flex-shrink: 0;
    flex-wrap: wrap;
    overflow-y: auto;
    justify-content: space-between;
    .add_item{
      display: flex;
      height: 28px; 
      padding: 5px;
      line-height: 1;
      min-width: 220px;
      flex-shrink: 0;
      color: #409eff;
      align-items: center; 
      background: #ecf5ff;
      border-radius: 4px;
      justify-content: space-between;
      border:1px solid #b3d8ff;
    }
  }
}
</style>