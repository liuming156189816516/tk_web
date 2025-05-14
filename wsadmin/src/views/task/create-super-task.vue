<template>
    <div class="view_continer">
        <el-button size="small" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
            <span>{{$t('sys_q006')}}</span>
        </el-button>
        <el-form :model="taskForm" size="small" :rules="taskRules" ref="taskForm" label-width="25%" class="demo-ruleForm">
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item label="任务名称：" prop="task_name">
                        <el-input clearable v-model="taskForm.task_name" maxlength="20" show-word-limit placeholder="请输入任务名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item label="营销分组：" prop="ad_group_id">
                        <el-select v-model="taskForm.ad_group_id" :placeholder="$t('sys_c052')">
                            <el-option :label="item.name+'(数量：'+item.count+')，在线：('+item.online_num+')'" :value="item.group_id" v-for="(item,idx) in marketingList" :key="idx"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item label="预埋数量：" prop="ym_num">
                        <el-input clearable v-model="taskForm.ym_num" show-word-limit placeholder="请输入预埋数量" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
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
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item :label="$t('sys_q131')+'：'" prop="materialData" class="custom_say">
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
            </el-row>
            <el-form-item>
                <el-button @click="$router.go(-1)">{{ $t('sys_c023') }}</el-button>
                <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">开始炒群群</el-button>
            </el-form-item>
        </el-form>
        <el-image-viewer v-if="imgModel" :on-close="closeViewer" @click.native="cloneImgpreview" :url-list="[taskForm.qavatar]" />
        <el-dialog :title="$t('sys_mat108')" center :visible.sync="showSource" :close-on-click-modal="false" width="60%">
            <material :key="source_type==1?Math.floor(new Date().getTime()):''" @changeEle="getChildren" @closeDialog="showSource=false" :message="childMess" />
        </el-dialog>
    </div>
</template>  
  <script>
  import { successTips } from '@/utils/index';
  import material from '../content/material.vue';
  import { materialFile} from '@/api/article';
  import { addbiggrouptask,getmarketgroupgrouptwo,addmarketgrouptasktwo } from '@/api/task';
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
        taskForm:{
            task_name:"",
            ym_num:"",
            pull_group_id:"",
            ad_group_id:"",
            invite_link:"",
            relpy_text:"",
            data_pack_id:"",
            materialData:[],
        },
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
                ym_num: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                task_name: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
                ad_group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                pull_group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
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
        this.getDatalist();
    },
    methods:{
        async getDatalist() {
            const { data:{list1 }} = await getmarketgroupgrouptwo();
            this.marketingList = list1;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let materialItem = this.taskForm.materialData.map(item => {
                        if (item.type === 7) {
                            return {...item,content:JSON.stringify(item.content)};
                        }
                        return item;
                    });
                    let params = {
                        name:this.taskForm.task_name,
                        ym_num:Number(this.taskForm.ym_num),
                        ad_group_id:this.taskForm.ad_group_id,
                        invite_link:this.taskForm.invite_link,
                        material_list:materialItem
                    }
                    this.isLoading=true;
                    addmarketgrouptasktwo(params).then(res => {
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
    }
  }
  </script>
  <style scoped lang="scss">
  .view_continer{
    width: 100%;
    overflow: hidden;
    // max-height: 760px;
    position: relative;
    overflow-y: auto;
    // padding: 0 15%;
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