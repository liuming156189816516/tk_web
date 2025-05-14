<template>
  <div>
      <el-form size="small" :inline="true" style="margin-top: 10px;">
        <el-form-item>
          <el-button type="primary" @click="jumpCreatTask(0,0)">{{ $t('sys_m038') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" :disabled="checkIdArry.length==0" @click="handleGroupBtn(0,1)">{{ $t('sys_rai081') }}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="warning" :disabled="checkIdArry.length==0" @click="handleGroupBtn(0,3)">{{ $t('sys_rai097') }}</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" :disabled="checkIdArry.length==0" @click="scamperBtn(0,4)">{{ $t('sys_q111') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" :disabled="checkIdArry.length==0" @click="handleGroupBtn(0,2)">{{ $t('sys_rai082') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="model1.task_name" :placeholder="$t('sys_mat024')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getPullTaskList(1)">{{ $t('sys_c002') }}</el-button>
          <el-button icon="el-icon-refresh-right" @click="resetQuery">{{ $t('sys_c049') }}</el-button>
        </el-form-item>

        <el-form-item class="fr">
          自动炸群: <el-switch v-model="auto_scamper" active-text="开启" inactive-text="关闭" @change="handleScamper" />
        </el-form-item>
      </el-form>
      <!-- 分组管理 -->
      <div class="continer_main">
        <div class="tab_check_warp">
            <i slot="reference" class="el-icon-info"></i>
            <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
        </div>
        <!-- <el-table @sort-change="sorthandle" :summary-method="getSummaries" show-summary :data="taskDataList" row-key="id" use-virtual border height="750" v-loading="loading" ref="serveTable"
          element-loading-spinner="el-icon-loading" style="width: 100%;" showBodyOverflow="title" :total="model1.total" :page-sizes="pageOption" 
          :page-size="model1.limit" :current-page="model1.page" :pagination-show="true" @selection-change="handleSelectionChange" @row-click="rowSelectChange" @handlePageSize="pageHandle">    -->
        
          <el-table :summary-method="getSummaries" show-summary :data="taskDataList" row-key="id" use-virtual
            border :height="cliHeight" v-loading="loading" ref="serveTable" element-loading-spinner="el-icon-loading" style="width: 100%;"
            @selection-change="handleSelectionChange" @row-click="rowSelectChange">  
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" :label="$t('sys_g070')" width="120" />
            <el-table-column prop="qname" :label="$t('sys_rai086')" width="120">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.qname" placement="top">
                    <div style="width: 100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ scope.row.qname||"-" }}</div>
                  </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="pull_group_name" :label="$t('sys_rai088')" minWidth="120" />
            <el-table-column prop="ad_group_name" :label="$t('sys_rai089')" minWidth="120" />
            <el-table-column prop="data_pack_name" :label="$t('sys_rai090')" width="120" />
            <!-- <el-table-column prop="ad" show-overflow-tooltip :label="$t('sys_rai091')" minWidth="120" /> -->
            <el-table-column prop="zq_num" :label="$t('sys_rai095')" minWidth="100" />
            <!-- <el-table-column prop="is_announcement" :label="$t('sys_q130')" minWidth="100">
              <template slot-scope="scope">
                <el-button class="jump_un_link" type="text" :disabled="!scope.row.material_list" @click.stop="scamperBtn(scope.row,1)">{{ scope.row.material_list==null?0:scope.row.material_list.length }}</el-button>
              </template>
            </el-table-column> -->
            <el-table-column prop="qnum" :label="$t('sys_rai092')" width="120" />
            <el-table-column prop="pull_num" :label="$t('sys_rai093')" width="120" />
            <el-table-column prop="avg_num" :label="$t('sys_rai099')" width="120" />
            <el-table-column prop="success_num" :label="$t('sys_rai094')" width="120" />
             <el-table-column prop="in_pro_num" :label="$t('sys_l072')" width="120" />
            <el-table-column prop="status" :label="$t('sys_rai001')" width="100">
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
                <el-tag size="small" :type="scope.row.status==1?'info':scope.row.status==2?'warning':scope.row.status==5?'success':'danger'"> {{ statusOptions[scope.row.status]||"-" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="160">
                <template slot-scope="scope">
                  <div>{{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"-" }}</div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('sys_c010')" width="360">
                <template slot-scope="scope">
                  <!-- <el-button :disabled="checkIdArry.length>0" type="primary" size="mini" @click.stop="exportText(scope.row)">{{ $t('sys_rai079') }}</el-button> -->
                  <!-- <el-button :disabled="checkIdArry.length>0||scope.row.status!=5" type="primary" plain size="mini" @click.stop="handleGroupBtn(scope.row,4)">{{ $t('sys_g146') }}</el-button> -->
                  <el-button :disabled="checkIdArry.length>0" type="primary" plain size="mini" @click.stop="scamperGroup(scope.row)">{{ $t('sys_l118') }}</el-button>
                  <el-button :disabled="checkIdArry.length>0" type="primary" plain size="mini" @click.stop="scamperBtn(scope.row,3)">{{ $t('sys_rai098') }}</el-button>
                  <el-button :disabled="checkIdArry.length>0" type="primary" plain size="mini" @click.stop="scamperBtn(scope.row,2)">{{ $t('sys_q131') }}</el-button>
                  <el-button :disabled="checkIdArry.length>0" type="success" plain size="mini" @click.stop="goTaskDetail(scope.row)">{{ $t('sys_rai080') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="layui_page">
            <el-pagination background :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :current-page.sync="model1.page" 
            :page-size="model1.limit" layout="total, sizes, prev, pager, next, jumper" :total="model1.total"  
            @size-change="handleSize" @current-change="handlePage" />
        </div>
        <!-- <el-pagination :total="model1.total" style="display: none;" /> -->
      </div>
      <el-dialog class="custom_header" :title="blastForm.relpy_type==2?$t('sys_q131'):$t('sys_q130')" :visible.sync="blastDialog" :close-on-click-modal="false" :width="blastForm.explode_type==1&&blastForm.relpy_type==3?'400px':'560px'" center>
        <el-form v-if="blastForm.relpy_type==3||blastForm.relpy_type==4" size="small" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="$t('sys_q132')+'：'" prop="explode_type">
            <el-radio-group v-model="blastForm.explode_type">
              <el-radio :label="1">默认</el-radio>
              <el-radio :label="2">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template v-if="blastForm.relpy_type==3||blastForm.relpy_type==4">
          <template v-if="blastForm.explode_type==2">
            <el-form :model="blastForm" size="small" :rules="blastRules" ref="blastForm" label-width="100px" class="demo-ruleForm">
              <el-form-item :label="$t('sys_rai104')+'：'" prop="relpy_text">
                <el-input type="textarea" clearable v-model="blastForm.relpy_text" :placeholder="$t('sys_g129')" rows="8" />
              </el-form-item>
            </el-form>
          </template>
          <div v-if="blastForm.relpy_type==3||blastForm.relpy_type==4" style="display: flex;justify-content: center;margin-top: 20px;">
            <el-button size="small" @click="blastDialog=false">{{ $t('sys_c023') }}</el-button>
            <el-button size="small" type="primary" :loading="isLoading" @click="submitForm('blastForm')">{{ $t('sys_c024') }}</el-button>
          </div>
        </template>
        <template v-else>
          <el-button size="mini" type="primary" @click="showPropModel" icon="el-icon-plus" :disabled="materialData.length>=5" v-if="blastForm.relpy_type==2">{{ $t('sys_mat093') }}</el-button>
          <el-table :data="materialData" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" style="width: 100%">
              <el-table-column type="index" :label="$t('sys_g020')"></el-table-column>
              <el-table-column prop="type" :label="$t('sys_g091')" width="100">
                  <template slot-scope="scope">
                    <span>{{ sourceOption[scope.row.type]}}</span>
                  </template>
              </el-table-column>
              <el-table-column prop="content" :label="$t('sys_mat019')" minWidth="140">
                  <template slot-scope="scope">
                      <template  v-if="scope.row.type==1||scope.row.type==5||scope.row.type==6">
                        <el-tooltip effect="dark" :content="scope.row.content" placement="top">
                          <span class="content_07">{{ scope.row.content }}</span>
                        </el-tooltip>
                      </template>
                      <div v-if="scope.row.type==2&&blastForm.relpy_type==1" style="display: flex;align-items: center;">
                        <img class="content_02" :src="scope.row.content" @click="showSkyBtn(scope.row)">
                        <el-tooltip effect="dark" :content="scope.row.remark" placement="top">
                          <span class="content_07">{{ scope.row.remark||"-" }}</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.type==2&&blastForm.relpy_type==2" style="display: flex;justify-content: center;align-items: center;">
                        <img class="content_02" :src="scope.row.content" @click="showSkyBtn(scope.row)">
                        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="scope.row.remark" style="margin-left: 5px;line-height: 1;" />
                      </div>
                      <audio v-if="scope.row.type==3" controls class="audio_src">
                        <source :src="scope.row.content" type="audio/mpeg">
                      </audio>
                      <video v-if="scope.row.type==4" width="60" height="35" controls>
                        <source :src="scope.row.content" type="video/mp4">
                      </video>
                      <div v-if="scope.row.type==7" style="display: flex;align-items: center;flex-direction:column;">
                          <img class="content_02" :src="scope.row.content.img" @click="showSkyBtn({content:scope.row.content.img})">
                          <div style="font-size:12px;">{{$t('sys_l080')}}：{{scope.row.content.url}}</div>
                      </div>
                  </template>
              </el-table-column>
              <template v-if="blastForm.relpy_type==2"> 
                <el-table-column prop="address" type="index" :label="$t('sys_c010')" width="120">
                  <template slot-scope="scope">
                      <el-button class="custom_btn" size="mini" v-if="scope.row.type!=5" @click="editScript(scope.row,scope)">
                          <i class="el-icon-edit" />
                      </el-button>
                      <el-button class="custom_btn" size="mini" @click="delScript(scope)">
                          <i class="el-icon-delete-solid" />
                      </el-button>
                  </template>
                </el-table-column>
              </template>
          </el-table>
          <div class="content_07 custom_ad" v-if="blastForm.relpy_text">
            <span>{{$t('sys_q130')+'：'}}</span>{{ blastForm.relpy_text }}</div>
          <div v-if="blastForm.relpy_type==2" class="blast_btn">
            <el-button size="small" @click="blastDialog=false">{{ $t('sys_c023') }}</el-button>
            <el-button size="small" type="primary" :loading="isLoading" :disabled="materialData.length==0" @click="handleUpdate">{{ $t('sys_c024') }}</el-button>
          </div>
        </template>
      </el-dialog>
      <el-image-viewer v-if="imgModel" :on-close="closeViewer" style="z-index:9999" @click.native="cloneImgpreview" :url-list="[taskForm.img]" />
      <el-dialog :title="$t('sys_mat108')" center :visible.sync="showSource" :close-on-click-modal="false" width="60%">
        <material :key="taskForm.relpy_type==2?Math.floor(new Date().getTime()):''" @changeEle="getChildren" @closeDialog="showSource=false" :message="childMess" />
      </el-dialog>
  </div>
</template>
<script>
import { successTips } from '@/utils/index'
import material from '../content/material.vue';
import { groupsendmsg,getpullgrouptasklist,dobatchdelpullgrouptask,dobatchstoppullgrouptask,dobatchclosepullgrouptask,getsysconfig,upsysconfig,doupautoad,dorestarttask} from '@/api/task'
export default {
  components: {material,'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
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
        img:"",
        relpy_type:"",
        relpy_id:"",
        relpy_text:"",
      },
      blastForm:{
        explode_type:1,
        relpy_type:null,
        relpy_text:"",
        relpy_id:"",
      },
      showSource:false,
      childMess:{
        check:false,
        is_show:1,
        type:0
      },
      cliHeight:null,
      source_id:"",
      imgModel:false,
      loading:false,
      isLoading:false,
      auto_scamper:false,
      source_type:null,
      checkIdArry:[],
      taskDataList:[],
      showNum:[10],
      materialData:[],
      blastDialog:false
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
    blastRules() {
      return {
        relpy_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' }],
      }
    },
    raisOptions(){
      return ["",this.$t('sys_rai002'),this.$t('sys_rai003'),this.$t('sys_rai004')]
    },
    statusOptions(){
      return ["",this.$t('sys_l071'),this.$t('sys_l072'),this.$t('sys_g068'),this.$t('sys_rai078'),this.$t('sys_mat047')]
    },
    sourceOption() {
        return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092'),this.$t('sys_mat113')]
    }
  },
  created() {
    this.initGroupConfig();
    this.getPullTaskList();
  },
  mounted() {
      this.setFullHeight();
      window.addEventListener("resize", this.setFullHeight);
  },
  beforeDestroy() {
      window.removeEventListener("resize", this.setFullHeight);
  },
  methods: {
      showPropModel(){
        this.source_id = "";
        this.childMess.type="";
        this.showSource=true;
      },
      setFullHeight(){
        this.cliHeight = document.documentElement.clientHeight-280;
      },
      getChildren(msg){
        this.showSource=false;
        let {id,name,content,type} = JSON.parse(msg);
        let new_obj = {material_id:id,name:name,content:content,type:type};
        new_obj.type==2?new_obj.remark="":"";
        if (this.source_id) {
          for (let k = 0; k < this.materialData.length; k++) {
            if (k == this.source_id) {
              this.$set(this.materialData,k,new_obj)
            }
          }
        }else{
          this.materialData.push(new_obj)
        }
      },
      editScript(row,event){
        this.source_type = 1;
        this.source_id = event.$index;
        this.childMess.type=String(row.type);
        this.showSource=true;
      },
      delScript(row){
        for (let k = 0; k < this.materialData.length; k++) {
          if (k === row.$index) {
            this.materialData.splice(k,1)
          }
        }
      },
      async handleUpdate(){
        this.isLoading =true;
        let materialList = this.materialData.map(item => {
          if (item.type === 7) {
            return {...item,content:JSON.stringify(item.content)};
          }
          return item;
        })
        let {code} = await doupautoad({id:this.blastForm.relpy_id,material_list:materialList});
        this.isLoading =false;
        if(code != 0)return;
        this.getPullTaskList(1);
        this.blastDialog=false;
      },
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
      scamperBtn(row,type){
        this.blastForm.relpy_text="";
        this.blastForm.explode_type=1;
        this.blastForm.relpy_type=type;
        if(type != 4){
          this.blastForm.relpy_id=row.id;
          this.blastForm.relpy_text=row.ad;
          let materialList = row.material_list.map(item => {
            if (item.type === 7) {
              return {...item,content:JSON.parse(item.content)};
            }
            return item;
          })
          this.materialData = materialList;
        }
        this.blastDialog=true;
      },
      scamperGroup(row){
        this.$router.push({path:"/wa-add-group",query:{row}})
      },
      restForm(){
        this.$refs.blastForm.resetFields();
      },
      getPullTaskList(num){
        this.loading=true;
        this.taskDataList=[];
        this.model1.page=num?num:this.model1.page;
        let params = {
          page:this.model1.page,
          limit:this.model1.limit,
          name:this.model1.task_name,
          status:this.model1.status||-1
        }
        getpullgrouptasklist(params).then(res=>{
          this.loading=false;
          this.model1.total = res.data.total;
          this.taskDataList = res.data.list||[{}];
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
      async initGroupConfig(){
        const {data:{auto_pull_group}} = await getsysconfig();
        this.auto_scamper = auto_pull_group==1?true:false;
      },
      async handleScamper(e){
        const {code} = await upsysconfig({auto_market_group:-1,auto_big_group:-1,auto_pull_group:this.auto_scamper?1:0});
        if (code !=0 ) return;
        this.auto_scamper = e;
        successTips(this)
      },
      goTaskDetail(row){
        this.$router.push({path:'/wa-group-detail',query:{params:row,task_id:row.id}});
      },
      submitForm(formName){
        if(this.blastForm.explode_type == 2){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.isLoading=true;
              let params ={
                ad:this.blastForm.relpy_text,
                ids:this.blastForm.relpy_type==4?this.checkIdArry:[this.blastForm.relpy_id]
              }
              groupsendmsg(params).then(res=>{
                this.isLoading=false;
                if (res.code !=0 ) return;
                successTips(this)
                this.getPullTaskList(1);
                this.blastDialog=false;
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        }else{
          this.isLoading=true;
          groupsendmsg({ids:this.blastForm.relpy_type==4?this.checkIdArry:[this.blastForm.relpy_id]}).then(res=>{
            this.isLoading=false;
            if (res.code !=0 ) return;
            successTips(this)
            this.getPullTaskList(1);
            this.blastDialog=false;
          })
        }
    },
    beforeOneBtn(row){
      let that = this;
      that.$confirm(that.$t('sys_rai046',{value:that.$t('sys_rai098')}), that.$t('sys_l013'), {
          type: 'warning',
          confirmButtonText: that.$t('sys_c024'),
          cancelButtonText: that.$t('sys_c023'),
          beforeClose: function (action, instance, done) {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                groupsendmsg({ids:[row.id]}).then(res=>{
                  instance.confirmButtonLoading = false;
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
      // rowSelectChange(row) {
      //   let tableCell = this.$refs.serveTable;
      //   if (this.checkIdArry.includes(row.id)) {
      //     tableCell.toggleRowSelection([{row:row,selected:false}]);
      //     return;
      //   }
      //   tableCell.toggleRowSelection([{row:row,selected:true}]);
      // },
      sorthandle({ column, prop, order }) {
        console.log(column);
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
      // pageHandle({page, size}){
      //   this.loading = true;
      //   if (this.model1.limit != size) {
      //     this.model1.page = 1;
      //   }else{
      //     this.model1.page = page;
      //   }
      //   this.model1.limit = size;
      //   this.getPullTaskList();
      // },
      jumpCreatTask(row,idx){
        this.$router.push({path:"/wa-add-group",query:{id:5555}})
      },
      handleGroupBtn(val,type) {
          let that = this;
          let tipsText = type==1?that.$t('sys_rai081'):type==2?that.$t('sys_rai082'):type==3?that.$t('sys_rai097'):type==4?that.$t('sys_g146'):that.$t('sys_q111')
          that.$confirm(that.$t('sys_rai046',{value:tipsText}), that.$t('sys_l013'), {
            type: 'warning',
            confirmButtonText: that.$t('sys_c024'),
            cancelButtonText: that.$t('sys_c023'),
            beforeClose: function (action, instance, done) {
                if (action === 'confirm') {
                  let reqApi = type==1?dobatchclosepullgrouptask:type==2?dobatchdelpullgrouptask:type==3?dobatchstoppullgrouptask:type==4?dorestarttask:groupsendmsg;
                  instance.confirmButtonLoading = true;
                  let params = {};
                  type==4?params.id=val.id:params.ids=that.checkIdArry;
                  reqApi(params).then(res=>{
                    instance.confirmButtonLoading = false;
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
      showSkyBtn(row){
        this.taskForm.img=row.content;
        this.imgModel = true;
      },
      closeViewer(e) {
        this.imgModel = false;
      },
      cloneImgpreview(e) {
        if (e.target.getAttribute('class') === 'el-image-viewer__mask') {
          this.imgModel = false;
        }
      },
      exportText(row){
        doouttaskexcel({id:row.id}).then(res=>{
          if (res.code != 0) return;
            this.getPullTaskList(1);
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
.content_01{
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.audio_src{
  width: 140px;
  height: 30px;
}
.content_02{
  display: flex;
  width: 44px;
  height: 28px;
  flex-shrink: 0;
}
.content_07{
  display: flex;
  line-height: 1.3;
  margin-left: 5px;
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.blast_btn{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
.custom_header{
  ::v-deep .el-dialog--center .el-dialog__body{
    padding-top: 0;
  }
  ::v-deep .el-textarea__inner{
    line-height: 1.2;
    font-size: 12px;
    padding: 4px 4px;
  }
}
</style>
  