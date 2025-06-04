<template>
  <div class="taskConfig">
    <div class="content">
      <el-card>
        <el-form ref="refAddModal" :model="formData" :rules="rules" label-width="90px" size="small">
          <el-form-item label="年龄:" prop="age">
            <el-checkbox-group v-model="formData.age">
              <el-checkbox label="1" name="age">13-17</el-checkbox>
              <el-checkbox label="2" name="age">18-24</el-checkbox>
              <el-checkbox label="3" name="age">25-34</el-checkbox>
              <el-checkbox label="4" name="age">35-44</el-checkbox>
              <el-checkbox label="5" name="age">45-54</el-checkbox>
              <el-checkbox label="6" name="age">55+</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="性别:" prop="gender">
            <el-radio-group v-model="formData.gender">
              <el-radio label="1">全部</el-radio>
              <el-radio label="2">男</el-radio>
              <el-radio label="3">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="流量类型:" prop="traffic_type">
            <el-radio-group v-model="formData.traffic_type">
              <el-radio label="1">便宜</el-radio>
              <el-radio label="2">贵</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
            <el-button :loading="isLoading" type="primary" @click="editTaskConfigFun">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getTaskConfigApi ,editTaskConfigApi } from './api'
import { deepClone } from '@/utils';

export default {
  name: 'TaskConfig',
  data() {
    return {
      configData: {},
      formData: {
        age: [],
        gender: '1',
        traffic_type: '',
      },
      rules: {
        age: [{ type: 'array', required: true, message: '请至少选择一个年龄段' }],
        gender: [{ required: true, message: '请选择性别！', trigger: 'change' }],
        traffic_type: [{ required: true, message: '请选择性别！', trigger: 'change' }],
      },
      isLoading: false,

    }
  },
  mounted() {
    this.getTaskConfigFun()
  },
  methods: {
    getTaskConfigFun() {
        getTaskConfigApi({}).then(res => {
          if (res.msg === 'success') {
            this.$refs.refAddModal.resetFields(); // 先清空
            this.formData.age = res.data.age ? res.data.age : []
            this.formData.gender = res.data.gender ? String(res.data.gender) : '1'
            this.formData.traffic_type = res.data.traffic_type ? String(res.data.traffic_type) : ''
          }
        })
    },
    // 新建保存
    editTaskConfigFun() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.isLoading = true
          const formData = deepClone(this.formData)
          formData.gender = Number(this.formData.gender)
          formData.traffic_type = Number(this.formData.traffic_type)
          editTaskConfigApi(formData).then(res => {
            if (res.msg === 'success') {
              this.isLoading = false
              this.getTaskConfigFun()
            } else {
              this.isLoading = false
            }
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.taskConfig {
  width: 100%;
  height: 100%;
  float: left;
  position: relative;

}

.content {
  border: rgba(0, 0, 0, 0.1);
  background: #FFFFFF;
}

</style>
