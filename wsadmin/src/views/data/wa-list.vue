<template>
    <div style="width:100%;height: 100%; float: left;">
        <el-form size="small" :inline="true" style="margin-top: 10px;">
            <el-form-item>
                <el-button :disabled="checkIdArry.length==0" type="danger" @click="changeIpBtn">{{ $t('sys_g047') }}</el-button>
                <el-button type="primary" @click="pushDatabtn(0,1)">{{ $t('sys_c135') }}</el-button>
            </el-form-item>
            <el-form-item >
                <el-input :placeholder="$t('sys_mat026')" v-model="model1.task_name" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initDatalist(1)">{{ $t('sys_c002') }}</el-button>
            </el-form-item>
        </el-form>
        <div class="group_main">
            <div class="tab_check_warp">
                <i slot="reference" class="el-icon-info"></i>
                <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
            </div>
            <div>
                <el-table :data="dataList" border height="680" v-loading="loading" :summary-method="getSummaries" show-summary
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)"
                    style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" ref="serveTable"
                    :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange" @row-click="rowSelectChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="name" :label="$t('sys_mat027')" minWidth="140" />
                    <el-table-column prop="invalid_num" :label="$t('sys_mat042')" minWidth="100" />
                    <el-table-column prop="up_num" :label="$t('sys_mat028')" minWidth="100" />
                    <el-table-column prop="source_repeat_num" :label="$t('sys_mat029')" minWidth="100" />
                    <el-table-column prop="repeat_num" :label="$t('sys_mat030')" minWidth="100" />
                    <el-table-column prop="into_num" :label="$t('sys_mat031')" minWidth="100" />
                    <el-table-column prop="residue_num" :label="$t('sys_mat032')" minWidth="100" />
                    <el-table-column prop="err_num" :label="$t('sys_mat106')" minWidth="100" />
                    <el-table-column prop="up_status" :label="$t('sys_l059')" minWidth="100">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.up_status==1?'warning':'success'" size="small"> {{ taskOption[scope.row.up_status] }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="expire_time" :label="$t('sys_c008')" minWidth="148">
                        <template slot-scope="scope">
                            {{ scope.row.itime>0?$baseFun.resetTime(scope.row.itime * 1000):0 }}
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('sys_c010')" width="268">
                        <template slot-scope="scope">
                            <el-popover placement="left" width="200" trigger="click">
                                <div>{{ $t('sys_mat037') }}</div>
                                <div style="display: flex;justify-content: flex-end;">
                                    {{$t('sys_mat038',{value:residueList.length})}}
                                </div>
                                <div>
                                    <template v-if="residueList.length>0">
                                        <div class="residue_less" ref="lazyEle" @scroll="lazyScroll">
                                            <el-button v-if="moreLoading" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true"></el-button>
                                            <template v-else>
                                                <div v-for="(item,idx) in residueList" :key="idx">{{ item }}</div>
                                                <div v-if="isMore" style="font-size: 12px;margin-top: 5px;">{{ $t('sys_mat014') }}</div>
                                            </template>
                                        </div>
                                    </template>
                                    <p v-else>{{ $t('sys_mat013') }}</p>
                                </div>
                                <el-button :disabled="checkIdArry.length>0" size="small" type="warning" slot="reference" @click.stop="showLeaveNum(scope.row)">{{ $t('sys_mat032') }}</el-button>
                            </el-popover>
                            <el-button :disabled="checkIdArry.length>0" size="small" type="primary" style="margin:0 10px;" @click.stop="pushDatabtn(scope.row,2)">{{ $t('sys_mat107') }}</el-button>
                            <el-button :disabled="checkIdArry.length>0" size="small" :border="false" style="padding: 0;" @click.stop>
                                <el-dropdown @command="(command)=>{handleCommand(scope.row,command)}">
                                    <el-button :disabled="checkIdArry.length>0" size="small" type="primary">{{ $t('sys_c079') }}
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(item,idx) in moreOption" :key="idx" :command="idx" v-show="item">
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
                        :page-sizes="pageOption" :current-page.sync="model1.page" :page-size="this.model1.limit"
                        layout="total, sizes, prev, pager, next, jumper" :total="this.model1.total">
                    </el-pagination>
                </div>
            </div>
        </div>

        <!-- 新增-->
        <el-dialog :title="$t('sys_mat034')" center :visible.sync="ipModel" :close-on-click-modal="false" :width="ipModelWidth">
            <el-form ref="ipForm" size="small" :model="ipForm" label-width="0" :rules="ipRules">
                <el-row>
                    <el-col :span="24">
                        <el-form-item>
                            <el-steps :active="stepsActive">
                                <el-step :title="$t('sys_c058')" :description="$t('sys_m056')"></el-step>
                                <el-step :title="$t('sys_m055')" :description="$t('sys_m057')"></el-step>
                                <el-step :title="$t('sys_mat034')" :description="$t('sys_m058')"></el-step>
                            </el-steps>
                        </el-form-item>
                    </el-col>
                    <template v-if="stepsActive==1">
                        <el-col :span="12" v-if="!ipForm.id">
                            <el-form-item prop="file_name">
                                <div class="label_title">{{ $t('sys_m059') }}</div>
                                <el-input v-model="ipForm.file_name" :placeholder="$t('sys_mat024')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item prop="data_way">
                                <div class="label_title">{{ $t('sys_g130') }}</div>
                                <el-radio-group v-model="ipForm.data_way">
                                    <el-radio :label="idx" v-for="(item,idx) in dataOption" :key="idx" v-show="item!=''">{{ item }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="24">
                            <el-form-item prop="is_err">
                                <div class="label_title">{{ $t('sys_l112') }}</div>
                                <el-radio-group v-model="ipForm.is_err">
                                    <el-radio :label="idx" v-for="(item,idx) in clearOption" :key="idx" v-show="item!=''">{{ item }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="24" >
                            <el-form-item>
                                <div class="label_title">{{ $t('sys_c058') }}</div>
                                <div>{{ $t('sys_c136') }}</div>
                                <div class="submit_btn">
                                    <el-button class="custom_file1" v-if="ipForm.file_name" style="margin-top: 0;">{{ $t('sys_c059') }}
                                        <input type="file" ref='uploadclear' @change="checkDataIsUse" id="uploadFile" title=" " />
                                    </el-button>
                                    <el-button class="custom_file1" v-else style="margin-top: 0;" @click="submitWayBtn('ipForm')">{{ $t('sys_c059') }}</el-button>
                                    <span class="export_tips" @click="downLoadTemp">
                                        <i class="el-icon-download" />{{ $t('sys_l066') }}
                                    </span>
                                </div>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="20">
                            <el-form-item style="margin-bottom: 0;">
                                <div class="label_title">选择使用数据的席位</div>
                                <div>添加席位(若最终生效席位中存在则不会重复添加)</div>
                                <div style="display: flex;justify-content: space-between;">
                                    <el-input v-model="input" :placeholder="$t('sys_mat025')"></el-input>
                                    <el-button type="primary" style="margin-left: 20px;">主要按钮</el-button>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item prop="group_id">
                                <div>最终生效席位</div>
                                <el-select clearable filterable v-model="ipForm.group_id" :placeholder="$t('sys_mat025')"
                                    style="width:100%;">
                                    <el-option v-for="item in ipGroupList" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                    </template>
                    <el-col :span="24">
                        <el-form-item label-width="0">
                            <template v-if="stepsActive==2">
                                <el-progress :text-inside="true" :stroke-width="14" :percentage="percentage"></el-progress>
                                <div class="upload_img" style="margin-top: 10px;">
                                    <img src="../../assets/upload_ing.png" alt="" srcset="">
                                </div>
                            </template>
                            <template v-if="stepsActive==3">
                                <div class="upload_img">
                                    <img src="../../assets/success.png" alt="" srcset="">
                                    <div style="font-weight: 600;">{{ $t('sys_c119') }}</div>
                                    <div v-html="$t('sys_c118',{s_number:success_number,f_number:fail_number})"></div>
                                </div>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <template v-if="stepsActive==3">
                    <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
                        <el-button @click="restUpload">{{ $t('sys_c076') }}</el-button>
                        <el-button type="primary" @click="ipModel = false">{{ $t('sys_c075') }}</el-button>
                    </el-form-item>
                </template>
            </el-form>
        </el-dialog>

        <!-- 设置IP -->
        <!-- <el-dialog :title="setIpName" center :visible.sync="setIpModel" :close-on-click-modal="false" width="450px">
            <el-form ref="ipForm" size="small" :model="ipForm" label-width="100px" :rules="ipRules">
                <el-form-item v-if="setIpType == 0" :label="$t('sys_c055') + ':'" prop="expire_time">
                    <el-date-picker v-model="ipForm.expire_time" type="datetime" :placeholder="$t('sys_c052')" />
                </el-form-item>
                <template v-if="setIpType == 1">
                    <el-form-item :label="$t('sys_l051') + ':'" prop="allot_num" label-width="140px">
                        <div style="display: flex;font-size: 12px; line-height: 20px;align-items: center;">
                            <span>单个ip最多登录</span>
                            <el-input v-model="ipForm.allot_num" size="small" style="width: 120px;margin: 0 4px;"
                                show-word-limit placeholder="请输入" />
                            <span>个账号</span>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="0">
                        <div style="display: flex;font-size: 12px;align-items: center;justify-content: center;">
                            如果IP已分配给X个账号正在使用，修改数值要≥X，否则无法生效！</div>
                    </el-form-item>
                </template>
                <template v-if="setIpType == 2">
                    <el-form-item :label="$t('sys_mat012') + ':'" prop="group_id">
                        <el-select v-model="ipForm.group_id" :placeholder="$t('sys_c052')">
                            <el-option v-for="item in ipGroupList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="0">
                        <div
                            style="display: flex;font-size: 12px;align-items: center;justify-content: center; color:#f56c6c;">
                            一个账号只能存在于一个分组中！</div>
                    </el-form-item>
                </template>

                <el-form-item v-if="setIpType == 10" :label="$t('sys_c054') + ':'" prop="country">
                    <el-select v-model="ipForm.country" :placeholder="$t('sys_c052')">
                        <el-option v-for="(item, idx) in countryList" :key="idx" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
                    <el-button @click="setIpModel = false">{{ $t('sys_c023') }}</el-button>
                    <el-button :loading="isLoading" type="primary" @click="submitSetBtn('ipForm')">{{
                        $t('sys_c024') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog> -->
    </div>
</template>
<script>
import XLSX from 'xlsx';
import Clipboard from 'clipboard';
import { successTips, resetPage } from '@/utils/index'
import { getdatapacklist,bathdel,uploadfile,getschedule,dooutputdata,getresiduenum } from '@/api/datamanage'
export default {
    data() {
        return {
            model1: {
                page: 1,
                limit: 10,
                total: 0,
                task_name: ""
            },
            Loading:"",
            percentage: 0,
            stepsActive: 1,
            ipModelType: "",
            ipModelWidth: "",
            dataList: [],
            loading: false,
            ipModel: false,
            isLoading: false,
            moreLoading: false,
            fail_number: 0,
            setIpType: "",
            waitTimer:null,
            setInter:1000,
            success_number: 0,
            countryList: [],
            checkIdArry: [],
            residueList: [],
            showNum: [7,8],
            randomNum: [1, 2, 4, 8, 3, 8, 4, 6, 3, 8],
            pageOption: resetPage(),
            ipForm: {
                id:"",
                file_name:"",
                data_way:1,
                ip_file: "",
                is_err:1
            },
            model2: {
                page: 1,
                limit: 10,
                total: 0
            },
            timer:null,
            isTime:null,
            isLoading:false,
            isMore:false
        }
    },
    computed: {
        ipRules() {
            return {
                data_way: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                is_err: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                file_name: [{ required: true, message: this.$t('sys_mat024'), trigger: 'blur' }]
            }
        },
        dataOption(){
            return ["",this.$t('sys_mat022'), this.$t('sys_mat023')]
        },
        taskOption(){
            return ["",this.$t('sys_q015'),this.$t('sys_mat047')]
        },
        stopOptions() {
            return ["", this.$t('sys_c025'), this.$t('sys_c026')]
        },
        clearOption() {
            return ["", this.$t('sys_l113'), this.$t('sys_l114')]
        },
        moreOption(){
            return ["",this.$t('sys_mat035'), this.$t('sys_mat036'), this.$t('sys_mat105')]
        }
    },
    created() {
        this.initDatalist();
    },
    methods: {
        showLeaveNum(row){
            this.model2.page=1;
            this.model2.id = row.id;
            this.getLeaveNum()
        },
        getLeaveNum(){
            this.moreLoading=true;
            getresiduenum({id:this.model2.id,page:this.model2.page,limit:this.model2.limit}).then(res=>{
                this.moreLoading=false;
                if (res.code !=0)return;
                this.model2.total = res.data.total;
                this.residueList = res.data.list||[]
            })
        },
        lazyScroll(){
            let scrollEle = this.$refs.lazyEle;
            let scrollbtn = scrollEle.scrollHeight - scrollEle.scrollTop-scrollEle.clientHeight;
            clearTimeout(this.timer);
            if (scrollbtn < 20 && this.residueList.length < this.model2.total) {
                this.timer = setTimeout(() => {
                    this.isMore = false;
                    this.model2.page +=1;
                    getresiduenum({id:this.model2.id,page:this.model2.page,limit:this.model2.limit}).then(res=>{
                        this.moreLoading=false;
                        if (res.code !=0)return;
                        this.residueList = this.residueList.concat(res.data.list)
                    })
                }, 500);
            }else{
                this.timer = setTimeout(() => {
                    this.isMore = true;
                }, 500);
            }
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
        initDatalist(num) {
            this.loading = true;
            this.model1.page = num || this.model1.page;
            const params = {
                page: this.model1.page,
                limit: this.model1.limit,
                name: this.model1.task_name
            }
            getdatapacklist(params).then(res => {
                this.loading = false;
                this.model1.total = res.data.total;
                this.dataList = res.data.list || [];
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
        pushDatabtn(row,idx) {
            this.ipModel = true;
            this.stepsActive = 1;
            this.ipForm.id=row.id;
            // this.ipModelType = 2;
            this.ipModelType = idx;
            this.startPercent();
            this.ipModelWidth = "700px";
            if (idx == 1)return;
            this.ipForm.id=row.id;
            this.ipForm.file_name=row.name;

        },
        async checkDataIsUse(e) {
            let files = this.$refs.uploadclear.files[0];
            let formData = new FormData();
            formData.append('file', files);
            formData.append('ptype',this.ipModelType);
            formData.append('name', this.ipForm.file_name);
            formData.append('into_type',this.ipForm.data_way);
            // formData.append('is_err',this.ipForm.is_err);
            if (this.ipModelType == 2) {
                formData.append('id',this.ipForm.id);
            }
            this.stepsActive=2;
            this.$refs.uploadclear.value = null;
            const result = await uploadfile(formData);
            if (result.code != 0) return;
            this.waitTimer = setInterval(async ()=>{
                const getResult = await getschedule({id:result.data.id})
                if (getResult.code != 0) return;
                if (getResult.data.up_status == 2) {
                    clearInterval(this.waitTimer);
                    this.initDatalist();
                    this.stepsActive = 3,
                    this.fail_number = getResult.data.fail;
                    this.success_number = getResult.data.success;
                }
            },this.setInter)    
            // const getResult = await getschedule({id:result.data.id})
            // if (getResult.code != 0) return;
            // this.initDatalist();
            // this.stepsActive = 3,
            // this.fail_number = getResult.data.fail;
            // this.success_number = getResult.data.success;
        },
        submitWayBtn(formName) {
            this.$refs[formName].validate( valid => {
                if (valid) {
                }
            })
        },
        startPercent() {
            this.percentage = 0;
            this.progrTimer = setInterval(() => {
                let curPercent = Number(this.randomNum[Math.floor(Math.random() * this.randomNum.length)]);
                if (this.percentage >= 35) {
                    if (this.percentage < 96) {
                        this.percentage++
                    } else {
                        this.percentage = 99
                        clearInterval(this.progrTimer)
                    }
                } else {
                    this.percentage = this.percentage + curPercent
                }
            }, 800)
        },
        restUpload() {
            this.stepsActive = 1,
            this.ipModelType = 1;
        },
        setPageSize(val) {
            this.model1.limit = val;
            this.initDatalist();
        },
        switchPage(val) {
            this.model1.page = val;
            this.initDatalist();
        },
        submitSetBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        downLoadTemp() {
            var blob = new Blob(["每行一个手机号"], { type: 'text/plain' });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = "example-import-was-data-zh.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(a.href);
        },
        changeIpBtn(){
            let that = this;
            that.$confirm(that.$t('sys_rai046',{value:that.$t('sys_c024')}), that.$t('sys_c028'), {
                type: 'warning',
                confirmButtonText: that.$t('sys_c024'),
                cancelButtonText: that.$t('sys_c023'),
                beforeClose: function (action, instance, done) {
                    if (action === 'confirm') {
                        bathdel({ids:that.checkIdArry}).then(res => {
                            if (res.code != 0) return;
                            that.initDatalist();
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
        handleCommand(row,idx){
            dooutputdata({type:idx,id:row.id}).then(res=>{
                if (res.code !=0)return;
                window.location.href = res.data.url;
            })
        }
    },
    destroyed () {
        clearInterval(this.waitTimer);
        clearTimeout(this.heartTimer);
        this.waitTimer = null;
        this.heartTimer = null;
    },
    watch: {
        ipModel(val) {
            if (val == false) {
                this.ipForm.is_err = 1;
                this.ipForm.data_way = 1;
                this.ipForm.file_name = "";
                this.ipForm.ip_file = "";
                this.$refs.ipForm.resetFields();
            }
        }
    }
}
</script>
<style scoped lang="scss">
.group_main {
    display: flex;
    width: 100%;
    flex-direction: column;
    .tab_check_warp {
        width: 100%;
        display: flex;
        color: #909399;
        font-size: 14px;
        margin-bottom: 10px;
        align-items: center;

        i {
            margin-right: 4px;
        }

        .el-checkbox {
            margin-right: 10px;
        }

        .check_num {
            color: #606266;
        }
    }
}
.text_number{
    color: #209cdf;
}
.label_title{
    color: #606266;
    font-size: 14px;
    font-weight: 700;
}
.residue_less{
    width: 100%;
    max-height: 100px;
    overflow: hidden;
    overflow-y: auto;
}
.upload_img{
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    line-height:30px; 
    margin-top: 10px;
    img{
        width: 280px;
        height: 188px;
        margin: 10px 0;
    }
}

.submit_btn {
    height: 100%;
    display: flex;
    align-items: center;
    margin-top: 0;
    .export_tips {
        display: flex;
        font-size: 12px;
        cursor: pointer;
        align-items: center;
        color: #209cdf;
        margin-left: 20px;
    }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
    color: #67c23a;
    background-color: #f0f9eb;
}</style>
    