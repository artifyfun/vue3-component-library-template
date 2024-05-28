<template>
  <deep-chat
    :initialMessages="initialMessages"
    :speechToText="{
      azure: { subscriptionKey, region }
    }"
  />
</template>

<script setup>
import hljs from 'highlight.js';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

import { reactive } from 'vue'
import 'deep-chat'

window.hljs = hljs;
window.SpeechSDK = sdk;

const props = defineProps({
  subscriptionKey: {
    type: String,
    default: '',
  },
  region: {
    type: String,
    default: '',
  },
  initialMessages: {
    type: Array,
    default: () => [],
  },
})
</script>


<style lang="less">

</style>