<template>
  <div class="container">
    zip文件上传分片
    视频沿用原上传
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

  },
  methods: {

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
