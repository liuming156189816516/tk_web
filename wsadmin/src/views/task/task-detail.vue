<template>
    <div>
      <div class="title_01">{{$t('sys_g142')}}</div>
      <div class="detail_card">
        <el-button v-if="isLoading" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true"></el-button>
        <template v-else>
          <div class="card_item" v-for="(item,idx) in cardOption" :key="idx" :style="{background:`${item.b_g}`}" @click="getStatistics">
            <span>{{ item.label }}</span>
            <span class="card_num" :style="{color:`${item.t_c}`}" v-text="idx==4||idx==5?(item.num*100).toFixed(2)+'%':item.num"></span>
          </div>
        </template>
      </div>
      <el-form size="small" :inline="true" style="margin-top: 10px;">
        <el-form-item>
          <!-- <el-button type="primary" @click="jumpCreatTask(0,0)">{{ $t('sys_g123') }}</el-button> -->
          <el-button size="small" @click="$router.go(-1)">
              <i class="el-icon-back"></i>
              <span>{{$t('sys_q006')}}</span>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="task_name" :placeholder="$t('sys_l006')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDetailList(1)">{{ $t('sys_c002') }}</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQuery">{{ $t('sys_c049') }}</el-button>
        </el-form-item>

        <el-form-item class="el-item-right">
          <el-button type="success" @click="showTaskConfig">{{$t('sys_rai105')}}</el-button>
          <el-button type="primary" @click="exportText">{{$t('sys_rai106')}}</el-button>
        </el-form-item>
      </el-form>

      <!-- <u-table @sort-change="sorthandle" ref="opn_table" :data="detailDataList" border height="660" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" :header-cell-style="{color: '#909399'}"> -->
      <div>
        <!-- <u-table @sort-change="sorthandle" :data="detailDataList" border height="660" v-loading="loading"
            element-loading-spinner="el-icon-loading" style="width: 100%;" ref="opn_table" :total="total" 
            :page-sizes="pageOption" :page-size="limit" :current-page="page" :pagination-show="true" @handlePageSize="pageHandle"> -->
        <u-table @sort-change="sorthandle" :data="detailDataList" row-key="id" use-virtual border height="650" v-loading="loading"
            element-loading-spinner="el-icon-loading" style="width: 100%;" ref="serveTable" showBodyOverflow="title" :total="total" 
            :page-sizes="pageOption" :page-size="limit" :current-page="page" :pagination-show="true" @handlePageSize="pageHandle"> 
            <u-table-column type="selection" width="55" />
            <u-table-column type="index" :label="$t('sys_g020')" width="60" />
            <u-table-column prop="account" :label="$t('sys_g027')" minWidth="140" />
            <u-table-column prop="status" :label="$t('sys_c022')" minWidth="100">
                <template slot="header">
                    <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,1)">
                    <span style="color:#909399" :class="[ac_status?'dropdown_title':'']"> {{ $t('sys_c022') }}
                        <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :class="{'dropdown_selected':idx==ac_status}" v-for="(item,idx) in taskStatus" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.account_status==2?'success':'danger'"> {{ taskStatus[scope.row.account_status]||"-" }}</el-tag>
                </template>
            </u-table-column>
            <u-table-column prop="sucess_num" sortable="sucess_num" :label="$t('sys_mat047')+'/'+$t('sys_g080')" minWidth="120">
              <template slot-scope="scope">
                  {{ scope.row.sucess_num }}/{{ scope.row.send_num }}
              </template>
            </u-table-column> 
            <u-table-column prop="arrived_num" :label="$t('sys_mat115')" minWidth="120">
              <template slot-scope="scope">
                {{ scope.row.arrived_num||"-" }}
              </template>
            </u-table-column>
            <u-table-column prop="read_rate" sortable="read_rate" :label="$t('sys_g081')" minWidth="100">
            <template slot-scope="scope">
                {{ (scope.row.read_rate*100).toFixed(2) || 0 }}%
            </template>
            </u-table-column> 
            <u-table-column prop="reply_rate" sortable="reply_rate" :label="$t('sys_g082')" minWidth="100">
            <template slot-scope="scope">
                {{ (scope.row.reply_rate*100).toFixed(2) || 0 }}%
            </template>
            </u-table-column> 
            <u-table-column prop="status" :label="$t('sys_l059')" minWidth="160">
            <template slot="header">
                <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,2)">
                <span style="color:#909399" :class="[status?'dropdown_title':'']"> {{ $t('sys_l059') }}
                    <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :class="{'dropdown_selected':idx==status}" v-for="(item,idx) in statusOptions" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            </template>
            <template slot-scope="scope">
                <el-tag size="mini" :type="scope.row.status==1?'info':scope.row.status==2?'warning':scope.row.status==5?'success':'danger'"> {{ statusOptions[scope.row.status] }}</el-tag>
            </template>
            </u-table-column>
            <u-table-column prop="receive_msg_num" sortable="receive_msg_num" :label="$t('sys_c082')" minWidth="160" />
            <u-table-column prop="reason" :label="$t('sys_c071')" minWidth="160">
            <template slot-scope="scope">
                {{ scope.row.reason||"-" }}
            </template>
            </u-table-column> 
        </u-table>
        </div>

        <el-dialog :title="$t('sys_rai105')" center :visible.sync="taskCongifModel" :close-on-click-modal="false" width="560px">
          <el-form size="small" label-width="100px">
            <el-form-item :label="$t('sys_rai107')+'：'" prop="name">
              <span>{{ task_config.data_type==1?$t('sys_rai108'):'' }}</span>
            </el-form-item>
            <el-form-item :label="$t('sys_rai109')+'：'" prop="name">
              <span>{{ sendOption[task_config.send_type] }}</span>
            </el-form-item>
            <el-form-item :label="$t('sys_rai113')+'：'" prop="name">
              <div>{{$t('sys_rai130',{value: task_config.send_num})}}</div>
              <!-- <div>每个账号群发15条数据休息20分分钟</div> -->
              <div v-if="task_config.send_type!=2" v-html="$t('sys_rai112',{s_time:task_config.min_time,m_time:task_config.max_time})"></div>
            </el-form-item>
            <!-- <el-form-item :label="$t('sys_rai114')+'：'" prop="name">
              <span>{{ task_config.speech_skill_type==1?$t('sys_rai115'):'' }}</span>
            </el-form-item> -->
            <el-form-item :label="$t('sys_rai116')+'：'" prop="name">
              <span>{{$t('sys_rai117',{value:task_config.material_num})}}</span>
            </el-form-item>
            <!-- <el-form-item :label="$t('sys_rai118')+'：'" prop="name">
              <span>{{ task_config.replenish==1?$t('sys_rai119'):'' }}</span>
            </el-form-item> -->
            <el-form-item label-width="0" style="text-align: center;">
              <el-button @click="copayTask" id="taskConfig" :data-clipboard-text="copayConent">{{$t('sys_rai120')}}</el-button>
              <el-button type="primary" @click="taskCongifModel=false">{{ $t('sys_c024') }}</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
  import { successTips,resetPage } from '@/utils/index'
  import { getsendmsginfolist,getdatasum,doouttaskrecordexcel } from '@/api/task'
  export default {
    data() {
      return {
        page:1,
        limit:10,
        total:0,
        status:"",
        sort:"",
        ac_status:"",
        loading:false,
        isLoading:false,
        taskCongifModel:false,
        detailDataList:[],
        statisticsList:[],
        pageOption: resetPage(),
        task_name:"",
        task_id:"",
        task_config:"",
        copayConent:"",
        sucess_num:"",
        read_rate:"",
        reply_rate:"",
        receive_msg_num:""
      }
    },
    computed:{
      taskStatus(){
        return ["",this.$t('sys_g032'),this.$t('sys_g033')]
      },
      sendOption(){
        return ["",this.$t('sys_l117'),this.$t('sys_l116')]
      },
      statusOptions(){
        return ["",this.$t('sys_l071'),this.$t('sys_l072'),this.$t('sys_g068'),this.$t('sys_g067'),this.$t('sys_mat047')]
      },
      cardOption(){
        return [
          {
            label:this.$t('sys_mat058'),
            num:0,
            b_g:"#fef4e9",
            t_c:"#ff8400"
          },
          {
            label:this.$t('sys_mat109'),
            num:0,
            b_g:"#eef6fe",
            t_c:"#369aff"
          },
          {
            label:this.$t('sys_mat110'),
            num:0,
            b_g:"#dbfff1",
            t_c:"#02c97a"
          },
          {
            label:this.$t('sys_mat111'),
            num:0,
            b_g:"#f9edff",
            t_c:"#b357ff"
          },
          {
            label:this.$t('sys_g081'),
            num:0,
            b_g:"#ffebeb",
            t_c:"#ff0f0"
          },
          {
            label:this.$t('sys_g082'),
            num:0,
            b_g:"#fffee6",
            t_c:"#f2bb16"
          },
          {
            label: this.$t('sys_mat112'),
            num:0,
            b_g:"#dbfeff",
            t_c:"#1dcfdb"
          },
          {
            label: this.$t('sys_mat114'),
            num:0,
            b_g:"#ffebeb",
            t_c:"#ff0f0"
          }
        ]
      }
    },
    created() {
      this.task_id = this.$route.query.task_id;
      const query = this.$route.query.params;
      this.task_config =query.config_str?JSON.parse(query.config_str):"";
      this.copayConent=`账号来源： WS账号列表 群发模式： 默认模式 群发规则： 每个账号群发${this.task_config.send_num}条数据 群发间隔为${this.task_config.min_time}~${this.task_config.max_time}秒 话术设置： 自主设置 话术数量： ${this.task_config.material_num}条 补发话术： 未设置`
      this.getStatistics();
      this.getDetailList();
    },
    methods:{
      restQuery(){
        this.ac_status="";
        this.status="";
        this.task_name="";
        this.sucess_num="";
        this.read_rate="";
        this.reply_rate="";
        this.receive_msg_num="";
        this.getDetailList(1);
        this.$refs.opn_table.clearSort();
      },
      getStatistics(){
        this.isLoading=true;
        getdatasum({id:this.task_id}).then(res=>{
          let vita = res.data;
          for (let k = 0; k < this.cardOption.length; k++) {
            let item = this.cardOption[k];
            if (k == 0) {
                item.num = vita.account_num||0;
            }else if(k == 1){
              item.num = vita.account_sucess_num||0;
            }else if(k == 2){
              item.num = vita.target_num||0;
            }else if(k == 3){
              item.num = vita.push_num||0;
            }else if(k == 4){
              item.num = vita.read_rate||0;
            }else if(k == 5){
              item.num = vita.reply_rate||0;
            }else if(k == 6){
              item.num = vita.receive_msg_num||0;
            }else if(k == 7){
              item.num = vita.arrived_num||0;
            }
          }
          this.isLoading=false;
        })
      },
      getDetailList(num){
        this.loading=true;
        this.page=num?num:this.page;
        let params = {
          page:this.page,
          limit:this.limit,
          account:this.task_name,
          task_id:this.task_id,
          account_status:this.ac_status||-1,
          status:this.status||-1,
          // sucess_num:this.sucess_num||-1,
          // read_rate:this.read_rate||-1,
          // reply_rate:this.reply_rate||-1,
          // receive_msg_num:this.receive_msg_num||-1
          sort:this.sort
        }
        getsendmsginfolist(params).then(res=>{
          this.loading=false;
          this.total = res.data.total;
          this.detailDataList = res.data.list||[];
        })
      },
      handleNewwork(row, idx) {
        console.log(row);
        this.page = 1;
        if (idx == 1) {
          this.ac_status = row;
        } else if (idx == 2) {
          this.status = row;
        }
        this.getDetailList();
      },
      sorthandle(row){
        this.sort = "";
        if (row.order) {
          if (row.prop == 'sucess_num') {
            this.sort=row.order=='ascending'?row.prop:'-'+row.prop;
          }
          if (row.prop == 'read_rate') {
            this.sort=row.order=='ascending'?row.prop:'-'+row.prop;
          }
          if (row.prop == 'reply_rate') {
            this.sort=row.order=='ascending'?row.prop:'-'+row.prop;
          }
          if (row.prop == 'receive_msg_num') {
            this.sort=row.order=='ascending'?row.prop:'-'+row.prop;
          }
        }
        this.getDetailList();
      },
      sizeHandle(val){
        this.limit = val;
        this.getDetailList();
      },
      pageHandle({page, size}){
        this.loading = true;
        if (this.limit != size) {
          this.page = 1;
        }else{
          this.page = page;
        }
        this.limit = size;
        this.getDetailList();
      },
      showTaskConfig(){
        this.taskCongifModel=true;
      },
      copayTask(){
        const clipboard = new Clipboard('#taskConfig');
        clipboard.on('success', (e) => {
          successTips(this, "",this.$t('sys_rai121'))
          // e.clearSelection(); // 清除选中文本
        });
      },
      exportText(row){
        doouttaskrecordexcel({id:this.task_id}).then(res=>{
          if (res.code != 0) return;
            // this.getDetailList();
            window.location.href = res.data.url
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
    .title_01{
    display: flex;
    font-size: 14px;
    margin: 0 0 10px 10px;
  }
  .detail_card{
    // width: 100%;
    width: 100%;
    min-height: 160px;
    display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
    .card_item{
      height: 60px;
      width: calc((100% - (4 - 1) * 60px) / 4);
      display: flex;
      font-size: 14px;
      cursor: pointer;
      align-items: center;
      border-radius: 10px;
      padding: 0 40px;
      margin: 10px 0;
      margin-left: 60px;
			border-radius: 10px;
      justify-content: space-between;
      .card_num{
        font-weight: 600;
        font-size: 20px;
        em{
          font-style: normal;
        }
      }
    }
    .card_item:nth-of-type(4n + 1) {
			margin-left: 0;
		}
  }
</style>