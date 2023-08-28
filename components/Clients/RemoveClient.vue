<template>
  <div>
    <Button size="1rem" severity="warning" rounded text @click="editingClientDialog = true">
      <Icon name="material-symbols:edit" size="2rem" color="orange" />
    </Button>
    <Dialog :visible="editingClientDialog" modal header="Aggiungi Socio" :style="{ width: '50vw' }">
      <template #footer>
        <Button label="Chiudi" @click="editingClientDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveEditingClient()" outlined />
      </template>
    </Dialog>
  </div>
  
</template>

<script setup>
import { useFiltersStore } from "@/store/pill";
/* PROPS */
const props = defineProps(['editingClient'])
/* EMITS */
const emit = defineEmits(['saved'])
/* COMPOSABLES */
const { editClient } = setClientsApi() // auto-imported
const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore
const { formatDate} = utility()
/* DATA */
const editingClientDialog = ref(false)

async function saveEditingClient(){
  let editingClientname = `${props.editingClient.name} ${props.editingClient.surname}`
  try {
    await editClient(props.editingClient);
    newSuccessMessage(`${editingClientname} è stato modificato nel database`);
    editingClientDialog.value = false
    emit('saved')
  } catch (error) {
    console.log({error});
    newErrorMessage(`ERRORE NELLA MODIFICA A DB DI ${editingClientname} : ${error}`)
  }
}
</script>

<style lang="scss" scoped>

#toggleGender.p-togglebutton.p-button{
  background: rgba(255, 192, 203, 0.5);
  color: red;
  box-shadow: 0 0 0 0.2rem rgba(255, 0, 0, 0.1);
  border-color: pink;
}

#toggleGender.p-togglebutton.p-button.p-highlight {
  background: rgba(0, 0, 255, 0.3);
  color: blue;
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 255, 0.1);
  border-color: blue;
}
</style>