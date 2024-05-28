<template>
  <div class="image-crop-uploader">
    <div class="showcase" v-if="state.url">
      <img :src="state.url" :alt="state.url" />
      <div class="showcase-bottom">
        <div class="name">{{ state.name }}</div>
        <DeleteOutlined class="btn-delete" @click.stop="remove"/>
      </div>
    </div>
    <div class="uploader-btn" v-else @click="onUploaderClick">
      <plus-outlined />
      <div style="margin-top: 8px">上传图片</div>
    </div>
    <ImageCropUploader
      ref="imageCropUploaderRef"
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
import { reactive, ref } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
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
  url: '',
  name: '',
})

const imageCropUploaderRef = ref(null)

const onUploaderClick = () => {
  if (!props.disabled) {
    imageCropUploaderRef.value.open()
  }
}

const cropUploadSuccess = res => {
  state.url = res.url
  state.name = res.name
  emit('uploadDone', res.name)
  emit('update:modelValue', res.name)
}

const cropUploadFail = err => {
  state.url = ''
  emit('update:modelValue')
}

const remove = () => {
  state.url = ''
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

    img {
      width: 100%;
      height: calc(100% - 28px);
      object-fit: contain;
    }
    .showcase-bottom {
      width: 100%;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      .name {
        max-width: calc(100% - 16px);
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .btn-delete {
        margin-left: 8px;
        &:hover {
          cursor: pointer;
          color: red;
        }
      }
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
