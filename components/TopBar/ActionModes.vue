<template>
  <SelectButton v-model="actionMode" :options="actionsList" optionLabel="name" aria-labelledby="multiple" @change="$emit('change-action-mode', actionMode )"/>
</template>

<script setup>
const emit = defineEmits(['change-action-mode'])
const actionMode = ref({ name: 'Incassa', value: 3 });
const actionsList = ref([
                { name: 'Edita', value: 1 },
                { name: 'Rimuovi', value: 2 },
                { name: 'Incassa', value: 3 }
            ]);
</script>