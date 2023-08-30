<template>
  <div>
    <Button size="small" severity="success" rounded class="mx-3 h-full" @click="addActivityDialog = true">
      <Icon name="mdi:add-bold" color="white" />
    </Button>
    <Dialog :visible="addActivityDialog" modal header="Aggiungi Attività" :style="{ width: '50vw', maxHeight: '70vh' }">
      <div class="grid grid-rows-10 grid-cols-4 gap-6 p-2">
        

        <!-- <FileUploader  class="col-start-1 col-end-5"/> -->

        <span class="p-float-label p-input-icon-left col-start-1 col-end-3">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="newActivity.name" placeholder="Nome" class="w-full"></InputText>
          <label>Nome</label>
        </span>
        <span class="p-float-label col-start-3 col-end-5">
          <MultiSelect v-model="newActivity.collaborators" :options="collaboratorsList" optionLabel="name" placeholder="Seleziona collaboratori" class="w-full"/>
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
        <Button label="Chiudi" @click="addActivityDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveNewActivity()" outlined />
      </template>
    </Dialog>
  </div>
  
</template>

<script setup>
import { useFiltersStore } from "@/store/pill";
import Activity from '@/assets/entities/activity.js';
const emit = defineEmits(['saved'])
const { addActivity } = setActivitiesApi() // auto-imported
const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore

const newActivity = reactive(new Activity());
const addActivityDialog = ref(false)

async function saveNewActivity(){
  let newActivityname = `${newActivity.name} ${newActivity.surname}`
  try {
    await addActivity(newActivity);
    newSuccessMessage(`${newActivityname} è stato aggiunto al database`);
    newActivity.reset();
    addActivityDialog.value = false
    emit('saved')
    
    
  } catch (error) {
    newErrorMessage(`ERRORE NELL INSERIMENTO A DB DI ${newActivityname} : ${error}`)
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