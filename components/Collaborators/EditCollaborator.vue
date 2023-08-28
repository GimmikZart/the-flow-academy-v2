<template>
  <div>
    <Button size="1rem" severity="warning" rounded text @click="editingCollaboratorDialog = true">
      <Icon name="material-symbols:edit" size="2rem" color="orange" />
    </Button>
    <Dialog :visible="editingCollaboratorDialog" modal header="Modifica Socio" :style="{ width: '50vw' }">
      <div class="grid grid-rows-10 grid-cols-4 gap-10 p-10">
        <span class="p-float-label p-input-icon-left col-span-full">
          <Icon name="radix-icons:avatar" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.avatar" placeholder="Link Foto" class="w-full"></InputText>
          <label for="birth_date">Link Foto</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.name" placeholder="Nome" class="w-full"></InputText>
          <label>Nome</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="clarity:avatar-line" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.surname" placeholder="Cognome" class="w-full"></InputText>
          <label>Cognome</label>
        </span>

        <ToggleButton v-model="copyOfCollaborator.value.gender" onLabel="Maschio" offLabel="Femmina" id="toggleGender">
          <template #icon="slotProps">
            <Icon v-if="slotProps.value == true" name="icon-park-solid:boy-one" color="blue"></Icon>
            <Icon v-else name="icon-park-solid:girl-one" color="red"></Icon>
          </template>
        </ToggleButton>
          
        <span class="p-float-label p-input-icon-left col-span-3">
          <Icon name="mdi:address-marker-outline" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.address" placeholder="Indirizzo" class="w-full"></InputText>
          <label>Indirizzo</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="entypo:email" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.email" placeholder="Email" class="w-full"></InputText>
          <label>Email</label>
        </span>
        <span class="p-float-label p-input-icon-left col-span-2">
          <Icon name="bi:telephone" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.telephone" placeholder="Telefono" class="w-full"></InputText>
          <label>Telefono</label>
        </span>
        <span class="p-float-label col-span-2">
          <Calendar v-model="copyOfCollaborator.value.dateOfBirth" placeholder="Data di nascita" dateFormat="dd/mm/yy" class="w-full" />
          <label>Data di nascita</label>
        </span> 
        <span class="p-float-label col-span-2">
          <Calendar v-model="copyOfCollaborator.value.firstContact" placeholder="Primo Contatto" dateFormat="dd/mm/yy" class="w-full" />
          <label>Primo Contatto</label>
        </span>

        <Textarea v-model="copyOfCollaborator.value.description" placeholder="Descrizione Collaboratore" class="col-start-1 col-end-5"></Textarea>

        <span class="p-float-label p-input-icon-left col-start-1 col-end-1">
          <Icon name="mingcute:hat-2-line" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.sizes.head" placeholder="Misura cappello" class="w-full"/>
          <label>Misura cappello</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-2 col-end-2">
          <Icon name="ion:shirt-outline" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.sizes.shirt" placeholder="Misura maglietta" class="w-full"/>
          <label>Misura maglietta</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-3 col-end-3">
          <Icon name="ph:pants-thin" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.sizes.pants" placeholder="Misura pantaloni" class="w-full"/>
          <label>Misura pantaloni</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-4 col-end-4">
          <Icon name="mingcute:shoe-line" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.sizes.shoes" placeholder="Misura scarpe" class="w-full"/>
          <label>Misura scapre</label>
        </span>

        <span class="p-float-label p-input-icon-left col-start-1 col-end-3">
          <Icon name="ic:baseline-facebook" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.linkSocial.fb" placeholder="Facebook" class="w-full"></InputText>
          <label>Facebook</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-3 col-end-5">
          <Icon name="mdi:instagram" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.linkSocial.ig" placeholder="Instagram" class="w-full"></InputText>
          <label>Instagram</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-1 col-end-3">
          <Icon name="mdi:linkedin" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.linkSocial.ln" placeholder="Linkedin" class="w-full"></InputText>
          <label>Linkedin</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-3 col-end-5">
          <Icon name="ic:baseline-tiktok" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.linkSocial.tk" placeholder="TikTok" class="w-full"></InputText>
          <label>TikTok</label>
        </span>
        <span class="p-float-label p-input-icon-left col-start-2 col-end-4">
          <Icon name="mdi:web" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.linkSocial.web" placeholder="Sito web" class="w-full"></InputText>
          <label>Sito Web</label>
        </span>

        <span class="p-float-label p-input-icon-left col-span-4">
          <Icon name="uil:notes" size="20px"></Icon>
          <InputText v-model="copyOfCollaborator.value.notes" placeholder="Note" class="w-full"></InputText>
          <label>Note</label>
        </span>
      </div>
      <template #footer>
        <Button label="Chiudi" @click="editingCollaboratorDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveEditingCollaborator()" outlined />
      </template>
    </Dialog>
  </div>
  
</template>

<script setup>
import { useFiltersStore } from "@/store/pill";
import Collaborator from '@/assets/entities/collaborator.js';
//import { onBeforeMount  } from 'vue';
import { defineProps, watch } from 'vue'
/* PROPS */
const props = defineProps(['editingCollaborator'])
/* EMITS */
const emit = defineEmits(['saved'])
/* COMPOSABLES */
const { editCollaborator } = setCollaboratorsApi() // auto-imported
const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore
const { formatDate, deepCopy, convertUndefinedToNull} = utility()
/* DATA */
const editingCollaboratorDialog = ref(false)
const copyOfCollaborator = reactive({value: new Collaborator()})

async function saveEditingCollaborator(){
  let editingCollaboratorname = `${copyOfCollaborator.value.name} ${copyOfCollaborator.value.surname}`
  try {
    let cleanedCollaboratorFromUndefined = convertUndefinedToNull(copyOfCollaborator.value)
    await editCollaborator(cleanedCollaboratorFromUndefined);
    newSuccessMessage(`${editingCollaboratorname} è stato modificato nel database`);
    editingCollaboratorDialog.value = false
    emit('saved')
  } catch (error) {
    console.log({error});
    newErrorMessage(`ERRORE NELLA MODIFICA A DB DI ${editingCollaboratorname} : ${error}`)
  }
}

watch(() => props.editingCollaborator, () => {
  console.log('wooooo');
  setCollaboratorToEdit()
});

const setCollaboratorToEdit = () => {
  console.log('CAAAAAMBIOOOOOO');
  console.log(props.editingCollaborator);
  copyOfCollaborator.value = deepCopy(props.editingCollaborator)
  if (copyOfCollaborator.value.dateOfBirth != null) {
    copyOfCollaborator.value.dateOfBirth = new Date(copyOfCollaborator.value.dateOfBirth.seconds * 1000)
  }  else {
    copyOfCollaborator.value.dateOfBirth = undefined
  }
  if(copyOfCollaborator.value.firstContact != null){
    copyOfCollaborator.value.firstContact = new Date(copyOfCollaborator.value.firstContact.seconds * 1000)
  } else {
    copyOfCollaborator.value.firstContact = undefined
  }
  
}

/* HOOKS */ 
onBeforeMount(async () => {
  setCollaboratorToEdit()
  })
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