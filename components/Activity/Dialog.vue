<template>
  <div>
    <Button size="small" severity="info" rounded class="mx-3 h-full" @click="activityCategoriesDialog = true">
      <Icon name="icon-park-outline:sport" size="1rem" color="white"></Icon>
      <span class="ml-3">Attività</span>
    </Button>
    <Dialog :visible="activityCategoriesDialog" modal :style="{ width: '60vw', maxHeight: '70vh', minHeight: '400px' }" :showHeader="false">
      <div class="p-6 flex justify-between h-fit">
        <h2 class="text-xl font-bold">Lista Attività</h2>
        <div class="flex items-center">
          <TopBarActionModes entity="activity" @change-action-mode="(newMode) => actionMode = newMode.value"></TopBarActionModes>
          <ActivityAddNewActivity class="h-full" @saved="loadActivityList()"></ActivityAddNewActivity>
        </div>
      </div>
      <div class="p-6">
        <DataTable :key="test" :value="activitiesList">
          <Column field="image" header="Immagine"></Column>
          <Column field="name" header="Nome" class="font-bold"></Column>
          <Column field="category" header="Categoria"></Column>
          <Column field="collaborators" header="Collaboratori disponibili"></Column>
          <Column field="instances" header="Attivo in"></Column>
          <Column field="color" header="Colore">
            <template #body="slotProps">
              <ColorPicker v-model="slotProps.data.color" disabled></ColorPicker>
            </template>
          </Column>
          <Column field="intern" header="Visibile">
            <template #body="slotProps">
              <Icon v-if="slotProps.data.intern" name="humbleicons:eye-close" size="2rem"></Icon>
              <Icon v-else name="radix-icons:eye-open" size="2rem"></Icon>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <Icon v-if="slotProps.data.status" name="pajamas:status-active" size="1rem" color="green"></Icon>
              <Icon v-else name="pajamas:status-active" size="1rem" color="red"></Icon>
            </template>
          </Column>
          <Column field="action" header="Azione">
            <template #body="slotProps">
              <ActivityEditActivity v-if="actionMode == 1" :activityId="slotProps.data.id" @saved="loadActivityList()"></ActivityEditActivity>
              <ActivityRemoveActivity v-if="actionMode == 2" :activityToRemove="slotProps.data" @saved="loadActivityList()"></ActivityRemoveActivity>
              <Button size="1rem" v-if="actionMode == 4" rounded text>
                <Icon name="mdi:eye" size="2rem" color="brown" />
              </Button>
            </template>
          </Column>
        </DataTable>
      </div>
      <template #footer>
        <Button label="Chiudi" @click="activityCategoriesDialog = false" outlined />
      </template>
      
    </Dialog>
  </div>  
  
</template>

<script setup>
/* SUPABASE */
const supabase = useSupabaseClient()
/* IMPORTS */
import { useFiltersStore } from "@/store/pill";
import { ref, onBeforeMount  } from 'vue';
import Activity from '@/assets/entities/activity.js';
/* RESPONSE */
const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore


/* DATA */
const activityCategoriesDialog = ref(false)
const activitiesList = ref()
const newActivity = ref(new Activity())
const actionMode = ref(3);

/* METHODS */
const loadActivityList = async () => {
  try {
    await supabase.rpc('get_activities').then((data, error) => {
      if(error) throw error
      activitiesList.value = data.data
    });
  } catch (error) {
    newErrorMessage(`ERRORE NELLO SCARICAMENTO DATI CATEGORIE ATTIVITA: ${error.message}`)
  }
}

const saveNewActivity = async () => {
  try {
    newSuccessMessage(`La categoria '${newActivityCategory.value.name}' è stata aggiunta al database`);
  } catch (error) {
    newErrorMessage(`ERRORE NELL INSERIMENTO A DB DELLA CATEGORIA '${newActivityCategory.value}': ${error}`)
  } finally {
    await loadActivityCategoryList()
    newActivityCategory.value.reset()
  }
  
}

const removeActivityCategory = async (activityCategoryToRemove) => {
  try {
    newSuccessMessage(`La categoria '${activityCategoryToRemove.name}' è stata rimossa dal database`);
  } catch (error) {
    newErrorMessage(`ERRORE NELLA RIMOZIONE A DB DELLA CATEGORIA '${activityCategoryToRemove.name}': ${error}`)
  } finally {
    await loadActivityCategoryList()
  }
  
}
/* HOOKS */ 
onBeforeMount(async () => {
  loadActivityList()
}) 

</script>

<style scoped>


</style>