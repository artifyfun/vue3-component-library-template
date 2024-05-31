<template>
  <a-config-provider
    :theme="{
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }"
  >
    <a-app class="ant-app">
      <div class="overview">
        <a-divider>ImageUploader</a-divider>
        <ImageUploader />
        <a-divider>DeepChat</a-divider>
        <DeepChat />
        <a-divider>ImageCropUploader</a-divider>
        <ImageCropUploader />
        <a-divider>PokemonCard</a-divider>
        <PokemonCard v-bind="card" @click.native.stop="cardActive = !cardActive" :active="cardActive" />

        <a-float-button-group shape="square" :style="{ right: '24px' }">
          <a-float-button @click="toggleDark()">
            <template #icon>
              <BulbOutlined />
            </template>
          </a-float-button>
          <a-float-button @click="refresh">
            <template #icon>
              <SyncOutlined />
            </template>
          </a-float-button>
          <a-back-top :visibility-height="0" />
        </a-float-button-group>
      </div>
    </a-app>
  </a-config-provider>
</template>
<script setup>
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { BulbOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { theme, ConfigProvider as AConfigProvider, App as AApp, Divider as ADivider, FloatButtonGroup as AFloatButtonGroup, FloatButton as AFloatButton, BackTop as ABackTop } from 'ant-design-vue'

import PokemonCard from './lib/components/PokemonCard'
import ImageUploader from './lib/components/ImageUploader/index.vue'
import ImageCropUploader from './lib/components/ImageCropUploader/index.vue'
import DeepChat from './lib/components/DeepChat/index.vue'

// import '../dist/style.css'
// import {
//   PokemonCard,
//   ImageUploader,
//   ImageCropUploader,
//   // DeepChat
// } from '../dist/index.js'

const cardActive = ref(false)

const isDark = useDark({
  selector: 'html',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggleDark = useToggle(isDark)

const card = ref({
  id: 'sm35-1',
  name: 'Bulbasaur',
  supertype: 'pokémon',
  subtypes: ['basic'],
  number: '1',
  rarity: 'common',
  gallery: true,
  cardLoading: false,
  img: 'https://images.pokemontcg.io/sm35/1_hires.png',
})

const refresh = () => {
  window.location.reload()
}
</script>
<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>
