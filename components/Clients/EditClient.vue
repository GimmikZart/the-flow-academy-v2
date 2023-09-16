<template>
  <div>
    <Button size="1rem" severity="warning" rounded text @click="editingClientDialog = true">
      <Icon name="material-symbols:edit" size="2rem" color="orange" />
    </Button>
    <Dialog :visible="editingClientDialog" modal header="Modifica Socio" :style="{ width: '50vw', maxHeight: '70vh' }">
      <div class="grid grid-rows-10 grid-cols-4 gap-10 p-10">
        <span class="p-float-label p-input-icon-left col-span-full">
          <Icon name="radix-icons:avatar" size="20px"></Icon>
          <InputText v-model="editingClient.value.avatar" placeholder="Link Foto" class="w-full"></InputText>
          <label for="birth_date">Link Foto</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="editingClient.value.name" placeholder="Nome" class="w-full"></InputText>
          <label>Nome</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="editingClient.value.surname" placeholder="Cognome" class="w-full"></InputText>
          <label>Cognome</label>
        </span>

        <ToggleButton v-model="editingClient.value.gender" onLabel="Maschio" offLabel="Femmina" id="toggleGender">
          <template #icon="slotProps">
            <Icon v-if="slotProps.value == true" name="icon-park-solid:boy-one" color="blue"></Icon>
            <Icon v-else name="icon-park-solid:girl-one" color="red"></Icon>
          </template>
        </ToggleButton>
          
        <span class="p-float-label p-input-icon-left col-span-3">
          <Icon name="mdi:address-marker-outline" size="20px"></Icon>
          <InputText v-model="editingClient.value.address" placeholder="Indirizzo" class="w-full"></InputText>
          <label>Indirizzo</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="entypo:email" size="20px"></Icon>
          <InputText v-model="editingClient.value.email" placeholder="Email" class="w-full"></InputText>
          <label>Email</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="bi:telephone" size="20px"></Icon>
          <InputText v-model="editingClient.value.telephone" placeholder="Telefono" class="w-full"></InputText>
          <label>Telefono</label>
        </span>
        <span class="p-float-label col-span-2">
          <Calendar v-model="editingClient.value.dateOfBirth" placeholder="Data di nascita" dateFormat="dd/mm/yy" class="w-full" />
          <label>Data di nascita</label>
        </span> 
        <span class="p-float-label col-span-2">
          <Calendar v-model="editingClient.value.firstContact" placeholder="Primo Contatto" dateFormat="dd/mm/yy" class="w-full" />
          <label>Primo Contatto</label>
        </span>

        <span class="p-float-label p-input-icon-left col-start-1 col-end-1">
          <Icon name="mingcute:hat-2-line" size="20px"></Icon>
          <InputText v-model="editingClient.value.sizes.head" placeholder="Misura cappello" class="w-full"/>
          <label>Misura cappello</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-2 col-end-2">
          <Icon name="ion:shirt-outline" size="20px"></Icon>
          <InputText v-model="editingClient.value.sizes.shirt" placeholder="Misura maglietta" class="w-full"/>
          <label>Misura maglietta</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-3 col-end-3">
          <Icon name="ph:pants-thin" size="20px"></Icon>
          <InputText v-model="editingClient.value.sizes.pants" placeholder="Misura pantaloni" class="w-full"/>
          <label>Misura pantaloni</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-4 col-end-4">
          <Icon name="mingcute:shoe-line" size="20px"></Icon>
          <InputText v-model="editingClient.value.sizes.shoes" placeholder="Misura scarpe" class="w-full"/>
          <label>Misura scapre</label>
        </span>


        <span class="p-float-label p-input-icon-left col-span-4">
          <Icon name="uil:notes" size="20px"></Icon>
          <InputText v-model="editingClient.value.notes" placeholder="Note" class="w-full"></InputText>
          <label>Note</label>
        </span>
      </div>
      <template #footer>
        <Button label="Chiudi" @click="editingClientDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveEditingClient()" outlined />
      </template>
    </Dialog>
  </div>
  
</template>

<script setup>
import { useFiltersStore } from "@/store/pill";
import Client from '@/assets/entities/client.js';
import { defineProps, watch } from 'vue'
/* SUPABASE */
  const supabase = useSupabaseClient()
/* PROPS */
  const props = defineProps(['clientId'])
/* EMITS */
  const emit = defineEmits(['saved'])
/* COMPOSABLES */
  const filtersStore = useFiltersStore()
  const { newSuccessMessage, newErrorMessage } = filtersStore
/* DATA */
  const editingClientDialog = ref(false)
  const editingClient = reactive({value: new Client()})
/* WATCH */
watch(editingClientDialog, async () => {
  await getClient()
})

/* METHODS */
async function saveEditingClient(){
  let editingClientName = `${editingClient.value.name} ${editingClient.value.surname}`
  try {
    let { error } =  await supabase.from('clients').update(editingClient.value).eq('id', props.clientId)
    if(error) throw error
    newSuccessMessage(`${editingClientName} è stato modificato nel database`);
    editingClientDialog.value = false
    emit('saved') 
  } catch (error) {
    newErrorMessage(`ERRORE NELLA MODIFICA A DB DI ${editingClientName} : ${error.message}`)
  }
}

async function getClient(){
  await supabase.from('clients').select('*').eq('id', props.clientId).single().then((result) => {
    editingClient.value = result.data
  })
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