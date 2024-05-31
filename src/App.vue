<template>
  <a-config-provider :theme="{
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }">
    <a-app class="ant-app">
      <div class="overview">
        <PokemonCard v-bind="card"
                    @click.native.stop="cardActive = !cardActive"
                    :active="cardActive" />
        <ImageUploader />
        <ImageCropUploader />
        <DeepChat />
      </div>
    </a-app>
  </a-config-provider>
</template>
<script setup>
import { ref } from 'vue'
import { theme, ConfigProvider as AConfigProvider, App as AApp } from 'ant-design-vue'
// import PokemonCard from './lib/components/PokemonCard'
// import ImageUploader from './lib/components/ImageUploader/index.vue'
import ImageCropUploader from './lib/components/ImageCropUploader/index.vue'
// import DeepChat from './lib/components/DeepChat/index.vue'

// import '../dist/style.css'
// import {
//   PokemonCard,
//   ImageUploader
// } from '../dist/index.js'

const cardActive = ref(false)

const isDark = ref(false)

const card = ref({
  id: "sm35-1",
  name: "Bulbasaur",
  supertype: "pokémon",
  subtypes: ["basic"],
  number: "1",
  rarity: "common",
  gallery: true,
  cardLoading: false,
  img: 'https://images.pokemontcg.io/sm35/1_hires.png'
})

</script>
<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
