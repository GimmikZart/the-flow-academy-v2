<template>
  <Tag :severity="color" rounded>
    <div class="flex items-center gap-2 px-2">
        <Icon :name="icon" color="white" size="1rem"></Icon>
        <span class="text-base">{{label}}</span>
    </div>
  </Tag>  
</template>

<script setup>
import { ref, onMounted, watch   } from 'vue';
const props = defineProps({
  statusValue: {
    type: Number,
    required: true
  }
})

const icon = ref('');
const color = ref('');
const label = ref('');

const setTag = () => {
  switch (props.statusValue) {
    case 0:
      icon.value = 'el:ok-circle'
      label.value = 'pagato'
      color.value = 'success'
      break;
    case 1:
      icon.value = 'material-symbols:error' 
      label.value = 'non pagato'
      color.value = 'danger'
      break;
    case 2:
      icon.value = 'maki:cross'
      label.value = 'inattivo'
      color.value = 'warning'
      break;
  }
}

watch(
  () => props.statusValue,
  () => {
    setTag()
  }
)

onMounted(() => {
  setTag()
})   
</script>
