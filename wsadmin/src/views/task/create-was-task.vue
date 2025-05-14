<template>
   <div class="view_warp" ref="heightEle">
      <el-button size="small" @click="$router.go(-1)">
        <i class="el-icon-back"></i>
        <span>{{$t('sys_q006')}}</span>
      </el-button>
        <div class="view_continer">
            <el-form :model="taskForm" size="small" :rules="taskRules" ref="taskForm" label-width="25%" class="demo-ruleForm">
                <h3 class="mess_title">基础信息</h3>
                <el-divider></el-divider>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="任务名称：" prop="task_name">
                            <el-input v-model="taskForm.task_name" maxlength="20" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="WS账号来源：" prop="source_num">
                            <el-select v-model="taskForm.source_num" :placeholder="$t('sys_c052')">
                                <el-option label="WS账号列表" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="选择WS账号：" prop="group_id" class="custom_mess">
                            <div class="mess_01">
                                <div class="mess_t_01">
                                    <span class="mess_t_02" style="cursor: pointer;" @click="clearWsBtn">{{ $t('sys_c049') }}</span>
                                </div>
                                <el-form-item label="选择分组：" prop="group_id" label-width="100px" style="margin-right: 20px;">
                                    <el-select v-model="taskForm.group_id" style="margin-left: 20px;" :placeholder="$t('sys_c052')" @change="changeAccountNum">
                                        <el-option v-for="item in accountGroupList" :key="item.id" :label="item.name+'(数量：'+item.count+'，在线：'+item.online_num+')'"  :value="item.group_id" />
                                    </el-select>
                                </el-form-item>
                                <div class="mess_t_01">
                                    预计群发账号数: <span class="mess_t_02">{{ totalNum }}</span>
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="选择WS数据：" prop="ws_data">
                            <el-radio-group v-model="taskForm.ws_data">
                                <el-radio :label="1">WS粉丝数据</el-radio>
                                <!-- <el-radio label="群发未回复粉丝数据"></el-radio> -->
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item prop="data_pack_id">
                            <el-select v-model="taskForm.data_pack_id" :placeholder="$t('sys_c052')">
                                <el-option v-for="item in datapackList" :key="item.id" :label="item.name+'(入库数量：'+item.into_num+'，剩余数量：'+item.residue_num+')'"  :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="任务开始时间：">
                            <el-date-picker v-model="taskForm.start_time" :picker-options="pickersOptions" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('sys_c052')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="任务结束时间：" prop="end_time" class="hide_text">
                            <el-date-picker v-model="taskForm.end_time" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" type="datetime" :placeholder="$t('sys_c052')" />
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <h3 class="mess_title">规则设置</h3>
                <el-divider></el-divider>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群发模式：" prop="group_type">
                            <el-radio-group v-model="taskForm.group_type">
                                <el-radio :label="1">系统默认模式</el-radio>
                                <el-radio :label="2">快打模式</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item>
                            <el-alert :closable="false" title="系统默认模式" description="群发账号同时执行群发，都是群发第一条话术，后续话术需要粉丝回复才触发发送" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item>
                            <div class="number_01">
                                <span class="number_02">账号每群发</span>
                                <span class="number_03">
                                    <el-input-number v-model ="taskForm.group1_num" type="number" :min="1" label="描述文字" style="width: 120px;" />
                                </span>
                                <span class="number_02">条数据则完成账号群发任务。</span>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item>
                            <div class="number_01">
                                <span class="number_02">账号每群发</span>
                                <span class="number_03">
                                    <el-input-number v-model ="taskForm.group2_num" type="number" :min="1" label="描述文字" style="width: 120px;" />
                                </span>
                                <span class="number_02">条数据则休息</span>
                                <span class="number_03">
                                    <el-input-number v-model ="taskForm.sleep_num" type="number" :min="1" label="描述文字" style="width: 120px;" />
                                </span>
                                <span class="number_02">分钟。</span>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-collapse-transition>
                    <el-row :gutter="20" v-if="taskForm.group_type==1">
                        <el-col :span="18">
                            <el-form-item>
                                <div class="number_01">
                                    <span class="number_02">每个账号群发间隔为：</span>
                                    <span class="number_03">
                                        <el-input-number @blur="handleKeyUp" v-model="taskForm.sleep1_num" type="number" :min="1" style="width: 120px;" />
                                    </span>
                                    <span class="number_02">~</span>
                                    <span class="number_03">
                                        <el-input-number v-model ="taskForm.sleep2_num" @blur="checkSleep1" type="number" :min="taskForm.sleep1_num+1" style="width: 120px;" />
                                    </span>
                                    <span class="number_02">秒。</span>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-transition>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="添加好友：" prop="is_friend">
                            <el-radio-group v-model="taskForm.is_friend">
                                <el-radio :label="idx" v-for="(item,idx) in friendOption" :key="idx">{{ item }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h3 class="mess_title">话术设置</h3>
                <el-divider></el-divider>
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群发类型：" prop="group_say">
                            <el-radio-group v-model="taskForm.group_say">
                                <el-radio :label="1">自主添加</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="主推话术语言：" prop="source_num">
                            <el-select v-model="taskForm.source_num" :placeholder="$t('sys_c052')">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="群发话术：" prop="materialData" class="custom_say">
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
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="设置补发：" prop="set_add">
                            <el-radio-group v-model="taskForm.set_add">
                                <el-radio :label="1">不设置补发</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-form-item>
                    <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">开始群发</el-button>
                    <el-button @click="$router.go(-1)">{{ $t('sys_c023') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :title="$t('sys_mat108')" center :visible.sync="showSource" :close-on-click-modal="false" width="60%">
            <material :key="source_type==1?Math.floor(new Date().getTime()):''" @changeEle="getChildren" @closeDialog="showSource=false" :message="childMess" />
        </el-dialog>
        <el-dialog :title="$t('sys_mat092')" center :visible.sync="showLink" :close-on-click-modal="false" width="560px">
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
                    <div style="float:right;">
                        <el-button @click="showLink=false">{{ $t('sys_c023') }}</el-button>
                        <el-button type="primary" @click="submitLink('linkForm')">确认</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { successTips } from '@/utils/index'
import material from '../content/material.vue';
import { getdatapacklist } from '@/api/datamanage'
import { getsendmsggroup,addsendmsgtask } from '@/api/task'
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
            groupNum:0,
            task_name:"",
            source_num:1,
            group_id:"",
            ws_data:1,
            data_pack_id:"",
            start_time:"",
            end_time:"",
            group_type:1,
            group1_num:40,
            group2_num:15,
            sleep_num:20,
            sleep1_num:60,
            sleep2_num:100,
            group_say:1,
            set_add:1,
            is_friend:0,
            materialData:[],
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
        accountGroupList:[]
      }
    },
    computed: {
        taskRules() {
            return {
                task_name: [{ required: true, message: this.$t('sys_c052'), trigger: 'blur' }],
                source_num: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                ws_data: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                end_time: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                group_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                group_say: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                is_friend: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                data_pack_id: [{ required: true, message: this.$t('sys_g091'), trigger: 'change' }],
                materialData: [{ required: true, message: this.$t('sys_mat103'), trigger: 'change' }]
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
            return ["",this.$t('sys_mat093'),"",this.$t('sys_mat095')]
        },
        friendOption(){
            return [this.$t('sys_l113'),this.$t('sys_l114')]
        },
        sourceOption() {
            return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092'),this.$t('sys_mat113')]
        }
    },
    created(){
        let taskConfig = this.$route.query.config;
        if (taskConfig instanceof Object) {
            const config = JSON.parse(taskConfig.config_str);
            this.taskForm.task_name =taskConfig.name;
            // this.taskForm.group_id = taskConfig.group_ids;
            this.taskForm.group1_num=config.send_num;
            this.taskForm.sleep1_num=config.min_time;
            this.taskForm.sleep2_num=config.max_time;
            this.taskForm.group_type= config.send_type||0;
            this.taskForm.is_friend = config.is_add_friend||0;
            this.taskForm.data_type = taskConfig.ws_data;
            this.taskForm.data_pack_id = taskConfig.data_pack_id;
            this.taskForm.send_type = taskConfig.group_type;
            this.taskForm.send_num = taskConfig.group1_num;
            this.taskForm.min_time = taskConfig.sleep1_num;
            this.taskForm.max_time = taskConfig.sleep2_num;
            let materialItem = taskConfig.material_list.map(item => {
                if (item.type === 7) {
                    return {...item,content:JSON.parse(item.content)};
                }
                return item;
            });
            this.taskForm.materialData = materialItem;
        }
        this.getGroupList();
        this.getDatalist();
    },
    methods:{
        async getGroupList(){
            const { data } = await getsendmsggroup({page:1,limit:300});
            this.accountGroupList = data.list || [];
        },
        getDatalist() {
            getdatapacklist({page:1,limit:300}).then(res => {
                this.datapackList = res.data.list || [];
            })
        },
        checkSleep1(val){
            setTimeout(()=>{
                if (val.srcElement.value < this.taskForm.sleep1_num) {
                    val.srcElement.value = this.taskForm.sleep1_num+1;
                }
            },500)
        },
        handleKeyUp(val){
            setTimeout(()=>{
                if(val.srcElement.value < 1){
                    val.srcElement.value = 1;
                }
            },500)
        },
        getChildren(msg){
            this.showSource=false;
            let item = JSON.parse(msg);
            if (this.source_id) {
                for (let k = 0; k < this.taskForm.materialData.length; k++) {
                    let index = this.taskForm.materialData[k];
                        if (index.material_id == this.source_id || index.id == this.source_id) {
                            this.$set(this.taskForm.materialData,k,{...item,material_id:item.id})
                        }
                }
            }else{
                this.taskForm.materialData.push({...item,material_id:item.id})
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
                    let materialItem = this.taskForm.materialData.map(item => {
                        if (item.type === 7) {
                            return {...item,content:JSON.stringify(item.content)};
                        }
                        return item;
                    });
                    let params = {
                        config_str:JSON.stringify({
                            data_type:this.taskForm.ws_data,
                            send_type:this.taskForm.group_type,
                            send_num:this.taskForm.group1_num,
                            min_time:this.taskForm.sleep1_num,
                            max_time:this.taskForm.sleep2_num,
                            is_add_friend:this.taskForm.is_friend,
                            // speech_skill_type:this.taskForm.group_say,
                            material_num:this.taskForm.materialData.length,
                            // replenish:this.taskForm.set_add
                        }),
                        name:this.taskForm.task_name,
                        group_id:this.taskForm.group_id,
                        data_type:this.taskForm.ws_data,
                        data_pack_id:this.taskForm.data_pack_id,
                        // start_time:this.taskForm.start_time?this.$baseFun.resetTime(this.taskForm.start_time,3):-1,
                        // end_time:this.$baseFun.resetTime(this.taskForm.end_time,3),
                        send_type:this.taskForm.group_type,
                        send_num:this.taskForm.group1_num,
                        // interval_send_num:this.taskForm.group2_num,
                        // interval_send_time:this.taskForm.sleep_num,
                        min_time:this.taskForm.sleep1_num,
                        max_time:this.taskForm.sleep2_num,
                        is_add_friend:this.taskForm.is_friend,
                        // speech_skill_type:this.taskForm.group_say,
                        material_list:materialItem,
                        // replenish:this.taskForm.set_add
                    }
                    if(this.taskForm.group_type==2){
                        delete params.min_time;
                        delete params.max_time;
                    }
                    this.isLoading=true;
                    addsendmsgtask(params).then(res => {
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
                this.source_id = row.id||row.material_id;
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
            this.taskForm.group_id="";
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