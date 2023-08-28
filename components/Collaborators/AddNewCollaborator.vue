<template>
  <div>
    <Button size="small" severity="success" rounded class="mx-3" @click="addCollaboratorDialog = true">
      <Icon name="mdi:add-bold" color="white" />
    </Button>
    <Dialog :visible="addCollaboratorDialog" modal header="Aggiungi Collaboratore" :style="{ width: '50vw' }">
      <div class="grid grid-rows-10 grid-cols-4 gap-7 p-10">

        
        <span class="p-float-label p-input-icon-left col-start-1 col-end-3">
          <Icon name="radix-icons:avatar" size="20px"></Icon>
          <InputText v-model="newCollaborator.avatar" disabled placeholder="Link Foto" class="w-full"></InputText>
          <label>Link Foto</label>
        </span>

        
        <MultiSelect v-model="newCollaborator.roles" :options="roleOptions" optionLabel="Ruoli" placeholder="Seleziona ruoli" class="col-start-3 col-end-5"></MultiSelect>

  
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="newCollaborator.name" placeholder="Nome" class="w-full"></InputText>
          <label>Nome</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="newCollaborator.surname" placeholder="Cognome" class="w-full"></InputText>
          <label>Cognome</label>
        </span>

        <ToggleButton v-model="newCollaborator.gender" onLabel="Maschio" offLabel="Femmina" id="toggleGender">
          <template #icon="slotProps">
            <Icon v-if="slotProps.value == true" name="icon-park-solid:boy-one" color="blue"></Icon>
            <Icon v-else name="icon-park-solid:girl-one" color="red"></Icon>
          </template>
        </ToggleButton>
          
        <span class="p-float-label p-input-icon-left col-span-3">
          <Icon name="mdi:address-marker-outline" size="20px"></Icon>
          <InputText v-model="newCollaborator.address" placeholder="Indirizzo" class="w-full"></InputText>
          <label>Indirizzo</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="entypo:email" size="20px"></Icon>
          <InputText v-model="newCollaborator.email" placeholder="Email" class="w-full"></InputText>
          <label>Email</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="bi:telephone" size="20px"></Icon>
          <InputText v-model="newCollaborator.telephone" placeholder="Telefono" class="w-full"></InputText>
          <label>Telefono</label>
        </span>
        <span class="p-float-label col-span-2">
          <Calendar v-model="newCollaborator.dateOfBirth" placeholder="Data di nascita" dateFormat="dd/mm/yy" class="w-full" />
          <label>Data di nascita</label>
        </span>
        <span class="p-float-label col-span-2">
          <Calendar v-model="newCollaborator.firstContact" placeholder="Primo Contatto" dateFormat="dd/mm/yy" class="w-full" />
          <label>Primo Contatto</label>
        </span>

        <Textarea v-model="newCollaborator.description" placeholder="Descrizione Collaboratore" class="col-start-1 col-end-5"></Textarea>

        <span class="p-float-label p-input-icon-left col-start-1 col-end-1">
          <Icon name="mingcute:hat-2-line" size="20px"></Icon>
          <InputText v-model="newCollaborator.sizes.head" placeholder="Misura cappello" class="w-full"/>
          <label>Misura cappello</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-2 col-end-2">
          <Icon name="ion:shirt-outline" size="20px"></Icon>
          <InputText v-model="newCollaborator.sizes.shirt" placeholder="Misura maglietta" class="w-full"/>
          <label>Misura maglietta</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-3 col-end-3">
          <Icon name="ph:pants-thin" size="20px"></Icon>
          <InputText v-model="newCollaborator.sizes.pants" placeholder="Misura pantaloni" class="w-full"/>
          <label>Misura pantaloni</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-4 col-end-4">
          <Icon name="mingcute:shoe-line" size="20px"></Icon>
          <InputText v-model="newCollaborator.sizes.shoes" placeholder="Misura scarpe" class="w-full"/>
          <label>Misura scapre</label>
        </span>

        <span class="p-float-label p-input-icon-left col-start-1 col-end-3">
          <Icon name="ic:baseline-facebook" size="20px"></Icon>
          <InputText v-model="newCollaborator.linkSocial.fb" placeholder="Facebook" class="w-full"></InputText>
          <label>Facebook</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-3 col-end-5">
          <Icon name="mdi:instagram" size="20px"></Icon>
          <InputText v-model="newCollaborator.linkSocial.ig" placeholder="Instagram" class="w-full"></InputText>
          <label>Instagram</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-1 col-end-3">
          <Icon name="mdi:linkedin" size="20px"></Icon>
          <InputText v-model="newCollaborator.linkSocial.ln" placeholder="Linkedin" class="w-full"></InputText>
          <label>Linkedin</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-3 col-end-5">
          <Icon name="ic:baseline-tiktok" size="20px"></Icon>
          <InputText v-model="newCollaborator.linkSocial.tk" placeholder="TikTok" class="w-full"></InputText>
          <label>TikTok</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-2 col-end-4">
          <Icon name="mdi:web" size="20px"></Icon>
          <InputText v-model="newCollaborator.linkSocial.web" placeholder="Sito web" class="w-full"></InputText>
          <label>Sito Web</label>
        </span>

        <span class="p-float-label p-input-icon-left col-span-4">
          <Icon name="uil:notes" size="20px"></Icon>
          <InputText v-model="newCollaborator.notes" placeholder="Note" class="w-full"></InputText>
          <label>Note</label>
        </span>
      </div>
      <template #footer>
        <Button label="Chiudi" @click="addCollaboratorDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveNewCollaborator()" outlined />
      </template>
    </Dialog>
  </div>
  
</template>

<script setup>
import { useFiltersStore } from "@/store/pill";
import Collaborator from '@/assets/entities/collaborator.js';
const emit = defineEmits(['saved'])
const { addCollaborator } = setCollaboratorsApi() // auto-imported
const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore

const newCollaborator = reactive(new Collaborator());
const addCollaboratorDialog = ref(false)
const roleOptions = ref([])

async function saveNewCollaborator(){
  let newCollaboratorname = `${newCollaborator.name} ${newCollaborator.surname}`
  try {
    await addCollaborator(newCollaborator);
    newSuccessMessage(`${newCollaboratorname} è stato aggiunto al database`);
    newCollaborator.reset();
    addCollaboratorDialog.value = false
    emit('saved')
    
    
  } catch (error) {
    newErrorMessage(`ERRORE NELL INSERIMENTO A DB DI ${newCollaboratorname} : ${error}`)
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