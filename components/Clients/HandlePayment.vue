<template>
    <Dialog
        :visible="visible"
        modal
        :header="`Gestisci il pagamento di ${client.name} ${client.surname}:`"
        :style="{ width: '50vw' }"
    >
        <div class="grid grid-rows-4 grid-cols-3 gap-10 p-10">
            <!-- <span v-if="editMode" class="p-float-label col-start-1 col-end-3">
                <InputText v-model="instanceInfo" disabled class="w-full"/>
                <label>Per la seguente attività</label>
            </span> -->
            
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

            <span class="p-float-label col-start-1 col-end-3">
                <Dropdown v-model="selectedActivity" :disabled="editMode" :showClear="!editMode" :options="activitiesList" class="w-full">
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

            <span class="flex items-center col-start-3 col-end-4">
                <Checkbox v-model="otherActivity" :disabled="editMode" :binary="true" />
                <label for="ingredient1" class="ml-2 text-h2"> Altro </label>
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
                    dateFormat="dd/mm/yy"
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
            <Button label="Chiudi" @click="closeDialog()" outlined />
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
const otherActivity = ref(false)
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

watch(() => paymentStore.payment.amount_required, (newValue) => {
    if(newValue <= paymentStore.payment.amount) paymentStore.payment.status = true
    else paymentStore.payment.status = false
})

watch(() => paymentStore.payment.status, (newStatus) => {
    if(newStatus) paymentStore.payment.amount = paymentStore.payment.amount_required
    if(!newStatus) paymentStore.payment.amount == paymentStore.payment.amount_required ? paymentStore.payment.status = true : paymentStore.payment.status = false
})

watch(() => props.instance, () => {
        autoSetActivity()
    },
    { 
        deep: true
    }
)

watch(() => selectedPayment.value, (newValue) => {
    if(newValue != null){
        selectedActivity.value = null
        paymentStore.setNewGainFromClient(props.client.id, newValue)
        paymentStore.payment.amount = newValue.amount_required
        paymentStore.payment.amount_required = newValue.amount_required
        paymentStore.payment.id = newValue.id
    }
})
watch(() => selectedActivity.value, (newValue) => {
    if(newValue != null){
        selectedPayment.value = null
        otherActivity.value = false
        paymentStore.setNewGainFromClient(props.client.id)
        paymentStore.payment.amount = newValue.instances.cost
        paymentStore.payment.amount_required = newValue.instances.cost
        paymentStore.payment.instance_id = newValue.instances.id
        paymentStore.payment.date = null
    } else {
        otherActivity.value = true
    }
}, {immediate: true})

watch(() => otherActivity.value, (newValue) => {
    if(newValue) selectedActivity.value = null
})

/* METHODS */
async function getSuggestedPayments(){
    try {
        let client_id_param = props.client.id
        let { data, error } = await supabase.rpc('get_incomplete_payments', { client_id_param })
        if(error) throw error
        suggestedPayments.value = data
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
        emits("save")
        paymentStore.resetPayment()
        getLists()
        newSuccessMessage(`Pagamento andato a buon fine`)
    } catch (error) {
        newErrorMessage(`ERRORE NEL SALVATAGGIO DEL PAGAMENTO: ${error.message}`)
    }
}

const getActivitiesList = async function(){
    try {
        const { data, error } = await supabase.from("client_instance").select("instances(id, name, level, cost)").eq("client_id", props.client.id)
        if (error) throw error
        activitiesList.value = data
        autoSetActivity()
    } catch (error) {
        newErrorMessage(`ERRORE NELL'AQUISIZIONE DELLE ATTIVITA' LEGATE AL CLIENTE: ${error.message}`)
    }
}

const autoSetActivity = function(){
    if(props.instance != null) selectedActivity.value = activitiesList.value.find((act) => {
        return act.instances.id == props.instance.id
    }) 
}

const closeDialog = function(){
    paymentStore.resetPayment()
    emits('close')
}

const getLists = async function(){
    await getSuggestedPayments()
    await getActivitiesList()
}
/* ON CREATE */
getLists()
</script>
