<template>
    <div style="width:100%;height: 100%; float: left; position: relative;">
        <el-form size="small" :inline="true" style="margin-top: 10px;">
            <el-form-item class="select_body">
                <div style="display: flex;">
                    <el-select class="select_ele" v-model="model1.seat_id" :placeholder="$t('sys_c052')" @change="model1.account=''">
                        <el-option v-for="(item, idx) in seatOption" :key="idx" :label="item" :value="idx" v-show="item!=''" />
                    </el-select>
                    <el-input class="input_ele" clearable :placeholder="$t('sys_mat021')" v-model="model1.account" />
                </div>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="model1.ipCtime" type="datetimerange" range-separator="-" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initNumberList(1)">{{ $t('sys_c002') }}</el-button>
                <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
            </el-form-item>
            <!-- <el-form-item>
                <el-button type="primary">{{ $t('sys_mat083') }}</el-button>
            </el-form-item> -->
        </el-form>
        <!-- 分组管理 -->
        <div class="continer_main">
            <div class="group_continer">
                <!-- <div class="tab_check_warp">
                    <i slot="reference" class="el-icon-info"></i>
                    <div> 已选 <span class="check_num">{{ checkIdArry.length || 0 }}</span> 项</div>
                </div> -->
                <el-table :data="accountDataList" border height="660" v-loading="loading"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)"
                    style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" ref="serveTable"
                    :cell-style="{ textAlign: 'center' }">
                    <!-- <el-table-column type="selection" width="55" /> -->
                    <el-table-column prop="account" :label="$t('sys_mat063')" minWidth="120" />
                    <el-table-column prop="name" :label="$t('sys_mat062')" minWidth="120" />
                    <el-table-column prop="platform_type" :label="$t('sys_mat066')" minWidth="120">
                        <template slot-scope="scope">
                            <el-tag size="small" type="success">{{ $t('sys_mat081') }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="160">
                        <template slot-scope="scope">
                            {{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"-" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="account_num" :label="$t('sys_mat077')" minWidth="120" />
                    <el-table-column prop="receive_msg_num" :label="$t('sys_mat085')" minWidth="100" />
                    <el-table-column prop="send_msg_num" :label="$t('sys_mat086')" minWidth="100" />
                    <!-- <el-table-column prop="block_num" :label="$t('sys_mat087')" minWidth="100" /> -->
                    <!-- <el-table-column fixed="right" :label="$t('sys_c010')" width="120">
                        <template slot-scope="scope">
                            <el-button :disabled="checkIdArry.length>0" type="text" size="small">
                                <el-tag size="small" type="success" >{{ $t('sys_mat090') }}</el-tag>
                            </el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
                <div class="layui_page">
                    <el-pagination background @size-change="setPageSize" @current-change="switchPage"
                        :page-sizes="pageOption" :current-page.sync="model1.page" :page-size="this.model1.limit"
                        layout="total, sizes, prev, pager, next, jumper" :total="this.model1.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { successTips, resetPage } from '@/utils/index'
import { getcustomeruserdata } from '@/api/staff'
export default {
    data() {
        return {
            model1: {
                page: 1,
                limit: 10,
                total: 0,
                seat_id:1,
                ipCtime: "",
                account: "",
            },
            checkIdArry:[],
            accountDataList:[],
            pageOption: resetPage()
        }
    },
    computed: {
        seatOption(){
            return ["",this.$t('sys_mat062'),this.$t('sys_mat063')]
        }
    },
    created() {
        this.initNumberList();
    },
    methods: {
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
        restQueryBtn(){
            this.model1.seat_id=1;
            this.model1.account="";
            this.model1.ipCtime=[];
            this.initNumberList()
        },
        initNumberList(num) {
            this.loading = true;
            const sTime = this.model1.ipCtime;
            this.model1.page = num || this.model1.page;
            const params = {
                page: this.model1.page,
                limit: this.model1.limit,
                start_time: sTime ? this.$baseFun.resetTime(sTime[0],3) : -1,
                end_time: sTime ? this.$baseFun.resetTime(sTime[1],3) : -1
            }
            this.model1.seat_id==1?params.name=this.model1.account:params.account=this.model1.account;
            getcustomeruserdata(params).then(res => {
                this.loading = false;
                this.model1.total = res.data.total;
                this.accountDataList = res.data.list || [];
            })
        },
        setPageSize(val) {
            this.model1.limit = val;
            this.initNumberList();
        },
        switchPage(val) {
            this.model1.page = val;
            this.initNumberList();
        },
        sorthandle({ column, prop, order }) {
            console.log(column);
            // this.model1.sort = order == 'descending' ? 'user_num' : '-user_num';
            // this.initNumberList();
        }
    }
}
</script>
<style scoped lang="scss">
.level_01{
    display: flex;
    color: #C0C4CC;
    align-items: center;
    width: max-content;
    padding: 0 15px;
    cursor: pointer;
    position: relative;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    .level_01_1{
        color: #606266;
        font-size: 13px;
        margin-left: 10px;
    }
    .screen_t_02{
        width: 20px;
        height: 20px;
        color: #fff;
        display: flex;
        font-size: 12px;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-left: 5px;
        background-color: #409eff;
    }
    .down_01{
        width: 500px;
        height: 40px;
        position: absolute;
        top: 40px;
        left: 0;
        border-radius: 4px;
        border: solid 1px #dfe4ed;
        background-color: #FFFFFF;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .down_01_01{
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            top: -12px;
            left: 20%;
            transform: translateX(-50%);
            margin-right: 3px;
            border-bottom-width: 0;
            border-bottom-color: #e6ebf5;
            border-width: 6px;
            -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
            filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
        }
        .down_01_01::after{
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
        }
    }
}
.level_01:hover{
    border-color: #C0C4CC;
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
}</style>
    