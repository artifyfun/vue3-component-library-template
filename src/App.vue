<template>
  <div class="overview">
    <PokemonCard v-bind="card"
                 @click.native.stop="cardActive = !cardActive"
                 :active="cardActive" />
    <ImageUploader :isDark="true" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import PokemonCard from './lib/components/PokemonCard/components/card.vue'
import ImageUploader from './lib/components/ImageUploader/index.vue'

// import '../dist/style.css'
// import {
//   PokemonCard,
//   ImageUploader
// } from '../dist/artifyfun-vue-components.js'

const cardActive = ref(false)

const card = ref({
  id: "sm35-1",
  name: "Bulbasaur",
  supertype: "pokémon",
  subtypes: ["basic"],
  number: "1",
  rarity: "common",
  gallery: true,
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
