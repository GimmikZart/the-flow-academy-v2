<template>
  <div>
    <Button size="small" severity="success" rounded class="mx-3" @click="addClientDialog = true">
      <Icon name="mdi:add-bold" color="white" />
    </Button>
    <Dialog :visible="addClientDialog" modal header="Aggiungi Socio" :style="{ width: '50vw', maxHeight: '70vh' }">
      <div class="grid grid-rows-10 grid-cols-4 gap-10 p-10">
        <span class="p-float-label p-input-icon-left col-span-full">
          <Icon name="radix-icons:avatar" size="20px"></Icon>
          <InputText v-model="newClient.avatar" placeholder="Link Foto" class="w-full"></InputText>
          <label for="birth_date">Link Foto</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="newClient.name" placeholder="Nome" class="w-full"></InputText>
          <label>Nome</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="newClient.surname" placeholder="Cognome" class="w-full"></InputText>
          <label>Cognome</label>
        </span>

        <ToggleButton v-model="newClient.gender" onLabel="Maschio" offLabel="Femmina" id="toggleGender">
          <template #icon="slotProps">
            <Icon v-if="slotProps.value == true" name="icon-park-solid:boy-one" color="blue"></Icon>
            <Icon v-else name="icon-park-solid:girl-one" color="red"></Icon>
          </template>
        </ToggleButton>
          
        <span class="p-float-label p-input-icon-left col-span-3">
          <Icon name="mdi:address-marker-outline" size="20px"></Icon>
          <InputText v-model="newClient.address" placeholder="Indirizzo" class="w-full"></InputText>
          <label>Indirizzo</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="entypo:email" size="20px"></Icon>
          <InputText v-model="newClient.email" placeholder="Email" class="w-full"></InputText>
          <label>Email</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="bi:telephone" size="20px"></Icon>
          <InputText v-model="newClient.telephone" placeholder="Telefono" class="w-full"></InputText>
          <label>Telefono</label>
        </span>
        <span class="p-float-label col-span-2">
          <Calendar v-model="newClient.dateOfBirth" placeholder="Data di nascita" dateFormat="dd/mm/yy" class="w-full" />
          <label>Data di nascita</label>
        </span>
        <span class="p-float-label col-span-2">
          <Calendar v-model="newClient.firstContact" placeholder="Primo Contatto" dateFormat="dd/mm/yy" class="w-full" />
          <label>Primo Contatto</label>
        </span>

        <span class="p-float-label p-input-icon-left col-start-1 col-end-1">
          <Icon name="mingcute:hat-2-line" size="20px"></Icon>
          <InputText v-model="newClient.sizes.head" placeholder="Misura cappello" class="w-full"/>
          <label>Misura cappello</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-2 col-end-2">
          <Icon name="ion:shirt-outline" size="20px"></Icon>
          <InputText v-model="newClient.sizes.shirt" placeholder="Misura maglietta" class="w-full"/>
          <label>Misura maglietta</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-3 col-end-3">
          <Icon name="ph:pants-thin" size="20px"></Icon>
          <InputText v-model="newClient.sizes.pants" placeholder="Misura pantaloni" class="w-full"/>
          <label>Misura pantaloni</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-4 col-end-4">
          <Icon name="mingcute:shoe-line" size="20px"></Icon>
          <InputText v-model="newClient.sizes.shoes" placeholder="Misura scarpe" class="w-full"/>
          <label>Misura scapre</label>
        </span>


        <span class="p-float-label p-input-icon-left col-span-4">
          <Icon name="uil:notes" size="20px"></Icon>
          <InputText v-model="newClient.notes" placeholder="Note" class="w-full"></InputText>
          <label>Note</label>
        </span>
      </div>
      <template #footer>
        <Button label="Chiudi" @click="addClientDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveNewClient()" outlined />
      </template>
    </Dialog>
  </div>
  
</template>

<script setup>
import { usePillNotify } from "@/store/pill";
import Client from '@/assets/entities/client.js';
const supabase = useSupabaseClient()
const emit = defineEmits(['saved'])
const pillNotify = usePillNotify()
const { newSuccessMessage, newErrorMessage } = pillNotify

const newClient = reactive(new Client());
const addClientDialog = ref(false)

async function saveNewClient(){
  let newClientname = `${newClient.name} ${newClient.surname}`
  try {
    let { error } = await supabase.from("clients").insert(newClient);
    if(error) throw error
    newSuccessMessage(`${newClientname} è stato aggiunto al database`);
    newClient.reset();
    addClientDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELL INSERIMENTO A DB DI ${newClientname} : ${error.message}`)
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