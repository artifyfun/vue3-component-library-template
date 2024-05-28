<template>
  <div class="image-crop-uploader">
    <div class="showcase" v-if="state.previewUrl" @click="onUploaderClick">
      <img :src="state.previewUrl" :alt="state.previewUrl" />
    </div>
    <div class="uploader-btn" v-else @click="onUploaderClick">
      <plus-outlined />
      <div style="margin-top: 8px">上传图片</div>
    </div>
    <ImageCropUploader
      v-model="state.showDialog"
      :url="action"
      :width="width"
      :height="height"
      :lang-ext="{ hint: '点击，或拖动图片至此处' }"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import ImageCropUploader from './ImageCropUploader.vue'

const emit = defineEmits(['uploadDone', 'update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
  },
  action: {
    type: String,
    default: '/workflows/api/upload/image?key=workflow_940_6e44e545',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 512,
  },
  height: {
    type: Number,
    default: 512,
  },
})

const state = reactive({
  showDialog: false,
  previewUrl: '',
})

const onUploaderClick = () => {
  if (!props.disabled) {
    state.showDialog = true
  }
}

const cropUploadSuccess = res => {
  state.previewUrl = res.url
  emit('uploadDone', res.name)
  emit('update:modelValue', res.name)
}

const cropUploadFail = err => {
  state.previewUrl = ''
  emit('update:modelValue')
}
</script>

<style lang="less">
.image-crop-uploader {
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
    &:hover {
      cursor: pointer;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .uploader-btn {
    width: 100%;
    text-align: center;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
