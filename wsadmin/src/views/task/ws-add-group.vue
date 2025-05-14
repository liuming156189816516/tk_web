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
                        <el-form-item label="群发名称：" prop="group_name">
                            <el-input clearable v-model="taskForm.group_name" maxlength="20" show-word-limit :placeholder="$t('sys_mat061',{value:$t('sys_rai103')})"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群发账号：" prop="pull_group">
                            <el-select v-model="taskForm.pull_group" :placeholder="$t('sys_c052')">
                                <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in accountGroupList" clearable :key="idx"></el-option>
                            </el-select>
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
                        <el-form-item label="营销账号：" prop="market_group">
                            <el-select v-model="taskForm.market_group" :placeholder="$t('sys_c052')">
                                <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in marketingList" clearable :key="idx"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="预埋分组：" prop="market_group">
                            <el-select v-model="taskForm.market_group" :placeholder="$t('sys_c052')">
                                <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in embeddedList" clearable :key="idx"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> -->
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
                        <el-form-item label="群发次数：" prop="group_num">
                            <el-input-number v-model ="taskForm.group_num" type="number" :min="1" label="描述文字" style="width: 120px;" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群发话术：" prop="relpy_text">
                            <el-input type="textarea" clearable v-model="taskForm.relpy_text" maxlength="2000" show-word-limit placeholder="请输入群发内容" rows="6" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button @click="$router.go(-1)">{{ $t('sys_c024') }}</el-button>
                    <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">开始群发</el-button>
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
    </div>
  </template>
  
  <script>
  import { successTips } from '@/utils/index'
  import material from '../content/material.vue';
  import { getdatapacklist } from '@/api/datamanage'
  import { getaccountgrouplist } from '@/api/storeroom'
  import { addpullgrouptask,getpullgroupgroup } from '@/api/task'
  export default {
    components:{material},
    data() {
      return {
        totalNum:0,
        source_type:"",
        is_index:"",
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
            materialData:[],
            is_announcement:1
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
        embeddedList:[],
      }
    },
    computed: {
        taskRules() {
            return {
                task_name: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                group_name: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                relpy_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' },{ max: 2000, message: '最多可输入2000个字符', trigger: 'blur' }],
                pull_group: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                market_group: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                data_pack_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                is_announcement: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }]
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
            return ["",this.$t('sys_mat093'),"",this.$t('sys_mat095'),this.$t('sys_mat092')]
        },
        sourceOption() {
            return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092')]
        }
    },
    created(){
        // let taskConfig = this.$route.query.config;
        this.getPullGroup();
        this.getDatalist();
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
            if (this.source_id) {
                for (let k = 0; k < this.taskForm.materialData.length; k++) {
                    if (this.taskForm.materialData[k].id == this.source_id) {
                        this.taskForm.materialData[k] = JSON.parse(msg)
                    }
                }
            }else{
                this.taskForm.materialData.push(JSON.parse(msg))
            }
        },
        changeAccountNum(){
            let numbers = this.accountGroupList.filter(item => {return item.group_id == this.taskForm.group_id});
            this.totalNum = numbers.reduce((sum, item) => sum + Number(item.online_num || 0), 0);
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
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        ad:this.taskForm.relpy_text,
                        name:this.taskForm.task_name,
                        qname:this.taskForm.group_name,
                        pull_group_id:this.taskForm.pull_group,
                        ad_group_id:this.taskForm.market_group,
                        data_pack_id:this.taskForm.data_pack_id,
                        pull_num:this.taskForm.group_num,
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
        restForm(){
            this.$refs.taskForm.resetFields();
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
  </style>