<template>
  <div>
    <Button size="1rem" severity="warning" rounded text @click="removingCollaboratorDialog = true">
      <Icon name="material-symbols:delete" size="2rem" color="red" />
    </Button>
    <Dialog :visible="removingCollaboratorDialog" modal :header='`Rimuovi Socio`' :style="{ width: 'auto' }">
      <h3>Disiscrivere: "rimuove" il socio dalla lista dei soci attivi, ma mantiene i dati.</h3>
      <h3>Cancellare: elimina totalmente il socio dal database (l'operazione è irrevocabile)</h3>
      <template #footer>
        <Button label="Annulla" @click="removingCollaboratorDialog = false" outlined />
        <Button label="Disiscrivi" severity="warning" @click="unsubscribe()" />
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
const props = defineProps(['removingCollaborator'])
/* EMITS */
const emit = defineEmits(['saved'])
/* COMPOSABLES */
const pillNotify = usePillNotify()
const { newSuccessMessage, newErrorMessage } = pillNotify
/* DATA */
const removingCollaboratorDialog = ref(false)

async function remove(){
  let editingCollaboratorname = `${props.removingCollaborator.name} ${props.removingCollaborator.surname}`
  try {
    let { error } = await supabase
                        .from('collaborators')
                        .delete()
                        .eq('id', props.removingCollaborator.id);
    if(error) throw error
    newSuccessMessage(`${editingCollaboratorname} è stato rimosso dal database (operazione irrevocabile)`);
    removingCollaboratorDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELLA RIMOZIONE A DB DI ${editingCollaboratorname} : ${error.message}`)
  }
}

async function unsubscribe(){
  let editingCollaboratorname = `${props.removingCollaborator.name} ${props.removingCollaborator.surname}`
  try {
    let { error } = await supabase
                          .from('collaborators')
                          .update({ status: 2 })
                          .eq('id', props.removingCollaborator.id);
    if(error) throw error
    newSuccessMessage(`${editingCollaboratorname} è stato correttamente disiscritto (i dati rimarranno salvati)`);
    removingCollaboratorDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELLA DISISCRIZIONE A DB DI ${editingCollaboratorname} : ${error.message}`)
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