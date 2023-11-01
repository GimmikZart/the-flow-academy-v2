<template>
  <div>
    <Button size="1rem" severity="warning" rounded text @click="removingClientDialog = true">
      <Icon name="material-symbols:delete" size="2rem" color="red" />
    </Button>
    <Dialog :visible="removingClientDialog" modal :header='`Rimuovi ${clientToRemove.name} ${clientToRemove.surname}`' :style="{ width: 'auto' }">
      <h3>Disiscrivere: "rimuove" il socio dalla lista dei soci attivi, ma mantiene i dati.</h3>
      <h3>Cancellare: elimina totalmente il socio dal database (l'operazione è irrevocabile)</h3>
      <template #footer>
        <Button label="Annulla" @click="removingClientDialog = false" outlined />
        <Button v-if="clientToRemove.status != 2" label="Disiscrivi" severity="warning" @click="unsubscribe()" />
        <Button v-else label="Riattiva" severity="success" @click="reactivate()" />
        <Button label="Cancella" severity="danger" @click="remove()" />
      </template>
    </Dialog>
  </div>
  
</template>

<script setup>
import { usePillNotify } from "@/store/pill";
import { defineProps } from 'vue'
/* SUPABASE */
const supabase = useSupabaseClient()
/* PROPS */
const props = defineProps(['clientToRemove'])
/* EMITS */
const emit = defineEmits(['saved'])
/* COMPOSABLES */
const pillNotify = usePillNotify()
const { newSuccessMessage, newErrorMessage } = pillNotify
/* DATA */
const removingClientDialog = ref(false)

async function remove(){
  let editingClientname = `${props.clientToRemove.name} ${props.clientToRemove.surname}`
  try {
    let { error } = await supabase
                        .from('clients')
                        .delete()
                        .eq('id', props.clientToRemove.id);
    if(error) throw error
    newSuccessMessage(`${editingClientname} è stato rimosso dal database (operazione irrevocabile)`);
    removingClientDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELLA RIMOZIONE A DB DI ${editingClientname} : ${error.message}`)
  }
}

async function unsubscribe(){
  let editingClientname = `${props.clientToRemove.name} ${props.clientToRemove.surname}`
  try {
    let { error } = await supabase
                          .from('clients')
                          .update({ status: 2 })
                          .eq('id', props.clientToRemove.id);
    if(error) throw error
    newSuccessMessage(`${editingClientname} è stato correttamente disiscritto (i dati rimarranno salvati)`);
    removingClientDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELLA DISISCRIZIONE DI ${editingClientname} : ${error.message}`)
  }
}

const checkNewStatus = async function(){
  let newClientStatus = 0;
  try {
    let client_id_param = props.clientToRemove.id
    let { data, error } = await supabase.rpc('get_incomplete_payments', { client_id_param })
    if(error) throw error
    if(data.length == 0)
      newClientStatus = 0
    else newClientStatus = 1
  } catch (error) {
    newErrorMessage(`ERRORE NEL CALCOLO DEL NUOVO STATUS`)
  }
  return newClientStatus
}

const reactivate = async function(){
  let editingClientname = `${props.clientToRemove.name} ${props.clientToRemove.surname}`
  
  let newStatus = await checkNewStatus()
  try {
    let { error } = await supabase
                          .from('clients')
                          .update({ status: newStatus })
                          .eq('id', props.clientToRemove.id);
    if(error) throw error
    newSuccessMessage(`${editingClientname} è stato correttamente riattivato`);
    removingClientDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELLA RIATTIVAZIONE DI ${editingClientname} : ${error.message}`)
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