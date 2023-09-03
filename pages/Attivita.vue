<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center justify-between">
      <TopBarLabel label="ATTIVITA APERTE"></TopBarLabel>
      <div class="flex h-full">
        <ActivityCategoryDialog @update="updatePage"></ActivityCategoryDialog>
        <ActivityDialog></ActivityDialog>
        <ActivityAddNewInstance @saved="getInstances"></ActivityAddNewInstance>
      </div>
      
      
    </section>

    <!-- CONTENT -->
    <section class="w-full flex-grow border-4 border-white rounded-flow overflow-hidden">
      <DataTable :value="activityInstanceList" tableStyle="min-width: 50rem">
        <Column field="name" header="Nome"></Column>
        <Column field="level" header="Livello"></Column>
        <Column field="activities" header="Sub-attività">
          <template #body="slotProps">
            <Chip v-for="(activity, idx) in slotProps.data.activities" :key="idx" :label="activity" class="ml-1"/>
          </template>
        </Column>
        <Column field="clients" header="Soci iscritti">
          <template #body="slotProps">
            <span v-if="!slotProps.data.clients">0</span>
          </template>
        </Column>
        <Column field="collaborators" header="Collaboratori attivi">
          <template #body="slotProps">
            <div v-for="(collaborator, idx) in slotProps.data.collaborators" :key="idx" class="flex m-1">
              <Avatar v-if="collaborator.avatar" :image="collaborator.avatar" class="mr-2" size="small" shape="circle" />
              <Avatar v-else :label="getInitials(collaborator.name, collaborator.surname)" class="mr-2" size="small" shape="circle" />
              <div>{{ collaborator.name }} {{ collaborator.surname }}</div>
            </div>
          </template>
        </Column>
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
import { useFiltersStore } from "@/store/pill";
/* SUPABASE */
const supabase = useSupabaseClient()
/* COMPOSABLES */
const { getInitials } = utility()
/* RESPONSE */
const filtersStore = useFiltersStore()
const { newErrorMessage } = filtersStore

const activityInstanceList = ref([]);

function updatePage()
{
  window.location.reload()
}

const getInstances =  async () => {
  try {
    await supabase.rpc('get_instances_data').then((data, error) => {
      if(error) throw error
      activityInstanceList.value = data.data
    })
  } catch (error) {
    newErrorMessage(`ERRORE NELLO SCARICAMENTO DELLE ATTIVITA' APERTE: ${error.message}`)
  }
  
}
/* HOOKS */ 
onBeforeMount(async () => {
  getInstances()
}) 

</script>

<style scoped></style>