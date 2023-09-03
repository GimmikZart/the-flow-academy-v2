<template>
  <div>
    <Button size="small" severity="success" rounded class="mx-3 h-full" @click="addInstanceDialog = true">
      <Icon name="mdi:add-bold" color="white" />
    </Button>
    <Dialog :visible="addInstanceDialog" modal header="Istanzia nuova attività" :style="{ width: '50vw', maxHeight: '70vh' }">
      <div class="grid grid-rows-10 grid-cols-4 gap-10 p-10">
        
        <span class="p-float-label p-input-icon-left col-start-1 col-end-3">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="newInstance.name" placeholder="Nome" class="w-full"></InputText>
          <label>Nome</label>
        </span>

        <span class="p-float-label col-start-3 col-end-5">
          <Dropdown v-model="newInstance.level" :options="levelList" placeholder="Livello" class="w-full" />
          <label for="birth_date">Livello</label>
        </span>
        
        <span class="p-float-label col-start-1 col-end-3">
          <MultiSelect v-model="newInstance.collaborators" :options="collaboratorsList" optionLabel="name" optionValue="id" placeholder="Seleziona collaboratori" class="w-full">
            <template #option="slotProps">
              <div class="flex items-center">
                <Avatar v-if="slotProps.option.avatar" :image="slotProps.option.avatar" class="mr-2" size="small" shape="circle" />
                <Avatar v-else :label="getInitials(slotProps.option.name, slotProps.option.surname)" class="mr-2" size="small" shape="circle" />
                <div>{{ slotProps.option.name }} {{ slotProps.option.surname }}</div>
              </div>
            </template>
          </MultiSelect>
          <label>Seleziona collaboratori</label>
        </span>

        <span class="p-float-label col-start-3 col-end-5">
          <MultiSelect v-model="newInstance.activities" :options="activitiesList" optionLabel="name" optionValue="id" placeholder="Seleziona sub-attività" class="w-full">
            
          </MultiSelect>
          <label>Seleziona sub-attività</label>
        </span>

        
      </div>
      <template #footer>
        <Button label="Chiudi" @click="addInstanceDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveNewInstance()" outlined />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
/* IMPORTS */
import ActivityInstance from '@/assets/entities/activityInstance.js';
import { useFiltersStore } from "@/store/pill"; const filtersStore = useFiltersStore(); const { newSuccessMessage, newErrorMessage } = filtersStore
/* SUPABASE */
const supabase = useSupabaseClient()
/* COMPOSABLES */
const { getInitials } = utility()

/* EMTIS */
const emit = defineEmits(['saved'])

/* DATA */
const newInstance = reactive(new ActivityInstance());
const collaboratorsList = ref();
const addInstanceDialog = ref(false)
const levelList = ref(['Principiante', 'Intermedio', 'Avanzato', 'Open'])
const activitiesList= ref([])

/* WATCH */
watch(addInstanceDialog, async () => {
  await getCollaborators()
  await getActivities()
})

/* METHODS */
async function saveNewInstance(){
  let p_instance = {
    name: newInstance.name,
    level: newInstance.level,
  }

  let p_collaborators = newInstance.collaborators
  let p_activities = newInstance.activities

  try {
    await supabase.rpc('create_activity_instance', {
      p_instance,
      p_collaborators,
      p_activities
    }).then((data, error) => {
      if(error) throw error 
    })
    newSuccessMessage(`${newInstance.name} è stata aggiunta al database`);
    newInstance.reset();
    addInstanceDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELL INSERIMENTO A DB DI ${newInstance.name} : ${error}`)
  }
}

async function getCollaborators(){
  try {
    let { data, error} = await supabase.from('collaborators').select('id, name, surname, avatar')
    if(error) throw error;
    collaboratorsList.value = data;
  } catch (error) {
    newErrorMessage(`ERRORE NELLO SCARICAMENTO DEI COLLABORATORI`)
  }
}

async function getActivities(){
  try {
    let { data, error} = await supabase.from('activities').select('id, name')
    if(error) throw error;
    console.log({data});
    activitiesList.value = data;
  } catch (error) {
    newErrorMessage(`ERRORE NELLO SCARICAMENTO DEI COLLABORATORI`)
  }
}
</script>

<style lang="scss" scoped>

</style>