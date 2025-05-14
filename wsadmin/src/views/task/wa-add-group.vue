<template>
  <div class="view_warp" ref="heightEle">
      <el-button size="small" @click="$router.go(-1)">
        <i class="el-icon-back"></i>
        <span>{{$t('sys_q006')}}</span>
      </el-button>
        <div class="view_continer">
            <el-form :model="taskForm" size="small" :rules="taskRules" ref="taskForm" label-width="25%" class="demo-ruleForm">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="活动名称：" prop="task_name">
                            <el-input clearable v-model="taskForm.task_name" maxlength="20" placeholder="请输入活动名称" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群名称：" prop="group_name">
                            <el-input clearable v-model="taskForm.group_name" maxlength="20" placeholder="请输入群名称" show-word-limit></el-input>
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
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="是否禁言：" prop="is_announcement">
                            <el-radio-group v-model="taskForm.is_announcement">
                                <el-radio :label="0">否</el-radio>
                                <el-radio :label="1">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="拉群分组：" prop="pull_group">
                            <el-select v-model="taskForm.pull_group" :placeholder="$t('sys_c052')">
                                <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in accountGroupList" :key="idx"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="营销分组：" prop="market_group">
                            <el-select v-model="taskForm.market_group" :placeholder="$t('sys_c052')">
                                <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in marketingList" :key="idx"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="预埋分组：">
                            <el-select v-model="taskForm.ym_group_id" clearable :placeholder="$t('sys_c052')">
                                <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in embeddedList" :key="idx"></el-option>
                            </el-select>
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
                        <el-form-item label="监控号：">
                            <el-input clearable v-model="taskForm.monitor_account" placeholder="请输入监控号" />
                            <!-- <el-input clearable v-model="taskForm.monitor_account" type="textarea" :rows="4" placeholder="请输入监控号"></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="单群用户数量：" prop="group_num">
                            <el-input-number v-model ="taskForm.group_num" type="number" :min="1" label="描述文字" style="width: 120px;" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="其他配置：" prop="task_conf">
                            <el-input-number v-model ="taskForm.task_conf" type="number" :min="1" label="请输入" style="width: 120px;" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="模式：" prop="is_mod">
                            <el-radio-group v-model="taskForm.is_mod">
                                <el-radio :label="1">模式1</el-radio>
                                <el-radio :label="2">模式-L</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
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
                                                <!-- <el-tooltip effect="dark" :content="scope.row.content.content" placement="top">
                                                    <div class="link_content"><span>{{$t('sys_mat019')}}：</span> <span class="comtent_text">{{scope.row.content.content}}</span></div>
                                                </el-tooltip> -->
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
                </el-row>
                <el-form-item>
                    <el-button @click="$router.go(-1)">{{ $t('sys_c023') }}</el-button>
                    <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">开始拉群</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="选择素材" center :visible.sync="showSource" :close-on-click-modal="false" width="60%">
            <material :key="source_type==1?Math.floor(new Date().getTime()):''" @changeEle="getChildren" @closeDialog="showSource=false" :message="childMess" />
        </el-dialog>
        <el-dialog title="添加链接" center :visible.sync="showLink" :close-on-click-modal="false" width="560px">
            <el-form size="small" :model="linkForm" :rules="linkRules" ref="linkForm" label-width="100px" class="demo-ruleForm">
                <template v-if="source_type==2">
                    <el-form-item :label="$t('sys_mat096')+':'" prop="link_title">
                        <el-input v-model="linkForm.link_title" :placeholder="$t('sys_mat061',{value:$t('sys_mat019')})" />
                    </el-form-item>
                    <el-form-item :label="$t('sys_mat097')+':'" prop="link_address">
                        <el-input v-model="linkForm.link_address" :placeholder="$t('sys_mat102',{value:$t('sys_mat019')})" />
                    </el-form-item>
                </template>
                <template v-if="source_type==4">
                    <el-form-item :label="$t('sys_mat098')+':'" prop="card_type">
                        <el-radio-group v-model="linkForm.card_type">
                            <el-radio :label="1">{{ $t('sys_mat101') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="card_text" style="margin-bottom: 10px;">
                        <el-input v-model="linkForm.card_text" type="textarea" :rows="8" :placeholder="$t('sys_mat102')" />
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="linkForm.update_text">{{ $t('sys_mat099') }}</el-checkbox>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button @click="showLink=false">{{ $t('sys_c023') }}</el-button>
                    <el-button type="primary" @click="submitLink('linkForm')">确认</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-image-viewer v-if="imgModel" :on-close="closeViewer" @click.native="cloneImgpreview" :url-list="[taskForm.qavatar]" />
    </div>
</template>

<script>
import { successTips } from '@/utils/index'
  import { materialFile} from '@/api/article'
  import material from '../content/material.vue';
  import { getdatapacklist } from '@/api/datamanage'
  import { addpullgrouptask,getpullgroupgroup } from '@/api/task'
  export default {
    components: {material,'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
    data() {
      return {
        totalNum:0,
        source_type:"",
        is_index:"",
        imgModel:false,
        isUpload:false,
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
            group_name:"",
            data_pack_id:"",
            group_num:50,
            pull_group:"",
            market_group:"",
            data_pack_id:"",
            relpy_text:"",
            ym_group_id:"",
            task_conf:10,
            is_announcement:1,
            monitor_account:"",
            materialData:[],
            qavatar:"",
            qremark:"",
            is_mod:1
        },
        linkForm:{
            link_title:"",
            link_address:"",
            card_type:1, 
            card_text:"",
            update_text:true
        },
        datapackList:[],
        accountOptions:[],
        accountGroupList:[],
        marketingList:[],
        embeddedList:[]
      }
    },
    computed: {
        taskRules() {
            return {
                task_name: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                group_name: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                relpy_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' },{ max: 2000, message: '最多可输入2000个字符', trigger: 'blur' }],
                pull_group: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                pull_group: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                market_group: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                data_pack_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                is_announcement: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                is_mod: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                materialData: [{required: true, required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                task_conf: [{required: true, required: true, message: this.$t('sys_c052'), trigger: 'blur' }]
            }
        },
        linkRules(){
            return {
                link_title: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat019')}), trigger: 'blur' }],
                link_address: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat019')}), trigger: 'blur' }],
                card_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                card_text: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat019')}), trigger: 'blur' }]
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
    mounted(){
        let taskConfig = this.$route.query.row;
        if (taskConfig instanceof Object) {
            if(taskConfig.config_str){
                const config =JSON.parse(taskConfig.config_str);
                this.taskForm.task_name=config.name;
                this.taskForm.qavatar=config.qavatar;
                this.taskForm.group_name=config.qname;
                this.taskForm.qremark=config.qremark||"";
                this.taskForm.task_conf=config.task_conf||10;
                this.taskForm.is_mod=Number(config.mod)||1;
                this.taskForm.is_announcement=config.is_announcement;
            }
            // this.taskForm.pull_group=taskConfig.pull_group_id;
            // this.taskForm.market_group=taskConfig.ad_group_id;
            // this.taskForm.ym_group_id=taskConfig.ym_group_id;
            // this.taskForm.data_pack_id=taskConfig.data_pack_id;
            this.taskForm.group_num=taskConfig.pull_num||50;
            // this.taskForm.materialItem=taskConfig.material_list;
            // this.taskForm.monitor_account=config.monitor_account;
            let materialItem = taskConfig.material_list.map(item => {
                if (item.type === 7) {
                    return {...item,content:JSON.parse(item.content)};
                }
                return item;
            });
            console.log(materialItem);
            this.taskForm.materialData = materialItem;
        }
    },
    methods:{
        async getPullGroup(){
            const {data:{list1,list2,list3}} = await getpullgroupgroup({page:1,limit:100});
            this.accountGroupList = list1 || [];
            this.marketingList = list2 || [];
            this.embeddedList = list3 || [];
        },
        async getDatalist() {
            const { data:{list} } = await getdatapacklist({page:1,limit:300});
            this.datapackList = list || [];
        },
        getChildren(msg){
            this.showSource=false;
            let item = JSON.parse(msg);
            msg.type==2?item.remark="":"";
            if (this.source_id) {
                for (let k = 0; k < this.taskForm.materialData.length; k++) {
                    let index = this.taskForm.materialData[k] 
                    if (index.material_id == this.source_id||index.id == this.source_id) {
                        this.$set(this.taskForm.materialData,k,{...item,material_id:item.id})
                    }
                }
            }else{
                this.taskForm.materialData.push({...item,material_id:item.id})
            }
            this.$refs.taskForm.clearValidate('materialData');
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
        showPropModel(type){
            this.is_index = "";
            this.source_id = "";
            this.source_type = type;
            if (type == 1) {
                this.childMess.type="";
                this.showSource=true;
            }else if(type == 2||type == 4){
                this.showLink=true;
                this.$nextTick(()=>{
                    this.$refs.linkForm.resetFields();
                })
            }else if(type == 3){
                this.taskForm.materialData.push({type:5,content:this.$t('sys_mat091')})
                this.$refs.taskForm.clearValidate('materialData');
            }
        },
        submitForm(formName) {
            console.log(this.taskForm.materialData);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let materialItem = this.taskForm.materialData.map(item => {
                        if (item.type === 7) {
                            return {...item,content:JSON.stringify(item.content)};
                        }
                        return item;
                    });
                    let params = {
                        config_str:JSON.stringify({
                            mod:this.taskForm.is_mod,
                            name:this.taskForm.task_name,
                            qname:this.taskForm.group_name,
                            qremark:this.taskForm.qremark,
                            qavatar:this.taskForm.qavatar,
                            pull_num:this.taskForm.group_num,
                            task_conf:this.taskForm.task_conf,
                            is_announcement:this.taskForm.is_announcement,
                            material_num:this.taskForm.materialData.length
                        }),
                        name:this.taskForm.task_name,
                        qname:this.taskForm.group_name,
                        qremark:this.taskForm.qremark,
                        qavatar:this.taskForm.qavatar,
                        pull_group_id:this.taskForm.pull_group,
                        ad_group_id:this.taskForm.market_group,
                        ym_group_id:this.taskForm.ym_group_id,
                        data_pack_id:this.taskForm.data_pack_id,
                        pull_num:this.taskForm.group_num,
                        material_list:materialItem,
                        task_conf:this.taskForm.task_conf,
                        mod:this.taskForm.is_mod,
                        monitor_account:this.taskForm.monitor_account,
                        is_announcement:this.taskForm.is_announcement
                    }
                    this.isLoading=true;
                    addpullgrouptask(params).then(res => {
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
        submitLink(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.showLink=false;
                    let index = this.taskForm.materialData[this.is_index];
                    if (index) {
                        for (let k = 0; k < this.taskForm.materialData.length; k++) {
                            if (this.is_index === k) {
                                let item = this.taskForm.materialData[k];
                                item.content=this.linkForm.card_text;
                                this.$set(this.taskForm.materialData,k,item)
                            }
                        }
                    }else{
                        let newObj = {id:"",type:this.source_type==2?5:6,}
                        this.source_type==2?this.linkForm.title=this.linkForm.link_title:"";
                        newObj.content=this.source_type==2?this.linkForm.link_address:this.linkForm.card_text
                        this.taskForm.materialData.push(newObj);
                    }
                    this.$refs.taskForm.clearValidate('materialData');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        editScript(row,idx){
            if (row.type == 6) {
                this.showLink = true;
                this.is_index = idx.$index;
                this.$nextTick(()=>{
                    this.linkForm.card_text = row.content;
                    // this.linkForm.link_title = row.content;
                    // this.linkForm.link_address = row.content; 
                })
            }else{
                this.source_type = 1;
                this.childMess.type=String(row.type);
                this.source_id = row.id||row.material_id;
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
        restForm(){
            this.$refs.taskForm.resetFields();
        },
        closeViewer(e) {
            this.imgModel = false;
        },
        cloneImgpreview(e) {
            if (e.target.getAttribute('class') === 'el-image-viewer__mask') {
                this.imgModel = false;
            }
        },
        clearWsBtn(){
            this.taskForm.group_id=[];
            this.$nextTick(()=>{
                this.$refs.taskForm.clearValidate('group_id');
            })
        }
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
  .link_content{
    display: flex;
    font-size: 12px;
    span{
        display: flex;
        width: max-content;
        flex-shrink: 0;
    }
    .comtent_text{
        display: block;
        width: calc(100% - 40px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>