<template>
  <div class="container">
    <div
      :class="{ 'dragover': isDragging }"
      class="upload-area"
      @click="triggerFileInput"
      @dragleave="handleDragLeave"
      @dragover.prevent="handleDragOver"
      @drop.prevent="handleDrop"
    >
      <div class="upload-icon">
        <i class="fas fa-cloud-upload-alt" />
      </div>
      <div class="upload-text">拖放文件到此处或点击选择文件</div>
      <p class="upload-hint">最多可上传 {{ maxFiles }} 个文件，每个文件最大 {{ formatFileSize(maxSize * 1024 * 1024) }}</p>
      <input
        ref="fileInput"
        class="file-input"
        multiple
        type="file"
        @change="handleFileSelect"
      >
    </div>

    <div v-if="files.length > 0" class="upload-container">
      <div v-for="(file, index) in files" :key="file.id+'_'+index" class="file-item">
        <div class="file-header">
          <div class="file-name">
            <i class="fas fa-file-alt" /> {{ file.name }}
          </div>
          <div class="file-size">
            {{ formatFileSize(file.size) }}
          </div>
          <div :class="statusClass(file)" class="file-status">
            <i :class="statusIcon(file)" class="status-icon" />
            {{ statusText(file) }}
          </div>
        </div>

        <div v-if="file.status !== 'pending' && file.progress !==100" class="progress-container">
          <div class="progress-header">
            <span>上传进度</span>
            <span>{{ file.progress.toFixed(2) }}%</span>
          </div>
          <div class="progress-bar">
            <div
              :style="{ width: file.progress + '%' }"
              class="progress-fill"
            />
          </div>

          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-label">已上传</div>
              <div class="stat-value">{{ formatFileSize(file.uploaded) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">上传速度</div>
              <div class="stat-value">{{ file.speed.toFixed(2) }} MB/s</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">剩余时间</div>
              <div class="stat-value">{{ file.remaining }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="files.length > 0" class="overall-progress">
      <div class="overall-header">
        <span>整体上传进度</span>
        <span>{{ overallProgress }}%</span>
      </div>
      <div class="overall-bar">
        <div
          :style="{ width: overallProgress + '%' }"
          class="overall-fill"
        />
      </div>
    </div>

    <div class="buttons">
      <button
        :disabled="!hasFilesToUpload || isUploading"
        class="btn btn-upload"
        @click="startUpload"
      >
        <i class="fas fa-upload" /> {{ uploadButtonText }}
      </button>

      <button
        :disabled="!isUploading"
        class="btn btn-cancel"
        @click="cancelUpload"
      >
        <i class="fas fa-times" /> 取消上传
      </button>

      <button
        :disabled="isUploading"
        class="btn btn-reset"
        @click="resetUploader"
      >
        <i class="fas fa-redo" /> 重置
      </button>
    </div>
  </div>
</template>

<script>
import { uploadFileApi } from '@/api/common.js'
export default {
  name: 'UploadFiles2',
  props: {
    // 最大文件数量
    maxFiles: {
      type: Number,
      default: 5
    },
    // 单个文件最大大小（字节）
    maxSize: {
      type: Number,
      default: 100 // 100MB
    }
  },
  data() {
    return {
      files: [],
      isDragging: false,
      isUploading: false,
      nextFileId: 1
    };
  },
  computed: {
    // 是否有文件可以上传
    hasFilesToUpload() {
      return this.files.some(file => file.status === 'pending');
    },

    // 上传按钮文本
    uploadButtonText() {
      if (this.isUploading) return '上传中...';
      return '开始上传';
    },

    // 整体进度
    overallProgress() {
      if (this.files.length === 0) return 0;

      const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
      const uploadedSize = this.files.reduce((sum, file) => sum + file.uploaded, 0);

      return Math.round((uploadedSize / totalSize) * 100);
    }
  },
  methods: {
    // 触发文件选择
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // 处理文件选择
    handleFileSelect(event) {
      this.addFiles(event.target.files);
      event.target.value = ''; // 重置input
    },

    // 处理拖放事件
    handleDragOver(event) {
      event.preventDefault();
      this.isDragging = true;
    },

    handleDragLeave() {
      this.isDragging = false;
    },
    // 拖拽
    handleDrop(event) {
      this.isDragging = false;
      this.addFiles(event.dataTransfer.files);
    },

    // 添加文件到上传列表
    addFiles(fileList) {
      if (!fileList || fileList.length === 0) return;

      // 转换为数组并过滤
      const files = Array.from(fileList)
        .filter(file => file.size <= this.maxSize * 1024 * 1024)
        .slice(0, this.maxFiles - this.files.length);

      // 添加文件到列表
      files.forEach(file => {
        this.files.push({
          id: this.nextFileId++,
          name: file.name,
          size: file.size,
          file: file,
          status: 'pending', // pending, uploading, completed, error
          progress: 0,
          uploaded: 0,
          speed: 0,
          remaining: '计算中...',
          lastUploaded: 0,
          lastTime: 0,
          xhr: null
        });
      });
    },

    // 开始上传
    startUpload() {
      if (this.isUploading || !this.hasFilesToUpload) return;

      this.isUploading = true;

      // 开始上传所有状态为pending的文件
      this.files
        .filter(file => file.status === 'pending')
        .forEach(file => {
          console.log('开始上传', file)
          this.uploadFile(file);
        });
    },

    // 上传单个文件
    uploadFile(file) {
      file.status = 'uploading';
      file.lastUploaded = 0;
      file.lastTime = Date.now();

      const formData = new FormData();
      formData.append('file', file.file);
      console.log('接口参数调用',formData)
      uploadFileApi(formData).then(res => {
        file.resData = res.data
        const chunkSize = 1024 * 1024; // 1MB
        const totalChunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const uploadNextChunk = () => {
          if (file.status !== 'uploading') return;
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, file.size);

          if (file.status !== 'uploading') return;

          currentChunk++;
          file.uploaded = end;
          file.progress = Math.min(100, (file.uploaded / file.size) * 100);

          // 计算上传速度
          const now = Date.now();
          const timeDiff = (now - file.lastTime) / 1000; // 秒
          const uploadedDiff = file.uploaded - file.lastUploaded;

          if (timeDiff > 0) {
            // 转换为MB/s
            file.speed = uploadedDiff / (1024 * 1024) / timeDiff;

            // 计算剩余时间
            const remainingBytes = file.size - file.uploaded;
            if (file.speed > 0) {
              const remainingSeconds = remainingBytes / (file.speed * 1024 * 1024);
              file.remaining = this.formatTime(remainingSeconds);
            }
          }

          file.lastUploaded = file.uploaded;
          file.lastTime = now;

          if (currentChunk < totalChunks) {
            uploadNextChunk();
          } else {
            file.status = 'completed';
            this.checkUploadComplete();
          }
        };
        uploadNextChunk();
      })
    },

    // 检查所有文件是否上传完成
    checkUploadComplete() {
      const allCompleted = this.files.every(file =>
        file.status === 'completed' || file.status === 'error'
      );

      if (allCompleted) {
        this.isUploading = false;
        this.$emit('upload-complete', this.files);
      }
    },

    // 取消上传
    cancelUpload() {
      this.isUploading = false;

      // 取消所有正在上传的文件
      this.files.forEach(file => {
        if (file.status === 'uploading') {
          file.status = 'error';
          file.remaining = '已取消';
        }
      });
    },

    // 重置上传器
    resetUploader() {
      this.files = [];
      this.isUploading = false;
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

    // 文件状态文本
    statusText(file) {
      switch (file.status) {
        case 'pending':
          return '等待上传';
        case 'uploading':
          return '上传中';
        case 'completed':
          return '已完成';
        case 'error':
          return '已取消';
        default:
          return '';
      }
    },

    // 文件状态图标
    statusIcon(file) {
      switch (file.status) {
        case 'pending':
          return 'fa-clock';
        case 'uploading':
          return 'fa-sync fa-spin';
        case 'completed':
          return 'fa-check-circle';
        case 'error':
          return 'fa-times-circle';
        default:
          return '';
      }
    },

    // 文件状态样式
    statusClass(file) {
      switch (file.status) {
        case 'pending':
          return 'status-pending';
        case 'uploading':
          return 'status-uploading';
        case 'completed':
          return 'status-completed';
        case 'error':
          return 'status-error';
        default:
          return '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  color: #000;
  padding: 10px;
  border-radius: 10px;
  background: rgba(0, 168, 255, 0.2);
  overflow: hidden;

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

  .upload-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    margin-top: 10px;

    .file-item {
      padding: 5px;

      .file-header {
        background: rgba(0, 0, 0, 0.15);
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 5px;
        padding: 0 5px;

      }
    }
  }

  .overall-progress {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    padding: 5px;
    margin-top: 12px;
    text-align: left;

    .overall-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 14px;
      height: 26px;
      line-height: 26px;
    }

    .overall-bar {
      height: 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      overflow: hidden;

      .overall-fill {
        height: 100%;
        background: linear-gradient(90deg, #00c9ff, #92fe9d);
        border-radius: 6px;
        transition: width 0.3s ease;
        width: 0%;
      }
    }

  }

}

.file-input {
  display: none;
}

.progress-container {
  margin-top: 10px;
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
    align-items: center;

    .stat-item {
      display: flex;
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
    padding: 10px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2.2rem;
  }
}
</style>
