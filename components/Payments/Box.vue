<template>
    <!-- BOX -->
    <div class="relative">
        <div class="h-full w-[250px] rounded-lg overflow-hidden bg-white flex flex-col pb-3 smooth" :class="getComputedClass">
            <div class="w-full p-3" :class="cardColor">
                <h3 class="font-bold text-base text-center text-white">{{cardTitle}}</h3>
            </div>
            <div class="h-full overflow-hidden p-3">
                <div class="h-full overflow-auto ">
                    <template v-if="props.paymentInfo.instances">
                        <small>Per l'attività</small>
                        <div class="flex">
                            <h6 class="font-bold mr-1">{{ props.paymentInfo.instances.name }}</h6>
                            <span class="italic">({{ props.paymentInfo.instances.level }})</span>
                        </div>
                        
                        <small>Per il mese di</small>
                        <h6 class="font-bold">{{ formatDateMonthYear(props.paymentInfo.date) }}</h6>
                    </template>
                    
                    <template v-if="props.paymentInfo.amount > 0 && getDifferenceOfPaymentEntity(props.paymentInfo) > 0">
                        <small>Ricevuti</small>
                        <h6 class="font-bold">{{ props.paymentInfo.amount }}</h6>
                    </template>
                    <template v-if="props.paymentInfo.paid_in_date">
                        <small>In data</small>
                        <h6 class="font-bold">{{ formatDate(props.paymentInfo.paid_in_date) }}</h6>
                    </template>
                    <template v-if="props.paymentInfo.notes">
                        <small>Note</small>
                        <h6 class="font-bold">{{ props.paymentInfo.notes }}</h6>
                    </template>
                </div>
            </div>
            <div class="mx-3">
                <ClientsAddNewPayment v-if="!isFullPaid" :editingClient="clientInfo" :directPayment="paymentInfo" @saved="reloadApp()"></ClientsAddNewPayment>
                <div v-else class="rounded-lg flex items-center justify-center p-2" :class="cardColor">
                    <span class="w-1/3"></span>
                    <h3 class="w-1/3 font-bold text-xl text-center text-white">{{paymentInfo.amount}} €</h3>
                    <Icon name="mdi:check-bold" size="2rem" color="green" class="w-1/3"></Icon>
                </div>
            </div>
        </div>
        <Button v-if="editMode" rounded severity="warning" class="absolute bottom-3 absolute-center-y bg-white" @click="editPayment()">
            <template #icon>
                <Icon name="material-symbols:edit" color="white" size="30"></Icon>
            </template>
        </Button>
        <Button v-else-if="removeMode" rounded severity="danger" class="absolute bottom-3 absolute-center-y bg-white" @click="removeActivity()">
            <template #icon>
                <Icon name="material-symbols:delete" color="white" size="30"></Icon>
            </template>
        </Button>
    </div>


    <ClientsHandlePayment :visible="showDialog" :client="clientInfo" :instance="paymentInfo.instances" edit-mode @close="showDialog = false" @save="showDialog = false;emits('edited')"></ClientsHandlePayment>
</template>
<script setup>
import { ref, computed, watch } from "vue"
import { usePaymentStore } from "@/store/payments";
/* SUPABASE */
const supabase = useSupabaseClient()

/* UTILITY */
const { reloadApp, formatDateMonthYear,formatDate } = utility()
const { getDifferenceOfPaymentEntity } = paymentsUtils()

/* EMITS */
const emits = defineEmits(["edited"])

/* STORES */
const paymentStore = usePaymentStore()
/* PROPS */
const props = defineProps({
    paymentInfo: {
        type: Object,
        required: true
    },
    clientInfo: {
        type: Object,
        required: true
    },
    editMode: {
        type: Boolean,
        required: false,
        default: false
    },
    removeMode: {
        type: Boolean,
        required: false,
        default: false
    }
})

/* DATA */
const cardColor = ref("")
const cardTitle = ref("")
const paymentValue = ref()
const isFullPaid = ref(false)
const showDialog = ref(false)

/* WATCH */
watch(() => props.paymentInfo, () =>{
    setProperties()
},
{ deep: true }
)

/* COMPUTED */
const getComputedClass = computed(() => {
    let classes = ""
    if(props.editMode) classes += "flickering border-2 border-warning"
    if(props.removeMode) classes += "flickering border-2 border-danger"
    return classes
})

/* METHODS */
const setProperties = function(){
    if(props.paymentInfo.amount == 0 && !props.paymentInfo.status) {
        cardColor.value = "bg-hard-pink" 
        cardTitle.value = "DA RICEVERE"
        paymentValue.value = props.paymentInfo.amountRequired
    } else if(props.paymentInfo.amount < props.paymentInfo.amount_required && !props.paymentInfo.status) {
        cardColor.value = "bg-orange"
        cardTitle.value = "RICEVUTO PARZIALE" 
        paymentValue.value = props.paymentInfo.amountRequired - props.paymentInfo.amount
    } else {
        cardColor.value = "bg-green"
        cardTitle.value = "RICEVUTO"
        paymentValue.value = props.paymentInfo.amountRequired
        isFullPaid.value = true
    }
}

const removeActivity = async function(){
    try {
        const { error } = await supabase.from("payments").delete().eq('id', props.paymentInfo.id)
        if(error) throw error
        reloadApp()
    } catch (error) {
        console.log(error);
    }
}

const editPayment = function(){
    showDialog.value = true; 
    paymentStore.setNewGainFromClient(props.clientInfo.id, props.paymentInfo)
}

/* ON CREATE */
setProperties()

</script>
