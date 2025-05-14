<template>
  <div class="" @click="hideEmoji">
    <div style="display: flex;justify-content: space-between;align-items: center;font-size: 12px;">
      <el-button size="small" @click="$router.go(-1)" v-show="userInfo.account_type != 3">
        <i class="el-icon-back"></i>
        <span>{{$t('sys_q006')}}</span>
      </el-button>
      <div style="width: 100%; display:flex;justify-content: flex-end;">
        <el-dropdown :hide-on-click="false" trigger="click">
          <el-button type="text" size="small"
            style="background:#67c23a;border-radius: 50%;padding: 3px;margin-right: 5px;">
            <i class="el-icon-connection" style="color: #fff;"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <div class="dropdown_tips">
              <div class="link_status">{{$t('sys_q019')}}</div>
              <div>{{$t('sys_q020')}}</div>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{ staffNick }}</span>
      </div>
    </div>
    <div :class="['staff_warp', userInfo.account_type == 3 ? 'staff_full_warp' : '']">
      <div class="staff_main" v-if="userInfo.account_type != 3">
        <el-button v-if="staffLoading" class="loading_icon" type="primary" :loading="true" />
        <template v-else>
          <template v-if="seatsDataList.length > 0">
            <div v-for="(item, idx) in seatsDataList" :key="idx">
              <el-popover placement="right" trigger="hover">
                <div style="font-size: 14px;line-height: 1.6;">
                  <div>{{ item.account }} ({{ accountStatus[item.online] }})</div>
                  <div>{{ item.name }}</div>
                </div>
                <span slot="reference"
                  :class="['staff_item', item.online == 2 ? 'staff_online' : '', customer_id == item.customer_id ? 'staff_active' : '']"
                  @click="changeStaff(item, idx)">
                  <img class="ws_img" src="../../assets/ws.png" alt="" srcset="">{{ item.account ? item.account.split("")[0] : "" }}
                </span>
              </el-popover>
            </div>
          </template>
          <div v-else>
            <el-empty></el-empty>
          </div>
        </template>
      </div>
      <div class="extend_main">
        <el-popover v-model="is_visible" placement="right" width="280">
          <div class="custom_popover">
            <el-input v-model="account_name" clearable size="small" :placeholder="$t('sys_l006')" />
            <el-button type="primary" size="mini" style="margin: 0 8px;" @click="getCustomAccountList()">{{$t('sys_q021')}}</el-button>
            <i class="el-icon-close" @click="is_visible = false"></i>
          </div>
          <el-button type="primary" slot="reference" size="mini" @click="account_name = ''"
            style="padding-left: 8px; padding-right: 8px;">{{$t('sys_q021')}}</el-button>
        </el-popover>
        <el-button v-if="customLoading" class="loading_icon" type="primary" :loading="true" />
        <template v-else>
          <template v-if="staffAccountList.length > 0">
            <div style="width: 100%;" v-for="(item, idx) in staffAccountList" :key="idx">
              <div v-if="idx == 0" :class="['extend_list', serviceIdx == '0' ? 'extend_active' : '']" @click="changeServe(item, idx)">
                <div class="item_child item_no_line">{{$t('sys_q022')}}</div>
                <!-- <div class="news_num" v-if="unReadTotal>0">{{ unReadTotal }}</div> -->
                <div class="news_num" v-if="un_read_num > 0">
                  <el-badge :value="un_read_num" />
                </div>
              </div>
              <el-popover placement="right" trigger="hover" width="200">
                <div class="serveic_info">
                  <div class="serveic_status">
                    <span>{{ $t('sys_c005') }}：</span>
                    <el-button type="text" :style="item.status != 2 ? 'color:#f56c6c;' : ''">{{ accountStatus[item.status] }}</el-button>
                    <i :class="['el-icon-refresh', refreshStstus ? 'animat_rotate' : '']"
                      @click="updateAccount(item)"></i>
                  </div>
                  <div class="coapy_account" ref="copyTarget" :id="'copyTarget' + idx"
                    :data-clipboard-text="item.nick_name" data-clipboard-action="copy"
                    @click="coapyAccount(item.account)">
                    {{ $t('sys_g027') }}：{{ item.account }}
                    <img src="../../assets/copay_icon.png" alt="" srcset="">
                  </div>
                  <div class="nick_name"> {{ $t('sys_g022') }}：
                    <span>{{ item.nick_name || "~" }}</span>
                    <!-- <i class="el-icon-refresh"></i> -->
                  </div>
                  <div class="user_remark">{{ $t('sys_l062') }}：
                    <span>{{ item.remark || "-" }}</span>
                  </div>
                  <div class="user_remark" v-if="item.status != 2">{{ $t('sys_c071') }}：
                    <span style="color:#f56c6c;">{{ item.reason || "-" }}</span>
                  </div>
                  <div>{{ $t('sys_q023') }}：
                    <el-popover placement="right" trigger="hover">
                      <div style="font-size: 14px;line-height: 2.3;" v-if="item.status != 2">
                        <div>{{ $t('sys_c066') }}：-{{ $t('sys_q026') }}</div>
                        <div>{{ $t('sys_c065') }}：{{ $t('sys_q027') }}</div>
                        <div>{{ $t('sys_q024') }}：-</div>
                        <div>{{ $t('sys_q025') }}：{{ $t('sys_q028') }}</div>
                      </div>
                      <div style="font-size: 14px;line-height: 2.3;" v-else>
                        <div>{{ $t('sys_c066') }}：{{ ipClassOptions[item.ip_category] }}</div>
                        <div>{{ $t('sys_c065') }}：{{ ipTypeOptions[item.ip_type] }}</div>
                        <div>{{ $t('sys_q024') }}：{{ item.ip_country }}</div>
                        <!-- <div>真实ip：暂无真实ip</div> -->
                      </div>
                      <span class="is_cursor" slot="reference">{{ $t('sys_q029') }}</span>
                    </el-popover>
                  </div>
                  <div class="button_item">
                    <el-button size="small" type="primary" plain @click="staffCustomTop(item, 1)">
                      {{ topOption[item.is_top] }}
                    </el-button>
                    <el-button size="small" type="primary" plain v-for="(label, idx) in labelOption" :key="idx" @click="accountHandle(item.account, idx)">{{ label }}</el-button>
                  </div>
                </div>
                <div slot="reference" v-if="idx != 0"
                  :class="['extend_list', item.account == staffAccount ? 'extend_active' : '', item.status == 2 ? 'item_no_line' : '', item.account == friendInfo.account ? 'extend1_active' : '']"
                  @click.stop="changeServe(item, idx)">
                  <div class="new_tips" v-if="item.is_read == 2">
                    <el-badge is-dot />
                  </div>
                  <div :class="['item_child', item.status == 2 ? 'item_no_line' : '']">
                    <el-avatar v-if="item.head" shape="square" :class="{ 'grey_avatar': item.status != 2 }" :size="40" :src="item.head" />
                    <span v-else> {{ idx }}</span>
                  </div>
                  <!-- <div class="news_circle" ></div> -->
                  <i :class="['el-icon-download is_disabled', staffAccount == item.account ? 'is_no_fff' : '']"
                    v-if="item.is_top == 2"></i>
                </div>
              </el-popover>
            </div>
          </template>
          <div v-else class="text_empty">
            {{ $t('sys_mat013') }}
          </div>
        </template>
      </div>
      <div class="group_main" v-if="serviceIdx != '0'">
        <div class="search_icon">
          <el-input v-model="group_name" size="small" @input="filterGroupHandle($event)" clearable :placeholder="$t('sys_q030')"
            prefix-icon="el-icon-search" />
        </div>
        <div class="group_warp">
          <el-button v-if="groupLoading" class="loading_icon" type="primary" :loading="true" />
          <template v-else>
            <template v-if="staffGrouptList.length > 0">
              <div :class="['group_list', changeGroupId == item.id ? 'activ_group' : '']"
                v-for="(item, idx) in staffGrouptList" :key="idx" @click="chnageGroup(item, idx)">
                <div class="group_info">
                  <span class="group_name"> {{ item.name }} </span>
                  <span>({{ item.friend_num }})</span>
                </div>
                <div class="group_btn" v-if="isShowEdit">
                  <el-popover v-model="item.is_edit" placement="top" width="230">
                    <p>
                      <el-input v-model="new_group_name" size="small" maxlength="10" show-word-limit
                        :placeholder="$t('sys_c112')" />
                    </p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="item.is_edit = false">{{ $t('sys_c023') }}</el-button>
                      <el-button type="primary" size="mini" :loading="addLoading" :disabled="!new_group_name.trim()"
                        @click="addStaffGroup(item, 2)">{{ $t('sys_c024') }}</el-button>
                    </div>
                    <i slot="reference" class="el-icon-edit" v-if="item.is_default != 1"
                      @click.stop="handleGroup(item, idx)"></i>
                  </el-popover>
                  <el-popover v-model="item.is_del" placement="top">
                    <div style="margin-bottom: 5px;">
                      <i class="el-icon-info" style="color: #e6a23c;" />{{ $t('sys_c128') }}
                    </div>
                    <div style="text-align: right; margin: 0;">
                      <el-button size="mini" type="text" @click="item.is_del = false">{{ $t('sys_c023') }}</el-button>
                      <el-button type="primary" size="mini" :loading="addLoading"
                        @click="addStaffGroup(item, 3)">{{ $t('sys_c024') }}</el-button>
                    </div>
                    <i slot="reference" class="el-icon-delete" v-if="item.is_default != 1"
                      @click.stop="handleGroup(item, idx)"></i>
                  </el-popover>
                </div>
              </div>
            </template>
            <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
            <div class="group_footer">
              <el-popover v-model="isAddGroup" placement="top-start" width="240">
                <p>
                  <el-input v-model="new_group_name" clearable size="small" maxlength="10" :placeholder="$t('sys_c112')" />
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="isAddGroup = false">{{ $t('sys_c023') }}</el-button>
                  <el-button size="mini" type="primary" :loading="addLoading" :disabled="!new_group_name.trim()"
                    @click="addStaffGroup(1, 1)">{{ $t('sys_c024') }}</el-button>
                </div>
                <el-button slot="reference" type="text" icon="el-icon-plus" style="color: #606266;margin-right: 5px;"
                  @click="new_group_name = ''">{{ $t('sys_q031') }}</el-button>
              </el-popover>
              <el-button type="text" icon="el-icon-setting" style="color: #606266;" @click="isShowEdit = !isShowEdit">{{ isShowEdit ?$t('sys_q032'):$t('sys_q033') }}</el-button>
            </div>
          </template>
        </div>
      </div>
      <div class="main_continer">
        <div class="main_head">
          <div></div>
          <div style="display: flex;align-items: center;">
            <el-tooltip class="item" effect="dark" :content="$t('sys_c092')" placement="top-start">
              <span class="quick_line_img" @click="onLineBtn">
                <img src="../../assets/quick_icon.png" alt="" srcset="">
              </span>
            </el-tooltip>
            <div style="display: flex;margin-top: -3px;">
              <el-dropdown :hide-on-click="isHideMenu" trigger="click">
                <span class="el-dropdown-link">
                  {{ $t('sys_q034') }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" ref="dropdown">
                  <el-dropdown-item>
                    <span class="is_cursor" @click="changeReceiveBtn">{{ $t('sys_q035') }}</span>
                    <span class="lang_text" style="margin:0 10px;">{{ $t('sys_q036') }}</span>
                    <el-switch v-model="global_config" @change="setAtuoTrans" />
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="staffAccountList.length == 0" command="1"
                    @click.native="correntRedBtn">{{ $t('sys_q037') }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div style="height: 100%;display: flex;justify-content: space-between;">
          <div class="friend_main">
            <div class="fr_t1">
              <span :class="['t1_it', cardIdx == idx ? 'label_active' : '']" v-for="(item, idx) in [friendOption[1]]" :key="idx" v-if="item != ''" @click="changeCard(idx)">
                {{ item }}
                <div class="no_read_num" v-if="friend_news > 0">
                  <el-badge :value="friend_news" />
                </div>
              </span>
              <!-- <span :class="['t1_it',cardIdx==1?'label_active':'']" @click="changeCard(1)">好友列表</span>
              <span :class="['t1_it',cardIdx==2?'label_active':'']" v-if="groupIdx != 0" @click="changeCard(2)">群聊列表</span> -->
            </div>
            <div class="search_nick">
              <!-- @input="filterNickHandle($event)" -->
              <el-input size="small" v-model="query_text" clearable :placeholder="$t('sys_q038')" prefix-icon="el-icon-search">
                <el-button size="small" slot="append" @click="initFriendList()">{{ $t('sys_c002') }}</el-button>
              </el-input>
              <el-button class="update_css" size="small" type="primary" plain icon="el-icon-notebook-1" @click="uploadFileBtn">{{ $t('sys_q039') }}</el-button>
            </div>
            <div class="checkbox_box" v-if="isShowBetch">
              <div class="checkbox_left">
                <el-checkbox v-model="check_friend_all" @change="checkFriend(check_friend_all, 0)">{{ $t('sys_g135') }}</el-checkbox>
                <div>{{ $t('sys_g066') }}: {{ checkFriends.length }}/{{ friendList.length }}</div>
              </div>
              <el-dropdown size="small" trigger="click" @command="(command) => { handleCommand(command) }">
                <span class="el-dropdown-link">
                  {{ $t('sys_g018') }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="checkFriends.length == 0" v-for="(item, idx) in batchOption"
                    :command="idx" :key="idx" v-if="item != ''">{{ item }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-button v-if="friendLoading" class="loading_icon" type="primary" :loading="true" />
            <template v-else>
              <template v-if="friendList.length > 0">
                <div :class="['friend_list infinite-list', isShowBetch ? 's_friend_list' : '']">
                  <!-- <div :class="['friend_list infinite-list',isShowBetch?'s_friend_list':'']" v-infinite-scroll="friendLoad" infinite-scroll-disabled="moreHandle"> -->
                  <div class="friend_item infinite-list-item" v-for="(item, idx) in friendList" :key="idx">
                    <div class="no_read_num" v-if="item.un_read_num > 0">
                      <el-badge :value="item.un_read_num" />
                    </div>
                    <el-checkbox v-model="item.check" v-if="isShowBetch" @change="checkFriend(item, 1)"></el-checkbox>
                    <div :class="['friend_info_item', friendAccount == item.friend_account && frienxIdx == idx ? 'friend_active' : '']"
                      @click.stop="changeFriend(item, idx)">
                      <el-avatar shape="square" :size="40" :src="item.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                      <el-tooltip class="item" effect="dark" :content="$t('sys_q123')" placement="top-end">
                        <el-badge v-if="item.is_repeat!=0" class="repeat_text" value="重" type="warning" />
                      </el-tooltip>
                      <div class="friend_top">
                        <div class="friend_info">
                          <span class="friend_nums" v-text="item.friend_name ? item.friend_name + ' (' + handleFilterHide(item.friend_account) + ')' : handleFilterHide(item.friend_account)"></span>
                          <span class="news_time">{{ item.send_time > 0 ? $baseFun.newsTime(item.send_time * 1000) : "" }}</span>
                        </div>
                        <div class="friend_news">
                          <span class="new_f_content">{{ item.msg_content }}</span>
                          <i :class="['el-icon-download', item.is_top == 2 ? 'top_active' : '']"
                            @click.stop="staffCustomTop(item, 2)"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="loading_tips" v-if="isLoading">
                    {{ $t('sys_q040') }} <i class="el-icon-loading" />
                  </div>
                  <div class="more_tips" v-if="noMore">{{ $t('sys_mat014') }}</div>
                </div>
              </template>
              <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
            </template>
            <div class="footer_page">
              <span>{{ $t('sys_q041') }}：{{ friendList.length }}/{{ friendList.length }}</span>
              <i class="el-icon-refresh" @click="initFriendList()"></i>
              <i v-if="friendList.length > 0"
                :class="['is_disabled', isShowBetch ? 'el-icon-close' : 'el-icon-edit-outline']"
                @click="isShowBetch = !isShowBetch"></i>
            </div>
          </div>
          <div class="mess_main">
            <el-tooltip class="item" effect="dark" :content="isQuickMenu?$t('sys_q042'):$t('sys_q043')" placement="top-end">
              <div class="quick_icon" @click="isQuickMenu=!isQuickMenu">
                <i :class="[isQuickMenu?'el-icon-s-unfold':'el-icon-s-fold']"></i>
              </div>
            </el-tooltip>
            <div class="new_head">{{ handleFilterHide(friendAccount) }}</div>
            <div class="news_main" ref="newsScroll" @scroll="handleScrolStop">
              <el-button v-if="initloading" class="loading_icon" style="margin: auto auto;" type="primary" :loading="true" />
              <template v-else>
                <div class="loading_tips" v-if="newsLoading">
                  {{ $t('sys_q040') }} <i class="el-icon-loading" />
                </div>
                <div class="more_tips" v-if="newsNoMore">{{ $t('sys_mat014') }}</div>
                <template v-if="isHideNew&&newsDataList.length > 0">
                  <div class="new_window" v-for="(item, idx) in newsDataList" :key="idx" @contextmenu.prevent="openRightMenu($event, item)">
                    <div class="user_area" v-if="item.send_category == 2">
                      <div class="self_info">
                        <div class="user_new">
                          <div class="user_img">
                            <el-avatar shape="square" :size="40" :src="item.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                          </div>
                          <div style="display: flex;flex-direction: column;align-items: start;">
                            <div class="new_time"> {{ handleFilterHide(item.send_account) }} {{ $baseFun.resetTime(item.send_time, 4) || 0 }}</div>
                            <el-tooltip v-model="item.is_fanyi" class="item" effect="light" manual placement="bottom">
                              <div class="select_menu" slot="content">
                                <div class="select_item" v-for="(menu, idx) in menuOption" :key="idx" @click="changeItem(item, idx, 1)">
                                  <img :src="require(`../../assets/${menu.icon}.png`)" alt="">
                                  <span>{{ menu.name }}</span>
                                </div>
                              </div>
                              <template>
                                <div class="news_cont" v-if="item.msg_type == 1 || item.msg_type == 7">
                                  <span v-if="chackLink(item.msg_content)" v-text="item.msg_content" />
                                  <a v-else :href="item.msg_content">{{ item.msg_content }}</a>
                                </div>
                                <div class="text_img" v-if="item.msg_type == 2" @click.stop="viewImgHandle(item.msg_content)">
                                  <img :src="item.msg_content" alt="" srcset="">
                                  <span class="rest_load" v-if="!item.msg_content" @click.stop="handleRestLoad(item)">
                                    <i v-if="handleIsLoad(item)" class="el-icon-loading"></i>
                                    <i v-else class="el-icon-download"></i>
                                  </span>
                                </div>
                                <div class="news_cont text_audio" v-if="item.msg_type == 3">
                                  <audio ref="myAudio" controls class="audio_src">
                                    <source :src="item.msg_content" type="audio/mpeg">
                                  </audio>
                                  <span class="rest_load" v-if="!item.msg_content" @click.stop="handleRestLoad(item)">
                                    <i v-if="handleIsLoad(item)" class="el-icon-loading"></i>
                                    <i v-else class="el-icon-download"></i>
                                  </span>
                                </div>
                                <div class="news_cont text_voice" v-if="item.msg_type == 4">
                                  <video ref="myAudio" width="210" height="100" controls>
                                    <source :src="item.msg_content" type="video/mp4">
                                  </video>
                                  <span class="rest_load" v-if="!item.msg_content" @click.stop="handleRestLoad(item)">
                                    <i v-if="handleIsLoad(item)" class="el-icon-loading"></i>
                                    <i v-else class="el-icon-download"></i>
                                  </span>
                                </div>
                                <div class="news_cont text_voice" v-if="item.msg_type == 5">
                                  {{ $t('sys_q044') }}
                                  <img src="../../assets/phone.png" alt="" srcset="">
                                </div>
                              </template>
                            </el-tooltip>
                          </div>
                        </div>
                      </div>
                      <div class="fanyi_zh" v-if="item.translate_text">
                        <div>{{ item.translate_text }}</div>
                      </div>
                    </div>
                    <div class="self_area" v-if="item.send_category == 1">
                      <div class="self_new">
                        <div class="self_info">
                          <div style="display: flex;flex-direction: column;align-items: end;">
                            <div class="new_time">
                              <el-tag size="mini" type="success">{{ newsOption[item.sender] }}</el-tag>
                              {{ $baseFun.resetTime(item.send_time, 4) || 0 }} {{ item.send_account }}
                            </div>
                            <el-tooltip v-model="item.is_fanyi" class="item" effect="light" manual placement="bottom">
                              <div class="select_menu" slot="content">
                                <div class="select_item" v-for="(menu, idx) in menuOption" :key="idx"
                                  @click="changeItem(item, idx, 2)">
                                  <img :src="require(`../../assets/${menu.icon}.png`)" alt="">
                                  <span>{{ menu.name }}</span>
                                </div>
                              </div>
                              <div class="news_cont" v-if="item.msg_type == 1 || item.msg_type == 7">
                                <span v-if="chackLink(item.msg_content)" v-text="item.msg_content" />
                                <span v-else v-text="item.msg_content" />
                                <div class="loading_animat" v-show="item.loading || item.msg_status == 1">
                                  <img class="loading_img" src="../../assets/loading.png" alt="" srcset="">
                                </div>
                                <div class="err_tips" v-if="item.msg_status == 3" @click.stop="repeatSend(item)"></div>
                              </div>
                              <div class="text_img send_img" v-if="item.msg_type == 2"
                                @click.stop="viewImgHandle(item.msg_content)">
                                <div class="img_radius">
                                  <img :src="item.msg_content" alt="" srcset="">
                                  <div class="cover_pop" v-if="item.loading">
                                    <el-progress :width=60 :stroke-width=3 text-color="#f56c6c" type="circle"
                                      :percentage="percentage" />
                                  </div>
                                </div>
                                <div class="err_tips" v-if="item.msg_status == 3" @click.stop="repeatSend(item)"></div>
                              </div>
                              <div class="news_cont text_card" v-if="item.msg_type == 6">
                                <div class="card_item">
                                  <el-avatar shape="square" :size="55" :src="require('../../assets/def_head.png')" />
                                  <div class="card_mess">
                                    <div class="nick_content">{{ item.msg_content.split("-")[1] }}</div>
                                    <div class="account_content">+{{ item.msg_content.split("-")[0] }}</div>
                                  </div>
                                </div>
                                <div class="add_text is_cursor" @click="jumpWsBtn">{{ $t('sys_q045') }}</div>
                                <div class="err_tips" v-if="item.msg_status == 3" @click.stop="repeatSend(item)"></div>
                              </div>
                              <div class="news_cont text_audio" v-if="item.msg_type == 3">
                                <audio ref="myAudio" controls class="audio_src">
                                  <source :src="item.msg_content" type="audio/mpeg">
                                </audio>
                                <div class="err_tips" v-if="item.msg_status == 3" @click.stop="repeatSend(item)"></div>
                              </div>
                              <div class="news_cont text_voice" v-if="item.msg_type == 4">
                                <video ref="myAudio" width="210" height="100" controls>
                                  <source :src="item.msg_content" type="video/mp4">
                                </video>
                                <div class="err_tips" v-if="item.msg_status == 3" @click.stop="repeatSend(item)"></div>
                              </div>
                              <div class="news_cont call_voice" v-if="item.msg_type == 5">
                                {{ $t('sys_q044') }}
                                <img src="../../assets/phone.png" alt="" srcset="">
                                <div class="err_tips" v-if="item.msg_status == 3" @click.stop="repeatSend(item)"></div>
                              </div>
                            </el-tooltip>
                          </div>
                          <div class="user_img">
                            <el-avatar shape="square" :size="40"
                              :src="item.head ? item.head : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                            <template v-if="item.msg_status == 2">
                              <span class="double_check no_read_tips" v-if="item.is_read == 1">&#x2714;</span>
                              <span class="double_check yes_read_tips" v-if="item.is_read == 2">&#x2714;&#x2714;</span>
                            </template>
                          </div>
                        </div>
                        <div class="fanyi_zh" v-if="item.translate_text">
                          <div>{{ item.translate_text }}</div>
                        </div>
                        <div class="system_msg" v-if="item.errmsg && item.msg_status == 3">
                          <div>{{ $t('sys_q046') }}：{{ item.errmsg }}</div>
                        </div>
                      </div>
                    </div>
                    <!-- :class="['no_read_icon',newsContentList.length>0&&!stopScroll?'show_read_icon':'']" -->
                  </div>
                  <div class="back_tips" v-if="groupIdx==2&&friendAccount">{{ $t('sys_g116') }}</div>
                </template>
                <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
              </template>
            </div>
            <div class="send_view" v-if="friendAccount">
              <div class="emote_warp" v-if="isHideEmoji">
                <div class="emote_head">
                  <div class="out_box">{{ $t('sys_q047') }}</div>
                  <i class="el-icon-close"></i>
                </div>
                <div class="emote_list">
                  <a type="emoji" v-for="(item, idx) in $baseFun.emoji_icon()" :key="idx" @click.stop="changeEmoji(item)">{{ item }}</a>
                </div>
              </div>
              <div class="window_coapy" v-if="isHideImg">
                <i class="el-icon-close" @click="closeCoapyImg"></i>
                <div class="coapy_img">
                  <img :src="copayImgUrl" alt="" srcset="">
                </div>
                <div class="capay_btn">
                  <el-button size="mini" :loading="copayLoading" type="primary" @click="sendCopayImg">{{ $t('sys_q048') }}</el-button>
                </div>
              </div>
              <div class="send_top">
                <div class="ws_fun">
                  <div class="ws_fun_l">
                    <el-tooltip class="item" effect="dark" :content="$t('sys_q049')" placement="top">
                      <span class="fun_item" @click.stop="isHideEmoji = !isHideEmoji">
                        <img src="../../assets/emote.png" alt="" srcset="">
                      </span>
                    </el-tooltip>
                    <!-- <el-tooltip class="item" effect="dark" content="发送文件" placement="top">
                    <el-button type="text" class="fun_item" @click="$refs.fileInput.click()">
                      <input type="file" ref="fileInput">
                      <img src="../../assets/file.png" alt="" srcset="">
                    </el-button>
                  </el-tooltip> -->
                    <el-tooltip class="item" effect="dark" :content="$t('sys_q050')" placement="top">
                      <el-button type="text" class="fun_item img_item" @click="$refs.imgInput.click()">
                        <input type="file" ref="imgInput" @change="changeImg">
                        <img src="../../assets/tupian.png" alt="" srcset="">
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('sys_q051')" placement="top">
                      <span class="fun_item" @click="sendCard">
                        <img src="../../assets/card.png" alt="" srcset="">
                      </span>
                    </el-tooltip>
                    <!-- <el-tooltip class="item" effect="dark" :content="$t('sys_mat091')" placement="top">
                      <span class="fun_item" @click="sendVoice">
                        <img src="../../assets/phone.png" alt="" srcset="" style="opacity: 0.7;">
                      </span>
                    </el-tooltip> -->
                  </div>
                  <div class="ws_fun_r">
                    <span>{{$t('sys_q052')}}：</span>
                    <span>
                      <el-select size="small" v-model="render_line" :placeholder="$t('sys_c052')">
                        <el-option v-for="(item, idx) in renderOptions" :key="idx" :label="item" :value="idx">
                        </el-option>
                      </el-select>
                    </span>
                    <span>
                      <el-select size="small" v-model="render_lang" :placeholder="$t('sys_c052')" @change="countryHandle">
                        <el-option-group v-for="group in langOptions" :key="group.label" :label="group.label">
                          <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-option-group>
                      </el-select>
                    </span>
                    <span>
                      <el-select size="small" v-model="trans_type" :placeholder="$t('sys_c052')" @change="transHandle">
                        <el-option v-for="(item, idx) in transOptions" :key="idx" :label="item" :value="idx"
                          v-if="item != ''">
                        </el-option>
                      </el-select>
                    </span>
                  </div>
                </div>
                <div class="send_text_01">
                  <el-input v-if="trans_type == 1" v-model="send_text" type="textarea" ref="textInput"
                    @keyup.shift.enter.native @keyup.alt.t.native="translateHandle"
                    @keydown.enter.exact.native="sendBtn" :rows="4" :placeholder="$t('sys_mat020')" />
                  <el-input v-else v-model="send_text" type="textarea" ref="textInput" @keyup.shift.enter.native
                    @keydown.enter.exact.native="sendBtn" :rows="4" :placeholder="$t('sys_mat020')" />
                </div>
                <div class="send_btn">
                  <span v-if="trans_type == 1">{{ $t('sys_q053') }}</span>
                  <span>{{ $t('sys_q054') }}</span>
                  <el-button size="small" @click="sendBtn">{{ $t('sys_q048') }}</el-button>
                </div>
              </div>
            </div>
          </div>
          <transition name="el-zoom-in-center">
            <div class="fans_main" v-if="isQuickMenu">
              <div class="new_head">
                <div class="fr_t1">
                  <span :class="['t1_it', tableIdx == idx ? 'label_active' : '']" v-for="(item, idx) in fansOption" :key="idx" @click="tableCard(idx)" v-if="idx!=0">
                    {{ item }}
                  </span>
                </div>
              </div>
              <div class="fans_content" ref="quick_ele">
                <div class="fans_form">
                    <template v-if="tableIdx==1">
                      <div>
                        <div class="tabs_warp">
                          <span :class="['tabs_item', quickIdx === idx ? 'label_active' : '']" v-for="(item, idx) in quickOption" :key="idx" @click="quickCard(idx)" v-if="idx!=0">
                            {{ item }}
                          </span>
                        </div>
                        <div class="head_top">
                          <div class="select_body">
                            <template v-if="quickIdx==3">
                              <el-select size="mini" class="select_ele" v-model="quick.seat_id" :placeholder="$t('sys_c052')">
                                  <el-option v-for="(item, idx) in seatOption" :key="idx" :label="item" :value="idx" v-show="item!=''" />
                              </el-select>
                              <el-input size="mini" clearable class="input_ele" :placeholder="$t('sys_mat021')" v-model="quick.name">
                                <el-button slot="append" icon="el-icon-search" @click="quickSourceQuery"></el-button>
                              </el-input>
                            </template>
                            <template v-else>
                              <el-input size="mini" clearable :placeholder="$t('sys_mat021')" v-model="quick.name" style="width:100%;">
                                <el-button slot="append" icon="el-icon-search" @click="quickGroupQuery(quickIdx)"></el-button>
                              </el-input>
                            </template>
                          </div>
                          <div class="custom_group">
                            <template v-if="quickIdx==1">
                              <el-button slot="reference" size="mini" type="text" disabled icon="el-icon-warning-outline">{{ $t('sys_q010') }}</el-button>
                            </template>
                            <el-popover v-if="quickIdx==2" v-model="quick.isPopover" placement="top" width="230">
                                <p>
                                  <el-input v-model="quick.g_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                                </p>
                                <div style="text-align: right; margin: 0">
                                  <el-button size="mini" type="text" @click="quick.isPopover=false">{{ $t('sys_c023') }}</el-button>
                                  <el-button type="primary" size="mini" :loading="quick.c_g_loading" :disabled="!quick.g_name.trim()" @click="addGroup(0,1)">{{ $t('sys_c024') }}</el-button>
                                </div>
                                <el-button slot="reference" size="mini" type="text" icon="el-icon-plus">{{ $t('sys_mat015',{value:$t('sys_mat012')}) }}</el-button>
                            </el-popover>
                          </div>
                        </div>
                        <div>
                          <template v-if="quickIdx==3">
                            <div class="material_send_warp" :style="{'height':quickHeight+'px'}">
                              <el-collapse v-model="quick.quick_idx" accordion @change="selectContent">
                                <el-collapse-item :title="item" :name="qIdx" v-for="(item,qIdx) in seatOption" :key="qIdx" v-if="qIdx!=0">
                                  <el-button v-if="quickLoading" class="loading_icon custom_loading" type="primary" :loading="true" />
                                  <div v-else>
                                    <el-collapse v-model="quick.group_id" accordion @change="selectMaterGroup" style="padding:0 10px;  box-sizing: border-box;">
                                      <el-collapse-item :title="item.name" :name="item.id" v-for="item in quickMaterialGroup" :key="item.id">
                                        <el-button v-if="isMaterLoading" class="loading_icon custom_loading" type="primary" :loading="true" />
                                        <template v-else>
                                          <div :class="quick.quick_idx==1?'material_comtent':quick.quick_idx==2?'material_image':quick.quick_idx==3?'material_vidwo':'material_video'" v-if="quickMaterialList.length>0">
                                            <div class="quick_material_item" v-for="materItem in quickMaterialList" :key="materItem.id" @dblclick="changeQuickBtn(materItem,1)">
                                              <template v-if="quick.quick_idx==1">
                                                <div class="content_item">
                                                  <div class="text_title">
                                                    <el-tag size="mini" type="info">{{ $t('sys_mat017') }}</el-tag>
                                                    <span class="reply_content text_space"> {{ materItem.name }}</span>
                                                  </div>
                                                  <div class="text_content">
                                                    <el-tag size="mini">{{ $t('sys_mat019') }}</el-tag>
                                                    {{ materItem.content }}
                                                  </div>
                                                </div>
                                              </template>
                                              <template v-if="quick.quick_idx==2">
                                                <img class="source_image" :src="materItem.content" alt="" srcset="">
                                                <span class="text_space">{{ materItem.name }}</span>
                                              </template>
                                              <template v-if="quick.quick_idx==3">
                                                <audio ref="myAudio" controls class="audio_src">
                                                  <source :src="materItem.content" type="audio/mpeg">
                                                </audio>
                                                <span class="text_space text_space">{{ materItem.name }}</span>
                                              </template>
                                              <template v-if="quick.quick_idx==4">
                                                <video ref="myAudio" controls>
                                                  <source :src="materItem.content" type="video/mp4">
                                                </video>
                                                <span class="text_space">{{ materItem.name }}</span>
                                              </template>
                                            </div>
                                          </div>
                                          <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
                                        </template>
                                      </el-collapse-item>
                                    </el-collapse>
                                  </div>
                                </el-collapse-item>
                              </el-collapse>
                            </div>
                          </template>
                          <template v-else>
                            <el-button v-if="loadingGroup" class="loading_icon custom_loading" type="primary" :loading="true" />
                            <div class="quick_group" :style="{'height':quickHeight+'px'}" v-else>
                              <el-collapse v-model="scriptModel.group_id" accordion @change="selectQuickGroup">
                                <el-collapse-item class="custom_collapse_item" :title="item.name" :name="item.id" v-for="item in quickGroupList" :key="item.id">
                                  <template slot="title">
                                    {{item.name}}
                                    <div class="header-icon" @click.stop v-if="quickIdx==2">
                                      <el-button size="small" type="text" icon="el-icon-plus" @click.stop="adddContent(item,1)" />
                                      <el-popover v-model="item.popover" placement="top" width="198">
                                        <p style="display: flex;justify-content: space-between">
                                          <el-popover v-model="item.is_edit" placement="top" width="200">
                                            <p>
                                              <el-input v-model="quick.g_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                                            </p>
                                            <div style="text-align: right; margin: 0">
                                              <el-button size="mini" type="text" @click="item.is_edit=false">{{ $t('sys_c023') }}</el-button>
                                              <el-button type="primary" size="mini" :loading="quick.c_g_loading" :disabled="!quick.g_name.trim()" @click.stop="addGroup(item,2)">{{ $t('sys_c024') }}</el-button>
                                            </div>
                                            <el-button slot="reference" size="small" type="primary" @click="quick.g_name=item.name">{{ $t('sys_q033') }}</el-button>
                                          </el-popover>
                                          <el-button size="small" type="danger" @click="delCustonGroup(item,1)">{{ $t('sys_q055') }}</el-button>
                                        </p>
                                        <el-button slot="reference" size="small" type="text" icon="el-icon-edit" @click.stop="handleMore(item,1)" />
                                      </el-popover>
                                    </div>
                                  </template>
                                  <el-button v-if="contentloading" class="loading_icon custom_loading" type="primary" :loading="true" />
                                  <template v-else>
                                    <div class="quick_continer" v-if="quickDataList.length>0">
                                      <el-collapse label-position="left" class="icon_position" v-model="scriptModel.quick_id" v-for="(quickItem,idx) in quickDataList" :key="idx" accordion>
                                        <el-collapse-item :title="quickItem.name" :name="quickItem.id">
                                          <template slot="title">
                                            <div style="width: 100%;line-height:1;" class="text_space">{{quickItem.name}}</div>
                                            <div class="header-icon" @click.stop v-if="quickIdx==2">
                                              <el-popover v-model="quickItem.popover" placement="top" width="198">
                                                <p style="display: flex;justify-content: space-between">
                                                  <el-button slot="reference" size="small" type="primary" @click="adddContent(quickItem,2)">{{ $t('sys_q056') }}</el-button>
                                                  <el-button size="small" type="danger" @click="delCustonGroup(quickItem,2)">{{ $t('sys_q057') }}</el-button>
                                                </p>
                                                <el-button slot="reference" size="small" type="text" icon="el-icon-edit" @click.stop="handleMore(quickItem,2)" />
                                              </el-popover>
                                              <!-- <el-tooltip :content="$t('sys_q107')" placement="bottom" effect="light">
                                                <el-button class="key_btn_skay"size="small" type="text" icon="el-icon-position" @click.stop="changeQuickBtn(quickItem,2)" />
                                              </el-tooltip> -->
                                            </div>
                                          </template>
                                          
                                          <template v-if="quickItem.content.length>0">
                                            <div class="quick_coment_item" v-for="(content,idx) in quickItem.content" :key="idx" @dblclick="changeQuickBtn(content,1)">
                                              <div class="source_desc">
                                                <span class="source_type">{{ fileOptions[content.type] }}</span>
                                                <span class="source_title text_space">{{ idx+1 }}</span>
                                              </div>
                                              <template v-if="content.type==1">
                                                <div class="content_item">
                                                  <div class="content_warp" v-if="quickIdx==1">
                                                      <el-tag type="info" size="mini">{{ $t('sys_mat017') }}</el-tag>
                                                      <span class="reply_content text_space">{{ content.name }}</span>
                                                  </div>
                                                  <div class="text_content">
                                                    <el-tag size="mini">{{ $t('sys_mat019') }}</el-tag>
                                                    {{ content.content }}
                                                  </div>
                                                </div>
                                              </template>
                                              <template v-if="content.type==2">
                                                <div class="content_item hide_item">
                                                  <img class="head_img" :src="content.content" alt="" srcset="">
                                                </div>
                                              </template>
                                              <template v-if="content.type==3">
                                                <audio ref="myAudio" controls class="audio_src">
                                                  <source :src="content.content" type="audio/mpeg">
                                                </audio>
                                              </template>
                                              <template v-if="content.type==4">
                                                <video ref="myAudio" controls>
                                                  <source :src="content.content" type="video/mp4">
                                                </video>
                                              </template>
                                            </div>
                                          </template>
                                        </el-collapse-item>
                                      </el-collapse>
                                    </div>
                                    <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
                                  </template>
                                </el-collapse-item>
                                <div style="width: 100%; display: flex;justify-content: center">
                                  <el-pagination layout="total, prev, pager, next" :total="scriptModel.total" @current-change="handleCurrentGroup" />
                                </div>
                              </el-collapse>
                            </div>
                        </template>
                      </div>
                    </div>
                  </template>
                  <template v-if="tableIdx==2">
                    <template v-if="!friendAccount">
                      <div class="empty_freind">
                        <i class="el-icon-user"></i>
                        <p>{{ $t('sys_c096') }}</p>
                      </div>
                    </template>
                    <template v-else>
                      <el-button v-if="infoLoading" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true" />
                      <el-form v-else size="small" :model="fansForm" ref="fansForm" label-width="70px" style="margin-top: 10px;padding-right: 10px;box-sizing: border-box;">
                        <el-form-item :label="$t('sys_g022')+'：'">
                          <span>{{ handleFilterHide(friendAccount) }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('sys_q058')+'：'">
                          <el-input v-model="fansForm.call_tag" type="textarea" rows="2" maxlength="40" show-word-limit @blur="submitPowerBtn(1)" />
                          <!-- <el-input v-model="fansForm.call_tag" maxlength="30" show-word-limit @blur="submitPowerBtn(1)"></el-input> -->
                        </el-form-item>
                        <el-form-item :label="$t('sys_c006')+'：'">
                          <el-select v-model="fansForm.power_sex" :placeholder="$t('sys_c052')" @change="submitPowerBtn(2)">
                            <el-option v-for="(item,idx) in genderOptiom" :key="idx" :label="item" :value="idx"/>
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('sys_q059')+'：'">
                          <div class="custom_c">
                            <div class="plan_area">
                              <el-input v-model="fansForm.power_province" @blur="submitPowerBtn(3)" /><span>{{ $t('sys_q060') }}</span>
                            </div>
                            <div class="plan_area">
                              <el-input v-model="fansForm.power_city" @blur="submitPowerBtn(4)" /> <span>{{ $t('sys_q061') }}</span>
                            </div>
                          </div>
                        </el-form-item>
                        <el-form-item :label="$t('sys_mat012')+'：'">
                          <el-select v-model="fansForm.group_id" :placeholder="$t('sys_c052')" @change="submitPowerBtn(5)">
                            <el-option v-for="(item,idx) in beanGroupList" :disabled="item.is_select!=2" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('sys_l062')+'：'">
                          <el-input v-model="fansForm.power_remark" type="textarea" rows="3" maxlength="500" show-word-limit @blur="submitPowerBtn(6)" />
                        </el-form-item>
                      </el-form>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <el-dialog :title="configTitle" center :visible.sync="congifModel" :close-on-click-modal="false" :width="configWidth">
      <el-form size="small" :model="powerForm" :rules="powerRules" ref="powerForm" label-width="140px">
        <template v-if="connfigType == 1">
          <template v-if="powerForm.loginEnv.length == 0">
            <el-form-item :label="$t('sys_c052')+'：'" prop="loginEnv" label-width="90px">
              <el-cascader ref="myCascader" v-model="powerForm.loginEnv" el-cascader :options="ipOptions"
                style="width:100%;" @change="changeIpHandle" />
            </el-form-item>
            <el-form-item label-width="0px">
              <div class="is_text_red">{{$t('sys_q063',{value:powerForm.loginEnv.length})}}</div>
            </el-form-item>
          </template>
          <el-form-item :label="$t('sys_c054')+'：'" prop="country" label-width="100px" v-if="powerForm.loginEnv.length > 0">
            <el-select v-model="powerForm.country" filterable :placeholder="$t('sys_c052')">
              <el-option v-for="(item, idx) in countryList" :key="idx" :label="item.country"
                :value="item.ip_id ? item.ip_id : item.country" />
            </el-select>
            <!-- <el-select v-model="powerForm.country" :placeholder="$t('sys_c052')">
            <el-option v-for="item in datapackList" :key="item.id" :label="item.name+'(剩余数量：'+item.residue_num+')'"  :value="item.id" />
          </el-select> -->
          </el-form-item>

        </template>
        <template v-if="connfigType == 2">
          <el-form-item :label="$t('sys_c053')+'：'" prop="moveGroup" label-width="100px">
            <el-select v-model="powerForm.moveGroup" :placeholder="$t('sys_c052')">
              <el-option v-for="item in moveGroupList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </template>
        <template v-if="connfigType == 3">
          <el-form-item :label="$t('sys_q064')+'：'" prop="dataSource">
            <el-select v-model="powerForm.dataSource" :placeholder="$t('sys_q065')">
              <el-option v-for="(item, idx) in sourceOption" :key="idx" :label="item" :value="idx" v-if="item != ''" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('sys_q066')+'：'" prop="powerData">
            <el-select v-model="powerForm.powerData" :placeholder="$t('sys_q067')" v-if="powerForm.dataSource == 1">
              <el-option v-for="item in datapackList" :key="item.id"
                :label="item.name + '('+$t('sys_q065')+'：' + item.residue_num + ')'" :value="item.id" />
            </el-select>
            <template v-if="powerForm.dataSource == 2">
              <el-input type="textarea" :placeholder="$t('sys_mat020')" v-model="powerForm.powerData" rows="6" />
            </template>
            <!-- <div class="submit_btn" v-if="powerForm.dataSource==2">
            <el-button class="custom_file1" style="margin-top: 0;">{{ $t('sys_c059') }}
              <input type="file" ref='uploadclear' @change="checkIpIsUse" id="uploadFile" title=" " />
            </el-button>
            <span class="export_tips" @click="downLoadTemp"><i class="el-icon-download" />下载模板</span>
          </div> -->
          </el-form-item>
          <el-form-item :label="$t('sys_q102')+'：'" prop="addressNum">
            <div style="display: flex;font-size: 12px; line-height: 20px;align-items: center;">
              <el-input v-model="powerForm.addressNum" size="small" show-word-limit :placeholder="$t('sys_q068')" />
              <span style="width: 60px;display: flex;font-size: 12px;align-items: center;margin-left: 10px;">{{$t('sys_q069')}}</span>
            </div>
          </el-form-item>
          <el-form-item label-width="0px">
            <div style="line-height: 2.3;font-size: 12px;">
              <div>{{$t('sys_q070')}}</div>
              <div>{{$t('sys_q070')}}</div>
              <div>{{$t('sys_q072')}}</div>
            </div>
          </el-form-item>
        </template>
        <template v-if="connfigType == 4">
          <el-form-item :label="$t('sys_g027')+'：'" prop="account" label-width="80px">
            <el-input size="small" v-model="powerForm.account" clearable :placeholder="$t('sys_q075')" />
          </el-form-item>
          <el-form-item :label="$t('sys_g022')+'：'" prop="nick_name" label-width="80px">
            <el-input size="small" v-model="powerForm.nick_name" clearable maxlength="20" show-word-limit
              :placeholder="$t('sys_q073')" />
          </el-form-item>
        </template>
        <template v-if="connfigType == 5">
          <el-form-item :label="$t('sys_q074')+'：'" prop="receiveType" label-width="140px">
            <el-select v-model="powerForm.receiveType" :placeholder="$t('sys_c052')" @change="powerForm.powerData = ''">
              <el-option v-for="item in autoOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </template>
        <template v-if="connfigType == 99">
          <el-form-item :label="$t('sys_q076')+'：'" label-width="110px">
            <el-radio-group v-model="powerForm.updata_type">
              <el-radio :label="idx" v-for="(item, idx) in upOption" :key="idx" v-if="idx != 0">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="powerForm.updata_type == 1">
            <el-form-item :label="$t('sys_q077')+'：'" label-width="110px" v-if="powerForm.avatar_img">
              <img class="custom_head" :src="powerForm.avatar_img" alt="" srcset="">
            </el-form-item>
            <el-form-item label-width="0px">
              <el-collapse class="custom_collapse" v-model="powerForm.head">
                <el-collapse-item :label="$t('sys_q078')+'：'" name="1">
                  <el-collapse class="custom_collapse" v-model="powerForm.head_group" accordion @change="selectCard">
                    <el-collapse-item :title="item.name" :name="item.id" v-for="item in materialGroupList"
                      :key="item.id">
                      <el-button v-if="isMaterLoading" class="loading_icon custom_loading" type="primary"
                        :loading="true" />
                      <template v-else>
                        <div class="material_warp" v-if="materialList.length > 0">
                          <div class="material_item" v-for="arts in materialList" :key="arts.id"
                            @click.stop="changeSource(arts)">
                            <img class="head_img" :src="arts.content" alt="" srcset="">
                            <span class="text_space">{{ arts.name }}</span>
                          </div>
                        </div>
                        <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
                      </template>
                    </el-collapse-item>
                  </el-collapse>
                </el-collapse-item>
              </el-collapse>
              <template v-if="materialList.length > 0">
                <el-pagination layout="total,prev, pager, next" :total="powerForm.total"
                  @current-change="handleMaterialChange" />
              </template>
            </el-form-item>
          </template>
          <el-form-item v-else :label="$t('sys_rai016')+'：'" label-width="110px">
            <el-input size="small" clearable v-model="powerForm.up_nick_name" maxlength="20" show-word-limit
              :placeholder="$t('sys_q073')" />
          </el-form-item>
        </template>
        <el-form-item label-width="0" style="text-align: center;">
          <el-button @click="congifModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button type="primary" :loading="isSubmitLoading" @click="submitConfig('powerForm')">{{ $t('sys_c024') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="quickTitle" center :visible.sync="addContentModel" :close-on-click-modal="false" width="750px">
      <el-form size="small" :model="quickForm" :rules="quickRule" ref="quickForm" label-width="100px">
        <el-form-item :label="$t('sys_q001')" prop="name">
          <el-input v-model="quickForm.name" />
        </el-form-item>
        <el-form-item :label="$t('sys_mat015',{value:$t('sys_mat019')})" prop="source_list">
          <el-button :disabled="quickForm.source_list.length>=5" type="primary" @click="sourceModel=true">{{ $t('sys_mat004') }}</el-button>
          <span style="display: inline-block; margin-left: 10px;">{{ $t('sys_q008') }}</span>
        </el-form-item>
        <el-form-item :label="$t('sys_q007')" v-if="quickForm.source_list.length>0">
          <div class="source_main" v-for="(item,idx) in quickForm.source_list" :key="idx">
              <div class="source_l" style="width:100px;">
                  <span class="source_type">{{ fileOptions[item.type] }}</span>
                  <span class="source_title">{{ idx+1 }}</span>
              </div>
              <div class="reply_main" style="width:400px;">
                  <div v-if="item.type==1">
                      <div class="content_warp">
                          <el-tag type="info"  size="mini">{{ $t('sys_mat019') }}</el-tag>
                          <span class="reply_content">{{ item.content }}</span>
                      </div>
                  </div>
                  <div class="content_warp" v-if="item.type==2">
                      <img :src="item.content">
                  </div>
                  <div class="content_warp" v-if="item.type==3">
                      <audio controls>
                          <source :src="item.content" type="audio/mpeg">
                      </audio>
                  </div>
                  <div class="content_warp" v-if="item.type==4">
                      <video width="210" height="100" controls>
                          <source :src="item.content" type="video/mp4">
                      </video>
                  </div>
              </div>
              <div class="reply_fun">
                  <i class="el-icon-edit" @click="handleQuickBtn(item,idx,1)"></i>
                  <i class="el-icon-delete" @click="handleQuickBtn(item,idx,2)"></i>
              </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="el-item-right">
            <el-button @click="addContentModel=false">{{ $t('sys_c023') }}</el-button>
            <el-button type="primary" :loading="isCustomLoading" @click="submitCustomBtn('quickForm')">{{ $t('sys_c024') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="quilkTitle" center :visible.sync="sourceModel" :close-on-click-modal="false" width="550px">
      <el-form size="small" :model="quickForm" :rules="quickRule" ref="SquickForm" label-width="70px">
        <el-tabs v-model="quickForm.tabIdx" type="card">
          <el-tab-pane :label="item" :name="idx.toString()" v-for="(item,idx) in fileOptions" :key="idx" v-if="idx!=0&&idx!=5&&idx!=6">
            <template slot="label">
              <el-tooltip effect="dark" :content="tipsOption[idx]" placement="top">
                <span>{{ item }}<i v-if="idx!=1" class="el-icon-warning" /></span>
              </el-tooltip>
            </template>
          </el-tab-pane>
        </el-tabs>
        <template v-if="quickForm.tabIdx==1&&sourceModel">
          <el-form-item :label="$t('sys_mat019')" prop="text">
            <el-input type="textarea" :placeholder="$t('sys_mat019')" v-model="quickForm.text" rows="4" show-word-limit />
          </el-form-item>
        </template>
        <template v-else>
          <div class="submit_btn" v-show="quickForm.tabIdx==2&&!quickForm.imgSrc||quickForm.tabIdx==3&&!quickForm.audioSrc||quickForm.tabIdx==4&&!quickForm.videoSrc">
            <el-button class="custom_file1" :loading="upLoading" style="margin-top: 0;">{{upLoading?$t('sys_q015'):$t('sys_c059') }}
              <input type="file" v-if="!upLoading" ref='fileValue' @change="uploadFile" id="uploadFile" :accept="quickForm.tabIdx==2?'.png,.jpg,.jpeg,.gif':quickForm.tabIdx==3?'.mp3':quickForm.tabIdx==4?'.mp4':''" />
            </el-button>
          </div>
          <div class="mask_main">
            <div class="file_img" v-if="quickForm.tabIdx==2&&quickForm.imgSrc">
              <img :src="quickForm.imgSrc">
              <div class="mask_model">
                <i class="el-icon-document-copy" @click.stop="copayUrl(quickForm.imgSrc)"></i>
                <i class="el-icon-edit" @click="changeFile"></i>
              </div>
            </div>
            <div class="audio_file" v-if="quickForm.tabIdx==3&&quickForm.audioSrc">
              <audio ref="myAudio" controls>
                <source :src="quickForm.audioSrc" type="audio/mpeg">
              </audio>
              <div class="mask_model">
                <i :class="[quickForm.isAudioPlay?'el-icon-video-pause':'el-icon-video-play']" @click.stop="playAudio"></i>
                <i class="el-icon-document-copy" @click.stop="copayUrl(quickForm.audioSrc)"></i>
                <i class="el-icon-edit" @click="changeFile" ></i>
              </div>
            </div>
            <div class="video_file" v-if="quickForm.tabIdx==4&&quickForm.videoSrc">
              <video  ref="myVideo"class="video_file" controls>
                <source :src="quickForm.videoSrc" type="video/mp4">
              </video>
              <div class="mask_model">
                <!-- <i class="el-icon-video-play"></i> -->
                <i :class="[quickForm.isVideoPlay?'el-icon-video-pause':'el-icon-video-play']" @click.stop="playVideo"></i>
                <i class="el-icon-document-copy" @click.stop="copayUrl(quickForm.videoSrc)"></i>
                <i class="el-icon-edit" @click="changeFile"></i>
              </div>
            </div>
          </div>
        </template>
        <el-form-item>
          <el-button class="el-item-right" type="primary" :disabled="quickForm.tabIdx==2&&!quickForm.imgSrc||quickForm.tabIdx==3&&!quickForm.audioSrc||quickForm.tabIdx==4&&!quickForm.videoSrc" @click="submitForm('SquickForm')">{{ $t('sys_c024') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-image-viewer v-if="imgModel" :on-close="closeViewer" @click.native="cloneImgpreview" :url-list="imgList" />
  </div>
</template>
<script>
import clipboard from 'clipboard';
import { mapState } from 'vuex'
import { online } from '@/api/login'
import { getToken } from '@/utils/auth'
import { MessageBox } from 'element-ui'
import { dobatchfastlogin } from '@/api/storeroom'
import { getdatapacklist } from '@/api/datamanage'
import { getstaticip, getdynamicip, dobatchlogin } from '@/api/storeroom'
import { getmyspeechgrouplist, domyspeechgroup, getmyspeechlist,domyspeech } from '@/api/article'
import { getmaterialgrouplist, getmateriallist, materialFile,getspeechgrouplist,getspeechlist } from '@/api/article'
import { successTips, resetPage, syncReadFile, langOptions, autoOptions } from '@/utils/index'
import { getchatcustomerlist, getchataccountcustomerlist, getchatgrouplist, dochatgroup, getcustomerfriendlist, dochatuptop, dooutfanexcel, doclearfans, getcustomermessagelist, dochatcanceluptop, dochatupbook, getchatmovegrouplist, dochatmovegroup, dobatchclearfans, sendmsg, doreadmessage, getcustomerunreadlist, getaccountstatus, translatetext, globalsetting, getglobalsetting, delmessage, upfriendinfo, getfriendinfo, dochataccountinfo, correction,quicklysendmsg,messagedecrypt } from '@/api/chatroom'
export default {
  components: { 'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
  data() {
    return {
      f_page: 0,
      f_limit: 10,
      cardIdx: 1,
      tableIdx: 1,
      quickIdx: 1,
      staffIdx: 0,
      newsTotal: 0,
      page_total: 0,
      staffInfo: "",
      scrollType: 0,
      serviceIdx: 1,
      unReadTotal: 0,
      render_line: 0,
      friend_news: 0,
      quickHeight: 0,
      quickTitle: "",
      render_lang: "",
      trans_type: 1,
      storeNewsId:[],
      edit_name: "",
      query_text: "",
      group_name: "",
      account_name: "",
      configTitle: "",
      connfigType: "",
      changeGroupId: "",
      friendAccount: "",
      slotReference: "",
      pageOption: resetPage(),
      check_friend_all: "",
      new_group_name: "",
      loading: false,
      noMore: false,
      configWidth: "",
      copayImgUrl: "",
      fileImgUrl: "",
      isQuickMenu: true,
      isHideNew: false,
      upLoading: false,
      sourceModel: false,
      quickLoading: false,
      global_config: false,
      q_popover: false,
      addContentModel: false,
      refreshStstus: false,
      congifModel: false,
      staffLoading: false,
      customLoading: false,
      groupLoading: false,
      friendLoading: false,
      isHideEmoji: false,
      isHideImg: false,
      copayLoading: false,
      isShowBetch: false,
      isShowEdit: false,
      isHideEdit: false,
      initloading: false,
      isLoading: false,
      newsLoading: false,
      newsNoMore: false,
      addLoading: false,
      is_visible: false,
      isAddGroup: false,
      isDelGroup: false,
      isMaterLoading: false,
      is_show_add: false,
      isHideMenu: false,
      isDropdown: false,
      isCustomLoading: false,
      squareUrl: "",
      groupIdx: "",
      frienxIdx: "",
      send_text: "",
      quilkTitle: "",
      lastScrollTop: 0,
      checkFriends: [],
      beanGroupList: [],
      isSubmitLoading: false,
      autoOptions: autoOptions(),
      langOptions: langOptions(),
      groupList: [],
      staff_no: "",
      group_id: "",
      account_id: "",
      customer_id: "",
      staffAccount: "",
      is_sensitive:null,
      percentage: 0,
      datapackList: [],
      seatsDataList: [],
      countryList: [],
      moveGroupList: [],
      staffAccountList: [],
      staffGrouptList: [],
      materialList: [],
      materialGroupList: [],
      quickMaterialGroup: [],
      quickMaterialList: [],
      randomNum: [1, 2, 4, 8, 3, 8, 4, 6, 3, 8],
      pattern: /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,
      newsDataList: [],
      friendList: [],
      storeSocketNes: [],
      powerForm: {
        page: 1,
        limit: 8,
        total: 0,
        dataSource: 1,
        powerData: "",
        moveGroup: "",
        addressNum: "",
        loginEnv: [],
        country: "",
        account: "",
        head: "",
        nick_name: "",
        head_group: "",
        avatar_img: "",
        updata_type: 1,
        up_nick_name: "",
        receiveType: "zh"
      },
      fansForm: {
        call_tag: "",
        power_sex: 0,
        power_province: "",
        power_city: "",
        group_id: "",
        power_remark: ""
      },
      quick: {
        page: 1,
        limit: 8,
        total: 0,
        seat_id: 1,
        group_id: 1,
        name: "",
        g_name: "",
        edit_popover:false,
        isPopover:false,
        c_g_loading:false,
        quick_idx: null
      },
      scriptModel: {
        page: 1,
        limit: 20,
        total: 0,
        seat_id: 1,
        group_id: 1,
        name: "",
        quick_id: "",
        quick_idx: null
      },
      quickForm:{
        name:"",
        text:"",
        edit_id:"",
        tabIdx:"1",
        imgSrc:"",
        audioSrc:"",
        videoSrc:"",
        content:[],
        c_group_id:"",
        isAudioPlay:false,
        isVideoPlay:false,
        editIndex: "",
        source_list:[]
      },
      baseMsg:{
        head:"",
        msg_id:"",
        errmsg:"",
        sender:"",
        data_id:"",
        is_read:1,
        loading:true,
        msg_status:1,
        send_category:1,
        send_time:new Date().getTime()
      },
      loadingGroup:false,
      contentloading:false,
      quickGroupList:[],
      quickDataList:[],
      imgList: [],
      socket: null,
      friendInfo: "",
      onlineAccount: "",
      progrTimer: null,
      imgModel: false,
      historyNews: 0,
      scrollOldNum: 0,
      un_read_num: 0,
      showScroll: false,
      groupTime: 60000,
      groupTimeTsak: null,
      waitTimer: null,
      heartTimer: null,
      socketStatus: 0,
      infoLoading: false,
      timeout: 1000,//延迟一秒获取心跳状态    
      setInter: 30000,//10秒分钟发一次心跳 
      gap_time:0,
      beforeUnload_time:0,
      appid: process.env.VUE_BASE_FANYI_APPID,
      key: process.env.VUE_BASE_FANYI_APPKEY,
      socketUrl: process.env.VUE_APP_BASE_WS
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    staffNick() {
      let nick_name = "";
      if (this.userInfo.account_type == 3) {
        let show_name = this.seatsDataList.filter(item => { return item.customer_id == this.customer_id });
        if (show_name.length > 0) {
          nick_name = show_name[0].name
        }
      }else{
        nick_name = this.userInfo.account||""
      }
      return nick_name;
    },
    quickRule(){
      return {
        name: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
        text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
        source_list: [{ type: 'array', required: true, message: this.$t('sys_c052'), trigger: 'change' }],
      }
    },
    friendOption() {
      return ["",this.$t('sys_q079'),this.$t('sys_q080')]
    },
    renderOptions() {
      return [this.$t('sys_q081')]
    },
    ipOptions() {
      return [
        {
          value: 1,
          label: this.$t('sys_l031'),
          children: [{
            value: 4,
            label: 'Ipv4'
          }, {
            value: 5,
            label: 'Ipv6'
          }]
        },
        {
          value: 2,
          label: this.$t('sys_l030'),
          children: [{
            value: 6,
            label:this.$t('sys_l052')
          }]
        }
      ]
    },
    powerRules() {
      return {
        dataSource: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        powerData: [{ required: true, message: this.powerForm.dataSource == 1 ? this.$t('sys_c052') : this.$t('sys_mat021'), trigger: this.powerForm.dataSource == 1 ? 'change' : 'blur' }],
        // powerData: [{ required: true, message:this.$t('sys_c052'), trigger:'change' }],
        addressNum: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
        loginEnv: [{ type: 'array', required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        country: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        moveGroup: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        account: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
        nick_name: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blur' }],
        receiveType: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }]
      }
    },
    accountStatus() {
      return ["",this.$t('sys_g032'),this.$t('sys_g033'),this.$t('sys_g034'),this.$t('sys_g035'),this.$t('sys_g036')]
    },
    seatOption() {
      return ['',this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011')]
    },
    tipsOption() {
      return ['','',this.$t('sys_q012'),this.$t('sys_q013'),this.$t('sys_q014')]
    },
    quickOption() {
      return ['',this.$t('sys_q003'),this.$t('sys_q004'),this.$t('sys_q005')]
    },
    upOption() {
      return ["", this.$t('sys_rai014'), this.$t('sys_rai016')]
    },
    genderOptiom() {
      return [this.$t('sys_c045'), this.$t('sys_c041'), this.$t('sys_c042')]
    },
    topOption() {
      return ["",this.$t('sys_q082'),this.$t('sys_q083')]
    },
    fansOption() {
      return ["",this.$t('sys_q105'),this.$t('sys_q104')]
    },
    transOptions() {
      return ["",this.$t('sys_q084'),this.$t('sys_q085')]
    },
    sourceOption() {
      return ["",this.$t('sys_q086'),this.$t('sys_q087')]
    },
    newsOption() {
      return ["",this.$t('sys_q088'),this.$t('sys_q089'),this.$t('sys_q090')]
    },
    labelOption() {
      return [this.$t('sys_q091'),this.$t('sys_q092'),this.$t('sys_g092'),this.$t('sys_q093')]
    },
    ipClassOptions() {
      return ["", this.$t('sys_l031'), this.$t('sys_l030'), this.$t('sys_l035')]
    },
    ipTypeOptions() {
      return ["", this.$t('sys_l028'), this.$t('sys_l029'), this.$t('sys_l030')]
    },
    fileOptions() {
      return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092')]
    },
    menuOption() {
      return [
        {
          name:this.$t('sys_c028'),
          icon: 'del_icon'
        },
        {
          name:this.$t('sys_l094'),
          icon: 'lang_icon'
        },
        {
          name:this.$t('sys_rai120'),
          icon: 'copay_icon'
        }
      ]
    },
    moreHandle() {
      return this.isLoading || this.noMore;
    },
    newsHandle() {
      return this.newsLoading || this.newsNoMore;
    },
    batchOption() {
      return ["",this.$t('sys_q009'),this.$t('sys_q094')]
    }
  },
  created() {
    // this.task_id = this.$route.query;
    document.addEventListener('paste', this.handlePaste);
    if (this.$route.query.staff) {
      this.staff_no = this.$route.query.staff;
      this.staffAccount = this.$route.query.alt;
    }
    this.customer_id = localStorage.getItem("currentSeatsIdx") || "";
    if (this.userInfo.account_type == 3) {
      this.customer_id = this.userInfo.uid;
      this.staff_no = this.userInfo.account;
      this.is_sensitive = this.userInfo.is_sensitive;
      this.initSocket();
      this.startWsHeart();
      this.getGlobalConfig();
      this.getCustomAccountList();
      online({online:2}).then(res=>{});
    } else {
      this.getCustomList();
    }
    this.getQuickGroup();
    this.$nextTick(()=>{
      this.quickHeight = this.$refs.quick_ele.offsetHeight-350
    })
  },
  mounted(){
   if (this.userInfo.account_type == 3) {
      window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    }
  },
  methods: {
    selectCard() {
      this.powerForm.page = 1;
      this.getMaterialList();
    },
    handleMaterialChange(val) {
      this.powerForm.page = val;
      this.getMaterialList();
    },
    changeSource(val) {
      this.materialList = [];
      this.powerForm.head = "";
      this.powerForm.head_group = "";
      this.powerForm.avatar_img = val.content;
    },
    materialGruopList() {
      getmaterialgrouplist({ page: 1, limit: 30, type: 2 }).then(res => {
        this.materialGroupList = res.data.list || [];
      })
    },
    getMaterialList() {
      this.isMaterLoading = true;
      let params = { page: this.powerForm.page, limit: this.powerForm.limit, type: 2, group_id: this.powerForm.head_group }
      getmateriallist(params).then(res => {
        let data = res.data;
        this.isMaterLoading = false;
        this.powerForm.total = data.total;
        this.materialList = data.list || [];
      })
    },
    async updateAccount(row) {
      this.refreshStstus = true;
      let res = await getaccountstatus({ account: row.account });
      if (res.code != 0) return;
      for (let k = 0; k < this.staffAccountList.length; k++) {
        if (row.account == this.staffAccountList[k].account) {
          let item = this.staffAccountList[k];
          item.head = res.data.head;
          item.nick_name = res.data.nick_name;
          item.remark = res.data.remark;
          item.status = res.data.status;
          this.$set(this.staffAccountList, k, item)
        }
      }
      // successTips(this);
      this.refreshStstus = false;
      // this.getCustomAccountList();
    },
    startGroupHeart() {
      this.groupTimeTsak = setInterval(() => {
        this.getRefreshGroup()
      }, this.groupTime)
    },
    startWsHeart() {
      this.waitTimer = setInterval(() => {
        this.socket.send(JSON.stringify({ customer_uid: this.customer_id, send_type: "online" }));
        this.heartTimer = setTimeout(() => {
          console.log("心跳状态：" + String(this.socketStatus));
          if (this.socketStatus == 1) {
            this.socketStatus = 0
          } else {
            this.socket.close();
            setTimeout(() => { this.initSocket() })
          }
        }, this.timeout)
      }, this.setInter)
    },
    initSocket: function () {
      if (typeof (WebSocket) === "undefined") {
        // alert(this.$t('serve043'))
        successTips(this, "error", "socket contect error");
      } else {
        this.socket = new WebSocket(this.socketUrl + "?uid=" + this.customer_id)
        this.socket.onopen = this.socketOpen
        this.socket.onerror = this.socketError
        this.socket.onmessage = this.readMessage
      }
    },
    socketOpen: function () {
      console.log("socket contect success")
    },
    socketError: function () {
      console.log("socket error")
    },
    readMessage: function (msg) {
      let backNews = JSON.parse(msg.data);
      if (backNews.send_type == "online") {
        this.socketStatus = 1;
        return
      }
      // console.log(backNews);
      // send_category 1-推广号消息 2-好友消息
      if (backNews.send_category == 2 && backNews.receive_account == this.friendInfo.account && backNews.send_account == this.friendInfo.friend_account) {
        backNews.avatar = this.friendInfo.avatar || "";
        this.newsDataList.push(backNews);
      }
      let filterTop = this.friendList.filter(item => { return item.is_top == 2 }).length;
      let filterItem = this.friendList.filter(item => { return item.friend_account == backNews.send_account });
      if (filterItem.length == 0 && backNews.send_category == 2 && backNews.receive_account == this.staffAccount && this.groupIdx==="") {
        backNews.un_read_num = 0;
        backNews.account = backNews.receive_account;
        backNews.friend_account = backNews.send_account;
        this.friendList.splice(filterTop, 0, backNews);
      }
      if (!this.staffAccount && backNews.send_category == 2 && filterItem.length == 0 && this.groupIdx==="") {
        backNews.un_read_num = 0;
        backNews.account = backNews.receive_account;
        backNews.friend_account = backNews.send_account;
        this.friendList.splice(filterTop, 0, backNews);
      }
      if (backNews.send_category == 1 && backNews.receive_account == this.friendInfo.account || backNews.send_account == this.friendInfo.account) {
        this.storeSocketNes.push(backNews);
        for (let k = 0; k < this.newsDataList.length; k++) {
          if (this.newsDataList[k].data_id == backNews.data_id) {
            if (this.newsDataList[k].send_category == 1) {
              let item = this.newsDataList[k];
              item.loading = false;
              item.errmsg = backNews.errmsg;
              item.msg_id = backNews.msg_id;
              item.is_read = backNews.is_read;
              item.send_time = backNews.send_time;
              item.msg_status = backNews.msg_status;
              item.send_category = backNews.send_category;
              // item.translate_text = backNews.translate_text;
              this.$set(this.newsDataList, k, item)
            }
          }
          if (this.newsDataList[k].msg_id == backNews.msg_id && backNews.is_read == 2) {
            let item = this.newsDataList[k];
            item.is_read = backNews.is_read;
            item.msg_status = backNews.msg_status;
            this.$set(this.newsDataList, k, item)
          }
        }
      }
      let account = backNews.send_category == 1 ? backNews.receive_account : backNews.send_account;
      if (backNews.msg_type != 0) {
        this.friendNewContent(backNews.msg_type, account, backNews.msg_content, backNews, 'add');
      }
      if (this.friendInfo.account == backNews.receive_account) {
        doreadmessage({ account: this.friendInfo.account, friend_account: this.friendInfo.friend_account });
      }
      this.scrollType = 1;
      this.scrollToBottom();
      if (backNews.send_type != "call_back" && backNews.errmsg) {
        successTips(this, "error", backNews.errmsg);
      }
    },
    showClearNews() {
      this.historyNews = 0;
      this.scrollType = 1;
      this.scrollToBottom()
    },
    // 发送消息给被连接的服务端
    send: function (params) {
      this.socket.send(params)
    },
    closeSocket: function () {
      console.log(this.$t('serve046'))
    },
    getCustomList() {
      this.staffLoading = true;
      getchatcustomerlist({}).then(res => {
        this.staffLoading = false;
        this.seatsDataList = res.data.list || [];
        let filterStaff = this.seatsDataList.filter(item =>{return item.customer_id == this.customer_id});
        if (this.customer_id&&filterStaff.length>0) {
          let { account,customer_id,is_sensitive } = this.seatsDataList.find(item => item.customer_id == this.customer_id);
          this.staff_no = account;
          this.customer_id = customer_id;
          this.is_sensitive = is_sensitive;
          this.staffAccount = localStorage.getItem("currentSeatAccount") || "";
        } else {
          let checkIsStaff = this.seatsDataList.filter(item => { return item.account == this.staff_no })
          if (this.staff_no && checkIsStaff.length > 0) {
            this.customer_id = checkIsStaff[0].customer_id;
            this.is_sensitive = checkIsStaff[0].is_sensitive;
          } else {
            this.staff_no = this.seatsDataList.length > 0 ? this.seatsDataList[0].account : "";
            this.customer_id = this.seatsDataList.length > 0 ? this.seatsDataList[0].customer_id : "";
            this.is_sensitive = this.seatsDataList.length > 0 ? this.seatsDataList[0].is_sensitive : "";
          }
        }
        this.initSocket();
        this.startWsHeart();
        this.getGlobalConfig();
        this.getCustomAccountList();
      })
    },
    handleFilterHide(row){
      if (!this.customer_id) return;
      if (this.is_sensitive == 2&&row) {
        return row.slice(0,row.length-4) + '****';
      }else{
        return row;
      }
    },
    getCustomAccountList() {
      this.is_visible = false;
      this.customLoading = true;
      this.staffAccountList = [];
      getchataccountcustomerlist({ staff_no: this.staff_no, account: this.account_name }).then(res => {
        this.customLoading = false;
        this.staffAccountList = res.data.list || [];
        this.unReadTotal = res.data.un_read_num;
        this.staffAccountList.unshift({});
        this.staffAccount = this.staffAccount ? this.staffAccount : localStorage.getItem("currentSeatAccount") || "";
        this.changeGroupId = localStorage.getItem("currentGroupId") || "";
        this.serviceIdx = localStorage.getItem("currentServiceIdx") || "";
        if (this.serviceIdx === "" && this.staffAccount && this.staffAccountList.length >= 2) {
          if (this.staffAccountList.filter(item => { return item.account == this.staffAccount }).length > 0) {
            this.staffInfo = this.staffAccountList.filter(item => { return item.account == this.staffAccount })[0];
            this.staffAccount = this.staffAccountList.filter(item => { return item.account == this.staffAccount })[0].account;
          } else {
            this.staffInfo = this.staffAccountList.length >= 2 ? this.staffAccountList[1] : "";
            this.account_id = this.staffAccountList.length >= 2 ? this.staffAccountList[1].id : "";
            this.staffAccount = this.staffAccountList.length >= 2 ? this.staffAccountList[1].account : "";
          }
        } else if (!this.serviceIdx && !this.staffAccount && this.staffAccountList.length >= 2) {
          this.staffInfo = this.staffAccountList.length >= 2 ? this.staffAccountList[1] : "";
          this.account_id = this.staffAccountList.length >= 2 ? this.staffAccountList[1].id : "";
          this.staffAccount = this.staffAccountList.length >= 2 ? this.staffAccountList[1].account : "";
        }
        this.serviceIdx = this.staffAccountList.length == 1 && this.serviceIdx === "" ? 0 : this.serviceIdx;
        this.getCustomGroupList();
        clearInterval(this.groupTimeTsak);// 清除定时器
        this.startGroupHeart();
        this.initFriendList();
      })
    },
    getCustomGroupList(isLoading=false) {
      if (!isLoading) {
        this.groupLoading = true;
        this.staffGrouptList = [];
      }
      getchatgrouplist({ customer_id: this.customer_id, name: this.group_name, account: this.staffAccount }).then(res => {
        this.changeGroupId = localStorage.getItem("currentGroupId") || "";
        this.staffGrouptList = res.data.list || [];
        this.groupLoading = false;
      })
    },
    getRefreshGroup() {
      getchatgrouplist({ customer_id: this.customer_id, name: this.group_name, account: this.staffAccount }).then(res => {
        this.staffGrouptList = res.data.list || [];
      })
    },
    filterGroupHandle(keyword) {
      if (keyword.trim()) {
        const filterGroup = this.staffGrouptList.filter(item => {
          return item.name.toUpperCase().includes(keyword.toUpperCase()) || item.name.toUpperCase().includes(keyword.toUpperCase())
        })
        this.staffGrouptList = filterGroup;
      } else {
        this.getCustomGroupList();
      }
    },
    clearFriendQuery() {
      this.query_text = "";
      this.initFriendList();
    },
    filterNickHandle(keyword) {
      this.initFriendList();
    },
    getunreadtotal() {
      this.friendList = [];
      this.unReadTotal = 0;
      this.friendLoading = true;
      getcustomerunreadlist().then(res => {
        this.friendLoading = false;
        this.friendList = res.data.list || [];
        this.un_read_num = res.data.un_read_num || 0;
      })
    },
    async initFriendList() {
      this.frienxIdx = "";
      this.friendInfo = "";
      this.friendAccount = "";
      this.friendList = [];
      this.newsDataList = [];
      this.friendLoading = true;
      let params = {
        staff_no: this.staff_no,
        friend_account: this.query_text,
      }
      if (this.serviceIdx != '0') {
        params.account = this.staffAccount,
        params.group_id = this.changeGroupId
      }
      localStorage.removeItem("currentFriendIdx");
      localStorage.removeItem("currentFriendAccount");
      this.query_text ? delete params.account : "";
      let reqApi = this.serviceIdx == '0' ? getcustomerunreadlist : getcustomerfriendlist;
      let res = await reqApi(params);
      if (res.code != 0) return;
      this.friendList = res.data.list || [];
      this.friend_news = res.data.un_read_num || 0;
      if (this.friendList.length > 0) {
        this.frienxIdx = localStorage.getItem("currentFriendIdx") || "";
        this.friendAccount = localStorage.getItem("currentFriendAccount") || "";
        this.friendInfo = this.friendAccount ? this.friendList.filter(item => { return item.friend_account == this.friendAccount })[0] : "";
        this.friendAccount != 'undefined' && this.friendAccount ? this.initNewsList() : "";
      }
      getcustomerunreadlist({ staff_no: this.staff_no }).then(res => {
        this.friendLoading = false;
        this.un_read_num = res.data.un_read_num || 0;
      })
    },
    async initNewsList() {
      this.f_page = 1;
      this.initloading = true;
      this.scrollType = 0;
      this.getBeanGroup();
      this.newsDataList = [];
      let params = {
        page:this.f_page,
        limit:this.f_limit,
        friend_account: this.friendInfo ? this.friendInfo.friend_account : "",
        account: this.friendInfo ? this.friendInfo.account : "",
        avatar: this.friendInfo.avatar,
        head: this.staffInfo.head
      }
      const { data } = await getcustomermessagelist(params);
      this.initloading = false;
      this.newsTotal = data.total || 0;
      this.newsDataList = data.list || [];
      this.page_total = Math.ceil(this.newsTotal / this.f_limit);
      for (let k = 0; k < this.newsDataList.length; k++) {
        this.newsDataList[k].is_fanyi = false;
      }
      await this.$nextTick();
      this.scrollToBottom()
    },
    staffCustomTop(row, type) {
      let params = {
        ptype: type,
        account: row.account,
        friend_account: row.friend_account
      }
      type == 1 ? delete params.friend_account : "";
      const reqApi = row.is_top == 2 ? dochatcanceluptop : dochatuptop;
      let topDataList = type == 1 ? this.staffAccountList : this.friendList;
      reqApi(params).then(res => {
        if (res.code != 0) return;
        if (type == 1) {
          for (let k = 0; k < topDataList.length; k++) {
            if (topDataList[k].id == row.id && row.is_top == 1) {
              let item = topDataList[k];
              item.is_top = 2;
              this.$set(topDataList, k, item)
              topDataList.splice(1, 0, topDataList.splice(k, 1)[0]);
              successTips(this);
              return;
            }
            if (topDataList[k].id == row.id && row.is_top == 2) {
              let item = topDataList[k];
              item.is_top = 1;
              this.$set(topDataList, k, item)
              topDataList.splice(topDataList.length - 1, 0, topDataList.splice(k, 1)[0]);
              successTips(this);
              return;
            }
          }
        } else {
          for (let k = 0; k < topDataList.length; k++) {
            if (topDataList[k].friend_account == row.friend_account && row.is_top == 1) {
              let item = topDataList[k];
              item.is_top = 2;
              this.$set(topDataList, k, item)
              topDataList.splice(0, 0, topDataList.splice(k, 1)[0]);
              successTips(this);
              return;
              // this.staffAccountList.unshift(this.staffAccountList.splice(k,1)[0]);
            }
            if (topDataList[k].friend_account == row.friend_account && row.is_top == 2) {
              let item = topDataList[k];
              item.is_top = 1;
              this.$set(topDataList, k, item)
              topDataList.splice(topDataList.length - 1, 0, topDataList.splice(k, 1)[0]);
              successTips(this);
              return;
            }
          }
        }
      })
    },
    getPacketlist() {
      getdatapacklist({ page: 1, limit: 300 }).then(res => {
        this.datapackList = res.data.list || [];
      })
    },
    getMoveGrouplist() {
      getchatmovegrouplist({ ptype: 1, customer_id: this.customer_id }).then(res => {
        this.moveGroupList = res.data.list || [];
      })
    },
    async getBeanGroup() {
      let { data } = await getchatmovegrouplist({ ptype: 2, customer_id: this.customer_id });
      let groupList = data.list || [];
      this.fansForm.group_id = groupList.length > 0 ? groupList[0].id : "";
      this.beanGroupList = groupList;
      await this.getPowerInfo();
    },
    async changeIpHandle() {
      let params = {
        ip_type: this.powerForm.loginEnv[1] == 4 ? 1 : 2,
      }
      this.powerForm.loginEnv[0] == 2 ? delete params.ip_type : "";
      const reqApi = this.powerForm.loginEnv[0] == 1 ? getstaticip : getdynamicip;
      reqApi(params).then(res => {
        if (res.code != 0) return;
        this.countryList = res.data.list || [];
      })
    },
    accountHandle(row, type) {
      console.log(row);
      if (type == 0 || type == 1) {
        this.congifModel = true;
        this.onlineAccount = row;
        this.powerForm.loginEnv="";
        this.powerForm.country="";
        this.connfigType = type == 0 ? 1 : 99;
        this.configWidth = type == 0 ? "350px" : "500px";
        this.configTitle = type == 0 ? this.$t('sys_q091'):this.$t('sys_q092');
        type == 1 ? this.materialGruopList() : "";
        this.$nextTick(() => {
          if (type == 0) {
            const _cascader = this.$refs.myCascader;
            _cascader.$refs.panel.activePath = [];
            _cascader.$refs.panel.checkedValue = [];
            _cascader.$refs.panel.syncActivePath();
          }
          this.$refs.powerForm.resetFields();
          this.powerForm.country = "";
          this.powerForm.loginEnv = [];
          this.powerForm.avatar_img = "";
          this.powerForm.up_nick_name = "";
        })
      }
      if (type == 2) {
        dooutfanexcel({ customer_id: this.customer_id, account: row }).then(res => {
          window.location.href = res.data.url;
          successTips(this);
        })
      }
      if (type == 3) {
        let that = this;
        that.$confirm(that.$t('sys_q134'),that.$t('sys_l013'), {
          type: 'warning',
          confirmButtonText: that.$t('sys_c024'),
          cancelButtonText: that.$t('sys_c023'),
        beforeClose: function (action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            doclearfans({ customer_id: that.customer_id, account: row }).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code != 0) return;
              that.initFriendList();
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
    handleCommand(type) {
      if (type == 1) {
        this.connfigType = 2;
        this.congifModel = true;
        this.configWidth = "360px";
        this.configTitle = this.$t('sys_mat005');
        this.getMoveGrouplist();
      }
      if (type == 2) {
        let FriendsId = this.friendList.filter(item => {
          if (item.check) {
            return item
          }
        });
        let params = {
          // customer_id:this.customer_id,
          friend_ids: FriendsId.map(item => { return item.id }),
        }
        dobatchclearfans(params).then(res => {
          if (res.code != 0) return;
          this.checkFriends = [];
          this.isShowBetch = false;
          this.check_friend_all = false;
          this.getCustomGroupList();
          this.initFriendList();
          for (let k = 0; k < this.friendList.length; k++) {
            let item = this.friendList[k];
            item.check = false;
            this.$set(this.friendList, k, item)
          }
          successTips(this);
        })
      }
    },
    //添加分组
    addStaffGroup(row, type) {
      let params = {
        ptype: type,
        id: row.id,
        del_id: [row.id],
        name: this.new_group_name,
        customer_id: this.customer_id
      }
      if (type == 1) {
        delete params.id;
      } else if (type == 3) {
        delete params.id;
        delete params.name;
        delete params.customer_id;
      }
      this.addLoading = true;
      dochatgroup(params).then(res => {
        if (res.code != 0) return;
        this.addLoading = false;
        this.isAddGroup = false;
        this.getCustomGroupList();
        successTips(that);
      })
    },
    handleGroup(row, idx) {
      this.group_id = row.id;
      this.new_group_name = row.name;
      for (let k = 0; k < this.staffGrouptList.length; k++) {
        this.staffGrouptList[k].is_edit = false;
        this.staffGrouptList[k].is_del = false;
      }
    },
    changeCard(idx) {
      this.cardIdx = idx;
    },
    changeStaff(row, idx) {
      this.quickIdx=1;
      this.tableIdx=1;
      this.staffIdx = idx;
      this.quick.name="";
      this.friendInfo = "";
      this.un_read_num = 0;
      this.staffAccount = "";
      this.friendAccount = "";
      this.quick.seat_id = 1;
      this.quickGroupList=[]; 
      this.quick.group_id="";
      this.quick.quick_idx="";
      this.scriptModel.total=0;
      this.scriptModel.group_id="";
      this.staff_no = row.account;
      this.customer_id = row.customer_id;
      this.is_sensitive = row.is_sensitive;
      localStorage.removeItem("currentSeatAccount");
      localStorage.removeItem("currentServiceIdx");
      localStorage.removeItem("currentGroupId");
      localStorage.removeItem("currentFriendIdx");
      localStorage.removeItem("currentFriendAccount");
      localStorage.setItem("currentSeatsIdx", row.customer_id);
      this.getCustomAccountList();
      this.getQuickGroup();
      this.socket ? this.socket.close() : "";
      setTimeout(() => { this.initSocket() })
    },
    async changeServe(row, idx) {
      this.newsDataList = [];
      this.groupIdx = "";
      this.friendInfo = "";
      this.query_text = "";
      this.staffInfo = "";
      this.staffAccount = "";
      this.changeGroupId = "";
      this.isHideNew = false;
      this.newsLoading = false;
      localStorage.removeItem("currentGroupId");
      localStorage.removeItem("currentFriendIdx");
      localStorage.removeItem("currentSeatAccount");
      localStorage.removeItem("currentFriendAccount");
      if (idx === 0) {
        this.serviceIdx = idx;
        clearInterval(this.groupTimeTsak);// 清除定时器
        localStorage.setItem("currentServiceIdx", idx);
      } else {
        this.serviceIdx = "";
        this.staffInfo = row;
        this.staffAccount = row.account;
        localStorage.removeItem("currentServiceIdx");
        clearInterval(this.groupTimeTsak);
        this.startGroupHeart();
        localStorage.setItem("currentSeatAccount", row.account);
      }
      if (idx != 0) {
        await this.getCustomGroupList();
      }
      await this.initFriendList();
    },
    chnageGroup(row, type) {
      this.groupIdx = type;
      this.changeGroupId = row.id;
      localStorage.removeItem("currentFriendIdx");
      localStorage.removeItem("currentFriendAccount");
      localStorage.setItem("currentGroupId", row.id);
      this.initFriendList();
    },
    async changeFriend(row, idx) {
      if (row.friend_account == this.friendAccount && this.frienxIdx === idx) return;
      this.newsNoMore = false;
      this.infoLoading = true;
      this.isHideNew = true;
      this.isShowBetch = false;
      this.initloading = true;
      this.frienxIdx = idx;
      this.friendInfo = row;
      this.scrollType = 0;
      this.fansForm.group_id = "";
      this.friendAccount = row.friend_account;
      localStorage.setItem("currentFriendIdx", idx);
      localStorage.setItem("currentFriendAccount", row.friend_account);
      if (row.un_read_num > 0) {
        const { code } = await doreadmessage({ account: row.account, friend_account: row.friend_account });
        if (code != 0) return;
        this.friendNewContent(2, "", "", "", "cancel");
      }
      await this.initNewsList();
      this.$nextTick(() => {
        this.$refs.textInput.focus();
      })
    },
    lineBreak() {
      // this.send_text = this.textValue.replace(/\n\n/g, '\n')
      console.log(this.send_text);
    },
    chackLink(val) {
      if (!this.pattern.test(val)) {
        return true
      } else {
        return false
      }
    },
    async sendBtn(e) {
      e.preventDefault();
      if (this.isHideImg) {
        this.sendCopayImg();
        return;
      }
      if (!this.send_text) return;
      let newObj = {
        msg_type: 1,
        send_account: this.friendInfo.account, //发送账号
        receive_account: this.friendInfo.friend_account, //接收账号
        // msg_content: this.send_text, //发送内容
      }
      if (this.trans_type == 2) {
        const res = await translatetext({ text: this.send_text, target: this.render_lang });
        if (res.code != 0) return;
        const {data:{translate_text}} = res;
        newObj = {...newObj,translate_text:this.send_text,msg_content:translate_text}
      }else{
        newObj = {...newObj,msg_content:this.send_text}
      }
     
      const { data:{sender,data_id} } = await sendmsg(newObj);
      newObj = {...newObj,...this.baseMsg,sender:sender,data_id:data_id,head:this.staffInfo.head}
      this.newsDataList.push(newObj);
      await this.$nextTick();
      this.send_text = "";
      this.friendNewContent(1,"",newObj.msg_content);
      this.scrollToBottom();
      this.handleAsyncNews();
    },

    closeCoapyImg() {
      this.fileImgUrl = "";
      this.copayImgUrl = "";
      this.isHideImg = false;
    },
    async handlePaste(event) {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          this.fileImgUrl = item.getAsFile();
          const types = this.fileImgUrl.name.split(".").pop()
          const fileType = ['png', 'jpg', 'jpeg'];
          if (fileType.indexOf(types) == -1) {
            this.$message.error(this.$t('sys_c097', { value: fileType.toString() }));
            return
          }
          this.copayImgUrl = await syncReadFile(this.fileImgUrl);
          this.isHideImg = true;
        }
      }
    },
    async sendCopayImg() {
      this.copayLoading = true;
      this.startPercent();
      this.scrollType = 1;
      let formData = new FormData();
      formData.append('file', this.fileImgUrl);
      const imgPath = await materialFile(formData);
      let newObj = {
        msg_type: 2,
        send_account: this.friendInfo.account, //发送账号
        receive_account: this.friendInfo.friend_account, //接收账号
        msg_content: imgPath.data.url //发送内容
      }
      const { data:{sender,data_id} } = await sendmsg(newObj);
      newObj = {...newObj,...this.baseMsg,sender:sender,data_id:data_id,head:this.staffInfo.head}
      this.copayLoading = false;
      this.isHideImg = false;
      this.fileImgUrl = "";
      this.copayImgUrl = "";
      this.newsDataList.push(newObj);
      await this.$nextTick();
      this.friendNewContent(2, "")
      this.scrollToBottom();
      this.handleAsyncNews();
    },
    handleAsyncNews() {
      let syncItem = this.storeSocketNes.filter(item => this.newsDataList.some(obj => obj.data_id === item.data_id));
      if (syncItem.length > 0) {
        let { data_id,errmsg,msg_id,is_read,send_time,msg_status,send_category,translate_text } = syncItem[0];
        for (let k = 0; k < this.newsDataList.length; k++) {
          if (this.newsDataList[k].data_id === data_id && this.newsDataList[k].loading) {
            let item = this.newsDataList[k];
            item = {...item,
              loading:false,
              errmsg:errmsg,
              msg_id:msg_id,
              is_read:is_read,
              send_time:send_time,
              msg_status:msg_status,
              send_category:send_category,
              // translate_text:translate_text
            }
            this.$set(this.newsDataList, k, item)
          }
        }
      }
      this.storeSocketNes = [];
    },
    async changeImg(e) {
      this.startPercent();
      this.scrollType = 1;
      let files = e.target.files[0];
      const types = files.name.split(".").pop()
      const fileType = ['png', 'jpg', 'jpeg'];
      if (fileType.indexOf(types) == -1) {
        this.$message.error(this.$t('serve047'));
        return
      }
      let formData = new FormData();
      formData.append('file', files);
      this.$refs.imgInput.value = "";
      const imgPath = await materialFile(formData);
      let newObj = {
        msg_type: 2,
        send_account: this.friendInfo.account, //发送账号
        receive_account: this.friendInfo.friend_account, //接收账号
        msg_content: imgPath.data.url //发送内容
      }
      const { data:{sender,data_id} } = await sendmsg(newObj);
      newObj = {...newObj,...this.baseMsg,sender:sender,data_id:data_id,head:this.staffInfo.head}
      this.newsDataList.push(newObj);
      await this.$nextTick();
      this.friendNewContent(2, "")
      this.scrollToBottom();
      this.handleAsyncNews();
    },
    changeReceiveBtn() {
      this.connfigType = 5;
      this.congifModel = true;
      this.configWidth = "460px";
      this.configTitle = this.$t('sys_q095');
      // this.$nextTick(()=>{
      //   this.$refs.powerForm.resetFields();
      //   this.powerForm.receiveType = "zh";
      // })
    },
    sendCard() {
      this.connfigType = 4;
      this.congifModel = true;
      this.configWidth = "360px";
      this.configTitle = this.$t('sys_q096');
      this.$nextTick(() => {
        this.$refs.powerForm.resetFields();
        this.powerForm.account = "";
        this.powerForm.nick_name = "";
      })
    },
    async sendVoice() {
      let newObj = {
        msg_type: 5,
        send_account: this.friendInfo.account, //发送账号
        receive_account: this.friendInfo.friend_account, //接收账号
        msg_content: "" //发送内容
      }
      const { data:{sender,data_id} } = await sendmsg(newObj);
      newObj = {...newObj,...this.baseMsg,sender:sender,data_id:data_id,head:this.staffInfo.head}
      this.newsDataList.push(newObj);
      this.scrollToBottom();
      this.friendNewContent(5,"");
      this.handleAsyncNews();
    },
    checkFriend(row, type) {
      if (type == 1) {
        if (row.check) {
          this.checkFriends.push(row.account);
        } else {
          for (let k = 0; k < this.checkFriends.length; k++) {
            if (this.checkFriends[k] == row.account) {
              this.checkFriends.splice(k, 1)
            }
          }
        }
      } else {
        if (row) {
          this.checkFriends = [];
          for (let k = 0; k < this.friendList.length; k++) {
            this.checkFriends.push(this.friendList[k].account);
            let item = this.friendList[k];
            item.check = true;
            this.$set(this.friendList, k, item)
          }
        } else {
          this.checkFriends = [];
          for (let k = 0; k < this.friendList.length; k++) {
            let item = this.friendList[k];
            item.check = false;
            this.$set(this.friendList, k, item)
          }
        }
      }
      this.check_friend_all = this.friendList.length === this.checkFriends.length ? true : false;
    },
    async handleScrolStop() {
      const scrollTop = this.$refs.newsScroll;
      if (this.f_page >= this.page_total) {
        this.newsNoMore = true;
        return;
      }
      if (scrollTop.scrollTop == 0 && !this.newsLoading) {
        if (this.newsNoMore) {
          return;
        }
        this.newsLoading=true;
        let h1 = scrollTop.scrollHeight;
        // console.log("h1======" + h1);
        setTimeout(async ()=>{
          this.f_page ++;
          this.newsLoading=false;
          this.newsDataList.unshift(this.newsDataList[0]);
          let params = {
            page:this.f_page,
            limit:this.f_limit,
            friend_account: this.friendInfo ? this.friendInfo.friend_account : "",
            account: this.friendInfo ? this.friendInfo.account : "",
            avatar: this.friendInfo.avatar,
            head: this.staffInfo.head
          }
          const { data:{list} } = await getcustomermessagelist(params);
          this.newsDataList=[...list,...this.newsDataList]
          this.$nextTick(() => {
            let h2 = scrollTop.scrollHeight;
            scrollTop.scrollTo({
              top: h2 - h1 - 50,
              behavior: "instant", //auto-自动滚动 instant-瞬间滚动 smooth-平滑滚动
            });
          });
        },1000)
      }
    },
    friendNewContent(type, f_account, msg, row, news) {
      let no_read_total = 0;
      this.is_show_add = false;
      let send_category = row ? row.send_category : "";
      let send_account = row ? row.send_account : "";
      let receive_account = row ? row.receive_account : "";
      let msgOption = ["", "",`[${this.$t('sys_mat009')}]`,`[${this.$t('sys_mat010')}]`,`[${this.$t('sys_mat011')}]`,`[${this.$t('sys_mat091')}]`,`[${this.$t('sys_q097')}]`];
      for (let k = 0; k < this.friendList.length; k++) {
        let friendNum = f_account || this.friendInfo.friend_account;
        let customNum = receive_account || this.friendInfo.account;
        if (this.friendList[k].friend_account == friendNum) {
          let item = this.friendList[k];
          if (item.account == customNum && news != "cancel") {
            item.msg_content = type == 1 ? msg : msgOption[type];
          }
          if (send_category == 2 && item.friend_account != this.friendInfo.friend_account) {
            if (item.friend_account == send_account && item.account == receive_account && news == "add") {
              item.un_read_num++;
              this.un_read_num++;
              this.friend_news++;
              this.getCustomGroupList(true);
              this.is_show_add = true;
            }
          }
          if (item.friend_account == this.friendInfo.friend_account && news == "cancel") {
            if (item.account == this.friendInfo.account) {
              this.un_read_num = this.un_read_num - item.un_read_num;
              this.friend_news = this.friend_news - item.un_read_num;
              item.un_read_num = 0;
            }
          }
          this.$set(this.friendList, k, item);
          // if (news == "add") {
          //   this.friendList.splice(0,0, this.friendList.splice(k, 1)[0]);
          // }
        }
        if (this.friendList[k].account == receive_account) {
          no_read_total += this.friendList[k].un_read_num;
        }
      }
      for (let c = 0; c < this.staffAccountList.length; c++) {
        if (this.staffAccountList[c].account == receive_account) {
          this.staffAccountList[c].is_read = 2;
        }
        if (no_read_total == 0 && this.staffAccountList[c].account === this.friendInfo.account) {
          this.staffAccountList[c].is_read = 1;
        }
        if (this.staffAccountList[c].account === receive_account) {
          let item = this.staffAccountList[c];
          if (no_read_total == 0 && this.staffAccountList[c].account == this.friendInfo.account) {
            item.is_read = 1;
          } else {
            item.is_read = 2;
          }
          if (this.serviceIdx == '0' || this.serviceIdx == '' && news == "add") {
            if (this.friendInfo.friend_account != send_account && !this.is_show_add) {
              this.un_read_num++;
              this.getCustomGroupList(true);
            }
          }
          this.$set(this.staffAccountList, c, item);
        }
      }
    },
    sendMessTop() {
      let topNum = this.friendList.filter(item => { return item.is_top == 2 }).length;
      this.friendList.splice(0, topNum, this.friendList.splice(k, 1)[0]);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        let scrollEle = this.$refs.newsScroll;
        if (this.scrollType == 0) {
          scrollEle.scrollTop = scrollEle.scrollHeight;
        } else {
          scrollEle.scrollTo({
            top: scrollEle.scrollHeight,
            behavior: 'smooth', // 平滑滚动效果
          })
        }
      })
    },
    async changeEmoji(val) {
      let dom = this.$refs.textInput.$refs.textarea;
      let index = dom.selectionStart;
      let contont = dom.value;
      this.send_text = contont.substring(0, index) + val + contont.substring(index, contont.length)
      await this.$nextTick();
      dom.focus();
      dom.setSelectionRange(index + val.length, index + val.length)
    },
    startPercent() {
      this.percentage = 0;
      this.progrTimer = setInterval(() => {
        let curPercent = Number(this.randomNum[Math.floor(Math.random() * this.randomNum.length)]);
        if (this.percentage >= 55) {
          if (this.percentage < 96) {
            this.percentage++
          } else {
            this.percentage = 99
            clearInterval(this.progrTimer)
          }
        } else {
          this.percentage = this.percentage + curPercent
        }
      }, 500)
    },
    uploadFileBtn() {
      this.connfigType = 3;
      this.congifModel = true;
      this.configWidth = "460px";
      this.configTitle = this.$t('sys_q098');
      this.getPacketlist();
      this.$nextTick(() => {
        this.powerForm.powerDat = "";
        this.powerForm.addressNum = "";
        this.$refs.powerForm.resetFields();
      })
    },
    submitConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.connfigType == 1) {
            let params = {
              accounts: [this.onlineAccount],
              country: this.powerForm.country,
              ip_category: this.powerForm.loginEnv[0],
              ip_type: this.powerForm.loginEnv[1] == 4 ? 1 : this.powerForm.loginEnv[1] == 6 ? 3 : 2,
            }
            this.isSubmitLoading = true;
            dobatchlogin(params).then(res => {
              this.isSubmitLoading = false;
              if (res.code != 0) return;
              this.congifModel = false;
              this.getCustomAccountList();
              successTips(this);
            })
          } else if (this.connfigType == 2) {
            let FriendsId = this.friendList.filter(item => {
              if (item.check) {
                return item
              }
            });
            let params = {
              group_id: this.powerForm.moveGroup,
              friend_ids: FriendsId.map(item => { return item.id }),
            }
            this.isSubmitLoading = true;
            dochatmovegroup(params).then(res => {
              this.isSubmitLoading = false;
              if (res.code != 0) return;
              this.checkFriends = [];
              this.congifModel = false;
              this.isShowBetch = false;
              this.check_friend_all = false;
              this.getCustomGroupList();
              for (let k = 0; k < this.friendList.length; k++) {
                let item = this.friendList[k];
                item.check = false;
                this.$set(this.friendList, k, item)
              }
              successTips(this);
            })
          } else if (this.connfigType == 3) {
            let params = {
              account: this.staffAccount,
              group_id: this.changeGroupId,
              ptype: this.powerForm.dataSource,
              data_pack_id: this.powerForm.powerData,
              phones: this.powerForm.powerData.split("\n"),
              up_num: Number(this.powerForm.addressNum),
            }
            this.changeGroupId == "" ? delete params.changeGroupId : "";
            this.powerForm.dataSource == 1 ? delete params.phones : delete params.data_pack_id;
            this.isSubmitLoading = true;
            dochatupbook(params).then(res => {
              this.isSubmitLoading = false;
              if (res.code != 0) return;
              this.congifModel = false;
              this.getCustomGroupList();
              this.initFriendList();
              successTips(this);
            })
          } else if (this.connfigType == 5) {
            this.isSubmitLoading = true;
            globalsetting({ customer_id: this.customer_id, receive_target: this.powerForm.receiveType }).then(res => {
              this.isSubmitLoading = false;
              if (res.code != 0) return;
              this.congifModel = false;
              this.getGlobalConfig();
              successTips(this);
            });
          } else if (this.connfigType == 99) {
            let params = {
              ptype: this.powerForm.updata_type,
              account: this.onlineAccount,
              image_url: this.powerForm.avatar_img,
              nick_name: this.powerForm.up_nick_name
            }
            this.powerForm.updata_type == 1 ? delete params.nick_name : delete params.image_url;
            if (!this.powerForm.avatar_img && !this.powerForm.up_nick_name) return;
            this.isSubmitLoading = true;
            dochataccountinfo(params).then(res => {
              this.isSubmitLoading = false;
              if (res.code != 0) return;
              this.congifModel = false;
              this.updateAccount(this.onlineAccount);
              successTips(this);
            });
          } else {
            let newObj = {
              msg_type: 6,
              send_account: this.friendInfo.account, //发送账号
              receive_account: this.friendInfo.friend_account, //接收账号
              msg_content: this.powerForm.account + '-' + this.powerForm.nick_name //发送内容
            }
            this.isSubmitLoading = true;
            sendmsg(newObj).then(res => {
              this.congifModel = false;
              this.isSubmitLoading = false;
              let {data:{sender,data_id}} = res;
              newObj = {...newObj,...this.baseMsg,sender:sender,data_id:data_id,head:this.staffInfo.head}
              this.newsDataList.push(newObj);
              this.scrollToBottom();
              this.friendNewContent(6)
              this.handleAsyncNews();
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    repeatSend(row) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t('sys_l013'),
        message: h('p', null, [h('span', null,`${this.$t('sys_q099')}:`), h('span', { style: 'color: #f56c6c' }, row.errmsg + '!!! '), h('span', null, this.$t('sys_g115'))]),
        showCancelButton: true,
        confirmButtonText: this.$t('sys_c024'),
        showCancelButton: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            // instance.confirmButtonText = '执行中...';
            let newObj = {
              msg_type: row.msg_type,
              send_account: row.send_account, //发送账号
              receive_account: row.receive_account, //接收账号
              msg_content: row.msg_content //发送内容
            }
            sendmsg(newObj).then(res => {
              if (res.code != 0) return;
              let {data:{sender,data_id}} = res;
              done();
              instance.confirmButtonLoading = false;
              newObj = {...newObj,...this.baseMsg,sender:sender,data_id:data_id,head:this.staffInfo.head}
              this.newsDataList.push(newObj);
              this.scrollToBottom();
              this.handleAsyncNews();
            });
          } else {
            done();
          }
        }
      }).then(action => {
        console.log(this.$t('sys_q100'));
      });
    },
    async checkIpIsUse(e) {
      let files = this.$refs.uploadclear.files[0];
      let formData = new FormData();
      formData.append('file', files);
      formData.append('ptype', this.ipForm.iptype[1]);
      checkfile(formData).then(res => {
        this.$refs.uploadclear.value = null;
        if (res.code != 0) return;
        this.stepsActive = 2,
        this.ipModelType = 2;
        this.errIpUrl = res.data.url;
        this.fail_number = res.data.fail_number;
        this.success_list = res.data.success_list;
        this.success_number = res.data.success_number;
      })
    },
    downLoadTemp() {
      var textContent = this.ipForm.iptype[1] == 1 ? "静态ip入库格式：ip地址:端口:代理账号:代理密码:代理类型socks5/http（此行需要删除）" : "动态ip入库格式：ip地址:端口:代理账号:代理密码:代理类型:国家（此行需要删除）";
      var blob = new Blob([textContent], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = this.ipForm.iptype[1] == 1 ? "example-import-static-ip.txt" : "example-import-dynamic-ip.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    },
    closeViewer() {
      this.imgModel = false;
    },
    cloneImgpreview(e) {
      if (e.target.getAttribute('class') === 'el-image-viewer__mask') {
        this.imgModel = false;
      }
    },
    viewImgHandle(url) {
      this.imgList = [];
      this.imgModel = true;
      this.$nextTick(() => {
        this.imgList.push(url)
      })
    },
    jumpWsBtn() {
      window.open("https://api.whatsapp.com/")
    },
    getGlobalConfig() {
      getglobalsetting({ customer_id: this.customer_id }).then(res => {
        let globalConfig = res.data;
        this.render_lang = globalConfig.send_target; //聊天框翻译类型 1-手动翻译 2-自动翻译
        this.trans_type = globalConfig.chat_translate; //聊天发送语言
        this.powerForm.receiveType = globalConfig.receive_target; //接收消息翻译语言
        this.global_config = globalConfig.is_auto_translate == 1 ? false : true; //1-否 2-是
      });
    },
    openRightMenu(event, row) {
      for (let k = 0; k < this.newsDataList.length; k++) {
        this.newsDataList[k].is_fanyi = false;
        if (this.newsDataList[k].id == row.id) {
          let item = this.newsDataList[k];
          item.is_fanyi = true
          this.$set(this.newsDataList, k, item)
        }
      }
    },
    countryHandle(val) {
      globalsetting({ customer_id: this.customer_id, send_target: val }).then(res => {
        if (res.code != 0) return;
        this.getGlobalConfig();
        successTips(this);
      });
      // localStorage.setItem("transCountry",val);
    },
    transHandle(val) {
      globalsetting({ customer_id: this.customer_id, chat_translate: val }).then(res => {
        if (res.code != 0) return;
        this.getGlobalConfig();
        successTips(this);
      });
      // localStorage.setItem("transType",val);
    },
    setAtuoTrans(type) {
      globalsetting({ customer_id: this.customer_id, is_auto_translate: type ? 2 : 1 }).then(res => {
        if (res.code != 0) return;
        this.getGlobalConfig();
        successTips(this);
      });
    },
    async menuCommand(command) {
      console.log("sssss");
    },
    correntRedBtn() {
      this.$refs.dropdown.$data.showPopper = !this.$refs.dropdown.$data.showPopper;
      MessageBox.confirm(this.$t('sys_c100'), this.$t('sys_l013'), {
        confirmButtonText: this.$t('sys_c024'),
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        correction({ staff_no: this.staff_no }).then(result => {
          if (result.code != 0) return;
          getchataccountcustomerlist({ staff_no: this.staff_no }).then(res => {
            this.staffAccountList = res.data.list || [];
            this.staffAccountList.unshift({});
            successTips(this)
          })
        });
      }).catch(() => {
        console.log(this.$t('sys_q100'));
      })
    },
    translateHandle() {
      translatetext({ text: this.send_text, target: this.render_lang }).then(res => {
        if (res.code != 0) return;
        this.send_text = res.data.translate_text;
      });
    },
    async changeItem(row, idx, lang) {
      for (let k = 0; k < this.newsDataList.length; k++) {
        if (this.newsDataList[k].msg_id == row.msg_id && this.newsDataList[k].id == row.id) {
          let item = this.newsDataList[k];
          if (idx == 0) {
            const res = await delmessage({msg_id: row.msg_id, data_id: row.data_id, send_account: row.send_account, receive_account: row.receive_account });
            if (res.code != 0) return;
            successTips(this);
            this.$nextTick(() => {
              this.newsDataList.splice(k, 1);
            })
          }
          if (idx == 1) {
            let params = {
              text: row.msg_content,
              send_msg_info_id: row.id,
              target: this.powerForm.receiveType
            }
            const res = await translatetext(params);
            if (res.code != 0) return;
            item.translate_text = res.data.translate_text;
          }
          if (idx == 2) {
            this.coapyAccount(row.msg_content);
          }
          item.is_fanyi = false;
          this.$set(this.newsDataList, k, item)
        }
      }
    },
    async coapyAccount(account) {
      let clipboard = navigator.clipboard || {
        writeText: (account) => {
          let copyInput = document.createElement('input');
          copyInput.value = account;
          document.body.appendChild(copyInput);
          copyInput.select();
          document.execCommand('copy');
          document.body.removeChild(copyInput);
        }
      }
      if (clipboard) {
        await clipboard.writeText(account);
        successTips(this, "",this.$t('sys_rai121'))
      }
    },

    hideEmoji(e) {
      if (e.target.className != 'emote_head' && e.target.className != 'emote_list') {
        this.isHideEmoji = false;
      }
      if (e.target.className != 'el-tooltip__popper') {
        for (let k = 0; k < this.newsDataList.length; k++) {
          let item = this.newsDataList[k];
          item.is_fanyi = false;
          this.$set(this.newsDataList, k, item)
        }
      }
    },
    filterOffine(array) {
      let accounts = [];
      let online = array.filter((item, idx) => { return idx != 0 && item.status != 2 })
      if (online.length > 0) {
        accounts = online.map(line => { return line.account })
      }
      return accounts;
    },
    onLineBtn() {
      if (this.filterOffine(this.staffAccountList).length == 0) return successTips(this, "error", this.$t('sys_c094'));
      MessageBox.confirm(this.$t('sys_c093'), this.$t('sys_l013'), {
        confirmButtonText: this.$t('sys_c024'),
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        dobatchfastlogin({ accounts: this.filterOffine(this.staffAccountList) }).then(res => {
          if (res.code != 0) return;
          successTips(this, "", this.$t('sys_c095'))
        })
      }).catch(() => {
        console.log(this.$t('sys_q100'));
      });
    },
    async getPowerInfo() {
      this.infoLoading = true;
      let { data } = await getfriendinfo({ account: this.friendInfo.account, friend_account: this.friendInfo.friend_account });
      this.fansForm.call_tag = data.friend_name || "";
      this.fansForm.power_sex = data.gender || 0;
      this.fansForm.power_province = data.province || "";
      this.fansForm.power_city = data.city || "";
      this.fansForm.power_remark = data.desc || "";
      let defGroup = this.beanGroupList.filter(item => { return item.id == data.group_id });
      if (defGroup.length > 0) {
        this.fansForm.group_id = data.group_id;
      }
      this.infoLoading = false;
    },
    async submitPowerBtn(idx, evl) {
      let params = { account: this.friendInfo.account, friend_account: this.friendInfo.friend_account }
      params.gender = Number(this.fansForm.power_sex)
      if (idx == 1) {
        params.friend_name = this.fansForm.call_tag;
        for (let k = 0; k < this.friendList.length; k++) {
          if (this.friendList[k].id === this.friendInfo.id) {
            let item = this.friendList[k];
            item.friend_name = this.fansForm.call_tag;
            this.$set(this.friendList, k, item);
          }
        }
      } else if (idx == 2) {
        params.gender = Number(this.fansForm.power_sex);
      } else if (idx == 3) {
        params.province = this.fansForm.power_province;
      } else if (idx == 4) {
        params.city = this.fansForm.power_city;
      } else if (idx == 5) {
        params.group_id = this.fansForm.group_id;
      } else if (idx == 6) {
        params.desc = this.fansForm.power_remark;
      }
      let res = await upfriendinfo(params);
      if (res.code != 0) return;
      if (idx == 5) {
        await this.getRefreshGroup()
        await this.initFriendList();
      }
      let groupIndex = this.beanGroupList.findIndex(item => { return item.id === this.fansForm.group_id });
      if (idx == 5 && groupIndex == 2 || this.changeGroupId) {
        this.newsDataList = [];
        this.friendAccount = "";
        for (let k = 0; k < this.friendList.length; k++) {
          if (this.friendList[k].friend_account === this.friendInfo.friend_account) {
            this.friendInfo = "";
            this.friendList.splice(k, 1);
            localStorage.removeItem("currentFriendAccount");
          }
        }
      }
      successTips(this, "", "修改成功");
    },
    tableCard(idx) {
      this.quickIdx=1;
      this.quick.name="";
      this.quick.seat_id=1;
      this.quickGroupList=[]; 
      this.quick.group_id="";
      this.quick.quick_idx="";
      this.scriptModel.total=0;
      this.scriptModel.group_id="";
      this.tableIdx = idx;
      if (this.tableIdx == 2 && this.friendAccount) {
        this.getBeanGroup();
      }else{
        this.getQuickGroup();
      }
    },
    quickCard(idx){
      this.quick.name="";
      this.quick.seat_id=1;
      this.quickGroupList=[]; 
      this.quick.group_id="";
      this.quick.quick_idx="";
      this.scriptModel.total=0;
      this.scriptModel.group_id="";
      if (idx == 1) {
        this.getQuickGroup();
      }else if(idx == 2){
        this.getCustomGroup();
      }
      this.quickIdx = idx;
    },
    quickGroupQuery(idx){
      if (idx == 1) {
        this.getQuickGroup();
      }else if(idx == 2){
        this.getCustomGroup();
      }
    },
    handleCurrentGroup(val){
      this.quick.page = val;
      if (this.quick.quick_idx == 1) {
        this.getQuickGroup();
      }else if(this.quick.quick_idx == 2){
        this.getCustomGroup();
      }
    },
    quickSourceQuery(){
      this.quick.quick_idx=this.quick.seat_id;
      this.selectContent(this.quick.seat_id);
    },
    selectContent(val) {
      this.quick.name = "";
      this.quickMaterialList = [];
      if (val == "") return;
      this.quickLoading = true;
      getmaterialgrouplist({ page:this.quick.page,limit:this.quick.limit,type:val,name:this.quick.name}).then(res => {
        this.quickLoading = false;
        this.quick.total = res.data.total;
        this.quickMaterialGroup = res.data.list || [];
      })
    },
    selectMaterGroup(val) {
      if (val == "") return;
      this.isMaterLoading = true;
      let params = { page:1,limit:50,type:this.quick.quick_idx,group_id: val}
      getmateriallist(params).then(res => {
        this.isMaterLoading = false;
        this.quickMaterialList = res.data.list || [];
        this.quickMaterialList.forEach(item=>{
          item.type=this.quick.quick_idx
        })
      })
    },
    async getQuickGroup() {
      this.loadingGroup = true;
      const { data } = await getspeechgrouplist({ page:this.scriptModel.page,limit:this.scriptModel.limit,name:this.quick.name});
      this.loadingGroup = false;
      this.scriptModel.total = data.total;
      this.quickGroupList = data.list.map(item=>{return{...item,popover:false,is_edit:false}}) || [];
    },
    
    selectQuickGroup(){
      if (this.quickIdx == 1) {
        this.getQuicklist()
      }else{
        this.getCustomlist()
      }
    },
    async getQuicklist(num) {
      this.scriptModel.page = num || this.scriptModel.page;
      const params = {
        page: 1,
        limit: 20,
        name: this.scriptModel.name,
        group_id: this.scriptModel.group_id
      }
      this.contentloading = true;
      let { data:{list} }= await getspeechlist(params);
      this.contentloading = false;
      this.quickDataList = list.map(item=>{return{...item,popover:false,is_edit:false}}) || [];
      // if (list.length > 0) {
      //   this.quickDataList = list[0].content.map(item=>{return {...item,title:list[0].name,id:list[0].id}});
      // }
    },
    handleMore(row,idx){
      let quickList = idx==1?this.quickGroupList:this.quickDataList;
      quickList.map(obj =>{
        obj.popover = false;
        obj.is_edit = false;
        if (obj.id == row.id) {
          return { ...obj,popover:true };
        }
        return obj;
      })
    },
    // 自定义话术
    async addGroup(row,idx){
      let params = { 
        ptype:idx,
        name:this.quick.g_name,
        customer_id:this.customer_id
      }
      idx==2?params.id=row.id:"";
      this.quick.c_g_loading=true;
      const res = await domyspeechgroup(params);
      if (res.code != 0) return;
      if (this.quickIdx == 2) {
        this.getCustomGroup();
      }
      this.quickGroupList.map(obj =>{
        obj.popover = false;
        obj.is_edit = false;
        if (obj.id == row.id) {
          obj.name = this.quick.g_name;
        }
        return obj;
      })
      this.quick.c_g_loading=false;
      this.quick.isPopover=false;
    },
    async getCustomGroup() {
      this.loadingGroup = true;
      const { data } = await getmyspeechgrouplist({ customer_id:this.customer_id,ptype:this.scriptModel.page,limit:this.scriptModel.limit,name:this.quick.name});
      this.loadingGroup = false;
      this.scriptModel.total = data.total;
      this.quickGroupList = data.list || [];
    },
    async getCustomlist(num) {
      this.scriptModel.page = num || this.scriptModel.page;
      const params = {
        page: 1,
        limit: 20,
        name: this.scriptModel.name,
        group_id: this.scriptModel.group_id
      }
      this.contentloading = true;
      let { data:{list} }= await getmyspeechlist(params);
      this.contentloading = false;
      this.quickDataList = list;
    },
    delCustonGroup(row,type){
      MessageBox.confirm(this.$t('sys_q011'), this.$t('sys_l013'), {
        confirmButtonText: this.$t('sys_c024'),
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        let reqApi = ["",domyspeechgroup,domyspeech];
        reqApi[type]({ptype: 3,del_id:[row.id]}).then(res => {
          if (res.code != 0) return;
          type==1?this.getCustomGroup():this.getCustomlist();
          successTips(this)
        })
      }).catch(() => {
        console.log(this.$t('sys_q100'));
      });
    },
    adddContent(row,type){
      this.scriptModel.group_id = "";
      this.addContentModel = true;
      this.quickTitle = this.$t(type==1?'sys_mat015':'sys_c027',{value:this.$t('sys_mat019')});
      if (type == 2) {
        this.quickForm.name=row.name;
        this.quickForm.edit_id=row.id;
        this.quickForm.c_group_id = row.group_id;
        this.quickForm.source_list = row.content;
      }else{
        this.$nextTick(() => {
          this.$refs.quickForm.resetFields();
          this.quickForm.name="";
          this.quickForm.edit_id="";
          this.quickForm.source_list=[];
        })
        this.quickForm.c_group_id = row.id;
      }
    },
    changeFile(){
      this.$refs.fileValue.click(); 
    },
    async uploadFile(){
      let imgSize = 1 * 1024 * 1024;
      let imgFormat = ["jpg", "jpeg", "gif", "png"];
      let files = this.$refs.fileValue.files[0];
      let fileSize = files.size / 1024 / 1024;
      let fileType = files.name.split(".").pop();
      if (this.quickForm.tabIdx == 2) {
        if (fileSize > 1 || imgFormat.indexOf(fileType) == -1) {
          this.$refs.fileValue.value = null;
          return successTips(this, "error",this.$t('sys_q012'));
        }
      } else if (this.quickForm.tabIdx == 3) {
        if (fileType != "mp3" || fileSize > 2.5) {
          this.$refs.fileValue.value = null;
          return successTips(this, "error",this.$t('sys_q013'));
        }
      } else if (this.quickForm.tabIdx == 4) {
        if (fileType != "mp4" || fileSize > 10) {
          this.$refs.fileValue.value = null;
          return successTips(this, "error",this.$t('sys_q014'));
        }
      }
      this.upLoading = true;
      let formData = new FormData();
      formData.append('file', files);
      const res = await materialFile(formData);
      this.upLoading = false;
      if (res.code !=0) return;
      const {data:{url}} = res;
      if (this.quickForm.tabIdx==2) {
        this.quickForm.imgSrc = url;
      }else if(this.quickForm.tabIdx==3){
        this.quickForm.audioSrc = url;
      }else if(this.quickForm.tabIdx==4){
        this.quickForm.videoSrc = url;
      }
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newObj = {
            type:Number(this.quickForm.tabIdx)
          }
          if (this.quickForm.editIndex !== "") {
            for (let k = 0; k < this.quickForm.source_list.length; k++) {
              if (k === this.quickForm.editIndex) {
                let item = this.quickForm.source_list[k];
                item.type=Number(this.quickForm.tabIdx);
                if (this.quickForm.tabIdx==1) {
                  item.content=this.quickForm.text;
                }else if(this.quickForm.tabIdx==2) {
                  item.content=this.quickForm.imgSrc;
                }else if(this.quickForm.tabIdx==3){
                  item.content=this.quickForm.audioSrc;
                }else if(this.quickForm.tabIdx==4){
                  item.content=this.quickForm.videoSrc;
                }
                this.$set(this.quickForm.source_list,k,item)
              }
            }
          }else{
            if (this.quickForm.tabIdx==1) {
              newObj.content=this.quickForm.text;
            }else if(this.quickForm.tabIdx==2) {
              newObj.content=this.quickForm.imgSrc;
            }else if(this.quickForm.tabIdx==3){
              newObj.content=this.quickForm.audioSrc;
            }else if(this.quickForm.tabIdx==4){
              newObj.content=this.quickForm.videoSrc;
            }
            this.quickForm.source_list.push(newObj);
          }
          this.sourceModel=false;
          this.$refs.quickForm.clearValidate('source_list');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleQuickBtn(row,idx,type){
      if (type == 1) {
        if (row.type==1) {
          this.quickForm.text=row.content;
        }else if(row.type==2) {
          this.quickForm.imgSrc=row.content;
        }else if(row.type==3){
          this.quickForm.audioSrc=row.content;
        }else if(row.type==4){
          this.quickForm.videoSrc=row.content;
        }
        this.quickForm.editIndex = idx;
        this.quickForm.tabIdx = String(row.type);
        this.sourceModel=true;
      }
      if (type==2) {
        for (let k = 0; k < this.quickForm.source_list.length; k++) {
          if (k === idx) {
            this.quickForm.source_list.splice(k,1)
          }
        }
      }
    },
    async copayUrl(url) {
      let clipboard = navigator.clipboard || { writeText: (account) => {
          let copyInput = document.createElement('input');
          copyInput.value = url;
          document.body.appendChild(copyInput);
          copyInput.select();
          document.execCommand('copy');
          document.body.removeChild(copyInput);
        }
      }
      if (clipboard) {
        await clipboard.writeText(url);
        successTips(this, "",this.$t('sys_rai121'))
      }
    },
    playAudio() {
      if (!this.quickForm.isAudioPlay) {
        this.quickForm.isAudioPlay = true
        this.$refs.myAudio.play();
      } else {
        this.quickForm.isAudioPlay = false
        this.$refs.myAudio.pause();
      }
    },
    playVideo(){
      if (!this.quickForm.isVideoPlay) {
        this.quickForm.isVideoPlay = true
        this.$refs.myVideo.play();
      } else {
        this.quickForm.isVideoPlay = false
        this.$refs.myVideo.pause();
      }
    },
    submitCustomBtn(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            name:this.quickForm.name,
            group_id:this.quickForm.c_group_id,
            content:this.quickForm.source_list,
            id:this.quickForm.edit_id
          }
          this.quickForm.edit_id==""? params.ptype=1:params.ptype=2;
          this.quickForm.edit_id==""? delete params.id:"";
          this.isCustomLoading=true;
          domyspeech(params).then(res=>{
            this.isCustomLoading=false;
            if (res.code != 0) return;
            this.addContentModel=false;
            successTips(this)
          })
        }
      });
    },
    async changeQuickBtn(row,send_type){
      if (!this.friendAccount) return  successTips(this,"error",this.$t('sys_q016'));
      let newObj = {
        msg_type: row.type,
        send_account: this.friendInfo.account, //发送账号
        receive_account: this.friendInfo.friend_account, //接收账号
      }
      if (send_type == 1) { //双击发送文本
        if (row.type == 1) {
          if (this.trans_type == 2) {
            const res = await translatetext({ text:row.content, target: this.render_lang });
            if (res.code != 0) return;
            const {data:{translate_text}} = res;
            newObj = {...newObj,translate_text:row.content,msg_content:translate_text}
          }else{
            newObj = {...newObj,msg_content:row.content}
          }
        }else{
          this.startPercent();
          newObj = {...newObj,msg_content:row.content}
        }
        const { data:{sender,data_id} } = await sendmsg(newObj);
        newObj = {...newObj,...this.baseMsg,sender:sender,data_id:data_id,head:this.staffInfo.head}
        this.newsDataList.push(newObj);
        await this.$nextTick();
        this.friendNewContent(row.type,"",newObj.msg_content);
      }else{ //批量发送
        newObj = {...newObj,speech_id:row.id,send_target:this.render_lang,chat_translate:this.trans_type}
        delete newObj.msg_type;
        this.startPercent();
        const { data:{list} } = await quicklysendmsg(newObj);
        for (let k = 0; k < list.length; k++) {
          const item = list[k];
          newObj = {
            ...newObj,
            ...this.baseMsg,
            sender:item.sender,
            data_id:item.data_id,
            msg_type:item.msg_type,
            head:this.staffInfo.head,
            msg_content:item.msg_content,
            translate_text:item.translate_text
          }
          this.newsDataList.push(newObj);
        }
        await this.$nextTick();
        const { translate_text } = list[list.length - 1];
        this.friendNewContent(1,"",translate_text);
      }
      this.scrollToBottom();
      this.handleAsyncNews();
    },
    beforeunloadHandler(){
      online({online:1}).then(res=>{});
      // const baseUrl = process.env.NODE_ENV=="production"?`${process.env.VUE_APP_BASE_PATH}:${process.env.VUE_APP_SERVER_PORT}`:"/api";
      // fetch(baseUrl+'/adminmember/online?token='+getToken(), {
      //   method: 'POST',
      //   body:JSON.stringify({online:1}),
      //   headers: {'Content-Type': 'text/plain'},
      //   keepalive: true
      // })
    },
    handleIsLoad(row){
      let isOk = false;
      if (this.storeNewsId.includes(row.data_id)) {
        isOk = true;
      }
      return isOk;
    },
    async handleRestLoad(row){
      let params = {
        key:row.key,
        url:row.url,
        data_id:row.data_id,
        msg_type:row.msg_type,
        send_account:row.send_account,
        receive_account:row.receive_account,
      }
      this.storeNewsId.push(row.data_id);
      const res = await messagedecrypt(params);
      if (res.code != 0) return;
      let {data:{content,data_id}} = res;
      for (let k = 0; k < this.newsDataList.length; k++) {
        if (this.storeNewsId.includes(this.newsDataList[k].data_id)) {
          let item = this.newsDataList[k];
          item.msg_content = content;
          this.$set(this.newsDataList,k,item);
        }
      }
      for (let h = 0; h < this.storeNewsId.length; h++) {
        if (this.storeNewsId[h] == data_id) {
          this.storeNewsId.splice(h,1)
        }
      }
    }
  },
  watch: {
    congifModel(val) {
      if (val == false) {
        this.materialList = [];
        this.powerForm.head = "";
        this.powerForm.updata_type = 1;
        this.powerForm.head_group = "";
      }
    },
    sourceModel(val) {
      if (val == false) {
        this.$refs.SquickForm.resetFields();
        this.quickForm.tabIdx = "1"
        this.quickForm.editIndex="";
        this.quickForm.text="";
        this.quickForm.imgSrc="";
        this.quickForm.audioSrc="";
        this.quickForm.videoSrc="";
      }
    },
    addContentModel(val) {
      if (val == false) {
        this.$refs.quickForm.resetFields();
        this.quickForm.source_list=[];
        this.quickForm.name="";
      }
    }
  },
  destroyed() {
    this.socket.close();
    clearInterval(this.groupTimeTsak);
    clearInterval(this.waitTimer);// 清除定时器
    clearTimeout(this.heartTimer);// 清除延时器
    localStorage.removeItem("currentGroupId");
    localStorage.removeItem("currentFriendIdx");
    localStorage.removeItem("currentServiceIdx");
    localStorage.removeItem("currentSeatsIdx");
    localStorage.removeItem("currentSeatAccount");
    localStorage.removeItem("currentFriendAccount");
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
  }
}
</script>

<style scoped lang="scss">
@import './chatRoom.scss';
@import '../content/add.scss';
</style>