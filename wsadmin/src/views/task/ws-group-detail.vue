<template>
    <div class="">
      <el-form size="small" :inline="true" style="margin-top: 10px;">
        <el-form-item>
          <!-- <el-button type="primary" @click="jumpCreatTask(0,0)">{{ $t('sys_g123') }}</el-button> -->
          <el-button size="small" @click="$router.go(-1)">
              <i class="el-icon-back"></i>
              <span>{{$t('sys_q006')}}</span>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_q114')})" v-model="account" />
        </el-form-item>
        <el-form-item>
          <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_rai084')})" v-model="ad_account" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDetailList(1)">{{ $t('sys_c002') }}</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQuery">{{ $t('sys_c049') }}</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="opn_table" :data="detailDataList" border height="660" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
        <el-table-column type="index" :label="$t('sys_g020')" width="60" />
        <el-table-column prop="account" :label="$t('sys_q114')" minWidth="100" />
        <el-table-column prop="ad_account" :label="$t('sys_rai084')" minWidth="100" />
        <el-table-column prop="send_account" :label="$t('sys_q017')" minWidth="100">
            <template slot-scope="scope">
              {{ scope.row.send_account||"-" }}
            </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('sys_l059')" width="100">
            <template slot="header">
                <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command)">
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
        </el-table-column>
        <el-table-column prop="member_num" :label="$t('sys_q115')" minWidth="100" />
        <el-table-column prop="reason" :label="$t('sys_c071')" minWidth="120">
          <template slot-scope="scope">
            {{ scope.row.reason||"-" }}
          </template>
        </el-table-column>
        <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="140">
          <template slot-scope="scope">
            <div>{{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"-" }}</div>
          </template>
        </el-table-column> 
      </el-table>
      <div class="layui_page">
        <el-pagination background @size-change="sizeHandle" @current-change="pageHandle"
            :page-sizes="pageOption" :current-page.sync="page" :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </template>
  
  <script>
  import Clipboard from 'clipboard';
  import { successTips,resetPage } from '@/utils/index'
  import { getpullgroupinfolist } from '@/api/task'
  export default {
    data() {
      return {
        page:1,
        limit:10,
        total:0,
        status:"",
        account:"",
        ad_account:"",
        loading:false,
        detailDataList:[],
        pageOption: resetPage(),
      }
    },
    computed:{
      statusOptions(){
        return ["",this.$t('sys_l071'),this.$t('sys_l072'),this.$t('sys_g068'),this.$t('sys_g067'),this.$t('sys_mat047')]
      }
    },
    created() {
      this.task_id = this.$route.query.task_id;
      const query = this.$route.query.params;
      this.task_config =query.config_str?JSON.parse(query.config_str):"";
      this.copayConent=`账号来源： WS账号列表 群发模式： 默认模式 群发规则： 每个账号群发${this.task_config.send_num}条数据 群发间隔为${this.task_config.min_time}~${this.task_config.max_time}秒 话术设置： 自主设置 话术数量： ${this.task_config.material_num}条 补发话术： 未设置`
      this.getDetailList();
    },
    methods:{
      restQuery(){
        this.status="",
        this.account="";
        this.ad_account="";
        this.getDetailList(1);
      },
      async getDetailList(num){
        this.loading=true;
        this.page=num?num:this.page;
        let params = {
          page:this.page,
          limit:this.limit,
          account:this.account,
          ad_account:this.ad_account,
          status:this.status||-1,
          task_id:this.task_id
        }
        this.loading=true;
        let {data} = await getpullgroupinfolist(params)
        this.loading=false;
        this.total = data.total;
        this.detailDataList = data.list||[];
      },
      handleNewwork(row) {
        this.page=1;
        this.status = row;
        this.getDetailList();
      },
      sizeHandle(val){
        this.limit = val;
        this.getDetailList();
      },
      pageHandle(val){
        this.page = val;
        this.getDetailList();
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
</style>