<template>
  <div>
    <Button size="1rem" severity="warning" rounded text @click="editingActivityDialog = true">
      <Icon name="material-symbols:edit" size="2rem" color="orange" />
    </Button>
    <Dialog :visible="editingActivityDialog" modal header="Aggiungi Attività" :style="{ width: '50vw', maxHeight: '70vh' }">
      <div class="grid grid-rows-10 grid-cols-4 gap-6 p-2">
        

        <!-- <FileUploader  class="col-start-1 col-end-5"/> -->

        <FileUpload ref="fileInput" mode="basic" name="demo[]" url="./upload.php" accept="image/*" :maxFileSize="1000000" customUpload @uploader="firestoreUpload" />

        <span class="p-float-label p-input-icon-left col-start-1 col-end-3">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="editingActivity.value.name" placeholder="Nome" class="w-full"></InputText>
          <label>Nome</label>
        </span>
        <span class="p-float-label col-start-3 col-end-5">
          <MultiSelect v-model="editingActivity.value.collaborators" :options="collaboratorsList" optionLabel="name" optionValue="id" modelValue="id" placeholder="Seleziona collaboratori" class="w-full">
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

        <span class="p-float-label col-start-1 col-end-2">
          <Dropdown v-model="editingActivity.value.category" :options="categoriesList" optionLabel="name" placeholder="Categoria" class="w-full" />
          <label for="birth_date">Categoria</label>
        </span>
        <div class="flex items-center col-start-2 col-end-3">
          <ColorPicker v-model="editingActivity.value.color" inputId="cp-hex" format="hex" defaultColor="EFF3F8" class="h-full"/>
          <span class="p-float-label w-full">
            <InputText v-model="editingActivity.value.color" placeholder="Colore" class="w-full"></InputText>
            <label for="birth_date">Colore</label>
          </span>
        </div>

        <span class="flex items-center border border-input-light-gray p-2 col-start-1">
          <Checkbox v-model="editingActivity.value.intern" :binary="true" class="mr-2"></Checkbox>
          <label for="birth_date" class="mr-2">Interno</label>
          <Icon name="ant-design:eye-invisible-outlined" size="20px"></Icon>
        </span>

        <span class="p-float-label p-input-icon-left col-start-1 col-end-5">
          <Icon name="radix-icons:avatar" size="20px"></Icon>
          <Textarea v-model="editingActivity.value.avatar" placeholder="Interno" class="w-full"></Textarea>
          <label for="birth_date">Descrizione</label>
        </span>
      </div>
      <template #footer>
        <Button @click="test()">test</Button>
        <Button label="Chiudi" @click="editingActivityDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveEditingActivity()" outlined />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useFiltersStore } from "@/store/pill";
import Activity from '@/assets/entities/activity.js';
import { defineProps, watch } from 'vue'
/* SUPABASE */
  const supabase = useSupabaseClient()
/* PROPS */
  const props = defineProps(['activityId'])
/* EMITS */
  const emit = defineEmits(['saved'])
/* COMPOSABLES */
  const filtersStore = useFiltersStore()
  const { newSuccessMessage, newErrorMessage } = filtersStore
  const { getInitials } = utility()
/* DATA */
  const editingActivityDialog = ref(false)
  const editingActivity = reactive({value: new Activity()})
  const categoriesList = ref() 
  const collaboratorsList = ref()
/* WATCH */
watch(editingActivityDialog, async () => {
  await getActivity()
  await getCategories()
  await getCollaborators()
})

/* METHODS */
async function saveEditingActivity(){
  console.log({editingActivity});
  try {
    let activityItem = {
      name: editingActivity.name,
      category_id: editingActivity.category_id,
      color: editingActivity.color,
      description: editingActivity.description,
      image: editingActivity.image,
      intern: editingActivity.intern
    }
    let { error } =  await supabase.from('activities').update(activityItem).eq('id', props.activityId)
    if(error) throw error
    /* RIMUOVO TUTTE LE RIGHE IN ACTIVITY_COLLABORATOR DOVE L'ACTIVITY_ID == A QUESTA ACTIVITY */
    {
      console.log('TROIA', editingActivity.value.id);
      let { error } = await supabase
                          .from('activity_collaborator')
                          .delete()
                          .eq('activity_id', editingActivity.value.id);
      if(error) throw error
    }
    /* REINSERISCO TUTTI GLI INSEGNANTI LEGATI A QUESTA ATTIVITA' */
    editingActivity.value.collaborators.map(async (collaborator) => {
      let { error } = await supabase.from("activity_collaborator").insert({
        activity_id: editingActivity.value.id,
        collaborator_id: collaborator
      })
      if(error) {
        newErrorMessage(`ERRORE, CANCELLO ATTIVITA' PER EVITARE DANNI MAGGIORI`)
        let { error } = await supabase
                        .from('activities')
                        .delete()
                        .eq('id', editingActivity.value.id);
        if(error) throw error
        throw error
      } 
    });
    newSuccessMessage(`L'attività ${editingActivity.value.name} è stata modificata nel database`);
    editingActivityDialog.value = false
    emit('saved') 
  } catch (error) {
    console.log({error});
    newErrorMessage(`ERRORE NELLA MODIFICA A DB DI ${editingActivity.value.name} : ${error.message}`)
  }
}

async function getActivity(){
  try {
    let { data, error} = await supabase.from('activities').select('*, categories(name)').eq('id', props.activityId).single()
    let activity = data
    if(error) throw error
    {
      /* CATEGORY */
      activity.category = null
      let { data , error} = await supabase.from('categories').select('id, name').eq('id', activity.category_id).single()
      if(error) throw error
      activity.category = data
    }
    {
      /* COLLABORATORI */
      activity.collaborators = []
      let { data , error} = await supabase.from('activity_collaborator').select('collaborators(*)').eq('activity_id', activity.id)
      if(error) throw error
      data.forEach(collaborator => {
        activity.collaborators.push(collaborator.collaborators.id)
      });
    }
    {
      /* ISTANZE */
      let { data, error } = await supabase.from('instance_activities').select('instances(*)').eq('activity_id', activity.id)
      if(error) throw error
      activity.instances = data.length
    }
    
    editingActivity.value = data
  } catch (error) {
    newErrorMessage(`ERRORE NELLO SCARICAMENTO DATI CATEGORIE ATTIVITA: ${error.message}`)
  }
}

async function getCategories(){
  try {
    let { data, error} = await supabase.from('categories').select('id, name')
    if(error) throw error;
    categoriesList.value = data;
  } catch (error) {
    newErrorMessage(`ERRORE NELLO SCARICAMENTO DELLE CATEGORIE`)
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


</script>

<style lang="scss" scoped>

:deep(.p-colorpicker){
  .p-colorpicker-preview.p-inputtext{
    height: 100%;
    border-radius: 1rem 0 0 1rem;
  }

}
</style>