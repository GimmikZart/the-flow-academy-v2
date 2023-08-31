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
          <ActivityAddNewActivity class="h-full"></ActivityAddNewActivity>
        </div>
      </div>
      <div class="p-6">
        <DataTable :value="activitiesList">
          <Column field="image" header="Immagine"></Column>
          <Column field="name" header="Nome"></Column>
          <Column field="category" header="Categoria"></Column>
          <Column field="collaborators" header="Collaboratori disponibili"></Column>
          <Column field="instances" header="Attivo in"></Column>
          <Column field="color" header="Colore"></Column>
          <Column field="intern" header="Interno"></Column>
          <Column field="action" header="Azione">
            <template #body="slotProps">
              <Button size="1rem" v-if="actionMode == 1" rounded text @click="editActivity(slotProps.data)">
                <Icon name="material-symbols:edit" size="2rem" color="orange" />
              </Button>
              <Button size="1rem" v-if="actionMode == 2" rounded text @click="removeActivityCategory(slotProps.data)">
                <Icon name="material-symbols:delete" size="2rem" color="red" />
              </Button>
              <Button size="1rem" v-if="actionMode == 4" rounded text @click="removeActivityCategory(slotProps.data)">
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
import { useFiltersStore } from "@/store/pill";
import { ref, onBeforeMount  } from 'vue';
import Activity from '@/assets/entities/activity.js';

const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore


const activityCategoriesDialog = ref(false)
const activitiesList = ref([])
const newActivity = ref(new Activity())
const actionMode = ref(3);

const loadActivityList = async () => {
  try {
  } catch (error) {
    console.log(error);
    newErrorMessage(`ERRORE NELLO SCARICAMENTO DATI CATEGORIE ATTIVITA: ${error}`)
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