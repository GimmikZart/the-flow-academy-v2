<template>
  <div>
    <Button size="small" severity="success" rounded class="mx-3 h-full" @click="addActivityDialog = true">
      <Icon name="mdi:add-bold" color="white" />
    </Button>
    <Dialog :visible="addActivityDialog" modal header="Aggiungi Attività" :style="{ width: '50vw', maxHeight: '70vh' }">
      <div class="grid grid-rows-10 grid-cols-4 gap-6 p-2">
        

        <!-- <FileUploader  class="col-start-1 col-end-5"/> -->

        <FileUpload ref="fileInput" mode="basic" name="demo[]" url="./upload.php" accept="image/*" :maxFileSize="1000000" customUpload  />

        <span class="p-float-label p-input-icon-left col-start-1 col-end-3">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="newActivity.name" placeholder="Nome" class="w-full"></InputText>
          <label>Nome</label>
        </span>
        <span class="p-float-label col-start-3 col-end-5">
          <MultiSelect v-model="newActivity.collaborators" :options="collaboratorsList" optionLabel="name" optionValue="id" placeholder="Seleziona collaboratori" class="w-full">
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
          <Dropdown v-model="newActivity.category" :options="categoriesList" optionLabel="name" placeholder="Categoria" class="w-full" />
          <label for="birth_date">Categoria</label>
        </span>
        <div class="flex items-center col-start-2 col-end-3">
          <ColorPicker v-model="newActivity.color" inputId="cp-hex" format="hex" defaultColor="EFF3F8" class="h-full"/>
          <span class="p-float-label w-full">
            <InputText v-model="newActivity.color" placeholder="Colore" class="w-full"></InputText>
            <label for="birth_date">Colore</label>
          </span>
        </div>

        <span class="flex items-center border border-input-light-gray p-2 col-start-1">
          <Checkbox v-model="newActivity.intern" :binary="true" class="mr-2"></Checkbox>
          <label for="birth_date" class="mr-2">Interno</label>
          <Icon name="ant-design:eye-invisible-outlined" size="20px"></Icon>
        </span>

        <span class="p-float-label p-input-icon-left col-start-1 col-end-5">
          <Icon name="radix-icons:avatar" size="20px"></Icon>
          <Textarea v-model="newActivity.avatar" placeholder="Interno" class="w-full"></Textarea>
          <label for="birth_date">Descrizione</label>
        </span>
      </div>
      <template #footer>
        <Button @click="test()">test</Button>
        <Button label="Chiudi" @click="addActivityDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveNewActivity()" outlined />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
/* IMPORTS */
import Activity from '@/assets/entities/activity.js';
import { useFiltersStore } from "@/store/pill"; const filtersStore = useFiltersStore(); const { newSuccessMessage, newErrorMessage } = filtersStore
/* SUPABASE */
const supabase = useSupabaseClient()
/* COMPOSABLES */
const { getInitials } = utility()

/* EMTIS */
const emit = defineEmits(['saved'])

/* DATA */
const newActivity = reactive(new Activity());
const categoriesList = ref();
const collaboratorsList = ref();
const addActivityDialog = ref(false)
const fileInput = ref(null)

/* WATCH */
watch(addActivityDialog, async () => {
  await getCategories()
  await getCollaborators()
})

/* METHODS */
async function saveNewActivity(){
  let activityItem = {
    name: newActivity.name,
    category_id: newActivity.category.id,
    color: newActivity.color,
    description: newActivity.description,
    image: newActivity.image,
    intern: newActivity.intern
  }

  
  try {
    let { data, error } = await supabase.from("activities").insert(activityItem).select('id').single();
    if(error) throw error
    newActivity.collaborators.map(async (collaborator) => {
      let { error } = await supabase.from("activity_collaborator").insert({
        activity_id: data.id,
        collaborator_id: collaborator
      })
      if(error) {
        let { errorNested } = await supabase
                        .from('activities')
                        .delete()
                        .eq('id', data.id);
        if(errorNested) throw errorNested
        throw error
      } 
    });
    newSuccessMessage(`${newActivity.name} è stata aggiunta al database`);
    newActivity.reset();
    addActivityDialog.value = false
    emit('saved')
  } catch (error) {
    console.log(error.message);
    newErrorMessage(`ERRORE NELL INSERIMENTO A DB DI ${newActivity.name} : ${error}`)
  }
}

async function getCategories(){
  try {
    let { data, error} = await supabase.from('categories').select('*')
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