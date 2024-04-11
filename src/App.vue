<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LabelInit, { type LabelType } from './utils/label';

onMounted(() => {
  init()
})

const label = ref<LabelInit>()
const init = () => {
  label.value = new LabelInit({
    id: 'demo',
    url: '/example.png'
  })
}

const setLabelType = (type: LabelType) => {
  label.value?.setLabelType(type)
}
const list: LabelType[] = ['point', 'rect', 'polygon', 'circle']
</script>

<template>
  <canvas id="demo" width="1280" height="720"></canvas>
  <div class="mt-4">
    <button @click="setLabelType(item)" v-for="item in list" :key="item">{{ item }}</button>
  </div>
</template>

<style scoped lang="less">
.mt-4 {
  margin-top: 16px;

  button+button {
    margin-left: 20px;
  }
}
</style>
