<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center justify-between">
      <TopBarLabel label="ATTIVITA APERTE"></TopBarLabel>
      <div class="flex h-full">
        <ActivityCategoryDialog></ActivityCategoryDialog>
        <ActivityDialog></ActivityDialog>
      </div>
      
      
    </section>

    <!-- CONTENT -->
    <section class="w-full flex-grow border-4 border-white rounded-flow overflow-hidden">
      <DataTable :value="activityInstanceList" tableStyle="min-width: 50rem">
        <Column field="name" header="Nome"></Column>
        <Column field="level" header="Livello"></Column>
        <Column field="activities" header="Sub-attività"></Column>
        <Column field="clients" header="Soci iscritti"></Column>
        <Column field="collaborators" header="Collaboratori attivi"></Column>
        <Column field="action" header="Azione">
          <template #body="slotProps">
            <Button text>
              <Icon name="carbon:user-profile" size="2rem" color="brown"></Icon>
            </Button>
          </template>
          
        </Column>
      </DataTable>
    </section>
  </nuxt-layout>
</template>

<script setup>
import { ref, onBeforeMount  } from 'vue';

const activityInstanceList = ref([]);


/* HOOKS */ 
onBeforeMount(async () => {

}) 

</script>

<style scoped></style>