<template>
  <Chip class="px-10 h-full bg-flow-brown text-white">
    <span class="font-bold">{{props.label}}</span>
  </Chip>
</template>

<script setup>
const props = defineProps(['label'])
</script>