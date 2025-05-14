<template>
  <div>
      <el-form size="small" :inline="true" style="margin-top: 10px;">
        <el-form-item>
          <el-button type="primary" @click="jumpCreatTask(0,0)">{{ $t('sys_g123') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="model1.task_name" :placeholder="$t('sys_mat024')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getTaskList(1)">{{ $t('sys_c002') }}</el-button>
          <el-button icon="el-icon-refresh-right" @click="resetQuery">{{ $t('sys_c049') }}</el-button>
        </el-form-item>

        <el-form-item>
          <el-dropdown @command="(command)=>{handleCommand(0,command)}" trigger="click" style="margin-left:10px;">
            <el-button :disabled="checkIdArry.length==0" type="success"> {{ $t('sys_g018') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, idx) in moreOption" :key="idx" :command="{item,idx}" v-show="idx!=0">
                <i :class="'el-icon-' + item.icon"></i>
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <!-- 分组管理 -->
      <div class="continer_main">
        <div class="tab_check_warp">
            <i slot="reference" class="el-icon-info"></i>
            <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
        </div>
        <el-table @sort-change="sorthandle" :data="taskDataList" border height="760" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" ref="serveTable" @selection-change="handleSelectionChange" @row-click="rowSelectChange" :summary-method="getSummaries" show-summary>
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" :label="$t('sys_g070')" width="120" />
            <el-table-column prop="group_name" :label="$t('sys_rai101')" minWidth="120">
                <template slot-scope="scope">
                  {{ scope.row.group_name||"-" }}
                </template>
            </el-table-column>
            <el-table-column prop="account_num" :label="$t('sys_mat058')" minWidth="120">
                <template slot-scope="scope">
                  {{ scope.row.account_num }}
                </template>
            </el-table-column>
            <el-table-column prop="sucess_num" :label="$t('sys_mat047')" minWidth="130">
              <template slot-scope="scope">
                {{ scope.row.sucess_num }}
              </template>
            </el-table-column>
            <el-table-column prop="arrived_num" :label="$t('sys_mat115')" minWidth="120">
              <template slot-scope="scope">
                {{ scope.row.arrived_num||"-" }}
              </template>
            </el-table-column>
            <el-table-column prop="arrived_rate" :label="$t('sys_mat116')" minWidth="120">
              <template slot-scope="scope">
                {{ parseFloat((scope.row.arrived_rate*100).toFixed(2))+"%" || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="in_pro_num" :label="$t('sys_l072')" minWidth="120" />
            <!-- <el-table-column prop="complete_message" :label="$t('sys_g072')" minWidth="120" /> -->
            <el-table-column prop="status" :label="$t('sys_l059')" minWidth="100">
              <template slot="header">
                <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command)">
                  <span style="color:#909399" :class="[model1.status?'dropdown_title':'']"> {{ $t('sys_l059') }}
                      <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :class="{'dropdown_selected':idx==model1.status}" v-for="(item,idx) in statusOptions" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                  </el-dropdown-menu>
                  </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.status==1?'primary':scope.row.status==2?'warning':scope.row.status==5?'success':'danger'"> {{ statusOptions[scope.row.status]||"-" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="data_pack_name" :label="$t('sys_rai090')" minWidth="120">
              <template slot-scope="scope">
                {{ scope.row.data_pack_name||"-" }}
              </template>
            </el-table-column>
            <!-- 
            <el-table-column prop="residue_num" :label="$t('sys_g077')" minWidth="160" />
            <el-table-column prop="card_num" :label="$t('sys_g076')" minWidth="160" /> -->
            <!-- <el-table-column prop="itime" :label="$t('sys_g078')+'/'+$t('sys_g079')" minWidth="170">
                <template slot-scope="scope">
                  <div>{{scope.row.start_time>0?$baseFun.resetTime(scope.row.start_time*1000):"-" }}</div>
                  <div>{{scope.row.end_time>0?$baseFun.resetTime(scope.row.end_time*1000):"-" }} </div>
                </template>
            </el-table-column> -->
            <el-table-column prop="reason" :label="$t('sys_c071')" minWidth="120">
                <template slot-scope="scope">
                  {{ scope.row.reason||"-" }}
                </template>
            </el-table-column>
            <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="170">
                <template slot-scope="scope">
                  <div>{{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"-" }}</div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('sys_c010')" width="330">
                <template slot-scope="scope">
                    <el-button :disabled="checkIdArry.length>0" type="primary" size="small" @click="jumpCreatTask(scope.row,1)">{{ $t('sys_c077') }}</el-button>
                    <el-button :disabled="checkIdArry.length>0" type="primary" size="mini" @click.stop="goTaskDetail(scope.row)">{{ $t('sys_c078') }}</el-button>
                    <el-button :disabled="checkIdArry.length>0" type="success" plain size="mini" @click.stop="exportText(scope.row)">{{ $t('sys_c080') }}</el-button>
                    <!-- <el-button type="success" plain>成功按钮</el-button> -->
                    <el-button @click.stop type="text" size="mini">
                        <el-dropdown @command="(command)=>{handleCommand(scope.row,command)}" trigger="click">
                            <span class="el-dropdown-link">
                              <el-button type="warning" plain size="mini" :disabled="checkIdArry.length>0">
                                {{ $t('sys_c079') }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                              </el-button>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item v-for="(item,idx) in moreOption" :key="idx" :command="{item,idx}" v-show="idx!=0">
                                <i :class="'el-icon-' + item.icon"></i>
                                {{ item.label }}
                              </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="layui_page">
          <el-pagination background @size-change="sizeHandle" @current-change="pageHandle"
            :page-sizes="pageOption" :current-page.sync="model1.page" :page-size="model1.limit"
            layout="total, sizes, prev, pager, next, jumper" :total="model1.total">
          </el-pagination>
        </div>
      </div>
  </div>
</template>
<script>
import md5 from "js-md5";
import { successTips, resetPage } from '@/utils/index'
import { getsendmsgtasklist,dobatchstopsendmsgtask,dobatchclosesendmsgtask,dobatchdelsendmsgtask,doouttaskexcel } from '@/api/task'
export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 10,
        total: 0,
        status:"",
        task_name: "",
      },
      showNum:[4,5],
      loading:false,
      checkIdArry:[],
      pageOption: resetPage(),
      taskDataList:[
        {
          task_name:"测试001",
          task_num:10,
          finish_num:12,
        },
        {
          task_name:"测试001",
          task_num:10,
          finish_num:12,
        }
      ]
    }
  },
  computed: {
    groupRules() {
      return {
        group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        plant_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'blure' }],
        set_account: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat063')}), trigger: 'blure' }],
        set_name: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat062')}), trigger: 'blure' }],
        set_pwd: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_g031')}), trigger: 'blure' }]
      }
    },
    statusOptions(){
      return ["",this.$t('sys_l071'),this.$t('sys_l072'),this.$t('sys_g068'),this.$t('sys_g067'),this.$t('sys_mat047')]
    },
    moreOption(){
      return  [
        {
          icon: "switch-button",
          label: this.$t('sys_g067')
        },
        // {
        //   icon: "refresh",
        //   label: this.$t('sys_c081')
        // },
        {
          icon: "close",
          label: this.$t('sys_g068')
        },
        {
          icon: "delete",
          label: this.$t('sys_g069')
        }
      ]
    }
  },
  created() {
    this.getTaskList();
  },
  methods: {
      resetQuery(){
        this.model1.status="";
        this.model1.task_name="";
        this.getTaskList(1);
      },
      handleNewwork(status) {
        this.model1.status = status;
        this.getTaskList(1);
      },
      getTaskList(num){
        this.loading=true;
        this.model1.page=num?num:this.model1.page;
        let params = {
          page:this.model1.page,
          limit:this.model1.limit,
          status:this.model1.status||-1,
          name:this.model1.task_name
        }
        getsendmsgtasklist(params).then(res=>{
          this.loading=false;
          this.model1.total = res.data.total;
          this.taskDataList = res.data.list||[];
          this.$nextTick(()=>{
            if (this.$refs.serveTable) {
              this.$refs.serveTable.doLayout(); 
            }
          })
        })
      },
      goTaskDetail(row){
        this.$router.push({path:'/task-detail',query:{params:row,task_id:row.id}});
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
      sorthandle({ column, prop, order }) {
        console.log(column);
      },
      sizeHandle(val){
        this.model1.limit=val;
        this.getTaskList();
      },
      pageHandle(val){
        this.model1.page=val;
        this.getTaskList();
      },
      jumpCreatTask(row,idx){
        if (idx == 0) {
          this.$router.push("/create-was-task")
        }else{
          this.$router.push({path:"/create-was-task",query:{config:row}})
        }
      },
      handleCommand(row,command) {
          let that = this;
          that.setIpType = command.idx;
          that.setIpName = command.item.label;
          if (that.checkIdArry.length==0 && row==0) {
            return successTips(that, "error",that.$t('sys_c126'));
          }
          that.$confirm(that.$t('sys_c046',{value:that.setIpName}),that.$t('sys_l013'), {
            type: 'warning',
            confirmButtonText: that.$t('sys_c024'),
            cancelButtonText: that.$t('sys_c023'),
            beforeClose: function (action, instance, done) {
                if (action === 'confirm') {
                  let reqApi = that.setIpType==0?dobatchstopsendmsgtask:that.setIpType==1?dobatchclosesendmsgtask:that.setIpType==2?dobatchdelsendmsgtask:"";
                  instance.confirmButtonLoading = true;
                  reqApi({ids:row==0?that.checkIdArry:[row.id]}).then(res=>{
                    instance.confirmButtonLoading = false;
                    if (res.code != 0) return;
                    that.getTaskList();
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
      exportText(row){
        doouttaskexcel({id:row.id}).then(res=>{
          if (res.code != 0) return;
            // this.getTaskList();
            window.location.href = res.data.url
        })
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          const values = data.map(item => Number(item[column.property]));
          if (index === 0) {
            sums[index] = this.$t('sys_c125');
            return;
          }else if(this.showNum.indexOf(index) > -1){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return (prev+curr);
              } else {
                return prev;
              }
            },0);
          }else{
            sums[index] = '--';	
          }
        });
			  return sums;
		},
  }
}
</script>
<style scoped lang="scss">
.continer_main {
  width: 100%;
}
</style>
  