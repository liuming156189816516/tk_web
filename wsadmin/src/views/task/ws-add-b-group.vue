<template>
    <div class="view_warp" ref="heightEle">
      <el-button size="small" @click="$router.go(-1)">
        <i class="el-icon-back"></i>
        <span>{{$t('sys_q006')}}</span>
      </el-button>
        <div class="view_continer">
            <el-form :model="taskForm" size="small" :rules="taskRules" ref="taskForm" label-width="25%" class="demo-ruleForm">
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label-width="15%">
                            <el-alert type="success" :closable="false" description="进群数据中将管理号码尾部加上'x'标记, 即可自动设置该账号为管理员; 例: 17205436243x 5577988138242" show-icon />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label-width="15%">
                            <el-alert type="success" :closable="false" description="1.本系统拉手取号逻辑为先进先出, 当一个账号作为拉手加入一个任务时, 此拉手将排序到最后一个加入其他任务; 2.标签内新上的号将优先加入任务; 3.拉手风控后会移除标签并且展示风控时间, 请手动在风控期过后重新绑定标签." show-icon />
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="任务名称：" prop="task_name">
                            <el-input clearable v-model="taskForm.task_name" maxlength="20" show-word-limit placeholder="请输入任务名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群名称：">
                            <el-input clearable v-model="taskForm.qname" maxlength="20" show-word-limit placeholder="请输入群名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群描述：">
                            <el-input clearable v-model="taskForm.qremark" placeholder="请输入群描述"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群头像：">
                            <div v-if="taskForm.qavatar" style="display: flex;align-items: center;">
                                <img :src="taskForm.qavatar" style="width: 60px;height: 60px;cursor: pointer;margin-right: 10px;" @click="imgModel=true">
                                <i class="el-icon-delete" style="font-size: 18px;; color:#f56c6c;cursor: pointer;" @click="taskForm.qavatar=''"></i>
                            </div>
                            <template v-else>
                                <el-button class="custom_file1" :loading="isUpload" style="margin-top: 0;">
                                    {{isUpload?$t('sys_q040'):$t('sys_c059') }}
                                    <input type="file" ref='uploadclear' @change="checkDataIsUse" id="uploadFile" title=" " />
                                </el-button>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="管理员分组：">
                            <el-select v-model="taskForm.admin_group_id" :placeholder="$t('sys_c052')">
                                <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in adminList" :key="idx"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="拉群分组：" prop="pull_group_id">
                            <el-select v-model="taskForm.pull_group_id" :placeholder="$t('sys_c052')">
                                <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in accountGroupList" :key="idx"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="营销分组：">
                            <el-select clearable v-model="taskForm.ad_group_id" :placeholder="$t('sys_c052')">
                                <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in marketingList" :key="idx"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="目标人数：" prop="target_num">
                            <el-select v-model="taskForm.target_num" filterable allow-create default-first-option placeholder="请选择/输入目标人数" @keyup.native="checkInput">
                                <el-option v-for="item in targetOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="拉手数量：" prop="match_num">
                            <el-select v-model="taskForm.match_num" filterable allow-create default-first-option placeholder="请选择/输入拉手数量" @keyup.native="checkInput">
                                <el-option v-for="item in matchOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="单次拉人数：" prop="pull_num">
                            <el-input clearable v-model="taskForm.pull_num" placeholder="请输入单次拉人数(1~100)" onkeyup="value=value.replace(/[^\d]/g,'')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="数据包：" prop="data_pack_id">
                            <el-select v-model="taskForm.data_pack_id" :placeholder="$t('sys_c052')">
                                <el-option clearable v-for="item in datapackList" :key="item.id" :label="item.name+'(入库数量：'+item.into_num+'，剩余数量：'+item.residue_num+')'"  :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="邀请链接：" prop="invite_link">
                            <el-input type="textarea" clearable v-model="taskForm.invite_link" placeholder="请输入邀请链接" rows="5" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群发话术：" prop="relpy_text">
                            <el-input type="textarea" clearable v-model="taskForm.relpy_text" maxlength="2000" show-word-limit placeholder="请输入群发内容" rows="6" />
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item :label="$t('sys_q130')+'：'" prop="materialData" class="custom_say">
                            <div class="mess_01">
                                <el-button type="primary" size="mini" v-for="(item,idx) in btnOption" :key="idx" @click="showPropModel(idx)" v-show="item!=''">{{ item }}</el-button>
                                <el-table :data="taskForm.materialData" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" style="width: 100%">
                                    <el-table-column type="index" :label="$t('sys_g020')"></el-table-column>
                                    <el-table-column prop="type" :label="$t('sys_g091')" minWidth="120">
                                        <template slot-scope="scope">
                                            <span>{{ sourceOption[scope.row.type]}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="content" :label="$t('sys_mat019')" minWidth="100">
                                        <template slot-scope="scope">
                                            <span class="content_01" v-if="scope.row.type==1||scope.row.type==5||scope.row.type==6">{{ scope.row.content }}</span>
                                            <div v-if="scope.row.type==2">
                                                <img class="content_02" :src="scope.row.content">
                                                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="scope.row.remark" />
                                            </div>
                                            <audio v-if="scope.row.type==3" controls class="audio_src">
                                                <source :src="scope.row.content" type="audio/mpeg">
                                            </audio>
                                            <video v-if="scope.row.type==4" width="60" height="35" controls>
                                                <source :src="scope.row.content" type="video/mp4">
                                            </video>
                                            <div v-if="scope.row.type==7">
                                                <img class="content_02" :src="scope.row.content.img">
                                                <div style="font-size:12px;">{{$t('sys_l080')}}：{{scope.row.content.url}}</div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="address" :label="$t('sys_c010')" width="120">
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
                    </el-col>
                </el-row> -->
                <el-form-item>
                    <el-button @click="$router.go(-1)">{{ $t('sys_c023') }}</el-button>
                    <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">开始拉群</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-image-viewer v-if="imgModel" :on-close="closeViewer" @click.native="cloneImgpreview" :url-list="[taskForm.qavatar]" />
        <el-dialog :title="$t('sys_mat108')" center :visible.sync="showSource" :close-on-click-modal="false" width="60%">
            <material :key="source_type==1?Math.floor(new Date().getTime()):''" @changeEle="getChildren" @closeDialog="showSource=false" :message="childMess" />
        </el-dialog>
    </div>
  </template>
  
  <script>
  import { successTips } from '@/utils/index'
  import { getdatapacklist } from '@/api/datamanage'
  import material from '../content/material.vue';
  import { materialFile} from '@/api/article'
  import { addbiggrouptask,getbiggroupgroup } from '@/api/task'
  export default {
    components: {material,'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
    data() {
      return {
        totalNum:0,
        source_type:"",
        is_index:"",
        source_id:"",
        isUpload:false,
        imgModel:false,
        showLink:false,
        isLoading:false,
        showSource:false,
        childMess:{
            check:false,
            is_show:1,
            type:0
        },
        timeOptionRange: '',
        pickersOptions: {
            disabledDate(time) {
                let currentDate = new Date().getTime()
                let lastDate = 3 * 24 * 60 * 60 * 1000
                let lastChooseDate = currentDate+ lastDate
                return time.getTime() < Date.now() || time.getTime() > lastChooseDate
            }
        },
        matchOptions:[3,5,10,20,30,50],
        targetOptions:[260,300,500,1000,1500],
        pickerOptions: {
            disabledDate(time) {
                let currentDate = new Date().getTime()
                let lastDate = 7 * 24 * 60 * 60 * 1000
                let lastChooseDate = currentDate + lastDate
                return time.getTime() < Date.now() || time.getTime() >= lastChooseDate
                // return (time.getTime() + (3600 * 1000 * 24 * 1)) < Date.now() || (time.getTime() + (3600 * 1000 * 24 * 1)) > lastChooseDate
            }
        },
        taskForm:{
            task_name:"",
            pull_num:"",
            qname:"",
            qremark:"",
            qavatar:"",
            admin_group_id:"",
            pull_group_id:"",
            ad_group_id:"",
            target_num:"",
            match_num:"",
            invite_link:"",
            relpy_text:"",
            data_pack_id:"",
            materialData:[],
        },
        datapackList:[],
        accountOptions:[],
        adminList:[],
        accountGroupList:[],
        marketingList:[],
        letterRule:(rule, value, callback) => {
            if (value === '') {
                callback(this.$t('sys_mat021'));
            }else if(value > 100) {
                callback(new Error('最大输入100人'));
            }else{
                callback();
            }
        }
      }
    },
    computed: {
        taskRules() {
            return {
                task_name: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                target_num: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                pull_num: [{ required: true, validator: this.letterRule}],
                admin_group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                ad_group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                pull_group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                match_num: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                invite_link: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                data_pack_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                materialData: [{required: true, required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                relpy_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' },{ max: 2000, message: '最多可输入2000个字符', trigger: 'blur' }],
            }
        },
        btnOption(){
            return ["",this.$t('sys_mat093')]
        },
        sourceOption() {
            return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092'),this.$t('sys_mat113')]
        }
    },
    created(){
        // let taskConfig = this.$route.query.config;
        this.getPullGroup();
        this.getDatalist();
    },
    methods:{
        checkInput(val){
            if(/[^0-9]/g.test(val.srcElement.value)){
                val.srcElement.value = val.srcElement.value.replace(/[^0-9]/g,'');
            }
        },
        async getPullGroup(){
            const {data:{list1,list2,list3}} = await getbiggroupgroup({page:1,limit:100});
            this.accountGroupList = list1 || [];
            this.marketingList = list2 || [];
            this.adminList = list3 || [];
        },
        async getDatalist() {
            const { data:{list} } = await getdatapacklist({page:1,limit:300});
            this.datapackList = list || [];
        },
        changeAccountNum(){
            let numbers = this.accountGroupList.filter(item => {return item.group_id == this.taskForm.group_id});
            this.totalNum = numbers.reduce((sum, item) => sum + Number(item.online_num || 0), 0);
        },
        async checkDataIsUse(e){
            let imgFormat = ["jpg", "jpeg", "png"];
            let files = this.$refs.uploadclear.files[0];
            let fileSize = files.size / 1024 / 1024;
            let fileType = files.name.split(".").pop();
            if (fileSize > 1 || imgFormat.indexOf(fileType) == -1) {
                this.$refs.uploadclear.value = null;
                return successTips(this, "error", "请选择正确的文件");
            }
            let formData = new FormData();
            formData.append('file', files);
            this.isUpload = true;
            const {data:{url}} = await materialFile(formData);
            this.isUpload = false;
            this.taskForm.qavatar = url;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // let materialItem = this.taskForm.materialData.map(item => {
                    //     if (item.type === 7) {
                    //         return {...item,content:JSON.stringify(item.content)};
                    //     }
                    //     return item;
                    // });
                    let params = {
                        name:this.taskForm.task_name,
                        pull_num:Number(this.taskForm.pull_num),
                        qname:this.taskForm.qname,
                        qremark:this.taskForm.qremark,
                        qavatar:this.taskForm.qavatar,
                        data_pack_id:this.taskForm.data_pack_id,
                        // admin_group_id:this.taskForm.admin_group_id,
                        pull_group_id:this.taskForm.pull_group_id,
                        ad_group_id:this.taskForm.ad_group_id,
                        target_num:Number(this.taskForm.target_num),
                        match_num:Number(this.taskForm.match_num),
                        invite_link:this.taskForm.invite_link,
                        // ad:this.taskForm.relpy_text,
                        // material_list:materialItem
                    }
                    this.isLoading=true;
                    addbiggrouptask(params).then(res => {
                        this.isLoading=false;
                        if (res.code != 0) return;
                        this.$router.go(-1);
                        successTips(this)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        closeViewer(e) {
            this.imgModel = false;
        },
        cloneImgpreview(e) {
            if (e.target.getAttribute('class') === 'el-image-viewer__mask') {
                this.imgModel = false;
            }
        },
        showPropModel(type){
            this.is_index = "";
            this.source_id = "";
            this.source_type = type;
            this.childMess.type="";
            this.showSource=true;
        },
        getChildren(msg){
            this.showSource=false;
            let item = JSON.parse(msg);
            msg.type==2?item.remark="":"";
            if (this.source_id) {
                for (let k = 0; k < this.taskForm.materialData.length; k++) {
                    if (this.taskForm.materialData[k].id == this.source_id) {
                        this.$set(this.taskForm.materialData,k,item)
                    }
                }
            }else{
                this.taskForm.materialData.push(item)
            }
            this.$refs.taskForm.clearValidate('materialData');
        },
        editScript(row,idx){
            if (row.type == 6) {
                this.showLink = true;
                this.is_index = idx.$index;
                this.$nextTick(()=>{
                    this.linkForm.card_text = row.content;
                    //this.linkForm.link_title = row.content;
                    //this.linkForm.link_address = row.content; 
                })
            }else{
                this.source_type = 1;
                this.source_id = row.id;
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
    }
  }
  </script>
  <style scoped lang="scss">
  .view_continer{
    width: 100%;
    // max-height: 760px;
    position: relative;
    overflow-y: auto;
    padding: 0 15%;
    box-sizing: border-box;
    .mess_title{
        font-weight: 400;
        color: #1f2f3d;
        font-size: 22px;
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
    }
    .custom_btn{
        padding: 0;
        color: #409eff;
        background: transparent;
        border-color: transparent;
        i{
            font-size: 16px;
        }
    }
    ::v-deep .el-alert{
        background: #ecf5ff;
        .el-alert__title{
            color: #409eff;
            font-size: 16px;
        }
    }
    ::v-deep .el-alert__description{
        font-size: 14px;
        line-height: 24px;
    }
    .custom_mess, .custom_say{
        .mess_01{
            width: 100%;
            padding: 10px 16px 10px 16px;
            background-color: #ecf5ff;
            border-radius: 4px;
            position: relative;
            box-sizing: border-box;
            .mess_t_01{
                font-size: 12px;
                display: flex;
                justify-content: flex-end;
                .mess_t_02{
                    color: #409eff;
                    font-weight: bold;
                }
            }
        }
    }
    .custom_say{
        .mess_01{
            border-radius: 4px;
            background: transparent;
            border: 1px solid #dcdfe6;
        }
    }
    .number_01{
        display: flex;
        font-size: 12px;
        line-height: 16px;
        .number_02{
            display: flex;
            align-items: center;
        }
        .number_03{
            margin: 0 5px;
        }
    }
  }
  </style>