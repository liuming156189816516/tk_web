<template>
  <div class="">
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <!-- <el-form-item>
        <el-button size="small" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
            <span>{{$t('sys_q006')}}</span>
        </el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="showGroupModel">{{ $t('sys_q139') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_q133')})" v-model="invite_link" />
      </el-form-item>
      <el-form-item>
        <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_rai087')})" v-model="group_id" />
      </el-form-item>
      <el-form-item>
        <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_q135')})" v-model="group_num" />
      </el-form-item>
      <el-form-item>
        <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_c071')})" v-model="reason" />
      </el-form-item>
      <!-- <el-form-item>
        <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_rai084')})" v-model="ad_account" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="getDetailList(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQuery">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
      <el-form-item class="fr" style="position: relative;z-index: 1;">
        <span style="margin-right: 10px;">炸群数量:{{ task_num }}</span> 自动炸群: <el-switch v-model="auto_scamper" active-text="开启" inactive-text="关闭" @change="handleScamper" />
        <el-button type="danger" :disabled="checkIdArry.length==0" @click="handleDelBtn" style="margin-left: 10px;">{{ $t('sys_l048') }}</el-button>
        <el-button type="primary" @click="showConfig">{{ $t('sys_q140') }}</el-button>
        <el-button type="primary" @click="exportBtn">{{ $t('sys_c080') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- <u-table ref="serveTable" :data="detailDataList" border height="660" v-loading="l_loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange" @row-click="rowSelectChange"> -->
    <u-table :data="detailDataList" row-key="id" use-virtual border :height="cliHeight" v-loading="l_loading"
        element-loading-spinner="el-icon-loading" style="width: 100%;" ref="serveTable" :total="total" :page-sizes="pageOption" 
        :page-size="limit" :current-page="page" :pagination-show="true"
        @selection-change="handleSelectionChange" @row-click="rowSelectChange" @handlePageSize="switchPage">
      <u-table-column type="selection" width="55" />
      <u-table-column type="index" :label="$t('sys_g020')" width="60" />
      <u-table-column prop="invite_link" show-overflow-tooltip :label="$t('sys_q133')" minWidth="160">
        <template slot-scope="scope">
          <span>{{ scope.row.invite_link||"-"}}</span>
        </template>
      </u-table-column>
      <u-table-column prop="qid" :label="$t('sys_rai087')" minWidth="120">
        <template slot-scope="scope">
          {{ scope.row.qid||"-" }}
        </template>
      </u-table-column>
      <u-table-column prop="member_num" :label="$t('sys_q142')" minWidth="100" />
      <!-- <u-table-column prop="task_num" label="炸群数量" minWidth="100" /> -->
      <u-table-column prop="ad_account" :label="$t('sys_q135')" minWidth="100" />
      <u-table-column prop="state" :label="$t('sys_l059')" width="120">
        <template slot="header">
            <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,1)">
            <span style="color:#909399" :class="[state?'dropdown_title':'']"> {{$t('sys_l080')}}{{ $t('sys_c005') }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :class="{'dropdown_selected':idx==state}" v-for="(item,idx) in linkOptions" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
        </template>
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.state==1?'success':'danger'"> {{ linkOptions[scope.row.state]||"-" }}</el-tag>
        </template>
      </u-table-column>
      <u-table-column prop="status" :label="$t('sys_l059')" width="100">
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
          <el-tag size="small" :type="scope.row.status==1?'info':scope.row.status==2?'warning':scope.row.status==5?'success':'danger'"> {{ statusOptions[scope.row.status]||"-" }}</el-tag>
        </template>
      </u-table-column>
      <u-table-column prop="reason" :label="$t('sys_c071')" minWidth="120">
        <template slot-scope="scope">
          {{ scope.row.reason||"-" }}
        </template>
      </u-table-column>
      <u-table-column prop="itime" :label="$t('sys_c008')" minWidth="140">
        <template slot-scope="scope">
          <div>{{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"-" }}</div>
        </template>
      </u-table-column> 
    </u-table>
    <!-- <div class="layui_page">
      <el-pagination background @size-change="sizeHandle" @current-change="pageHandle"
          :page-sizes="pageOption" :current-page.sync="page" :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <el-dialog title="上传群组" center :visible.sync="groupModel" :close-on-click-modal="false" width="560px">
      <el-form size="small" :model="groupForm" :rules="groupRules" ref="groupForm" label-width="90px" class="demo-ruleForm">
        <el-form-item :label="$t('sys_m063')+':'" prop="file_type">
          <el-radio-group v-model="groupForm.file_type" @change="radiochange">
            <el-radio :label="1">自定义</el-radio>
            <el-radio :label="2">上传文件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('sys_c052')+':'" prop="file_name" v-if="groupForm.file_type==2">
          <div class="submit_btn">
            <el-button :loading="f_loading" class="custom_file1" style="margin-top: 0;">
              {{f_loading?$t("sys_q015"):$t('sys_c059') }}
              <input type="file" ref='uploadclear' @change="uploadFileBtn" title=" " />
            </el-button>
            <div class="file_name">{{ groupForm.file_name }}</div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('sys_q117')+':'" prop="group_link" v-else>
          <el-input clearable type="textarea" rows="6" v-model="groupForm.group_link" :placeholder="$t('sys_mat061',{value:$t('sys_q117')})" />
        </el-form-item>
        <el-form-item style="text-align:center;" label-width="0px">
          <el-button @click="groupModel=false">{{ $t('sys_c023') }}</el-button>
          <el-button type="primary" :loading="isLoading" @click="submitLink('groupForm')">{{ isLoading?$t("sys_q040"):$t("sys_c024") }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="营销配置" center :visible.sync="configModel" :close-on-click-modal="false" width="860px">
      <el-form :model="taskForm" size="small" :rules="taskRules" ref="taskForm" label-width="100px">
        <el-form-item label="营销分组：" prop="market_group">
            <el-select v-model="taskForm.market_group" :placeholder="$t('sys_c052')">
                <el-option :label="item.name+'(数量：'+item.count+'，在线：'+item.online_num+')'"  :value="item.group_id" v-for="(item,idx) in marketingList" :key="idx"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('sys_q141')+'：'" prop="materialData" class="custom_say">
          <div class="mess_01">
            <el-button type="primary" size="mini" @click="showPropModel">{{ $t("sys_mat093") }}</el-button>
            <el-table :data="taskForm.materialData" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" style="width: 100%">
                <el-table-column type="index" :label="$t('sys_g020')" width="100"></el-table-column>
                <el-table-column prop="type" :label="$t('sys_g091')" minWidth="100">
                    <template slot-scope="scope">
                        <span>{{ sourceOption[scope.row.type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="content" :label="$t('sys_mat019')" minWidth="230">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type!=7">
                          <el-tooltip effect="dark" :content="scope.row.content" placement="top">
                            <span class="content_01" v-if="scope.row.type==1||scope.row.type==5||scope.row.type==6">{{ scope.row.content }}</span>
                          </el-tooltip>
                        </template>
                        <div v-if="scope.row.type==2">
                          <img class="content_02" :src="scope.row.content" @click="showImg(scope.row.content)">
                          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="scope.row.remark" />
                        </div>
                        <audio v-if="scope.row.type==3" controls class="audio_src">
                            <source :src="scope.row.content" type="audio/mpeg">
                        </audio>
                        <video v-if="scope.row.type==4" width="60" height="35" controls>
                            <source :src="scope.row.content" type="video/mp4">
                        </video>
                        <div v-if="scope.row.type==7" style="display: flex;align-items: center;flex-direction:column;">
                            <img class="content_02" :src="scope.row.content.img" @click="showImg(scope.row.content.img)">
                            <div style="font-size:12px;">{{$t('sys_l080')}}：{{scope.row.content.url}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" :label="$t('sys_c010')" minWidth="120">
                  <template slot-scope="scope">
                    <el-button class="custom_btn" size="mini" v-if="scope.row.type!=5" @click="editScript(scope.row,scope)">
                        <i class="el-icon-edit" />
                    </el-button>
                    <el-button class="custom_btn" size="mini" @click="delScript(scope)">
                        <i class="el-icon-delete-solid" />
                    </el-button>
                  </template>
                </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item class="text-center" label-width="0px"> 
            <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">保存</el-button>
        </el-form-item>
    </el-form>
    </el-dialog>

    <el-dialog title="选择素材" center :visible.sync="showSource" :close-on-click-modal="false" width="60%">
      <material :key="source_type==1?Math.floor(new Date().getTime()):''" @changeEle="getChildren" @closeDialog="showSource=false" :message="childMess" />
    </el-dialog>
    <el-image-viewer style="z-index:9999" v-if="imgModel" :on-close="closeViewer" @click.native="cloneImgpreview" :url-list="[taskForm.qavatar]" />
  </div>
</template>

<script>
import material from '../content/material.vue';
import { successTips,resetPage } from '@/utils/index'
import { getmarketgroupinfotwolist,dooutexcel,addmarketgroupinfotwo,getpullgroupgroup,gettaskconfiginfo,dotaskconfiginfo,dobatchdelmarketgroupinfo,getsysconfig,upsysconfig } from '@/api/task'
import { uploadfile } from '@/api/datamanage';
export default {
  components: {material,'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')},
  data() {
    return {
      page:1,
      limit:10,
      total:0,
      state:"",
      status:"",
      reason:"",
      cliHeight:0,
      task_num:0,
      is_index:"",
      group_id:"",
      group_num:"",
      imgModel:false,
      invite_link:"",
      ad_account:"",
      loading:false,
      groupFiles:null,
      l_loading:false,
      isLoading:false,
      f_loading:false,
      groupModel:false,
      configModel:false,
      source_type:null,
      showSource:false,
      detailDataList:[],
      marketingList:[],
      checkIdArry:[],
      auto_scamper:null,
      pageOption: resetPage(),
      groupForm:{
        group_link:"",
        file_name:"",
        file_type:1
      },
      taskForm:{
        qavatar:"",
        market_group:"",
        materialData:[],
      },
      childMess:{
        check:false,
        is_show:1,
        type:0
      }
    }
  },
  computed:{
    btnOption(){
      return ["","99999"]
    },
    taskRules(){
      return {
        market_group:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_q117')}), trigger: 'blure' }],
        materialData:[{type: 'array', required: true, message: this.$t('sys_c089',{value:this.$t('sys_q141')}), trigger:'change'}]
      }
    },
    sourceOption() {
      return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092'),this.$t('sys_mat113')]
    },
    linkOptions(){
      return ["",this.$t('sys_q137'),this.$t('sys_q138'),this.$t('sys_l024')]
    },
    statusOptions(){
      return ["",this.$t('sys_l071'),this.$t('sys_l072'),this.$t('sys_g068'),this.$t('sys_g067'),this.$t('sys_mat047')]
    },
    groupRules(){
      return {
        file_type:[{required: true, message: this.$t('sys_c089',{value:this.$t('sys_q141')}), trigger:'change'}],
        file_name:[{required: true, message: this.$t('sys_c089',{value:this.$t('sys_m064')}), trigger:'change'}],
        group_link: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_q117')}), trigger: 'blure' }],
      }
    }
  },
  created() {
    this.task_id = this.$route.query.task_id;
    const query = this.$route.query.params;
    // this.task_config =query.config_str?JSON.parse(query.config_str):"";
    // this.copayConent=`账号来源： WS账号列表 群发模式： 默认模式 群发规则： 每个账号群发${this.task_config.send_num}条数据 群发间隔为${this.task_config.min_time}~${this.task_config.max_time}秒 话术设置： 自主设置 话术数量： ${this.task_config.material_num}条 补发话术： 未设置`
    this.getDetailList();
    this.initGroupConfig();
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener("resize", this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setFullHeight);
  },
  methods:{
    radiochange(){
      this.groupFiles="";
      this.groupForm.file_name="";
      this.groupForm.group_link=""
    },
    uploadFileBtn(){
      this.f_loading = true;
      this.groupFiles = this.$refs.uploadclear.files[0];
      this.groupForm.file_name = this.groupFiles.name;
      this.$refs.uploadclear.value = null;
      this.$refs.groupForm.clearValidate('file_name');
      this.f_loading = false;
      // var reader = new FileReader();
      // reader.readAsText(files);
      // reader.onload = function(res) {
      //   _this.groupForm.group_link = res.target.result;
      //   _this.$refs.uploadclear.value = null;
      //   _this.f_loading = false;
      // }
    },
    restQuery(){
      this.status="",
      this.reason="";
      this.account="";
      this.group_id="";
      this.group_num="";
      this.ad_account="";
      this.invite_link="";
      this.getDetailList(1);
    },
    setFullHeight(){
      this.cliHeight = document.documentElement.clientHeight-200;
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => { return item.id })
    },
    async initGroupConfig(){
      const {data:{auto_market_group}} = await getsysconfig();
      this.auto_scamper = auto_market_group==1?true:false;
    },
    async handleScamper(e){
      const { code } = await upsysconfig({auto_pull_group:-1,auto_big_group:-1,auto_market_group:this.auto_scamper?1:0});
      if (code !=0 ) return;
      this.auto_scamper = e;
      successTips(this)
    },
    // rowSelectChange(row, column, event) {
    //   let refsElTable = this.$refs.serveTable;
    //   let findRow = this.checkIdArry.find(item => item == row.id);
    //   if (findRow) {
    //     refsElTable.toggleRowSelection(row, false);
    //     return;
    //   }
    //   refsElTable.toggleRowSelection(row,true);
    // },
    rowSelectChange(row) {
      let tableCell = this.$refs.serveTable;
      if (this.checkIdArry.includes(row.id)) {
          tableCell.toggleRowSelection([{row:row,selected:false}]);
          return;
      }
      tableCell.toggleRowSelection([{row:row,selected:true}]);
    },
    async getDetailList(num){
      this.page=num?num:this.page;
      let params = {
        page:this.page,
        limit:this.limit,
        qid:this.group_id,
        reason:this.reason,
        ad_account:this.group_num,
        invite_link:this.invite_link,
        status:this.status||-1,
        state:this.state||-1
      }
      this.l_loading=true;
      let {data} = await getmarketgroupinfotwolist(params)
      this.l_loading=false;
      this.total = data.total;
      this.task_num = data.task_num;
      this.detailDataList = data.list||[];
    },
    handleNewwork(row,idx) {
      this.page=1;
      idx==1?this.state=row:this.status = row;
      this.getDetailList();
    },
    switchPage({page,size}) {
        if (this.limit != size) {
          this.page = 1;
        }else{
          this.page = page;
        }
        this.limit = size;
        this.getDetailList();
    },
    // sizeHandle(val){
    //   this.limit = val;
    //   this.getDetailList();
    // },
    // pageHandle(val){
    //   this.page = val;
    //   this.getDetailList();
    // },
    async exportBtn(){
      let params = { 
        invite_link:this.invite_link,
        status:this.status||-1,
        state:this.state||-1,
        task_id:this.task_id,
        qid:this.group_id,
        reason:this.reason,
        ad_account:this.group_num
      }
      let {data} = await dooutexcel(params);
      window.location.href=data.url;
    },
    async getPullGroup(){
      const { data:{list2} } = await getpullgroupgroup({page:1,limit:100});
      this.marketingList = list2|| [];
    },
    async getConfiglist() {
        this.loading = true;
        const { data } = await gettaskconfiginfo();
        this.loading = false;
        if(data.material_list&&data.material_list.length>0){
          this.taskForm.market_group=data.market_group_id;
          this.taskForm.data_pack_id=data.data_pack_id;
          let materialItem = data.material_list.map(item => {
              if (item.type === 7) {
                  return {...item,content:JSON.parse(item.content)};
              }
              return item;
          })
          this.taskForm.materialData = materialItem;
        }
    },
    showConfig(){
      this.getPullGroup();
      this.getConfiglist();
      this.configModel=true;
    },
    showGroupModel(){
      this.groupModel=true;
      this.$nextTick(()=>{
       this.$refs.groupForm.resetFields();
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let materialItem = this.taskForm.materialData.map(item => {
            if (item.type === 7) {
              return {...item,material_id:item.id,content:JSON.stringify(item.content)};
            }
            return item;
          });
          this.isLoading=true;
          dotaskconfiginfo({market_group_id:this.taskForm.market_group,material_list:materialItem}).then(res => {
            this.isLoading=false;
            if (res.code != 0) return;
            this.getConfiglist();
            successTips(this);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    showImg(img){
      this.imgModel = true;
      this.taskForm.qavatar = img;
    },
    closeViewer(e) {
      this.imgModel = false;
    },
    cloneImgpreview(e) {
      if (e.target.getAttribute('class') === 'el-image-viewer__mask') {
        this.imgModel = false;
      }
    },
    showPropModel(){
      this.is_index = "";
      this.source_id="";
      this.source_type = 1;
      this.childMess.type="";
      this.showSource=true;
    },
    getChildren(msg){
      this.showSource=false;
      this.source_type = null;
      let item = JSON.parse(msg);
      msg.type==2?item.remark="":"";
      if (this.source_id) {
        for (let k = 0; k < this.taskForm.materialData.length; k++) {
          let index = this.taskForm.materialData[k];
          if (index.material_id == this.source_id || index.id == this.source_id) {
            this.$set(this.taskForm.materialData,k,item)
          }
        }
      }else{
        this.taskForm.materialData.push(item);
      }
    },
    editScript(row,idx){
      let material_id = row.id||row.material_id;
      if (row.type == 6) {
        this.showLink = true;
        this.is_index = idx.$index;
        this.$nextTick(()=>{
          this.linkForm.card_text = row.content;
        })
      }else{
        this.source_type = 1;
        this.source_id = material_id;
        this.childMess.type=String(row.type);
        this.showSource=true;
      }
    },
    delScript(row){
      for (let k = 0; k < this.taskForm.materialData.length; k++) {
        if (k === row.$index) {
          this.taskForm.materialData.splice(k,1)
        }
      }
    },
    submitLink(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading=true;
          let formData = new FormData();
          this.groupForm.file_type==1?formData.append('invite_link',this.groupForm.group_link):formData.append('file',this.groupFiles);
          addmarketgroupinfotwo(formData).then(res=>{
            this.isLoading=false;
            if (res.code !=0 ) return;
            successTips(this)
            this.getDetailList(1);
            this.groupModel=false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    handleDelBtn() {
      let that = this;
      that.$confirm(that.$t('sys_rai046',{value:that.$t('sys_c028')}), that.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function (action, instance, done) {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              dobatchdelmarketgroupinfo({ids:that.checkIdArry}).then(res=>{
                instance.confirmButtonLoading = false;
                if (res.code != 0) return;
                that.getDetailList(1);
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
      }
  },
  watch:{
    showSource(val){
      if(!val){
        this.source_type = null;
      }
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
.content_01{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.audio_src{
  width: 140px;
  height: 30px;
}
.content_02{
  width: 44px;
  height: 28px;
  cursor: pointer;
}
.file_name{
  width: 230px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 10px;
}
</style>