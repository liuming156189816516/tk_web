<template>
    <div style="width:100%;height: 100%; float: left; position: relative;">
        <el-form size="small" :inline="true" style="margin-top: 10px;">
            <el-form-item>
                <div class="show_group" v-show="!showGroup">
                    <i class="el-icon-more"></i>
                    <div class="show_g_text" @click="showGroup=true">
                        {{ $t('sys_mat064') }}
                        <i class="el-icon-d-arrow-right"></i>
                    </div>
                </div>
            </el-form-item>
            <el-form-item class="select_body">
                <div style="display: flex;">
                    <el-select class="select_ele" v-model="model1.seat_id" :placeholder="$t('sys_c052')" @change="model1.account=''">
                        <el-option v-for="(item, idx) in seatOption" :key="idx" :label="item" :value="idx" v-show="item!=''" />
                    </el-select>
                    <el-input clearable class="input_ele" :placeholder="$t('sys_mat021')" v-model="model1.account" />
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initNumberList(1)">{{ $t('sys_c002') }}</el-button>
                <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
            </el-form-item>
            <el-form-item class="el-item-right">
                <el-dropdown @command="(command)=>{handleCommand(0,command)}" trigger="click" style="margin-left:10px;">
                    <el-button type="success"> {{ $t('sys_g018') }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :disabled="checkIdArry.length==0" v-for="(item, idx) in betchOption" :key="idx" :command="{item,idx}" :id="idx">
                            {{ item }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" style="margin-left: 10px;" @click="newSeathandle">{{ $t('sys_mat078')}}</el-button>
            </el-form-item>
        </el-form>
        <!-- 分组管理 -->
        <div class="continer_main">
            <div :class="[!showGroup?'group_mian_hide':'']">
                <div class="group_head_warp">
                    <div class="group_head" @click="changeGroup(0, 'clear')">
                        <i class="el-icon-d-arrow-left" @click="showGroup=false"></i>
                        {{ $t('sys_g049') }} ({{ numGroupTotal }})
                    </div>
                    <div class="group_icon">
                        <el-popover v-model="model4.q_popover" placement="top" width="230">
                            <p>
                                <el-input v-model="model4.g_name" clearable size="small" maxlength="20" show-word-limit :placeholder="$t('sys_mat021')" />
                            </p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="model4.q_popover=false">{{ $t('sys_c023') }}</el-button>
                                <el-button size="mini" type="primary"  @click="initNumberGroup">{{ $t('sys_c024') }}</el-button>
                            </div>
                            <i class="el-icon-search" slot="reference" />
                        </el-popover>
                        <el-popover v-model="model4.add_popover" placement="top" width="230">
                            <p>
                                <el-input v-model="model4.g_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                            </p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="model4.add_popover=false">{{ $t('sys_c023') }}</el-button>
                                <el-button type="primary" size="mini" :loading="model4.ipLoading" :disabled="!model4.g_name.trim()" @click="addGroup">{{ $t('sys_c024') }}</el-button>
                            </div>
                            <i slot="reference" class="el-icon-plus" style="margin-left: 10px;" @click.stop="editGroup(0, 1)" />
                        </el-popover>
                    </div>
                </div>
                <el-button v-if="loadingGroup" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true" />
                <template v-else>
                    <div class="group_warp">
                        <template v-if="numberGroupList.length>0">
                            <div v-for="(item, idx) in numberGroupList" :key="idx" :class="['group_item', groupIdx === idx ? 'group_active' : '']"  @click="changeGroup(item, idx)">
                                <div class="group_name">
                                    <i class="left_icon" :class="['left_icon', groupIdx === idx ? 'el-icon-folder-opened' : 'el-icon-folder']" />
                                    <span class="group_text">{{ item.name }}</span>
                                    <span>({{ item.count }})</span>
                                </div>
                                <div class="group_icon" v-if="idx!=0">
                                    <el-popover :key="idx" v-model="item.visible" placement="top" width="230">
                                        <p>
                                            <el-input v-model="model4.g_name" clearable size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                                        </p>
                                        <div style="text-align: right; margin: 0">
                                            <el-button size="mini" type="text" @click="item.visible = false">{{ $t('sys_c023') }}</el-button>
                                            <el-button type="primary" :loading="ipLoading" :disabled="!model4.g_name.trim()" size="mini" @click="addGroup">{{ $t('sys_c024') }}</el-button>
                                        </div>
                                        <i slot="reference" class="el-icon-edit" @click="editGroup(item, 2)" />
                                    </el-popover>
                                    <el-popconfirm :title="$t('sys_c128')" @confirm="delGroup(item, idx)" :confirm-button-text="$t('sys_c024')"
                                        :cancel-button-text="$t('sys_c023')" icon="el-icon-info">
                                        <i slot="reference" class="el-icon-delete" @click.stop></i>
                                    </el-popconfirm>
                                </div>
                            </div>
                        </template>
                        <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
                    </div>
                </template>
            </div>
            <div class="group_continer" style="margin-left: 20px;">
                <div class="tab_check_warp">
                    <i slot="reference" class="el-icon-info"></i>
                    <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
                </div>
                <el-table :data="accountDataList" :summary-method="getSummaries" show-summary border height="680" v-loading="loading"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)"
                    style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" ref="serveTable"
                    :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange" @row-click="rowSelectChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="account" :label="$t('sys_mat063')" minWidth="180" />
                    <el-table-column prop="name" :label="$t('sys_mat062')" minWidth="180" />
                    <el-table-column prop="pwd_str" :label="$t('sys_g031')" width="100" />
                    <el-table-column prop="work_id" :label="$t('sys_g074')" minWidth="230">
                        <template slot-scope="scope">
                            {{scope.row.work_id||"-"}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="online" :label="$t('sys_mat065')" minWidth="100">
                        <template slot-scope="scope">
                            <el-tag size="small" :type="scope.row.online==2?'success':'danger'"> {{ statusOptions[scope.row.online]||"未知" }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="platform_type" :label="$t('sys_mat066')" minWidth="120">
                        <template slot-scope="scope">
                            <el-tag size="small" type="success">{{ $t('sys_mat081') }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reset_time" :label="$t('sys_mat067')" minWidth="120">
                        <template slot-scope="scope">
                            <span @click.stop>
                                <!-- {{ scope.row.reset_time }} -->
                                <!-- {{ new Date(2016, 9, 10, 18, 40) }}  v-model="formatRestTime(scope.row)"-->
                                <el-time-picker :clearable="false" size="mini" v-model="scope.row.reset_time" format="HH:mm" :placeholder="$t('sys_mat067')" @change="handleRestTime(scope.row)" />
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="160">
                        <template slot-scope="scope">
                            {{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"-" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="today_passive_fan_num" :label="$t('sys_mat069')" minWidth="170">
                        <template slot-scope="scope" slot="header">
                            <el-tooltip class="item" effect="dark" content="当日账号，被动添加的粉丝数量（需要对方发消息，视为一个有效进粉）" placement="top-start">
                                <span style="color:#909399"> {{ $t('sys_mat069') }}
                                    <i class="el-icon-info" />
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="passive_fan_num" :label="$t('sys_mat070')" minWidth="140">
                        <template slot-scope="scope" slot="header">
                            <el-tooltip class="item" effect="dark" content="账号被动添加的粉丝总数（需要对方发消息，视为一个有效进粉）" placement="top-start">
                                <span style="color:#909399"> {{ $t('sys_mat070') }}
                                    <i class="el-icon-info" />
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="today_sent_num" :label="$t('sys_mat072')" minWidth="140">
                        <template slot-scope="scope" slot="header">
                            <el-tooltip class="item" effect="dark" content="当日上传号码后，对粉丝已发消息的数量（一个粉丝账号，视为一个营销数" placement="top-start">
                                <span style="color:#909399"> {{ $t('sys_mat072') }}
                                    <i class="el-icon-info" />
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="account" :label="$t('sys_mat073')" minWidth="140">
                        <template slot-scope="scope" slot="header">
                            <el-tooltip class="item" effect="dark" content="上传粉丝号码到账号通讯录的总数" placement="top-start">
                                <span style="color:#909399"> {{ $t('sys_mat073') }}
                                    <i class="el-icon-info" />
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="sent_num" :label="$t('sys_mat074')" minWidth="140">
                        <template slot-scope="scope" slot="header">
                            <el-tooltip class="item" effect="dark" content="上传号码后，对粉丝已发消息的总数（一个粉丝账号，视为一个营销数）" placement="top-start">
                                <span style="color:#909399"> {{ $t('sys_mat074') }}
                                    <i class="el-icon-info" />
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="today_reply_num" :label="$t('sys_q109')" minWidth="140" />
                    <el-table-column prop="reply_num" :label="$t('sys_q110')" minWidth="100" />
                    <el-table-column prop="today_die_num" :label="$t('sys_mat075')" minWidth="120">
                        <template slot-scope="scope" slot="header">
                            <el-tooltip class="item" effect="dark" content="统计当日坐席内被封账号数" placement="top-start">
                                <span style="color:#909399"> {{ $t('sys_mat075') }}
                                    <i class="el-icon-info" />
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="die_num" :label="$t('sys_mat076')" minWidth="120">
                        <template slot-scope="scope" slot="header">
                            <el-tooltip class="item" effect="dark" content="坐席内被封账号总数" placement="top-start">
                                <span style="color:#909399"> {{ $t('sys_mat076') }}
                                    <i class="el-icon-info" />
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="account_num" :label="$t('sys_mat077')" minWidth="120" />
                    <el-table-column fixed="right" :label="$t('sys_c010')" width="160">
                        <template slot-scope="scope">
                            <el-button plain :disabled="checkIdArry.length > 0" type="success" size="mini" @click.stop="goChatroom(scope.row)">{{ $t('sys_mat088') }}</el-button>
                            <el-button :disabled="checkIdArry.length>0" plain size="mini" @click.stop>
                                <el-dropdown @command="(command)=>{handleCommand(scope.row,command)}" trigger="click">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more" />
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :disabled="checkIdArry.length>0" v-for="(item,idx) in moreOption" :key="idx" :command="{item,idx}">
                                            {{ item }}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="layui_page">
                    <el-pagination background @size-change="setPageSize" @current-change="switchPage"
                        :page-sizes="pageOption" :current-page.sync="model1.page" :page-size="model1.limit"
                        layout="total, sizes, prev, pager, next, jumper" :total="model1.total">
                    </el-pagination>
                </div>
            </div>
        </div>

        <!-- 设置IP -->
        <el-dialog :title="setIpName" center :visible.sync="seatModel" :close-on-click-modal="false" width="450px">
            <el-form ref="groupForm" size="small" :model="groupForm" label-width="120px" :rules="groupRules">
                <template v-if="setIpType == 2">
                    <el-form-item :label="$t('sys_c053') + ':'" prop="group_id" label-width="140px">
                        <el-select size="small" clearable v-model="groupForm.group_id" :placeholder="$t('sys_c053')" style="width:100%;">
                            <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="0">
                        <div class="group_tips">一个席位只能存在于一个分组中！</div>
                    </el-form-item>
                </template>
                <template v-if="setIpType == 3 || setIpType == 4">
                    <el-form-item :label="$t('sys_mat066') + ':'" prop="plant_type">
                        <el-radio-group v-model="groupForm.plant_type">
                            <el-radio :label="1">WS</el-radio>
                            <!-- <el-radio :label="2">网页客服</el-radio> -->
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('sys_mat062') + ':'" prop="set_name">
                        <el-input v-model.trim="groupForm.set_name" clearable :placeholder="$t('sys_mat061',{value:$t('sys_mat062')})" :rows="6" maxlength="32" show-word-limit />
                    </el-form-item>
                    <el-form-item v-if="setIpType!=4" :label="$t('sys_mat063') + ':'" prop="set_account">
                        <el-input v-model.trim="groupForm.set_account" clearable :placeholder="$t('sys_mat061',{value:$t('sys_mat063')})" :rows="6" maxlength="32" show-word-limit />
                    </el-form-item>
                    <el-form-item :label="$t('sys_g031') + ':'" prop="set_pwd">
                        <el-input v-model.trim="groupForm.set_pwd" clearable :placeholder="$t('sys_mat061',{value:$t('sys_g031')})" :rows="6" maxlength="16" show-word-limit />
                    </el-form-item>
                    <el-form-item :label="$t('sys_mat067') + ':'" prop="reset_time" v-if="setIpType==3">
                        <el-time-picker :clearable="false" size="mini" v-model="groupForm.reset_time" format="HH:mm" :placeholder="$t('sys_mat067')" />
                        <!-- <el-time-select :placeholder="$t('sys_g117')" v-model="groupForm.reset_time" :picker-options="pickerOption" /> -->
                    </el-form-item>
                    <el-form-item :label="$t('sys_q113') + ':'" prop="is_sensitive">
                        <el-radio-group v-model="groupForm.is_sensitive">
                            <el-radio :label="1">{{ $t('sys_l096') }}</el-radio>
                            <el-radio :label="2">{{ $t('sys_l106') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </template>
                <el-form-item label-width="0" style="text-align:center;margin-top: 40px;" class="el-item-bottom">
                    <el-button @click="seatModel = false">{{ $t('sys_c023') }}</el-button>
                    <el-button :loading="isLoading" type="primary" @click="submitSetBtn('groupForm')">{{$t('sys_c024') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import md5 from "js-md5";
import { successTips, resetPage } from '@/utils/index'
import { getadmingrouplist,getcustomeruserlist,doadmingroup,addcustomeruser,doupcustomer,dobathdelcustomer,domovecustomergroup,doresettime } from '@/api/staff'
export default {
    data() {
        return {
            model1: {
                page: 1,
                limit: 10,
                total: 0,
                seat_id:1,
                account: "",
                group_id: "",
                set_name: "",
            },
            pickerOption: {
                start: '00:00',
                step: '00:15',
                end: '23:30'
            },
            numGroupTotal: 0,
            accountDataList: [],
            numberGroupList: [],
            loading: false,
            ipLoading: false,
            showGroup: false,
            loadingPort: false,
            seatModel: false,
            setIpName: "",
            checkIdArry: [],
            search_icon: false,
            loadingGroup: false,
            setIpType: "",
            groupForm: {
                id: "",
                group_id: "",
                plant_type: 1,
                set_account: "",
                set_name: "", 
                set_pwd: "",
                is_sensitive: 1,
                reset_time: "10:30"
            },
            pageOption: resetPage(),
            offest: 1,
            limit: 200,
            total: 0,
            groupIdx: "",
            materType: "",
            checkedNum: 0,
            isLoading: false,
            visible: false,
            addVisible: false,
            groupModel: false,
            type: "",
            groupList: [],
            batchArry: [],
            model4:{
                id:"",
                g_name:"",
                ipLoading:false,
                q_popover:false,
                add_popover:false,
            },
            showNum:[9,10,11,12,13,14,15]
        }
    },
    computed: {
        groupRules() {
            return {
                group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                plant_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'blure' }],
                set_account: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat063')}), trigger: 'blure' }],
                set_name: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat062')}), trigger: 'blure' }],
                set_pwd: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_g031')}), trigger: 'blure' }],
                reset_time: [{ required: true, message: this.$t('sys_c052'), trigger: 'blure' }],
                is_sensitive: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }]
            }
        },
        seatOption(){
            return ["",this.$t('sys_mat062'),this.$t('sys_mat063')]
        },
        statusOptions() {
            return ["",this.$t('sys_g032'),this.$t('sys_g033')]
        },
        betchOption() {
            return ["",this.$t('sys_l048'),this.$t('sys_l042')]
        },
        moreOption() {
            return ["","","","",this.$t('sys_mat089'),this.$t('sys_c028')]
        }
    },
    created() {
        this.loading=true;
        this.initNumberGroup();
    },
    methods: {
        goChatroom(row){
            this.$router.push({path:'/chatroom',query:{staff:row.account,alt:""}});
        },
        handleSelectionChange(row) {
            this.checkIdArry = row.map(item => { return item.uid })
        },
        rowSelectChange(row, column, event) {
            let refsElTable = this.$refs.serveTable;
            let findRow = this.checkIdArry.find(item => item == row.uid);
            if (findRow) {
                refsElTable.toggleRowSelection(row, false);
                return;
            }
            refsElTable.toggleRowSelection(row,true);
        },
        sorthandle({ column, prop, order }) {
            // this.model1.sort = order == 'descending' ? 'user_num' : '-user_num';
            // this.initNumberList();
        },
        restQueryBtn(){
            this.model1.seat_id=1;
            this.model1.account="";
            this.initNumberList(1)
        },
        initNumberList(num) {
            this.loading = true;
            this.model1.page = num || this.model1.page;
            const params = {
                page: this.model1.page,
                limit: this.model1.limit,
                group_id:this.model4.g_id //分组
            }
            this.model1.seat_id==1?params.name=this.model1.account:params.account=this.model1.account;
            getcustomeruserlist(params).then(res => {
                this.loading = false;
                this.model1.total = res.data.total;
                this.accountDataList = res.data.list || [];
                for (let k = 0; k < this.accountDataList.length; k++) {
                    if (this.accountDataList[k].reset_time) {
                        this.accountDataList[k].reset_time = new Date(this.$baseFun.resetTime(new Date(),7)+","+this.accountDataList[k].reset_time);
                    }
                }
                this.$nextTick(()=>{
                    if (this.$refs.serveTable) {
                        this.$refs.serveTable.doLayout(); 
                    }
                })
            })
        },
        async initNumberGroup() {
            this.loadingGroup = true;
            const { data } = await getadmingrouplist({name:this.model1.group_name,page:1,limit:100});
            this.search_icon = false;
            this.loadingGroup = false;
            this.numGroupTotal = data.total;
            this.numberGroupList = data.list || [];
            this.initNumberList(1);
        },
        editGroup(row, idx) {
            this.type = idx;
            this.model4.g_name = '';
            if (idx == 1) return;
            this.model4.id = row.id;
            this.model4.g_name = row.name;
        },
        async addGroup() {
            let params = {
                ptype: this.type,
                name: this.model4.g_name,
            }
            this.model4.ipLoading = true;
            this.type==2?params.id=this.model4.id:"";
            const newBank = await doadmingroup(params);
            if (newBank.code !== 0) return;
            this.visible = false;
            this.model4.ipLoading = false;
            this.model4.add_popover = false;
            this.initNumberGroup();
            successTips(this)
        },
        async delGroup(row) {
            const res = await doadmingroup({ ptype: 3, del_id: [row.id] });
            if (res.code !== 0) return;
            this.groupIdx = 0;
            this.initNumberGroup();
            successTips(this)
            // for (let k = 0; k < this.numberGroupList.length; k++) {
            //     if (this.numberGroupList[k].id == row.id) {
            //         this.numberGroupList.splice(k, 1)
            //     }
            // }
        },
        changeGroup(row, idx) {
            this.batchArry = [];
            this.checkedNum = 0;
            this.groupIdx = idx;
            if (idx == "clear") {
                this.model4.g_id="";
                this.model4.g_name = "";
                this.initNumberList();
            }else{
                this.model4.g_id=row.id;
                this.initNumberList();
            }
        },
        setPageSize(val) {
            this.model1.limit = val;
            this.initNumberList();
        },
        switchPage(val) {
            this.model1.page = val;
            this.initNumberList();
        },
        newSeathandle(){
            this.setIpType = 3;
            this.seatModel = true;
            this.setIpName = this.$t('sys_mat078');
            this.$nextTick(() => {
                this.$refs.groupForm.resetFields();
                this.groupForm.set_pwd="";
                this.groupForm.set_name="";
                this.groupForm.set_account="";
                this.groupForm.is_sensitive=1;
                this.groupForm.reset_time= this.$baseFun.resetTime(new Date(),8);
            })
        },
        submitSetBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.groupForm.group_id);
                    let params = {}
                    let iTime = this.$baseFun.resetTime(this.groupForm.reset_time,6)
                    if (this.setIpType == 2) { //移动分组
                        params.group_id = this.groupForm.group_id
                        params.uids = this.checkIdArry
                    } else if (this.setIpType == 3) {//新建席位
                        params.reset_time = iTime
                        params.group_id = this.model4.g_id
                        params.name = this.groupForm.set_name
                        params.account = this.groupForm.set_account
                        params.pwd = md5(this.groupForm.set_pwd)
                        params.pwd_str = this.groupForm.set_pwd
                        params.is_sensitive = this.groupForm.is_sensitive
                    } else if (this.setIpType == 4) {//编辑席位
                        params.reset_time = iTime
                        params.uids=[this.groupForm.uid]
                        params.name = this.groupForm.set_name
                        params.pwd = md5(this.groupForm.set_pwd)
                        params.pwd_str = this.groupForm.set_pwd
                        params.is_sensitive = this.groupForm.is_sensitive
                    }
                    const allPost = ["","",domovecustomergroup,addcustomeruser,doupcustomer]
                    this.isLoading=true;
                    allPost[this.setIpType](params).then(res => {
                        this.isLoading=false;
                        if (res.code != 0) return;
                        this.seatModel = false;
                        this.initNumberGroup();
                        successTips(this)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleCommand(row,command) {
            this.setIpType = command.idx;
            this.setIpName = command.item;
            if (this.checkIdArry.length==0 && command.idx<=3) {
                return successTips(this,"error",this.$t('sys_c126'));
            }
            if (this.setIpType==2 || this.setIpType==4) {
                this.seatModel = true;
                if (this.setIpType==2) {
                    this.groupForm.group_id="";
                    // this.$nextTick(()=>{
                    //     this.$refs.groupForm.resetFields();
                    // })
                }else{
                    this.groupForm.uid=row.uid;
                    this.groupForm.set_name=row.name;
                    this.groupForm.set_pwd=row.pwd_str;
                    this.groupForm.set_account=row.account;
                    this.groupForm.reset_time=row.reset_time;
                    this.groupForm.is_sensitive=row.is_sensitive||1;
                }
            }else {
                let that = this;
                that.$confirm(that.$t('sys_c046',{value:that.setIpName}), that.$t('sys_l013'), {
                    type: 'warning',
                    confirmButtonText: that.$t('sys_c024'),
                    cancelButtonText: that.$t('sys_c023'),
                    beforeClose: function (action, instance, done) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            dobathdelcustomer({uids:that.setIpType==1?that.checkIdArry:[that.groupForm.uid]}).then(res => {
                                instance.confirmButtonLoading = false;
                                if (res.code != 0) return;
                                that.initNumberGroup();
                                if (that.setIpType == 4) {
                                    window.location.href = res.data.url
                                }
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
            }
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
        handleRestTime(row){
            doresettime({uid:row.uid,reset_time:this.$baseFun.resetTime(row.reset_time,6)}).then(res => {
                if (res.code != 0) return;
                successTips(this)
            })
        }
    }
}
</script>
<style scoped lang="scss">
.show_group{
    height: 30px;
    padding: 0 15px;
    width: max-content;
    color: #e6a23c;
    cursor: pointer;
    font-size: 15px;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    background-color: #fdf6ec;
    .show_g_text{
        display: none;
    }
}
.show_group:hover{
    .show_g_text{
        display: block;
    }
    .el-icon-more{
        display: none;
    }
}
::v-deep .el-radio-group {
    margin-top: -2px;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
}

.dropdown_selected {
    color: #fff;
    background-color: #209cdf;
}

.dropdown_title {
    color: #409eff !important;
}

.remark_ext {
    width: 90px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.select_body {
  .select_ele {
    width: 120px;
    ::v-deep .el-input__inner {
      border-right: transparent;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    // ::v-deep .el-input__inner:focus{
    //     border-right: 1px solid #1890ff;
    // }
  }
  .input_ele {
    width: 202px;
    ::v-deep .el-input__inner {
      border-left: transparent;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 1px solid #DCDFE6;
    }
    ::v-deep .el-input__inner:focus{
        border-left: 1px solid #1890ff;
    }
  }
}

.continer_main {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .group_mian_hide{
        display: none;
    }
    .group_head_warp {
        display: flex;
        width: 220px;
        height: 40px;
        flex-shrink: 0;
        position: relative;
        font-size: 14px;
        color: #606266;
        align-items: center;
        padding: 0 8px 0 15px;
        box-sizing: border-box;
        justify-content: space-between;
        background: #f5f7fa;

        .group_head {
            cursor: pointer;
            display: flex;
            align-items: center;

            .el-icon-d-arrow-left {
                color: #409eff;
                font-size: 18px;
                margin-right: 10px;
            }
        }
        .el-icon-setting {
            margin-left: 10px;
        }

        .group_icon {
            display: flex;

            i {
                cursor: pointer;
            }
        }
    }

    .group_warp {
        width: 220px;
        flex-shrink: 0;
        flex-wrap: wrap;

        .group_item {
            display: flex;
            width: 100%;
            flex-shrink: 0;
            height: 36px;
            margin-top: 8px;
            cursor: pointer;
            font-size: 14px;
            align-items: center;
            justify-content: space-between;
            padding: 0 8px 0 12px;

            .group_name {
                width: 80%;
                display: flex;
                align-items: center;

                .left_icon {
                    margin-right: 6px;
                }

                .group_text {
                    max-width: 90%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .el-icon-more,
            .el-icon-delete {
                margin-left: 10px;
                position: relative;

                .del_alert {
                    //opacity: 0;
                    width: 60px;
                    padding: 10px;
                    display: flex;
                    position: absolute;
                    top: 15px;
                    left: -22px;
                    z-index: 99999;
                    border-radius: 4px;
                    align-items: center;
                    justify-content: center;
                    // background-color: darkgreen;
                    border: 1px solid #ebeef5;
                    ;
                    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

                    .del_arrow {
                        position: absolute;
                        display: block;
                        width: 0;
                        height: 0;
                        border-color: transparent;
                        border-style: solid;
                        top: -12px;
                        left: 50%;
                        transform: translateX(-50%);
                        margin-right: 3px;
                        border-bottom-width: 0;
                        border-bottom-color: #ebeef5;
                        border-width: 6px;
                        filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
                    }
                }
            }
        }

        .group_item:hover {
            background-color: #F5F8FA;
        }

        .group_active {
            background-color: #ebeef5;
        }
    }

    .group_continer {
        width: 100%;
        overflow-x: auto;
    }
}
.group_tips{
    display: flex;
    color: #f56c6c;
    font-size: 12px;
    align-items: center;
    justify-content: center;
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
    color: #67c23a;
    background-color: #f0f9eb;
}
</style>
    