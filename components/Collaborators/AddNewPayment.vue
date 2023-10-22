<template>
  <div>
    <Button text rounded color="green" size="1rem" @click="addPaymentDialog = true">
      <Icon name="ph:hand-coins" size="2rem" color="red"></Icon>
    </Button>
    <Dialog :visible="addPaymentDialog" modal :header="`Stai pagando a ${editingCollaborator.name} ${editingCollaborator.surname}:`" :style="{ width: '30vw' }">
      <div class="grid grid-rows-3 grid-cols-2 gap-10 p-10">
        <span class="p-float-label col-start-1 col-end-2">
          <InputNumber v-model="newPayment.amount" mode="currency" currency="EUR" locale="it-IT" placeholder="Un ammontare di" :minFractionDigits="2" dateFormat="dd/mm/yy" class="w-full"/>
          <label>Un ammontare di</label>
        </span>
        <span class="p-float-label col-start-2 col-end-3">
          <Calendar v-model="newPayment.date" placeholder="Data Pagamento" dateFormat="dd/mm/yy" class="w-full"/>
          <label>In data</label>
        </span>

        <span class="p-float-label col-start-1 col-end-3">
          <MultiSelect v-model="newPayment.activities" class="w-full" placeholder="Per le seguenti attività"></MultiSelect>
          <label>Per le seguenti attività</label>
        </span>

        <span class="p-float-label col-start-1 col-end-3">
          <InputText v-model="newPayment.notes" class="w-full"></InputText>
          <label>Note aggiuntive</label>
        </span>
      </div>
      
      <template #footer>
        <Button label="Chiudi" @click="addPaymentDialog = false" outlined />
        <Button label="Salva" severity="success" @click="saveNewPayment()" outlined />
      </template>
    </Dialog>
  </div>
  
</template>

<script setup>
import { useFiltersStore } from "@/store/pill";
import Payment from '@/assets/entities/payment.js';
/* PROPS */
const props = defineProps(['editingCollaborator'])
/* EMITS */
const emit = defineEmits(['saved'])
/* COMPOSABLES */
/* RESPONSE */
const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore

/* DATA */
const newPayment = reactive(new Payment().toCollaborator(props.editingCollaborator.id));
const addPaymentDialog = ref(false)

async function saveNewPayment(){
  let collaboratorName = `${props.editingCollaborator.name} ${props.editingCollaborator.surname}`
  try {
    newSuccessMessage(`Il pagamento di ${collaboratorName} è stato registrato`);
    newPayment.reset();
    addPaymentDialog.value = false
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELL INSERIMENTO A DB DI ${collaboratorName} : ${error}`)
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