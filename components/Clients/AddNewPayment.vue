<template>
  <div>
    <Button text rounded color="green" size="1rem" @click="addPaymentDialog = true">
      <Icon name="ph:hand-coins" size="2rem" color="green"></Icon>
    </Button>
    <Dialog :visible="addPaymentDialog" modal :header="`${editingClient.name} ${editingClient.surname} sta pagando:`" :style="{ width: '30vw' }">
      <div class="grid grid-rows-3 grid-cols-2 gap-10 p-10">
        <span class="p-float-label col-start-1 col-end-3">
          <Dropdown v-model="selectedPayment" :options="suggestedPayments" class="w-full" placeholder="Per le seguenti attività">
            <template #value="slotProps">
              <h5 v-if="slotProps.value">{{ slotProps.value.instance_name }} / {{ formatDate(slotProps.value.date) }}</h5>
            </template>
            <template #option="slotProps">
              <div class="flex flex-col align-items-center">
                <h5 class="font-bold">{{ slotProps.option.instance_name }} / {{ formatDate(slotProps.option.date) }}</h5>
                <h6>da pagare: {{ slotProps.option.amount_required - slotProps.option.amount }}</h6>
              </div>
            </template>
          </Dropdown>
          <label>Per la seguente attività</label>
        </span>

        <span class="p-float-label col-start-1 col-end-2">
          <InputNumber v-model="newPayment.amount" mode="currency" currency="EUR" locale="it-IT" placeholder="Un ammontare di" :minFractionDigits="2" dateFormat="dd/mm/yy" class="w-full"/>
          <label>Un ammontare di</label>
        </span>

        <span class="p-float-label col-start-2 col-end-3">
          <Calendar v-model="newPayment.paid_in_date" placeholder="Data Pagamento" dateFormat="dd/mm/yy" class="w-full"/>
          <label>In data</label>
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
import { useDateFormat } from '@vueuse/core'
import { watch, ref } from 'vue'
/* PROPS */
const props = defineProps({
  editingClient: {
    type: Object,
    required: true
  }
}) 
/* SUPABASE */
const supabase = useSupabaseClient()
/* EMITS */
const emit = defineEmits(['saved'])
/* RESPONSE */
const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore

/* DATA */
const newPayment = ref(new Payment());
const addPaymentDialog = ref(false)
const suggestedPayments = ref([])
const selectedPayment = ref()

/* WATCH */
watch(selectedPayment, async (newSelectedPayment) => {
  if (newSelectedPayment && newSelectedPayment.id != null) {
    newPayment.value.id = newSelectedPayment.id
    newPayment.value.amount = newSelectedPayment.amount_required - newSelectedPayment.amount
    newPayment.value.client_id = newSelectedPayment.client_id
    newPayment.value.notes = newSelectedPayment.notes
  }
})

/* METHODS */
async function saveNewPayment(){
  let clientName = `${props.editingClient.name} ${props.editingClient.surname}`
  newPayment.value.fromClient(props.editingClient.id)
  let payment_data = newPayment.value.toPlainObject()
  try {
    let { error } = await supabase.rpc('upsert_payment', { payment_data })
    if (error) throw error
    newSuccessMessage(`Il pagamento di ${clientName} è stato registrato`);
    resetDialog()
    emit('saved')
  } catch (error) {
    newErrorMessage(`ERRORE NELL INSERIMENTO A DB DI ${clientName} : ${error}`)
  }
}

async function getSuggestedPayments(){
  try {
    let client_id_param = props.editingClient.id
    let { data, error } = await supabase.rpc('get_incomplete_payments', { client_id_param })
    if(error) throw error
    suggestedPayments.value = data
    if(suggestedPayments.value.length > 0) selectedPayment.value = suggestedPayments.value[0] // auto seleziona il primo risultato se presente
  } catch (error) {
    console.log(error.message);
    newErrorMessage(`ERRORE NELL'AQUISIZIONE DEI PAGAMENTI SUGGERITI DAL DB: ${error.message}`)
  }
}

const formatDate = function(date){
  let formattedData = useDateFormat(date, 'MMMM YYYY')
  return formattedData.value.toLocaleUpperCase();
}

const resetDialog = function(){
  newPayment.value.reset();
  addPaymentDialog.value = false
  selectedPayment.value = undefined
  getSuggestedPayments()
}

/* ON CREATE */
getSuggestedPayments()

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