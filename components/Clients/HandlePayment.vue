<template>
    <Dialog
        :visible="visible"
        modal
        :header="`Gestisci il pagamento di ${client.name} ${client.surname}:`"
        :style="{ width: '50vw' }"
    >
        <div class="grid grid-rows-4 grid-cols-3 gap-10 p-10">
            <span v-if="editMode" class="p-float-label col-start-1 col-end-3">
                <InputText v-model="instanceInfo" disabled class="w-full"/>
                <label>Per la seguente attività</label>
            </span>
            
            <span v-if="!editMode && suggestedPayments.length > 0" class="p-float-label col-start-1 col-end-4">
                <Dropdown v-model="selectedPayment" showClear :options="suggestedPayments" class="w-full">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex">
                            <h5 class="font-bold">{{ slotProps.value.instance_name }} | {{ slotProps.value.instance_level }} </h5>
                            <h5 v-if="slotProps.value.date" class="ml-1"> - {{ formatDateMonthYear(slotProps.value.date) }}</h5>
                        </div>
                    </template>
                    <template #option="slotProps">
                        <div class="flex flex-col align-items-center">
                            <h5 class="font-bold">{{ slotProps.option.instance_name }} | {{ slotProps.option.instance_level }}</h5>
                            <h5 v-if="slotProps.option.date">{{ formatDateMonthYear(slotProps.option.date) }}</h5>
                            <h6 v-if="slotProps.option.amount_required">da pagare: {{ paymentStore.getDifferenceOfPaymentEntity(slotProps.option) }}</h6>
                        </div>
                    </template>
                </Dropdown>
                <label>Pagamenti suggeriti</label>
            </span>

            <span v-if="!editMode" class="p-float-label col-start-1 col-end-4">
                <Dropdown v-model="selectedActivity" showClear :options="activitiesList" class="w-full">
                    <template #value="slotProps">
                        <div v-if="slotProps.value">
                            <h5>{{ slotProps.value.instances.name }} | {{ slotProps.value.instances.level }}</h5>
                        </div>
                    </template>
                    <template #option="slotProps">
                        <div class="flex flex-col align-items-center">
                            <h5 class="font-bold">{{ slotProps.option.instances.name }} | {{ slotProps.option.instances.level }}</h5>
                        </div>
                    </template>
                </Dropdown>
                <label>Lista Attività</label>
            </span>

            <span class="p-float-label col-start-1 col-end-1">
                <InputNumber
                    v-model="paymentStore.payment.amount"
                    mode="currency"
                    currency="EUR"
                    locale="it-IT"
                    placeholder="Un ammontare di"
                    :minFractionDigits="2"
                    dateFormat="dd/mm/yy"
                    class="w-full"
                />
                <label>Un ammontare di</label>
            </span>

            <span class="p-float-label col-start-2 col-end-2">
                <Calendar
                    v-model="paymentStore.payment.paid_in_date"
                    placeholder="Data Pagamento"
                    dateFormat="dd/mm/yy"
                    class="w-full"
                />
                <label>In data</label>
            </span>

            <span class="p-float-label col-start-3 col-end-3">
                <Calendar
                    v-model="paymentStore.payment.date"
                    placeholder="Mese di riferimento"
                    dateFormat="mm/yy"
                    class="w-full"
                />
                <label>Relativo al mese di</label>
            </span>

            <span class="p-float-label col-start-1 col-end-2">
                <InputNumber
                    v-model="paymentStore.payment.amount_required"
                    mode="currency"
                    currency="EUR"
                    locale="it-IT"
                    placeholder="Un ammontare di"
                    :minFractionDigits="2"
                    dateFormat="dd/mm/yy"
                    class="w-full"
                />
                <label>Su un totale dovuto di</label>
            </span>

            <span class="col-start-2 col-end-3">
                <ToggleButton v-model="paymentStore.payment.status" onLabel="Concluso" offLabel="Non concluso"  class="w-full"/>
                
            </span>

            <span class="p-float-label col-start-1 col-end-4">
                <InputText v-model="paymentStore.payment.notes" class="w-full"></InputText>
                <label>Note aggiuntive</label>
            </span>
        </div>
        <template #footer>
            <Button label="Chiudi" @click="emits('close')" outlined />
            <Button
                label="Salva"
                severity="success"
                @click="saveEditedPayment()"
                outlined
            />
        </template>
    </Dialog>
</template>
<script setup>
import { watch } from "vue"
import { usePaymentStore } from "@/store/payments"
import { useFiltersStore } from "@/store/pill";

const { reloadApp, formatDateMonthYear } = utility()
const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore

/* SUPABASE */
const supabase = useSupabaseClient()

/* STORE */
const paymentStore = usePaymentStore()

/* PROPS */
const props = defineProps({
    visible: {
        type: Boolean,
        required: false,
        default: false
    },
    client: {
        type: Object,
        required: true
    },
    instance: {
        type: Object,
        required: false,
        default: null
    },
    editMode: {
        type: Boolean,
        required: false,
        default: false
    }
})

/* DATA */
const suggestedPayments = ref([])
const selectedPayment = ref()
const selectedActivity = ref()
const activitiesList= ref()

/* EMITS */
const emits = defineEmits(["close", "save"])

/* COMPUTED */
const instanceInfo = computed(() => {
    if(props.instance){
        return `${ props.instance.name} - ${props.instance.level}`
    } else {
        return "ALTRO"
    }
})

/* WATCHERS */
watch(() => paymentStore.payment.amount, (newValue) => {
    if(newValue < paymentStore.payment.amount_required) paymentStore.payment.status = false
    else paymentStore.payment.status = true
})

watch(() => paymentStore.payment.status, (newStatus) => {
    if(newStatus) paymentStore.payment.amount_required = paymentStore.payment.amount
})

watch(() => selectedPayment.value, (newValue) => {
    if(newValue != null){
        selectedActivity.value = null
        console.log({newValue});
        paymentStore.payment.amount = newValue.amount_required
        paymentStore.payment.amount_required = newValue.amount_required
        paymentStore.payment.id = newValue.id
    }
})
watch(() => selectedActivity.value, (newValue) => {
    if(newValue != null){
        console.log({newValue});
        selectedPayment.value = null
        paymentStore.payment.amount = newValue.instances.cost
        paymentStore.payment.amount_required = newValue.instances.cost
        paymentStore.payment.instance_id = newValue.instances.id
    }
})

/* METHODS */
async function getSuggestedPayments(){
    try {
        let client_id_param = props.client.id
        let { data, error } = await supabase.rpc('get_incomplete_payments', { client_id_param })
        if(error) throw error
        suggestedPayments.value = data
        if(suggestedPayments.value.length > 0) selectedPayment.value = suggestedPayments.value[0] // auto seleziona il primo risultato se presente
    } catch (error) {
            newErrorMessage(`ERRORE NELL'AQUISIZIONE DEI PAGAMENTI SUGGERITI DAL DB: ${error.message}`)
    }
}

const saveEditedPayment = async function(){
    try {
        let payment_data = paymentStore.payment;
        console.log({payment_data});
        let { error } = await supabase.rpc('upsert_payment', { payment_data })
        if(error) throw error
        console.log('ora emit');
        emits("save")
        console.log({emits});
        console.log('EMIT AVVENUTO?');
    } catch (error) {
        newErrorMessage(`ERRORE NEL SALVATAGGIO DEL PAGAMENTO: ${error.message}`)
    }
}

const getActivitiesList = async function(){
    try {
        const { data, error } = await supabase.from("client_instance").select("instances(id, name, level, cost)").eq("client_id", props.client.id)
        if (error) throw error
        activitiesList.value = data
    } catch (error) {
        newErrorMessage(`ERRORE NELL'AQUISIZIONE DELLE ATTIVITA' LEGATE AL CLIENTE: ${error.message}`)
    }
}
/* ON CREATE */
getSuggestedPayments()
getActivitiesList()
</script>
