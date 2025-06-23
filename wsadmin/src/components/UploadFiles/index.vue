<template>
  <div class="container">
    <div class="upload-container">
      <div
        class="upload-area"
        :class="{ 'dragover': isDragging }"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <div class="upload-icon">
          <i class="el-icon-upload" />
        </div>
        <div class="upload-text">拖放文件到此处或点击选择文件</div>
        <p class="upload-hint">支持{{ multiple?'多':'单' }}个文件上传，最大{{ maxFileSize }}MB</p>

        <input
          ref="fileInput"
          type="file"
          class="file-input"
          :multiple="multiple"
          @change="handleFileSelect"
        >
      </div>

      <div v-if="multiple">
        <div v-if="selectedFile">
          <div v-for="(item,index) in selectedFile" :key="index" class="file-info">
            已选择文件: <span class="file-name">{{ item.name }}</span>
            ({{ formatFileSize(item.size) }})
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="selectedFile" class="file-info">
          已选择文件: <span class="file-name">{{ selectedFile.name }}</span>
          ({{ formatFileSize(selectedFile.size) }})
        </div>
      </div>

      <div v-if="isUploading || uploadComplete" class="progress-container">
        <div class="progress-header">
          <span>上传进度</span>
          <span>{{ progress.toFixed(2) }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progress + '%' }"
          />
        </div>
        <div class="stats-container">
          <div class="stat-box">
            <div class="stat-label">已上传：</div>
            <div class="stat-value">{{ formatFileSize(uploadedSize) }}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">上传速度：</div>
            <div class="stat-value">{{ uploadSpeed }} MB/s</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">剩余时间：</div>
            <div class="stat-value">{{ estimatedTime }}</div>
          </div>
        </div>

        <div v-if="uploadComplete" class="success-message">
          <i class="fas fa-check-circle" /> 文件上传成功！
        </div>
      </div>

      <div class="buttons">
        <button
          class="btn btn-upload"
          :disabled="!selectedFile || isUploading || uploadComplete"
          @click="startUpload"
        >
          <i class="fas fa-upload" /> {{ uploadButtonText }}
        </button>

        <button
          class="btn btn-cancel"
          :disabled="!isUploading"
          @click="cancelUpload"
        >
          <i class="fas fa-times" /> 取消上传
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: 'UploadFiles',
  props: {
    maxFileSize: {
      default: 100,
      type: Number
    },
    multiple: {
      default: true,
      type: Boolean
    },
  },
  data() {
    return {
      selectedFile: null,
      isUploading: false,
      uploadComplete: false,
      isDragging: false,
      progress: 0,
      uploadedSize: 0,
      totalSize: 0,
      uploadSpeed: 0.0,
      lastUploaded: 0,
      lastTime: 0,
      xhr: null,
      estimatedTime: '计算中...'
    };
  },
  computed: {
    uploadButtonText() {
      if (this.uploadComplete) return '上传完成';
      if (this.isUploading) return '上传中...';
      return '开始上传';
    },

  },
  watch: {
    multiple: {
      handler(newVal, oldVal) {
        this.selectedFile = newVal ? [] : null
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 触发文件选择
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // 处理文件选择
    handleFileSelect(event) {
      console.log('event',event)
      const files = event.target.files;
      console.log('点击上传',files)
      if (files.length > 0) {
        this.resetUploadState();
        if (this.multiple) {
          let totalSize = 0
          this.selectedFile.push(files[0])
          this.selectedFile.forEach(item => {
            totalSize += item.size
          })
          this.totalSize = totalSize
        } else {
          this.selectedFile = files[0];
          this.totalSize = files[0].size;
        }
      }
    },

    // 处理拖放事件
    handleDragOver(event) {
      event.preventDefault();
      this.isDragging = true;
    },

    handleDragLeave() {
      this.isDragging = false;
    },
    // 拖拽上传
    handleDrop(event) {
      this.isDragging = false;
      const files = event.dataTransfer.files;
      console.log('拖拽上传',files)
      if (files.length > 0) {
        this.resetUploadState();
        this.selectedFile = files[0];
        this.totalSize = files[0].size;
      }
    },

    // 开始上传
    startUpload() {
      if (!this.selectedFile || this.isUploading) return;
      console.log('this.selectedFile',this.selectedFile)
      this.resetUploadState();
      this.isUploading = true;
      this.lastUploaded = 0;
      this.lastTime = Date.now();

      // 模拟上传过程（实际项目中应替换为真实API）
      const chunkSize = 1024 * 1024; // 1MB
      const totalChunks = Math.ceil(this.selectedFile.size / chunkSize);
      let currentChunk = 0;

      const uploadNextChunk = () => {
        if (!this.isUploading) return;

        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, this.selectedFile.size);

        // 模拟上传延迟
        setTimeout(() => {
          if (!this.isUploading) return;

          currentChunk++;
          this.uploadedSize = end;
          this.progress = Math.min(100, (this.uploadedSize / this.totalSize) * 100);

          // 计算上传速度
          const now = Date.now();
          const timeDiff = (now - this.lastTime) / 1000; // 秒
          const uploadedDiff = this.uploadedSize - this.lastUploaded;

          if (timeDiff > 0) {
            // 转换为MB/s
            this.uploadSpeed = (uploadedDiff / (1024 * 1024) / timeDiff).toFixed(2);

            // 计算剩余时间
            const remainingBytes = this.totalSize - this.uploadedSize;
            if (this.uploadSpeed > 0) {
              const remainingSeconds = remainingBytes / (this.uploadSpeed * 1024 * 1024);
              this.estimatedTime = this.formatTime(remainingSeconds);
            }
          }

          this.lastUploaded = this.uploadedSize;
          this.lastTime = now;

          if (currentChunk < totalChunks) {
            uploadNextChunk();
          } else {
            this.uploadComplete = true;
            this.isUploading = false;
          }
        }, 150); // 模拟网络延迟
      };

      uploadNextChunk();
    },

    // 取消上传
    cancelUpload() {
      this.isUploading = false;
      this.resetUploadState();
    },

    // 重置上传状态
    resetUploadState() {
      this.progress = 0;
      this.uploadedSize = 0;
      this.uploadSpeed = 0;
      this.uploadComplete = false;
      this.estimatedTime = '计算中...';
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // 格式化剩余时间
    formatTime(seconds) {
      if (seconds < 0) return '0秒';

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);

      if (minutes === 0) return `${remainingSeconds}秒`;
      return `${minutes}分${remainingSeconds}秒`;
    },
    // 关闭上传
    cancelUploadFile() {
      this.selectedFile = null
    this.cancelUpload()
    }
  }
}
</script>

<style scoped lang="scss">

.container {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  color: #000;
  border-radius: 10px;
  background: rgba(0, 168, 255, 0.2);
  overflow: hidden;
  .upload-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 15px;
  }

}

.upload-area {
  border: 3px dashed rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);

  .upload-icon {
    font-size: 32px;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.7);
  }

  .upload-text {
    font-size: 16px;
  }

  .upload-hint {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 5px;
  }
}

.upload-area:hover, .upload-area.dragover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
}

.file-input {
  display: none;
}

.progress-container {
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 10px;
  text-align: left;
  .progress-header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
  .progress-bar {
    height: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00c9ff, #92fe9d);
      border-radius: 10px;
      transition: width 0.3s ease;
      width: 0;
    }
  }
  .stats-container {
    display: flex;
    justify-content: space-between;
    .stat-box {
      display: flex;
      align-items: center;
      border-radius: 12px;
      text-align: center;
      .stat-label {
        font-size: 12px;
        opacity: 0.8;
      }
      .stat-value {
        font-size: 12px;
        font-weight: bold;
        color: #92fe9d;
      }
    }
  }
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-upload {
  background: linear-gradient(90deg, #00c9ff, #92fe9d);
  color: #1a1a2e;
  box-shadow: 0 5px 15px rgba(0, 201, 255, 0.4);
}

.btn-upload:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 201, 255, 0.6);
}

.btn-upload:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.file-info {
  margin-top: 5px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  font-size: 12px;
}

.file-name {
  font-weight: bold;
  color: #92fe9d;
  word-break: break-all;
}

.success-message {
  color: #92fe9d;
  font-size: 14px;
  font-weight: bold;
}

@media (max-width: 600px) {
  .upload-container {
    padding: 25px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2.2rem;
  }
}
</style>
