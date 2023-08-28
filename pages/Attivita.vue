<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center justify-between">
      <TopBarLabel label="ATTIVITA"></TopBarLabel>
        <Button size="small" severity="info" rounded class="mx-3 h-full">
          <Icon name="carbon:ibm-secure-infrastructure-on-vpc-for-regulated-industries" size="1rem" color="white"></Icon>
          <span class="ml-3">Categorie</span>
        </Button>
      
    </section>

    <!-- CONTENT -->
    <section class="w-full flex-grow border-4 border-white rounded-flow overflow-hidden">
      <DataTable :value="activityInstanceList" tableStyle="min-width: 50rem">
        <Column field="name" header="Nome"></Column>
        <Column field="level" header="Livello"></Column>
        <Column field="activities" header="Sub-attività"></Column>
        <Column field="clients" header="Soci iscritti"></Column>
        <Column field="collaborators" header="Collaboratori attivi"></Column>
      </DataTable>
    </section>
  </nuxt-layout>
</template>

<script setup>
import { ref, onBeforeMount  } from 'vue';
const { getActivityInstanceList } = getActivityInstanceApi() // auto-imported

const activityInstanceList = ref([]);

const loadActivityInstanceList = async () => {
  activityInstanceList.value = await getActivityInstanceList();
  console.log(activityInstanceList.value);
}

/* HOOKS */ 
onBeforeMount(async () => {
  loadActivityInstanceList()
}) 

</script>

<style scoped></style>