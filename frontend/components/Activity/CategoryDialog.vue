<template>
  <div>
    <Button size="small" severity="info" rounded class="mx-3 h-full" @click="activityCategoriesDialog = true">
      <Icon name="carbon:ibm-secure-infrastructure-on-vpc-for-regulated-industries" size="1rem" color="white"></Icon>
      <span class="ml-3">Categorie</span>
    </Button>
    <Dialog :visible="activityCategoriesDialog" modal :style="{ width: '30vw', maxHeight: '60vh' }" :showHeader="false">
      <div class="p-6 flex justify-between h-fit">
        <h2 class="text-xl font-bold">Categorie attività</h2>
      </div>
      <div class="p-6">
        <div class="flex items-center mb-3">
          <InputText v-model="newActivityCategory.name" placeholder="Nuova categoria delle attività" class="flex-grow"></InputText>
          <Button text @click="saveNewActivityCategory()">
            <Icon name="material-symbols:save-sharp" color="green" size="2rem"></Icon>
          </Button>
        </div>

        <DataTable :value="activityCategoriesList" class="p-datatable-sm">
          <Column field="name" header="Nome"></Column>
          <Column field="action" header="Azione">
            <template #body="slotProps">
              <Button size="1rem" severity="warning" class="p-1" rounded text @click="removeActivityCategory(slotProps.data)">
                <Icon name="material-symbols:delete" size="2rem" color="red" />
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
import { usePillNotify } from "@/store/pill";
import { ref, onBeforeMount  } from 'vue';
import ActivityCategory from '@/assets/entities/activityCategory.js';
/* SUPABASE */
const supabase = useSupabaseClient()
/* EMTIS */
const emit = defineEmits(['update'])
/* RESPONSE */
const pillNotify = usePillNotify()
const { newSuccessMessage, newErrorMessage } = pillNotify

/* DATA */
const activityCategoriesDialog = ref(false)
const activityCategoriesList = ref([])
const newActivityCategory = ref(new ActivityCategory())

/* METHODS */
const loadActivityCategoryList = async () => {
  try {
    let { data, error} = await supabase.from('categories').select('*')
    activityCategoriesList.value = data;
    if(error) throw error
  } catch (error) {
    newErrorMessage(`ERRORE NELLO SCARICAMENTO DATI CATEGORIE ATTIVITA: ${error.message}`)
  }
  
}

const saveNewActivityCategory = async () => {
  try {
    let { error } = await supabase.from("categories").insert(newActivityCategory.value);
    if(error) throw error
    newSuccessMessage(`La categoria '${newActivityCategory.value.name}' è stata aggiunta al database`);
    emit('update')
  } catch (error) {
    newErrorMessage(`ERRORE NELL INSERIMENTO A DB DELLA CATEGORIA '${newActivityCategory.value}': ${error.message}`)
  } finally {
    await loadActivityCategoryList()
    newActivityCategory.value.reset()
  }
  
}

const removeActivityCategory = async (activityCategoryToRemove) => {
  try {
    await supabase.from('categories')
                        .delete()
                        .eq('id', activityCategoryToRemove.id);
    newSuccessMessage(`La categoria '${activityCategoryToRemove.name}' è stata rimossa dal database`);
    emit('update')
  } catch (error) {
    newErrorMessage(`ERRORE NELLA RIMOZIONE A DB DELLA CATEGORIA '${activityCategoryToRemove.name}': ${error}`)
  } finally {
    await loadActivityCategoryList()
  }
  
}
/* HOOKS */ 
onBeforeMount(async () => {
  loadActivityCategoryList()
}) 

</script>

<style scoped>


</style>