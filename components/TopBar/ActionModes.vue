<template>
  <SelectButton v-model="actionMode" :options="actionsList" optionLabel="name" @change="$emit('change-action-mode', actionMode )"/>
</template>

<script setup>
const emit = defineEmits(['change-action-mode'])
/* PROPS */
const props = defineProps(['entity'])

const actionMode = ref({ name: 'Visita', value: 4 });
const clientsActionsList = ref([
  { name: 'Edita', value: 1 },
  { name: 'Rimuovi', value: 2 },
  { name: 'Incassa', value: 3 },
  { name: 'Visita', value: 4}
]);
const collaboratorsActionsList = ref([
  { name: 'Edita', value: 1 },
  { name: 'Rimuovi', value: 2 },
  { name: 'Paga', value: 3 },
  { name: 'Visita', value: 4}
]);
const activityActionsList = ref([
  { name: 'Edita', value: 1 },
  { name: 'Rimuovi', value: 2 },
  { name: 'Visita', value: 4}
]);

const actionsList = computed(() => {
  switch (props.entity) {
    case 'clients':
      return clientsActionsList.value;
    case 'collaborators':
      return collaboratorsActionsList.value;
    case 'activity':
      return activityActionsList.value;
  }
})
</script>