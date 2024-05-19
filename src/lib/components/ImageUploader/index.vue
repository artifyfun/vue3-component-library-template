<template>
  <div class="image-uploader">
    <a-config-provider
      :locale="zhCN"
      :theme="{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }"
    >
      <div class="showcase" v-if="showShowcase && maxCount === 1 && state.fileList[0]?.url">
        <img :src="state.fileList[0]?.url" :alt="state.fileList[0]?.name" />
      </div>
      <a-upload
        class="uploader"
        ref="uploaderRef"
        v-model:file-list="state.fileList"
        :action="action"
        :listType="listType"
        :accept="accept"
        :disabled="disabled"
        :maxCount="maxCount"
        :multiple="multiple"
        :showUploadList="showUploadList"
        @preview="handlePreview"
        @change="handleChange"
        @remove="handleRemove"
      >
        <div class="uploader-btn" v-if="state.fileList.length < maxCount">
          <plus-outlined />
          <div style="margin-top: 8px">上传图片</div>
        </div>
      </a-upload>
      <a-modal :open="state.previewVisible" :title="state.previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="state.previewImage" />
      </a-modal>
    </a-config-provider>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const emits = defineEmits(['uploadDone', 'update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
  action: {
    type: String,
    default: '/workflows/api/upload/image',
  },
  accept: {
    type: String,
    default: 'image/*',
  },
  listType: {
    type: String,
    default: 'text',
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showUploadList: {
    type: Boolean,
    default: true,
  },
  showShowcase: {
    type: Boolean,
    default: true,
  },
})

const uploaderRef = ref(null)

const state = reactive({
  showDialog: true,
  fileList: [],
  previewVisible: false,
  previewImage: '',
  previewTitle: '',
})

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const handleCancel = () => {
  state.previewVisible = false
  state.previewTitle = ''
}

const handleChange = ({ file, fileList }) => {
  state.fileList = fileList.map(file => {
    if (file.response) {
      file.url = file.response.url
    }
    return file
  })

  if (file.status === 'done') {
    emits('update:modelValue', file.response?.name)
    emits('uploadDone', file.response?.name)
  }
}

const handleRemove = () => {
  emits('update:modelValue')
}

const handlePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  state.previewImage = file.url || file.preview
  state.previewVisible = true
  state.previewTitle = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}
</script>

<style lang="less">
.image-uploader {
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .showcase {
    width: 100%;
    height: 1px;
    flex: 1;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .uploader {
    .uploader-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
}
</style>
