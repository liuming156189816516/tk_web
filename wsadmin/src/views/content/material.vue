<template>
  <div style="width: 100%;">
    <el-alert v-if="msg_show != 1" style="margin-bottom: 10px;" :title="$t('sys_m046')" type="success" :description="$t('sys_g134')" />
    <el-form :inline="true">
      <el-form-item :label="$t('sys_mat001')">
        <el-input v-model="materialName" size="small" :placeholder="$t('sys_mat020')" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="getGroupContent(1)">{{ $t('sys_c002')}}</el-button>
      </el-form-item>
      <el-form-item class="el-item-right" v-if="msg_show != 1">
        <!-- <el-button size="small" type="primary" @click="addUser(0,0)">点击导入</el-button> -->
        <el-button size="small" type="primary" :disabled="check_text.length == 0" @click="moveGroup">{{$t('sys_mat005')}}</el-button>
        <el-button size="small" type="warning" :disabled="check_text.length == 0 && groupIdx === 0" @click="batchHandle(1)">{{$t('sys_mat006')}}</el-button>
        <el-button size="small" type="danger" :disabled="check_text.length == 0" plain @click="batchHandle(2)">{{$t('sys_l048')}}</el-button>
      </el-form-item>
      <el-form-item class="el-item-right" v-if="cardAcyive != 1 && cardAcyive != 7 && msg_show != 1">
        <el-button class="custom_file1">{{$t('sys_c059')}}
          <input type="file" ref='uploadclear' :accept="fileAccept[cardAcyive]" @change="uploadBtn" id="uploadFile" title=" ">
        </el-button>
      </el-form-item>
      <el-form-item class="el-item-right" v-if="cardAcyive == 1||cardAcyive==7">
        <el-button size="small" type="success" plain @click="addContent(0, 1)">{{$t('sys_mat004')}}</el-button>
      </el-form-item>
    </el-form>
    <div @click="hideDelBtn">
      <div class="tab_check_warp" v-if="msg_show != 1">
        <el-checkbox v-model="allChecked" @change="checkedAllBtn">{{$t('sys_g135')}}</el-checkbox>
        <div v-html="$t('sys_mat007',{value:check_text.length})"></div>
      </div>
      <el-tabs v-model="cardAcyive" type="card" @tab-click="handleCard">
        <el-tab-pane v-for="(item, idx) in cardOption" :key="idx" v-if="item != ''" :label="item" :name="idx.toString()" />
      </el-tabs>
      <div class="card_tips" v-text="tipsOption[cardAcyive]" />
      <div class="group_main">
        <div>
          <div class="group_head_warp">
            <div class="group_name">{{$t('sys_mat012')}}</div>
            <div class="group_icon">
              <el-popover v-model="addVisible" placement="top" width="230">
                <p>
                  <el-input v-model="group_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="addVisible = false">{{ $t('sys_c023') }}</el-button>
                  <el-button type="primary" size="mini" :loading="groupLoading" :disabled="!group_name.trim()"
                    @click="addGroup(0, 0)">{{ $t('sys_c024') }}</el-button>
                </div>
                <i slot="reference" class="el-icon-plus" @click.stop="editGroup(0, 1)" />
              </el-popover>
              <i class="el-icon-setting" />
            </div>
          </div>
          <el-button v-if="loadingGroup" class="loading_icon" style="margin-top: 10px;" type="primary"
            :loading="true"></el-button>
          <template v-else>
            <div class="group_warp">
              <template v-if="groupList.length>0">
                <div v-for="(item, idx) in groupList" :key="idx" :class="['group_item', groupIdx == idx ? 'group_active' : '']"
                  @click="changeGroup(item, idx)">
                  <div class="group_name">
                    <i class="left_icon" :class="['left_icon', groupIdx === idx ? 'el-icon-folder-opened' : 'el-icon-folder']" />
                    <span>{{ item.name }}</span>
                    <span>（{{ item.count }}）</span>
                  </div>
                  <div v-if="idx != 0" class="group_icon">
                    <el-popover :key="idx" v-model="item.visible" placement="top" width="230">
                      <p>
                        <el-input v-model="group_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.visible = false">{{ $t('sys_c023') }}</el-button>
                        <el-button type="primary" :disabled="!group_name.trim()" size="mini"
                          @click="addGroup(item, 2)">{{ $t('sys_c024') }}</el-button>
                      </div>
                      <i slot="reference" class="el-icon-edit" @click="editGroup(item, 2)" />
                    </el-popover>
                    <el-popconfirm :title="$t('sys_c128')" @confirm="confirmEvent(item, idx)" :confirm-button-text="$t('sys_c024')"
                      :cancel-button-text="$t('sys_c023')" icon="el-icon-info">
                      <i slot="reference" class="el-icon-more" @click.stop></i>
                    </el-popconfirm>
                  </div>
                </div>
              </template>
              <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
            </div>
          </template>
        </div>
        <div class="group_continer">
          <el-button v-if="initloading" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true"></el-button>
          <template v-else>
            <div v-if="contentList.length==0||initloading" class="empty_ele">{{ $t('sys_mat013') }}...</div>
            <template>
              <div class="main_list">
                <div :class="msg_show==1?'small_list':'data_list'" v-for="(item, idx) in contentList" :key="idx" @click.stop="checkHandle(item)">
                  <div class="data_text_01">
                    <div :class="['text_01',item.check?'text_active':'']" v-if="cardAcyive==1">{{ item.content }}</div>
                    <div class="img_01" v-if="cardAcyive==2">
                      <img :src="item.content" alt=" ">
                      <div class="cover_mask">
                        <i class="el-icon-view" @click.stop="showImg(item)"></i>
                        <i class="el-icon-document-copy" id="imgUrl" :data-clipboard-text="item.content"
                          data-clipboard-action="copy" @click.stop="copayUrl(item)"></i>
                      </div>
                    </div>
                    <div class="audio_01" v-if="cardAcyive==3">
                      <audio ref="myAudio" controls class="audio_src">
                        <source :src="item.content" type="audio/mpeg">
                      </audio>
                      <div class="cover_mask">
                        <i class="el-icon-video-play" v-if="!item.isPlay" @click.stop="playAudio(item)"></i>
                        <i class="el-icon-video-pause" v-else @click.stop="playAudio(item, false)"></i>
                        <i class="el-icon-document-copy" id="imgUrl" :data-clipboard-text="item.content"
                          data-clipboard-action="copy" @click.stop="copayUrl(item)"></i>
                      </div>
                    </div>
                    <div class="video_01" v-if="cardAcyive==4">
                      <video ref="myAudio" :width="msg_show==1?'170':'250'" :height="msg_show==1?'95':'140'" controls>
                        <source :src="item.content" type="video/mp4">
                      </video>
                      <div class="cover_mask">
                        <i class="el-icon-video-play" v-if="!item.isPlay" @click.stop="playAudio(item)"></i>
                        <i class="el-icon-video-pause" v-else @click.stop="playAudio(item, false)"></i>
                        <i class="el-icon-document-copy" id="imgUrl" :data-clipboard-text="item.content"
                          data-clipboard-action="copy" @click.stop="copayUrl(item)"></i>
                      </div>
                    </div>
                    <div class="hyper_link" v-if="cardAcyive==7">
                      <div style="display:flex;align-items: center;">
                        <span>图片：</span>
                        <div class="link_img">
                          <img :src="item.content.img" alt="">
                          <div class="cover_mask">
                            <i class="el-icon-view" @click.stop="showImg(item.content)"></i>
                            <i class="el-icon-document-copy" id="imgUrl" :data-clipboard-text="item.content.img"
                              data-clipboard-action="copy" @click.stop="copayUrl(item.content)"></i>
                          </div>
                        </div>
                      </div>
                      <el-tooltip class="item" effect="dark" :content="item.content.url" placement="top">
                        <p class="link_content"><span>链接：</span><span class="comtent_text">{{item.content.url}}</span></p>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" :content="item.content.remark" placement="top">
                        <p class="link_content"><span>描述：</span><span class="comtent_text">{{item.content.remark}}</span></p>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" :content="item.content.content" placement="top">
                        <p class="link_content"><span>内容：</span><span class="comtent_text">{{item.content.content}}</span></p>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="desc_01">
                      <el-radio-group v-if="msg_show==1&&!msg_check" v-model="radio_text" @change="checkHandle(item)">
                        <el-radio :label="item.id">{{ item.name }}</el-radio>
                      </el-radio-group>
                      <el-checkbox-group :disabled="check_nums>=5&&!item.check" v-else v-model="check_text" @change="checkHandle(item)">
                        <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
                      </el-checkbox-group>
                    <div class="desc_r_01">
                      <i v-if="cardAcyive==1||cardAcyive==7" class="el-icon-edit" @click.stop="addContent(item, 2)" />
                      <template v-else>
                        <el-popover :key="idx" v-model="item.visible" placement="top" width="230">
                          <p>
                            <el-input v-model="groupForm.title" size="small" maxlength="20" show-word-limit placeholder="请输入" />
                          </p>
                          <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="item.visible = false">{{ $t('sys_c023') }}</el-button>
                            <el-button type="primary" :disabled="!groupForm.title.trim()" size="mini" @click="submitImgName(item, 2)">{{ $t('sys_c024') }}</el-button>
                          </div>
                          <i slot="reference" class="el-icon-edit" @click.stop="editImgName(item)" />
                        </el-popover>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div>
              <div class="sub_btn_01" v-if="msg_show==1">
                <el-button size="small" @click="closeSource">{{ $t('sys_c023') }}</el-button>
                <el-button size="small" type="primary" :loading="isLoading" @click="submitSource">{{ $t('sys_c024') }}</el-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 新增-->
    <el-dialog :title="materType == 1&&cardAcyive==1?$t('sys_mat015',{ value: $t('sys_mat008') }):materType==2&&cardAcyive==1?$t('sys_mat016', { value: $t('sys_mat008') }):materType==1&&cardAcyive==7?$t('sys_mat015', { value: $t('sys_mat113') }):$t('sys_c027', { value: $t('sys_mat113') })"
      append-to-body center :visible.sync="groupModel" :close-on-click-modal="false" :width="cardAcyive==5?'600px':'450px'">
      <el-form ref="groupForm" size="small" :model="groupForm" :label-width="cardAcyive==7?'90px':'60px'" :rules="groupRules">
        <el-form-item :label="$t('sys_mat017') + ':'" prop="title">
          <el-input v-model="groupForm.title" clearable :placeholder="$t('sys_mat061',{value:$t('sys_mat017')})" />
        </el-form-item>
        <template v-if="cardAcyive==7">
          <el-form-item :label="$t('sys_mat009') + ':'" prop="imgLink">
            <div class="link_img" v-if="groupForm.imgLink">
              <img :src="groupForm.imgLink" alt="" srcset="">
              <i class="el-icon-delete" @click="groupForm.imgLink=''"></i>
            </div>
            <el-button class="custom_file1" v-else :loading="fLoading"> {{ fLoading?'loading...':$t('sys_c059')}}
              <input type="file" ref='uploadclear' :accept="fileAccept[2]" @change="uploadImg" id="uploadFile" title=" ">
            </el-button>
          </el-form-item>
          <el-form-item :label="$t('sys_l080') + ':'" prop="link">
            <el-input v-model="groupForm.link" clearable :placeholder="$t('sys_mat061',{value:$t('sys_l080')})" />
          </el-form-item>
          <el-form-item :label="$t('sys_g003') + ':'" prop="remark">
            <el-input v-model="groupForm.remark" clearable type="textarea" :rows="2" :placeholder="$t('sys_mat061',{value:$t('sys_g003')})" />
          </el-form-item>
          <el-form-item :label="$t('sys_q143') + ':'" prop="is_adv">
            <el-radio-group v-model="groupForm.is_adv">
              <el-radio :label="0">视频链接</el-radio>
              <el-radio :label="1">广告链接</el-radio>
              <el-radio :label="2">按钮链接</el-radio>
              <!-- <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio> -->
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item :label="$t('sys_mat019') + ':'" prop="content">
          <el-input v-model="groupForm.content" clearable type="textarea" :rows="6" :placeholder="$t('sys_mat061',{value:$t('sys_mat019')})" />
        </el-form-item>
        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="groupModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button :loading="isLoading" type="primary" @click="submitBtn('groupForm')">{{ $t('sys_c024') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增-->
    <el-dialog :title="$t('sys_q009')" center :visible.sync="moveModel" append-to-body :close-on-click-modal="false" width="450px">
      <el-form ref="moveForm" size="small" :model="moveForm" label-width="60px" :rules="moveRules">
        <el-form-item :label="$t('sys_mat017') + ':'" prop="checked_group">
          <el-radio-group v-model="moveForm.checked_group">
            <el-radio v-for="item in groupList" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="moveModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button :loading="isLoading" type="primary" @click="submiMovetBtn('moveForm')">{{ $t('sys_c024')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-image-viewer style="z-index:9999" v-if="imgModel" :on-close="closeViewer" @click.native="cloneImgpreview" :url-list="imgList" />
  </div>
</template>
<script>
import Clipboard from 'clipboard';
import { successTips } from '@/utils/index'
import { getmaterialgrouplist, domaterialgroup, getmateriallist, domaterial, materialFile, domovegroup, domoveoutgroup } from '@/api/article'
export default {
  components: { 'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
  props: {message: ""},
  data() {
    return {
      offest: 1,
      limit: 200,
      total: 0,
      msg_len: 0,
      msg_show:"",
      groupIdx: 0,
      check_nums:null,
      radio_text: "",
      check_text: [],
      materType: '',
      checkedNum: 0,
      fLoading: false,
      moveModel: false,
      isDelVisible: false,
      imgModel: false,
      isLoading: false,
      initloading: false,
      visible: false,
      groupLoading: false,
      loadingGroup: false,
      addVisible: false,
      allChecked: false,
      groupModel: false,
      materialName: '',
      cardAcyive: '1',
      type: '',
      group_id: '',
      group_name: '',
      textValue1: '',
      groupList: [],
      contentList: [],
      batchArry: [],
      groupForm: {
        id:'',
        group_id:'',
        title:'',
        content: '',
        link:'',
        imgLink:'',
        remark:'',
        is_adv:0,
      },
      moveForm: {
        checked_group: ""
      },
      viewImg: "",
      imgList: [],
      fileAccept: ["", "",".png,.jpg,.jpeg",".mp3",".mp4"],
      isPlay: false, //是否正在播放
      isauto: false, //是否自动播放
      audio: null,
      contorl: null
    }
  },
  computed: {
    cardOption() {
      return ['',this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),'','',this.$t('sys_mat113')]
    },
    tipsOption() {
      return ['','',this.$t('sys_g136'),this.$t('sys_g138'),this.$t('sys_g139')]
    },
    moveRules() {
      return {
        checked_group: [{ required: true, message: this.$t('sys_c051'), trigger: 'change' }],
      }
    },
    groupRules() {
      return {
        title: [{ required: true, message: this.$t('sys_mat018'), trigger: 'blur' }],
        content: [{ required: true, message: this.$t('sys_mat020'), trigger: 'blur' }],
        imgLink: [{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_mat009')}), trigger: 'change' }],
        link: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_l080')}), trigger: 'blur' }],
        remark: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_g003')}), trigger: 'blur' }],
        is_adv: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
      }
    }
  },
  created() {
    if (this.message) {
      this.msg_show = this.message.is_show;
      this.msg_len = this.message.check_len||0;
      this.msg_check = this.message.check||false;
      this.cardAcyive = this.message.type||"1";
    }
    this.materialGroup(1);
  },
  mounted() {
    // console.log(this.audio);
    // this.contorl = this.$refs.contorl
  },
  methods: {
    submitSource() {
      // console.log(this.msg_show);
      // console.log(this.check_text);
      // console.log(this.cardAcyive);
      let source_type = typeof this.cardAcyive==="string"?Number(this.cardAcyive):this.cardAcyive;
      if (this.msg_show==1&&!this.msg_check) {
        let item = this.contentList.filter(item=>{return item.id == this.radio_text})[0];
        item.type = source_type
        this.$emit("changeEle",JSON.stringify(item))
      }
      if (this.msg_show==1&&this.msg_check) {
        let checkList = this.contentList.filter(item=>{
          item.type = source_type
          if (this.check_text.includes(item.id)) {
            return true
          }
        })
        if (checkList.length > 5) {
          return successTips(this,"error",this.$t('sys_q008'))
        }
        this.$emit("changeEle",JSON.stringify(checkList))
      }
    },
    closeSource(){
      this.$emit("closeDialog",false)
    },
    closeViewer(e) {
      this.imgModel = false;
    },
    cloneImgpreview(e) {
      if (e.target.getAttribute('class') === 'el-image-viewer__mask') {
        this.imgModel = false;
      }
    },
    materialGroup(num) {
      this.groupList = [];
      this.loadingGroup = true;
      this.offest = num || this.offest;
      const params = {
        type: Number(this.cardAcyive),
        page: Number(this.offest),
        limit: this.limit
      }
      getmaterialgrouplist(params).then(res => {
        this.loadingGroup = false;
        this.groupList = res.data.list || [];
        for (let k = 0; k < this.groupList.length; k++) {
          this.groupList[k].is_del = false
        }
        if (this.groupList.length > 0 && !this.groupForm.group_id) {
          this.groupForm.group_id = this.groupList[0].id
          this.getGroupContent();
        }
      })
    },
    handleCard(tab) {
      this.groupIdx = "";
      this.check_text = [];
      this.contentList = [];
      this.allChecked = false;
      this.groupForm.group_id = "";
      this.materialGroup(1);
    },
    changeGroup(row, idx) {
      this.check_text = [];
      this.groupIdx = idx;
      this.allChecked = false;
      this.groupForm.group_id = row.id;
      this.getGroupContent();
    },
    getGroupContent() {
      let params = {
        page: 1,
        limit:10,
        name: this.materialName,
        type: Number(this.cardAcyive),
        group_id: this.groupForm.group_id,
      }
      this.check_text = [];
      this.initloading=true;
      getmateriallist(params).then(res => {
        this.initloading=false;
        this.contentList = res.data.list || [];
        for (let k = 0; k < this.contentList.length; k++) {
          let item = this.contentList[k];
          item.content=this.cardAcyive==7?JSON.parse(item.content):item.content;
          item.isPlay = false;
          item.check = false;
          this.$set(this.contentList,k,item)
        }
      })
    },
    editGroup(row, idx) {
      this.type = idx;
      this.group_name = '';
      if (idx == 1) return;
      this.groupForm.id = row.id;
      this.group_name = row.name;
    },
    addGroup() {
      let params = {
        ptype: this.type,
        id: this.groupForm.id,
        name: this.group_name,
        type: Number(this.cardAcyive),
      }
      this.groupLoading = true;
      this.type == 1 ? delete params.id : '';
      domaterialgroup(params).then(res => {
        this.materialGroup(1);
        this.groupLoading = false;
        this.addVisible = false
        successTips(this)
      })
    },
    delGroup(row) {
      for (let k = 0; k < this.groupList.length; k++) {
        this.groupList[k].is_del = false;
        if (this.groupList[k].id == row.id) {
          let item = this.groupList[k];
          item.is_del = true
          this.$set(this.groupList, k, item);
        }
      }
    },
    // closePopover(row) {
    //   for (let i = 0; i < this.groupList.length; i++) {
    //     const item = this.groupList[i];
    //     item.visible = false;
    //     this.$set(this.groupList,i,item);
    //   }
    // },
    checkHandle(row) {
      this.check_nums = 0;
      if (this.msg_show == 1 && !this.msg_check) {
        this.radio_text = row.id
        for (let k = 0; k < this.contentList.length; k++) {
          this.contentList[k].check = false;
          if (this.contentList[k].id == row.id) {
            this.contentList[k].check = true;
          }
        }
        return;
      }
      const index = this.check_text.indexOf(row.id);
      if (index == -1) {
        this.check_text.push(row.id);
      } else {
        this.check_text.splice(index, 1)
      }
      if (this.msg_show==1&&this.msg_check) {
        this.check_text = this.check_text.slice(0,(5-this.msg_len));
        this.check_nums = this.msg_len+this.check_text.length
        if (this.check_nums > 5) {
          return;
        }
      }
      for (let k = 0; k < this.contentList.length; k++) {
        this.contentList[k].check = false;
        if (this.check_text.includes(this.contentList[k].id)) {
          this.contentList[k].check = true;
        }
      }
      if (this.check_text.length == this.contentList.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    },
    editImgName(row) {
      this.groupForm.id = row.id;
      this.groupForm.title = row.name;
      this.groupForm.content = row.content;
    },
    submitImgName() {
      let params = {
        ptype: 2,
        id: this.groupForm.id,
        name: this.groupForm.title,
        content: this.groupForm.content,
      }
      domaterial(params).then(res => {
        if (res.code != 0) return;
        this.getGroupContent();
        successTips(this)
      })
    },
    batchHandle(idx) {
      let that = this;
      let tips = idx == 2 ? that.$t('sys_rai046',{value:that.$t('sys_c028')}):that.$t('sys_rai046',{value:that.$t('sys_rai052')});
      that.$confirm(tips,that.$t('sys_l013'), {
        // that.$confirm(that.$t('sys_c046',{value:that.$t('sys_c028')}),that.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function (action, instance, done) {
          if (action === 'confirm') {
            let reqApi = idx == 2 ? domaterial : domoveoutgroup;
            let params = {
              ptype: 3,
              type: Number(that.cardAcyive),
              del_id: that.check_text,
              material_id: that.batchArry
            }
            idx == 2 ? delete params.type : delete params.ptype;
            idx == 2 ? delete params.material_id : delete params.del_id;
            instance.confirmButtonLoading = true;
            reqApi(params).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code != 0) return;
              that.materialGroup();
              that.getGroupContent();
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
    },
    // closeImgName(row){
    //   for (let i = 0; i < this.contentList.length; i++) {
    //     const item = this.contentList[i];
    //     item.visible = false;
    //     this.$set(this.contentList,i,item);
    //   }
    // },
    addContent(row, idx) {
      this.materType = idx;
      this.groupForm.is_adv = 0;
      this.groupForm.link = "";
      this.groupForm.remark = "";
      this.groupForm.id = row.id;
      this.groupModel = true;
      this.$nextTick(() => {
        this.$refs.groupForm.resetFields();
        if (idx == 1) return;
        if(this.cardAcyive==7){
          this.groupForm.title = row.content.title;
          this.groupForm.imgLink = row.content.img;
          this.groupForm.link = row.content.url;
          this.groupForm.remark = row.content.remark;
          this.groupForm.isShow = row.content.isShow?1:2;
          this.groupForm.content = row.content.content;
          this.groupForm.is_adv = row.content.url_type;
        }else{
          this.groupForm.title = row.name;
          this.groupForm.content = row.content;
        }
      })
    },
    submitBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let content = JSON.stringify({
            title: this.groupForm.title,
            img:this.groupForm.imgLink,
            url:this.groupForm.link,
            remark:this.groupForm.remark,
            url_type:this.groupForm.is_adv,
            isShow:this.groupForm.is_adv==1?true:false,
            content: this.groupForm.content,
          })
          let params = {
            type: Number(this.cardAcyive),
            id: this.groupForm.id,
            ptype: this.materType,
            name: this.groupForm.title,
            url_type:this.groupForm.is_adv,
            content:this.cardAcyive==7?content:this.groupForm.content,
            group_id: this.groupForm.group_id
          }
          this.materType == 1 ? delete params.id : '';
          this.isLoading = true;
          domaterial(params).then(res => {
            this.isLoading = false;
            if (res.code != 0) return;
            this.groupModel = false;
            this.materType == 1 ? this.materialGroup(1) : "";
            this.getGroupContent();
            successTips(this)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    checkedAllBtn(val) {
      this.check_text = [];
      this.allChecked = val;
      for (let i = 0; i < this.contentList.length; i++) {
        let item = this.contentList[i];
        if (this.allChecked) {
          item.check = true;
          this.check_text.push(item.id);
          this.checkedNum = this.contentList.length;
        } else {
          this.check_text = [];
          item.check = false;
        }
        this.$set(this.contentList, i, item)
      }
    },
    async uploadBtn(e) {
      let imgSize = 1 * 1024 * 1024;
      let imgFormat = ["jpg", "jpeg", "png"];
      let files = this.$refs.uploadclear.files[0];
      let fileSize = files.size / 1024 / 1024;
      let fileType = files.name.split(".").pop();
      if (this.cardAcyive == 2) {
        if (fileSize > 1 || imgFormat.indexOf(fileType) == -1) {
          this.$refs.uploadclear.value = null;
          return successTips(this, "error", this.tipsOption[this.cardAcyive]);
        }
      } else if (this.cardAcyive == 3) {
        if (fileType != "mp3" || fileSize > 2.5) {
          this.$refs.uploadclear.value = null;
          return successTips(this, "error", this.tipsOption[this.cardAcyive]);
        }
      } else if (this.cardAcyive == 4) {
        if (fileType != "mp4" || fileSize > 10) {
          this.$refs.uploadclear.value = null;
          return successTips(this, "error", this.tipsOption[this.cardAcyive]);
        }
      }
      let formData = new FormData();
      formData.append('file', files);
      const imgPath = await materialFile(formData);
      if (imgPath.code != 0) return;
      let params = {
        type: Number(this.cardAcyive),
        ptype: 1,
        name: files.name,
        content: imgPath.data.url,
        group_id: this.groupForm.group_id
      }
      this.isLoading = true;
      domaterial(params).then(res => {
        this.$refs.uploadclear.value = null;
        if (res.code != 0) return;
        this.isLoading = false;
        this.materialGroup();
        this.getGroupContent();
        successTips(this)
      })
    },
    async uploadImg(e) {
      let imgFormat = ["jpg", "jpeg", "png"];
      let files = this.$refs.uploadclear.files[0];
      let fileSize = files.size / 1024 / 1024;
      let fileType = files.name.split(".").pop();
      if (fileSize > 1 || imgFormat.indexOf(fileType) == -1) {
        this.$refs.uploadclear.value = null;
        return successTips(this, "error", this.tipsOption[this.cardAcyive]);
      }
      let formData = new FormData();
      formData.append('file', files);
      this.fLoading = true;
      const {data:{url}} = await materialFile(formData);
      this.fLoading = false;
      this.$refs.groupForm.clearValidate('imgLink');
      this.groupForm.imgLink = url;
    },
    hideDelBtn() {
      for (let k = 0; k < this.groupList.length; k++) {
        let item = this.groupList[k];
        item.is_del = false
        this.$set(this.groupList, k, item);
      }
    },
    showImg(row) {
      let img = this.cardAcyive==7?row.img:row.content
      this.imgList = [];
      this.imgModel = true;
      this.$nextTick(() => {
        this.imgList.push(img)
      })
    },
    async copayUrl(row) {
      let copayUrl = this.cardAcyive==7?row.img:row.content
      let clipboard = navigator.clipboard || { writeText: (account) => {
          let copyInput = document.createElement('input');
          copyInput.value = copayUrl;
          document.body.appendChild(copyInput);
          copyInput.select();
          document.execCommand('copy');
          document.body.removeChild(copyInput);
        }
      }
      if (clipboard) {
        await clipboard.writeText(copayUrl);
        successTips(this, "",this.$t('sys_rai121'))
      }
      // const clipboard = new Clipboard('#imgUrl'); // .copy-btn为按钮元素的class名称或选择器
      // clipboard.on('success', (e) => {
      //   successTips(this, "",this.$t('sys_rai121'))
      //   e.clearSelection(); // 清除选中文本
      // });
    },
    confirmEvent(row, idx) {
      let params = {
        ptype: 3,
        del_id: [row.id],
      }
      domaterialgroup(params).then(res => {
        if (res.code != 0) return;
        if (this.groupIdx == idx) {
          this.groupIdx = 0;
          this.groupForm.group_id = ""
        }
        this.materialGroup();
        successTips(this)
      })
    },
    moveGroup() {
      this.moveModel = true;
      this.$nextTick(() => {
        this.$refs.moveForm.resetFields();
        // if (idx == 1) return;
      })
    },
    submiMovetBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true;
          domovegroup({ material_id:this.check_text, group_id: this.moveForm.checked_group }).then(res => {
            this.isLoading = false;
            if (res.code != 0) return;
            this.moveModel = false;
            this.materialGroup();
            this.getGroupContent();
            successTips(this)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    playAudio(row) {
      for (let k = 0; k < this.contentList.length; k++) {
        if (this.contentList[k].id === row.id && !this.contentList[k].isPlay) {
          let item = this.contentList[k];
          item.isPlay = true
          this.$refs.myAudio[k].play();
          this.$set(this.contentList, k, item)
        } else {
          let item = this.contentList[k];
          item.isPlay = false
          this.$refs.myAudio[k].pause();
          this.$set(this.contentList, k, item)
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">@import './material.scss';</style>
