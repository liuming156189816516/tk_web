<template>
  <div>
    <el-form :inline="true">
        <el-form-item >
            <el-input clearable size="small" v-model="roleName" :placeholder="$t('sys_c022')" />
        </el-form-item>
        <el-form-item >
            <el-button size="small" icon="el-icon-search" type="primary" @click="initRoleList(1)">{{ $t('sys_c002') }}</el-button>
        </el-form-item>
        <el-form-item class="el-item-right">
            <el-button size="small" type="primary" @click="addRole(0,0)">{{ $t('sys_c034') }}</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="roleList" height="656" border style="width: 100%;margin: 20px 0;" :header-cell-style="{color:'#909399',textAlign:'center'}" :cell-style="{textAlign:'center'}" v-loading="loading"
    element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)">
        <el-table-column prop="role_id" :label="$t('sys_c031')" minWidth="100" />
        <el-table-column prop="name" :label="$t('sys_c032')" minWidth="100" />
        <el-table-column prop="desc" :label="$t('sys_c033')" minWidth="100" />
        <el-table-column prop="stime" :label="$t('sys_c008')" minWidth="100" >
          <template slot-scope="scope">
            {{ $baseFun.resetTime(scope.row.stime*1000) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('sys_c010')" width="160">
            <template slot-scope="scope">
            <el-button size="small" type="primary" plain @click="addRole(scope.row,1)">{{ $t('sys_c027') }}</el-button>
            <el-button size="small" type="danger" plain @click="baseHandle(scope.row)">{{ $t('sys_c028') }}</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="layui_page">
        <el-pagination background @size-change="setPageSize" @current-change="switchPage" :page-sizes="pageOption"
            :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
  
    <!-- 新增-->
    <el-dialog :title="roleForm.type==0?$t('sys_c034'):$t('sys_c035')" center :visible.sync="userModel" :close-on-click-modal="false" width="400px">
        <el-form size="small" :model="roleForm" label-width="90px" :rules="userRules" ref="roleForm">
        <el-form-item :label="$t('sys_c032')+':'" prop="name">
            <el-input clearable v-model="roleForm.name" :placeholder="$t('sys_c036')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys_c033')+':'">
            <el-input clearable v-model="roleForm.desc" :placeholder="$t('sys_c037')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys_c038')+':'">
            <el-button type="primary" @click="showMenuBtn">{{ $t('sys_c039') }}</el-button>
        </el-form-item>
        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
            <el-button @click="userModel=false">{{ $t('sys_c023') }}</el-button>
            <el-button type="primary" :loading="isLoading" @click="creatBtn('roleForm')">{{ $t('sys_c024') }}</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 新增-->
    <el-dialog center :visible.sync="menuModel" :close-on-click-modal="false" width="400px">
      <el-form size="small" :model="roleForm" label-width="0" :rules="userRules" ref="roleForm">
        <el-form-item v-if="menuModel">
            <el-tree ref="menutree" :data="sysAllMenu" :default-checked-keys="checkTree" node-key="menu_id" :show-checkbox="true" default-expand-all highlight-current @check="changeCheck" />
        </el-form-item>
        <el-form-item label-width="0" style="text-align:right;" class="el-item-bottom">
            <el-button type="primary" @click="storageBtn('roleForm')">{{ $t('sys_c040') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
  
  <script>
  import {resetPage,successTips} from "@/utils/index"
  import {rolelist,dorole,allmenu} from "@/api/permission"
  export default {
    data() {
      return {
        roleName:"",
        limit:10,
        total:0,
        checkTree:[],
        roleList:[],
        roleOption:[],
        sysAllMenu:[],
        menuTree:[],
        currentMenu:[],
        isLoading:false,
        userModel:false,
        menuModel:false,
        loading:false,
        showAllCheckbox:true,
        pageOption:resetPage(),
        roleForm:{
          type:0,
          name:"",
          desc:""
        }
      }
    },
    computed:{
      userRules(){
        return {
          name: [{ required: true, message:this.$t('sys_c036'), trigger: 'blur' }],
          desc: [{ required: true, message:this.$t('sys_c037'), trigger: 'blur' }],
        }
      }
    },
    created(){
      this.initRoleList();
      this.initAllMenu();
    },
    methods:{
      async initAllMenu(){
        let { data } = await allmenu({});
        let menuTree = data.memu?.sort((a,b)=>(a.sort-b.sort))||[];
        for (let m = 0; m < menuTree.length; m++) {
          menuTree[m].label = menuTree[m].mate.title;
          if (menuTree[m].children) {
            menuTree[m].children.sort((a,b)=>(a.sort-b.sort))
            for (let c = 0; c < menuTree[m].children.length; c++) {
              menuTree[m].children[c].label = menuTree[m].children[c].mate.title;
            }
          }
        }
        this.sysAllMenu=[{id:1,label:'wsAdmin',children:menuTree}]
      },
      initRoleList(num){
        this.offest=num?num:this.offest;
        let params = {
          name: this.roleName,
          page: this.offest,
          limit: this.limit,
          account_type:2
        }
        this.loading=true;
        rolelist(params).then(res=>{
          this.loading=false;
          this.total = res.data.total;
          this.roleList = res.data.list||[];
        })
      },
      setPageSize(){
      },
      switchPage(){
    
      },
      changeCheck(data,node){
        this.checkTree = [];
        if (this.$refs.menutree.getCheckedNodes()) {
          this.checkTree = this.$refs.menutree.getCheckedNodes().map(item=>{return item.menu_id})
        }
      },
      addRole(row={},idx){
        this.checkTree=[];
        this.userModel=true;
        this.roleForm.type=idx;
        this.$nextTick(()=>{
          this.$refs.roleForm.resetFields();
          this.roleForm.desc="";
          if (idx == 0) return;
          this.roleForm.name=row.name;
          this.roleForm.desc=row.desc;
          this.roleForm.role_id=row.role_id;
          var userArr = row.menu;
          var newArr = [];
          // setTimeout(()=>{
          let menuTree = this.sysAllMenu[0].children;
          userArr.forEach(item => {
            this.checked(item,menuTree,newArr)
          });
          this.checkTree = newArr;
          // },800)
        })
      },
      checked(menu_id,data,newArr) {
        data.forEach(item => {
            if(item.menu_id == menu_id){
              if( item.children.length == 0 ){
                newArr.push(item.menu_id)
              }
            }else{
              if( item.children.length != 0 ){
                this.checked(menu_id,item.children,newArr)
              }
            }
        })
      },
      showMenuBtn(){
        this.menuModel=true;
        this.$nextTick(()=>{
          this.showAllCheckbox=true;
        })
      },
      creatBtn(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              type:this.roleForm.type,
              name:this.roleForm.name,
              desc:this.roleForm.desc,
              menu:this.currentMenu
            }
            this.roleForm.type==1?params.role_id=this.roleForm.role_id:"";
            this.isLoading=true;
            dorole(params).then(res=>{
              if (res.code != 0) return;
              successTips(this)
              this.initRoleList(1)
              this.isLoading=false;
              this.userModel=false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      storageBtn(){
        this.currentMenu = [];
        if (this.$refs.menutree) {
          let chickAllMenu = this.$refs.menutree.getHalfCheckedKeys().concat(this.$refs.menutree.getCheckedKeys());
          this.currentMenu = chickAllMenu.filter(item =>{return item !=undefined})
        }
        this.menuModel=false;
      },
      baseHandle(row,type){
        let that = this;
        that.$confirm(that.$t('sys_c046',{value:that.$t('sys_c028')}),that.$t('sys_l013'), {
          type: 'warning',
          confirmButtonText:that.$t('sys_c024'),
          cancelButtonText:that.$t('sys_c023'),
          beforeClose: function (action, instance,done) {
            if(action === 'confirm') {
              dorole({type:2,role_id:row.role_id}).then(res =>{
              	that.initRoleList()
                successTips(this)
              	done();
              })
            }else{
              done();
            }
          }
        }).catch(() => {
          that.$message({type: 'info',message:that.$t('sys_c048')});          
        })
      },
    }
  }
  </script>