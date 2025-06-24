<!-- 上传测试 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!--  新建 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun('add')">新建任务</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="addModal.title"
      :visible.sync="addModal.show"
      center
      width="600px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="文件名称" prop="task_name">
          <el-input v-model="addModal.formData.task_name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="上传视频" prop="fileList">
          <UploadFiles
            ref="uploader"
            :max-files="3"
            :max-size="100"
            @upload-complete="onUploadComplete"
          />
        </el-form-item>
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import UploadFiles from '@/components/UploadFiles/index'
import { deepClone } from '@/utils';

export default {
  name: 'FileList',
  components: {
    UploadFiles
  },
  data() {
    return {
      addModal: {
        show: false,
        title: '',
        type: 'add',
        formData: {
          task_name: '',
          fileList: []
        },
        cloneRow: {},
        rules: {
          task_name: [{ required: true, message: '请输入任务名称！', trigger: 'change' }],
        }
      },
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    // 新建
    addOpenFun(type) {
      this.addModal.title = '新建任务'
      this.addModal.type = type
      this.addModal.show = true
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      setTimeout(() => {
        this.addModal.formData = {
          amount: 19,
          material_group_id: '',
          material_group_name: '',
          link: '',
          task_config_i: ''
          // age: [],
          // gender: '1',
        }
        this.$refs.refAddModal.resetFields();
      }, 500);
    },
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          const formData = deepClone(this.addModal.formData)
          console.log('formData',formData)
        }
      })
    },
    onUploadComplete(file){
      console.log('上传结束',file)
    }
  }
}
</script>

<style lang="scss" scoped>
.addModalName {
  ::v-deep .el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

  }

  ::v-deep .el-form-item {
    width: 48%;
  }
}

.file_content {
  cursor: pointer;
  color: #0a76a4;
  text-decoration: underline;
  font-size: 25px;
}

.headerBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 18px;

  height: 35px;

  .queryBox {
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }

  .tools {

  }
}
</style>
