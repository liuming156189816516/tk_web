<template>
    <div>
        <el-form size="small" :inline="true" style="margin-top: 10px;">
          <el-form-item>
            <el-button type="primary" @click="jumpCreatTask(0,0)">{{ $t('sys_g124') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" :disabled="checkIdArry.length==0" @click="handleGroupBtn(1)">{{ $t('sys_g125') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" :disabled="checkIdArry.length==0" @click="handleGroupBtn(3)">{{ $t('sys_g126') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="checkIdArry.length==0" @click="scamperBtn(0,1)">{{ $t('sys_q112') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" :disabled="checkIdArry.length==0" @click="handleGroupBtn(2)">{{ $t('sys_g127') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-input clearable v-model="model1.task_name" :placeholder="$t('sys_g128')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getPullTaskList(1)">{{ $t('sys_c002') }}</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetQuery">{{ $t('sys_c049') }}</el-button>
          </el-form-item>
        </el-form>
        <!-- 分组管理 -->
        <div class="continer_main">
          <div class="tab_check_warp">
            <i slot="reference" class="el-icon-info"></i>
            <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
          </div>
          <el-table :summary-method="getSummaries" show-summary :data="taskDataList" row-key="id" use-virtual
            border height="700" v-loading="loading" ref="serveTable" element-loading-spinner="el-icon-loading" style="width: 100%;"
            @selection-change="handleSelectionChange" @row-click="rowSelectChange">  
              <el-table-column type="selection" width="55" />
              <el-table-column prop="qname" :label="$t('sys_rai103')" minWidth="120" />
              <el-table-column prop="pull_group_name" :label="$t('sys_rai101')" minWidth="120" />
              <el-table-column prop="ad_group_name" :label="$t('sys_rai089')" minWidth="120" />
              <el-table-column prop="data_pack_name" :label="$t('sys_rai090')" width="120" />
              <el-table-column prop="ad" show-overflow-tooltip :label="$t('sys_rai091')" minWidth="120" />
              <el-table-column prop="zq_num" :label="$t('sys_rai102')" minWidth="100" />
              <el-table-column prop="success_num" :label="$t('sys_rai094')" width="120" />
              <el-table-column prop="status" :label="$t('sys_rai001')" minWidth="100">
                <template slot="header">
                  <el-dropdown trigger="click" size="medium" @command="(command) => handleNewwork(command)">
                    <span style="color:#909399" :class="[model1.status?'dropdown_title':'']"> {{ $t('sys_l059') }}
                      <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :class="{'dropdown_selected':idx==model1.status}" v-for="(item,idx) in statusOptions" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <template slot-scope="scope">
                  <el-tag size="small" :type="scope.row.status==1?'info':scope.row.status==2?'warning':scope.row.status==5?'success':'danger'"> {{ statusOptions[scope.row.status]||"-" }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="160">
                  <template slot-scope="scope">
                    <div>{{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"-" }}</div>
                  </template>
              </el-table-column>
              <el-table-column fixed="right" :label="$t('sys_c010')" width="200">
                  <template slot-scope="scope">
                    <el-button :disabled="checkIdArry.length>0" type="primary" plain size="mini" @click.stop="scamperBtn(scope.row,2)">{{ $t('sys_rai100') }}</el-button>
                    <el-button :disabled="checkIdArry.length>0" type="primary" plain size="mini" @click.stop="taskDetailBtn(scope.row)">{{ $t('sys_rai080') }}</el-button>
                  </template>
              </el-table-column>
          </el-table>
          <div class="layui_page">
              <el-pagination background :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :current-page.sync="model1.page" 
              :page-size="model1.limit" layout="total, sizes, prev, pager, next, jumper" :total="model1.total"  
              @size-change="handleSize" @current-change="handlePage" />
          </div>
        </div>
        <el-dialog :title="$t('sys_rai100')" :visible.sync="dialogVisible" width="560px" center>
          <el-form :model="taskForm" size="small" :rules="taskRules" ref="taskForm" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="$t('sys_rai104')+'：'" prop="relpy_text">
              <el-input type="textarea" clearable v-model="taskForm.relpy_text" :placeholder="$t('sys_g129')" rows="8" />
            </el-form-item>
            <el-form-item>
              <div class="el-item-right">
                <el-button @click="dialogVisible=false">{{ $t('sys_c023') }}</el-button>
                <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">{{ $t('sys_c024') }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
  </template>
  <script>
  import md5 from "js-md5";
  import { successTips, resetPage } from '@/utils/index'
  import { groupsendmsg,getpullgrouptasklist,dobatchdelpullgrouptask,dobatchstoppullgrouptask,dobatchclosepullgrouptask} from '@/api/task'
  export default {
    data() {
      return {
        model1: {
          page: 1,
          limit:10,
          total: 0,
          status:"",
          task_name: "",
        },
        taskForm:{
          relpy_type:"",
          relpy_id:"",
          relpy_text:"",
        },
        loading:false,
        isLoading:false,
        dialogVisible:false,
        checkIdArry:[],
        taskDataList:[],
        showNum:[7]
      }
    },
    computed: {
      groupRules() {
        return {
          group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          plant_type: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' }],
          set_account: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat063')}), trigger: 'blure' }],
          set_name: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat062')}), trigger: 'blure' }],
          set_pwd: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_g031')}), trigger: 'blure' }]
        }
      },
      taskRules() {
        return {
          relpy_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' },{ max: 2000, message: '最多可输入2000个字符', trigger: 'blur' }],
        }
      },
      raisOptions(){
        return ["",this.$t('sys_rai002'),this.$t('sys_rai003'),this.$t('sys_rai004')]
      },
      statusOptions(){
        return ["",this.$t('sys_l071'),this.$t('sys_l072'),this.$t('sys_g068'),this.$t('sys_rai078'),this.$t('sys_mat047')]
      }
    },
    created() {
      this.getPullTaskList();
    },
    methods: {
        resetQuery(){
          this.model1.status="";
          this.model1.task_name="";
          this.getPullTaskList(1);
          this.$refs.serveTable.clearSelection();
        },
        handleNewwork(status) {
          this.model1.status = status;
          this.getPullTaskList(1);
        },
        getPullTaskList(num){
          this.loading=true;
          this.taskDataList=[];
          this.model1.page=num?num:this.model1.page;
          let params = {
            page:this.model1.page,
            limit:this.model1.limit,
            qname:this.model1.task_name,
            status:this.model1.status||-1
          }
          getpullgrouptasklist(params).then(res=>{
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
                  return prev+curr;
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
        goTaskDetail(row){
          this.$router.push({path:'/wa-group-detail',query:{params:row,task_id:row.id}});
        },
        scamperBtn(row,type){
          this.taskForm.relpy_type=type;
          this.taskForm.relpy_id=row.id;
          this.taskForm.relpy_text=row.ad;
          this.dialogVisible=true;
        },
        submitForm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.isLoading=true;
              let ids = this.taskForm.relpy_type==1?this.checkIdArry:[this.taskForm.relpy_id];
              groupsendmsg({ids:ids,ad:this.taskForm.relpy_text}).then(res=>{
                this.isLoading=false;
                if (res.code !=0 ) return;
                successTips(this)
                this.getPullTaskList(1);
                this.dialogVisible=false;
              })
            } else {
              console.log('error submit!!');
              return false;
            }
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
        sizeHandle(val){
          this.model1.limit=val;
          this.getPullTaskList();
        },
        handleSize(size){
          this.model1.limit = size;
          this.getPullTaskList(1);
        },
        handlePage(page){
          this.model1.page = page;
          this.getPullTaskList();
        },
        jumpCreatTask(row,idx){
          this.$router.push({path:"/ws-add-group",query:{id:5555}})
        },
        taskDetailBtn(row){
          this.$router.push({path:'/ws-group-detail',query:{params:row,task_id:row.id}});
        },
        handleGroupBtn(type) {
            let that = this;
            let tipsText = type==1?that.$t('sys_rai081'):type==2?that.$t('sys_rai082'):that.$t('sys_rai097')
            that.$confirm(that.$t('sys_rai046',{value:tipsText}), that.$t('sys_l013'), {
              type: 'warning',
              confirmButtonText: that.$t('sys_c024'),
              cancelButtonText: that.$t('sys_c023'),
              beforeClose: function (action, instance, done) {
                  if (action === 'confirm') {
                    let reqApi = type==1?dobatchclosepullgrouptask:type==2?dobatchdelpullgrouptask:dobatchstoppullgrouptask;
                    reqApi({ids:that.checkIdArry}).then(res=>{
                      if (res.code != 0) return;
                        that.getPullTaskList(1);
                        successTips(that)
                        done();
                      })
                  } else {
                    done();
                  }
              }
          }).catch(() => {
              that.$message({ type: 'info', message: that.$t('sys_c048') });
          })
        },
        exportText(row){
          doouttaskexcel({id:row.id}).then(res=>{
            if (res.code != 0) return;
              this.getPullTaskList();
              window.location.href = res.data.url
          })
        }
    }
  }
  </script>
  <style scoped lang="scss">
  .continer_main {
    width: 100%;
  }
  </style>
    