<template>
  <div>
    <Button size="1rem" severity="warning" rounded text @click="removingActivityDialog = true">
      <Icon name="material-symbols:delete" size="2rem" color="red" />
    </Button>
    <Dialog :visible="removingActivityDialog" modal :header='`Rimuovi ${activityToRemove.name}`' :style="{ width: 'auto' }">
      <h3>Disattiva: "rimuove" l'attività dalla lista di attività attive, ma mantiene i dati.</h3>
      <h3>Cancellare: elimina totalmente l'attività dal database (l'operazione è irrevocabile)</h3>
      <template #footer>
        <Button label="Annulla" @click="removingActivityDialog = false" outlined />
        <Button label="Disattiva" severity="warning" @click="disable()" />
        <Button label="Cancella" severity="danger" @click="remove()" />
      </template>
    </Dialog>
  </div>
  
</template>

<script setup>
import { useFiltersStore } from "@/store/pill";
import { defineProps } from 'vue'
/* SUPABASE */
const supabase = useSupabaseClient()
/* PROPS */
const props = defineProps(['activityToRemove'])
/* EMITS */
const emit = defineEmits(['saved'])
/* COMPOSABLES */
const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore
/* DATA */
const removingActivityDialog = ref(false)

async function remove(){
  let editingActivityname = `${props.activityToRemove.name}`
  try {
    let { error } = await supabase
                        .from('activities')
                        .delete()
                        .eq('id', props.activityToRemove.id);
    if(error) throw error
    newSuccessMessage(`L'attività ${editingActivityname} è stata rimossa dal database (operazione irrevocabile)`);
    removingActivityDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELLA RIMOZIONE A DB DI ${editingActivityname} : ${error.message}`)
  }
}

async function disable(){
  let editingActivityname = `${props.activityToRemove.name}`
  try {
    
    let p_activity_id = props.activityToRemove.id;
    await supabase.rpc('deactivate_activity', {
      p_activity_id
    }).then((data, error) => {
      if(error) throw error;
    })
    newSuccessMessage(`L'attività ${editingActivityname} è stata correttamente disabilitata (i dati rimarranno salvati)`);
    removingActivityDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELLA DISATTIVAZIONE A DB DI ${editingActivityname} : ${error.message}`)
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