<template>
  <div>
    <Button size="1rem" severity="warning" rounded text @click="editingActivityDialog = true">
      <Icon name="material-symbols:edit" size="2rem" color="orange" />
    </Button>
    <Dialog :visible="editingActivityDialog" modal header="Modifica Attività" :style="{ width: '50vw', maxHeight: '70vh' }">
      <div class="grid grid-rows-10 grid-cols-4 gap-6 p-2">
        

        <!-- <FileUploader  class="col-start-1 col-end-5"/> -->

        <FileUpload ref="fileInput" mode="basic" name="demo[]" url="./upload.php" accept="image/*" :maxFileSize="1000000" customUpload />

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
          <Dropdown v-model="editingActivity.value.category_id" :options="categoriesList" optionLabel="name" optionValue="id" modelValue="category"  placeholder="Categoria" class="w-full" />
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
        <Button label="Chiudi" @click="editingActivityDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveEditingActivity()" outlined />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { usePillNotify } from "@/store/pill";
import Activity from '@/assets/entities/activity.js';
import { defineProps, watch } from 'vue'
/* SUPABASE */
  const supabase = useSupabaseClient()
/* PROPS */
  const props = defineProps(['activityId'])
/* EMITS */
  const emit = defineEmits(['saved'])
/* COMPOSABLES */
  const pillNotify = usePillNotify()
  const { newSuccessMessage, newErrorMessage } = pillNotify
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
  try {

    /* UPDATE ACTIVITY INFOS */
    let activityItem = {
      name: editingActivity.value.name,
      category_id: editingActivity.value.category_id,
      color: editingActivity.value.color,
      description: editingActivity.value.description,
      image: editingActivity.value.image,
      intern: editingActivity.value.intern,
      status: editingActivity.value.collaborators.length > 0 ? true : false
    }
  
    await supabase.from('activities').update(activityItem).eq('id', props.activityId).then((data, error) => {
      if(error) throw error
    }) 

    /* UPDATE COLLABORATORS RELATION */
    let p_activity_id = props.activityId
    let p_collaborator_ids = editingActivity.value.collaborators
    await supabase.rpc('update_activity_collaborators', {
                                          p_activity_id, 
                                          p_collaborator_ids
                                        }).then((data, error) => {
                                          if(error) throw error;
                                        })
    

    newSuccessMessage(`L'attività ${editingActivity.value.name} è stata modificata nel database`);
    editingActivityDialog.value = false
    emit('saved') 
  } catch (error) {
    newErrorMessage(`ERRORE NELLA MODIFICA A DB DI ${editingActivity.value.name} : ${error.message}`)
  }
}

async function getActivity(){
  try {
    let p_activity_id = props.activityId;
    await supabase.rpc("get_activity_for_edit", {
      p_activity_id
    }).single().then((data, error) => {
      if(error) throw error
      editingActivity.value = data.data
    });
  } catch (error) {
    newErrorMessage(`ERRORE NELLO SCARICAMENTO DELL'ATTIVITA: ${error.message}`)
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