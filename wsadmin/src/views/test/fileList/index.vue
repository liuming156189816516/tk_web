<!-- 上传测试 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <input ref="fileInputRef" type="file">
    <el-button @click="uploadFile">开始上传文件</el-button>
    <el-progress
      :text-inside="true"
      :stroke-width="26"
      :percentage="percentage"
      style="width: 350px;border-radius: 13px"
    />

    <!--    <el-button @click="stopUpload">暂停上传</el-button>-->
    <!--    <el-button @click="countinueUpload">继续上传</el-button>-->

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
import { uploadSliceFileApi, mergeFragmentFileApi } from './api'
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
      // 进度条
      percentage: 0,
      // 已上传完成的分片索引
      index: -1,
      // 是否暂停上传
      isStop: false
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
        }
      })
    },
    onUploadComplete(file) {
    },

    /** ****************/
    // 停止上传
    stopUpload() {
      this.isStop = true
    },
    // 继续上传
    countinueUpload() {
      this.isStop = false
      this.uploadFileFromIndex(++this.index)
    },
    // 上传
    uploadFile() {
      this.uploadFileFromIndex(0)
    },

    // 从第几个分片开始上传（index从0开始算，index=0算作第一个分片）
    uploadFileFromIndex(index) {
      const _this = this

      const { files } = this.$refs['fileInputRef']
      const file = files[0]

      const chunkSize = 5 * 1024 * 1024 // 分片大小 5M
      const chunkTotalCount = Math.ceil(file.size / chunkSize) // 分片总数
      uploadSliceFile(index)

      // 上传指定索引的分片文件
      function uploadSliceFile(idx) {
        if (idx >= chunkTotalCount) {
          console.log('文件已上传完成...');
          return
        }

        // 分片开始位置
        const start = idx * chunkSize
        // 分片结束位置
        const end = (start + chunkSize) > file.size ? file.size : start + chunkSize
        // 对文件分片
        const sFile = new File([file.slice(start, end)], `${file.name}.${idx}`)
        const formData = new FormData()
        formData.append('file', sFile)
        formData.append('file_name', file.name)
        formData.append('index', idx)

        uploadSliceFileApi(formData).then(res => {
          if (res.msg === 'success') {
            if (idx === chunkTotalCount - 1) {
              // 已经上传完了最后一个分片
              console.log('上传完成');
              // 记录已完成的分片索引
              _this.index = idx
              _this.percentage = 100
              // 发送合并文件请求
              const mergeParams = {
                file_name: file.name,
                total: chunkTotalCount,
              }
              console.log('mergeParams',mergeParams)
              mergeFragmentFile(mergeParams)
            } else {
              // 上传完成指定索引的分片之后, 更新文件上传进度
              _this.percentage = parseFloat(((idx + 1) / chunkTotalCount * 100).toFixed(1))

              // 记录已完成的分片索引
              _this.index = idx

              if (!_this.isStop) {
                // 如果没有点击暂停的话, 再上传下一个索引的分片
                uploadSliceFile(++idx)
              }
            }
          }
        })
      }

      // 发送合并分片文件请求
      function mergeFragmentFile(params) {
        mergeFragmentFileApi(params).then(res => {
          console.log('合并成功');
        })
      }
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
