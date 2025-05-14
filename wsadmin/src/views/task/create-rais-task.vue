<template>
    <div>
        <el-button size="small" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
            <span>{{$t('sys_q006')}}</span>
        </el-button>
    <div style="width: 100%; padding: 0 15%;margin-top: 30px;">
        <el-form size="small" :model="quickForm" :rules="quickRules" ref="quickForm" label-width="100px" class="demo-ruleForm">
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item :label="$t('sys_q116')" prop="reply_name">
                        <el-input clearable maxlength="50" show-word-limit v-model="quickForm.reply_name" :placeholder="$t('sys_mat021')" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item :label="$t('sys_q121')" prop="group_id">
                        <el-select v-model="quickForm.group_id" :placeholder="$t('sys_c052')">
                            <el-option v-for="item in accountGroupList" :key="item.id" :label="item.name+'(数量：'+item.count+'，在线：'+item.online_num+')'"  :value="item.group_id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item :label="$t('sys_q122')" prop="keep_group_id_b">
                        <el-select v-model="quickForm.keep_group_id_b" :placeholder="$t('sys_c052')">
                            <el-option v-for="item in accountGroupList" :key="item.id" :label="item.name+'(数量：'+item.count+'，在线：'+item.online_num+')'"  :value="item.group_id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item :label="$t('sys_g079')" prop="end_time" class="hide_text">
                        <el-date-picker v-model="quickForm.end_time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('sys_c052')" />
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item :label="$t('sys_q117')" prop="group_link">
                        <el-input type="textarea" clearable v-model="quickForm.group_link" :placeholder="$t('sys_mat061',{value:$t('sys_q117')})" rows="6" />
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item :label="$t('sys_rai091')" prop="ad_str">
                        <el-input type="textarea" clearable v-model="quickForm.ad_str" :placeholder="$t('sys_mat061',{value:$t('sys_rai091')})" rows="6" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item style="margin-top: 20px;">
                <el-button @click="$router.go(-1)">{{ $t('sys_c023') }}</el-button>
                <el-button type="primary" :loading="isLoading" @click="submitReply('quickForm')">{{ $t('sys_q120') }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>
<script>
import { successTips } from '@/utils/index'
import material from '../content/material.vue';
import { addkeeptask,getkeepgroup } from '@/api/task'
export default {
    components:{material},
    data() {
        return {
            id:"",
            group_id:"",
            source_id:"",
            isLoading:false,
            showSource:false,
            group_type:null,
            childMess:{
                check_len:0,
                check:true,
                is_show:1,
                type:0
            },
            draggedItemIndex:-1,
            accountGroupList:[],
            quickForm:{
                reply_name:"",
                group_id:"",
                group_link:"",
                ad_str:"",
                end_time:"",
                keep_group_id_b:"",
                source_list:[]
            }
        }
    },
    computed:{
        quickRules() {
            return {
                reply_name:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_q001')}), trigger: 'change' }],
                group_id:[{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_q121')}), trigger: 'change' }],
                keep_group_id_b:[{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_q122')}), trigger: 'change' }],
                group_link:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_q117')}), trigger: 'blure' }],
                ad_str:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_rai091')}), trigger: 'blure' }],
                end_time:[{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_g079')}), trigger: 'change' }],
                source_list:[{ type: 'array', required: true, message: this.$t('sys_c089',{value:this.$t('sys_q005')}), trigger: 'change' }],
            }
        },
        sourceOption() {
            return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092')]
        }
    },
    created(){
        this.keepGroupList();
    },
    methods:{
        dragStart(index) {
          this.draggedItemIndex = index;
        },
        async keepGroupList(){
            let {data:{list}} = await getkeepgroup();
            this.accountGroupList = list||[];
        },
        async submitReply(formName) {
            this.$refs[formName].validate(async(valid) => {
                if (valid) {
                    let params = {
                        name:this.quickForm.reply_name,
                        keep_group_id:this.quickForm.group_id,
                        group_url_str:this.quickForm.group_link,
                        ad_str:this.quickForm.ad_str,
                        keep_group_id_b:this.quickForm.keep_group_id_b,
                        end_time:this.$baseFun.resetTime(this.quickForm.end_time,3)
                    }
                    this.isLoading = true;
                    let res = await addkeeptask(params);
                    this.isLoading = false;
                    if (res.code !=0) return;
                    successTips(this);
                    this.$router.go(-1)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../content/add.scss';
</style>