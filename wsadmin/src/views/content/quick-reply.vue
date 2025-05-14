<template>
  <div style="width:100%;">
    <div style="height:100%;">
      <div class="group_main">
        <div>
          <div class="group_head_warp">
            <div class="group_name" style="cursor: pointer;">{{ $t('sys_q002') }}</div>
            <div class="group_icon">
              <el-popover v-model="addVisible" placement="top" width="230">
                <p>
                  <el-input v-model="group_name" size="small" maxlength="20" show-word-limit
                    :placeholder="$t('sys_mat021')" />
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="addVisible = false">{{ $t('sys_c023') }}</el-button>
                  <el-button type="primary" size="mini" :loading="groupLoading" :disabled="!group_name.trim()"
                    @click="addGroup(0, 0)">{{ $t('sys_c024') }}</el-button>
                </div>
                <i slot="reference" class="el-icon-plus" @click.stop="editGroup(0, 1)" />
              </el-popover>
            </div>
          </div>
          <el-button v-if="loadingGroup" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true"></el-button>
          <template v-else>
            <div class="group_warp">
              <template v-if="replyGroupList.length > 0">
                <div v-for="(item, idx) in replyGroupList" :key="item.id"
                  :class="['group_item', model1.pgroup_id === item.id ? 'group_active' : '']"
                  @click="changeGroup(item)">
                  <div class="group_name">
                    <i class="left_icon"
                      :class="['left_icon', model1.pgroup_id === item.id ? 'el-icon-folder-opened' : 'el-icon-folder']" />
                    <span class="group_text">{{ item.name }}</span>
                    <span>({{ item.count }})</span>
                  </div>
                  <div class="group_icon">
                    <el-popover :key="idx" v-model="item.visible" placement="top" width="230">
                      <p>
                        <el-input v-model="group_name" size="small" maxlength="10" show-word-limit
                          :placeholder="$t('sys_c112')" />
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.visible = false">{{ $t('sys_c023') }}</el-button>
                        <el-button type="primary" :disabled="!group_name.trim()" size="mini"
                          @click="addGroup(item, 2)">{{ $t('sys_c024') }}</el-button>
                      </div>
                      <i slot="reference" class="el-icon-edit" @click.stop="editGroup(item, 2)" />
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
          <el-form size="small" :inline="true">
            <el-form-item>
              <el-input model1.pgroup_id :placeholder="$t('sys_mat021')" v-model="model1.name" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="initQuicklist(1)">{{ $t('sys_c002') }}</el-button>
            </el-form-item>
            <el-form-item class="el-item-right">
              <el-button type="danger" :disabled="checkIdArry.length == 0" @click="batchHandle(0,0)"> {{ $t('sys_l048') }}</el-button>
              <el-button type="success" :disabled="checkIdArry.length == 0" @click="replyModel=true"> {{ $t('sys_mat005') }}</el-button>
              <el-button type="primary" :disabled="replyGroupList.length == 0" @click="junpAddbtn(0, 1)"> {{ $t('sys_m048') }}</el-button>
              <!-- <el-button type="primary" @click="changeIpBtn(0,0)" style="margin-left: 10px;">批量入库</el-button> -->
            </el-form-item>
          </el-form>
          <div class="tab_check_warp">
            <i slot="reference" class="el-icon-info"></i>
            <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
          </div>
          <el-table :data="replyDataList" border row-key="id" :expand-row-keys="expands" height="660"
            v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;"
            :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }"
            ref="serveTable" @selection-change="handleSelectionChange" @row-click="rowSelectChange">
            <el-table-column type="selection" width="50" />
            <el-table-column type="expand" width="1">
              <template slot-scope="props">
                <div class="source_main" v-for="item in props.row.content" :key="item.id">
                  <div class="source_l">
                    <span class="source_type">{{ sourceOption[item.type] }}</span>
                    <span class="source_title">{{ item.name }}</span>
                  </div>
                  <div class="reply_main">
                    <div v-if="item.type == 1">
                      <div>
                        <el-tag type="info" size="mini">{{ $t('sys_mat019') }}</el-tag>
                      </div>
                      <div class="content_warp">
                        <el-tag size="mini">{{ $t('sys_mat017') }}</el-tag>
                        <span class="reply_content">{{ item.content }}</span>
                      </div>
                    </div>
                    <div class="content_warp" v-if="item.type == 2">
                      <img :src="item.content">
                    </div>
                    <div class="content_warp" v-if="item.type == 3">
                      <audio controls>
                        <source :src="item.content" type="audio/mpeg">
                      </audio>
                    </div>
                    <div class="content_warp" v-if="item.type == 4">
                      <video width="210" height="100" controls>
                        <source :src="item.content" type="video/mp4">
                      </video>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('sys_q001')" idth="160" />
            <el-table-column prop="desc" :label="$t('sys_mat019')" minWidth="100" />
            <el-table-column prop="itime" :label="$t('sys_g100')" minWidth="100">
              <template slot-scope="scope">
                <div>{{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "-" }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('sys_c010')" width="140">
              <template slot-scope="scope">
                <el-button :disabled="checkIdArry.length > 0" size="small" type="text" @click.stop="expandRow(scope.$index, scope.row)"> {{ $t('sys_c078') }} </el-button>
                <el-button :disabled="checkIdArry.length > 0" size="small" type="text" @click.stop="junpAddbtn(scope.row, 2)">{{$t('sys_c027') }}</el-button>
                <el-button :disabled="checkIdArry.length > 0" style="color:#f56c6c;" size="small" type="text"  @click.stop="batchHandle(scope.row,1)">{{ $t('sys_c028') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="layui_page">
            <el-pagination background @size-change="setPageSize" @current-change="switchPage" :page-sizes="pageOption"
              :page-size="this.model1.limit" :current-page.sync="model1.page"
              layout="total, sizes, prev, pager, next, jumper" :total="this.model1.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 移动分组-->
    <el-dialog :title="$t('sys_q009')" center :visible.sync="replyModel" :close-on-click-modal="false" width="450px">
      <el-form size="small" label-width="0">
        <el-form-item>
            <el-checkbox-group v-model="move_group_id" @change="handleCheckedGroup">
              <el-checkbox :disabled="model1.pgroup_id==item.id" v-for="item in replyGroupList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item style="text-align:center;" class="el-item-bottom">
          <el-button @click="replyModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button :loading="isLoading" :disabled="move_group_id.length==0" type="primary" @click="moveGoupBtn">{{ $t('sys_c024') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Clipboard from 'clipboard';
import material from '../content/material.vue';
import { successTips, resetPage } from '@/utils/index'
import { getspeechgrouplist, dospeechgroup, getspeechlist,domovereplygroup,dospeech } from '@/api/article'
export default {
  components: { material },
  data() {
    return {
      model1: {
        name: "",
        page: 1,
        limit: 10,
        total: 0,
      },
      expands: [],
      move_group_id: [],
      replyDataList: [],
      replyGroupList: [],
      loading: false,
      replyModel: false,
      checkIdArry: [],
      groupLoading: false,
      loadingGroup: false,
      pageOption: resetPage(),
      isLoading: false,
      visible: false,
      addVisible: false,
      groupModel: false,
      type: '',
      group_id: '',
      group_name: '',
      groupForm: {
        id: "",
        group_id: '',
        title: '',
        content: '',
      }
    }
  },
  computed: {
    sourceOption() {
      return ["", this.$t('sys_mat008'), this.$t('sys_mat009'), this.$t('sys_mat010'), this.$t('sys_mat011'), this.$t('sys_mat091'), this.$t('sys_mat092')]
    }
  },
  created() {
    this.initQuickGroup();
  },
  methods: {
    initQuicklist(num) {
      this.model1.page = num || this.model1.page;
      const params = {
        name: this.model1.name,
        page: this.model1.page,
        limit: this.model1.limit,
        group_id: this.model1.pgroup_id
      }
      this.loading = true;
      getspeechlist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.replyDataList = res.data.list || [];
      })
    },
    restQueryBtn() {
      this.model2.ipTime = [];
      this.getIpDetailList(1);
    },
    async moveGoupBtn(){
      let [ group_id ] = this.move_group_id;
      this.isLoading =true;
      let res = await domovereplygroup({speech_id:this.checkIdArry,group_id:group_id});
      this.isLoading =false;
      if (res.code != 0) return;
      this.replyModel=false;
      this.initQuickGroup();
    },
    async initQuickGroup() {
      this.loadingGroup = true;
      const { data: { list } } = await getspeechgrouplist({ page: 1, limit: 100 });
      this.loadingGroup = false;
      this.replyGroupList = list || [];
      if (this.replyGroupList.length>0) {
        let { id } = this.replyGroupList[0];
        this.model1.pgroup_id = id || "";
        this.initQuicklist();
      }
    },
    changeGroup(row) {
      this.model1.pgroup_id = row.id;
      this.initQuicklist();
    },
    editGroup(row, idx) {
      this.type = idx;
      this.group_name = '';
      if (idx == 1) return;
      this.groupForm.id = row.id;
      this.group_name = row.name;
    },
    async addGroup() {
      let params = {
        ptype: this.type,
        name: this.group_name,
        type: 1,
      }
      this.groupLoading = true;
      this.type == 2 ? params.id = this.groupForm.id : "";
      const newBank = await dospeechgroup(params);
      this.groupLoading = false;
      if (newBank.code !== 0) return;
      this.visible = false;
      this.addVisible = false;
      this.initQuickGroup();
      successTips(this)
    },
    async delGroup(row) {
      const res = await dospeechgroup({ ptype: 3, del_id: [row.id] });
      if (res.code !== 0) return;
      this.groupForm.group_id = "";
      successTips(this)
      for (let k = 0; k < this.replyGroupList.length; k++) {
        if (this.replyGroupList[k].id == row.id) {
          this.replyGroupList.splice(k, 1)
        }
      }
    },
    setPageSize(val) {
      this.model1.limit = val;
      this.initQuicklist();
    },
    switchPage(val) {
      this.model1.page = val;
      this.initQuicklist();
    },
    handleCheckedGroup(row){
      if (row.length>1) {
        this.move_group_id = [];
        this.move_group_id.push(row[row.length - 1]);
      }else{
        this.move_group_id = row
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
      refsElTable.toggleRowSelection(row, true);
    },
    junpAddbtn(row,type) {
      this.$router.push({ path: '/add', query: {name:row.name||"",g_id:this.model1.pgroup_id,id:row.id||"",type:type} });
    },
    expandRow(idx, row) {
      if (this.expands.indexOf(row.id) < 0) {
        this.expands = [];
        this.expands.push(row.id);
        // this.handleDetail(index, row)
      } else {
        this.expands = [];
      }
    },
    batchHandle(row,idx) {
      let that = this;
      that.$confirm(that.$t('sys_rai046',{value:that.$t('sys_c028')}),that.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function (action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            let ids = idx==1?[row.id]:that.checkIdArry;
            dospeech({ptype: 3,del_id:ids}).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code != 0) return;
              that.initQuickGroup();
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
  }
}
</script>
<style scoped lang="scss">
@import './add.scss';

.source_main {
  padding: 10px 35px;
  box-sizing: border-box;
}

.group_main {
  display: flex;
  width: 100%;
  justify-content: space-between;

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

    .custom_popover {
      position: absolute;
      top: 280px;
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
          border: 1px solid #ebeef5;
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
    height: 100%;
  }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
  color: #67c23a;
  background-color: #f0f9eb;
}

::v-deep .demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

// ::v-deep .el-table_1_column_2{
//   display: none
// }
/*此处为新增CSS，在vue中使用要加/deep/*/
::v-deep .el-table__expand-icon {
  display: none;
}

::v-deep .el-table__expand-column {
  border-left: transparent;
  border-right: transparent;
}

::v-deep .el-table__expand-column {
  visibility: hidden;
}
.el-checkbox-group{
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  ::v-deep .el-checkbox{
    width: 46%;
    margin-right: 20px;
  }
  ::v-deep .el-checkbox:nth-child(2n){
    margin-right: 0px;
  }
}
</style>