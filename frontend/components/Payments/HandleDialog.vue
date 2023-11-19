<template>
    <Dialog
        :visible="visible"
        modal
        :header="`Gestisci il pagamento di ${user.name} ${user.surname}:`"
        :style="{ width: '50vw' }"
    >
        <div class="grid grid-rows-4 grid-cols-3 gap-10 p-10">
            <span v-if="!instanceId && suggestedPayments.length > 0" class="p-float-label col-start-1 col-end-4">
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
                <Dropdown v-model="selectedActivity" :disabled="instanceId != null" :showClear="instanceId == null" :options="activitiesList" class="w-full">
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
                <Checkbox v-model="otherActivity" :disabled="instanceId != null" :binary="true" />
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
import { usePillNotify } from "@/store/pill";
import { isClient, isCollaborator, userTypes } from "@/assets/enums/UserType"
import { ClientApi } from "@/backend/api/clients"
import { CollaboratorApi } from "@/backend/api/collaborators"
import { PaymentsApi } from "@/backend/api/payments"

const { reloadApp, formatDateMonthYear } = utility()
const pillNotify = usePillNotify()
const { newSuccessMessage, newErrorMessage } = pillNotify

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
    user: {
        type: Object,
        required: true
    },
    instanceId: {
        type: Number,
        required: false,
        default: null
    },
    userType: {
        type: Number,
        required: true
    }
})

/* DATA */
const suggestedPayments = ref([])
const selectedPayment = ref()
const selectedActivity = ref()
const activitiesList= ref([])
const otherActivity = ref(false)
/* EMITS */
const emits = defineEmits(["close", "save"])

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

watch(() => props.instanceId, () => {
        autoSetActivity()
    },
    { 
        deep: true
    }
)

watch(() => selectedPayment.value, (newValue) => {
    if(newValue != null){
        selectedActivity.value = null
        paymentStore.setNewGainFromClient(props.user.id, newValue)
        paymentStore.payment.amount = newValue.amount_required
        paymentStore.payment.amount_required = newValue.amount_required
        paymentStore.payment.id = newValue.id
    }
})
watch(() => selectedActivity.value, (newValue) => {
    if(newValue != null){
        selectedPayment.value = null
        otherActivity.value = false
        paymentStore.setNewGainFromClient(props.user.id)
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
    if(isClient(props.userType)) {
        suggestedPayments.value = await ClientApi.getSuggestedPayments(props.user.id)
    }
}

const saveEditedPayment = async function(){
    PaymentsApi.saveEditedPayment(paymentStore.payment)
    paymentStore.resetPayment()
    emits("save")
    getLists()
}

const getActivitiesList = async function(){
    if(isClient(props.userType)) {
        activitiesList.value = await ClientApi.getActivitiesList(props.user.id)
    } else if(isCollaborator(props.userType)){
        activitiesList.value = await CollaboratorApi.getActivitiesList(props.user.id)
    }
    autoSetActivity()
}

const autoSetActivity = function(){
    if(props.instanceId != null) selectedActivity.value = activitiesList.value.find((act) => {
        return act.instances.id == props.instanceId
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
onMounted(() => {
    console.log('FANCULO');
    getLists()
})
</script>backend/api/clientsbackend/api/collaboratorsbackend/api/payments